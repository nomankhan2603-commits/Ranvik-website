-- =====================================================================
-- 006_content.sql
-- Site Content & Admin Roles
-- =====================================================================

-- 1. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'admin' CHECK (
        role IN ('super_admin', 'admin', 'inventory_manager', 'order_manager')
    ),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_admin_user UNIQUE (user_id)
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can view admin list" ON admin_users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid()
        )
    );

-- 2. SITE CONTENT TABLE
CREATE TABLE IF NOT EXISTS site_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view site content" ON site_content
    FOR SELECT USING (true);

CREATE POLICY "Admin full access on site content" ON site_content
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
        )
    );
