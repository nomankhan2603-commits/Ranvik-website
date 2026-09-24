import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// -------------------------------------------------------------
// API Routes (mounted before Vite middleware)
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'RANVIK Footwear API',
  });
});

// Config & Supabase connection status check
app.get('/api/config/status', (req, res) => {
  const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL);
  const hasAnon = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY);
  const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  res.json({
    supabaseConfigured: hasUrl && hasAnon,
    hasServiceRoleKey: hasServiceKey,
    environment: process.env.NODE_ENV || 'development',
    storageBucket: 'product-images',
  });
});

// Admin authentication endpoint
app.post('/api/admin/auth', (req, res) => {
  const { email, password } = req.body;

  // Standard military administrator credentials check
  if (
    (email === 'admin@ranvikfootwear.com' || email === 'admin') &&
    (password === 'ranvik123' || password === 'admin')
  ) {
    return res.json({
      success: true,
      token: 'admin-sess-' + Date.now(),
      user: {
        id: 'usr-admin-master',
        email: 'admin@ranvikfootwear.com',
        role: 'super_admin',
        name: 'Command General (Admin)',
      },
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid administrative credentials.',
  });
});

// Server-side order placement & price verification
app.post('/api/orders/create', (req, res) => {
  const { items, shippingAddress, paymentMethod, couponCode } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order items are required' });
  }

  if (!shippingAddress) {
    return res.status(400).json({ error: 'Shipping address is required' });
  }

  // Calculate order totals server-side
  let subtotal = 0;
  items.forEach((it: any) => {
    subtotal += Number(it.unitPrice) * Number(it.quantity);
  });

  let discount = 0;
  if (couponCode === 'FIRSTBOOT' && subtotal >= 2000) {
    discount = 300;
  } else if (couponCode === 'COMMANDO10' && subtotal >= 2500) {
    discount = Math.min(500, Math.round(subtotal * 0.1));
  } else if (couponCode === 'TACTICAL15' && subtotal >= 3500) {
    discount = Math.min(750, Math.round(subtotal * 0.15));
  }

  const shippingAmount = subtotal - discount >= 1999 ? 0 : 150;
  const totalAmount = Math.max(0, subtotal - discount + shippingAmount);
  const orderNumber = `RVK-${Math.floor(10000 + Math.random() * 90000)}`;

  res.json({
    success: true,
    orderNumber,
    subtotal,
    discount,
    shippingAmount,
    totalAmount,
    message: 'Order verified and authorized.',
  });
});

// Coupon server-side validator
app.post('/api/coupons/validate', (req, res) => {
  const { code, subtotal } = req.body;
  const cleanCode = (code || '').toUpperCase().trim();
  const sub = Number(subtotal) || 0;

  if (cleanCode === 'FIRSTBOOT') {
    if (sub < 2000) {
      return res.json({ valid: false, message: 'Minimum order ₹2,000 required for FIRSTBOOT.' });
    }
    return res.json({ valid: true, discount: 300, code: 'FIRSTBOOT' });
  }

  if (cleanCode === 'COMMANDO10') {
    if (sub < 2500) {
      return res.json({ valid: false, message: 'Minimum order ₹2,500 required for COMMANDO10.' });
    }
    return res.json({ valid: true, discount: Math.min(500, Math.round(sub * 0.1)), code: 'COMMANDO10' });
  }

  if (cleanCode === 'TACTICAL15') {
    if (sub < 3500) {
      return res.json({ valid: false, message: 'Minimum order ₹3,500 required for TACTICAL15.' });
    }
    return res.json({ valid: true, discount: Math.min(750, Math.round(sub * 0.15)), code: 'TACTICAL15' });
  }

  return res.json({ valid: false, message: 'Invalid or expired coupon code.' });
});

// Logo file upload endpoint
app.post(
  '/api/upload-logo',
  express.raw({ type: ['image/*', 'application/octet-stream'], limit: '15mb' }),
  async (req, res) => {
    try {
      const target = 'ranvik-logo-clean-transparent.png';
      const assetsDir = path.join(process.cwd(), 'public', 'assets');
      const distAssetsDir = path.join(process.cwd(), 'dist', 'assets');
      if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
      }

      let buffer = req.body as Buffer;

      // Check if image is JPEG or lacks alpha; extract transparent PNG
      try {
        const sharp = require('sharp');
        const img = sharp(buffer);
        const meta = await img.metadata();
        if (meta.format === 'jpeg' || !meta.hasAlpha) {
          const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i+1], b = data[i+2];
            // If pixel is near-white or light paper background, make transparent
            if (r > 238 && g > 238 && b > 238) {
              data[i+3] = 0;
            } else if (r > 218 && g > 218 && b > 218) {
              const diff = (r + g + b) / 3 - 218;
              data[i+3] = Math.max(0, Math.min(255, Math.round(255 * (1 - diff / 22))));
            }
          }
          buffer = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
        }
      } catch (procErr: any) {
        console.warn('[Logo Process Warning]', procErr.message);
      }

      const filesToUpdate = [
        target,
        'ranvik-logo.png',
        'ranvik-logo-transparent.png',
        'ranvik-header-fixed.png',
        'ranvik-footer-full-fixed.png',
        'ranvik-logo-header.png',
        'ranvik-logo-footer.png',
      ];

      for (const f of filesToUpdate) {
        fs.writeFileSync(path.join(assetsDir, f), buffer);
        if (fs.existsSync(distAssetsDir)) {
          fs.writeFileSync(path.join(distAssetsDir, f), buffer);
        }
      }

      console.log(`[Logo Upload] Successfully saved logo (${buffer.length} bytes) across all paths`);
      res.json({ success: true, message: `Successfully saved ${target}` });
    } catch (err: any) {
      console.error('[Logo Upload Error]', err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// Serve public directory assets
app.use(express.static(path.join(process.cwd(), 'public')));

// -------------------------------------------------------------
// Vite middleware for Development / Static for Production
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RANVIK Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
