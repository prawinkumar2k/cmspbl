-- Check if columns exist in student_master table
-- Run this to see which columns are missing

SELECT COLUMN_NAME, COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'student_master' 
AND TABLE_SCHEMA = 'cms' 
AND COLUMN_NAME IN (
  'Photo_Path',
  'Bank_Name', 
  'Bank_Branch',
  'Bank_Account_No',
  'Bank_IFSC_Code',
  'Bank_MICR_Code',
  'EMIS_No',
  'Medium_Of_Instruction',
  'Father_Annual_Income',
  'Mother_Annual_Income',
  'Guardian_Annual_Income'
);

-- If you need to add missing columns, use this:

-- Add Photo_Path if missing
ALTER TABLE student_master 
ADD COLUMN IF NOT EXISTS Photo_Path VARCHAR(255) NULL;

-- Add Bank Details columns if missing
ALTER TABLE student_master 
ADD COLUMN IF NOT EXISTS Bank_Name VARCHAR(100) NULL,
ADD COLUMN IF NOT EXISTS Bank_Branch VARCHAR(100) NULL,
ADD COLUMN IF NOT EXISTS Bank_Account_No VARCHAR(20) NULL,
ADD COLUMN IF NOT EXISTS Bank_IFSC_Code VARCHAR(20) NULL,
ADD COLUMN IF NOT EXISTS Bank_MICR_Code VARCHAR(20) NULL;

-- Add EMIS and Medium columns if missing
ALTER TABLE student_master 
ADD COLUMN IF NOT EXISTS EMIS_No VARCHAR(50) NULL,
ADD COLUMN IF NOT EXISTS Medium_Of_Instruction VARCHAR(50) NULL;

-- Add Income columns if missing
ALTER TABLE student_master 
ADD COLUMN IF NOT EXISTS Father_Annual_Income VARCHAR(50) NULL,
ADD COLUMN IF NOT EXISTS Mother_Annual_Income VARCHAR(50) NULL,
ADD COLUMN IF NOT EXISTS Guardian_Annual_Income VARCHAR(50) NULL;
