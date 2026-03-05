import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { fileURLToPath } from "url";
import fs from 'fs';

dotenv.config();
import db from './lib/database.js';

// Initialize database connection
await db.initialize();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
// Disable CSP for Iconify to work properly
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// IMPORTANT: Static file serving moved to after API routes (line ~320)
// app.use(express.static(path.join(__dirname, "../client/dist")));
// ------------------------------
// Master Table / Admin Master Routes
// ------------------------------
import masterDataRoutes from './routes/masterData.js';
import branchRoutes from './routes/branch.js';
import subjectRoutes from './routes/subject.js';
import subjectAllRoutes from './routes/subjectAll.js';
import calendarRoutes from './routes/calendar.js';
import courseMasterRoutes from './routes/courseMaster.js';
import academicYearMasterRoutes from './routes/academicYearMaster.js';
import regulationMasterRoutes from './routes/regulationMaster.js';
import semesterMasterRoutes from './routes/semesterMaster.js';
import feeMasterRoutes from './routes/feeMaster.js';
import designationMasterRoutes from './routes/designationMaster.js';
import studentMasterRoutes from './routes/studentMaster.js';
import courseFeesRoutes from './routes/courseFees.js';
import classAllocationRoutes from './routes/classAllocation.js';
import classTimeTableRoutes from './routes/classTimeTable.js';
import hallChartRoutes from './routes/hallChart.js';

