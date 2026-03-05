/**
 * MySQL → MongoDB Data Migration Script
 * =====================================
 * Usage:
 *   1. First export MySQL data to JSON: node scripts/exportMysql.js
 *   2. Then run this:                   node scripts/migrateToMongo.js
 * 
 * Requires: pip install mysql-connector-python (for the export script)
 *           OR run exportMysql.js if you have MySQL accessible from Node
 */

import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });
const EXPORT_DIR = path.join(__dirname, '../mysql_export');

// ── Import Models ─────────────────────────────────────────────────────────────
import User from '../models/User.js';
import Role from '../models/Role.js';
import SidebarModule from '../models/SidebarModule.js';
import Student from '../models/Student.js';
import Staff from '../models/Staff.js';
import Course from '../models/Course.js';
import Payroll from '../models/Payroll.js';
import ActivityLog from '../models/ActivityLog.js';
import AcademicYear from '../models/AcademicYear.js';
import Designation from '../models/Designation.js';
import Regulation from '../models/Regulation.js';
import Semester from '../models/Semester.js';
import Subject from '../models/Subject.js';
import { IncomeExpense } from '../models/IncomeExpense.js';
import { Category, CollegeStrength } from '../models/MasterData.js';
import CourseMaster from '../models/CourseMaster.js';
import StudentAttendance from '../models/StudentAttendance.js';
import FeeMaster from '../models/FeeMaster.js';
import { HallMaster } from '../models/Exam.js';
import Book from '../models/Book.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

