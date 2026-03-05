# Student UID Feature - Visual Flow Diagram

## Overall Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      ADMITTING STUDENT FORM                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Application No: [20235261] ◀── User Selects                       │
│         ↓                                                            │
│  [Triggers handleInputChange]                                       │
│         ↓                                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Frontend: generateStudentUID(20235261)                     │   │
│  │  - Check if UID already exists                              │   │
│  │  - Make API call to backend                                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│         ↓                                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  API: GET /api/studentMaster/check-uid/20235261             │   │
│  │  Backend: checkAndGenerateUID()                             │   │
│  │  - Query database for existing UID                          │   │
│  │  - OR find next sequence number                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│         ↓                                                            │
│  Backend Response:                                                   │
│  ├─ Case 1: Found existing UID                                      │
│  │  └─ {uid: "20235261001", isExisting: true}                       │
│  │                                                                  │
│  └─ Case 2: No existing UID                                         │
│     └─ {uid: null, nextSequence: 2, isExisting: false}              │
│         (Frontend generates: "20235261" + "002" = "20235261002")    │
│         ↓                                                            │
│  Student UID: [20235261001 or 20235261002] ◀─ Auto-populated       │
│         ↓                                                            │
│  [User fills other fields]                                          │
│         ↓                                                            │
│  [Click Save]                                                       │
│         ↓                                                            │
│  POST /api/studentMaster/create                                     │
│  {                                                                  │
│    application_no: "20235261",                                      │
│    student_uid: "20235261001",                                      │
│    ... other fields ...                                             │
│  }                                                                  │
│         ↓                                                            │
│  Database: INSERT into student_master                               │
│  ├─ Application_No: 20235261                                        │
│  ├─ Student_UID: 20235261001                                        │
│  └─ ... other fields ...                                            │
│         ↓                                                            │
│  Success! Student saved with UID                                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Database Query Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  checkAndGenerateUID(applicationNo: "20235261")                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 1: Check if UID already exists                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ SELECT Student_UID FROM student_master                   │   │
│  │ WHERE Application_No = "20235261"                         │   │
│  │   AND Student_UID IS NOT NULL                            │   │
│  │   AND Student_UID != ''                                  │   │
│  │ LIMIT 1                                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│       ↓                                                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ If FOUND: Return {uid: "20235261001"}  ──┐              │    │
│  │ If NOT found: Continue to Step 2         │              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                 │                │
│  Step 2: Find highest sequence number          │                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ SELECT Student_UID FROM student_master                   │   │
│  │ WHERE Application_No = "20235261"                         │   │
│  │   AND Student_UID LIKE "20235261%"                       │   │
│  │ ORDER BY Student_UID DESC                                │   │
│  │ LIMIT 1                                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│       ↓                                                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Found: "20235261001"                                    │   │
│  │ Extract sequence: "001" → parseInt = 1                   │   │
│  │ Next sequence: 1 + 1 = 2                                 │   │
│  │                                                          │   │
│  │ Return {nextSequence: 2}                                 │   │
│  │ Frontend generates: "20235261" + "002" = "20235261002"  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## State Flow

```
Initial State:
├─ entry_type: "Regular"
├─ application_no: ""
├─ name: ""
├─ status: ""
├─ branch_sec: ""
├─ dept_code: ""
├─ roll_no: ""
├─ reg_no: ""
├─ community: ""
├─ allocated_quota: ""
└─ student_uid: "" ◀───── NEW FIELD


After Application Selection:
├─ entry_type: "Regular"
├─ application_no: "20235261" ◀────── USER SELECTED
├─ name: "AKASH A" ◀───────────────── AUTO-FILLED
├─ status: "Confirm" ◀────────────── AUTO-FILLED
├─ branch_sec: "B.PHARM" ◀─────────── AUTO-FILLED
├─ dept_code: "2000" ◀──────────────── AUTO-FILLED
├─ roll_no: "2300200100001" ◀────────── AUTO-FILLED
├─ reg_no: "REG001" ◀───────────────── AUTO-FILLED
├─ community: "General" ◀────────────── AUTO-FILLED
├─ allocated_quota: "Government" ◀──── AUTO-FILLED
└─ student_uid: "20235261001" ◀────── AUTO-GENERATED NEW!


Ready to Submit:
├─ All required fields filled ✓
├─ UID generated/fetched ✓
└─ Ready for POST to /api/studentMaster/create
```

## Sequence Diagram: Creating First Student

```
User                 Frontend              Backend              Database
 │                      │                    │                    │
 ├─ Select App Num ────>│                    │                    │
 │                      │                    │                    │
 │                      ├─ Call getStudents─>│                    │
 │                      │                    ├─ Query ────────────>│
 │                      │                    │                    │
 │                      │                    │<─ Return data ──────┤
 │                      │<─ Return data ─────┤                    │
 │                      │                    │                    │
 │                      ├─ Call checkUID ──>│                    │
 │                      │   /check-uid/20...│                    │
 │                      │                    ├─ Query ────────────>│
 │                      │                    │  No existing UID    │
 │                      │                    │<─ Find sequence ────┤
 │                      │                    │  nextSeq = 1       │
 │                      │<─ Return nextSeq ─┤                    │
 │                      │                    │                    │
 │                      ├─ Generate UID ────┐                    │
 │                      │  20235261 + 001   │                    │
 │                      │  = 20235261001    │                    │
 │                      │                    │                    │
 │  Auto-filled form    │                    │                    │
 │<─ Show UID: 20...001─┤                    │                    │
 │                      │                    │                    │
 ├─ Fill other fields ──>│                    │                    │
 │                      │                    │                    │
 ├─ Click Save ────────>│                    │                    │
 │                      ├─ POST /create ───>│                    │
 │                      │  {uid: 20...001}  │                    │
 │                      │                    ├─ INSERT ──────────>│
 │                      │                    │  Student_UID: ... │
 │                      │                    │<─ Success ─────────┤
 │                      │<─ Success response─┤                    │
 │<─ Show success ──────┤                    │                    │
 │  Student created!    │                    │                    │
 │  UID saved           │                    │                    │
```

