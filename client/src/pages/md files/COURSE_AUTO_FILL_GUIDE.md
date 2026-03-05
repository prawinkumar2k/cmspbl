# Course Auto-Fill Feature - Implementation Guide

## Overview
When you select a Course from the dropdown, the system automatically fills in:
- **Department** (Dept_Name)
- **Department Code** (Dept_Code)

All fetched from the `course_details` table in the database.

---

## How It Works

### Step 1: Select a Course
```
Course Dropdown shows:
✓ B.Pharm
✓ D.Pharm
✓ M.Pharm
✓ Ph.D. (Pharmacy)
```

### Step 2: Auto-Fill Happens
When you select a course (e.g., "B.Pharm"):

```javascript
1. System searches course_details table for: Course_Name = "B.Pharm"
2. Finds first matching record:
   {
     Course_Name: "B.Pharm",
     Dept_Name: "Pharmacy",
     Dept_Code: "BPHARMA01"
   }
3. Auto-fills Department field with: "Pharmacy"
4. Auto-fills Department Code field with: "BPHARMA01"
5. Shows toast: "Department 'Pharmacy' auto-filled"
```

### Step 3: Fields Auto-Populated
```
Course:           B.Pharm (selected by user)
Department:       Pharmacy (auto-filled)
Department Code:  BPHARMA01 (auto-filled, read-only)
```

---

## Code Flow

### Backend (course_details table)
```sql
SELECT DISTINCT Course_Name FROM course_details;
-- Returns: [B.Pharm, D.Pharm, M.Pharm, Ph.D. (Pharmacy)]

SELECT * FROM course_details WHERE Course_Name = 'B.Pharm';
-- Returns all departments for B.Pharm with their codes
```

### Frontend (StudentDetails.jsx)
```jsx
// When Course_Name dropdown changes:
if (name === 'Course_Name') {
  const matchingDept = departments.find(
    d => d.Course_Name === value
  );
  
  if (matchingDept) {
    // Auto-fill Department and Department Code
    setForm(prev => ({
      ...prev,
      Course_Name: value,
      Dept_Name: matchingDept.Dept_Name,      // Auto-fill
      Dept_Code: matchingDept.Dept_Code,      // Auto-fill
      allocatedQuota: ''
    }));
    
    // Show user feedback
    showToast(`Department "${matchingDept.Dept_Name}" auto-filled`);
  }
}
```

---

## User Experience Flow

### Before Selection
```
┌─────────────────────────────────┐
│ Course Details                  │
├─────────────────────────────────┤
│ Course:        [Select Course]  │  ← Empty
│ Department:    [Select Dept]    │  ← Disabled/Empty
│ Dept Code:     [Read-Only]      │  ← Empty, Read-Only
└─────────────────────────────────┘
```

### During Selection
```
User clicks Course dropdown
↓
Shows 4 options:
  • B.Pharm
  • D.Pharm
  • M.Pharm
  • Ph.D. (Pharmacy)
```

### After Selection (e.g., B.Pharm)
```
┌─────────────────────────────────┐
│ Course Details                  │
├─────────────────────────────────┤
│ Course:        B.Pharm ✓        │  ← User selected
│ Department:    Pharmacy ✓       │  ← Auto-filled
│ Dept Code:     BPHARMA01 ✓      │  ← Auto-filled, Read-Only
└─────────────────────────────────┘
  ↓
Toast: "Department 'Pharmacy' auto-filled"
```

---

## Available Courses and Auto-Fill Data

### B.Pharm
| Selection | Auto-Fill (Dept_Name) | Auto-Fill (Dept_Code) |
|-----------|----------------------|----------------------|
| B.Pharm   | Pharmacy            | BPHARMA01           |

*(Can be changed to other B.Pharm departments if multiple departments are selected)*

### D.Pharm
| Selection | Auto-Fill (Dept_Name) | Auto-Fill (Dept_Code) |
|-----------|----------------------|----------------------|
| D.Pharm   | Pharmacy            | DPHARMA01           |

### M.Pharm
| Selection | Auto-Fill (Dept_Name) | Auto-Fill (Dept_Code) |
|-----------|----------------------|----------------------|
| M.Pharm   | Pharmacology        | MPHARMA01           |

### Ph.D. (Pharmacy)
| Selection | Auto-Fill (Dept_Name) | Auto-Fill (Dept_Code) |
|-----------|----------------------|----------------------|
| Ph.D. (Pharmacy) | Pharmacy Research | PHD01 |

---

## What Happens Behind the Scenes

### 1. Data Fetch from Backend
```
GET /api/studentMaster/metadata
↓
Returns:
{
  courses: [
    { Course_Name: "B.Pharm" },
    { Course_Name: "D.Pharm" },
    ...
  ],
  departments: [
    { Course_Name: "B.Pharm", Dept_Name: "Pharmacy", Dept_Code: "BPHARMA01" },
    { Course_Name: "B.Pharm", Dept_Name: "Pharmaceutical Chemistry", Dept_Code: "BPHARMA02" },
    ...
  ]
}
```

### 2. Course Selection Handler
```javascript
handleChange({
  target: {
    name: 'Course_Name',
    value: 'B.Pharm'
  }
})
```

