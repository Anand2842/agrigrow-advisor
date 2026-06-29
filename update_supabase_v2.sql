-- V2 Site Intelligence Schema Update
-- Run this in Supabase SQL Editor after the main setup

-- Add site intelligence columns to farmer_microclimate_inputs
ALTER TABLE farmer_microclimate_inputs ADD COLUMN IF NOT EXISTS site_latitude REAL;
ALTER TABLE farmer_microclimate_inputs ADD COLUMN IF NOT EXISTS site_longitude REAL;
ALTER TABLE farmer_microclimate_inputs ADD COLUMN IF NOT EXISTS site_elevation_m REAL;
ALTER TABLE farmer_microclimate_inputs ADD COLUMN IF NOT EXISTS site_slope_percent REAL;
ALTER TABLE farmer_microclimate_inputs ADD COLUMN IF NOT EXISTS site_aspect TEXT;
ALTER TABLE farmer_microclimate_inputs ADD COLUMN IF NOT EXISTS site_polygon JSONB;
ALTER TABLE farmer_microclimate_inputs ADD COLUMN IF NOT EXISTS infrastructure_data JSONB;
ALTER TABLE farmer_microclimate_inputs ADD COLUMN IF NOT EXISTS manual_answers JSONB;
ALTER TABLE farmer_microclimate_inputs ADD COLUMN IF NOT EXISTS intelligence_confidence TEXT;

-- Verify operating_costs table exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'operating_costs') THEN
    RAISE NOTICE 'operating_costs table does not exist — run main setup SQL first';
  ELSE
    RAISE NOTICE 'operating_costs table exists';
  END IF;
END $$;

-- Verify location_intelligence_cache table exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'location_intelligence_cache') THEN
    RAISE NOTICE 'location_intelligence_cache table does not exist — run main setup SQL first';
  ELSE
    RAISE NOTICE 'location_intelligence_cache table exists';
  END IF;
END $$;

-- Add index for site intelligence queries
CREATE INDEX IF NOT EXISTS idx_microclimate_lat_lon ON farmer_microclimate_inputs(site_latitude, site_longitude);

-- Done
SELECT 'V2 Site Intelligence schema update complete' AS status;
