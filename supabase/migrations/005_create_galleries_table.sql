-- Create galleries table
CREATE TABLE IF NOT EXISTS galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  images JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of image objects with URL and metadata
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create index for faster queries
CREATE INDEX idx_galleries_published ON galleries(is_published);
CREATE INDEX idx_galleries_created_at ON galleries(created_at DESC);
CREATE INDEX idx_galleries_created_by ON galleries(created_by);

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_galleries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER galleries_updated_at_trigger
  BEFORE UPDATE ON galleries
  FOR EACH ROW
  EXECUTE FUNCTION update_galleries_updated_at();

-- RLS Policies
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;

-- Allow public to view published galleries
CREATE POLICY "Public can view published galleries"
  ON galleries
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Authenticated users can view all galleries
CREATE POLICY "Authenticated users can view all galleries"
  ON galleries
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert galleries
CREATE POLICY "Authenticated users can create galleries"
  ON galleries
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update galleries
CREATE POLICY "Authenticated users can update galleries"
  ON galleries
  FOR UPDATE
  TO authenticated
  USING (true);

-- Authenticated users can delete galleries
CREATE POLICY "Authenticated users can delete galleries"
  ON galleries
  FOR DELETE
  TO authenticated
  USING (true);

-- Comments
COMMENT ON TABLE galleries IS 'Stores photo galleries/collections with images from Cloudinary';
COMMENT ON COLUMN galleries.images IS 'JSONB array of image objects: [{url, publicId, width, height, format, etc.}]';
COMMENT ON COLUMN galleries.description IS 'Rich text description (HTML from CKEditor)';