### 3. Auto-Fill Logic
```javascript
// Find matching department record
const matchingDept = departments.find(
  d => d.Course_Name === 'B.Pharm'
);
// Result: { Course_Name: "B.Pharm", Dept_Name: "Pharmacy", Dept_Code: "BPHARMA01" }

// Update form state
setForm(prev => ({
  ...prev,
  Course_Name: 'B.Pharm',
  Dept_Name: 'Pharmacy',        // ← Auto-filled
  Dept_Code: 'BPHARMA01'        // ← Auto-filled
}));
```

### 4. Display on Screen
```
Course field shows: B.Pharm (user selection)
Dept_Name field shows: Pharmacy (auto-filled)
Dept_Code field shows: BPHARMA01 (auto-filled, read-only)
```

---

## Department Code Field Properties

### Read-Only
```jsx
{renderFormField('Dept_Code', 'input', {
  inputProps: { readOnly: true },
  placeholder: 'Enter department code'
})}
```

**Why Read-Only?**
- Prevents manual editing
- Ensures data integrity
- Values come directly from database
- User cannot type/modify

### Auto-Populated From
- `course_details` table → `Dept_Code` column
- Set when course is selected
- Cannot be changed by user directly
- Changed only when course selection changes

---

## Department Dropdown Behavior

### Dynamic Filtering
The Department dropdown only shows departments for the selected course:

```jsx
{departments
  .filter(dept => dept.Course_Name === (form.Course_Name || form.course))
  .map((dept, idx) => (
    <option key={idx} value={dept.Dept_Name}>
      {dept.Dept_Name}
    </option>
  ))}
```

### Example
If you select "B.Pharm", the Department dropdown shows:
- Pharmacy
- Pharmaceutical Chemistry
- Pharmaceutics

---

## Toasts & Feedback

### Success Message
When auto-fill completes:
```
✓ "Department 'Pharmacy' auto-filled"
```

### Error Cases
```
⚠ "No departments available. Check database."
→ If course_details table is empty

ℹ "No departments for this course."
→ If selected course has no departments
```

---

## Database Requirements

### course_details Table Structure
```sql
CREATE TABLE course_details (
  id INT PRIMARY KEY AUTO_INCREMENT,
  Course_Name VARCHAR(100),      -- e.g., "B.Pharm"
  Dept_Name VARCHAR(100),         -- e.g., "Pharmacy"
  Dept_Code VARCHAR(20),          -- e.g., "BPHARMA01"
  Created_At TIMESTAMP
);
```

### Sample Data
```sql
INSERT INTO course_details (Course_Name, Dept_Name, Dept_Code) VALUES
('B.Pharm', 'Pharmacy', 'BPHARMA01'),
('B.Pharm', 'Pharmaceutical Chemistry', 'BPHARMA02'),
('B.Pharm', 'Pharmaceutics', 'BPHARMA03'),
('D.Pharm', 'Pharmacy', 'DPHARMA01'),
...
```

---

## Testing the Feature

### Test Case 1: Select B.Pharm
1. Open Course dropdown
2. Click "B.Pharm"
3. **Expected**: 
   - Department auto-fills with "Pharmacy"
   - Department Code auto-fills with "BPHARMA01"
   - Toast shows success message

### Test Case 2: Select D.Pharm
1. From B.Pharm, click Course dropdown again
2. Click "D.Pharm"
3. **Expected**:
   - Department auto-fills with "Pharmacy" (D.Pharm version)
   - Department Code auto-fills with "DPHARMA01"
   - Toast shows success message

### Test Case 3: Empty Database
1. If no data in course_details:
2. **Expected**:
   - Course dropdown shows empty or "Loading"
   - Warning message: "No courses available. Check database."

---

## Console Logs for Debugging

When a course is selected, check browser console (F12) for:

```javascript
// Course selection logged
"Course selected: B.Pharm"

// Department found and logged
"Matching department found: {
  Course_Name: "B.Pharm",
  Dept_Name: "Pharmacy",
  Dept_Code: "BPHARMA01"
}"

// Any fetch errors logged
"Error fetching latest serial: ..."
```

---

## Features

✅ **Auto-Fill on Course Selection**
- Department field auto-fills when course is selected
- Department Code field auto-fills when course is selected

✅ **Read-Only Department Code**
- Prevents manual editing
- Ensures data comes from database

✅ **Dynamic Department Dropdown**
- Shows only departments for selected course
- Filters based on Course_Name

✅ **User Feedback**
- Toast notification when auto-fill happens
- Warning messages if data not available

✅ **Application Number Generation**
- Auto-generates based on Department Code
- Format: DeptCode + 4-digit serial

---

## Troubleshooting

### Dropdowns show "Loading..." or empty
→ Run the populate_master_tables.sql script

### Auto-fill not working
→ Check browser console for errors
→ Verify course_details table has data
→ Refresh browser (Ctrl+Shift+R)

### Department Code not appearing
→ Verify Dept_Code column exists in course_details
→ Check if value is NULL in database

### Multiple departments showing but only first auto-fills
→ This is by design - first matching department is auto-filled
→ User can manually select from dropdown if needed

---

**Last Updated**: December 13, 2025
**Status**: ✅ Implemented and Tested
