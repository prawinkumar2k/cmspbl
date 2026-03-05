import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { EnquiryProvider } from "./context/EnquiryContext";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { Toaster } from 'react-hot-toast';

// Admin Dashboard
import AdminDashboard from "./pages/dashboard/admin/adminDashboard";
import UserCreation from "./pages/dashboard/admin/UserCreation";
import LoginDetails from "./pages/dashboard/admin/loginDetails";
import StudentLogin from "./pages/dashboard/admin/studentLogin";

// Master (Admin) — Master Tables
import Branch from "./pages/dashboard/admin/master/Branch";
import Subject from "./pages/dashboard/admin/master/Subject";
import SubjectAllocation from "./pages/dashboard/admin/master/SubjectAllocation";
import ClassAllocation from "./pages/dashboard/admin/master/classAllocation";
import AcademicCalendar from "./pages/dashboard/admin/master/academicCalendar";
import StaffDetails from "./pages/dashboard/admin/master/StaffDetails";
import CourseMaster from "./pages/dashboard/admin/master/CourseMaster";
import AcademicYearMaster from "./pages/dashboard/admin/master/academicYearMaster";
import RegulationMaster from "./pages/dashboard/admin/master/RegulationMaster";
import SemesterMaster from "./pages/dashboard/admin/master/SemesterMaster";
import FeeMaster from "./pages/dashboard/admin/master/FeeMaster";
import DesignationMaster from "./pages/dashboard/admin/master/DesignationMaster";
import FeeDetails from "./pages/dashboard/admin/master/FeeDetails";
import ClassTimeTable from "./pages/dashboard/admin/master/ClassTimeTable";

// Academic Module — Attendance & Assessment
import DailyAttendance from "./pages/dashboard/admin/academic/attendance/DailyAttendance";
import MarkedAttendance from "./pages/dashboard/admin/academic/attendance/MarkedAttendance";
import AttendanceReport from "./pages/dashboard/admin/academic/attendance/AttendanceReport";
import AttendanceConfiguration from "./pages/dashboard/admin/academic/attendance/AttendanceConfiguration";
import SpellAttendance from "./pages/dashboard/admin/academic/attendance/SpellAttendance";
import AssessmentConfiguration from "./pages/dashboard/admin/academic/assessment/AssessmentConfiguration";
import AssignmentMarkEntry from "./pages/dashboard/admin/academic/assessment/AssignmentMarkEntry";
import AssignmentReport from "./pages/dashboard/admin/academic/assessment/AssignmentReport";
import UnitTestMarkEntry from "./pages/dashboard/admin/academic/assessment/UnitTestMarkEntry";
import UnitTestReport from "./pages/dashboard/admin/academic/assessment/UnitTestReport";
import PracticalMark from "./pages/dashboard/admin/academic/assessment/PracticalMark";
import PracticalReport from "./pages/dashboard/admin/academic/assessment/PracticalReport";
import UNIVMarkEntry from "./pages/dashboard/admin/academic/assessment/UNIVMarkEntry";
import ArrearEntry from "./pages/dashboard/admin/academic/assessment/ArrearEntry";

