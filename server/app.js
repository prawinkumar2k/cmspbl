/**
 * SF-ERP Production Server
 * ========================
 * Industrial-grade Express.js server with:
 * - Centralized error handling
 * - Request ID tracing
 * - Rate limiting
 * - Structured logging
 * - Graceful shutdown
 * - Health checks
 * - Security headers
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Core infrastructure
import config from './config/index.js';
import logger from './lib/logger.js';
import db from './lib/database.js';
import { registerServer, setupGracefulShutdown, shutdownMiddleware } from './lib/gracefulShutdown.js';

// Middleware
import { requestIdMiddleware, requestLoggingMiddleware, securityHeadersMiddleware, timeoutMiddleware } from './middlewares/requestMiddleware.js';
import { rateLimiter, strictRateLimiter } from './middlewares/rateLimitMiddleware.js';
import { errorHandler, notFoundHandler, asyncHandler } from './middlewares/errorMiddleware.js';

// Health check routes
import healthRoutes, { metricsMiddleware } from './routes/healthRoutes.js';

// ============================================
// Application Routes (existing)
// ============================================

// Master Table / Admin Master Routes
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

// Administrator Routes
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

// HR Routes
import hrLeaveRoutes from './routes/hrLeave.js';
import hrAttendanceRoutes from './routes/hrAttendance.js';
import hrPayrollRoutes from './routes/hrPayroll.js';
import staffMasterRoutes from './routes/staffMaster.js';

// Academic / Attendance Configuration Routes
import attendanceConfigRoutes from './routes/attendanceConfig.js';
import dailyAttRoutes from './routes/dailyAtt.js';
import markedAttRoutes from './routes/markedAtt.js';
import attReportRoutes from './routes/attReportRoutes.js';
import assConfigRoutes from './routes/assConfig.js';
import assignmentMarkRoutes from './routes/AssignmentMark.js';
import assignmentReportRoutes from './routes/assignmentReport.js';
import unitTestRoutes from './routes/unitTest.js';
import unitTestReportRoutes from './routes/unitTestReport.js';
import practicalMarksRoutes from './routes/practicalRoutes.js';
import practicalReportRoutes from './routes/practicalReport.js';
import UNIVMarkEntryRoutes from './routes/UNIVMarkEntryRoutes.js';

// Examination Routes
import hallRoutes from './routes/hall.js';
import timetableRoutes from './routes/timetable.js';
import qpRequirementRoutes from './routes/qpRequirement.js';
import strengthListRoutes from './routes/strengthlist.js';
import checklistRoutes from './routes/checklist.js';
import examGenerationRoutes from './routes/examGeneration.js';
import practicalPanelRoutes from './routes/practicalPanel.js';
import editExamProcessRoutes from './routes/EditExamProcessRoutes.js';
import practicalTimetableRoutes from './routes/Practicaltimetable.js';
import seatAllocationRoutes from './routes/seatAllocation.js';
import daywarStatementRoutes from './routes/daywarStatement.js';
import digitalNumberingRoutes from './routes/digitalNumbering.js';
import theoryNameListRoutes from './routes/theoryNameList.js';
import examTimetableRoutes from './routes/examTimetable.js';
import examAttendanceRoute from './routes/examAttendance.js';
import practicalExamRoutes from './routes/practicalExam.js';

// Nominal Roll & Arrear Routes
import nominalRollRoutes from './routes/nominalRoll.js';
import arrearRoutes from './routes/arrearRoutes.js';

// Staff / Admin Staff Routes
import staffRoutes from './routes/staff.js';

// Authentication Routes
import authRoutes from './routes/auth.js';

// Activity Logs Routes
import logsRoutes from './routes/logs.js';

// User Management Routes
import userRoutes from './routes/userroutes.js';

// Admission Module Routes
import studentEnquiryRoutes from './routes/studentEnquiry.js';
import applicationIssueRoutes from './routes/applicationIssue.js';
import admittedStudentRoutes from './routes/admittedStudent.js';
import studentPhotoRoutes from './routes/studentPhoto.js';
import quotaAllocationRoutes from './routes/quotaAllocation.js';
import assignCallRoutes from './routes/assignCallRouter.js';
import leadManagementRoutes from './routes/leadManagement.js';
import callerRoutes from './routes/callerRoutes.js';
import enquiryRoutes from './routes/enquiryRoutes.js';

// Course Details Routes
import courseDetailsRoutes from './routes/courseDetails.js';

// Certificates / TC Routes
import editTCRoutes from './routes/editTC.js';

// Dashboard Routes
import dashboardRoutes from './routes/dashboard.js';

// Student Login Routes
import studentLoginRoutes from './routes/studentloginRoutes.js';
import studentPortalRoutes from './routes/studentPortal.js';

// Library Management Routes
import bookRoutes from './routes/book.js';
import bookIssueRoutes from './routes/bookIssue.js';
import bookIssueReportRoutes from './routes/bookIssueReport.js';
import dueDateExitReportRoutes from './routes/dueDateExitReport.js';
import fineRoutes from './routes/fine.js';
import fineReportRoutes from './routes/fineReport.js';
import noDueCertificateRoutes from './routes/noDueCertificate.js';
import borrowerRoutes from './routes/borrower.js';
import currentBorrowersRoutes from './routes/currentBorrowers.js';
import currentBorrowerReportRoutes from './routes/currentBorrowerReport.js';
import bookReturnRoutes from './routes/bookReturn.js';
import bookRenewalRoutes from './routes/bookRenewal.js';
import availableBooksRoutes from './routes/availableBooks.js';
import bookHistoryRoutes from './routes/bookHistory.js';
import updateBookRoutes from './routes/updateBook.js';

// Memo Routes
import memoRoutes from './routes/memoRoutes.js';
import studentMemoRoutes from './routes/studentMemoRoutes.js';

// ============================================
// Initialize Application
// ============================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust proxy for correct IP detection behind load balancer
app.set('trust proxy', 1);

// ============================================
// Core Middleware Stack
// ============================================

// Shutdown check - reject requests if shutting down
app.use(shutdownMiddleware);

// Request ID and correlation ID
app.use(requestIdMiddleware);

// Security headers
app.use(securityHeadersMiddleware);
app.use(helmet({
  contentSecurityPolicy: config.security.helmet.contentSecurityPolicy,
  crossOriginEmbedderPolicy: config.security.helmet.crossOriginEmbedderPolicy,
  hsts: config.security.helmet.hsts,
}));

// CORS configuration
app.use(cors({
  origin: config.cors.origins,
  methods: config.cors.methods,
  allowedHeaders: config.cors.allowedHeaders,
  exposedHeaders: config.cors.exposedHeaders,
  credentials: config.cors.credentials,
  maxAge: config.cors.maxAge,
}));

// Request logging and metrics
app.use(requestLoggingMiddleware);
app.use(metricsMiddleware);

// Request timeout
app.use(timeoutMiddleware(30000));

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// Health Check Routes (No auth required)
// ============================================

app.use('/', healthRoutes);
app.use('/api', healthRoutes);

// ============================================
// Rate Limiting
// ============================================

// Apply strict rate limiting to auth endpoints
app.use('/api/login', strictRateLimiter);
app.use('/api/auth/login', strictRateLimiter);

// General rate limiting for all API routes
app.use('/api', rateLimiter);

// ============================================
// API Routes
// ============================================

// Master Table / Admin Master Routes
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
app.use('/api/feeMaster', feeMasterRoutes);
app.use('/api/designationMaster', designationMasterRoutes);
app.use('/api/studentMaster', studentMasterRoutes);
app.use('/api/courseFees', courseFeesRoutes);
app.use('/api/classAllocation', classAllocationRoutes);
app.use('/api/classTimeTable', classTimeTableRoutes);

// Administrator Routes
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
app.use('/api/income-expense', incomeExpenseRoutes);
app.use('/api/income-expense-master', incomeExpenseMasterRoutes);

// HR Routes
app.use('/api/hr', hrLeaveRoutes);
app.use('/api/hr/attendance', hrAttendanceRoutes);
app.use('/api/hr/payroll', hrPayrollRoutes);
app.use('/api/staff_master', staffMasterRoutes);

// Academic / Attendance Configuration Routes
app.use('/api/attendanceConfig', attendanceConfigRoutes);
app.use('/api/dailyAttendance', dailyAttRoutes);
app.use('/api/markedAttendance', markedAttRoutes);
app.use('/api/attendanceReport', attReportRoutes);
app.use('/api/assConfig', assConfigRoutes);
app.use('/api/assignmentMark', assignmentMarkRoutes);
app.use('/api/assignmentReport', assignmentReportRoutes);
app.use('/api/unitTest', unitTestRoutes);
app.use('/api/unitTestReport', unitTestReportRoutes);
app.use('/api/practicalMarks', practicalMarksRoutes);
app.use('/api/practicalReport', practicalReportRoutes);
app.use('/api/UNIVMarkEntry', UNIVMarkEntryRoutes);

// Examination Routes
app.use('/api/hall', hallRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/qpRequirement', qpRequirementRoutes);
app.use('/api/strengthlist', strengthListRoutes);
app.use('/api/checklist', checklistRoutes);
app.use('/api/examGeneration', examGenerationRoutes);
app.use('/api/examSeatAllocation', examGenerationRoutes);
app.use('/api/practical-panel', practicalPanelRoutes);
app.use('/api/editExamProcess', editExamProcessRoutes);
app.use('/api/practicalTimetable', practicalTimetableRoutes);
app.use('/api/seatAllocation', seatAllocationRoutes);
app.use('/api/daywarStatement', daywarStatementRoutes);
app.use('/api/digitalNumbering', digitalNumberingRoutes);
app.use('/api/theoryNameList', theoryNameListRoutes);
app.use('/api/examtimetable', examTimetableRoutes);
app.use('/api/examAttendance', examAttendanceRoute);
app.use('/api/practicalexams', practicalExamRoutes);

// Nominal Roll & Arrear Routes
app.use('/api/nominalRoll', nominalRollRoutes);
app.use('/api/arrear', arrearRoutes);

// Staff / Authentication / User Routes
app.use('/api', staffRoutes);
app.use('/api', authRoutes);
app.use('/api', logsRoutes);
app.use('/api', userRoutes);

// Admission Module Routes
app.use('/api/studentEnquiry', studentEnquiryRoutes);
app.use('/api/applicationIssue', applicationIssueRoutes);
app.use('/api/admittedStudent', admittedStudentRoutes);
app.use('/api/studentPhoto', studentPhotoRoutes);
app.use('/api/quotaAllocation', quotaAllocationRoutes);
app.use('/api/assignCall', assignCallRoutes);
app.use('/api/leadManagement', leadManagementRoutes);
app.use('/api/callers', callerRoutes);
app.use('/api/enquiry', enquiryRoutes);

// Course Details & Certificates Routes
app.use('/api/courseDetails', courseDetailsRoutes);
app.use('/api/tc', editTCRoutes);

// Dashboard Routes
app.use('/api/dashboard', dashboardRoutes);

// Student Login Routes
app.use('/api/student-login', studentLoginRoutes);
app.use('/api/student-portal', studentPortalRoutes);

// Library Management Routes
app.use('/api/book', bookRoutes);
app.use('/api/fine', fineRoutes);
app.use('/api/fineReport', fineReportRoutes);
app.use('/api/book-issue-report', bookIssueReportRoutes);
app.use('/api/book-issue', bookIssueRoutes);
app.use('/api/dueDateExitReport', dueDateExitReportRoutes);
app.use('/api/no-due-certificate', noDueCertificateRoutes);
app.use('/api/book-return', bookReturnRoutes);
app.use('/api/book-renewal', bookRenewalRoutes);
app.use('/api/borrowers', borrowerRoutes);
app.use('/api/current-borrowers', currentBorrowersRoutes);
app.use('/api/current-borrower-report', currentBorrowerReportRoutes);
app.use('/api/available-books', availableBooksRoutes);
app.use('/api/book-history', bookHistoryRoutes);
app.use('/api/book-history/update', updateBookRoutes);

// Memo Routes
app.use('/api/memo', memoRoutes);
app.use('/api/studentMemo', studentMemoRoutes);

// ============================================
// Static File Serving
// ============================================

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve React build files
app.use(express.static(path.join(__dirname, '../client/dist')));

// Serve from client/public/assets
app.use('/assets', express.static(path.join(__dirname, '../client/public/assets')));

// ============================================
// SPA Fallback (React Router Support)
// ============================================

app.get(/.*/, (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api')) return next();
  // Skip health check routes
  if (req.path === '/health' || req.path === '/ready' || req.path === '/live') return next();
  // Skip files with extensions
  if (req.path.includes('.')) return next();

  const indexPath = path.join(__dirname, '../client/dist/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    next();
  }
});

// ============================================
// Error Handling
// ============================================

// 404 handler
app.use(notFoundHandler);

// Central error handler (must be last)
app.use(errorHandler);

// ============================================
// Server Startup
// ============================================

const startServer = async () => {
  try {
    // Initialize database connection
    await db.initialize();

    // Start HTTP server
    const server = app.listen(config.server.port, config.server.host, () => {
      logger.info('Server started', {
        port: config.server.port,
        host: config.server.host,
        environment: config.server.env,
        nodeVersion: process.version,
        pid: process.pid,
      });

      // Log configuration summary
      logger.info('Configuration loaded', {
        database: {
          uri: config.database.uri ? config.database.uri.replace(/:([^@]+)@/, ':****@') : 'local',
        },
        rateLimit: {
          windowMs: config.rateLimit.windowMs,
          maxRequests: config.rateLimit.maxRequests,
        },
        cors: {
          origins: config.cors.origins.length,
        },
      });
    });

    // Register server for graceful shutdown
    registerServer(server);

    // Setup graceful shutdown handlers
    setupGracefulShutdown();

    return server;
  } catch (error) {
    logger.error('Failed to start server', { error: error.message, stack: error.stack });
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
