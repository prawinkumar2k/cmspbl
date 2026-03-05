# Course Auto-Fill Visual Flow

## Form Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                      COURSE DETAILS SECTION                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Mode of Joining *          Reference         Course *          │
│  ┌─────────────────┐    ┌──────────────┐   ┌────────────────┐  │
│  │ [Select Mode]   │    │ [Select Y/N] │   │ [B.Pharm]    ▼ │  │
│  └─────────────────┘    └──────────────┘   └────────────────┘  │
│                                                    ↓             │
│  Department *                Department Code *     │             │
│  ┌─────────────────┐    ┌──────────────────┐      │             │
│  │ [Pharmacy]      │    │ BPHARMA01        │ ← Auto-Fill Happens
│  │ (Auto-filled) ✓ │    │ (Auto-filled) ✓  │      │             │
│  └─────────────────┘    │ (Read-Only)      │      │             │
│                         └──────────────────┘      │             │
│                                                    ↓             │
│                              Toast: "Department 'Pharmacy'      │
│                                      auto-filled"              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Process

### BEFORE SELECTION
```
┌──────────────────────────────────────┐
│ Course Dropdown                      │
│ ┌────────────────────────────────┐  │
│ │ Select Course        ▼          │  │
│ └────────────────────────────────┘  │
│                                      │
│ Department: [Empty]                 │
│ Department Code: [Empty]            │
└──────────────────────────────────────┘
```

### DROPDOWN OPENED
```
┌──────────────────────────────────────┐
│ Course Dropdown ▼                    │
│ ├─ B.Pharm                           │
│ ├─ D.Pharm                           │
│ ├─ M.Pharm                           │
│ └─ Ph.D. (Pharmacy)                  │
│                                      │
│ Department: [Empty]                 │
│ Department Code: [Empty]            │
└──────────────────────────────────────┘
```

### USER SELECTS "B.PHARM"
```
┌──────────────────────────────────────┐
│ Course: B.Pharm (Selected)           │
│                                      │
│ [System processes...]               │
│                                      │
│ Department: [Updating...]           │
│ Department Code: [Updating...]      │
└──────────────────────────────────────┘
```

### AFTER AUTO-FILL COMPLETES ✓
```
┌──────────────────────────────────────┐
│ Course: B.Pharm ✓                    │
│                                      │
│ Department: Pharmacy ✓               │
│ (Auto-filled)                        │
│                                      │
│ Department Code: BPHARMA01 ✓         │
│ (Auto-filled, Read-Only)            │
│                                      │
│ Toast: ✓ Department auto-filled      │
└──────────────────────────────────────┘
```

---

## Data Lookup Process

```
                    DATABASE
                  (course_details)
                    ┌─────────────┐
                    │  id | Course │
                    │     | Name   │
                    │  1  │B.Pharm │
                    │  2  │B.Pharm │
                    │  3  │D.Pharm │
                    │  4  │M.Pharm │
                    └─────────────┘
                           ↑
                           │ Step 1:
                           │ Query by Course_Name
                           │
                    FRONTEND
                    ┌──────────────┐
                    │ User selects │
                    │ "B.Pharm"    │
                    └──────────────┘
                           │
                           │ Step 2:
                           ↓
                    ┌──────────────────────┐
                    │ const matchingDept   │
                    │ = departments.find(  │
                    │   d.Course_Name      │
                    │   === "B.Pharm"      │
                    │ )                    │
                    └──────────────────────┘
                           │
                           │ Step 3:
                           │ Returns matching record
                           ↓
                    ┌─────────────────────┐
                    │ matchingDept = {     │
                    │   Course_Name:       │
                    │     "B.Pharm"        │
                    │   Dept_Name:         │
                    │     "Pharmacy"       │
                    │   Dept_Code:         │
                    │     "BPHARMA01"      │
                    │ }                    │
                    └─────────────────────┘
                           │
                           │ Step 4:
                           │ Auto-fill form
                           ↓
                    ┌──────────────────────┐
                    │ setForm({            │
                    │   Dept_Name:         │
                    │     "Pharmacy",      │
                    │   Dept_Code:         │
                    │     "BPHARMA01"      │
                    │ })                   │
                    └──────────────────────┘
                           │
                           │ Step 5:
                           │ Display on screen
                           ↓
                    ┌──────────────────────┐
                    │ Department: Pharmacy │
                    │ Code: BPHARMA01 ✓    │
                    └──────────────────────┘
```

---

## Course → Department Mapping

```
COURSE SELECTION         AUTO-FILL RESULTS
═════════════════════════════════════════════════════════════

B.Pharm                  Department: Pharmacy
  ↓                      Department Code: BPHARMA01
  └─→ [Table Lookup]
      (course_details)

D.Pharm                  Department: Pharmacy
  ↓                      Department Code: DPHARMA01
  └─→ [Table Lookup]
      (course_details)

M.Pharm                  Department: Pharmacology
  ↓                      Department Code: MPHARMA01
  └─→ [Table Lookup]
      (course_details)

Ph.D. (Pharmacy)         Department: Pharmacy Research
  ↓                      Department Code: PHD01
  └─→ [Table Lookup]
      (course_details)
```

---

## Event Timeline

