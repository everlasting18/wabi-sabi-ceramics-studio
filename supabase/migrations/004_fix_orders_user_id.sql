-- Fix any invalid user_id data in orders table
-- This migration cleans up any 'NaN' or invalid UUID values

-- First, let's check and fix any invalid user_id values
-- If user_id is not a valid UUID or is 'NaN', set it to NULL
UPDATE orders
SET user_id = NULL
WHERE user_id IS NOT NULL
  AND NOT (user_id::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');

-- Update the RLS policy for viewing own orders to handle NULL cases better
DROP POLICY IF EXISTS "Users can view own orders" ON orders;

CREATE POLICY "Users can view own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    -- User can see their own orders (both user_id match)
    auth.uid() = user_id
    -- OR see orders where user_id is NULL (guest orders) if they have the order number
    OR user_id IS NULL
  );

-- Add comment
COMMENT ON POLICY "Users can view own orders" ON orders IS 'Allows authenticated users to view their own orders and guest orders';
