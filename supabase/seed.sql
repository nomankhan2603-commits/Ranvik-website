-- =====================================================================
-- seed.sql
-- Development Seed Data for RANVIK Footwear
-- =====================================================================

-- 1. SEED CATEGORIES
INSERT INTO categories (id, name, slug, description, status)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'Tactical Boots', 'tactical-boots', 'High-mobility tactical footwear for rapid movement and urban patrol.', 'active'),
    ('c2222222-2222-2222-2222-222222222222', 'Combat Boots', 'combat-boots', 'Heavy-duty combat boots engineered for rugged field terrain and harsh environments.', 'active'),
    ('c3333333-3333-3333-3333-333333333333', 'Officer Boots', 'officer-boots', 'Polished parade and ceremonial silhouettes crafted with premium bovine leather.', 'active'),
    ('c4444444-4444-4444-4444-444444444444', 'Field Boots', 'field-boots', 'All-weather, water-resistant field boots with reinforced combat lug outsoles.', 'active')
ON CONFLICT (slug) DO NOTHING;

-- 2. SEED PRODUCTS
INSERT INTO products (id, name, slug, sku, short_description, description, category_id, mrp, selling_price, status, brand)
VALUES
    (
        'p1111111-1111-1111-1111-111111111111',
        'RANVIK Ranger X1',
        'ranvik-ranger-x1',
        'RVK-RX1-BASE',
        '8-inch full-grain combat boot with reinforced Goodyear-style welt and quick-lacing hooks.',
        'Engineered for tactical endurance and rigorous all-terrain movement. Built with 1.8mm hand-selected full-grain bovine leather and aggressive multi-directional lugged outsoles.',
        'c2222222-2222-2222-2222-222222222222',
        4499.00,
        2499.00,
        'active',
        'RANVIK'
    ),
    (
        'p2222222-2222-2222-2222-222222222222',
        'RANVIK Tactical Core',
        'ranvik-tactical-core',
        'RVK-TAC-CORE',
        'Breathable lightweight desert patrol boot with ballistic Cordura panelling.',
        'High-mobility tactical boot blending rugged leather lowers with abrasion-resistant nylon uppers. Formulated for desert heat dispersal and rapid foot response.',
        'c1111111-1111-1111-1111-111111111111',
        4999.00,
        2799.00,
        'active',
        'RANVIK'
    ),
    (
        'p3333333-3333-3333-3333-333333333333',
        'RANVIK Command 8',
        'ranvik-command-8',
        'RVK-CMD-08',
        'High-shine parade and ceremonial boot with double-stitched leather toe cap.',
        'Crafted from mirror-buffed full-grain leather, the Command 8 offers disciplined poise and uncompromising arch support during formal inspections.',
        'c3333333-3333-3333-3333-333333333333',
        5499.00,
        3299.00,
        'active',
        'RANVIK'
    ),
    (
        'p4444444-4444-4444-4444-444444444444',
        'RANVIK Patrol Pro',
        'ranvik-patrol-pro',
        'RVK-PTR-PRO',
        'Mid-height side-zip patrol boot engineered for rapid emergency deployment.',
        'Features a durable YKK industrial side zipper protected by Velcro retention flap, allowing quick on/off transitions without untying speed laces.',
        'c1111111-1111-1111-1111-111111111111',
        4299.00,
        2399.00,
        'active',
        'RANVIK'
    ),
    (
        'p5555555-5555-5555-5555-555555555555',
        'RANVIK Black Ops',
        'ranvik-black-ops',
        'RVK-BLK-OPS',
        'Heavy lug 10-inch tactical storm boot with matte black oil-resistant finish.',
        'Heavyweight combat performer equipped with high ankle stabilizer shanks, waterproof leather membranes, and deep 6mm compound mud lugs.',
        'c2222222-2222-2222-2222-222222222222',
        5999.00,
        3499.00,
        'active',
        'RANVIK'
    ),
    (
        'p6666666-6666-6666-6666-666666666666',
        'RANVIK Officer Classic',
        'ranvik-officer-classic',
        'RVK-OFF-CLS',
        'Low-quarter garrison derby boot built with Goodyear-welted rubber dress soles.',
        'Designed for daily office command and uniform dress requirements, offering bespoke-grade leather lining and cushioned memory-foam footbeds.',
        'c3333333-3333-3333-3333-333333333333',
        4799.00,
        2899.00,
        'active',
        'RANVIK'
    ),
    (
        'p7777777-7777-7777-7777-777777777777',
        'RANVIK Field Mark II',
        'ranvik-field-mark-ii',
        'RVK-FLD-MK2',
        'Rugged 6-inch commando utility boot with puncture-resistant mid-sole layer.',
        'Versatile workhorse boot engineered for rough outdoor operations, motorcycling, and heavy work. Treated with silicone water repellency.',
        'c4444444-4444-4444-4444-444444444444',
        4199.00,
        2199.00,
        'active',
        'RANVIK'
    )
