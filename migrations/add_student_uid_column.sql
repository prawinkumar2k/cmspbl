-- Migration: Add Std_UID column to student_master table
-- Date: 2026-01-07
-- Purpose: Support automatic student UID generation

-- Check if column already exists and add it if not
ALTER TABLE student_master ADD COLUMN IF NOT EXISTS Std_UID VARCHAR(50) NULL;

-- Optional: Create a unique index on the Std_UID column to ensure uniqueness
-- Uncomment if you want to enforce unique UIDs across the system
-- ALTER TABLE student_master ADD UNIQUE INDEX idx_std_uid (Std_UID);

-- Optional: Add an index on Application_No for faster lookups during UID generation
ALTER TABLE student_master ADD INDEX IF NOT EXISTS idx_application_no (Application_No);

-- Verify the column was added
-- SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS 
-- WHERE TABLE_NAME = 'student_master' AND COLUMN_NAME = 'Std_UID';
