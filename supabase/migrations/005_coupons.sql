-- =====================================================================
-- 005_coupons.sql
-- Coupons & Validation
-- =====================================================================

CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
    minimum_order_value NUMERIC(10, 2) DEFAULT 0,
    maximum_discount NUMERIC(10, 2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    per_customer_limit INTEGER DEFAULT 1,
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active coupons" ON coupons
    FOR SELECT USING (status = 'active');

CREATE POLICY "Admin full access on coupons" ON coupons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
        )
    );