ON CONFLICT (slug) DO NOTHING;

-- 3. SEED PRODUCT VARIANTS (Sizes 6 through 11 for Ranger X1)
INSERT INTO product_variants (product_id, size, sku, price, stock_quantity, reserved_quantity, low_stock_threshold, status)
VALUES
    ('p1111111-1111-1111-1111-111111111111', 6,  'RX1-06', 2499.00, 10, 0, 4, 'active'),
    ('p1111111-1111-1111-1111-111111111111', 7,  'RX1-07', 2499.00, 18, 0, 5, 'active'),
    ('p1111111-1111-1111-1111-111111111111', 8,  'RX1-08', 2499.00, 25, 0, 5, 'active'),
    ('p1111111-1111-1111-1111-111111111111', 9,  'RX1-09', 2499.00, 31, 0, 5, 'active'),
    ('p1111111-1111-1111-1111-111111111111', 10, 'RX1-10', 2499.00, 22, 0, 5, 'active'),
    ('p1111111-1111-1111-1111-111111111111', 11, 'RX1-11', 2499.00,  7, 0, 5, 'active')
ON CONFLICT (product_id, size) DO NOTHING;

-- 4. SEED PRODUCT IMAGES
INSERT INTO product_images (product_id, storage_path, public_url, alt_text, sort_order, is_primary)
VALUES
    ('p1111111-1111-1111-1111-111111111111', 'products/ranger-x1/boot1.png', '/assets/boot1.png', 'RANVIK Ranger X1 Profile', 0, true),
    ('p1111111-1111-1111-1111-111111111111', 'products/ranger-x1/boot2.png', '/assets/boot2.png', 'RANVIK Ranger X1 Top Angle', 1, false),
    ('p1111111-1111-1111-1111-111111111111', 'products/ranger-x1/sole.png',  '/assets/sole-traction.png', 'RANVIK Ranger X1 Outsole', 2, false),
    ('p2222222-2222-2222-2222-222222222222', 'products/tactical-core/boot2.png', '/assets/boot2.png', 'RANVIK Tactical Core Desert', 0, true),
    ('p3333333-3333-3333-3333-333333333333', 'products/command-8/boot3.png', '/assets/boot3.png', 'RANVIK Command 8 Officer', 0, true),
    ('p4444444-4444-4444-4444-444444444444', 'products/patrol-pro/boot4.png', '/assets/boot4.png', 'RANVIK Patrol Pro Sand', 0, true),
    ('p5555555-5555-5555-5555-555555555555', 'products/black-ops/boot5.png', '/assets/boot5.png', 'RANVIK Black Ops Heavy', 0, true),
    ('p6666666-6666-6666-6666-666666666666', 'products/officer-classic/boot3.png', '/assets/boot3.png', 'RANVIK Officer Classic', 0, true),
    ('p7777777-7777-7777-7777-777777777777', 'products/field-mk2/boot6.png', '/assets/boot6.png', 'RANVIK Field Mark II', 0, true)
ON CONFLICT DO NOTHING;

-- 5. SEED COUPONS
INSERT INTO coupons (code, discount_type, discount_value, minimum_order_value, maximum_discount, usage_limit, status)
VALUES
    ('FIRSTBOOT', 'fixed', 300.00, 2000.00, 300.00, 1000, 'active'),
    ('COMMANDO10', 'percentage', 10.00, 2500.00, 500.00, 500, 'active'),
    ('TACTICAL15', 'percentage', 15.00, 3500.00, 750.00, 200, 'active')
ON CONFLICT (code) DO NOTHING;

-- 6. SEED SITE CONTENT
INSERT INTO site_content (key, value)
VALUES
    (
        'homepage_hero',
        '{
            "heroTitle": "BUILT FOR THE GROUND",
            "heroSubtitle": "Engineered for durability, confidence and everyday movement. Premium leather military boots with military-grade attitude and luxury craftsmanship.",
            "heroImage": "/assets/hero-boot.png",
            "ctaText": "ORDER NOW — FREE SHIPPING",
            "ctaUrl": "#catalog",
            "campaignTitle": "AGRA LEATHER FOUNDRY HERITAGE",
            "campaignDescription": "Every boot is lasted in Agra, utilizing 1.8mm hand-selected bovine hides cured with natural plant oils for exceptional flex and water-resistance."
        }'::jsonb
    )
ON CONFLICT (key) DO NOTHING;
