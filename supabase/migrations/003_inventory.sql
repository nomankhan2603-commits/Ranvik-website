-- =====================================================================
-- 003_inventory.sql
-- Inventory Transactions & Stock Reservation Functions
-- =====================================================================

-- 1. INVENTORY TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity_before INTEGER NOT NULL,
    quantity_change INTEGER NOT NULL,
    quantity_after INTEGER NOT NULL,
    reason VARCHAR(50) NOT NULL CHECK (
        reason IN ('sale', 'purchase', 'return', 'damage', 'manual_adjustment', 'cancellation', 'stock_correction')
    ),
    reference_id VARCHAR(255),
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_tx_variant ON inventory_transactions(variant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_tx_created ON inventory_transactions(created_at);

ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view inventory transactions" ON inventory_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid()
        )
    );

-- 2. STOCK RESERVATION FUNCTION (RPC)
-- Safely reserves stock during checkout. Prevents negative available stock.
CREATE OR REPLACE FUNCTION reserve_stock(
    p_variant_id UUID,
    p_quantity INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    v_available INTEGER;
BEGIN
    -- Lock variant row for update to prevent race conditions
    SELECT (stock_quantity - reserved_quantity) INTO v_available
    FROM product_variants
    WHERE id = p_variant_id
    FOR UPDATE;

    IF v_available IS NULL OR v_available < p_quantity THEN
        RETURN FALSE;
    END IF;

    UPDATE product_variants
    SET reserved_quantity = reserved_quantity + p_quantity,
        updated_at = NOW()
    WHERE id = p_variant_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. RELEASE RESERVED STOCK FUNCTION (e.g. order cancelled)
CREATE OR REPLACE FUNCTION release_stock(
    p_variant_id UUID,
    p_quantity INTEGER
) RETURNS BOOLEAN AS $$
BEGIN
    UPDATE product_variants
    SET reserved_quantity = GREATEST(0, reserved_quantity - p_quantity),
        updated_at = NOW()
    WHERE id = p_variant_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. COMMIT STOCK DEDUCTION FUNCTION (e.g. order fulfilled/shipped)
CREATE OR REPLACE FUNCTION commit_stock_deduction(
    p_variant_id UUID,
    p_quantity INTEGER,
    p_reference_id VARCHAR
) RETURNS BOOLEAN AS $$
DECLARE
    v_before INTEGER;
    v_after INTEGER;
BEGIN
    SELECT stock_quantity INTO v_before
    FROM product_variants
    WHERE id = p_variant_id
    FOR UPDATE;

    v_after := v_before - p_quantity;

    IF v_after < 0 THEN
        RETURN FALSE;
    END IF;

    UPDATE product_variants
    SET stock_quantity = v_after,
        reserved_quantity = GREATEST(0, reserved_quantity - p_quantity),
        updated_at = NOW()
    WHERE id = p_variant_id;

    INSERT INTO inventory_transactions (
        variant_id,
        quantity_before,
        quantity_change,
        quantity_after,
        reason,
        reference_id
    ) VALUES (
        p_variant_id,
        v_before,
        -p_quantity,
        v_after,
        'sale',
        p_reference_id
    );

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