// Examination (Data Submission) Module
import ExamSettings from "./pages/dashboard/admin/examination/datasubmission/ExamSettings";
import HallDetails from "./pages/dashboard/admin/examination/datasubmission/HallDetails";
import ExamTimeTable from "./pages/dashboard/admin/examination/datasubmission/TimeTable";
import ExamFee from "./pages/dashboard/admin/examination/datasubmission/ExamFee";
import NominalRoll from "./pages/dashboard/admin/examination/datasubmission/NominalRoll";
import QPRequirement from "./pages/dashboard/admin/examination/datasubmission/QPRequirement";
import StrengthList from "./pages/dashboard/admin/examination/datasubmission/StrengthList";
import CheckList from "./pages/dashboard/admin/examination/datasubmission/CheckList";
import CollegeStrength from "./pages/dashboard/admin/examination/datasubmission/CollegeStrength";
import PracticalPanel from "./pages/dashboard/admin/examination/practicalModel/PracticalPanel";
import PracticalTimeTable from "./pages/dashboard/admin/examination/practicalModel/PracticalTimeTable";
import PracticalNameList from "./pages/dashboard/admin/examination/practicalModel/PracticalNameList";
import HallChart from "./pages/dashboard/admin/examination/examProcess/HallChart";
import ExamGeneration from "./pages/dashboard/admin/examination/examProcess/ExamGeneration";
import SeatAllocation from "./pages/dashboard/admin/examination/examProcess/SeatAllocation";
import DaywarStatement from "./pages/dashboard/admin/examination/examProcess/DaywarStatement";
import DigitalNumbering from "./pages/dashboard/admin/examination/examProcess/DigitalNumbering";
import TheoryNamelist from "./pages/dashboard/admin/examination/examProcess/TheoryNamelist";


// Examination (Exam Forms) Module
import AbsenteesEntry from "./pages/dashboard/admin/examination/examforms/AbsenteesEntry";
import Ex2Present from "./pages/dashboard/admin/examination/examforms/Ex2Present";
import Ex2Absent from "./pages/dashboard/admin/examination/examforms/Ex2Absent";

// Admission — Admission Process Module
import AdmissionStatus from "./pages/dashboard/admin/admission/admission/AdmissionStatus";
import AdmittingStudent from "./pages/dashboard/admin/admission/admission/AdmittingStudent";
import ApplicationIssue from "./pages/dashboard/admin/admission/admission/ApplicationIssue";
import StudentDetails from "./pages/dashboard/admin/admission/admission/StudentDetails";
import PhotoPath from "./pages/dashboard/admin/admission/admission/PhotoPath";
import QuotaAllocation from "./pages/dashboard/admin/admission/admission/QuotaAllocation";
import StaffReport from "./pages/dashboard/admin/admission/admission/StaffReport";

// Admission Reports Module
import AppIssueConsolidate from "./pages/dashboard/admin/admission/AdmissionReports/AppIssueConsolidate";
import GeneralForms from "./pages/dashboard/admin/admission/AdmissionReports/GeneralForms";
import StudentProfile from "./pages/dashboard/admin/admission/AdmissionReports/StudentProfile";

// Admission Certificates Module
import EditTC from "./pages/dashboard/admin/admission/certificates/EditTC";
import TC from "./pages/dashboard/admin/admission/certificates/TC";
import FeesEstimation from "./pages/dashboard/admin/admission/certificates/FeesEstimation";
import CourseCompletion from "./pages/dashboard/admin/admission/certificates/CourseCompletion";
import Conduct from "./pages/dashboard/admin/admission/certificates/Conduct";
import Bonafide from "./pages/dashboard/admin/admission/certificates/Bonafide";

// Administrator Module

// Office 
import FeeType from "./pages/dashboard/admin/administrator/office/feemodule/FeeType";
import StockEntry from "./pages/dashboard/admin/administrator/office/stockmodule/StockEntry";
import PurchaseEntry from "./pages/dashboard/admin/administrator/office/stockmodule/PurchaseEntry";
import AssetEntry from "./pages/dashboard/admin/administrator/office/stockmodule/AssetEntry";
import SendLetter from "./pages/dashboard/admin/administrator/office/lettermodule/SendLetter";
import ReceiveLetter from "./pages/dashboard/admin/administrator/office/lettermodule/ReceiveLetter";
import FeeRecipt from "./pages/dashboard/admin/administrator/office/feemodule/FeeRecipt";
import IncomeExpenseEntry from "./pages/dashboard/admin/administrator/office/accountmodule/IncomeExpenseEntry";
import IncomeExpenseReport from "./pages/dashboard/admin/administrator/office/accountmodule/IncomeExpenseReport";
import ConsolidatedReportForm from "./pages/dashboard/admin/administrator/office/feemodule/ConsolidatedReportForm";
import BudgetExpenseForm from "./pages/dashboard/admin/administrator/office/Budget/BudgetExpenseForm";
import Settlement from "./pages/dashboard/admin/administrator/office/accountmodule/Settlement";
import StudentFeesForm from "./pages/dashboard/admin/administrator/office/feemodule/StudentFeesForm";

