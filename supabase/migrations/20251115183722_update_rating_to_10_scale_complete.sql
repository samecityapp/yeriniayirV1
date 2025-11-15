/*
  # Update Rating Scale to 10

  1. Changes
    - Drop all views that depend on hotels.rating column
    - Update rating column to accept values from 0 to 10 (numeric(3,1))
    - Update constraint for 0-10 range
    - Recreate all views with updated rating references
    
  2. Notes
    - Existing ratings (0-5) will be preserved
    - Frontend will display as X.X/10 format
*/

-- Drop all dependent views temporarily
DROP VIEW IF EXISTS audit_log_summary;
DROP VIEW IF EXISTS tag_usage_stats;
DROP VIEW IF EXISTS price_range_distribution;
DROP VIEW IF EXISTS hotel_location_stats;
DROP VIEW IF EXISTS hotel_search_summary;
DROP VIEW IF EXISTS featured_tags;
DROP VIEW IF EXISTS published_groups_with_hotels;
DROP VIEW IF EXISTS active_hotels;

-- Drop the old check constraint
ALTER TABLE hotels DROP CONSTRAINT IF EXISTS hotels_rating_check;

-- Modify the rating column to accept 0-10 range
ALTER TABLE hotels 
  ALTER COLUMN rating TYPE numeric(3,1);

-- Add new check constraint for 0-10 range
ALTER TABLE hotels 
  ADD CONSTRAINT hotels_rating_check CHECK (rating >= 0 AND rating <= 10);

-- Recreate all views

-- View: Active (non-deleted) hotels
CREATE OR REPLACE VIEW active_hotels AS
SELECT 
  id,
  name,
  location,
  description,
  price,
  rating,
  image_url,
  amenities,
  tags,
  about,
  about_facility,
  rules,
  video_url,
  gallery_images,
  latitude,
  longitude,
  created_at,
  updated_at
FROM hotels
WHERE deleted_at IS NULL;

-- View: Published groups with their hotel count
CREATE OR REPLACE VIEW published_groups_with_hotels AS
SELECT 
  g.id,
  g.title,
  g.created_at,
  g.updated_at,
  COUNT(gh.hotel_id) as hotel_count,
  ARRAY_AGG(gh.hotel_id ORDER BY gh.order_index) as hotel_ids
FROM groups g
LEFT JOIN group_hotels gh ON g.id = gh.group_id
WHERE g.is_published = true AND g.deleted_at IS NULL
GROUP BY g.id, g.title, g.created_at, g.updated_at;

-- View: Featured tags only
CREATE OR REPLACE VIEW featured_tags AS
SELECT 
  id,
  name,
  slug,
  icon,
  created_at
FROM tags
WHERE is_featured = true AND deleted_at IS NULL
ORDER BY name;

-- View: Hotel search summary (lightweight for list views)
CREATE OR REPLACE VIEW hotel_search_summary AS
SELECT 
  id,
  name,
  location,
  price,
  rating,
  image_url,
  tags,
  created_at
FROM hotels
WHERE deleted_at IS NULL;

-- View: Hotel statistics by location
CREATE OR REPLACE VIEW hotel_location_stats AS
SELECT 
  location,
  COUNT(*) as hotel_count,
  AVG(price)::integer as avg_price,
  AVG(rating)::numeric(3,2) as avg_rating,
  MIN(price) as min_price,
  MAX(price) as max_price
FROM hotels
WHERE deleted_at IS NULL
GROUP BY location
ORDER BY hotel_count DESC;

-- View: Price range distribution
CREATE OR REPLACE VIEW price_range_distribution AS
SELECT 
  pt.label,
  pt.min_price,
  pt.max_price,
  COUNT(h.id) as hotel_count
FROM price_tags pt
LEFT JOIN hotels h ON h.price BETWEEN pt.min_price AND pt.max_price
  AND h.deleted_at IS NULL
WHERE pt.deleted_at IS NULL
GROUP BY pt.id, pt.label, pt.min_price, pt.max_price
ORDER BY pt.min_price;

-- View: Tag usage statistics
CREATE OR REPLACE VIEW tag_usage_stats AS
SELECT 
  t.id,
  t.name,
  t.slug,
  t.is_featured,
  COUNT(h.id) as hotel_count
FROM tags t
LEFT JOIN hotels h ON t.slug = ANY(h.tags)
  AND h.deleted_at IS NULL
WHERE t.deleted_at IS NULL
GROUP BY t.id, t.name, t.slug, t.is_featured
ORDER BY hotel_count DESC;

-- Recreate audit_log_summary view
CREATE OR REPLACE VIEW audit_log_summary AS
SELECT 
  al.id,
  al.table_name,
  al.operation,
  al.record_id,
  al.created_at,
  CASE 
    WHEN al.table_name = 'hotels' THEN al.new_values->>'name'
    WHEN al.table_name = 'groups' THEN al.new_values->>'title'
    WHEN al.table_name = 'tags' THEN al.new_values->>'name'
    WHEN al.table_name = 'price_tags' THEN al.new_values->>'label'
    WHEN al.table_name = 'search_terms' THEN al.new_values->>'term'
  END as record_name
FROM audit_logs al
ORDER BY al.created_at DESC;