app.use('/api', hallChartRoutes);
app.use('/api/masterData', masterDataRoutes);
app.use('/api/branch', branchRoutes);
app.use('/api/subject', subjectRoutes);
app.use('/api/subject_allocation', subjectAllRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/courseMaster', courseMasterRoutes);
app.use('/api/academicYearMaster', academicYearMasterRoutes);
app.use('/api/regulationMaster', regulationMasterRoutes);
app.use('/api/semesterMaster', semesterMasterRoutes);

import dbSemesterRoutes from './routes/dbSemester.js';
app.use('/api/dbSemester', dbSemesterRoutes);
app.use('/api/feeMaster', feeMasterRoutes);
app.use('/api/designationMaster', designationMasterRoutes);
app.use('/api/studentMaster', studentMasterRoutes);
app.use('/api/courseFees', courseFeesRoutes);
app.use('/api/classAllocation', classAllocationRoutes);
app.use('/api/classTimeTable', classTimeTableRoutes);


// ------------------------------
// Administrator Routes
// ------------------------------
import StockRoutes from './routes/StockRoutes.js';
import purchase from './routes/purchases.js';
import assert from './routes/assets.js';
import sendlettersRoutes from './routes/sendletter.js';
import receiverletterRoutes from './routes/receiveLetter.js';
import feeLedgerRoutes from './routes/feeLedger.js';
import feeReceiptRoutes from './routes/feeReceipt.js';
import feeCollectionRoutes from './routes/feeCollection.js';
import settlementRoutes from './routes/settlementRoutes.js';
import transportRoutes from './routes/transport.js';
import transportEntryRoutes from './routes/transportEntryRoutes.js';
import studentFeeMasterRoutes from './routes/studentFeeMaster.js';
import incomeExpenseRoutes from './routes/incomeExpense.js';
import incomeExpenseMasterRoutes from './routes/incomeExpenseMaster.js';

app.use('/api/stocks', StockRoutes);
app.use('/api/purchases', purchase);
app.use('/api/assets', assert);
app.use('/api/sendletters', sendlettersRoutes);
app.use('/api/receiverletter', receiverletterRoutes);
app.use('/api/feeLedger', feeLedgerRoutes);
app.use('/api/fee-receipt', feeReceiptRoutes);
app.use('/api/feeCollection', feeCollectionRoutes);
app.use('/api/settlements', settlementRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/transport/entries', transportEntryRoutes);
app.use('/api/studentFeeMaster', studentFeeMasterRoutes);
app.use("/api/income-expense", incomeExpenseRoutes);
app.use("/api/income-expense-master", incomeExpenseMasterRoutes);

// ------------------------------
// HR Routes
// ------------------------------
import hrLeaveRoutes from './routes/hrLeave.js';
app.use('/api/hr', hrLeaveRoutes);
console.log('HR Routes mounted at /api/hr');

// ------------------------------
// Academic / Attendance Configuration Routes
// ------------------------------
import attendanceConfigRoutes from './routes/attendanceConfig.js';
import dailyAttRoutes from './routes/dailyAtt.js';
import markedAttRoutes from './routes/markedAtt.js';
import attReportRoutes from './routes/attReportRoutes.js';
import assConfigRoutes from './routes/assConfig.js';
import assignmentMarkRoutes from './routes/AssignmentMark.js';
import unitTestRoutes from './routes/unitTest.js';
import practicalMarksRoutes from './routes/practicalMarks.js';
import UNIVMarkEntryRoutes from './routes/UNIVMarkEntryRoutes.js';

app.use('/api/attendanceConfig', attendanceConfigRoutes);
app.use('/api/dailyAttendance', dailyAttRoutes);
app.use('/api/markedAttendance', markedAttRoutes);
app.use('/api/attendanceReport', attReportRoutes);
app.use('/api/assConfig', assConfigRoutes);
app.use('/api/assignmentMark', assignmentMarkRoutes);
app.use('/api/unitTest', unitTestRoutes);
app.use('/api/practicalMarks', practicalMarksRoutes);
app.use('/api/UNIVMarkEntry', UNIVMarkEntryRoutes);


// ------------
// Examination Routes
import hallRoutes from './routes/hall.js';
import timetableRoutes from './routes/timetable.js';
import qpRequirementRoutes from './routes/qpRequirement.js';
import strengthListRoutes from './routes/strengthlist.js';
import checklistRoutes from './routes/checklist.js';
import examGenerationRoutes from './routes/examGeneration.js';
import practicalPanelRoutes from './routes/practicalPanel.js';

import practicalTimetableRoutes from './routes/Practicaltimetable.js';
import seatAllocationRoutes from './routes/seatAllocation.js';
import daywarStatementRoutes from './routes/daywarStatement.js';
import digitalNumberingRoutes from './routes/digitalNumbering.js';
import theoryNameListRoutes from './routes/theoryNameList.js';
import examTimetableRoutes from './routes/examTimetable.js';
import examAttendanceRoute from "./routes/examAttendance.js";
import practicalExamRoutes from "./routes/practicalExam.js";



// Examination api's
app.use('/api/hall', hallRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/qpRequirement', qpRequirementRoutes);
app.use('/api/strengthlist', strengthListRoutes);
app.use('/api/checklist', checklistRoutes);
app.use('/api/examGeneration', examGenerationRoutes);
// Alias for legacy/client path: mount the same routes under /api/examSeatAllocation
app.use('/api/examSeatAllocation', examGenerationRoutes);
app.use('/api/practical-panel', practicalPanelRoutes);
app.use('/api/practicalTimetable', practicalTimetableRoutes);
app.use('/api/seatAllocation', seatAllocationRoutes);
app.use('/api/daywarStatement', daywarStatementRoutes);
app.use('/api/digitalNumbering', digitalNumberingRoutes);
app.use('/api/theoryNameList', theoryNameListRoutes);
app.use('/api/examtimetable', examTimetableRoutes);
app.use("/api/examAttendance", examAttendanceRoute);
app.use("/api/practicalexams", practicalExamRoutes);

// ------------------------------
// Nominal Roll Routes
// ------------------------------
import nominalRollRoutes from './routes/nominalRoll.js';
app.use('/api/nominalRoll', nominalRollRoutes);

// ------------------------------
// Arrear Entry Routes
// ------------------------------
import arrearRoutes from './routes/arrearRoutes.js';
app.use('/api/arrear', arrearRoutes);

// ------------------------------
// Staff / Admin Staff Routes
// ------------------------------
import staffRoutes from './routes/staff.js';
app.use('/api', staffRoutes); // You might want to change prefix if needed

// ------------------------------
// Authentication Routes
// ------------------------------
import authRoutes from './routes/auth.js';
app.use('/api', authRoutes);

// ------------------------------
// Activity Logs Routes
// ------------------------------
import logsRoutes from './routes/logs.js';
app.use('/api', logsRoutes);

// ------------------------------
// User Management Routes
// ------------------------------
import userRoutes from './routes/userroutes.js';
app.use('/api', userRoutes);

// ------------------------------
// Admission Module Routes
// ------------------------------
import studentEnquiryRoutes from './routes/studentEnquiry.js';
import applicationIssueRoutes from './routes/applicationIssue.js';
import admittedStudentRoutes from './routes/admittedStudent.js';
import quotaAllocationRoutes from './routes/quotaAllocation.js';
import assignCallRoutes from './routes/assignCallRouter.js';
import leadManagementRoutes from './routes/leadManagement.js';
import callerRoutes from './routes/callerRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';

app.use('/api/studentEnquiry', studentEnquiryRoutes);
app.use('/api/applicationIssue', applicationIssueRoutes);
app.use('/api/admittedStudent', admittedStudentRoutes);
app.use('/api/quotaAllocation', quotaAllocationRoutes);
app.use('/api/assignCall', assignCallRoutes);
app.use('/api/leadManagement', leadManagementRoutes);
app.use('/api/callers', callerRoutes);
app.use('/api/enquiry', enquiryRoutes);

// ------------------------------
// Examination / Course Details Routes
// ------------------------------
import courseDetailsRoutes from './routes/courseDetails.js';
app.use('/api/courseDetails', courseDetailsRoutes);


// ------------------------------
// Dashboard Routes
// ------------------------------
import dashboardRoutes from './routes/dashboard.js';
app.use('/api/dashboard', dashboardRoutes);

// ------------------------------
// Student Login Routes
// ------------------------------
import studentLoginRoutes from './routes/studentloginRoutes.js';
import studentPortalRoutes from './routes/studentPortal.js';
app.use('/api/student-login', studentLoginRoutes);
app.use('/api/student-portal', studentPortalRoutes);


// ------------------------------
// HR Module Routes
// ------------------------------
import hrAttendanceRoutes from './routes/hrAttendance.js';
import hrPayrollRoutes from './routes/hrPayroll.js';

app.use('/api/hr/attendance', hrAttendanceRoutes);
app.use('/api/hr/payroll', hrPayrollRoutes);
// Note: staff_master routes are mounted under /api/ via staffRoutes at line ~205


// Placement Routes
import placementRoutes from './routes/placementRoutes.js';
app.use('/api/placement', placementRoutes);


// ------------------------------
// Certificates / TC Routes
// ------------------------------
import tcRoutes from './routes/tc.js';
app.use('/api/tc', tcRoutes);

// Consolidated Report Routes
import consolidateReportRoutes from './routes/consolidateReportRoutes.js';
app.use('/api/consolidateReport', consolidateReportRoutes);

// Static Assets - Serve React build files (AFTER all API routes)
app.use(express.static(path.join(__dirname, '../client/dist')));

// Serve from client/public/assets so book cover images are accessible
app.use('/assets', express.static(path.join(__dirname, '../client/public/assets')));

// ------------------------------
// Health Check
// ------------------------------
app.get('/api/health', (req, res) => {
  res.send({ status: 'Server is healthy' });
});

// Serve React App for any other route (SPA)
app.get(/.*/, (req, res, next) => {
  // Skip API routes to allow 404s for them
  if (req.path.startsWith("/api")) return next();
  // Skip files with extensions (should be handled by express.static)
  if (req.path.includes(".")) return next();

  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// ------------------------------
// Start Server
// ------------------------------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