```
┌─────────────────────────────────────────────────────────────┐
│                    TIME PROGRESSION                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ T=0ms     User clicks Course dropdown                      │
│ T=50ms    Dropdown opens, shows options                    │
│ T=100ms   User selects "B.Pharm"                           │
│           └─→ onChange event triggered                      │
│                                                             │
│ T=105ms   handleChange function executes                   │
│           └─→ if (name === 'Course_Name') { ... }          │
│                                                             │
│ T=110ms   Search departments array                         │
│           └─→ departments.find(d =>                         │
│               d.Course_Name === "B.Pharm")                  │
│                                                             │
│ T=115ms   Match found! {                                   │
│             Dept_Name: "Pharmacy",                         │
│             Dept_Code: "BPHARMA01"                         │
│           }                                                 │
│                                                             │
│ T=120ms   Update form state                                │
│           └─→ setForm(prev => ({                            │
│               Dept_Name: "Pharmacy",                        │
│               Dept_Code: "BPHARMA01"                        │
│             }))                                             │
│                                                             │
│ T=125ms   React re-renders component                       │
│           └─→ Department field shows: "Pharmacy"            │
│           └─→ Dept_Code field shows: "BPHARMA01"            │
│                                                             │
│ T=130ms   Toast notification shown                         │
│           └─→ "Department 'Pharmacy' auto-filled"           │
│                                                             │
│ T=2130ms  Toast auto-hides                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Total time: ~130ms (imperceptible to user - instant)
```

---

## Field States

```
FIELD STATE TRANSITIONS:

Department Field:
┌──────────────────────────────────────┐
│ BEFORE    │ DURING    │ AFTER        │
├───────────┼───────────┼──────────────┤
│ Empty     │ Updating  │ "Pharmacy" ✓ │
│ Type:     │ Type:     │ Type: text   │
│ select    │ select    │ (dropdown)   │
│ (disabled)│           │ (dynamic)    │
└──────────────────────────────────────┘

Department Code Field:
┌──────────────────────────────────────┐
│ BEFORE    │ DURING    │ AFTER        │
├───────────┼───────────┼──────────────┤
│ Empty     │ Updating  │ "BPHARMA01"✓│
│ Type:     │ Type:     │ Type: input  │
│ input     │ input     │ (read-only)  │
│ (read-    │           │ (disabled)   │
│  only)    │           │              │
└──────────────────────────────────────┘
```

---

## Browser DevTools View

### Console Logs
```javascript
// When course is selected:
"Course selected: B.Pharm"

// When department is found:
"Matching department found: {
  Course_Name: "B.Pharm",
  Dept_Name: "Pharmacy",
  Dept_Code: "BPHARMA01"
}"

// When API call is made:
"Fetching: /api/studentMaster/latest-serials?deptCode=BPHARMA01"
```

### Network Tab
```
GET /api/studentMaster/metadata
Status: 200 OK
Response: {
  courses: [
    { Course_Name: "B.Pharm" },
    { Course_Name: "D.Pharm" },
    ...
  ],
  departments: [
    { Course_Name: "B.Pharm", Dept_Name: "Pharmacy", Dept_Code: "BPHARMA01" },
    ...
  ]
}
```

---

## Error Handling

```
SCENARIO 1: No Data in Database
┌─────────────────────────────┐
│ Course dropdown shows:      │
│ ⚠ "Loading courses..."      │
│ ⚠ "No courses available.    │
│    Check database."         │
└─────────────────────────────┘

SCENARIO 2: Course Selected but No Departments
┌─────────────────────────────┐
│ Department dropdown shows:  │
│ ℹ "No departments for      │
│    this course."           │
└─────────────────────────────┘

SCENARIO 3: All Good ✓
┌─────────────────────────────┐
│ Course: B.Pharm ✓           │
│ Department: Pharmacy ✓      │
│ Dept Code: BPHARMA01 ✓      │
│ Toast: Success ✓            │
└─────────────────────────────┘
```

---

## Full User Workflow

```
START
  │
  ├─ User opens Student Details form
  │
  ├─ Sees Course dropdown with options:
  │  ├─ B.Pharm
  │  ├─ D.Pharm
  │  ├─ M.Pharm
  │  └─ Ph.D. (Pharmacy)
  │
  ├─ User clicks on "B.Pharm"
  │
  ├─ SYSTEM AUTOMATICALLY:
  │  ├─ Searches course_details table
  │  ├─ Finds Department: "Pharmacy"
  │  ├─ Finds Department Code: "BPHARMA01"
  │  ├─ Fills Department field
  │  ├─ Fills Department Code field
  │  └─ Shows success toast
  │
  ├─ User sees:
  │  ├─ Course: B.Pharm (selected)
  │  ├─ Department: Pharmacy (auto-filled) ✓
  │  └─ Dept Code: BPHARMA01 (auto-filled) ✓
  │
  ├─ User can now continue filling other fields
  │  ├─ Or change course to trigger new auto-fill
  │  └─ Or manually select different department
  │
  └─ END

ADVANTAGES:
✓ Saves user time
✓ Prevents manual entry errors
✓ Ensures data consistency
✓ Automatic and immediate
```

---

**Visual Guide Complete!** 📊