## Sequence Diagram: Creating Second Student with Same Application

```
User                 Frontend              Backend              Database
 │                      │                    │                    │
 ├─ Select Same App ───>│                    │                    │
 │  No: 20235261        │                    │                    │
 │                      │                    │                    │
 │                      ├─ Call checkUID ──>│                    │
 │                      │                    │                    │
 │                      │                    ├─ Query ────────────>│
 │                      │                    │  Find 20235261001  │
 │                      │                    │<─ Sequence: 1 ─────┤
 │                      │                    │  (highest existing) │
 │                      │                    │                    │
 │                      │<─ nextSeq = 2 ────┤                    │
 │                      │                    │                    │
 │                      ├─ Generate UID ────┐                    │
 │                      │  20235261 + 002   │                    │
 │                      │  = 20235261002    │                    │
 │                      │                    │                    │
 │  Different UID       │                    │                    │
 │<─ Show UID: 20...002─┤                    │                    │
 │                      │                    │                    │
 ├─ Fill form fields ──>│                    │                    │
 │  (different student) │                    │                    │
 │                      │                    │                    │
 ├─ Click Save ────────>│                    │                    │
 │                      ├─ POST /create ───>│                    │
 │                      │  {uid: 20...002}  │                    │
 │                      │                    ├─ INSERT ──────────>│
 │                      │                    │  Student_UID: 002 │
 │                      │                    │<─ Success ─────────┤
 │                      │<─ Success response─┤                    │
 │<─ Show success ──────┤                    │                    │
 │  Different UID for   │                    │                    │
 │  same application    │                    │                    │
```

## Component Relationship

```
AdmittingStudent Component
├── State: formData (includes student_uid)
├── Functions:
│   ├── generateStudentUID(applicationNo) ◀──── NEW
│   │   └─ Calls: /api/studentMaster/check-uid/{applicationNo}
│   │
│   ├── handleInputChange(e)
│   │   ├─ Handles: application_no selection
│   │   ├─ Calls: generateStudentUID()
│   │   └─ Updates: formData.student_uid
│   │
│   ├── handleSave(e)
│   │   ├─ Collects: formData (includes student_uid)
│   │   └─ Calls: createStudent() or updateStudent()
│   │
│   └── handleEdit(student)
│       └─ Populates: formData including student_uid
│
├── UI Elements:
│   ├── Application Number Select ◀─── Triggers UID generation
│   │   ↓
│   ├── ValidatedInput (Student UID) ◀── Displays generated UID
│   │   └─ ReadOnly (cannot be edited)
│   │
│   └── Form Submit Button
│       └─ Sends student_uid to backend
│
└── API Endpoints:
    ├── /api/studentMaster/check-uid/{applicationNo} ◀── NEW
    ├── /api/studentMaster/create (updated)
    └── /api/studentMaster/update/:id (updated)
```

## Database Schema Changes

```
BEFORE:
┌─────────────────────────┐
│    student_master       │
├─────────────────────────┤
│ Id                      │
│ Application_No          │
│ Student_Name            │
│ Admission_Status        │
│ Dept_Name               │
│ Dept_Code               │
│ Roll_Number             │
│ Register_No             │
│ Community               │
│ Allocated_Quota         │
│ ... other columns ...   │
└─────────────────────────┘

AFTER:
┌─────────────────────────┐
│    student_master       │
├─────────────────────────┤
│ Id                      │
│ Application_No          │
│ Student_Name            │
│ Admission_Status        │
│ Dept_Name               │
│ Dept_Code               │
│ Roll_Number             │
│ Register_No             │
│ Community               │
│ Allocated_Quota         │
│ Student_UID ◀─── NEW!   │
│ ... other columns ...   │
└─────────────────────────┘

Example Data:
┌────┬─────────────────┬──────────────────┬─────────────────┐
│ Id │ Application_No  │ Student_Name     │ Student_UID     │
├────┼─────────────────┼──────────────────┼─────────────────┤
│ 1  │ 20235261        │ AKASH A          │ 20235261001     │
│ 2  │ 20235262        │ BAVITHRA B       │ 20235262001     │
│ 3  │ 20235261        │ BHARATH S        │ 20235261002     │
│ 4  │ 20235263        │ DHARMA N         │ 20235263001     │
└────┴─────────────────┴──────────────────┴─────────────────┘
```

---

## Key Points to Remember

1. **UID Format**: `{application_number}{3-digit-sequence}`
   - Example: 20235261001, 20235261002, 20235262001

2. **Generation Logic**: 
   - Look for existing UID → Return it
   - No existing → Find highest sequence → Increment → Generate new

3. **Frontend vs Backend**:
   - Frontend: Calls API to check/get nextSequence, then generates UID
   - Backend: Queries database, finds sequences, returns data

4. **Read-Only Field**:
   - UID field is read-only to prevent user mistakes
   - Cannot be manually edited
   - Always auto-generated/fetched

5. **Data Persistence**:
   - UID is stored in Student_UID column
   - Retrieved on edit/reload
   - Part of all CRUD operations
