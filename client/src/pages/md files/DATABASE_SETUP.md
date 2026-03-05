# Database Setup Guide - Master Tables

## Problem
Dropdowns showing "No courses available" and "No districts available" messages because database tables are empty.

## Solution
Run the SQL script to populate the master tables with sample data.

---

## Quick Setup Steps

### Step 1: Open MySQL Command Line or MySQL Workbench
```
mysql -u root -p your_database_name
```

### Step 2: Copy and run all SQL from `populate_master_tables.sql`
The script will:
1. Insert courses into `course_details`
2. Insert districts into `district_master`
3. Insert semesters into `semester_master`
4. Display verification results

### Step 3: Verify Data Was Inserted
```sql
-- Check courses
SELECT DISTINCT Course_Name FROM course_details;

-- Check districts
SELECT * FROM district_master LIMIT 5;

-- Check semesters
SELECT * FROM semester_master LIMIT 5;
```

---

## Table Structure Requirements

### course_details Table
Should have these columns:
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `Course_Name` (VARCHAR) - e.g., 'B.Pharm', 'D.Pharm'
- `Dept_Name` (VARCHAR) - e.g., 'Pharmacy', 'Pharmaceutics'
- `Dept_Code` (VARCHAR) - e.g., 'BPHARMA01'

If table doesn't exist, create it:
```sql
CREATE TABLE course_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  Course_Name VARCHAR(100),
  Dept_Name VARCHAR(100),
  Dept_Code VARCHAR(20),
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### district_master Table
Should have these columns:
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `District` (VARCHAR) - e.g., 'Chennai', 'Coimbatore'
- `State` (VARCHAR) - e.g., 'Tamil Nadu'

If table doesn't exist, create it:
```sql
CREATE TABLE district_master (
  id INT AUTO_INCREMENT PRIMARY KEY,
  District VARCHAR(100) NOT NULL,
  State VARCHAR(100) NOT NULL,
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### semester_master Table
Should have these columns:
- `id` (INT, PRIMARY KEY, AUTO_INCREMENT)
- `Semester` (INT) - e.g., 1, 2, 3...
- `Year` (INT) - e.g., 1, 2, 3...
- `Course_Name` (VARCHAR) - e.g., 'B.Pharm'

If table doesn't exist, create it:
```sql
CREATE TABLE semester_master (
  id INT AUTO_INCREMENT PRIMARY KEY,
  Semester INT,
  Year INT,
  Course_Name VARCHAR(100),
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## Data Included in Populate Script

### Courses (From course_details)
- B.Pharm (3 departments)
- D.Pharm (2 departments)
- M.Pharm (3 departments)
- Ph.D. (Pharmacy) (1 department)

### Districts (Tamil Nadu)
All 38 districts of Tamil Nadu including:
- Chennai, Coimbatore, Madurai
- Salem, Tiruchirappalli
- And 33 more districts

### Semesters
- B.Pharm: 8 semesters (4 years)
- D.Pharm: 4 semesters (2 years)
- M.Pharm: 4 semesters (2 years)
- Ph.D.: 6 semesters (3 years)

---

## How to Run the Script

### Option 1: Using MySQL Command Line
```bash
mysql -u root -p your_database_name < populate_master_tables.sql
```

### Option 2: Using MySQL Workbench
1. Open MySQL Workbench
2. Open `populate_master_tables.sql` file
3. Click Execute (or press Ctrl+Shift+Enter)
4. Check the results in the output panel

### Option 3: Copy-Paste in Command Line
1. Open MySQL command line
2. Select your database: `USE your_database_name;`
3. Copy entire content of `populate_master_tables.sql`
4. Paste it in MySQL command line
5. Press Enter

---

## Verification

After running the script, you should see:

```
Query OK: Total_Courses=4, Total_Departments=9, Total_Districts=38, Total_Semesters=24
```

Then open Student Details form and:
- ✅ Course dropdown shows 4 courses
- ✅ Department dropdown filters by course
- ✅ District dropdowns show 38 districts
- ✅ Semester dropdown shows available semesters

---

## If You Already Have Data

If you want to keep existing data and just add missing entries, comment out these lines at the top:

```sql
-- DELETE FROM course_details;
-- DELETE FROM district_master;
-- DELETE FROM semester_master;
```

This way, the INSERT statements will add to existing data instead of replacing it.

---

## Troubleshooting

### Still showing "No courses available"
1. Verify script ran without errors
2. Check if course_details table is empty: `SELECT COUNT(*) FROM course_details;`
3. Check if courses have Course_Name: `SELECT * FROM course_details WHERE Course_Name IS NULL;`

### Still showing "No districts available"
1. Verify district_master has data: `SELECT COUNT(*) FROM district_master;`
2. Verify State field is not empty: `SELECT * FROM district_master WHERE State IS NULL;`

### Dropdowns still "Loading..."
1. Check browser Network tab (F12 → Network)
2. Look for `/api/studentMaster/metadata` request
3. Check if it returns data or error
4. Check server logs for database connection errors

---

## What the Frontend Does

The StudentDetails form calls the `/api/studentMaster/metadata` endpoint which:

1. Queries: `SELECT DISTINCT Course_Name FROM course_details`
   - Returns unique course names
   
2. Queries: `SELECT * FROM course_details`
   - Returns all departments for filtering by course
   
3. Queries: `SELECT id, District, State FROM district_master`
   - Returns all districts for the district dropdowns
   
4. Queries: `SELECT * FROM semester_master`
   - Returns all semesters for filtering by course/year

---

## Sample Data Details

### B.Pharm Departments
- Pharmacy (BPHARMA01)
- Pharmaceutical Chemistry (BPHARMA02)
- Pharmaceutics (BPHARMA03)

### D.Pharm Departments
- Pharmacy (DPHARMA01)
- Pharmaceutical Biochemistry (DPHARMA02)

### M.Pharm Departments
- Pharmacology (MPHARMA01)
- Pharmaceutical Chemistry (MPHARMA02)
- Pharmaceutics (MPHARMA03)

### Ph.D. Department
- Pharmacy Research (PHD01)

---

## Need More Data?

To add more districts, courses, or departments later, use:

```sql
-- Add a new course and departments
INSERT INTO course_details (Course_Name, Dept_Name, Dept_Code) VALUES
('New Course Name', 'Department Name', 'DEPTCODE01');

-- Add a new district
INSERT INTO district_master (District, State) VALUES
('District Name', 'State Name');

-- Add new semesters for a course
INSERT INTO semester_master (Semester, Year, Course_Name) VALUES
(1, 1, 'New Course Name');
```

---

**Last Updated**: December 13, 2025
