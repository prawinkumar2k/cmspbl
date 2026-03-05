import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useAuth } from "../context/AuthContext";
import "./css/sidebar-enhanced.css";

const Sidebar = () => {
  const location = useLocation();
  const { getAuthHeaders, user } = useAuth();

  // State for API-fetched modules
  const [sidebarModules, setSidebarModules] = useState([]);
  const [isLoadingModules, setIsLoadingModules] = useState(true);
  const [useDynamicSidebar, setUseDynamicSidebar] = useState(true); // Toggle between API and static config
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false); // Track sidebar minimized state
  const [hoveredDropdown, setHoveredDropdown] = useState(null); // Track which dropdown is hovered

  // Fetch sidebar modules from API
  useEffect(() => {
    const fetchSidebarModules = async () => {
      // console.log('fetchSidebarModules called, user:', user);

      if (!user) {
        // console.log('No user found, skipping sidebar fetch');
        setIsLoadingModules(false);
        return;
      }

      try {
        // console.log('Fetching sidebar modules for user:', user.username);
        const token = localStorage.getItem('token');
        // console.log('Token from localStorage:', token ? 'Present' : 'Not present');

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        };
        // console.log('Request headers:', headers);

        const response = await fetch('/api/auth/sidebar', {
          headers: headers
        });

        // console.log('Sidebar API response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to fetch sidebar modules. Status:', response.status, 'Response:', errorText);
          setUseDynamicSidebar(false);
          setIsLoadingModules(false);
          return;
        }

        const data = await response.json();
        // console.log('Sidebar modules received:', data);
        setSidebarModules(data.data || []);
        setUseDynamicSidebar(true);
        setIsLoadingModules(false);
      } catch (err) {
        console.error('Error fetching sidebar:', err);
        setUseDynamicSidebar(false);
        setIsLoadingModules(false);
      }
    };

    fetchSidebarModules();
  }, [user]);

  // Get color for menu items - with icon background and text colors
  const getMenuItemColor = (moduleKey, index) => {
    const colorMap = {
      // Main Category Colors - from HomePage
      'dashboard': {
        bg: '#5568d3', text: '#000', light: 'rgba(102, 126, 234, 0.15)',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        dark: '#3d4fa6', colorClass: 'blue'
      },
      'file': {
        bg: '#5568d3', text: '#000', light: 'rgba(102, 126, 234, 0.15)',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        dark: '#3d4fa6', colorClass: 'blue'
      },
      'academic': {
        bg: '#0ea5e9', text: '#000', light: 'rgba(79, 172, 254, 0.15)',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        dark: '#0d7fb5', colorClass: 'cyan'
      },
      'others': {
        bg: '#5568d3', text: '#000', light: 'rgba(102, 126, 234, 0.15)',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        dark: '#3d4fa6', colorClass: 'blue'
      },
      'enquiry': {
        bg: '#f5576c', text: '#000', light: 'rgba(240, 147, 251, 0.15)',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        dark: '#d63842', colorClass: 'pink'
      },
      'application': {
        bg: '#fee140', text: '#000', light: 'rgba(250, 112, 154, 0.15)',
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        dark: '#af57fcff', colorClass: 'yellow'
      },
      'admissionreport': {
        bg: '#280769ff', text: '#000', light: 'rgba(240, 147, 251, 0.15)',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        dark: '#641791ff', colorClass: 'pink'
      },
      'certificates': {
        bg: '#fed6e3', text: '#000', light: 'rgba(168, 237, 234, 0.15)',
        gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        dark: '#f44180ff', colorClass: 'teal'
      },
      'attendance': {
        bg: '#0ea5e9', text: '#000', light: 'rgba(79, 172, 254, 0.15)',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        dark: '#41bcf5ff', colorClass: 'cyan'
      },
      'assessment': {
        bg: '#0ea5e9', text: '#000', light: 'rgba(79, 172, 254, 0.15)',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        dark: '#0db56fff', colorClass: 'cyan'
      },
      'placement': {
        bg: '#fecfef', text: '#000', light: 'rgba(255, 154, 158, 0.15)',
        gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        dark: '#fe5269ff', colorClass: 'red'
      },

      // Examination / Practical / Forms specific colors
      'data submission': {
        bg: '#60a5fa', text: '#000', light: 'rgba(96,165,250,0.12)',
        gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
        dark: '#2563eb', colorClass: 'blue'
      },
      'exam process': {
        bg: '#8b5cf6', text: '#000', light: 'rgba(139,92,246,0.12)',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        dark: '#6d28d9', colorClass: 'purple'
      },
      'practical/model': {
        bg: '#059669', text: '#000', light: 'rgba(16,185,129,0.12)',
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        dark: '#047857', colorClass: 'green'
      },
      'exam forms': {
        bg: '#f97316', text: '#000', light: 'rgba(249,115,22,0.12)',
        gradient: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
        dark: '#c2410c', colorClass: 'orange'
      },

      // File submenu colors
      'file_user_creation': {
        bg: '#5568d3', text: '#000', light: 'rgba(102, 126, 234, 0.15)',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        dark: '#3d4fa6', colorClass: 'blue'
      },
      'file_log_details': {
        bg: '#38a169', text: '#000', light: 'rgba(72, 187, 120, 0.15)',
        gradient: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
        dark: '#2d6a4f', colorClass: 'green'
      },
      'file_user_manual': {
        bg: '#d69e2e', text: '#000', light: 'rgba(237, 137, 54, 0.15)',
        gradient: 'linear-gradient(135deg, #ed8936 0%, #d69e2e 100%)',
        dark: '#a56a1e', colorClass: 'orange'
      },

      // Academic submenu colors
      'academic_academic_calendar': {
        bg: '#0ea5e9', text: '#000', light: 'rgba(79, 172, 254, 0.15)',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        dark: '#0d7fb5', colorClass: 'cyan'
      },
      'academic_department': {
        bg: '#0ea5e9', text: '#000', light: 'rgba(79, 172, 254, 0.15)',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        dark: '#0d7fb5', colorClass: 'cyan'
      },
      'academic_subject': {
        bg: '#805ad5', text: '#000', light: 'rgba(159, 122, 234, 0.15)',
        gradient: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)',
        dark: '#5e3b9e', colorClass: 'purple'
      },
      'academic_class_allocation': {
        bg: '#5568d3', text: '#000', light: 'rgba(102, 126, 234, 0.15)',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        dark: '#3d4fa6', colorClass: 'blue'
      },
      'academic_subject_allocation': {
        bg: '#e53e3e', text: '#000', light: 'rgba(245, 101, 101, 0.15)',
        gradient: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
        dark: '#c02623', colorClass: 'red'
      },
      'academic_time_table': {
        bg: '#319795', text: '#000', light: 'rgba(56, 178, 172, 0.15)',
        gradient: 'linear-gradient(135deg, #38b2ac 0%, #319795 100%)',
        dark: '#245057', colorClass: 'teal'
      },
      'academic_staff_details': {
        bg: '#ed64a6', text: '#000', light: 'rgba(246, 135, 179, 0.15)',
        gradient: 'linear-gradient(135deg, #f687b3 0%, #f093fb 100%)',
        dark: '#d6428f', colorClass: 'pink'
      },
      'academic_fee_details': {
        bg: '#06b6d4', text: '#000', light: 'rgba(48, 207, 208, 0.15)',
        gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        dark: '#0891b2', colorClass: 'cyan'
      },

      // Others submenu colors
      'others_course_master': {
        bg: '#5568d3', text: '#000', light: 'rgba(102, 126, 234, 0.15)',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        dark: '#3d4fa6', colorClass: 'blue'
      },
      'others_regulation_master': {
        bg: '#38a169', text: '#000', light: 'rgba(72, 187, 120, 0.15)',
        gradient: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
        dark: '#2d6a4f', colorClass: 'green'
      },
      'others_semester_master': {
        bg: '#d69e2e', text: '#000', light: 'rgba(237, 137, 54, 0.15)',
        gradient: 'linear-gradient(135deg, #ed8936 0%, #d69e2e 100%)',
        dark: '#a56a1e', colorClass: 'orange'
      },
      'others_fee_master': {
        bg: '#e53e3e', text: '#000', light: 'rgba(245, 101, 101, 0.15)',
        gradient: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
        dark: '#c02623', colorClass: 'red'
      },
      'others_academic_year_master': {
        bg: '#805ad5', text: '#000', light: 'rgba(159, 122, 234, 0.15)',
        gradient: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)',
        dark: '#5e3b9e', colorClass: 'purple'
      },
      'others_designation_master': {
        bg: '#319795', text: '#000', light: 'rgba(56, 178, 172, 0.15)',
        gradient: 'linear-gradient(135deg, #38b2ac 0%, #319795 100%)',
        dark: '#245057', colorClass: 'teal'
      },

      // General Data / Letter / Office / Transport Categories
      'general data': {
        bg: '#5568d3', text: '#000', light: 'rgba(102, 126, 234, 0.15)',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        dark: '#3d4fa6', colorClass: 'blue'
      },
      'letter data': {
        bg: '#06b6d4', text: '#000', light: 'rgba(48, 207, 208, 0.15)',
        gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        dark: '#0891b2', colorClass: 'cyan'
      },
      'office': {
        bg: '#d69e2e', text: '#000', light: 'rgba(237, 137, 54, 0.15)',
        gradient: 'linear-gradient(135deg, #ed8936 0%, #d69e2e 100%)',
        dark: '#a56a1e', colorClass: 'orange'
      },
      'office report': {
        bg: '#e53e3e', text: '#000', light: 'rgba(245, 101, 101, 0.15)',
        gradient: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
        dark: '#c02623', colorClass: 'red'
      },
      'transport': {
        bg: '#805ad5', text: '#000', light: 'rgba(159, 122, 234, 0.15)',
        gradient: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)',
        dark: '#5e3b9e', colorClass: 'purple'
      },
      'transport report': {
        bg: '#38a169', text: '#000', light: 'rgba(72, 187, 120, 0.15)',
        gradient: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
        dark: '#2d6a4f', colorClass: 'green'
      },
      management: {
        bg: '#d69e2e', text: '#000', light: 'rgba(237, 137, 54, 0.15)',
        gradient: 'linear-gradient(135deg, #ed8936 0%, #d69e2e 100%)',
        dark: '#a56a1e', colorClass: 'orange'
      },
      borrower: {
        bg: '#e53e3e', text: '#000', light: 'rgba(245, 101, 101, 0.15)',
        gradient: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
        dark: '#c02623', colorClass: 'red'
      },
      circulation: {
        bg: '#805ad5', text: '#000', light: 'rgba(159, 122, 234, 0.15)',
        gradient: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)',
        dark: '#5e3b9e', colorClass: 'purple'
      },
      reports: {
        bg: '#38a169', text: '#000', light: 'rgba(72, 187, 120, 0.15)',
        gradient: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
        dark: '#2d6a4f', colorClass: 'green'
      },
      'hrdashboard': {
        bg: '#805ad5', text: '#000', light: 'rgba(72, 187, 120, 0.15)',
        gradient: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)',
        dark: '#5e3b9e', colorClass: 'purple'
      },
      'hremployee': {
        bg: '#e53e3e', text: '#000', light: 'rgba(72, 187, 120, 0.15)',
        gradient: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
        dark: '#c02623', colorClass: 'red'
      },
      'hrattendance': {
        bg: '#d69e2e', text: '#000', light: 'rgba(72, 187, 120, 0.15)',
        gradient: 'linear-gradient(135deg, #ed8936 0%, #d69e2e 100%)',
        dark: '#a56a1e', colorClass: 'orange'
      },
      'hrleave': {
        bg: '#5568d3', text: '#000', light: 'rgba(72, 187, 120, 0.15)',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        dark: '#3d4fa6', colorClass: 'blue'
      },
      'hrpayroll': {
        bg: '#06b6d4', text: '#000', light: 'rgba(72, 187, 120, 0.15)',
        gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        dark: '#0891b2', colorClass: 'cyan'
      },
      'hrreports': {
        bg: '#38a169', text: '#000', light: 'rgba(72, 187, 120, 0.15)',
        gradient: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
        dark: '#2d6a4f', colorClass: 'green'
      }
    };

    // Fallback colors based on index - matching homepage gradients
    const fallbackColors = [
      { bg: '#5568d3', text: '#000', light: 'rgba(102, 126, 234, 0.15)', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', dark: '#3d4fa6', colorClass: 'blue' },
      { bg: '#0ea5e9', text: '#000', light: 'rgba(79, 172, 254, 0.15)', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', dark: '#0d7fb5', colorClass: 'cyan' },
      { bg: '#f5576c', text: '#000', light: 'rgba(240, 147, 251, 0.15)', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', dark: '#d63842', colorClass: 'pink' },
      { bg: '#a0650bff', text: '#000', light: 'rgba(250, 112, 154, 0.15)', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', dark: '#ffd700', colorClass: 'yellow' },
      { bg: '#0dbcadff', text: '#000', light: 'rgba(48, 207, 208, 0.15)', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', dark: '#0891b2', colorClass: 'cyan' },
      { bg: '#aa1041ff', text: '#000', light: 'rgba(168, 237, 234, 0.15)', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', dark: '#fcb8c8', colorClass: 'teal' },
      { bg: '#dc5602ff', text: '#000', light: 'rgba(255, 154, 158, 0.15)', gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', dark: '#f97d8b', colorClass: 'red' },
      { bg: '#097e2eff', text: '#000', light: 'rgba(255, 236, 210, 0.15)', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', dark: '#f59666', colorClass: 'orange' }
    ];
    return colorMap[moduleKey] || fallbackColors[index % fallbackColors.length];
  };

  // Build dynamic sidebar config from API data grouped by category while respecting display_order
  const buildDynamicSidebarConfig = () => {
    // console.log('Building dynamic sidebar config. sidebarModules:', sidebarModules);
    // console.log('useDynamicSidebar:', useDynamicSidebar);

    // Icon mapping only (routes now come from module_path in database)
    const iconMap = {
      'dashboard': 'solar:home-smile-angle-outline',
      'file': 'solar:file-outline',
      'file_user_creation': 'solar:user-plus-bold',
      'file_log_details': 'solar:document-text-bold',
      'file_student login': 'solar:laptop-outline',
      'academic': 'solar:book-outline',
      'academic_academiccalendar': 'solar:calendar-bold',
      'academic_department': 'solar:buildings-bold',
      'academic_subject': 'solar:book-bold',
      'academic_subjectallocation': 'solar:clipboard-list-bold',
      'academic_class_allocation': 'solar:users-group-rounded-bold',
      'academic_timetable': 'solar:calendar-mark-bold',
      'academic_staffdetails': 'solar:user-id-bold',
      'academic_feedetails': 'solar:dollar-bold',
      'others_coursemaster': 'solar:course-up-bold-duotone',
      'others': 'solar:settings-outline',
      'others_regulationmaster': 'solar:document-bold',
      'others_semestermaster': 'solar:calendar-bold',
      'others_feemaster': 'solar:wallet-bold',
      'others_academicyearmaster': 'solar:calendar-search-bold',
      'others_designationmaster': 'solar:medal-ribbons-star-bold',

      // Administration keys
      'general data': 'solar:layers-outline',
      'general data_stock entry & report': 'solar:box-outline',
      'general data_purchase entry & report': 'solar:cart-outline',
      'general data_asset entry & report': 'solar:buildings-outline',
      // Letter Data
      'letter data': 'solar:mailbox-outline',
      'letter data_send letter': 'solar:upload-outline',
      'letter data_receive letter': 'solar:bell-outline',

      // Office
      'office': 'solar:buildings-outline',
      'office_student fees': 'solar:wallet-outline',
      'office_fees receipt': 'solar:card-outline',
      'office_income & expense': 'solar:graph-outline',
      'office_settlement': 'solar:hand-money-outline',

      // Office Reports
      'office report': 'solar:clipboard-text-outline',
      'office report_income & expenditure': 'solar:chart-square-outline',
      'office report_fees collection report': 'solar:chart-outline',
      'office report_consolidate report': 'solar:layers-outline',
      'office report_budget report': 'solar:pie-chart-outline',

      // Transport
      'transport': 'solar:bus-outline',
      'transport report': 'solar:map-outline',
      'transport_transport master': 'solar:route-outline',
      'transport report_transport report': 'solar:scooter-outline',
      'transport_student bus fees': 'solar:ticket-outline',
      'transport report_bus fees report': 'solar:document-text-outline',
      'transport_bus maintance & salary': 'solar:settings-outline',
      'transport report_bus maintance & salary report': 'solar:hiking-outline',

      'enquiry': 'solar:question-circle-outline',
      'enquiry_enquiry dashboard': 'solar:widget-outline',
      'enquiry_studentenquiry': 'solar:question-circle-outline',
      'enquiry_enquiryreport': 'solar:document-text-outline',
      'enquiry_assign call': 'solar:phone-outline',
      'enquiry_caller details': 'solar:user-id-outline',
      'enquiry_lead management': 'solar:history-outline',
      'application': 'solar:document-add-outline',
      'application_quotaallocation': 'solar:layers-outline',
      'application_applicationissue': 'solar:clipboard-text-outline',
      'application_studentregister': 'solar:user-plus-outline',
      'application_admittedstudent': 'solar:user-check-outline',
      'application_photopath': 'solar:camera-outline',
      'admission report': 'solar:document-outline',
      'admission report_studentprofile': 'solar:user-id-outline',
      'admission report_generalforms': 'solar:document-outline',
      'admission report_ranking': 'solar:cup-star-outline',
      'admission report_appissuecoursewise': 'solar:list-check-outline',
      'admission report_appissueconsolidate': 'solar:layers-outline',
      'admission report_admittedlist': 'solar:user-check-outline',
      'admission report_studentmarkdetails': 'solar:chart-square-outline',
      'admission report_studentreport': 'solar:document-text-outline',
      'certificates': 'solar:document-medicine-outline',
      'certificates_edittc': 'solar:pen-new-square-outline',
      'certificates_tc': 'solar:file-text-outline',
      'certificates_feesestimation': 'solar:calculator-outline',
      'certificates_coursecompletion': 'solar:diploma-outline',
      'certificates_conduct': 'solar:shield-check-outline',
      'certificates_bonafide': 'solar:file-text-outline',

      // Attendance & Assessment & Placement
      'attendance': 'solar:calendar-mark-outline',
      'attendance_attendanceconfiguration': 'solar:settings-outline',
      'attendance_dailyattendance': 'solar:calendar-outline',
      'attendance_markedattendance': 'solar:checklist-outline',
      'attendance_spellattendance': 'solar:history-outline',
      'assessment': 'solar:document-text-outline',
      'assessment_assessmentconfiguration': 'solar:settings-outline',
      'assessment_assignmentmarkentry': 'solar:pen-new-square-outline',
      'assessment_unittestmarkentry': 'solar:pen-new-square-outline',
      'assessment_practicalmarkentry': 'solar:pen-new-square-outline',
      'assessment_univ external mark': 'solar:pen-new-square-outline',
      'assessment_arrear entry': 'solar:pen-new-square-outline',
      'placement': 'solar:case-minimalistic-outline',
      'placement_placement': 'solar:case-minimalistic-outline',

      // Attendance & Assessment & Placement Reports
      'reports_attendancereport': 'solar:document-text-outline',
      'reports_assignmentmarkreport': 'solar:document-text-outline',
      'reports_unittestmarkreport': 'solar:chart-outline',
      'reports_practicalmarkreport': 'solar:chart-square-outline',
      'reports_placement report': 'solar:case-minimalistic-outline',
      'reports_consolidate report': 'solar:layers-outline',

      // Examination keys
      'data submission': 'bi-database-check',
      'data submission_examsettings': 'bi-gear',
      'data submission_halldetails': 'bi-building',
      'data submission_timetable': 'tabler-file-time-filled',
      'data submission_nominalroll': 'hugeicons-id-verified', // Keep as is
      'data submission_qprequirement': 'material-symbols:quiz-outline',
      'data submission_strengthlist': 'solar:users-group-two-rounded-outline',
      'data submission_checklist': 'tabler:clipboard-check',
      'data submission_examfee': 'tabler:coin-rupee-filled',

      'exam process': 'tabler:database-search',
      'exam process_examgeneration': 'solar:calendar-mark-outline',
      'exam process_hallchart': 'solar:check-square-outline',
      'exam process_seatallocation': 'solar:clipboard-list-outline',
      'exam process_daywarstatement': 'tabler:report',
      'exam process_digitalnumbering': 'solar:user-minus-outline',
      'exam process_theorynamelist': 'solar:user-cross-outline',
      'exam process_qpdistribution': 'solar:user-id-outline',
      'exam process_editexamprocess': 'tabler:edit',
      'exam process_duplicatefinder': 'tabler:copy',

      'practical/model': 'tabler:cube',  // Represents practical/lab work
      'practical/model_practicalpanel': 'solar:users-group-rounded-outline', // Panel = group of people
      'practical/model_practicaltimetable': 'solar:calendar-mark-outline', // Timetable/calendar
      'practical/model_practicalnamelist': 'tabler:file-text', // List of names

      'exam forms': 'tabler:forms',
      'exam forms_absenteesentry': 'tabler:user-off',
      'exam forms_ex2present': 'solar:user-check-outline',
      'exam forms_ex2absent': 'solar:user-minus-outline',

      // Library keys - Tabler Icons
      'management': 'tabler-library',
      'management_addbook': 'tabler-book-upload',
      'management_availablebook': 'tabler-book-plus',
      'management_bookavailability': 'tabler-book-check',
      'management_missingbook': 'tabler-book-x',
      'managemnt_stockverification': 'tabler-book-search',

      'borrower': 'tabler-users',
      'borrower_addborrower': 'tabler-user-plus',
      'borrower_modifyborrowerdetail': 'tabler-user-edit',
      'borrower_currentborrower': 'tabler-user-check',
      'borrower_currentborrowerreport': 'tabler-user-search',

      'circulation': 'tabler-refresh',
      'circulation_bookissue': 'tabler-book-download',
      'circulation_bookissuereport': 'tabler-book-search',
      'circulation_duedateexit': 'tabler-calendar-due',
      'circulation_noduecertificate': 'tabler-certificate',

      'fine': 'tabler-currency-dollar',
      'fine_report': 'tabler-report-money',

      'reports': 'tabler-report-analytics',
      'report_bookhistory': 'tabler-history',


      // Library Icons mapping
      // Management
      'management_add book': 'solar:clipboard-add-outline',
      'management_available books': 'solar:book-outline',

      // Borrower
      'borrower_add borrower': 'solar:user-plus-outline',
      'borrower_current borrower': 'solar:user-check-outline',

      // Circulation
      'circulation_book issue': 'solar:book-minimalistic-outline',
      'circulation_book issue report': 'solar:document-text-outline',
      'circulation_due date exit': 'solar:calendar-date-outline',
      'circulation_no due certificate': 'solar:book-bookmark-outline',

      // Reports
      'reports_fine report': 'solar:wallet-money-outline',
      'reports_book history': 'solar:history-outline',

      // HR Modules
      // Dashboard
      'hrdashboard': 'solar:widget-2-outline',

      // Employee
      'employeeprofile': 'solar:user-circle-outline',

      // Attendance
      'hrattendance': 'solar:calendar-outline',
      'hrattendance_staffattendance': 'solar:clipboard-check-outline',
      'hrattendance_attendancereport': 'solar:chart-outline',
      'hrattendance_timeoffice': 'solar:clock-circle-outline',

      // Leave
      'hrleave': 'solar:exit-outline',
      'hrleave_leaveconfiguration': 'solar:settings-outline',
      'hrleave_leaveapplication': 'solar:document-add-outline',
      'hrleave_leaveapproval': 'solar:checklist-outline',
      'hrleave_leaveregister': 'solar:documents-outline',

      // Payroll
      'hrpayroll': 'solar:wallet-outline',
      'hrpayroll_salarystructure': 'solar:money-bag-outline',
      'hrpayroll_monthlyprocessing': 'solar:refresh-outline',
      'hrpayroll_payslipgeneration': 'solar:bill-outline',
      'hrpayroll_payrollreports': 'solar:chart-2-outline',

      // Reports
      'hrreports': 'solar:file-text-outline',
      'hrreports_employeereports': 'solar:users-group-rounded-outline',
      'hrreports_attendancereports': 'solar:calendar-search-outline',
      'hrreports_payrollsummary': 'solar:pie-chart-outline',
      'hrreports_leaveanalysis': 'solar:chart-square-outline'

    };
    // Group modules by category while preserving order from display_order
    const categoryGroups = {};
    const categoryOrder = []; // Track category order

    sidebarModules.forEach(module => {
      const category = module.module_category || 'Others';
      if (!categoryGroups[category]) {
        categoryGroups[category] = [];
        categoryOrder.push(category); // Track order of appearance
      }
      categoryGroups[category].push(module);
    });

    // Convert to sidebar config format with categories (in original order)
    const dynamicConfig = [];

    categoryOrder.forEach(category => {
      // Group modules within category by parent, preserving display_order
      const structure = {};
      const parentOrderMap = {}; // Track min display_order for each parent

      categoryGroups[category].forEach(module => {
        const moduleKey = module.module_key || 'others';
        const parts = moduleKey.split('_');
        const parentKey = parts[0].toLowerCase();

        if (parts.length === 1) {
          // Top-level module
          structure[parentKey] = structure[parentKey] || { children: [], displayOrder: module.display_order };
          structure[parentKey].module = module;
          structure[parentKey].displayOrder = Math.min(structure[parentKey].displayOrder, module.display_order);
          parentOrderMap[parentKey] = Math.min(parentOrderMap[parentKey] || 999, module.display_order);
        } else {
          // Child module
          structure[parentKey] = structure[parentKey] || { children: [], displayOrder: module.display_order };
          structure[parentKey].children.push(module);
          parentOrderMap[parentKey] = Math.min(parentOrderMap[parentKey] || 999, module.display_order);
        }
      });

      // Sort children within each parent by their display_order
      Object.keys(structure).forEach(parentKey => {
        structure[parentKey].children.sort((a, b) => (a.display_order || 999) - (b.display_order || 999));
      });

      // Sort parent keys by their minimum display_order
      const sortedParentKeys = Object.keys(structure).sort((a, b) => {
        return (parentOrderMap[a] || 999) - (parentOrderMap[b] || 999);
      });

      // Check if category should show header (more than 1 parent module)
      const shouldShowCategoryHeader = sortedParentKeys.length > 1 ||
        (sortedParentKeys.length === 1 && structure[sortedParentKeys[0]].children.length > 0);

      // Add category section header only if needed
      if (shouldShowCategoryHeader) {
        dynamicConfig.push({
          id: `section_${category}`,
          type: 'section',
          label: category
        });
      }

      // Add modules for this category in order
      sortedParentKeys.forEach(parentKey => {
        const parent = structure[parentKey];
        const parentIcon = iconMap[parentKey] || 'solar:folder-outline';
        const parentLabel = parent.module?.module_name || parentKey.charAt(0).toUpperCase() + parentKey.slice(1);

        if (parent.children.length === 0) {
          // Single item without dropdown - use module_path from database
          const moduleRoute = parent.module?.module_path || '#';
          dynamicConfig.push({
            id: `${category}_${parentKey}`,
            moduleKey: parentKey,
            type: 'link',
            icon: parentIcon,
            label: parentLabel,
            href: moduleRoute
          });
        } else {
          // Dropdown with children - use module_path from database for each child
          const items = parent.children.map((child, childIndex) => {
            const childKey = child.module_key.toLowerCase();
            const childIcon = iconMap[childKey] || 'solar:record-circle-bold';
            const colorObj = getMenuItemColor(childKey, childIndex);

            return {
              label: child.module_name,
              href: child.module_path || '#',
              icon: childIcon,
              bg: colorObj.bg,
              text: colorObj.text,
              light: colorObj.light,
              gradient: colorObj.gradient,
              dark: colorObj.dark,
              colorClass: colorObj.colorClass,
              dotColor: colorObj.bg,
              bgColor: colorObj.bg,
              textColor: colorObj.text,
              lightBg: colorObj.light
            };
          });

          dynamicConfig.push({
            id: `${category}_${parentKey}`,
            moduleKey: parentKey,
            type: 'dropdown',
            icon: parentIcon,
            label: parentLabel,
            items: items
          });
        }
      });
    });

    return dynamicConfig;
  };

  const activeSidebarConfig = useMemo(() => {
    const config = buildDynamicSidebarConfig();
    // console.log('activeSidebarConfig computed:', config);
    return config;
  }, [sidebarModules, useDynamicSidebar]);

  // Dynamic state management - automatically creates states for all dropdown items
  const [dropdowns, setDropdowns] = useState({});

  // Initialize dropdowns state when activeSidebarConfig changes
  useEffect(() => {
    const initialDropdowns = activeSidebarConfig.reduce((acc, item) => {
      if (item.type === 'dropdown') {
        acc[item.id] = false;
      }
      return acc;
    }, {});
    setDropdowns(initialDropdowns);
  }, [activeSidebarConfig]);

  // State for nested dropdowns - collect all nested IDs from config
  const [nestedDropdowns, setNestedDropdowns] = useState(() => {
    const nestedIds = {};

    return nestedIds;
  });

  // State for active item
  const [activeItem, setActiveItem] = useState(null);

  const submenuRefs = useRef({});
  const nestedSubmenuRefs = useRef({});
  const sidebarRef = useRef(null);

  // Helper function to check if a route matches an item
  const isRouteActive = (itemHref) => {
    if (!itemHref || itemHref === "#") return false;
    return location.pathname === itemHref;
  };

  // Helper function to find parent dropdown for a nested item
  const findParentDropdown = (nestedId) => {
    for (const item of activeSidebarConfig) {
      if (item.type === 'dropdown' && item.items) {
        const parentItem = item.items.find(
          subItem => subItem.isNested && subItem.nestedId === nestedId
        );
        if (parentItem) {
          return item.id;
        }
      }
    }
    return null;
  };

  // Helper function to find active nested item
  const findActiveNestedItem = () => {
    for (const item of activeSidebarConfig) {
      if (item.type === 'dropdown' && item.items) {
        for (const subItem of item.items) {
          if (subItem.isNested && subItem.nestedId) {
            const nestedModule = sidebarModules.find(m => m.id === subItem.nestedId);
            if (nestedModule && nestedModule.items) {
              const activeItem = nestedModule.items.find(
                nestedItem => isRouteActive(nestedItem.href)
              );
              if (activeItem) {
                return { parentId: item.id, nestedId: subItem.nestedId, activeHref: activeItem.href };
              }
            }
            if (subItem.nestedItems) {
              const activeItem = subItem.nestedItems.find(
                nestedItem => isRouteActive(nestedItem.href)
              );
              if (activeItem) {
                return { parentId: item.id, nestedId: subItem.nestedId, activeHref: activeItem.href };
              }
            }
          }
        }
      }
    }
    return null;
  };

  // Helper function to find active submenu item
  const findActiveSubmenuItem = () => {
    for (const item of activeSidebarConfig) {
      if (item.type === 'dropdown' && item.items) {
        for (const subItem of item.items) {
          if (!subItem.isNested && isRouteActive(subItem.href)) {
            return { parentId: item.id, activeHref: subItem.href };
          }
        }
      }
    }
    return null;
  };

  // Update active item and auto-expand dropdowns based on current route
  useEffect(() => {
    // Find active link item in dynamic config
    const activeLink = activeSidebarConfig.find(
      item => item.type === 'link' && isRouteActive(item.href)
    );

    if (activeLink) {
      setActiveItem(activeLink.href);
      return;
    }

    // Find active submenu item in dynamic config
    const activeSubmenu = findActiveSubmenuItem();
    if (activeSubmenu) {
      setActiveItem(activeSubmenu.activeHref);
      setDropdowns(prev => ({ ...prev, [activeSubmenu.parentId]: true }));
      return;
    }

    // Find active nested item
    const activeNested = findActiveNestedItem();
    if (activeNested) {
      setActiveItem(activeNested.activeHref);
      setDropdowns(prev => ({ ...prev, [activeNested.parentId]: true }));
      setNestedDropdowns(prev => ({ ...prev, [activeNested.nestedId]: true }));
      return;
    }

    setActiveItem(null);
  }, [location.pathname, activeSidebarConfig]);

  // Handle sidebar mobile close
  const closeSidebar = () => {
    if (sidebarRef.current) {
      sidebarRef.current.classList.remove("sidebar-open");
      document.body.classList.remove("overlay-active");
    }
  };

  // Handle dropdown toggle with slide animation
  const toggleDropdown = (dropdownName, event) => {
    event.preventDefault();

    // If sidebar is minimized, don't toggle on click - use hover instead
    if (isSidebarMinimized) {
      return;
    }

    const submenu = submenuRefs.current[dropdownName];
    if (submenu) {
      if (dropdowns[dropdownName]) {
        // Slide up animation
        submenu.style.height = submenu.scrollHeight + "px";
        submenu.offsetHeight; // Force reflow
        submenu.style.height = "0px";
        setTimeout(() => {
          setDropdowns((prev) => ({ ...prev, [dropdownName]: false }));
        }, 300);
      } else {
        // Slide down animation
        setDropdowns((prev) => ({ ...prev, [dropdownName]: true }));
        setTimeout(() => {
          if (submenu) {
            submenu.style.height = "0px";
            submenu.offsetHeight; // Force reflow
            submenu.style.height = submenu.scrollHeight + "px";
          }
        }, 10);
      }
    } else {
      setDropdowns((prev) => ({ ...prev, [dropdownName]: !prev[dropdownName] }));
    }
  };

  // Handle dropdown hover for minimized sidebar
  const handleDropdownMouseEnter = (dropdownId) => {
    if (isSidebarMinimized) {
      setHoveredDropdown(dropdownId);
      // Auto-expand on hover when minimized
      if (!dropdowns[dropdownId]) {
        const submenu = submenuRefs.current[dropdownId];
        if (submenu) {
          setDropdowns((prev) => ({ ...prev, [dropdownId]: true }));
          setTimeout(() => {
            if (submenu) {
              submenu.style.height = "0px";
              submenu.offsetHeight; // Force reflow
              submenu.style.height = submenu.scrollHeight + "px";
            }
          }, 10);
        }
      }
    }
  };

  // Handle dropdown hover out for minimized sidebar
  const handleDropdownMouseLeave = (dropdownId) => {
    if (isSidebarMinimized && hoveredDropdown === dropdownId) {
      setHoveredDropdown(null);
      // Auto-collapse on hover out when minimized
      const submenu = submenuRefs.current[dropdownId];
      if (submenu) {
        submenu.style.height = submenu.scrollHeight + "px";
        submenu.offsetHeight; // Force reflow
        submenu.style.height = "0px";
        setTimeout(() => {
          setDropdowns((prev) => ({ ...prev, [dropdownId]: false }));
        }, 300);
      }
    }
  };

  // Handle nested dropdown toggle
  const toggleNestedDropdown = (nestedId, event) => {
    event.preventDefault();
    event.stopPropagation();

    const nestedSubmenu = nestedSubmenuRefs.current[nestedId];
    if (nestedSubmenu) {
      if (nestedDropdowns[nestedId]) {
        // Slide up animation
        nestedSubmenu.style.height = nestedSubmenu.scrollHeight + "px";
        nestedSubmenu.offsetHeight; // Force reflow
        nestedSubmenu.style.height = "0px";
        setTimeout(() => {
          setNestedDropdowns((prev) => ({ ...prev, [nestedId]: false }));
        }, 300);
      } else {
        // Slide down animation
        setNestedDropdowns((prev) => ({ ...prev, [nestedId]: true }));
        setTimeout(() => {
          if (nestedSubmenu) {
            nestedSubmenu.style.height = "0px";
            nestedSubmenu.offsetHeight; // Force reflow
            nestedSubmenu.style.height = nestedSubmenu.scrollHeight + "px";
          }
        }, 10);
      }
    } else {
      setNestedDropdowns((prev) => ({ ...prev, [nestedId]: !prev[nestedId] }));
    }
  };

  // Clean up height after animation
  useEffect(() => {
    Object.keys(submenuRefs.current).forEach((key) => {
      const submenu = submenuRefs.current[key];
      if (submenu && dropdowns[key]) {
        const handleTransitionEnd = () => {
          if (dropdowns[key]) {
            submenu.style.height = "auto";
          }
        };
        submenu.addEventListener("transitionend", handleTransitionEnd);
        return () => submenu.removeEventListener("transitionend", handleTransitionEnd);
      }
    });

    // Handle nested dropdowns height
    Object.keys(nestedSubmenuRefs.current).forEach((key) => {
      const nestedSubmenu = nestedSubmenuRefs.current[key];
      if (nestedSubmenu && nestedDropdowns[key]) {
        const handleNestedTransitionEnd = () => {
          if (nestedDropdowns[key]) {
            nestedSubmenu.style.height = "auto";
          }
        };
        nestedSubmenu.addEventListener("transitionend", handleNestedTransitionEnd);
        return () => nestedSubmenu.removeEventListener("transitionend", handleNestedTransitionEnd);
      }
    });
  }, [dropdowns, nestedDropdowns]);

  // Render different menu item types
  const renderMenuItem = (item) => {
    switch (item.type) {
      case 'section':
        return (
          <li key={item.id} className="sidebar-menu-group-title">
            {item.label}
          </li>
        );

      case 'link':
        const isLinkActive = isRouteActive(item.href);
        const colorObj = getMenuItemColor(item.moduleKey || item.id, 0);
        return (
          <li key={item.id} className={isLinkActive ? 'active' : ''}>
            <Link
              to={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 0.5rem',
                borderRadius: '12px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                backgroundColor: isLinkActive ? colorObj.light : 'transparent',
                boxShadow: isLinkActive ? `0 4px 12px ${colorObj.bg}20` : 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colorObj.light;
                e.currentTarget.style.boxShadow = `0 4px 16px ${colorObj.bg}25`;
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isLinkActive ? colorObj.light : 'transparent';
                e.currentTarget.style.boxShadow = isLinkActive ? `0 4px 12px ${colorObj.bg}20` : 'none';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <Icon
                icon={item.icon}
                className="menu-icon"
                style={{
                  fontSize: '24px',
                  color: colorObj.dark,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  flexShrink: 0
                }}
              />
              <span style={{
                flex: 1,
                fontWeight: isLinkActive ? '600' : '500',
                color: '#000',
                transition: 'all 0.3s ease'
              }}>{item.label}</span>
            </Link>
          </li>
        );

      case 'dropdown':
        // Check if any child item is active
        const hasActiveChild = item.items?.some(subItem => isRouteActive(subItem.href));
        const dropdownColorObj = getMenuItemColor(item.moduleKey || item.id, 0);
        return (
          <li
            key={item.id}
            className={`dropdown ${dropdowns[item.id] ? "dropdown-open" : ""} ${hasActiveChild ? "active" : ""}`}
            onMouseEnter={() => handleDropdownMouseEnter(item.id)}
            onMouseLeave={() => handleDropdownMouseLeave(item.id)}
          >
            <a
              href="#"
              onClick={(e) => toggleDropdown(item.id, e)}
              className="dropdown-toggle main-dropdown-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 0.5rem',
                margin: '0.25rem 0.25rem',
                borderRadius: '12px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                backgroundColor: hasActiveChild ? dropdownColorObj.light : 'transparent',
                boxShadow: hasActiveChild ? `0 4px 12px ${dropdownColorObj.bg}20` : 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = dropdownColorObj.light;
                e.currentTarget.style.boxShadow = `0 4px 16px ${dropdownColorObj.bg}25`;
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = hasActiveChild ? dropdownColorObj.light : 'transparent';
                e.currentTarget.style.boxShadow = hasActiveChild ? `0 4px 12px ${dropdownColorObj.bg}20` : 'none';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <Icon
                icon={item.icon}
                className="menu-icon"
                style={{
                  fontSize: '24px',
                  color: dropdownColorObj.dark,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  flexShrink: 0
                }}
              />
              <span style={{
                flex: 1,
                fontWeight: hasActiveChild ? '600' : '500',
                color: '#000',
                transition: 'all 0.3s ease'
              }}>
                {item.label}
              </span>
              <Icon
                icon="iconamoon:arrow-down-2-bold"
                className={`dropdown-arrow ${dropdowns[item.id] ? "rotate" : ""}`}
                style={{
                  fontSize: '0.8rem',
                  flexShrink: 0,
                  color: '#000',
                  transition: 'all 0.3s ease'
                }}
              />
            </a>

            <ul
              className="sidebar-submenu"
              ref={(el) => (submenuRefs.current[item.id] = el)}
              style={{
                display: dropdowns[item.id] ? "block" : "none",
                overflow: "hidden",
                transition: "height 0.3s ease",
              }}
            >

              {item.items?.map((subItem, index) => {
                const isSubitemActive = isRouteActive(subItem.href);
                const isNestedActive = subItem.isNested &&
                  (sidebarModules.find(m => m.id === subItem.nestedId)?.items?.some(ni => isRouteActive(ni.href)) ||
                    subItem.nestedItems?.some(ni => isRouteActive(ni.href)));

                return (
                  <li key={index} className={`${subItem.isNested ? "nested-dropdown" : ""} ${isSubitemActive || isNestedActive ? "active" : ""}`}>
                    {subItem.isNested ? (
                      <>
                        <a
                          href="#"
                          onClick={(e) => toggleNestedDropdown(subItem.nestedId, e)}
                          className="nested-dropdown-toggle"
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                          <span className="submenu-icon-wrapper">
                            <Icon
                              icon={subItem.icon || sidebarModules.find(m => m.id === subItem.nestedId)?.icon || "solar:folder-outline"}
                              className={`${subItem.icon === 'material-symbols:circle' ? 'submenu-icon' : 'menu-icon'} ${subItem.color}`}
                            />
                          </span>
                          <span style={{ flex: 1 }}>{subItem.label}</span>
                          <Icon
                            icon="iconamoon:arrow-down-2-bold"
                            className={`nested-dropdown-arrow ${nestedDropdowns[subItem.nestedId] ? "rotate" : ""}`}
                            style={{ fontSize: '0.7rem', flexShrink: 0 }}
                          />
                        </a>

                        <ul
                          className="nested-submenu"
                          ref={(el) => (nestedSubmenuRefs.current[subItem.nestedId] = el)}
                          style={{
                            display: nestedDropdowns[subItem.nestedId] ? "block" : "none",
                            overflow: "hidden",
                            transition: "height 0.3s ease",
                            paddingLeft: "1rem"
                          }}
                        >
                          {(subItem.nestedItems || sidebarModules.find(m => m.id === subItem.nestedId)?.items)?.map((nestedItem, nestedIndex) => {
                            const isNestedItemActive = isRouteActive(nestedItem.href);
                            return (
                              <li key={nestedIndex} className={isNestedItemActive ? "active" : ""}>
                                <Link to={nestedItem.href} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <span
                                    className={`bullet-point ${nestedItem.color.replace('text-', 'bg-')}`}
                                    style={{
                                      width: '6px',
                                      height: '6px',
                                      borderRadius: '50%',
                                      flexShrink: 0
                                    }}
                                  ></span>
                                  <span>{nestedItem.label}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </>
                    ) : (
                      <Link
                        to={subItem.href}
                        className={`sidebar-submenu-link ${isSubitemActive ? "active" : ""}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem 0.5rem',
                          margin: '0.25rem 0.25rem',
                          borderRadius: '12px',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          backgroundColor: isSubitemActive ? subItem.light : 'transparent',
                          boxShadow: isSubitemActive ? `0 4px 12px ${subItem.bg}20` : 'none'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = subItem.light;
                          e.currentTarget.style.boxShadow = `0 4px 16px ${subItem.bg}25`;
                          e.currentTarget.style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = isSubitemActive ? subItem.light : 'transparent';
                          e.currentTarget.style.boxShadow = isSubitemActive ? `0 4px 12px ${subItem.bg}20` : 'none';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <Icon
                          icon={subItem.icon || 'solar:folder-outline'}
                          className="submenu-icon"
                          style={{
                            color: subItem.bg,
                            fontSize: '24px',
                            flexShrink: 0,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        />
                        <span
                          style={{
                            color: '#000',
                            fontWeight: isSubitemActive ? '600' : '500',
                            transition: 'all 0.3s ease',
                            flex: 1
                          }}
                        >
                          {subItem.label}
                        </span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </li>
        );

      default:
        return null;
    }
  };

  // Show loading state
  if (isLoadingModules) {
    return (
      <aside ref={sidebarRef} className="sidebar">
        <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside ref={sidebarRef} className="sidebar">
      {/* Close Button */}
      <button type="button" className="sidebar-close-btn" onClick={closeSidebar}>
        <Icon icon="radix-icons:cross-2" />
      </button>

      {/* Logo Section */}
      <div>
        <a href=" " className="sidebar-logo">
          <img src="/assets/images/6.png" alt="site logo" className="light-logo" />
          {/* <img src="/assets/images/logo-light.png" alt="site logo" className="dark-logo" /> */}
          <img src="/assets/images/7.png" alt="site logo" className="logo-icon" />
        </a>
      </div>

      {/* Menu Section */}
      <div className="sidebar-menu-area">
        <ul className="sidebar-menu" id="sidebar-menu">
          {activeSidebarConfig.map(renderMenuItem)}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