// Transport
import TransportMaster from "./pages/dashboard/admin/administrator/transport/vehicle/TransportMaster";
import TransportReports from "./pages/dashboard/admin/administrator/transport/vehicle/TransportReports";
import BusMaintenanceSalary from "./pages/dashboard/admin/administrator/transport/fess&expense/BusMaintenanceSalary";
import BusMaintenanceSalaryReports from "./pages/dashboard/admin/administrator/transport/fess&expense/BusMaintenanceSalaryReports";
import StudentBusFee from "./pages/dashboard/admin/administrator/transport/fess&expense/StudentBusFee";
import StudentBusFeeReports from "./pages/dashboard/admin/administrator/transport/fess&expense/StudentBusFeeReports";

// Enquiry Module
import EnquiryReport from "./pages/dashboard/admin/admission/enquiry/EnquiryReport";
import StudentEnquiry from "./pages/dashboard/admin/admission/enquiry/StudentEnquiry";
import EnquiryDashboard from "./pages/dashboard/admin/admission/enquiry/EnquiryDashboard";
import AssignCall from "./pages/dashboard/admin/admission/enquiry/AssignCall";
import CallerDetails from "./pages/dashboard/admin/admission/enquiry/CallerDetails";
import LeadManagement from "./pages/dashboard/admin/admission/enquiry/LeadManagement";
import LeadDetails from "./pages/dashboard/admin/admission/enquiry/LeadDetails";


// Placement
import Placement from "./pages/dashboard/admin/academic/placement/Placement";
import PlacementReport from "./pages/dashboard/admin/academic/placement/PlacementReport";

// Consolidated Report
import ConsolidatedReport from "./pages/dashboard/admin/academic/ConsolidatedReport";

// HR Module
import HRDashboard from "./pages/dashboard/admin/hr/HRDashboard";
import EmployeeProfile from "./pages/dashboard/admin/hr/EmployeeProfile";
import StaffDocuments from "./pages/dashboard/admin/hr/StaffDocuments";
import EmployeeReports from "./pages/dashboard/admin/hr/EmployeeReports";
import StaffAttendance from "./pages/dashboard/admin/hr/StaffAttendance";
import TimeOffice from "./pages/dashboard/admin/hr/TimeOffice";
import ShiftManagement from "./pages/dashboard/admin/hr/ShiftManagement";
import HRAttendanceReport from "./pages/dashboard/admin/hr/AttendanceReport";
import LeaveApplication from "./pages/dashboard/admin/hr/LeaveApplication";
import LeaveApproval from "./pages/dashboard/admin/hr/LeaveApproval";
import LeaveRegister from "./pages/dashboard/admin/hr/LeaveRegister";
import LeaveConfiguration from "./pages/dashboard/admin/hr/LeaveConfiguration";
import LeaveBalance from "./pages/dashboard/admin/hr/LeaveBalance";
import LeaveAnalysis from "./pages/dashboard/admin/hr/LeaveAnalysis";
import SalaryStructure from "./pages/dashboard/admin/hr/SalaryStructure";
import MonthlyProcessing from "./pages/dashboard/admin/hr/MonthlyProcessing";
import PayslipGeneration from "./pages/dashboard/admin/hr/PayslipGeneration";
import PayrollReports from "./pages/dashboard/admin/hr/PayrollReports";
import PayrollSummary from "./pages/dashboard/admin/hr/PayrollSummary";