const readJson = (filename) => {
    const filePath = path.join(EXPORT_DIR, filename);
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  File not found: ${filename} — skipping`);
        return [];
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`📂 Read ${data.length} rows from ${filename}`);
    return data;
};

const safeNum = (v) => {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    return isNaN(n) ? null : n;
};

// ── Migration Functions ────────────────────────────────────────────────────────

const migrateRoles = async () => {
    const data = readJson('users_roles.json');
    let count = 0;
    for (const row of data) {
        await Role.findOneAndUpdate(
            { role: row.role },
            { role: row.role },
            { upsert: true, new: true }
        );
        count++;
    }
    console.log(`✅ Migrated ${count} roles`);
};

const migrateSidebarModules = async () => {
    const data = readJson('sidebar_modules.json');
    let count = 0;
    for (const row of data) {
        await SidebarModule.findOneAndUpdate(
            { moduleKey: row.module_key },
            {
                moduleName: row.module_name,
                moduleKey: row.module_key,
                moduleCategory: row.module_category || '',
                modulePath: row.module_path || '',
                isActive: row.is_active === 1 || row.is_active === '1' || row.is_active === true,
                displayOrder: safeNum(row.display_order) || 999,
            },
            { upsert: true, new: true }
        );
        count++;
    }
    console.log(`✅ Migrated ${count} sidebar modules`);
};

const migrateUsers = async () => {
    const data = readJson('users.json');
    let count = 0;
    for (const row of data) {
        // Convert comma-separated module_access string to Array
        const moduleAccess = row.module_access
            ? row.module_access.split(',').map(m => m.trim()).filter(Boolean)
            : [];

        await User.findOneAndUpdate(
            { username: row.username },
            {
                role: row.role,
                staffName: row.staff_name,
                staffId: row.staff_id,
                username: row.username,
                password: row.password,       // Already bcrypt hashed in MySQL
                moduleAccess: moduleAccess,       // ✅ Array in MongoDB
            },
            { upsert: true, new: true }
        );
        count++;
    }
    console.log(`✅ Migrated ${count} users`);
};

const migrateCourses = async () => {
    const data = readJson('course_details.json');
    let count = 0;
    for (const row of data) {
        await Course.findOneAndUpdate(
            { deptCode: row.Dept_Code },
            {
                courseMode: row.Course_Mode,
                deptCode: row.Dept_Code,
                deptName: row.Dept_Name,
                yearOfCourse: safeNum(row.Year_Of_Course),
                courseName: row.Course_Name,
                deptOrder: safeNum(row.Dept_Order),
                aicteApproval: row.AICTE_Approval,
                aicteApprovalNo: row.AICTE_Approval_No,
                s1: row.S1, s2: row.S2, s3: row.S3, s4: row.S4,
                s5: row.S5, s6: row.S6, s7: row.S7, s8: row.S8,
                r1: row.R1, r2: row.R2, r3: row.R3, r4: row.R4,
                r5: row.R5, r6: row.R6, r7: row.R7, r8: row.R8,
                intake: safeNum(row.Intake), addlSeats: safeNum(row.AddlSeats),
                oc: safeNum(row.OC), bc: safeNum(row.BC),
                bco: safeNum(row.BCO), bcm: safeNum(row.BCM),
                mbcDnc: safeNum(row.MBC_DNC), sc: safeNum(row.SC),
                sca: safeNum(row.SCA), st: safeNum(row.ST),
                other: safeNum(row.Other), goiQuota: safeNum(row.GoiQuota),
                mgtQuota: safeNum(row.MgtQuota), insType: row.Ins_Type,
            },
            { upsert: true, new: true }
        );
        count++;
    }
    console.log(`✅ Migrated ${count} courses/branches`);
};

const migrateStudents = async () => {
    const students = readJson('student_master.json');
    const educations = readJson('student_education_details.json');

    // Build fast lookup map
    const eduMap = {};
    for (const edu of educations) {
        eduMap[edu.Application_No] = edu;
    }

    const parseSubjects = (json, count = 5) => {
        try {
            const parsed = typeof json === 'string' ? JSON.parse(json) : json;
            if (!Array.isArray(parsed)) return [];
            return parsed.slice(0, count).map(s => ({
                subject: s?.subject || null,
                maxMark: safeNum(s?.max),
                obtainedMark: safeNum(s?.marks)
            }));
        } catch { return []; }
    };

    let count = 0;
    for (const s of students) {
        const edu = eduMap[s.Application_No];

        const educationData = edu ? {
            hasSslc: edu.SSLC === 'Yes',
            hasIti: edu.ITI === 'Yes',
            hasVocational: edu.VOC === 'Yes',
            hasHsc: edu.HSC === 'Yes',
            sslc: {
                schoolName: edu.SSLC_School_Name,
                board: edu.SSLC_Board,
                yearOfPassing: edu.SSLC_Year_Of_Passing,
                registerNo: edu.SSLC_Register_No,
                marksheetNo: edu.SSLC_Marksheet_No,
                subjects: parseSubjects([
                    { subject: edu.SSLC_Subject1, max: edu.SSLC_Subject1_Max_Mark, marks: edu.SSLC_Subject1_Obtained_Mark },
                    { subject: edu.SSLC_Subject2, max: edu.SSLC_Subject2_Max_Mark, marks: edu.SSLC_Subject2_Obtained_Mark },
                    { subject: edu.SSLC_Subject3, max: edu.SSLC_Subject3_Max_Mark, marks: edu.SSLC_Subject3_Obtained_Mark },
                    { subject: edu.SSLC_Subject4, max: edu.SSLC_Subject4_Max_Mark, marks: edu.SSLC_Subject4_Obtained_Mark },
                    { subject: edu.SSLC_Subject5, max: edu.SSLC_Subject5_Max_Mark, marks: edu.SSLC_Subject5_Obtained_Mark },
                ]),
                totalMax: safeNum(edu.SSLC_Total_Mark),
                totalObtained: safeNum(edu.SSLC_Total_Obtained_Mark),
                percentage: safeNum(edu.SSLC_Percentage),
            },
            hsc: {
                schoolName: edu.HSC_School_Name,
                board: edu.HSC_Board,
                yearOfPassing: edu.HSC_Year_Of_Passing,
                registerNo: edu.HSC_Register_No,
                examType: edu.HSC_Exam_Type,
                majorStream: edu.HSC_Major_Stream,
                subjects: parseSubjects([
                    { subject: edu.HSC_Subject1, max: edu.HSC_Subject1_Max_Mark, marks: edu.HSC_Subject1_Obtained_Mark },
                    { subject: edu.HSC_Subject2, max: edu.HSC_Subject2_Max_Mark, marks: edu.HSC_Subject2_Obtained_Mark },
                    { subject: edu.HSC_Subject3, max: edu.HSC_Subject3_Max_Mark, marks: edu.HSC_Subject3_Obtained_Mark },
                    { subject: edu.HSC_Subject4, max: edu.HSC_Subject4_Max_Mark, marks: edu.HSC_Subject4_Obtained_Mark },
                    { subject: edu.HSC_Subject5, max: edu.HSC_Subject5_Max_Mark, marks: edu.HSC_Subject5_Obtained_Mark },
                    { subject: edu.HSC_Subject6, max: edu.HSC_Subject6_Max_Mark, marks: edu.HSC_Subject6_Obtained_Mark },
                ], 6),
                totalMax: safeNum(edu.HSC_Total_Mark),
                totalObtained: safeNum(edu.HSC_Total_Obtained_Mark),
                percentage: safeNum(edu.HSC_Percentage),
                cutoff: safeNum(edu.HSC_Cutoff),
            }
        } : {};

        await Student.findOneAndUpdate(
            { applicationNo: s.Application_No },
            {
                applicationNo: s.Application_No,
                stdUid: s.Std_UID,
                registerNumber: s.Register_Number,
                studentName: s.Student_Name,
                gender: s.Gender,
                dob: s.Dob,
                age: safeNum(s.Age),
                stdEmail: s.Std_Email,
                photoPath: s.Photo_Path || '',
                fatherName: s.Father_Name, fatherMobile: s.Father_Mobile,
                fatherOccupation: s.Father_Occupation, motherName: s.Mother_Name,
                motherMobile: s.Mother_Mobile, motherOccupation: s.Mother_Occupation,
                guardianName: s.Guardian_Name, guardianMobile: s.Guardian_Mobile,
                guardianOccupation: s.Guardian_Occupation, guardianRelation: s.Guardian_Relation,
                bloodGroup: s.Blood_Group, nationality: s.Nationality,
                religion: s.Religion, community: s.Community,
                caste: s.Caste, physicallyChallenged: s.Physically_Challenged,
                maritalStatus: s.Marital_Status, aadhaarNo: s.Aadhaar_No,
                panNo: s.Pan_No, motherTongue: s.Mother_Tongue,
                emisNumber: s.EMIS_No, mediumOfInstruction: s.Medium_Of_Instruction,
                fatherAnnualIncome: safeNum(s.Father_Annual_Income),
                motherAnnualIncome: safeNum(s.Mother_Annual_Income),
                guardianAnnualIncome: safeNum(s.Guardian_Annual_Income),
                permanentDistrict: s.Permanent_District, permanentState: s.Permanent_State,
                permanentPincode: s.Permanent_Pincode, permanentAddress: s.Permanent_Address,
                currentDistrict: s.Current_District, currentState: s.Current_State,
                currentPincode: s.Current_Pincode, currentAddress: s.Current_Address,
                bankName: s.Bank_Name, bankBranch: s.Bank_Branch,
                accountNumber: s.Bank_Account_No, ifscCode: s.Bank_IFSC_Code,
                micrCode: s.Bank_MICR_Code,
                scholarship: s.Scholarship, firstGraduate: s.First_Graduate,
                bankLoan: s.Bank_Loan, modeOfJoining: s.Mode_Of_Joinig,
                reference: s.Reference, present: s.Present,
                courseName: s.Course_Name, deptName: s.Dept_Name,
                deptCode: s.Dept_Code, semester: s.Semester,
                year: s.Year, admissionDate: s.Admission_Date,
                hostelRequired: s.Hostel_Required, transportRequired: s.Transport_Required,
                admissionStatus: s.Admission_Status, studentMobile: s.Student_Mobile,
                rollNumber: s.Roll_Number, regulation: s.Regulation,
                classTeacher: s.Class_Teacher, class: s.Class,
                allocatedQuota: s.Allocated_Quota,
                education: educationData,
            },
            { upsert: true, new: true }
        );
        count++;

        if (count % 100 === 0) console.log(`  ... migrated ${count} students`);
    }
    console.log(`✅ Migrated ${count} students (with embedded education)`);
};

const migratePayroll = async () => {
    const data = readJson('hr_payroll.json');
    let count = 0;
    for (const row of data) {
        await Payroll.findOneAndUpdate(
            { staffId: row.staff_id, month: safeNum(row.month), year: safeNum(row.year) },
            {
                staffId: row.staff_id,
                month: safeNum(row.month),
                year: safeNum(row.year),
                basicSalary: safeNum(row.basic_salary) || 0,
                hra: safeNum(row.hra) || 0,
                da: safeNum(row.da) || 0,
                ta: safeNum(row.ta) || 0,
                specialAllowance: safeNum(row.special_allowance) || 0,
                grossSalary: safeNum(row.gross_salary) || 0,
                pfDeduction: safeNum(row.pf_deduction) || 0,
                esiDeduction: safeNum(row.esi_deduction) || 0,
                professionalTax: safeNum(row.professional_tax) || 0,
                tds: safeNum(row.tds) || 0,
                totalDeductions: safeNum(row.total_deductions) || 0,
                netSalary: safeNum(row.net_salary) || 0,
                status: row.status || 'generated',
                paidDate: row.paid_date ? new Date(row.paid_date) : null,
            },
            { upsert: true, new: true }
        );
        count++;
    }
    console.log(`✅ Migrated ${count} payroll records`);
};

const migrateDesignations = async () => {
    const data = readJson('designation_master.json');
    let count = 0;
    for (const row of data) {
        await Designation.findOneAndUpdate(
            { designationName: row.Designation_Name },
            { designationName: row.Designation_Name },
            { upsert: true, new: true }
        );
        count++;
    }
    console.log(`✅ Migrated ${count} designations`);
};

const migrateAcademicYears = async () => {
    const data = readJson('academic_year_master.json');
    let count = 0;
    for (const row of data) {
        await AcademicYear.findOneAndUpdate(
            { academicYear: row.Academic_Year },
            {
                academicYear: row.Academic_Year,
                startDate: row.Start_Date,
                endDate: row.End_Date,
                isActive: row.Is_Active === 1
            },
            { upsert: true, new: true }
        );
        count++;
    }
    console.log(`✅ Migrated ${count} academic years`);
};

const migrateRegulations = async () => {
    const data = readJson('regulation_master.json');
    let count = 0;
    for (const row of data) {
        await Regulation.findOneAndUpdate(
            { regulationName: row.Regulation_Name },
            {
                regulationName: row.Regulation_Name,
                year: row.Year,
                description: row.Description
            },
            { upsert: true, new: true }
        );
        count++;
    }
    console.log(`✅ Migrated ${count} regulations`);
};

const migrateSemesters = async () => {
    const data = readJson('semester_master.json');
    let count = 0;
    for (const row of data) {
        await Semester.findOneAndUpdate(
            { semesterName: row.Semester_Name, deptCode: row.Dept_Code },
            {
                semesterName: row.Semester_Name,
                semesterNumber: safeNum(row.Semester_Number),
                deptCode: row.Dept_Code,
                isActive: row.Is_Active === 1
            },
            { upsert: true, new: true }
        );
        count++;
    }
    console.log(`✅ Migrated ${count} semesters`);
};

const migrateSubjects = async () => {
    const data = readJson('subject_master.json');
    let count = 0;
    for (const row of data) {
        await Subject.findOneAndUpdate(
            { subCode: row.Sub_Code, deptCode: row.Dept_Code },
            {
                subCode: row.Sub_Code,
                subName: row.Sub_Name,
                deptCode: row.Dept_Code,
                deptName: row.Dept_Name,
                semester: row.Semester,
                year: row.Year,
                regulation: row.Regulation,
                subType: row.Sub_Type,
                credits: safeNum(row.Credits),
                maxMark: safeNum(row.Max_Mark),
                minMark: safeNum(row.Min_Mark),
                staffId: row.Staff_ID,
                staffName: row.Staff_Name,
                isActive: row.Is_Active === 1
            },
            { upsert: true, new: true }
        );
        count++;
    }
    console.log(`✅ Migrated ${count} subjects`);
};

const migrateStaff = async () => {
    const staffData = readJson('staff_master.json');
    const salaryData = readJson('hr_staff_salary.json');

    const salaryMap = {};
    for (const s of salaryData) {
        salaryMap[s.Staff_ID] = s;
    }

    let count = 0;
    for (const row of staffData) {
        const sal = salaryMap[row.Staff_ID] || {};
        await Staff.findOneAndUpdate(
            { staffId: row.Staff_ID },
            {
                staffId: row.Staff_ID,
                staffName: row.Staff_Name,
                gender: row.Gender,
                dob: row.Dob,
                email: row.Email,
                mobile: row.Mobile,
                deptName: row.Dept_Name,
                deptCode: row.Dept_Code,
                designation: row.Designation,
                qualification: row.Qualification,
                joiningDate: row.Joining_Date,
                relievingDate: row.Relieving_Date,
                photo: row.Photo_Path || '',
                aadhaarNo: row.Aadhaar_No,
                panNo: row.Pan_No,
                bankName: row.Bank_Name,
                accountNumber: row.Account_Number,
                ifscCode: row.IFSC_Code,
                address: row.Address,
                bloodGroup: row.Blood_Group,
                isActive: row.Is_Active === 1,
                salary: {
                    basicSalary: safeNum(sal.Basic_Salary) || 0,
                    hra: safeNum(sal.HRA) || 0,
                    da: safeNum(sal.DA) || 0,
                    ta: safeNum(sal.TA) || 0,
                    specialAllowance: safeNum(sal.Special_Allowance) || 0,
                    pfDeduction: safeNum(sal.PF_Deduction) || 0,
                    esiDeduction: safeNum(sal.ESI_Deduction) || 0,
                    professionalTax: safeNum(sal.Professional_Tax) || 0,
                    tds: safeNum(sal.TDS) || 0,
                }
            },
            { upsert: true, new: true }
        );
        count++;
    }
    console.log(`✅ Migrated ${count} staff (with embedded salary)`);
};

const migrateCategories = async () => {
    const data = readJson('category_master.json');
    let count = 0;
    for (const row of data) {
        await Category.findOneAndUpdate(
            { categoryName: row.category_name },
            { categoryName: row.category_name },
            { upsert: true, new: true }
        );
        count++;
    }
    console.log(`✅ Migrated ${count} categories`);
};

const migrateCourseMaster = async () => {
    const data = readJson('course_master.json');
    let count = 0;
    for (const row of data) {
        await CourseMaster.findOneAndUpdate(
            { courseName: row.Course_Name },
            { courseName: row.Course_Name },
            { upsert: true, new: true }
        );
        count++;
    }
    console.log(`✅ Migrated ${count} course master records`);
};

const migrateCollegeStrength = async () => {
    const data = readJson('college_strength.json');
    let count = 0;
    for (const row of data) {
        await CollegeStrength.findOneAndUpdate(
            { courseCode: row.Course_Code, branch: row.Branch },
            {
                courseCode: row.Course_Code,
                branch: row.Branch,
                year1: safeNum(row.Year_1),
                year2: safeNum(row.Year_2),
                year3: safeNum(row.Year_3),
                year4: safeNum(row.Year_4),
                others: safeNum(row.Others),
                total: safeNum(row.Total)
            },
            { upsert: true, new: true }
        );
        count++;
    }
    console.log(`✅ Migrated ${count} college strength records`);
};

const migrateAttendance = async () => {
    const data = readJson('student_attendance_entry.json');
    let count = 0;
    for (const row of data) {
        // Map MySQL status to MongoDB enum
        let status = 'present';
        const s = row.Att_Status?.toLowerCase();
        if (s === 'a' || s === 'absent') status = 'absent';
        else if (s === 'od' || s === 'onduty') status = 'onDuty';
        else if (s === 'ml' || s === 'medicalleave') status = 'medicalLeave';

        try {
            await StudentAttendance.findOneAndUpdate(
                { registerNumber: row.Register_Number, attDate: new Date(row.Att_Date), period: row.Period },
                {
                    registerNumber: row.Register_Number,
                    deptCode: row.Dept_Code,
                    deptName: row.Dept_Name,
                    semester: row.Semester,
                    subjectCode: row.Subject_Code,
                    attDate: new Date(row.Att_Date),
                    attStatus: status,
                    period: row.Period,
                    markedBy: row.Staff_ID
                },
                { upsert: true, new: true }
            );

            count++;
            if (count % 1000 === 0) console.log(`  ... migrated ${count} attendance records`);
        } catch (err) {
            console.error(`❌ Error migrating attendance row ${count}:`, row.Register_Number, row.Attendance_Date);
            console.error(err.message);
            // Optional: break or continue. Let's continue for now.
        }
    }
    console.log(`✅ Migrated ${count} attendance records`);
};

const migrateActivityLogs = async () => {
    const data = readJson('log_details.json');
    let count = 0;
    for (const row of data) {
        // Map MySQL schema to MongoDB
        await ActivityLog.create({
            username: row.username,
            role: row.role || '',
            action: row.action || '',
            description: row.description || '',
            ipAddress: row.ip_address || '',
            userAgent: row.user_agent || '',
            timestamp: row.login_date ? new Date(row.login_date) : new Date()
        });
        count++;
    }
    console.log(`✅ Migrated ${count} activity logs`);
};

const migrateIncomeExpense = async () => {
    const data = readJson('income_expense_entries.json');
    let count = 0;
    for (const row of data) {
        await IncomeExpense.create({
            date: new Date(row.date),
            grp: row.group,
            category: row.category,
            person: row.person,
            authMode: row.authorization,
            paymentMode: row.paymentMode,
            detail: row.detail,
            sNo: row.sno,
            incomeAmount: safeNum(row.income) || 0,
            expenseAmount: safeNum(row.expense) || 0,
            suspense: row.suspense === 1
        });
        count++;
    }
    console.log(`✅ Migrated ${count} income/expense entries`);
};

const migrateFeeMaster = async () => {
    const data = readJson('fee_master.json');
    let count = 0;
    for (const row of data) {
        await FeeMaster.findOneAndUpdate(
            { feeType: row.Fee_Type },
            { feeType: row.Fee_Type },
            { upsert: true, new: true }
        );
        count++;
    }
    console.log(`✅ Migrated ${count} fee master records`);
};

const migrateHallMaster = async () => {
    const data = readJson('hall_master.json');
    let count = 0;
    for (const row of data) {
        await HallMaster.findOneAndUpdate(
            { hallCode: row.Hall_Code },
            {
                hallCode: row.Hall_Code,
                hallName: row.Hall_Name,
                totalRows: safeNum(row.Total_Rows) || 0,
                totalColumns: safeNum(row.Total_Columns) || 0,
                seatingCapacity: safeNum(row.Seating_Capacity) || 0,
                blockName: row.Block_Name,
                floorNumber: row.Floor_Number,
                hallType: row.Hall_Type,
                status: row.Status ? row.Status.toLowerCase() : 'active'
            },
            { upsert: true, new: true }
        );
        count++;
    }
    console.log(`✅ Migrated ${count} hall master records`);
};

const migrateLibraryBooks = async () => {
    const data = readJson('library_books.json');
    let count = 0;
    for (const row of data) {
        const qty = safeNum(row.quantity) || 1;
        await Book.findOneAndUpdate(
            { accessionNo: row.book_id || `temp-${Date.now()}` }, // fallback
            {
                accessionNo: row.book_id,
                title: row.title,
                author: row.author,
                publisher: row.publisher,
                edition: row.edition,
                year: row.year,
                isbn: row.isbn,
                subject: row.subject,
                department: row.department,
                price: safeNum(row.price) || 0,
                totalCopies: qty,
                availableCopies: qty, // assuming all available for simple migration
                rack: row.rack,
                isActive: row.status !== 'Lost'
            },
            { upsert: true, new: true }
        );
        count++;
        if (count % 1000 === 0) console.log(`  ... migrated ${count} books`);
    }
    console.log(`✅ Migrated ${count} library books`);
};

// ── Main Migration Runner ─────────────────────────────────────────────────────

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`\n🚀 Connected to MongoDB: ${process.env.MONGO_URI}\n`);
        console.log('='.repeat(50));

        await migrateRoles();
        await migrateSidebarModules();
        await migrateUsers();
        await migrateDesignations();
        await migrateAcademicYears();
        await migrateRegulations();
        await migrateSemesters();
        await migrateCourses();
        await migrateSubjects();
        await migrateStudents();
        await migrateStaff();
        await migratePayroll();
        await migrateCategories();
        await migrateCourseMaster();
        await migrateCollegeStrength();
        await migrateAttendance();
        await migrateActivityLogs();
        await migrateIncomeExpense();
        await migrateFeeMaster();
        await migrateHallMaster();
        await migrateLibraryBooks();

        console.log('\n' + '='.repeat(50));
        console.log('✅ Migration complete!');
        console.log('Next steps:');
        console.log('  1. Run more migration functions for other tables');
        console.log('  2. Verify data in MongoDB Compass');
        console.log('  3. Start server: npm run dev');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

run();
