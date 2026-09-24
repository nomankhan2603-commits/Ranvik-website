-- =====================================================================
-- 002_rls.sql
-- Row Level Security (RLS) Policies
-- =====================================================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- 1. CATEGORIES: Public can read active categories
CREATE POLICY "Public can view active categories" ON categories
    FOR SELECT USING (status = 'active');

CREATE POLICY "Admin full access on categories" ON categories
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
        )
    );

-- 2. PRODUCTS: Public can read active products only; Admins can manage all
CREATE POLICY "Public can view active products" ON products
    FOR SELECT USING (status = 'active');

CREATE POLICY "Admin full access on products" ON products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
        )
    );

-- 3. PRODUCT VARIANTS: Public can view active variants of active products
CREATE POLICY "Public can view variants of active products" ON product_variants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM products WHERE products.id = product_variants.product_id AND products.status = 'active'
        )
    );

CREATE POLICY "Admin full access on variants" ON product_variants
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
        )
    );

-- 4. PRODUCT IMAGES: Public can view images of active products
CREATE POLICY "Public can view product images" ON product_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM products WHERE products.id = product_images.product_id AND products.status = 'active'
        )
    );

CREATE POLICY "Admin full access on product images" ON product_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
        )
    );

-- 5. PROFILES: Users can read and update their own profile; Admins can view all
CREATE POLICY "Users can read own profile" ON profiles
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admin can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
        )
    );

-- 6. ADDRESSES: Users can manage their own addresses
CREATE POLICY "Users can manage own addresses" ON addresses
    FOR ALL USING (user_id = auth.uid());

-- 7. WISHLISTS: Users can manage own wishlist
CREATE POLICY "Users can manage own wishlist" ON wishlists
    FOR ALL USING (user_id = auth.uid());

-- 8. CARTS & CART ITEMS: Users can manage their own cart
CREATE POLICY "Users can manage own cart" ON carts
    FOR ALL USING (user_id = auth.uid() OR session_id IS NOT NULL);

CREATE POLICY "Users can manage cart items" ON cart_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND (carts.user_id = auth.uid() OR carts.session_id IS NOT NULL)
        )
    );