// Student Dashboard
import StudentDashboard from "./pages/dashboard/student/studentDashboard";
import StudentProfiles from "./pages/dashboard/student/pages/profile";
import StudentAttendance from "./pages/dashboard/student/pages/attendance";
import StudentMarkDetail from "./pages/dashboard/student/pages/markdetails";
import AcademicHistory from "./pages/dashboard/student/pages/AcademicHistory";
import Timetable from "./pages/dashboard/student/pages/Timetable";
import LearningResources from "./pages/dashboard/student/pages/LearningResources";
import Noticeboard from "./pages/dashboard/student/pages/Noticeboard";
import StudentAcademicCalendar from "./pages/dashboard/student/pages/StudentAcademicCalendar";

const App = () => {
  return (
    <AuthProvider>
      <EnquiryProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<HomePage />} />

            {/* Login Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Admin Dashboard */}
            <Route path="/admin/adminDashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

            {/* User Creation */}
            <Route path="/admin/user-creation" element={<ProtectedRoute><UserCreation /></ProtectedRoute>} />

            {/* Login Details */}
            <Route path="/admin/login-details" element={<ProtectedRoute><LoginDetails /></ProtectedRoute>} />

            {/* Student Login */}
            <Route path="/admin/studentLogin" element={<ProtectedRoute><StudentLogin /></ProtectedRoute>} />

            {/* ---------------- Master Module Routes ---------------- */}
            <Route path="/admin/master/branch" element={<ProtectedRoute><Branch /></ProtectedRoute>} />
            <Route path="/admin/master/subject" element={<ProtectedRoute><Subject /></ProtectedRoute>} />
            <Route path="/admin/master/subjectAllocation" element={<ProtectedRoute><SubjectAllocation /></ProtectedRoute>} />
            <Route path="/admin/master/classAllocation" element={<ProtectedRoute><ClassAllocation /></ProtectedRoute>} />
            <Route path="/admin/master/academicCalendar" element={<ProtectedRoute><AcademicCalendar /></ProtectedRoute>} />
            <Route path="/admin/master/StaffDetails" element={<ProtectedRoute><StaffDetails /></ProtectedRoute>} />
            <Route path="/admin/master/courseMaster" element={<ProtectedRoute><CourseMaster /></ProtectedRoute>} />
            <Route path="/admin/master/academicYearMaster" element={<ProtectedRoute><AcademicYearMaster /></ProtectedRoute>} />
            <Route path="/admin/master/regulationMaster" element={<ProtectedRoute><RegulationMaster /></ProtectedRoute>} />
            <Route path="/admin/master/semesterMaster" element={<ProtectedRoute><SemesterMaster /></ProtectedRoute>} />
            <Route path="/admin/master/feeMaster" element={<ProtectedRoute><FeeMaster /></ProtectedRoute>} />
            <Route path="/admin/master/designationMaster" element={<ProtectedRoute><DesignationMaster /></ProtectedRoute>} />
            <Route path="/admin/master/FeeDetails" element={<ProtectedRoute><FeeDetails /></ProtectedRoute>} />
            <Route path="/admin/master/ClassTimeTable" element={<ProtectedRoute><ClassTimeTable /></ProtectedRoute>} />

            {/* ---------------- Academic Module Routes ---------------- */}
            <Route path="/admin/academic/attendance/DailyAttendance" element={<ProtectedRoute><DailyAttendance /></ProtectedRoute>} />
            <Route path="/admin/academic/attendance/MarkedAttendance" element={<ProtectedRoute><MarkedAttendance /></ProtectedRoute>} />
            <Route path="/admin/academic/attendance/AttendanceReport" element={<ProtectedRoute><AttendanceReport /></ProtectedRoute>} />
            <Route path="/admin/academic/attendance/AttendanceConfiguration" element={<ProtectedRoute><AttendanceConfiguration /></ProtectedRoute>} />
            <Route path="/admin/academic/attendance/SpellAttendance" element={<ProtectedRoute><SpellAttendance /></ProtectedRoute>} />
            <Route path="/admin/academic/assessment/AssessmentConfiguration" element={<ProtectedRoute><AssessmentConfiguration /></ProtectedRoute>} />
            <Route path="/admin/academic/assessment/AssignmentMarkEntry" element={<ProtectedRoute><AssignmentMarkEntry /></ProtectedRoute>} />
            <Route path="/admin/academic/assessment/AssignmentReport" element={<ProtectedRoute><AssignmentReport /></ProtectedRoute>} />
            <Route path="/admin/academic/assessment/UnitTestMarkEntry" element={<ProtectedRoute><UnitTestMarkEntry /></ProtectedRoute>} />
            <Route path="/admin/academic/assessment/UnitTestMarkReport" element={<ProtectedRoute><UnitTestReport /></ProtectedRoute>} />
            <Route path="/admin/academic/assessment/PracticalMark" element={<ProtectedRoute><PracticalMark /></ProtectedRoute>} />
            <Route path="/admin/academic/assessment/PracticalReport" element={<ProtectedRoute><PracticalReport /></ProtectedRoute>} />
            <Route path="/admin/academic/assessment/UNIVMarkEntry" element={<ProtectedRoute><UNIVMarkEntry /></ProtectedRoute>} />
            <Route path="/admin/academic/assessment/UNIVMarkEntry" element={<ProtectedRoute><UNIVMarkEntry /></ProtectedRoute>} />
            <Route path="/admin/academic/assessment/ArrearEntry" element={<ProtectedRoute><ArrearEntry /></ProtectedRoute>} />
            <Route path="/admin/academic/placement/Placement" element={<ProtectedRoute><Placement /></ProtectedRoute>} />
            <Route path="/admin/academic/placement/PlacementReport" element={<ProtectedRoute><PlacementReport /></ProtectedRoute>} />
            <Route path="/admin/academic/ConsolidatedReport" element={<ProtectedRoute><ConsolidatedReport /></ProtectedRoute>} />

            {/* ---------------- Examination (Data Submission) Module Routes ---------------- */}
            <Route path="/admin/examination/datasubmission/ExamSettings" element={<ProtectedRoute><ExamSettings /></ProtectedRoute>} />
            <Route path="/admin/examination/datasubmission/HallDetails" element={<ProtectedRoute><HallDetails /></ProtectedRoute>} />
            <Route path="/admin/examination/datasubmission/TimeTable" element={<ProtectedRoute><ExamTimeTable /></ProtectedRoute>} /> {/* Use renamed component */}
            {/* <Route path="/admin/examination/datasubmission/EditNominal" element={<ProtectedRoute><EditNominal /></ProtectedRoute>} /> */}
            <Route path="/admin/examination/datasubmission/ExamFee" element={<ProtectedRoute><ExamFee /></ProtectedRoute>} />
            <Route path="/admin/examination/datasubmission/NominalRoll" element={<ProtectedRoute><NominalRoll /></ProtectedRoute>} />
            <Route path="/admin/examination/datasubmission/QPRequirement" element={<ProtectedRoute><QPRequirement /></ProtectedRoute>} />
            <Route path="/admin/examination/datasubmission/StrengthList" element={<ProtectedRoute><StrengthList /></ProtectedRoute>} />
            <Route path="/admin/examination/datasubmission/CheckList" element={<ProtectedRoute><CheckList /></ProtectedRoute>} />
            <Route path="/admin/examination/datasubmission/CollegeStrength" element={<ProtectedRoute><CollegeStrength /></ProtectedRoute>} />
            <Route path="/admin/examination/practicalModel/PracticalPanel" element={<ProtectedRoute><PracticalPanel /></ProtectedRoute>} />
            <Route path="/admin/examination/practicalModel/PracticalTimeTable" element={<ProtectedRoute><PracticalTimeTable /></ProtectedRoute>} />
            <Route path="/admin/examination/practicalModel/PracticalNameList" element={<ProtectedRoute><PracticalNameList /></ProtectedRoute>} />
            <Route path="/admin/examination/examProcess/HallChart" element={<ProtectedRoute><HallChart /></ProtectedRoute>} />
            <Route path="/admin/examination/examProcess/ExamGeneration" element={<ProtectedRoute><ExamGeneration /></ProtectedRoute>} />
            <Route path="/admin/examination/examProcess/SeatAllocation" element={<ProtectedRoute><SeatAllocation /></ProtectedRoute>} />
            <Route path="/admin/examination/examProcess/DaywarStatement" element={<ProtectedRoute><DaywarStatement /></ProtectedRoute>} />
            <Route path="/admin/examination/examProcess/DigitalNumbering" element={<ProtectedRoute><DigitalNumbering /></ProtectedRoute>} />
            <Route path="/admin/examination/examProcess/TheoryNamelist" element={<ProtectedRoute><TheoryNamelist /></ProtectedRoute>} />

            {/* ---------------- Examination (Exam Forms) Module Routes ---------------- */}
            <Route path="/admin/examination/examForms/AbsenteesEntry" element={<ProtectedRoute><AbsenteesEntry /></ProtectedRoute>} />
            <Route path="/admin/examination/examForms/Ex2Present" element={<ProtectedRoute><Ex2Present /></ProtectedRoute>} />
            <Route path="/admin/examination/examForms/Ex2Absent" element={<ProtectedRoute><Ex2Absent /></ProtectedRoute>} />

            {/* ---------------- Admission — Admission Process Routes ---------------- */}
            <Route path="/admin/admission/admission/AdmissionStatus" element={<ProtectedRoute><AdmissionStatus /></ProtectedRoute>} />
            <Route path="/admin/admission/admission/AdmittingStudent" element={<ProtectedRoute><AdmittingStudent /></ProtectedRoute>} />
            <Route path="/admin/admission/admission/StudentDetails" element={<ProtectedRoute><StudentDetails /></ProtectedRoute>} />
            <Route path="/admin/admission/admission/ApplicationIssue" element={<ProtectedRoute><ApplicationIssue /></ProtectedRoute>} />
            <Route path="/admin/admission/admission/PhotoPath" element={<ProtectedRoute><PhotoPath /></ProtectedRoute>} />
            <Route path="/admin/admission/admission/QuotaAllocation" element={<ProtectedRoute><QuotaAllocation /></ProtectedRoute>} />
            <Route path="/admin/admission/admission/StaffReport" element={<ProtectedRoute><StaffReport /></ProtectedRoute>} />

            {/* ---------------- Admission — Reports Module Routes ---------------- */}
            <Route path="/admin/admission/AdmissionReports/AppIssueConsolidate" element={<AppIssueConsolidate />} />
            <Route path="/admin/admission/AdmissionReports/GeneralForms" element={<GeneralForms />} />
            <Route path="/admin/admission/AdmissionReports/StudentProfile" element={<StudentProfile />} />



            {/* ---------------- Admission — Certificates Module Routes ---------------- */}
            <Route path="/admin/admission/certificates/editTc" element={<EditTC />} />
            <Route path="/admin/admission/certificates/tc" element={<TC />} />
            <Route path="/admin/admission/certificates/FeesEstimation" element={<FeesEstimation />} />
            <Route path="/admin/admission/certificates/CourseCompletion" element={<CourseCompletion />} />
            <Route path="/admin/admission/certificates/conduct" element={<Conduct />} />
            <Route path="/admin/admission/certificates/bonafide" element={<Bonafide />} />

            {/* Administrator Module */}

            {/* -------------------- Office ----------------------------- */}
            <Route path="/admin/administrator/office/stockmodule/StockEntry" element={<StockEntry />} />
            <Route path="/admin/administrator/office/stockmodule/PurchaseEntry" element={<PurchaseEntry />} />
            <Route path="/admin/administrator/office/stockmodule/AssetEntry" element={<AssetEntry />} />
            <Route path="/admin/administrator/office/lettermodule/SendLetter" element={<SendLetter />} />
            <Route path="/admin/administrator/office/lettermodule/ReceiveLetter" element={<ReceiveLetter />} />
            <Route path="/admin/administrator/office/feemodule/FeeType" element={<FeeType />} />
            <Route path="/admin/administrator/office/feemodule/FeeRecipt" element={<FeeRecipt />} />
            <Route path="/admin/administrator/office/accountmodule/IncomeExpenseEntry" element={<IncomeExpenseEntry />} />
            <Route path="/admin/administrator/office/accountmodule/IncomeExpenseReport" element={<IncomeExpenseReport />} />
            <Route path="/admin/administrator/office/feemodule/ConsolidatedReportForm" element={<ConsolidatedReportForm />} />
            <Route path="/admin/administrator/office/Budget/BudgetExpenseForm" element={<BudgetExpenseForm />} />
            <Route path="/admin/administrator/office/accountmodule/Settlement" element={<Settlement />} />
            <Route path="/admin/administrator/office/feemodule/StudentFeesForm" element={<StudentFeesForm />} />
            {/* ---------------- Transport Module Routes ---------------- */}
            <Route path="/admin/administrator/transport/vehicle/TransportMaster" element={<TransportMaster />} />
            <Route path="/admin/administrator/transport/vehicle/TransportReports" element={<TransportReports />} />
            <Route path="/admin/administrator/transport/fess&expense/BusMaintenanceSalary" element={<BusMaintenanceSalary />} />
            <Route path="/admin/administrator/transport/fess&expense/BusMaintenanceSalaryReports" element={<BusMaintenanceSalaryReports />} />
            <Route path="/admin/administrator/transport/fess&expense/StudentBusFee" element={<StudentBusFee />} />
            <Route path="/admin/administrator/transport/fess&expense/StudentBusFeeReports" element={<StudentBusFeeReports />} />

            {/* ---------------- Enquiry Module Routes ---------------- */}
            <Route path="/admin/admission/enquiry/EnquiryReport" element={<ProtectedRoute><EnquiryReport /></ProtectedRoute>} />
            <Route path="/admin/admission/enquiry/StudentEnquiry" element={<ProtectedRoute><StudentEnquiry /></ProtectedRoute>} />
            <Route path="/admin/admission/enquiry/EnquiryDashboard" element={<ProtectedRoute><EnquiryDashboard /></ProtectedRoute>} />
            <Route path="/admin/admission/enquiry/AssignCall" element={<ProtectedRoute><AssignCall /></ProtectedRoute>} />
            <Route path="/admin/admission/enquiry/CallerDetails" element={<ProtectedRoute><CallerDetails /></ProtectedRoute>} />
            <Route path="/admin/admission/enquiry/LeadManagement" element={<ProtectedRoute><LeadManagement /></ProtectedRoute>} />
            <Route path="/admin/admission/enquiry/leads/:id" element={<ProtectedRoute><LeadDetails /></ProtectedRoute>} />

            {/* ---------------- HR Module Routes ---------------- */}
            <Route path="/hr" element={<Navigate to="/hr/dashboard" replace />} />
            <Route path="/hr/dashboard" element={<ProtectedRoute><HRDashboard /></ProtectedRoute>} />
            <Route path="/hr/staff-directory" element={<ProtectedRoute><StaffDetails /></ProtectedRoute>} />


            {/* Employee Management */}
            <Route path="/hr/employee-profile" element={<ProtectedRoute><EmployeeProfile /></ProtectedRoute>} />
            <Route path="/hr/staff_documents" element={<ProtectedRoute><StaffDocuments /></ProtectedRoute>} />
            <Route path="/hr/staff-documents" element={<ProtectedRoute><StaffDocuments /></ProtectedRoute>} />
            <Route path="/hr/employee-reports" element={<ProtectedRoute><EmployeeReports /></ProtectedRoute>} />
            <Route path="/hr/add-employee" element={<ProtectedRoute><StaffDetails /></ProtectedRoute>} />

            {/* Attendance & Time */}
            <Route path="/hr/staff-attendance" element={<ProtectedRoute><StaffAttendance /></ProtectedRoute>} />
            <Route path="/hr/time-office" element={<ProtectedRoute><TimeOffice /></ProtectedRoute>} />
            <Route path="/hr/shift_management" element={<ProtectedRoute><ShiftManagement /></ProtectedRoute>} />
            <Route path="/hr/shift-management" element={<ProtectedRoute><ShiftManagement /></ProtectedRoute>} />
            <Route path="/hr/attendance_report" element={<ProtectedRoute><HRAttendanceReport /></ProtectedRoute>} />
            <Route path="/hr/attendance-report" element={<ProtectedRoute><HRAttendanceReport /></ProtectedRoute>} />
            <Route path="/hr/attendance-reports" element={<ProtectedRoute><HRAttendanceReport /></ProtectedRoute>} />

            {/* Leave Management */}
            <Route path="/hr/leave-application" element={<ProtectedRoute><LeaveApplication /></ProtectedRoute>} />
            <Route path="/hr/leave-approval" element={<ProtectedRoute><LeaveApproval /></ProtectedRoute>} />
            <Route path="/hr/leave-register" element={<ProtectedRoute><LeaveRegister /></ProtectedRoute>} />
            <Route path="/hr/leave-configuration" element={<ProtectedRoute><LeaveConfiguration /></ProtectedRoute>} />
            <Route path="/hr/leave_balance" element={<ProtectedRoute><LeaveBalance /></ProtectedRoute>} />
            <Route path="/hr/leave-balance" element={<ProtectedRoute><LeaveBalance /></ProtectedRoute>} />
            <Route path="/hr/leave-analysis" element={<ProtectedRoute><LeaveAnalysis /></ProtectedRoute>} />

            {/* Payroll */}
            <Route path="/hr/salary-structure" element={<ProtectedRoute><SalaryStructure /></ProtectedRoute>} />
            <Route path="/hr/monthly-processing" element={<ProtectedRoute><MonthlyProcessing /></ProtectedRoute>} />
            <Route path="/hr/payslip_generation" element={<ProtectedRoute><PayslipGeneration /></ProtectedRoute>} />
            <Route path="/hr/payslip-generation" element={<ProtectedRoute><PayslipGeneration /></ProtectedRoute>} />
            <Route path="/hr/payroll_reports" element={<ProtectedRoute><PayrollReports /></ProtectedRoute>} />
            <Route path="/hr/payroll-reports" element={<ProtectedRoute><PayrollReports /></ProtectedRoute>} />

            <Route path="/hr/payroll-summary" element={<ProtectedRoute><PayrollSummary /></ProtectedRoute>} />

            {/* ---------------- Student Dashboard Routes ---------------- */}
            <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute><StudentProfiles /></ProtectedRoute>} />
            <Route path="/student/attendance" element={<ProtectedRoute><StudentAttendance /></ProtectedRoute>} />
            <Route path="/student/mark-details" element={<ProtectedRoute><StudentMarkDetail /></ProtectedRoute>} />
            <Route path="/student/academic-history" element={<ProtectedRoute><AcademicHistory /></ProtectedRoute>} />
            <Route path="/student/timetable" element={<ProtectedRoute><Timetable /></ProtectedRoute>} />
            <Route path="/student/learning-resources" element={<ProtectedRoute><LearningResources /></ProtectedRoute>} />
            <Route path="/student/noticeboard" element={<ProtectedRoute><Noticeboard /></ProtectedRoute>} />
            <Route path="/student/academic-calendar" element={<ProtectedRoute><StudentAcademicCalendar /></ProtectedRoute>} />

            {/* 404 / Catch-all */}
            <Route
              path="*"
              element={
                <div className="flex items-center justify-center h-screen">
                  <h1 className="text-3xl font-bold text-gray-700">404 | Page Not Found</h1>
                </div>
              }
            />
          </Routes>
        </Router>
      </EnquiryProvider>
    </AuthProvider>
  );
};

export default App;
