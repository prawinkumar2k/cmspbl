# 🔄 MySQL → MongoDB Full Migration Plan
## CMS / SF-ERP College Management System

**Project:** SF-ERP Backend  
**Current:** MySQL + mysql2 (ESM, Node.js 20+)  
**Target:** MongoDB + Mongoose (ESM, same Node.js 20+)  
**Scale:** 94 controllers · 87 routes · 60+ tables · 700+ SQL queries  
**Estimated Duration:** 6–8 weeks (solo dev, part-time) | 2–3 weeks (full-time dedicated)

---

## 📋 TABLE OF CONTENTS

1. [Pre-Migration Checklist](#pre-migration-checklist)
2. [Schema Design Strategy](#schema-design-strategy)
3. [Complete Table → Mongoose Model Mapping](#complete-table--mongoose-model-mapping)
4. [SQL → Mongoose Query Translation Guide](#sql--mongoose-query-translation-guide)
5. [Phase 1: Foundation Setup](#phase-1-foundation-setup-week-1)
6. [Phase 2: Core Modules](#phase-2-core-modules-week-2)
7. [Phase 3: Academic Modules](#phase-3-academic-modules-week-3)
8. [Phase 4: Finance & HR Modules](#phase-4-finance--hr-modules-week-4)
9. [Phase 5: Examination & Library Modules](#phase-5-examination--library-modules-week-5)
10. [Phase 6: Admission & Remaining Modules](#phase-6-admission--remaining-modules-week-6)
11. [Phase 7: Data Migration](#phase-7-data-migration-week-7)
12. [Phase 8: Testing & Cutover](#phase-8-testing--cutover-week-8)
13. [config/index.js Changes](#configindexjs-changes)
14. [Critical SQL Patterns & Their MongoDB Equivalents](#critical-sql-patterns--their-mongodb-equivalents)

---

## ✅ Pre-Migration Checklist

Before writing a single line of code:

- [ ] **Back up your MySQL database** (`cms.sql` already exists ✅)
- [ ] **Back up `project_transfer_backup.sql`** ✅
- [ ] Install MongoDB locally OR get MongoDB Atlas cluster URI
- [ ] Install MongoDB Compass (GUI tool for visualizing data)
- [ ] Read the entire Schema Design Strategy section below
- [ ] Decide: **MongoDB Atlas (cloud)** OR **local MongoDB** (for dev)
- [ ] Set `NODE_ENV=development` during entire migration
- [ ] Set up Git branch: `git checkout -b feature/mongodb-migration`

---

## 📐 Schema Design Strategy

### Rule 1: When to EMBED vs. REFERENCE

| MySQL Pattern | MongoDB Decision | Reason |
|---|---|---|
| `student_education_details` (linked to student_master via Application_No) | **EMBED** inside Student document | Always queried together, never updated independently |
| `hr_payroll` (linked to staff_master via staff_id) | **REFERENCE** (ObjectId → StaffMaster) | Payroll updated independently per month |
| `book_issue` (linked to book_master + student_master) | **REFERENCE** both | Both updated separately |
| `fee_collection` (linked to student) | **REFERENCE** | Queried independently for reports |
| `sidebar_modules` | **Standalone collection** + array in User | Queried with module_access filter |

### Rule 2: Handling Comma-Separated Strings

Your current MySQL uses comma-separated strings for `module_access`:
```
# MySQL: "dashboard,file,academic,hr"
# MongoDB: ["dashboard", "file", "academic", "hr"]  ← Use Array!
```

### Rule 3: Date Handling

```
# MySQL: STR_TO_DATE(?, '%Y-%m-%d'), CURDATE(), DATE_FORMAT()
# MongoDB: Store as native Date objects, query with $gte/$lte
```

### Rule 4: Auto-Increment IDs → ObjectId

```
# MySQL: id INT AUTO_INCREMENT PRIMARY KEY
# MongoDB: _id ObjectId (auto-generated)
# Your custom IDs (Staff_ID, Register_Number): Keep as String fields with index: true, unique: true
```

---

## 📦 Complete Table → Mongoose Model Mapping

### GROUP 1: Authentication & Users

| MySQL Table | Mongoose Model | Strategy |
|---|---|---|
| `users` | `User` | Direct mapping, module_access → Array |
| `users_roles` | `Role` | Simple collection |
| `sidebar_modules` | `SidebarModule` | Direct mapping |

### GROUP 2: Student Module

| MySQL Table | Mongoose Model | Strategy |
|---|---|---|
| `student_master` | `Student` | Main model |
| `student_education_details` | **Embedded in Student** | Sub-document |
| `student_master_academic` | **Embedded in Student** | Sub-document |

### GROUP 3: Staff & HR

| MySQL Table | Mongoose Model | Strategy |
|---|---|---|
| `staff_master` | `Staff` | Main model |
| `hr_staff_salary` | **Embedded in Staff** | Sub-document (salary structure) |
| `hr_payroll` | `Payroll` | Reference → Staff |
| `hr_leave` | `Leave` | Reference → Staff |
| `hr_attendance` | `HrAttendance` | Reference → Staff |
| `designation_master` | `Designation` | Simple collection |

### GROUP 4: Academic Module

| MySQL Table | Mongoose Model | Strategy |
|---|---|---|
| `course_details` | `Course` | Main model (branch info) |
| `subject_master` | `Subject` | Reference → Course |
| `subject_allocation` | `SubjectAllocation` | Reference → Subject + Staff + Student |
| `class_allocation` | `ClassAllocation` | Reference → Course + Staff |
| `class_timetable` | `ClassTimetable` | Reference → ClassAllocation |
| `academic_year_master` | `AcademicYear` | Simple collection |
| `regulation_master` | `Regulation` | Simple collection |
| `semester_master` | `Semester` | Simple collection |
| `attendance_config` | `AttendanceConfig` | Reference → Course |
| `academic_calendar` | `AcademicCalendar` | Standalone |

### GROUP 5: Attendance Module

| MySQL Table | Mongoose Model | Strategy |
|---|---|---|
| `student_attendance_entry` | `StudentAttendance` | Reference → Student |
| `overall_att_date_wise` | `OverallAttendance` | Aggregated view → **Computed collection** |
| `dept_attendance_date_wise` | `DeptAttendance` | Computed/Aggregated |

> **⚠️ IMPORTANT:** `overall_att_date_wise` and `dept_attendance_date_wise` are likely **MySQL VIEWs** or computed tables. In MongoDB, these become **aggregation pipelines** on `StudentAttendance`.

### GROUP 6: Examination Module

| MySQL Table | Mongoose Model | Strategy |
|---|---|---|
| `hall_master` | `Hall` | Simple collection |
| `exam_timetable` | `ExamTimetable` | Reference → Course + Subject |
| `exam_generation` | `ExamGeneration` | Reference → Student + Hall |
| `seat_allocation` | `SeatAllocation` | Reference → ExamGeneration |
| `unit_test_marks` | `UnitTestMark` | Reference → Student + Subject |
| `practical_marks` | `PracticalMark` | Reference → Student + Subject |
| `practical_panel` | `PracticalPanel` | Reference → Staff + Subject |
| `practical_timetable` | `PracticalTimetable` | Reference → Course + Subject |
| `assignment_marks` | `AssignmentMark` | Reference → Student + Subject |
| `nominal_roll` | `NominalRoll` | Reference → Student |
| `arrear` | `Arrear` | Reference → Student + Subject |

### GROUP 7: Fee & Finance Module

| MySQL Table | Mongoose Model | Strategy |
|---|---|---|
| `fee_master` | `FeeMaster` | Simple collection |
| `course_fees` | `CourseFee` | Reference → Course + FeeMaster |
| `student_fee_master` | `StudentFeeMaster` | Reference → Student |
| `fee_ledger` | `FeeLedger` | Reference → Student |
| `fee_collection` | `FeeCollection` | Reference → Student |
| `fee_receipt` | `FeeReceipt` | Reference → Student + FeeCollection |
| `challan` | `Challan` | Reference → Student |
| `income_expense` | `IncomeExpense` | Standalone |
| `income_expense_master` | `IncomeExpenseMaster` | Simple collection |
| `settlement` | `Settlement` | Reference → Student |

### GROUP 8: Library Module

| MySQL Table | Mongoose Model | Strategy |
|---|---|---|
| `book_master` | `Book` | Main model |
| `book_issue` | `BookIssue` | Reference → Book + Student/Staff |
| `fine_master` | `Fine` | Reference → BookIssue |

### GROUP 9: Admission Module

| MySQL Table | Mongoose Model | Strategy |
|---|---|---|
| `student_enquiry` | `StudentEnquiry` | Standalone |
| `application_issue` | `ApplicationIssue` | Reference → StudentEnquiry |
| `admitted_student` | `AdmittedStudent` | Reference → ApplicationIssue |
| `quota_allocation` | `QuotaAllocation` | Reference → Course |
| `lead_management` | `Lead` | Standalone |

### GROUP 10: Transport Module

| MySQL Table | Mongoose Model | Strategy |
|---|---|---|
| `transport_master` | `Transport` | Main model |
| `transport_entry` | `TransportEntry` | Reference → Transport + Student |

### GROUP 11: Admin/Operations

| MySQL Table | Mongoose Model | Strategy |
|---|---|---|
| `stock_master` | `Stock` | Standalone |
| `purchase_master` | `Purchase` | Standalone |
| `asset_master` | `Asset` | Standalone |
| `send_letters` | `SendLetter` | Standalone |
| `receive_letters` | `ReceiveLetter` | Standalone |
| `memo` | `Memo` | Reference → Student/Staff |
| `activity_logs` | `ActivityLog` | Standalone |
| `tc_details` | `TC` | Reference → Student |

---

## 🔄 SQL → Mongoose Query Translation Guide

### 1. Basic CRUD

```js
// ❌ MySQL: SELECT * FROM users
const [rows] = await db.query('SELECT * FROM users');
// ✅ MongoDB:
const users = await User.find();

// ❌ MySQL: SELECT * FROM users WHERE id = ?
const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
// ✅ MongoDB:
const user = await User.findById(id);

// ❌ MySQL: INSERT INTO users (name, email) VALUES (?, ?)
await db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
// ✅ MongoDB:
await User.create({ name, email });

// ❌ MySQL: UPDATE users SET name = ? WHERE id = ?
await db.query('UPDATE users SET name = ? WHERE id = ?', [name, id]);
// ✅ MongoDB:
await User.findByIdAndUpdate(id, { name }, { new: true });

// ❌ MySQL: DELETE FROM users WHERE id = ?
await db.query('DELETE FROM users WHERE id = ?', [id]);
// ✅ MongoDB:
await User.findByIdAndDelete(id);
```

### 2. JOINs → populate()

```js
// ❌ MySQL: LEFT JOIN staff_master sm ON p.staff_id = sm.Staff_ID
const [rows] = await db.query(`
  SELECT p.*, sm.Staff_Name, sm.Dept_Name
  FROM hr_payroll p
  LEFT JOIN staff_master sm ON p.staff_id = sm.Staff_ID
  WHERE p.month = ? AND p.year = ?
`, [month, year]);

// ✅ MongoDB: Define ref in schema, then populate
const payrolls = await Payroll.find({ month, year })
  .populate('staffId', 'staffName deptName designation');
```

### 3. Aggregate / COUNT / SUM / GROUP BY

```js
// ❌ MySQL:
const [result] = await db.query(
  "SELECT COUNT(DISTINCT id) as total FROM student_master WHERE Admission_Status = 'Admitted'"
);
const total = result[0].total;

// ✅ MongoDB:
const total = await Student.countDocuments({ admissionStatus: 'Admitted' });

// ❌ MySQL: SUM with GROUP BY department
SELECT Dept_Name, SUM(Amount_Paid) as total FROM fee_collection GROUP BY Dept_Name

// ✅ MongoDB: Aggregation pipeline
const result = await FeeCollection.aggregate([
  { $group: { _id: '$deptName', total: { $sum: '$amountPaid' } } },
  { $project: { deptName: '$_id', total: 1, _id: 0 } }
]);
```

### 4. Date Queries (STR_TO_DATE → Date range)

```js
// ❌ MySQL:
SELECT COUNT(*) FROM student_attendance_entry
WHERE DATE(Att_Date) = STR_TO_DATE(?, '%Y-%m-%d') AND Att_Status = 'present'

// ✅ MongoDB: Use date range for full day
const startOfDay = new Date(date);
startOfDay.setHours(0, 0, 0, 0);
const endOfDay = new Date(date);
endOfDay.setHours(23, 59, 59, 999);

const count = await StudentAttendance.countDocuments({
  attDate: { $gte: startOfDay, $lte: endOfDay },
  attStatus: 'present'
});
```

### 5. CURDATE() → new Date()

```js
// ❌ MySQL: WHERE due_date < CURDATE()
WHERE (return_date IS NULL) AND due_date < CURDATE()

// ✅ MongoDB:
const overdueCount = await BookIssue.countDocuments({
  returnDate: null,
  dueDate: { $lt: new Date() }
});
```

### 6. FIND_IN_SET (module_access) → $in with Array

```js
// ❌ MySQL FIND_IN_SET pattern → replaced by module_access array in MongoDB
// MySQL: WHERE module_key IN ('dashboard', 'hr', 'finance')
const placeholders = allowedModules.map(() => '?').join(',');
await db.query(`SELECT * FROM sidebar_modules WHERE module_key IN (${placeholders})`, allowedModules);

// ✅ MongoDB (module_access is now an Array in User model):
const modules = await SidebarModule.find({
  moduleKey: { $in: allowedModules },
  isActive: true
}).sort({ displayOrder: 1 });
```

### 7. ON DUPLICATE KEY UPDATE → findOneAndUpdate with upsert

```js
// ❌ MySQL: INSERT ... ON DUPLICATE KEY UPDATE
INSERT INTO hr_payroll (staff_id, month, year, basic_salary, ...)
VALUES ? ON DUPLICATE KEY UPDATE basic_salary = VALUES(basic_salary)

// ✅ MongoDB: upsert
await Payroll.findOneAndUpdate(
  { staffId: p.staffId, month: p.month, year: p.year },   // filter
  { $set: { basicSalary: p.basicSalary, ... } },           // update
  { upsert: true, new: true }                              // create if not exists
);
```

### 8. Bulk INSERT (VALUES ?) → insertMany

```js
// ❌ MySQL: INSERT INTO table (cols) VALUES ? (array of arrays)
await db.query('INSERT INTO hr_payroll (...) VALUES ?', [valuesArray]);

// ✅ MongoDB: insertMany
await Payroll.insertMany(payslips);

// With upsert for each item:
const bulkOps = payslips.map(p => ({
  updateOne: {
    filter: { staffId: p.staffId, month: p.month, year: p.year },
    update: { $set: p },
    upsert: true
  }
}));
await Payroll.bulkWrite(bulkOps);
```

### 9. Dynamic WHERE clauses → Build filter object

```js
// ❌ MySQL dynamic query building:
let query = 'SELECT * FROM hr_payroll WHERE 1=1';
const params = [];
if (month && year) { query += ' AND month = ? AND year = ?'; params.push(month, year); }
if (staffId) { query += ' AND staff_id = ?'; params.push(staffId); }
const [rows] = await db.query(query, params);

// ✅ MongoDB: Build filter object
const filter = {};
if (month && year) { filter.month = month; filter.year = parseInt(year); }
if (staffId) { filter.staffId = staffId; }
const rows = await Payroll.find(filter)
  .populate('staffId', 'staffName deptName designation')
  .sort({ year: -1, month: -1 });
```

### 10. Dashboard Aggregation (Overall Attendance %)

```js
// ❌ MySQL: Queries overall_att_date_wise VIEW
SELECT overall_present_percentage FROM overall_att_date_wise WHERE DATE(Att_Date) = ?

// ✅ MongoDB: Compute it via aggregation
const startOfDay = new Date(date + 'T00:00:00.000Z');
const endOfDay = new Date(date + 'T23:59:59.999Z');

const stats = await StudentAttendance.aggregate([
  { $match: { attDate: { $gte: startOfDay, $lte: endOfDay } } },
  {
    $group: {
      _id: null,
      total: { $sum: 1 },
      present: { $sum: { $cond: [{ $eq: ['$attStatus', 'present'] }, 1, 0] } },
      absent: { $sum: { $cond: [{ $eq: ['$attStatus', 'absent'] }, 1, 0] } },
      onDuty: { $sum: { $cond: [{ $eq: ['$attStatus', 'onDuty'] }, 1, 0] } },
      medicalLeave: { $sum: { $cond: [{ $eq: ['$attStatus', 'medicalLeave'] }, 1, 0] } }
    }
  },
  {
    $project: {
      total: 1,
      present: 1,
      presentPercentage: {
        $multiply: [{ $divide: ['$present', '$total'] }, 100]
      }
    }
  }
]);
```

---

## 🏗️ Phase 1: Foundation Setup (Week 1)

### Step 1.1 — Install MongoDB Packages

```bash
cd server
npm uninstall mysql2
npm install mongoose
```

> **Note:** Keep `dotenv`, `bcryptjs`, `jsonwebtoken`, `express`, `cors`, `helmet`, `multer` — they don't change.

### Step 1.2 — Update .env

```env
# REMOVE these MySQL variables:
# DB_HOST=
# DB_USER=
# DB_PASSWORD=
# DB_NAME=
# DB_PORT=

# ADD this MongoDB variable:
MONGO_URI=mongodb://127.0.0.1:27017/cms_db
# OR for Atlas:
# MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/cms_db?retryWrites=true&w=majority

# Keep all others:
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Step 1.3 — Create New config/db.js (MongoDB connection)

```js
// server/config/db.js
import mongoose from 'mongoose';
import logger from '../lib/logger.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    logger.info(`📦 Database: ${conn.connection.name}`);
  } catch (error) {
    logger.error('❌ MongoDB connection failed:', { error: error.message });
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected');
});

export default connectDB;
```

### Step 1.4 — Rewrite lib/database.js (MongoDB version)

```js
// server/lib/database.js
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import logger from '../lib/logger.js';

export const healthCheck = async () => {
  try {
    const startTime = Date.now();
    await mongoose.connection.db.admin().ping();
    const duration = Date.now() - startTime;
    return { healthy: true, latency: duration, timestamp: new Date().toISOString() };
  } catch (error) {
    logger.error('MongoDB health check failed', { error: error.message });
    return { healthy: false, error: error.message, timestamp: new Date().toISOString() };
  }
};

export const shutdown = async () => {
  logger.info('Closing MongoDB connections...');
  await mongoose.connection.close();
  logger.info('MongoDB connections closed successfully');
};

export const initialize = async () => {
  await connectDB();
  const health = await healthCheck();
  if (!health.healthy) throw new Error('MongoDB health check failed after connect');
  return health;
};

export const getPoolStats = () => ({
  readyState: mongoose.connection.readyState,
  host: mongoose.connection.host,
  name: mongoose.connection.name,
});

export default { healthCheck, shutdown, initialize, getPoolStats };
```

### Step 1.5 — Update config/index.js (Remove MySQL, Add MongoDB)

Replace the entire `database` section in `config/index.js`:

```js
// REMOVE:
database: {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  ... (all MySQL settings)
}

// REPLACE WITH:
database: {
  uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cms_db',
},
```

Also update the `requiredEnvVars` array:
```js
// CHANGE:
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
// TO:
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
```

### Step 1.6 — Create /server/models/ directory

```
server/models/
  ├── User.js
  ├── Role.js
  ├── SidebarModule.js
  ├── Student.js
  ├── Staff.js
  ├── Course.js
  ├── Subject.js
  ├── SubjectAllocation.js
  ├── StudentAttendance.js
  ├── AttendanceConfig.js
  ├── ClassAllocation.js
  ├── ClassTimetable.js
  ├── AcademicYear.js
  ├── Regulation.js
  ├── Semester.js
  ├── Payroll.js
  ├── Leave.js
  ├── HrAttendance.js
  ├── Designation.js
  ├── FeeMaster.js
  ├── CourseFee.js
  ├── StudentFeeMaster.js
  ├── FeeLedger.js
  ├── FeeCollection.js
  ├── FeeReceipt.js
  ├── Challan.js
  ├── IncomeExpense.js
  ├── IncomeExpenseMaster.js
  ├── Settlement.js
  ├── Hall.js
  ├── ExamTimetable.js
  ├── ExamGeneration.js
  ├── SeatAllocation.js
  ├── UnitTestMark.js
  ├── PracticalMark.js
  ├── PracticalPanel.js
  ├── PracticalTimetable.js
  ├── AssignmentMark.js
  ├── NominalRoll.js
  ├── Arrear.js
  ├── Book.js
  ├── BookIssue.js
  ├── Fine.js
  ├── StudentEnquiry.js
  ├── ApplicationIssue.js
  ├── AdmittedStudent.js
  ├── QuotaAllocation.js
  ├── Lead.js
  ├── Transport.js
  ├── TransportEntry.js
  ├── Stock.js
  ├── Purchase.js
  ├── Asset.js
  ├── SendLetter.js
  ├── ReceiveLetter.js
  ├── Memo.js
  ├── ActivityLog.js
  └── TC.js
```

---

## 🧱 Phase 2: Core Modules (Week 2)

### Priority Models to Build First:

#### models/User.js
```js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  role: { type: String, required: true },
  staffName: { type: String, required: true },
  staffId: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  moduleAccess: { type: [String], default: [] },  // ← Array, NOT comma string
}, { timestamps: true });

export default mongoose.model('User', userSchema);
```

#### models/Role.js
```js
import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  role: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model('Role', roleSchema);
```

#### models/SidebarModule.js
```js
import mongoose from 'mongoose';

const sidebarModuleSchema = new mongoose.Schema({
  moduleName: { type: String, required: true },
  moduleKey: { type: String, required: true, unique: true },
  moduleCategory: { type: String },
  modulePath: { type: String },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 999 }
}, { timestamps: true });

export default mongoose.model('SidebarModule', sidebarModuleSchema);
```

### Controllers to Convert in Phase 2:
- ✅ `authController.js` (login, sidebar, profile, logout)
- ✅ `userController.js` (CRUD users, roles, modules)
- ✅ `logController.js` (activity logs)
- ✅ `branchController.js` (course_details CRUD)
- ✅ `designationMasterController.js`
- ✅ `academicYearMasterController.js`
- ✅ `regulationMasterController.js`
- ✅ `semesterMasterController.js`
- ✅ `dashboardController.js` (requires aggregation pipelines — do this LAST in phase 2)

---

## 🎓 Phase 3: Academic Modules (Week 3)

**Models:** Student (with embedded education), Staff, Subject, SubjectAllocation, ClassAllocation, ClassTimetable, AttendanceConfig, StudentAttendance

**Critical: Student Model with Embedded Education Details**

```js
// models/Student.js
import mongoose from 'mongoose';

const subjectMarkSchema = new mongoose.Schema({
  subject: String, maxMark: Number, obtainedMark: Number
}, { _id: false });

const attemptSchema = new mongoose.Schema({
  marksheetNo: String, registerNo: String, month: String, year: String, totalMarks: Number
}, { _id: false });

const educationSchema = new mongoose.Schema({
  hasSslc: { type: Boolean, default: false },
  hasIti: { type: Boolean, default: false },
  hasVocational: { type: Boolean, default: false },
  hasHsc: { type: Boolean, default: false },
  // SSLC
  sslc: {
    schoolName: String, board: String, yearOfPassing: String,
    registerNo: String, marksheetNo: String,
    subjects: [subjectMarkSchema],
    totalMax: Number, totalObtained: Number, percentage: Number,
    attempts: [attemptSchema]
  },
  // ITI (similar structure)
  iti: { schoolName: String, yearOfPassing: String, subjects: [subjectMarkSchema],
    totalMax: Number, totalObtained: Number, percentage: Number, attempts: [attemptSchema] },
  // VOC (similar)
  vocational: { schoolName: String, yearOfPassing: String, subjects: [subjectMarkSchema],
    totalMax: Number, totalObtained: Number, percentage: Number },
  // HSC
  hsc: { schoolName: String, board: String, yearOfPassing: String,
    registerNo: String, examType: String, majorStream: String,
    subjects: [subjectMarkSchema],
    totalMax: Number, totalObtained: Number, percentage: Number, cutoff: Number }
}, { _id: false });

const studentSchema = new mongoose.Schema({
  applicationNo: { type: String, required: true, unique: true, index: true },
  stdUid: String,
  registerNumber: { type: String, unique: true, sparse: true, index: true },
  studentName: { type: String, required: true },
  gender: String, dob: String, age: Number,
  stdEmail: String, photoPath: String,
  fatherName: String, fatherMobile: String, fatherOccupation: String,
  motherName: String, motherMobile: String, motherOccupation: String,
  guardianName: String, guardianMobile: String, guardianOccupation: String, guardianRelation: String,
  bloodGroup: String, nationality: String, religion: String, community: String, caste: String,
  physicallyChallenged: String, maritalStatus: String, aadhaarNo: String, panNo: String,
  motherTongue: String, emisNumber: String, mediumOfInstruction: String,
  fatherAnnualIncome: Number, motherAnnualIncome: Number, guardianAnnualIncome: Number,
  permanentDistrict: String, permanentState: String, permanentPincode: String, permanentAddress: String,
  currentDistrict: String, currentState: String, currentPincode: String, currentAddress: String,
  bankName: String, bankBranch: String, accountNumber: String, ifscCode: String, micrCode: String,
  scholarship: String, firstGraduate: String, bankLoan: String,
  modeOfJoining: String, reference: String, present: String,
  courseName: String, deptName: String, deptCode: String,
  semester: String, year: String, admissionDate: String,
  hostelRequired: String, transportRequired: String, admissionStatus: String,
  studentMobile: String, rollNumber: String, regulation: String,
  classTeacher: String, class: String, allocatedQuota: String,
  education: educationSchema,   // ← EMBEDDED
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);
```

**Controllers to Convert in Phase 3:**
- ✅ `studentMasterController.js` (1016 lines → biggest rewrite)
- ✅ `staffDetails.js`
- ✅ `subjectController.js`
- ✅ `subjectAllocation.js`
- ✅ `classController.js`
- ✅ `classTimeTableController.js`
- ✅ `attConfig.js`
- ✅ `dailyAttController.js`
- ✅ `markedAttController.js`
- ✅ `attReportController.js`
- ✅ `staffMasterController.js`

---

## 💰 Phase 4: Finance & HR Modules (Week 4)

**Models:** Payroll, Leave, HrAttendance, FeeMaster, CourseFee, StudentFeeMaster, FeeLedger, FeeCollection, FeeReceipt, Challan, IncomeExpense, Settlement

**Critical Pattern: ON DUPLICATE KEY → bulkWrite upsert**

```js
// models/Payroll.js
import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
  staffId: { type: String, required: true, index: true },
  staffRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  basicSalary: Number, hra: Number, da: Number, ta: Number, specialAllowance: Number,
  grossSalary: Number,
  pfDeduction: Number, esiDeduction: Number, professionalTax: Number, tds: Number,
  totalDeductions: Number, netSalary: Number,
  status: { type: String, enum: ['generated', 'paid'], default: 'generated' },
  paidDate: Date
}, { timestamps: true });

// Compound unique index (replaces ON DUPLICATE KEY)
payrollSchema.index({ staffId: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model('Payroll', payrollSchema);
```

**Controllers to Convert in Phase 4:**
- ✅ `hrPayrollController.js`
- ✅ `hrLeaveController.js`
- ✅ `hrAttendanceController.js`
- ✅ `feeMasterController.js`
- ✅ `courseFeesController.js`
- ✅ `studentFeeMasterController.js`
- ✅ `feeLedgerController.js`
- ✅ `feeCollectionController.js`
- ✅ `feeReceiptController.js`
- ✅ `challanController.js`
- ✅ `incomeController.js`
- ✅ `IncomeExpenseController.js`
- ✅ `incomeExpenseMasterController.js`
- ✅ `settlementController.js`

---

## 📚 Phase 5: Examination & Library Modules (Week 5)

**Models:** Hall, ExamTimetable, ExamGeneration, SeatAllocation, UnitTestMark, PracticalMark, AssignmentMark, NominalRoll, Arrear, Book, BookIssue, Fine

**Controllers to Convert in Phase 5:**
- ✅ `hallController.js`
- ✅ `timetableController.js`
- ✅ `examGenerationController.js` (30KB — 2nd biggest rewrite)
- ✅ `seatAllocationController.js`
- ✅ `examAttendanceController.js`
- ✅ `checklistController.js`
- ✅ `qpRequirementController.js`
- ✅ `strengthListController.js`
- ✅ `digitalNumberingController.js`
- ✅ `daywarStatementsController.js`
- ✅ `theoryNameListController.js`
- ✅ `unitTestController.js` (23KB)
- ✅ `practicalMarkController.js` (27KB)
- ✅ `PracticalTimeTableController.js`
- ✅ `practicalController.js`
- ✅ `practicalExamController.js`
- ✅ `practicalPanelController.js`
- ✅ `assignmentMarkController.js` (24KB)
- ✅ `UNIVMarkEntryController.js`
- ✅ `assConfigControlller.js`
- ✅ `nominalRollController.js`
- ✅ `arrearController.js`
- ✅ `hallChartController.js`
- ✅ `examTimetableController.js`
- All library controllers (book, bookIssue, fine, borrower, etc.)

---

## 📋 Phase 6: Admission & Remaining Modules (Week 6)

**Controllers to Convert:**
- ✅ `studentEnquiryController.js`
- ✅ `applicationIssueController.js`
- ✅ `admittedStudentController.js`
- ✅ `quotaAllocationController.js`
- ✅ `leadManagementController.js`
- ✅ `assignCallController.js`
- ✅ `callerController.js`
- ✅ `enquiryController.js`
- ✅ `transportController.js` (21KB)
- ✅ `transportEntryController.js`
- ✅ `stockController.js` (13KB)
- ✅ `purchaseController.js`
- ✅ `assetController.js`
- ✅ `sendLetterController.js`
- ✅ `receiveLetterController.js`
- ✅ `memoController.js`
- ✅ `studentMemoController.js`
- ✅ `tcController.js`
- ✅ `courseDetailsRoutes.js`
- ✅ `masterDataController.js`
- ✅ `studentloginController.js`
- ✅ `studentAttController.js`
- ✅ `studentTimetableController.js`
- ✅ `studentProfileController.js`
- ✅ `studentMarkController.js`

---

## 🗄️ Phase 7: Data Migration (Week 7)

### Step 7.1 — Export MySQL Data to JSON

Run this from your MySQL environment:

```bash
# Export each table as JSON via mysqldump or custom script
# You already have cms.sql — use this Python script to convert:
```

```python
# mysql_to_json.py — Run this to extract all tables to JSON
import mysql.connector
import json
import os

conn = mysql.connector.connect(
    host='88.222.244.171',
    user='ems_navicat',
    password='Test@12345',
    database='cms'
)
cursor = conn.cursor(dictionary=True)

output_dir = './mysql_export'
os.makedirs(output_dir, exist_ok=True)

cursor.execute("SHOW TABLES")
tables = [row[list(row.keys())[0]] for row in cursor.fetchall()]

for table in tables:
    cursor.execute(f"SELECT * FROM `{table}`")
    rows = cursor.fetchall()
    
    # Convert datetime/date objects to string
    for row in rows:
        for key, value in row.items():
            if hasattr(value, 'isoformat'):
                row[key] = value.isoformat()
    
    with open(f'{output_dir}/{table}.json', 'w') as f:
        json.dump(rows, f, indent=2, default=str)
    
    print(f'✅ Exported {len(rows)} rows from {table}')

cursor.close()
conn.close()
print('Done!')
```

### Step 7.2 — Import JSON into MongoDB

```js
// scripts/migrateData.js — Run with: node scripts/migrateData.js
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Import your new models
import User from '../models/User.js';
import Student from '../models/Student.js';
import Staff from '../models/Staff.js';
// ... import all models

const exportDir = './mysql_export';

const readJson = (file) => {
  const filePath = path.join(exportDir, file);
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const migrateUsers = async () => {
  const usersData = readJson('users.json');
  const rolesData = readJson('users_roles.json');
  
  for (const user of usersData) {
    await User.findOneAndUpdate(
      { username: user.username },
      {
        role: user.role,
        staffName: user.staff_name,
        staffId: user.staff_id,
        username: user.username,
        password: user.password,
        moduleAccess: user.module_access ? user.module_access.split(',').map(m => m.trim()) : []
      },
      { upsert: true, new: true }
    );
  }
  console.log(`✅ Migrated ${usersData.length} users`);
};

const migrateStudents = async () => {
  const students = readJson('student_master.json');
  const educations = readJson('student_education_details.json');
  
  // Create a map for fast lookup
  const eduMap = {};
  for (const edu of educations) {
    eduMap[edu.Application_No] = edu;
  }
  
  for (const s of students) {
    const edu = eduMap[s.Application_No];
    await Student.findOneAndUpdate(
      { applicationNo: s.Application_No },
      {
        applicationNo: s.Application_No,
        registerNumber: s.Register_Number,
        studentName: s.Student_Name,
        // ... map all fields
        education: edu ? {
          hasSslc: edu.SSLC === 'Yes',
          hasHsc: edu.HSC === 'Yes',
          sslc: { schoolName: edu.SSLC_School_Name, ... },
          hsc: { schoolName: edu.HSC_School_Name, ... }
        } : {}
      },
      { upsert: true, new: true }
    );
  }
  console.log(`✅ Migrated ${students.length} students`);
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  
  await migrateUsers();
  await migrateStudents();
  // await migrateStaff();
  // ... continue for all collections
  
  await mongoose.disconnect();
  console.log('Migration complete!');
};

run().catch(console.error);
```

---

## 🧪 Phase 8: Testing & Cutover (Week 8)

### Testing Checklist

- [ ] **Auth flow:** Login → JWT → Sidebar modules load
- [ ] **Student CRUD:** Add, edit, delete, view with education details
- [ ] **Dashboard:** All stats compute correctly via aggregation
- [ ] **Attendance:** Mark, report, date queries return correct data
- [ ] **Fee collection:** Fee receipt, ledger balance, challan
- [ ] **Payroll:** Generate, process, report by department
- [ ] **Examination:** Exam generation, seat allocation, mark entry
- [ ] **Library:** Issue, return, overdue, fine calculation
- [ ] **Role-based access:** Admin sees all, staff sees modules only

### Performance Optimizations

Add these indexes to critical collections AFTER data migration:

```js
// In Student model
studentSchema.index({ deptCode: 1, admissionStatus: 1 });
studentSchema.index({ academicYear: 1 });

// In StudentAttendance model
studentAttendanceSchema.index({ attDate: 1, attStatus: 1 });
studentAttendanceSchema.index({ registerNumber: 1, attDate: -1 });

// In Payroll model
payrollSchema.index({ month: 1, year: 1 });

// In FeeCollection model
feeCollectionSchema.index({ paymentDate: -1 });
feeCollectionSchema.index({ registerNumber: 1 });
```

---

## ⚙️ config/index.js Changes

```js
// Full updated config/index.js for MongoDB
import dotenv from 'dotenv';
dotenv.config();

// Remove MySQL env vars, add MONGO_URI
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];

if (process.env.NODE_ENV === 'production') {
  const missing = requiredEnvVars.filter(v => !process.env[v]);
  if (missing.length > 0) throw new Error(`Missing env vars: ${missing.join(', ')}`);
}

const config = {
  server: {
    port: parseInt(process.env.PORT, 10) || 5000,
    env: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    host: process.env.HOST || '0.0.0.0',
    shutdownTimeout: 30000,
  },
  database: {
    uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cms_db',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  rateLimit: {
    windowMs: 60000,
    maxRequests: 100,
  },
  cors: {
    origins: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',')
      : ['http://localhost:5000', 'http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    credentials: true,
  },
  security: {
    bcryptRounds: 12,
    helmet: { contentSecurityPolicy: false, crossOriginEmbedderPolicy: false },
  },
  upload: {
    maxFileSize: 10 * 1024 * 1024,
    uploadDir: process.env.UPLOAD_DIR || './uploads',
  },
};

export default config;
```

---

## 📌 Important Notes & Gotchas

### 1. ESM vs CommonJS
Your project uses `"type": "module"` in package.json and `import/export`. The template from ChatGPT uses `require()`. **IGNORE** the `require()` examples — use `import` throughout.

### 2. Old db.js Still Imported In Many Controllers
After migration, do a project-wide find + replace:
```
Find:    import db from '../db.js';
Replace: (remove this line, add your specific model imports)
```

### 3. mysql2 Must Be Removed
```bash
npm uninstall mysql2
```
Then verify `node_modules/mysql2` no longer exists.

### 4. Health Routes
`routes/healthRoutes.js` likely pings MySQL. Update it to ping MongoDB:
```js
// Change:
const [rows] = await pool.execute('SELECT 1 as health');
// To:
await mongoose.connection.db.admin().ping();
```

### 5. Your `db.js` at root server/ level is LEGACY
The `server/db.js` uses the old mysql2 pool. **Delete it** after migration. The new database connection is `server/config/db.js`.

### 6. Docker Compose
Update `docker-compose.yml` to replace MySQL service with MongoDB service:
```yaml
# Remove mysql service
# Add:
mongo:
  image: mongo:7
  restart: unless-stopped
  environment:
    MONGO_INITDB_DATABASE: cms_db
  ports:
    - "27017:27017"
  volumes:
    - mongo_data:/data/db
```

---

## 🗓️ Summary Timeline

| Week | Phase | Focus |
|------|-------|-------|
| 1 | Foundation | Install Mongoose, db connect, config update, create models folder |
| 2 | Core | Auth, Users, Roles, Sidebar, Branch, Dashboard |
| 3 | Academic | Students, Staff, Subjects, Attendance (biggest week) |
| 4 | Finance/HR | Fee, Payroll, Leave, Income |
| 5 | Examinations/Library | Exam gen, Marks, Books |
| 6 | Admission/Admin | Enquiry, Admission, Transport, Stock |
| 7 | Data Migration | MySQL → JSON → MongoDB import |
| 8 | Testing/Cutover | Full end-to-end test + production deploy |

**Effort estimate:** ~400–500 lines of code changes per day = achievable in 6–8 weeks.

---

*Generated: 2026-02-25 | Based on actual project code analysis*
*Controllers: 94 | Routes: 87 | MySQL Tables: 60+ | SQL Queries: 700+*
