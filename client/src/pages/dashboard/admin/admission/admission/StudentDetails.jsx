import React, { useState, useRef, useCallback, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Select from 'react-select';
import '../../master/subject.css';
import Navbar from "../../../../../components/Navbar";
import Sidebar from "../../../../../components/Sidebar";
import Footer from "../../../../../components/footer";
import StudentTable from './StudentTable';

/* Toast notifications are handled using react-toastify standard methods */

// Subject constants (unchanged)
const SSLC_SUBJECTS_INITIAL = [
  { subject: 'Tamil', max: 100, marks: '' },
  { subject: 'English', max: 100, marks: '' },
  { subject: 'Mathematics', max: 100, marks: '' },
  { subject: 'Science', max: 100, marks: '' },
  { subject: 'Social Science', max: 100, marks: '' },
];

// HSC Subjects constants (unchanged)
const HSC_SUBJECTS_600 = [
  { subject: 'Tamil', max: 100, marks: '', fixed: true },
  { subject: 'English', max: 100, marks: '', fixed: true },
  { subject: 'Physics', max: 100, marks: '', fixed: false },
  { subject: 'Chemistry', max: 100, marks: '', fixed: false },
  { subject: 'Biology', max: 100, marks: '', fixed: false },
  { subject: 'Mathematics', max: 100, marks: '', fixed: false },
];

const HSC_BIOLOGY_600 = [
  { subject: 'Tamil', max: 100, marks: '', fixed: true },
  { subject: 'English', max: 100, marks: '', fixed: true },
  { subject: 'Physics', max: 100, marks: '', fixed: false },
  { subject: 'Chemistry', max: 100, marks: '', fixed: false },
  { subject: 'Biology', max: 100, marks: '', fixed: false },
  { subject: 'Mathematics', max: 100, marks: '', fixed: false },
];

const HSC_MATHEMATICS_600 = [
  { subject: 'Tamil', max: 100, marks: '', fixed: true },
  { subject: 'English', max: 100, marks: '', fixed: true },
  { subject: 'Physics', max: 100, marks: '', fixed: false },
  { subject: 'Chemistry', max: 100, marks: '', fixed: false },
  { subject: 'Mathematics', max: 100, marks: '', fixed: false },
  { subject: 'Computer Science', max: 100, marks: '', fixed: false },
];

const HSC_COMMERCE_600 = [
  { subject: 'Tamil', max: 100, marks: '', fixed: true },
  { subject: 'English', max: 100, marks: '', fixed: true },
  { subject: 'Accountancy', max: 100, marks: '', fixed: false },
  { subject: 'Economics', max: 100, marks: '', fixed: false },
  { subject: 'Business Studies', max: 100, marks: '', fixed: false },
  { subject: 'Mathematics', max: 100, marks: '', fixed: false },
];

const HSC_HUMANITIES_600 = [
  { subject: 'Tamil', max: 100, marks: '', fixed: true },
  { subject: 'English', max: 100, marks: '', fixed: true },
  { subject: 'History', max: 100, marks: '', fixed: false },
  { subject: 'Geography', max: 100, marks: '', fixed: false },
  { subject: 'Economics', max: 100, marks: '', fixed: false },
  { subject: 'Political Science', max: 100, marks: '', fixed: false },
];

const HSC_SUBJECTS_1200 = [
  { subject: 'Tamil', max: 200, marks: '', fixed: true },
  { subject: 'English', max: 200, marks: '', fixed: true },
  { subject: 'Physics', max: 200, marks: '', fixed: false },
  { subject: 'Chemistry', max: 200, marks: '', fixed: false },
  { subject: 'Biology', max: 200, marks: '', fixed: false },
  { subject: 'Mathematics', max: 200, marks: '', fixed: false },
];

const HSC_BIOLOGY_1200 = [
  { subject: 'Tamil', max: 200, marks: '', fixed: true },
  { subject: 'English', max: 200, marks: '', fixed: true },
  { subject: 'Physics', max: 200, marks: '', fixed: false },
  { subject: 'Chemistry', max: 200, marks: '', fixed: false },
  { subject: 'Biology', max: 200, marks: '', fixed: false },
  { subject: 'Mathematics', max: 200, marks: '', fixed: false },
];

const HSC_MATHEMATICS_1200 = [
  { subject: 'Tamil', max: 200, marks: '', fixed: true },
  { subject: 'English', max: 200, marks: '', fixed: true },
  { subject: 'Physics', max: 200, marks: '', fixed: false },
  { subject: 'Chemistry', max: 200, marks: '', fixed: false },
  { subject: 'Mathematics', max: 200, marks: '', fixed: false },
  { subject: 'Computer Science', max: 200, marks: '', fixed: false },
];

const HSC_COMMERCE_1200 = [
  { subject: 'Tamil', max: 200, marks: '', fixed: true },
  { subject: 'English', max: 200, marks: '', fixed: true },
  { subject: 'Accountancy', max: 200, marks: '', fixed: false },
  { subject: 'Economics', max: 200, marks: '', fixed: false },
  { subject: 'Business Studies', max: 200, marks: '', fixed: false },
  { subject: 'Mathematics', max: 200, marks: '', fixed: false },
];

const HSC_HUMANITIES_1200 = [
  { subject: 'Tamil', max: 200, marks: '', fixed: true },
  { subject: 'English', max: 200, marks: '', fixed: true },
  { subject: 'History', max: 200, marks: '', fixed: false },
  { subject: 'Geography', max: 200, marks: '', fixed: false },
  { subject: 'Economics', max: 200, marks: '', fixed: false },
  { subject: 'Political Science', max: 200, marks: '', fixed: false },
];

const HSC_SUBJECTS_INITIAL = HSC_SUBJECTS_600;

// ITI Subjects constants
const ITI_SUBJECTS_INITIAL = [
  { subject: 'Trade Practical', max: 400, marks: '' },
  { subject: 'Trade Theory', max: 120, marks: '' },
  { subject: 'Work Shop', max: 60, marks: '' },
  { subject: 'Drawing', max: 70, marks: '' },
  { subject: 'Social', max: 50, marks: '' },
];

// Vocational Subjects constants
const VOCATIONAL_SUBJECTS_INITIAL = [
  { subject: 'Language', max: 200, marks: '' },
  { subject: 'English', max: 200, marks: '' },
  { subject: 'Maths', max: 200, marks: '' },
  { subject: 'Theory', max: 200, marks: '' },
  { subject: 'Practical-I', max: 200, marks: '' },
  { subject: 'Practical-II', max: 200, marks: '' },
];

// Language options by board
const LANGUAGE_OPTIONS_BY_BOARD = {
  '': [],
  'CBSE': ['Hindi', 'English', 'Sanskrit', 'Urdu', 'Punjabi'],
  'ICSE': ['English', 'Hindi', 'French', 'Spanish', 'German', 'Sanskrit'],
  'State Board': ['Tamil', 'English', 'Hindi', 'Marathi', 'Kannada', 'Telugu', 'Malayalam'],
  'IGCSE': ['English', 'French', 'Spanish', 'German', 'Italian', 'Arabic', 'Mandarin'],
  'IB': ['English', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese', 'Russian'],
  'Other': ['Tamil', 'English', 'Hindi', 'Marathi', 'Kannada', 'Telugu', 'Malayalam']
};

// HSC Major/Stream Options
const HSC_MAJORS = [
  { value: '', label: 'Select Major' },
  { value: 'biology', label: 'Biology (Bio/2 + Phy/4 + Chem/4)' },
  { value: 'mathematics', label: 'Mathematics (Maths/2 + Phy/4 + Chem/4)' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'humanities', label: 'Humanities' },
];

// Education section options
const EDUCATION_SECTION_OPTIONS = [
  { value: 'sslc', label: 'SSLC' },
  { value: 'iti', label: 'ITI' },
  { value: 'vocational', label: 'Vocational' },
  { value: 'hsc', label: 'HSC' },
];

// Helper function to parse subjects from stored data
const parseSubjects = (subjectsString, defaultSubjects) => {
  if (!subjectsString) return defaultSubjects;
  try {
    const parsed = JSON.parse(subjectsString);
    return Array.isArray(parsed) ? parsed : defaultSubjects;
  } catch (e) {
    console.error('Error parsing subjects:', e);
    return defaultSubjects;
  }
};

// Initial state constants
const INITIAL_FORM_STATE = {
  appNo: '',
  stuName: '',
  dob: '',
  age: '',
  admissionStatus: '',
  submissionDate: '',
  stdMobile: '',
  fatherName: '',
  fatherContact: '',
  fatherOccupation: '',
  motherName: '',
  motherContact: '',
  motherOccupation: '',
  contact: '',
  email: '',
  permanentAddress: '',
  gender: '',
  religion: '',
  caste: '',
  community: '',
  category: '',
  nationality: '',
  bloodGroup: '',
  hostelReq: false,
  transportReq: false,
  Course_Name: '',
  Dept_Name: '',
  Dept_Code: '',
  sem: '',
  year: '',
  admissionDate: '',
  modeOfJoining: '',
  reference: '',
  present: '',
  hostelRequired: '',
  transportRequired: '',

  // Additional fields
  guardianName: '',
  guardianMobile: '',
  guardianOccupation: '',
  guardianRelation: '',
  physicallyChallenged: '',
  maritalStatus: '',
  aadharNo: '',
  panNo: '',
  motherTongue: '',
  emisNumber: '',
  mediumOfInstruction: '',
  fatherAnnualIncome: '',
  motherAnnualIncome: '',
  guardianAnnualIncome: '',
  permanentDistrict: '',
  permanentState: '',
  permanentPincode: '',
  currentDistrict: '',
  currentState: '',
  currentPincode: '',
  currentAddress: '',

  // Bank Details fields
  bankName: '',
  bankBranch: '',
  accountNumber: '',
  ifscCode: '',
  micrCode: '',

  // SSLC fields
  sslcSchoolName: '',
  sslcBoard: '',
  sslcLanguage1: 'Tamil',
  sslcLanguage2: 'English',
  sslcYearOfPassing: '',
  sslcRegisterNo: '',
  sslcMarksheetNo: '',
  sslcSubjects: SSLC_SUBJECTS_INITIAL,
  sslcTotalMax: SSLC_SUBJECTS_INITIAL.reduce((s, x) => s + (parseInt(x.max) || 0), 0),
  sslcTotalMarks: 0,
  sslcPercentage: 0,

  // ITI fields
  itiSchoolName: '',
  itiYearOfPassing: '',
  itiSubjects: ITI_SUBJECTS_INITIAL,
  itiTotalMax: ITI_SUBJECTS_INITIAL.reduce((s, x) => s + (parseInt(x.max) || 0), 0),
  itiTotalMarks: 0,
  itiPercentage: 0,

  // Vocational fields
  vocationalSchoolName: '',
  vocationalYearOfPassing: '',
  vocationalSubjects: VOCATIONAL_SUBJECTS_INITIAL,
  vocationalTotalMax: VOCATIONAL_SUBJECTS_INITIAL.reduce((s, x) => s + (parseInt(x.max) || 0), 0),
  vocationalTotalMarks: 0,
  vocationalPercentage: 0,

  // Number of Attempts / Examination Attempts - By Education Type
  sslcNumberOfAttempts: '',
  sslcExaminationAttempts: [],
  itiNumberOfAttempts: '',
  itiExaminationAttempts: [],
  vocationalNumberOfAttempts: '',
  vocationalExaminationAttempts: [],
  hscNumberOfAttempts: '',
  hscExaminationAttempts: [],

  // HSC fields
  hscSchoolName: '',
  hscBoard: '',
  hscLanguage1: 'Tamil',
  hscLanguage2: 'English',
  hscYearOfPassing: '',
  hscRegisterNo: '',
  hscExamType: '600',
  hscMajor: '',
  hscSubjects: HSC_SUBJECTS_600,
  hscTotalMax: HSC_SUBJECTS_600.reduce((s, x) => s + (parseInt(x.max) || 0), 0),
  hscTotalMarks: 0,
  hscPercentage: 0,
  hscCutoff: 0,
  hscCutoffFormula: '',

  // Scholarship
  scholarship: '',
  firstGraduate: '',
  bankLoan: '',

  // Additional DB fields
  stdUid: '',
  registerNumber: '',
  paidFees: '',
  balanceFees: '',
  academicYear: '',
  rollNumber: '',
  regulation: '',
  classTeacher: '',
  class: '',
  allocatedQuota: '',
  qualification: '',
  seatNo: '',
  identificationOfStudent: '',
};

const StudentDetails = () => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [photoLabel, setPhotoLabel] = useState('Image Not Available');
  const [photoFile, setPhotoFile] = useState(null);
  const [refreshTable, setRefreshTable] = useState(0);
  const [showTable, setShowTable] = useState(false);
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [states, setStates] = useState([]);
  const [years, setYears] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [applicationNumbers, setApplicationNumbers] = useState([]);
  const [appSearchInput, setAppSearchInput] = useState('');
  const [isAppDropdownOpen, setIsAppDropdownOpen] = useState(false);
  const [communityOptions, setCommunityOptions] = useState([]);
  const [availableAcademicYears, setAvailableAcademicYears] = useState([]);
  const [quotaData, setQuotaData] = useState({ total: 0, available: 0, filled: 0 });
  const [quotaLoading, setQuotaLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [editStudent, setEditStudent] = useState(null);

  // Add tab state
  const [activeTab, setActiveTab] = useState('basic');

  // Education section visibility state
  const [educationSections, setEducationSections] = useState({
    sslc: true,
    iti: false,
    vocational: false,
    hsc: false,
  });

  const handleEducationSectionChange = (e) => {
    const { name, checked } = e.target;
    setEducationSections((prev) => ({ ...prev, [name]: checked }));
  };

  // Course duration mapping
  const COURSE_DURATIONS = {
    'D.Pharm': 2,
    'B.Pharm': 4,
    'M.Pharm': 2,
    'Ph.D. (Pharmacy)': 3
  };

  // Function to generate academic years based on course duration
  const generateAcademicYears = (courseName) => {
    const duration = COURSE_DURATIONS[courseName] || 4;
    const startYear = 2025;
    const years = [];

    for (let i = 0; i < duration; i++) {
      const year1 = startYear + i;
      const year2 = year1 + 1;
      years.push(`${year1}-${year2}`);
    }

    return years;
  };

  // Track touched fields and validation state
  const [touchedFields, setTouchedFields] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  // Define required fields for validation
  const REQUIRED_FIELDS = {
    // Basic Details
    appNo: 'Application No',
    stuName: 'Student Name',
    stdMobile: 'Student Mobile',
    dob: 'Date of Birth',
    age: 'Age',
    gender: 'Gender',
    email: 'Email Address',

    // Course Details
    Course_Name: 'Course',
    Dept_Name: 'Department',
    sem: 'Semester',
    year: 'Year',
    academicYear: 'Academic Year'
  };

  // Show image toast when component mounts or when important actions happen
  useEffect(() => {
    fetch('/api/studentMaster/metadata')
      .then(res => res.json())
      .then(data => {

        setCourses(data.courses || []);
        setDepartments(data.departments || []);
        setSemesters(data.semesters || []);
        setDistricts(data.district || []);
        const uniqueYears = [...new Set((data.semesters || []).map(s => s.Year))];
        const uniqueStates = [...new Set((data.district || []).map(d => d.State))];
        setYears(uniqueYears);
        setStates(uniqueStates);
      })
      .catch(err => {
        console.error('Error fetching metadata:', err);
        setCourses([]);
        setDepartments([]);
        setSemesters([]);
        setDistricts([]);
      });

    // Fetch all application numbers
    fetch('/api/studentMaster')
      .then(res => res.json())
      .then(data => {
        setApplicationNumbers(data || []);
      });

    // Fetch community options
    fetch('/api/studentMaster/community-master')
      .then(res => {
        if (!res.ok) {
          console.error('Failed to fetch community options:', res.status);
          setCommunityOptions([]);
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setCommunityOptions(data || []);
        }
      })
      .catch(err => {
        console.error('Error fetching community options:', err);
        setCommunityOptions([]);
      });
  }, []);


  // Validate a single field
  const validateField = useCallback((fieldName, value) => {
    if (!REQUIRED_FIELDS[fieldName]) return null; // Not a required field

    const fieldLabel = REQUIRED_FIELDS[fieldName];

    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${fieldLabel} is required`;
    }

    // Additional format validations
    if (fieldName === 'stdMobile' && value && value.length < 10) {
      return 'Mobile must have 10 digits';
    }
    if (fieldName === 'aadharNo' && value && value.length > 0 && value.length < 12) {
      return 'Aadhar must have 12 digits';
    }
    if (fieldName === 'panNo' && value && value.length > 0 && value.length < 10) {
      return 'PAN must have 10 digits';
    }
    if (fieldName === 'fatherContact' && value && value.length > 0 && value.length < 10) {
      return 'Father Mobile must have 10 digits';
    }
    if (fieldName === 'motherContact' && value && value.length > 0 && value.length < 10) {
      return 'Mother Mobile must have 10 digits';
    }
    if (fieldName === 'guardianMobile' && value && value.length > 0 && value.length < 10) {
      return 'Guardian Mobile must have 10 digits';
    }

    return null;
  }, []);

  // Get CSS classes for field based on validation status
  const getFieldClasses = useCallback((fieldName, baseClass = 'form-control') => {
    return baseClass;
  }, [touchedFields, fieldErrors, form, editStudent]);

  // Get CSS classes for select fields based on validation status
  const getSelectClasses = useCallback((fieldName, baseClass = 'form-select') => {
    return baseClass;
  }, [touchedFields, fieldErrors, form, editStudent]);

  // Helper function to render form fields with success checkmarks
  const renderFormField = useCallback((fieldName, type = 'input', options = {}) => {
    const isRequired = REQUIRED_FIELDS[fieldName];
    const hasValue = form[fieldName] && form[fieldName] !== '';
    const isTouched = touchedFields[fieldName] || editStudent;

    const baseClasses = type === 'select' ?
      getSelectClasses(fieldName, options.className || 'form-select') :
      getFieldClasses(fieldName, options.className || 'form-control');

    const wrapperClass = type === 'select' ? 'form-select-wrapper' : 'form-control-wrapper';

    return (
      <div className={wrapperClass}>
        {type === 'input' && (
          <input
            type={options.inputType || 'text'}
            name={fieldName}
            value={form[fieldName] || ''}
            onChange={handleChange}
            className={baseClasses}
            placeholder={options.placeholder || ''}
            {...options.inputProps}
          />
        )}
        {type === 'select' && (
          <select
            name={fieldName}
            value={form[fieldName] || ''}
            onChange={handleChange}
            className={baseClasses}
            {...options.selectProps}
          >
            {options.children}
          </select>
        )}
        {type === 'textarea' && (
          <textarea
            name={fieldName}
            value={form[fieldName] || ''}
            onChange={handleChange}
            className={baseClasses}
            placeholder={options.placeholder || ''}
            rows={options.rows || 2}
            {...options.textareaProps}
          />
        )}

        {fieldErrors[fieldName] && (
          <small className="text-danger d-block mt-1">
            <i className="fas fa-exclamation-circle me-1"></i> {fieldErrors[fieldName]}
          </small>
        )}
      </div>
    );
  }, [form, touchedFields, fieldErrors, editStudent, getFieldClasses, getSelectClasses]);

  // Add error toast when validation fails
  const addErrorToast = useCallback((fieldName, message) => {
    const fieldLabel = REQUIRED_FIELDS[fieldName] || fieldName;
    const errorMsg = message || `${fieldLabel} is required`;
    toast.error(errorMsg, { autoClose: 2000 });
  }, []);

  // Remove error toast
  const removeErrorToast = useCallback((id) => {
    // Not needed with react-toastify
  }, []);

  // SSLC Subject Handlers
  const handleSslcSubjectChange = useCallback((index, field, value) => {
    const updatedSubjects = [...form.sslcSubjects];
    updatedSubjects[index][field] = value;

    // Calculate total marks and percentage
    const totalMarks = updatedSubjects.reduce((sum, sub) => sum + (parseInt(sub.marks) || 0), 0);
    const totalMax = updatedSubjects.reduce((sum, sub) => sum + (parseInt(sub.max) || 0), 0);
    const percentage = totalMax > 0 ? (totalMarks / totalMax * 100) : 0;

    setForm(prev => ({
      ...prev,
      sslcSubjects: updatedSubjects,
      sslcTotalMarks: totalMarks,
      sslcPercentage: parseFloat(percentage.toFixed(2))
    }));
  }, [form.sslcSubjects]);

  // ITI Subject Handlers
  const handleItiSubjectChange = useCallback((index, field, value) => {
    const updatedSubjects = [...form.itiSubjects];
    updatedSubjects[index][field] = value;

    // Calculate total marks and percentage
    const totalMarks = updatedSubjects.reduce((sum, sub) => sum + (parseInt(sub.marks) || 0), 0);
    const totalMax = updatedSubjects.reduce((sum, sub) => sum + (parseInt(sub.max) || 0), 0);
    const percentage = totalMax > 0 ? (totalMarks / totalMax * 100) : 0;

    setForm(prev => ({
      ...prev,
      itiSubjects: updatedSubjects,
      itiTotalMarks: totalMarks,
      itiPercentage: parseFloat(percentage.toFixed(2))
    }));
  }, [form.itiSubjects]);

  // Vocational Subject Handlers
  const handleVocationalSubjectChange = useCallback((index, field, value) => {
    const updatedSubjects = [...form.vocationalSubjects];
    updatedSubjects[index][field] = value;

    // Calculate total marks and percentage
    const totalMarks = updatedSubjects.reduce((sum, sub) => sum + (parseInt(sub.marks) || 0), 0);
    const totalMax = updatedSubjects.reduce((sum, sub) => sum + (parseInt(sub.max) || 0), 0);
    const percentage = totalMax > 0 ? (totalMarks / totalMax * 100) : 0;

    setForm(prev => ({
      ...prev,
      vocationalSubjects: updatedSubjects,
      vocationalTotalMarks: totalMarks,
      vocationalPercentage: parseFloat(percentage.toFixed(2))
    }));
  }, [form.vocationalSubjects]);

  // HSC Subject Handlers
  const handleHscSubjectChange = useCallback((index, field, value) => {
    const updatedSubjects = [...form.hscSubjects];
    updatedSubjects[index][field] = value;

    // Calculate total marks, percentage and cutoff
    const totalMarks = updatedSubjects.reduce((sum, sub) => sum + (parseInt(sub.marks) || 0), 0);
    const totalMax = updatedSubjects.reduce((sum, sub) => sum + (parseInt(sub.max) || 0), 0);
    const percentage = totalMax > 0 ? (totalMarks / totalMax * 100) : 0;

    // Calculate cutoff based on selected major
    let cutoff = 0;
    let cutoffFormula = '';

    // Find marks for Physics, Chemistry, Mathematics, and Biology
    const physicsSubject = updatedSubjects.find(sub =>
      sub.subject.toLowerCase().includes('physics')
    );
    const chemistrySubject = updatedSubjects.find(sub =>
      sub.subject.toLowerCase().includes('chemistry')
    );
    const mathSubject = updatedSubjects.find(sub =>
      sub.subject.toLowerCase().includes('math')
    );
    const bioSubject = updatedSubjects.find(sub =>
      sub.subject.toLowerCase().includes('bio') && !sub.subject.toLowerCase().includes('physics')
    );

    const physicsMarks = parseInt(physicsSubject?.marks || 0);
    const chemistryMarks = parseInt(chemistrySubject?.marks || 0);
    const mathMarks = parseInt(mathSubject?.marks || 0);
    const bioMarks = parseInt(bioSubject?.marks || 0);

    // Apply formula based on selected major
    if (form.hscMajor === 'biology') {
      // Force Biology formula when major is selected
      if (bioMarks > 0 && physicsMarks > 0 && chemistryMarks > 0) {
        cutoff = (bioMarks / 2) + (physicsMarks / 4) + (chemistryMarks / 4);
        cutoffFormula = `[${bioMarks}/2 + ${physicsMarks}/4 + ${chemistryMarks}/4]`;
      }
    } else if (form.hscMajor === 'mathematics') {
      // Force Mathematics formula when major is selected
      if (mathMarks > 0 && physicsMarks > 0 && chemistryMarks > 0) {
        cutoff = (mathMarks / 2) + (physicsMarks / 4) + (chemistryMarks / 4);
        cutoffFormula = `[${mathMarks}/2 + ${physicsMarks}/4 + ${chemistryMarks}/4]`;
      }
    } else {
      // Auto-detect formula if no major is selected
      if (bioMarks > 0 && physicsMarks > 0 && chemistryMarks > 0) {
        cutoff = (bioMarks / 2) + (physicsMarks / 4) + (chemistryMarks / 4);
        cutoffFormula = `[${bioMarks}/2 + ${physicsMarks}/4 + ${chemistryMarks}/4]`;
      } else if (mathMarks > 0 && physicsMarks > 0 && chemistryMarks > 0) {
        cutoff = (mathMarks / 2) + (physicsMarks / 4) + (chemistryMarks / 4);
        cutoffFormula = `[${mathMarks}/2 + ${physicsMarks}/4 + ${chemistryMarks}/4]`;
      }
    }

    setForm(prev => ({
      ...prev,
      hscSubjects: updatedSubjects,
      hscTotalMarks: totalMarks,
      hscPercentage: parseFloat(percentage.toFixed(2)),
      hscCutoff: parseFloat(cutoff.toFixed(2)),
      hscCutoffFormula: cutoffFormula
    }));
  }, [form.hscSubjects, form.hscMajor]);

  // Examination Attempts Handlers
  const handleAttemptInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Examination Attempts Handlers - Updated for dynamic table approach with education type support
  const handleAttemptFieldChange = useCallback((attemptIndex, fieldName, value, educationType) => {
    const attemptsKey = `${educationType}ExaminationAttempts`;
    const attempts = [...form[attemptsKey]];
    if (!attempts[attemptIndex]) {
      attempts[attemptIndex] = {};
    }
    attempts[attemptIndex][fieldName] = value;
    setForm(prev => ({
      ...prev,
      [attemptsKey]: attempts
    }));
  }, [form]);

  const handleEditAttempt = useCallback((index, educationType) => {
    // Placeholder for edit functionality
  }, []);

  const handleDeleteAttempt = useCallback((index, educationType) => {
    const attemptsKey = `${educationType}ExaminationAttempts`;
    const attempts = form[attemptsKey].filter((_, i) => i !== index);
    setForm(prev => ({
      ...prev,
      [attemptsKey]: attempts
    }));
  }, [form]);

  const handleCancelEditAttempt = useCallback(() => {
    // Placeholder for cancel edit functionality
  }, []);

  // Helper function to load student data when app no is selected
  const handleStudentDataLoad = useCallback(async (selectedStudent) => {
    if (selectedStudent?.Application_No) {
      setAppSearchInput(selectedStudent.Application_No);
    }
    try {
      // Fetch education details from separate endpoint
      let educationData = null;
      try {
        const eduRes = await fetch(`/api/studentMaster/education/${selectedStudent.Application_No}`);
        // Only process if response is successful (not 404 or other errors)
        if (eduRes.ok) {
          educationData = await eduRes.json();
        } else if (eduRes.status === 404) {
          console.log('No education details found yet for Application_No:', selectedStudent.Application_No, '- This is normal for new students');
        } else {
          console.warn('Error fetching education details, status:', eduRes.status);
        }
      } catch (err) {
        console.warn('Error fetching education details, continuing with empty education data:', err.message);
      }

      const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '';
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      };

      // Parse education details if available
      let sslcSubjects = SSLC_SUBJECTS_INITIAL;
      let hscSubjects = HSC_SUBJECTS_600;
      let itiSubjects = ITI_SUBJECTS_INITIAL;
      let vocSubjects = VOCATIONAL_SUBJECTS_INITIAL;

      // Calculate total marks from subjects
      let sslcCalculatedTotal = 0;
      let hscCalculatedTotal = 0;
      let itiCalculatedTotal = 0;
      let vocCalculatedTotal = 0;

      if (educationData) {
        // Parse SSLC subjects from database columns
        if (educationData.SSLC_Subject1) {
          sslcSubjects = [];
          for (let i = 1; i <= 5; i++) {
            const obtainedMark = parseFloat(educationData[`SSLC_Subject${i}_Obtained_Mark`]) || 0;
            sslcSubjects.push({
              subject: educationData[`SSLC_Subject${i}`] || '',
              max: educationData[`SSLC_Subject${i}_Max_Mark`] || 100,
              marks: educationData[`SSLC_Subject${i}_Obtained_Mark`] || ''
            });
            sslcCalculatedTotal += obtainedMark;
          }
        } else {
          console.log('⚠️ No SSLC subjects found in database');
        }

        // Parse HSC subjects
        if (educationData.HSC_Subject1) {
          hscSubjects = [];
          for (let i = 1; i <= 6; i++) {
            const obtainedMark = parseFloat(educationData[`HSC_Subject${i}_Obtained_Mark`]) || 0;
            hscSubjects.push({
              subject: educationData[`HSC_Subject${i}`] || '',
              max: educationData[`HSC_Subject${i}_Max_Mark`] || 100,
              marks: educationData[`HSC_Subject${i}_Obtained_Mark`] || ''
            });
            hscCalculatedTotal += obtainedMark;
          }
        }

        // Parse ITI subjects
        if (educationData.ITI_Subject1) {
          itiSubjects = [];
          for (let i = 1; i <= 5; i++) {
            const obtainedMark = parseFloat(educationData[`ITI_Subject${i}_Obtained_Mark`]) || 0;
            itiSubjects.push({
              subject: educationData[`ITI_Subject${i}`] || '',
              max: educationData[`ITI_Subject${i}_Max_Mark`] || 100,
              marks: educationData[`ITI_Subject${i}_Obtained_Mark`] || ''
            });
            itiCalculatedTotal += obtainedMark;
          }
        }

        // Parse Vocational subjects
        if (educationData.VOC_Subject1) {
          vocSubjects = [];
          for (let i = 1; i <= 6; i++) {
            const obtainedMark = parseFloat(educationData[`VOC_Subject${i}_Obtained_Mark`]) || 0;
            vocSubjects.push({
              subject: educationData[`VOC_Subject${i}`] || '',
              max: educationData[`VOC_Subject${i}_Max_Mark`] || 100,
              marks: educationData[`VOC_Subject${i}_Obtained_Mark`] || ''
            });
            vocCalculatedTotal += obtainedMark;
          }
        }
      }


      setForm({
        appNo: selectedStudent.Application_No ?? '',
        stuName: selectedStudent.Student_Name ?? '',
        dob: formatDate(selectedStudent.Dob),
        age: selectedStudent.Age ?? '',
        admissionStatus: selectedStudent.Admission_Status ?? '',
        submissionDate: formatDate(selectedStudent.Admission_Date),
        stdMobile: selectedStudent.Student_Mobile ?? '',
        fatherName: selectedStudent.Father_Name ?? '',
        fatherContact: selectedStudent.Father_Mobile ?? '',
        fatherOccupation: selectedStudent.Father_Occupation ?? '',
        motherName: selectedStudent.Mother_Name ?? '',
        motherContact: selectedStudent.Mother_Mobile ?? '',
        motherOccupation: selectedStudent.Mother_Occupation ?? '',
        contact: selectedStudent.Guardian_Mobile ?? '',
        email: selectedStudent.Std_Email ?? '',
        permanentAddress: selectedStudent.Permanent_Address ?? '',
        gender: selectedStudent.Gender ?? '',
        religion: selectedStudent.Religion ?? '',
        caste: selectedStudent.Caste ?? '',
        community: selectedStudent.Community ?? '',
        category: selectedStudent.Category ?? '',
        nationality: selectedStudent.Nationality ?? '',
        bloodGroup: selectedStudent.Blood_Group ?? '',
        hostelReq: !!selectedStudent.Hostel_Required,
        transportReq: !!selectedStudent.Transport_Required,
        Course_Name: selectedStudent.Course_Name ?? '',
        course: selectedStudent.Course_Name ?? '',
        Dept_Name: selectedStudent.Dept_Name ?? '',
        department: selectedStudent.Dept_Name ?? '',
        Dept_Code: selectedStudent.Dept_Code ?? '',
        departmentCode: selectedStudent.Dept_Code ?? '',
        guardianName: selectedStudent.Guardian_Name ?? '',
        guardianMobile: selectedStudent.Guardian_Mobile ?? '',
        guardianOccupation: selectedStudent.Guardian_Occupation ?? '',
        guardianRelation: selectedStudent.Guardian_Relation ?? '',
        physicallyChallenged: selectedStudent.Physically_Challenged ?? '',
        maritalStatus: selectedStudent.Marital_Status ?? '',
        aadharNo: selectedStudent.Aadhaar_No ?? '',
        panNo: selectedStudent.Pan_No ?? '',
        motherTongue: selectedStudent.Mother_Tongue ?? '',
        emisNumber: selectedStudent.EMIS_No ?? '',
        mediumOfInstruction: selectedStudent.Medium_Of_Instruction ?? '',
        fatherAnnualIncome: selectedStudent.Father_Annual_Income ?? '',
        motherAnnualIncome: selectedStudent.Mother_Annual_Income ?? '',
        guardianAnnualIncome: selectedStudent.Guardian_Annual_Income ?? '',
        bankName: selectedStudent.Bank_Name ?? '',
        bankBranch: selectedStudent.Bank_Branch ?? '',
        accountNumber: selectedStudent.Bank_Account_No ?? '',
        ifscCode: selectedStudent.Bank_IFSC_Code ?? '',
        micrCode: selectedStudent.Bank_MICR_Code ?? '',
        permanentDistrict: selectedStudent.Permanent_District ?? '',
        permanentState: selectedStudent.Permanent_State ?? '',
        permanentPincode: selectedStudent.Permanent_Pincode ?? '',
        currentDistrict: selectedStudent.Current_District ?? '',
        currentState: selectedStudent.Current_State ?? '',
        currentPincode: selectedStudent.Current_Pincode ?? '',
        currentAddress: selectedStudent.Current_Address ?? '',
        scholarship: selectedStudent.Scholarship ?? '',
        firstGraduate: selectedStudent.First_Graduate ?? '',
        bankLoan: selectedStudent.Bank_Loan ?? '',
        modeOfJoining: selectedStudent.Mode_Of_Joinig ?? '',
        reference: selectedStudent.Reference ?? '',
        present: selectedStudent.Present ?? '',
        sem: selectedStudent.Semester ?? '',
        year: selectedStudent.Year ?? '',
        admissionDate: formatDate(selectedStudent.Admission_Date),
        hostelRequired: selectedStudent.Hostel_Required ?? '',
        transportRequired: selectedStudent.Transport_Required ?? '',

        // SSLC - from education table
        sslcSchoolName: educationData?.SSLC_School_Name ?? '',
        sslcBoard: educationData?.SSLC_Board ?? '',
        sslcYearOfPassing: educationData?.SSLC_Year_Of_Passing ?? '',
        sslcRegisterNumber: educationData?.SSLC_Register_No ?? '',
        sslcMarksheetNo: educationData?.SSLC_Marksheet_No ?? '',
        sslcSubjects: sslcSubjects,
        sslcTotalMax: educationData?.SSLC_Total_Mark ?? sslcSubjects.reduce((s, x) => s + (parseInt(x.max) || 0), 0),
        sslcTotalMarks: sslcCalculatedTotal || educationData?.SSLC_Total_Obtained_Mark || 0,
        sslcPercentage: (sslcCalculatedTotal && educationData?.SSLC_Total_Mark) ? ((sslcCalculatedTotal / parseInt(educationData.SSLC_Total_Mark)) * 100).toFixed(2) : (parseFloat(educationData?.SSLC_Percentage) || 0),
        // Load SSLC examination attempts (5 max)
        sslcExaminationAttempts: (() => {
          const attempts = [
            { marksheetNo: educationData?.SSLC_Att1_Marksheet_No ?? '', registerNo: educationData?.SSLC_Att1_Register_No ?? '', month: educationData?.SSLC_Att1_Month ?? '', year: educationData?.SSLC_Att1_Year ?? '', totalMarks: educationData?.SSLC_Att1_Total_Marks ?? '' },
            { marksheetNo: educationData?.SSLC_Att2_Marksheet_No ?? '', registerNo: educationData?.SSLC_Att2_Register_No ?? '', month: educationData?.SSLC_Att2_Month ?? '', year: educationData?.SSLC_Att2_Year ?? '', totalMarks: educationData?.SSLC_Att2_Total_Marks ?? '' },
            { marksheetNo: educationData?.SSLC_Att3_Marksheet_No ?? '', registerNo: educationData?.SSLC_Att3_Register_No ?? '', month: educationData?.SSLC_Att3_Month ?? '', year: educationData?.SSLC_Att3_Year ?? '', totalMarks: educationData?.SSLC_Att3_Total_Marks ?? '' },
            { marksheetNo: educationData?.SSLC_Att4_Marksheet_No ?? '', registerNo: educationData?.SSLC_Att4_Register_No ?? '', month: educationData?.SSLC_Att4_Month ?? '', year: educationData?.SSLC_Att4_Year ?? '', totalMarks: educationData?.SSLC_Att4_Total_Marks ?? '' },
            { marksheetNo: educationData?.SSLC_Att5_Marksheet_No ?? '', registerNo: educationData?.SSLC_Att5_Register_No ?? '', month: educationData?.SSLC_Att5_Month ?? '', year: educationData?.SSLC_Att5_Year ?? '', totalMarks: educationData?.SSLC_Att5_Total_Marks ?? '' }
          ].filter(att => att.marksheetNo || att.registerNo || att.year);
          return attempts;
        })(),

        // ITI - from education table
        itiSchoolName: educationData?.ITI_Institution_Name ?? '',
        itiYearOfPassing: educationData?.ITI_Year_Of_Passing ?? '',
        itiSubjects: itiSubjects,
        itiTotalMax: educationData?.ITI_Total_Mark ?? itiSubjects.reduce((s, x) => s + (parseInt(x.max) || 0), 0),
        itiTotalMarks: itiCalculatedTotal || educationData?.ITI_Total_Obtained_Mark || 0,
        itiPercentage: (itiCalculatedTotal && educationData?.ITI_Total_Mark) ? ((itiCalculatedTotal / parseInt(educationData.ITI_Total_Mark)) * 100).toFixed(2) : (parseFloat(educationData?.ITI_Percentage) || 0),
        // Load ITI examination attempts (5 max)
        itiExaminationAttempts: (() => {
          const attempts = [
            { marksheetNo: educationData?.ITI_Att1_Marksheet_No ?? '', registerNo: educationData?.ITI_Att1_Register_No ?? '', month: educationData?.ITI_Att1_Month ?? '', year: educationData?.ITI_Att1_Year ?? '', totalMarks: educationData?.ITI_Att1_Total_Marks ?? '' },
            { marksheetNo: educationData?.ITI_Att2_Marksheet_No ?? '', registerNo: educationData?.ITI_Att2_Register_No ?? '', month: educationData?.ITI_Att2_Month ?? '', year: educationData?.ITI_Att2_Year ?? '', totalMarks: educationData?.ITI_Att2_Total_Marks ?? '' },
            { marksheetNo: educationData?.ITI_Att3_Marksheet_No ?? '', registerNo: educationData?.ITI_Att3_Register_No ?? '', month: educationData?.ITI_Att3_Month ?? '', year: educationData?.ITI_Att3_Year ?? '', totalMarks: educationData?.ITI_Att3_Total_Marks ?? '' },
            { marksheetNo: educationData?.ITI_Att4_Marksheet_No ?? '', registerNo: educationData?.ITI_Att4_Register_No ?? '', month: educationData?.ITI_Att4_Month ?? '', year: educationData?.ITI_Att4_Year ?? '', totalMarks: educationData?.ITI_Att4_Total_Marks ?? '' },
            { marksheetNo: educationData?.ITI_Att5_Marksheet_No ?? '', registerNo: educationData?.ITI_Att5_Register_No ?? '', month: educationData?.ITI_Att5_Month ?? '', year: educationData?.ITI_Att5_Year ?? '', totalMarks: educationData?.ITI_Att5_Total_Marks ?? '' }
          ].filter(att => att.marksheetNo || att.registerNo || att.year);
          return attempts;
        })(),

        // Vocational - from education table
        vocationalSchoolName: educationData?.VOC_Institution_Name ?? '',
        vocationalYearOfPassing: educationData?.VOC_Year_Of_Passing ?? '',
        vocationalSubjects: vocSubjects,
        vocationalTotalMax: educationData?.VOC_Total_Mark ?? vocSubjects.reduce((s, x) => s + (parseInt(x.max) || 0), 0),
        vocationalTotalMarks: vocCalculatedTotal || educationData?.VOC_Total_Obtained_Mark || 0,
        vocationalPercentage: (vocCalculatedTotal && educationData?.VOC_Total_Mark) ? ((vocCalculatedTotal / parseInt(educationData.VOC_Total_Mark)) * 100).toFixed(2) : (parseFloat(educationData?.VOC_Percentage) || 0),
        // Load Vocational examination attempts (5 max)
        vocationalExaminationAttempts: (() => {
          const attempts = [
            { marksheetNo: educationData?.VOC_Att1_Marksheet_No ?? '', registerNo: educationData?.VOC_Att1_Register_No ?? '', month: educationData?.VOC_Att1_Month ?? '', year: educationData?.VOC_Att1_Year ?? '', totalMarks: educationData?.VOC_Att1_Total_Marks ?? '' },
            { marksheetNo: educationData?.VOC_Att2_Marksheet_No ?? '', registerNo: educationData?.VOC_Att2_Register_No ?? '', month: educationData?.VOC_Att2_Month ?? '', year: educationData?.VOC_Att2_Year ?? '', totalMarks: educationData?.VOC_Att2_Total_Marks ?? '' },
            { marksheetNo: educationData?.VOC_Att3_Marksheet_No ?? '', registerNo: educationData?.VOC_Att3_Register_No ?? '', month: educationData?.VOC_Att3_Month ?? '', year: educationData?.VOC_Att3_Year ?? '', totalMarks: educationData?.VOC_Att3_Total_Marks ?? '' },
            { marksheetNo: educationData?.VOC_Att4_Marksheet_No ?? '', registerNo: educationData?.VOC_Att4_Register_No ?? '', month: educationData?.VOC_Att4_Month ?? '', year: educationData?.VOC_Att4_Year ?? '', totalMarks: educationData?.VOC_Att4_Total_Marks ?? '' },
            { marksheetNo: educationData?.VOC_Att5_Marksheet_No ?? '', registerNo: educationData?.VOC_Att5_Register_No ?? '', month: educationData?.VOC_Att5_Month ?? '', year: educationData?.VOC_Att5_Year ?? '', totalMarks: educationData?.VOC_Att5_Total_Marks ?? '' }
          ].filter(att => att.marksheetNo || att.registerNo || att.year);
          return attempts;
        })(),

        // HSC - from education table
        hscSchoolName: educationData?.HSC_School_Name ?? '',
        hscBoard: educationData?.HSC_Board ?? '',
        hscYearOfPassing: educationData?.HSC_Year_Of_Passing ?? '',
        hscRegisterNo: educationData?.HSC_Register_No ?? '',
        hscExamType: educationData?.HSC_Exam_Type ?? '600',
        hscMajor: educationData?.HSC_Major_Stream ?? '',
        hscSubjects: hscSubjects,
        hscTotalMax: educationData?.HSC_Total_Mark ?? hscSubjects.reduce((s, x) => s + (parseInt(x.max) || 0), 0),
        hscTotalMarks: hscCalculatedTotal || educationData?.HSC_Total_Obtained_Mark || 0,
        hscPercentage: (hscCalculatedTotal && educationData?.HSC_Total_Mark) ? ((hscCalculatedTotal / parseInt(educationData.HSC_Total_Mark)) * 100).toFixed(2) : (parseFloat(educationData?.HSC_Percentage) || 0),
        hscCutoff: parseFloat(educationData?.HSC_Cutoff) || 0,

        // Examination Attempts - Set the count to display the loaded attempts
        sslcNumberOfAttempts: (() => {
          const attempts = [
            educationData?.SSLC_Att1_Marksheet_No, educationData?.SSLC_Att2_Marksheet_No, educationData?.SSLC_Att3_Marksheet_No, educationData?.SSLC_Att4_Marksheet_No, educationData?.SSLC_Att5_Marksheet_No
          ].filter(att => att).length;
          return String(attempts);
        })(),
        itiNumberOfAttempts: (() => {
          const attempts = [
            educationData?.ITI_Att1_Marksheet_No, educationData?.ITI_Att2_Marksheet_No, educationData?.ITI_Att3_Marksheet_No, educationData?.ITI_Att4_Marksheet_No, educationData?.ITI_Att5_Marksheet_No
          ].filter(att => att).length;
          return String(attempts);
        })(),
        vocationalNumberOfAttempts: (() => {
          const attempts = [
            educationData?.VOC_Att1_Marksheet_No, educationData?.VOC_Att2_Marksheet_No, educationData?.VOC_Att3_Marksheet_No, educationData?.VOC_Att4_Marksheet_No, educationData?.VOC_Att5_Marksheet_No
          ].filter(att => att).length;
          return String(attempts);
        })(),
        hscNumberOfAttempts: (() => {
          const attempts = [
            educationData?.HSC_Att1_Marksheet_No, educationData?.HSC_Att2_Marksheet_No, educationData?.HSC_Att3_Marksheet_No, educationData?.HSC_Att4_Marksheet_No, educationData?.HSC_Att5_Marksheet_No
          ].filter(att => att).length;
          return String(attempts);
        })(),

        // Additional DB fields
        stdUid: selectedStudent.Std_UID ?? '',
        registerNumber: selectedStudent.Register_Number ?? '',
        paidFees: selectedStudent.Paid_Fees ?? '',
        balanceFees: selectedStudent.Balance_Fees ?? '',
        academicYear: selectedStudent.Academic_Year ?? '',
        rollNumber: selectedStudent.Roll_Number ?? '',
        regulation: selectedStudent.Regulation ?? '',
        classTeacher: selectedStudent.Class_Teacher ?? '',
        class: selectedStudent.Class ?? '',
        allocatedQuota: selectedStudent.Allocated_Quota ?? '',
        qualification: selectedStudent.Qualification ?? '',
        seatNo: selectedStudent.Seat_No ?? '',
        identificationOfStudent: selectedStudent.Identification_of_Student ?? '',
      });

      // Set education sections based on what was saved
      if (educationData) {
        setEducationSections({
          sslc: educationData.SSLC === 'Yes',
          iti: educationData.ITI === 'Yes',
          vocational: educationData.VOC === 'Yes',
          hsc: educationData.HSC === 'Yes'
        });
      } else {
        console.log('⚠️ No education data found - will use default sections');
      }

      // Set photo label to display the saved photo filename
      if (selectedStudent.Photo_Path) {
        const photoFilename = selectedStudent.Photo_Path.split('/').pop();
        setPhotoLabel(photoFilename || 'Photo Uploaded');
      } else {
        setPhotoLabel('Image Not Available');
      }

      setEditStudent(selectedStudent);
      setPhotoFile(null);

      toast.success('Student details loaded successfully');
    } catch (err) {
      console.error('Error loading student data:', err);
      toast.error('Error loading student details');
    }
  }, []);

  useEffect(() => {
    if (editStudent) {
      handleStudentDataLoad(editStudent);
      setActiveTab('basic'); // Switch to first tab when editing
    }
  }, [editStudent, handleStudentDataLoad]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    if (name === 'appNo') {
      // Always fetch fresh data from API to ensure we have latest values including Medium_Of_Instruction
      if (!value) return;

      setForm(prev => ({ ...prev, appNo: value }));

      // Always fetch from API to get the latest data from database
      fetch(`/api/studentMaster/${value}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.Application_No) {
            handleStudentDataLoad(data);
          } else {
            toast.error('Student not found');
          }
        })
        .catch(err => {
          console.error('Error fetching student details:', err);
          toast.error('Failed to load student details');
        });
      return;
    }

    // Handle Course selection - auto-fill Department and Department Code
    if (name === 'Course_Name') {
      // Find first department for this course and auto-fill
      const matchingDept = departments.find(d => d.Course_Name === value);

      if (matchingDept) {
        setForm(prev => ({
          ...prev,
          Course_Name: value,
          Dept_Name: matchingDept.Dept_Name,
          Dept_Code: matchingDept.Dept_Code,
          allocatedQuota: '' // Reset quota when course changes
        }));

        // Auto-generate Application No based on department code
        if (matchingDept.Dept_Code) {
          fetch(`/api/studentMaster/latest-serials?deptCode=${matchingDept.Dept_Code}`)
            .then(res => res.json())
            .then(data => {
              let serial = (parseInt(data.lastAppNoSerial, 10) || 0) + 1;
              let appNo = matchingDept.Dept_Code + serial.toString().padStart(4, '0');
              setForm(prev => ({
                ...prev,
                appNo
              }));
            })
            .catch(err => console.error('Error fetching latest serial:', err));
        }

        toast.info(`Department "${matchingDept.Dept_Name}" auto-filled`);
      } else {
        // If no matching department, just set the course
        setForm(prev => ({
          ...prev,
          Course_Name: value,
          Dept_Name: '',
          Dept_Code: '',
          allocatedQuota: ''
        }));
      }
      return;
    }

    if (name === 'course') {
      const academicYears = generateAcademicYears(value);
      setAvailableAcademicYears(academicYears);
      setForm(prev => ({
        ...prev,
        course: value,
        Course_Name: value,
        academicYear: '' // Reset academic year when course changes
      }));
      toast.info(`Academic years for ${value} have been loaded`);
      return;
    }

    if (name === 'department' || name === 'Dept_Name') {
      const dept = departments.find(d => d.Dept_Name === value);
      const deptCode = dept ? dept.Dept_Code : '';
      setForm(prev => ({
        ...prev,
        department: value,
        Dept_Name: value,
        departmentCode: deptCode,
        Dept_Code: deptCode,
        allocatedQuota: '' // Reset quota when department changes
      }));
      setQuotaData({ total: 0, available: 0, filled: 0 }); // Reset quota data
      // Auto-generate Application No
      if (deptCode) {
        fetch(`/api/studentMaster/latest-serials?deptCode=${deptCode}`)
          .then(res => res.json())
          .then(data => {
            // Application No: DeptCode + 4-digit serial
            let serial = (parseInt(data.lastAppNoSerial, 10) || 0) + 1;
            let appNo = deptCode + serial.toString().padStart(4, '0');
            setForm(prev => ({
              ...prev,
              appNo
            }));
          });
      }
      return;
    }

    if (name === 'departmentCode') {
      setForm(prev => ({
        ...prev,
        departmentCode: value,
        Dept_Code: value
      }));
      return;
    }

    // Handle Allocated Quota (MQ/GQ) selection - fetch available seats
    if (name === 'allocatedQuota') {
      const newForm = {
        ...form,
        allocatedQuota: value
      };

      setForm(newForm);

      // Fetch quota data for this department and quota type
      if (newForm.Dept_Code && value) {
        setQuotaLoading(true);
        fetch(`/api/quotaAllocation/quota-by-dept?deptCode=${newForm.Dept_Code}&quotaType=${value}`)
          .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          })
          .then(data => {
            setQuotaData({
              total: data.total || 0,
              available: data.available || 0,
              filled: data.filled || 0
            });
            setQuotaLoading(false);
            if (data.total > 0) {
              toast.info(`${value}: ${data.available}/${data.total} seats available`);
            } else {
              toast.info(`No quota allocation found for ${value}`);
            }
          })
          .catch(err => {
            console.error('Error fetching quota data:', err);
            setQuotaData({ total: 0, available: 0, filled: 0 });
            setQuotaLoading(false);
            toast.error(`Could not fetch quota data: ${err.message}`);
          });
      } else {
        setQuotaData({ total: 0, available: 0, filled: 0 });
      }
      return;
    }

    // Handle Mode of Joining change - reset semester and year when mode changes
    if (name === 'modeOfJoining') {
      setForm(prev => ({
        ...prev,
        modeOfJoining: value,
        sem: '', // Reset semester when mode changes
        year: '' // Reset year when mode changes
      }));
      return;
    }

    if (name === 'sem') {
      // Map semester to year based on mode of joining
      let year = '';
      const semNum = parseInt(value);
      const modeOfJoining = form.modeOfJoining;

      if (modeOfJoining === 'Regular') {
        // Regular: Sem 1-2 = Year 1, Sem 3-4 = Year 2, Sem 5-6 = Year 3, Sem 7-8 = Year 4
        if ([1, 2].includes(semNum)) year = 1;
        else if ([3, 4].includes(semNum)) year = 2;
        else if ([5, 6].includes(semNum)) year = 3;
        else if ([7, 8].includes(semNum)) year = 4;
      } else if (modeOfJoining === 'Lateral') {
        // Lateral: Starts at Sem 3, so Sem 3-4 = Year 2, Sem 5-6 = Year 3, Sem 7-8 = Year 4
        if ([3, 4].includes(semNum)) year = 2;
        else if ([5, 6].includes(semNum)) year = 3;
        else if ([7, 8].includes(semNum)) year = 4;
      }

      setForm(prev => ({
        ...prev,
        sem: value,
        year: year,
      }));
      return;
    }

    // Auto-calculate age from DOB
    if (name === 'dob') {
      let age = '';
      if (value) {
        const dobDate = new Date(value);
        const today = new Date();
        let years = today.getFullYear() - dobDate.getFullYear();
        const m = today.getMonth() - dobDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
          years--;
        }
        age = years >= 0 ? years.toString() : '';
      }
      setForm(prev => ({
        ...prev,
        dob: value,
        age: age
      }));
      return;
    }

    // District auto-fill state
    if (name === 'permanentDistrict') {
      const selected = districts.find(d => d.District === value);
      const state = selected ? (selected.State || selected.state || '') : '';
      setForm(prev => ({
        ...prev,
        permanentDistrict: value,
        permanentState: state
      }));
      return;
    }

    if (name === 'currentDistrict') {
      const selected = districts.find(d => d.District === value);
      const state = selected ? (selected.State || selected.state || '') : '';
      setForm(prev => ({
        ...prev,
        currentDistrict: value,
        currentState: state
      }));
      return;
    }

    // Handle SSLC and HSC fields
    if (name.startsWith('sslc_') || name.startsWith('hsc_')) {
      setForm(prev => ({ ...prev, [name]: value }));
      // Mark field as touched for validation
      setTouchedFields(prev => ({ ...prev, [name]: true }));
      return;
    }

    // Handle SSLC Board selection - auto-set languages for State Board
    if (name === 'sslcBoard') {
      if (value === 'State Board') {
        setForm(prev => ({
          ...prev,
          sslcBoard: value,
          sslcLanguage1: 'Tamil',
          sslcLanguage2: 'English'
        }));
      } else {
        setForm(prev => ({
          ...prev,
          sslcBoard: value
        }));
      }
      return;
    }

    // Handle HSC Board selection - auto-set languages for State Board
    if (name === 'hscBoard') {
      if (value === 'State Board') {
        setForm(prev => ({
          ...prev,
          hscBoard: value,
          hscLanguage1: 'Tamil',
          hscLanguage2: 'English'
        }));
      } else {
        setForm(prev => ({
          ...prev,
          hscBoard: value
        }));
      }
      return;
    }

    // Handle SSLC language selection - update fixed language subjects
    if (name === 'sslcLanguage1' || name === 'sslcLanguage2') {
      setForm(prev => {
        const updated = { ...prev, [name]: value };
        // Update the fixed language subjects in the array
        if (updated.sslcSubjects && updated.sslcSubjects.length > 0) {
          updated.sslcSubjects = updated.sslcSubjects.map((subject, idx) => {
            if (idx === 0 && name === 'sslcLanguage1') {
              return { ...subject, subject: value };
            }
            if (idx === 1 && name === 'sslcLanguage2') {
              return { ...subject, subject: value };
            }
            return subject;
          });
        }
        return updated;
      });
      return;
    }

    // Handle HSC language selection - update fixed language subjects
    if (name === 'hscLanguage1' || name === 'hscLanguage2') {
      setForm(prev => {
        const updated = { ...prev, [name]: value };
        // Update the fixed language subjects in the array
        if (updated.hscSubjects && updated.hscSubjects.length > 0) {
          updated.hscSubjects = updated.hscSubjects.map((subject, idx) => {
            if (idx === 0 && name === 'hscLanguage1') {
              return { ...subject, subject: value };
            }
            if (idx === 1 && name === 'hscLanguage2') {
              return { ...subject, subject: value };
            }
            return subject;
          });
        }
        return updated;
      });
      return;
    }

    // Handle HSC Exam Type selection
    if (name === 'hscExamType') {
      let newSubjects;
      const currentMajor = form.hscMajor || '';

      // Select subjects based on current major and new exam type
      if (currentMajor === 'biology') {
        newSubjects = value === '1200' ? HSC_BIOLOGY_1200 : HSC_BIOLOGY_600;
      } else if (currentMajor === 'mathematics') {
        newSubjects = value === '1200' ? HSC_MATHEMATICS_1200 : HSC_MATHEMATICS_600;
      } else if (currentMajor === 'commerce') {
        newSubjects = value === '1200' ? HSC_COMMERCE_1200 : HSC_COMMERCE_600;
      } else if (currentMajor === 'humanities') {
        newSubjects = value === '1200' ? HSC_HUMANITIES_1200 : HSC_HUMANITIES_600;
      } else {
        // Default subjects
        newSubjects = value === '1200' ? HSC_SUBJECTS_1200 : HSC_SUBJECTS_600;
      }

      const newTotalMax = newSubjects.reduce((s, x) => s + (parseInt(x.max) || 0), 0);

      setForm(prev => ({
        ...prev,
        hscExamType: value,
        hscSubjects: newSubjects,
        hscTotalMax: newTotalMax,
        hscTotalMarks: 0,
        hscPercentage: 0,
        hscCutoff: 0,
        hscCutoffFormula: ''
      }));
      toast.info(`HSC exam type changed to ${value} marks`);
      return;
    }

    // Handle HSC Major selection
    if (name === 'hscMajor') {
      let newSubjects = [];
      const examType = form.hscExamType || '600';

      // Select subjects based on major and exam type
      if (value === 'biology') {
        newSubjects = examType === '1200' ? HSC_BIOLOGY_1200 : HSC_BIOLOGY_600;
      } else if (value === 'mathematics') {
        newSubjects = examType === '1200' ? HSC_MATHEMATICS_1200 : HSC_MATHEMATICS_600;
      } else if (value === 'commerce') {
        newSubjects = examType === '1200' ? HSC_COMMERCE_1200 : HSC_COMMERCE_600;
      } else if (value === 'humanities') {
        newSubjects = examType === '1200' ? HSC_HUMANITIES_1200 : HSC_HUMANITIES_600;
      } else {
        // Default subjects when no major is selected
        newSubjects = examType === '1200' ? HSC_SUBJECTS_1200 : HSC_SUBJECTS_600;
      }

      const newTotalMax = newSubjects.reduce((s, x) => s + (parseInt(x.max) || 0), 0);

      setForm(prev => ({
        ...prev,
        hscMajor: value,
        hscSubjects: newSubjects,
        hscTotalMax: newTotalMax,
        hscTotalMarks: 0,
        hscPercentage: 0,
        hscCutoff: 0,
        hscCutoffFormula: ''
      }));
      toast.info(`HSC major changed to ${HSC_MAJORS.find(m => m.value === value)?.label || 'None'}`);
      return;
    }

    // Handle Number of Attempts - populate examination attempts array by education type
    if (name === 'sslcNumberOfAttempts') {
      const numAttempts = parseInt(value) || 0;
      const attempts = Array.from({ length: numAttempts }, (_, i) => ({
        markSheet: '',
        examRegNo: '',
        month: '',
        year: '',
        totalMarks: ''
      }));
      setForm(prev => ({
        ...prev,
        sslcNumberOfAttempts: value,
        sslcExaminationAttempts: attempts
      }));
      return;
    }

    if (name === 'itiNumberOfAttempts') {
      const numAttempts = parseInt(value) || 0;
      const attempts = Array.from({ length: numAttempts }, (_, i) => ({
        markSheet: '',
        examRegNo: '',
        month: '',
        year: '',
        totalMarks: ''
      }));
      setForm(prev => ({
        ...prev,
        itiNumberOfAttempts: value,
        itiExaminationAttempts: attempts
      }));
      return;
    }

    if (name === 'vocationalNumberOfAttempts') {
      const numAttempts = parseInt(value) || 0;
      const attempts = Array.from({ length: numAttempts }, (_, i) => ({
        markSheet: '',
        examRegNo: '',
        month: '',
        year: '',
        totalMarks: ''
      }));
      setForm(prev => ({
        ...prev,
        vocationalNumberOfAttempts: value,
        vocationalExaminationAttempts: attempts
      }));
      return;
    }

    if (name === 'hscNumberOfAttempts') {
      const numAttempts = parseInt(value) || 0;
      const attempts = Array.from({ length: numAttempts }, (_, i) => ({
        markSheet: '',
        examRegNo: '',
        month: '',
        year: '',
        totalMarks: ''
      }));
      setForm(prev => ({
        ...prev,
        hscNumberOfAttempts: value,
        hscExaminationAttempts: attempts
      }));
      return;
    }

    // Mark field as touched and validate
    setTouchedFields(prev => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    if (error) {
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    } else {
      setFieldErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }

    setForm(prev => ({ ...prev, [name]: value }));
  }, [form, departments, semesters, applicationNumbers, validateField, handleStudentDataLoad, setQuotaLoading]);

  const handlePhotoBrowse = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handlePhotoChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      setPhotoFile(file);
      const ext = file.name.substring(file.name.lastIndexOf('.'));
      setPhotoLabel(`${form.appNo}${ext}`);
      toast.success('Photo selected successfully');
    }
  }, [form.appNo]);

  const handleReset = useCallback(() => {
    setForm(INITIAL_FORM_STATE);
    setPhotoLabel('Image Not Available');
    setPhotoFile(null);
    setTouchedFields({});
    setFieldErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Form reset successfully!');
  }, []);

  const handleSameAsPermanent = useCallback(() => {
    setForm(prev => ({
      ...prev,
      currentDistrict: prev.permanentDistrict,
      currentState: prev.permanentState,
      currentPincode: prev.permanentPincode,
      currentAddress: prev.permanentAddress
    }));
    toast.success('Current address updated with permanent address');
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // Mark all fields as touched for validation display
    setTouchedFields(Object.keys(REQUIRED_FIELDS).reduce((acc, field) => ({
      ...acc,
      [field]: true
    }), {}));

    // Validate Lateral - semester must be 3-8
    if (form.modeOfJoining === 'Lateral' && form.sem) {
      const semNum = parseInt(form.sem);
      if (semNum < 3 || semNum > 8) {
        toast.error('❌ Lateral: Semester must be between 3 and 8');
        return;
      }
    }

    // Collect all validation errors and find the first missing field
    const errors = {};
    let missingFieldsCount = 0;
    const missingFields = [];
    let firstMissingField = null;
    let firstMissingError = null;

    Object.keys(REQUIRED_FIELDS).forEach(fieldName => {
      const error = validateField(fieldName, form[fieldName]);
      if (error) {
        errors[fieldName] = error;
        missingFieldsCount++;
        missingFields.push(REQUIRED_FIELDS[fieldName]);

        // Capture the first missing field to show only one error at a time
        if (!firstMissingField) {
          firstMissingField = fieldName;
          firstMissingError = error;
        }
      }
    });

    // Show only the first missing field error
    if (firstMissingField && firstMissingError) {
      addErrorToast(firstMissingField, firstMissingError);
    }



    // Additional format validation for optional fields
    if (form.aadharNo && form.aadharNo.length > 0 && form.aadharNo.length < 12) {
      toast.error('Aadhar number must have 12 digits');
      addErrorToast('aadharNo', 'Aadhar must have 12 digits');
      return;
    }
    if (form.panNo && form.panNo.length > 0 && form.panNo.length < 10) {
      toast.error('PAN number must have 10 digits');
      addErrorToast('panNo', 'PAN must have 10 digits');
      return;
    }
    if (form.fatherContact && form.fatherContact.length > 0 && form.fatherContact.length < 10) {
      toast.error('Father Mobile must have 10 digits');
      addErrorToast('fatherContact', 'Father Mobile must have 10 digits');
      return;
    }
    if (form.motherContact && form.motherContact.length > 0 && form.motherContact.length < 10) {
      toast.error('Mother Mobile must have 10 digits');
      addErrorToast('motherContact', 'Mother Mobile must have 10 digits');
      return;
    }
    if (form.guardianMobile && form.guardianMobile.length > 0 && form.guardianMobile.length < 10) {
      toast.error('Guardian Mobile must have 10 digits');
      addErrorToast('guardianMobile', 'Guardian Mobile must have 10 digits');
      return;
    }

    // Update field errors state
    setFieldErrors(errors);

    // If there are errors, prevent form submission
    if (missingFieldsCount > 0) {
      console.error('❌ Form validation failed:', missingFields);
      return;
    }

    try {
      const formData = new FormData();

      // ===== STUDENT MASTER DATA (non-education fields) =====
      const masterPayload = {
        Application_No: form.appNo,
        Student_Name: form.stuName,
        Student_Mobile: form.stdMobile,
        Gender: form.gender,
        Dob: form.dob,
        Age: form.age,
        Std_Email: form.email,
        Photo_Path: editStudent?.Photo_Path || null, // Preserve existing photo path when editing
        Father_Name: form.fatherName,
        Father_Mobile: form.fatherContact,
        Father_Occupation: form.fatherOccupation,
        Mother_Name: form.motherName,
        Mother_Mobile: form.motherContact,
        Mother_Occupation: form.motherOccupation,
        Guardian_Name: form.guardianName,
        Guardian_Mobile: form.guardianMobile,
        Guardian_Occupation: form.guardianOccupation,
        Guardian_Relation: form.guardianRelation,
        Blood_Group: form.bloodGroup,
        Nationality: form.nationality,
        Religion: form.religion,
        Community: form.community,
        Caste: form.caste,
        Physically_Challenged: form.physicallyChallenged,
        Marital_Status: form.maritalStatus,
        Aadhaar_No: form.aadharNo,
        Pan_No: form.panNo,
        Mother_Tongue: form.motherTongue,
        emisNumber: form.emisNumber,
        mediumOfInstruction: form.mediumOfInstruction,
        fatherAnnualIncome: form.fatherAnnualIncome,
        motherAnnualIncome: form.motherAnnualIncome,
        guardianAnnualIncome: form.guardianAnnualIncome,
        bankName: form.bankName,
        bankBranch: form.bankBranch,
        accountNumber: form.accountNumber,
        ifscCode: form.ifscCode,
        micrCode: form.micrCode,
        Permanent_District: form.permanentDistrict,
        Permanent_State: form.permanentState,
        Permanent_Pincode: form.permanentPincode,
        Permanent_Address: form.permanentAddress,
        Current_District: form.currentDistrict,
        Current_State: form.currentState,
        Current_Pincode: form.currentPincode,
        Current_Address: form.currentAddress,
        Scholarship: form.scholarship,
        First_Graduate: form.firstGraduate,
        Bank_Loan: form.bankLoan,
        Mode_Of_Joinig: form.modeOfJoining,
        Reference: form.reference,
        Present: form.present,
        Course_Name: form.Course_Name || form.course,
        Dept_Name: form.Dept_Name || form.department,
        Dept_Code: form.Dept_Code || form.departmentCode,
        Semester: form.sem,
        Year: form.year,
        Admission_Date: form.admissionDate,
        Hostel_Required: form.hostelRequired,
        Transport_Required: form.transportRequired,
        Admission_Status: form.admissionStatus,
        Std_UID: form.stdUid,
        Register_Number: form.registerNumber,
        Paid_Fees: form.paidFees,
        Balance_Fees: form.balanceFees,
        Academic_Year: form.academicYear,
        Roll_Number: form.rollNumber,
        Regulation: form.regulation,
        Class_Teacher: form.classTeacher,
        Class: form.class,
        Allocated_Quota: form.allocatedQuota,
        Qualification: form.qualification,
        Seat_No: form.seatNo,
        Identification_of_Student: form.identificationOfStudent,
      };

      // ===== STUDENT EDUCATION DATA =====
      const educationPayload = {
        Application_No: form.appNo,
        educationSections: educationSections, // Send which education sections are selected
        // SSLC Fields
        sslcSchoolName: form.sslcSchoolName,
        sslcBoard: form.sslcBoard,
        sslcYearOfPassing: form.sslcYearOfPassing,
        sslcRegisterNo: form.sslcRegisterNo,
        sslcMarksheetNo: form.sslcMarksheetNo,
        sslcSubjects: form.sslcSubjects,
        sslcTotalMax: form.sslcTotalMax,
        sslcTotalMarks: form.sslcTotalMarks,
        sslcPercentage: form.sslcPercentage,
        sslcExaminationAttempts: form.sslcExaminationAttempts,

        // ITI Fields
        itiSchoolName: form.itiSchoolName,
        itiYearOfPassing: form.itiYearOfPassing,
        itiSubjects: form.itiSubjects,
        itiTotalMax: form.itiTotalMax,
        itiTotalMarks: form.itiTotalMarks,
        itiPercentage: form.itiPercentage,
        itiExaminationAttempts: form.itiExaminationAttempts,

        // VOC Fields
        vocationalSchoolName: form.vocationalSchoolName,
        vocationalYearOfPassing: form.vocationalYearOfPassing,
        vocationalSubjects: form.vocationalSubjects,
        vocationalTotalMax: form.vocationalTotalMax,
        vocationalTotalMarks: form.vocationalTotalMarks,
        vocationalPercentage: form.vocationalPercentage,
        vocationalExaminationAttempts: form.vocationalExaminationAttempts,

        // HSC Fields
        hscSchoolName: form.hscSchoolName,
        hscBoard: form.hscBoard,
        hscYearOfPassing: form.hscYearOfPassing,
        hscRegisterNo: form.hscRegisterNo,
        hscExamType: form.hscExamType,
        hscMajor: form.hscMajor,
        hscSubjects: form.hscSubjects,
        hscTotalMax: form.hscTotalMax,
        hscTotalMarks: form.hscTotalMarks,
        hscPercentage: form.hscPercentage,
        hscCutoff: form.hscCutoff,
      };

      // Add master payload to form data - only append non-null, non-empty values
      Object.entries(masterPayload).forEach(([key, value]) => {
        // Skip null, undefined, and empty string values
        if (value === null || value === undefined) return;
        if (typeof value === 'string' && value.trim() === '') return;

        formData.append(key, value);
      });

      // Add education payload to form data
      Object.entries(educationPayload).forEach(([key, value]) => {
        // Skip null, undefined, and empty string values
        if (value === null || value === undefined) return;
        if (typeof value === 'string' && value.trim() === '') return;

        if (typeof value === 'object' && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      // Photo is required for new student, optional for edit
      const photoFile = fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files[0];

      if (!editStudent && !photoFile) {
        console.error('Photo is required for new student');
        showToast('Please select a photo to upload');
        return;
      }

      if (photoFile) {
        // Rename photo file to application number + extension before upload
        const ext = photoFile.name.substring(photoFile.name.lastIndexOf('.'));
        const renamedFile = new File([photoFile], `${form.appNo}${ext}`, { type: photoFile.type });
        formData.append('photo', renamedFile);
      }

      // If editing, send PUT request
      if (editStudent && editStudent.Id) {
        const res = await fetch(`/api/studentMaster/edit/${editStudent.Id}`, {
          method: 'PUT',
          body: formData
        });
        const responseData = await res.json();

        if (!res.ok) {
          throw new Error(responseData.error || 'Failed to update student details');
        }
        if (!responseData.success) {
          throw new Error(responseData.error || 'Update failed');
        }

        toast.success('Saved Successfully');
        setEditStudent(null);
        setForm(INITIAL_FORM_STATE);
        setPhotoLabel('Image Not Available');
        setPhotoFile(null);
        setTouchedFields({});
        setFieldErrors({});
        setRefreshTable(prev => prev + 1);
      } else {
        // New student
        const res = await fetch('/api/studentMaster/add', {
          method: 'POST',
          body: formData
        });
        const responseData = await res.json();

        if (!res.ok) {
          throw new Error(responseData.error || 'Failed to save student details');
        }
        if (!responseData.success) {
          throw new Error(responseData.error || 'Save failed');
        }

        toast.success('Saved Successfully');
        setRefreshTable(prev => prev + 1);
        handleReset();
      }
    } catch (error) {
      console.error('Error during submission:', error);
      toast.error('Failed to save student details: ' + error.message);
    }
  }, [form, handleReset, editStudent, validateField, addErrorToast]);

  // SSLC Education Section
  const renderSslcSection = () => (
    <div className="mb-32 pb-16 border-bottom">
      <h5 className="fw-semibold mb-3">SSLC (10th) Details</h5>
      <div className="row g-3">
        <div className="col-md-3">
          <label className="form-label">School Name</label>
          <input
            type="text"
            name="sslcSchoolName"
            value={form.sslcSchoolName || ''}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter school name"
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Board</label>
          <select
            name="sslcBoard"
            value={form.sslcBoard || ''}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select Board</option>
            <option key="CBSE" value="CBSE">CBSE</option>
            <option key="ICSE" value="ICSE">ICSE</option>
            <option key="State Board" value="State Board">State Board</option>
            <option key="IGCSE" value="IGCSE">IGCSE</option>
            <option key="IB" value="IB">IB</option>
            <option key="Other" value="Other">Other</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Language Paper 1</label>
          <select
            name="sslcLanguage1"
            value={form.sslcLanguage1 || ''}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select Language</option>
            {(LANGUAGE_OPTIONS_BY_BOARD[form.sslcBoard] || LANGUAGE_OPTIONS_BY_BOARD['']).map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Language Paper 2</label>
          <select
            name="sslcLanguage2"
            value={form.sslcLanguage2 || ''}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select Language</option>
            {(LANGUAGE_OPTIONS_BY_BOARD[form.sslcBoard] || LANGUAGE_OPTIONS_BY_BOARD['']).map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Year of Passing</label>
          <input
            type="number"
            name="sslcYearOfPassing"
            value={form.sslcYearOfPassing || ''}
            onChange={handleChange}
            className="form-control"
            placeholder="YYYY"
            min="1900"
            max="2099"
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Register No</label>
          <input
            type="text"
            name="sslcRegisterNo"
            value={form.sslcRegisterNo || ''}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter register number"
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Marksheet No</label>
          <input
            type="text"
            name="sslcMarksheetNo"
            value={form.sslcMarksheetNo || ''}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter marksheet number"
          />
        </div>
      </div>

      {/* SSLC Subjects Table */}
      <div className="mt-4">
        <h6 className="fw-semibold mb-3">SSLC Marks</h6>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Subject</th>
                <th>Maximum Marks</th>
                <th>Marks Obtained</th>
              </tr>
            </thead>
            <tbody>
              {form.sslcSubjects && Array.isArray(form.sslcSubjects) && form.sslcSubjects.length > 0 ? (
                form.sslcSubjects.map((subject, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={subject.subject}
                        onChange={(e) => handleSslcSubjectChange(index, 'subject', e.target.value)}
                        placeholder="Enter subject name"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={subject.max}
                        onChange={(e) => handleSslcSubjectChange(index, 'max', e.target.value)}
                        min="0"
                        max="200"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={subject.marks}
                        onChange={(e) => handleSslcSubjectChange(index, 'marks', e.target.value)}
                        min="0"
                        max={subject.max || 100}
                        placeholder="Enter marks"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3" className="text-center text-muted">No SSLC subjects added</td></tr>
              )}
            </tbody>
            <tfoot className="table-secondary">
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>{form.sslcTotalMax}</strong></td>
                <td><strong>{form.sslcTotalMarks}</strong></td>
              </tr>
              <tr>
                <td colSpan="2"><strong>Percentage</strong></td>
                <td colSpan="2"><strong>{(parseFloat(form.sslcPercentage) || 0).toFixed(2)}%</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );

  // ITI Education Section
  const renderItiSection = () => (
    <div className="mb-32 pb-16 border-bottom">
      <h5 className="fw-semibold mb-3">ITI Details</h5>
      <div className="row g-3">
        <div className="col-md-3">
          <label className="form-label">Institute Name</label>
          <input
            type="text"
            name="itiSchoolName"
            value={form.itiSchoolName || ''}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter institute name"
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Year of Passing</label>
          <input
            type="number"
            name="itiYearOfPassing"
            value={form.itiYearOfPassing || ''}
            onChange={handleChange}
            className="form-control"
            placeholder="YYYY"
            min="1900"
            max="2099"
          />
        </div>
      </div>

      <div className="mt-4">
        <h6 className="fw-semibold mb-3">ITI Marks</h6>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Subject</th>
                <th>Maximum Marks</th>
                <th>Marks Obtained</th>
              </tr>
            </thead>
            <tbody>
              {form.itiSubjects && form.itiSubjects.length > 0 ? (
                form.itiSubjects.map((subject, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={subject.subject}
                        onChange={(e) => handleItiSubjectChange(index, 'subject', e.target.value)}
                        placeholder="Enter subject name"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={subject.max}
                        onChange={(e) => handleItiSubjectChange(index, 'max', e.target.value)}
                        min="0"
                        max="500"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={subject.marks}
                        onChange={(e) => handleItiSubjectChange(index, 'marks', e.target.value)}
                        min="0"
                        max={subject.max || 500}
                        placeholder="Enter marks"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3" className="text-center text-muted">No ITI subjects added</td></tr>
              )}
            </tbody>
            <tfoot className="table-secondary">
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>{form.itiTotalMax}</strong></td>
                <td><strong>{form.itiTotalMarks}</strong></td>
              </tr>
              <tr>
                <td colSpan="2"><strong>Percentage</strong></td>
                <td><strong>{(parseFloat(form.itiPercentage) || 0).toFixed(2)}%</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );

  // Vocational Education Section
  const renderVocationalSection = () => (
    <div className="mb-32 pb-16 border-bottom">
      <h5 className="fw-semibold mb-3">Vocational Details</h5>
      <div className="row g-3">
        <div className="col-md-3">
          <label className="form-label">Institute Name</label>
          <input
            type="text"
            name="vocationalSchoolName"
            value={form.vocationalSchoolName || ''}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter institute name"
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Year of Passing</label>
          <input
            type="number"
            name="vocationalYearOfPassing"
            value={form.vocationalYearOfPassing || ''}
            onChange={handleChange}
            className="form-control"
            placeholder="YYYY"
            min="1900"
            max="2099"
          />
        </div>
      </div>

      <div className="mt-4">
        <h6 className="fw-semibold mb-3">Vocational Marks</h6>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Subject</th>
                <th>Maximum Marks</th>
                <th>Marks Obtained</th>
              </tr>
            </thead>
            <tbody>
              {form.vocationalSubjects && Array.isArray(form.vocationalSubjects) && form.vocationalSubjects.length > 0 ? (
                form.vocationalSubjects.map((subject, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={subject.subject}
                        onChange={(e) => handleVocationalSubjectChange(index, 'subject', e.target.value)}
                        placeholder="Enter subject name"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={subject.max}
                        onChange={(e) => handleVocationalSubjectChange(index, 'max', e.target.value)}
                        min="0"
                        max="300"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={subject.marks}
                        onChange={(e) => handleVocationalSubjectChange(index, 'marks', e.target.value)}
                        min="0"
                        max={subject.max || 200}
                        placeholder="Enter marks"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3" className="text-center text-muted">No Vocational subjects added</td></tr>
              )}
            </tbody>
            <tfoot className="table-secondary">
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>{form.vocationalTotalMax}</strong></td>
                <td><strong>{form.vocationalTotalMarks}</strong></td>
              </tr>
              <tr>
                <td colSpan="2"><strong>Percentage</strong></td>
                <td><strong>{(parseFloat(form.vocationalPercentage) || 0).toFixed(2)}%</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );

  // HSC Education Section
  const renderHscSection = () => (
    <div className="mb-32 pb-16 border-bottom">
      <h5 className="fw-semibold mb-3">HSC (12th) Details</h5>
      <div className="row g-3">
        <div className="col-md-3">
          <label className="form-label">School Name</label>
          <input
            type="text"
            name="hscSchoolName"
            value={form.hscSchoolName || ''}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter school name"
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Board</label>
          <select
            name="hscBoard"
            value={form.hscBoard || ''}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select Board</option>
            <option value="CBSE">CBSE</option>
            <option value="ICSE">ICSE</option>
            <option value="State Board">State Board</option>
            <option value="IGCSE">IGCSE</option>
            <option value="IB">IB</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Language Paper 1</label>
          <select
            name="hscLanguage1"
            value={form.hscLanguage1 || ''}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select Language</option>
            {(LANGUAGE_OPTIONS_BY_BOARD[form.hscBoard] || LANGUAGE_OPTIONS_BY_BOARD['']).map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Language Paper 2</label>
          <select
            name="hscLanguage2"
            value={form.hscLanguage2 || ''}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select Language</option>
            {(LANGUAGE_OPTIONS_BY_BOARD[form.hscBoard] || LANGUAGE_OPTIONS_BY_BOARD['']).map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Year of Passing</label>
          <input
            type="number"
            name="hscYearOfPassing"
            value={form.hscYearOfPassing || ''}
            onChange={handleChange}
            className="form-control"
            placeholder="YYYY"
            min="1900"
            max="2099"
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Register No</label>
          <input
            type="text"
            name="hscRegisterNo"
            value={form.hscRegisterNo || ''}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter register number"
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Exam Type <span className="text-danger">*</span></label>
          <select
            name="hscExamType"
            value={form.hscExamType || '600'}
            onChange={handleChange}
            className="form-select"
          >
            <option value="600">600 Marks (6 Subjects × 100 marks)</option>
            <option value="1200">1200 Marks (6 Subjects × 200 marks)</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Major/Stream <span className="text-danger">*</span></label>
          <select
            name="hscMajor"
            value={form.hscMajor || ''}
            onChange={handleChange}
            className="form-select"
          >
            {HSC_MAJORS.map((major) => (
              <option key={major.value} value={major.value}>
                {major.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* HSC Subjects Table */}
      <div className="mt-4">
        <h6 className="fw-semibold mb-3">HSC Marks (For Cutoff Calculation)</h6>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Subject</th>
                <th>Maximum Marks</th>
                <th>Marks Obtained</th>
              </tr>
            </thead>
            <tbody>
              {form.hscSubjects && Array.isArray(form.hscSubjects) && form.hscSubjects.length > 0 ? (
                form.hscSubjects.map((subject, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={subject.subject}
                        onChange={(e) => handleHscSubjectChange(index, 'subject', e.target.value)}
                        placeholder={subject.fixed ? subject.subject : "Enter subject name"}
                        readOnly={subject.fixed}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={subject.max}
                        onChange={(e) => handleHscSubjectChange(index, 'max', e.target.value)}
                        min="0"
                        max="200"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={subject.marks}
                        onChange={(e) => handleHscSubjectChange(index, 'marks', e.target.value)}
                        min="0"
                        max={subject.max || 100}
                        placeholder="Enter marks"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3" className="text-center text-muted">No HSC subjects added</td></tr>
              )}
            </tbody>
            <tfoot className="table-secondary">
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>{form.hscTotalMax}</strong></td>
                <td><strong>{form.hscTotalMarks}</strong></td>
              </tr>
              <tr>
                <td colSpan="2"><strong>Percentage</strong></td>
                <td><strong>{(parseFloat(form.hscPercentage) || 0).toFixed(2)}%</strong></td>
              </tr>
              <tr>
                <td colSpan="2"><strong>Cutoff Score</strong></td>
                <td>
                  <strong>
                    {(parseFloat(form.hscCutoff) || 0) > 0
                      ? `${(parseFloat(form.hscCutoff) || 0).toFixed(2)}`
                      : 'N/A'
                    }
                  </strong>
                </td>
              </tr>
              <tr>
                <td colSpan="2"><strong>Cutoff Formula Used</strong></td>
                <td>
                  <small className="fw-semibold" style={{ color: '#666' }}>
                    {form.hscCutoffFormula || '(Enter marks above)'}
                  </small>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="mt-3 p-3 bg-success-subtle rounded">
          <small className="text-muted d-block mb-2"><strong>Exam Types:</strong></small>
          <small className="text-muted d-block">
            • <strong>600 Marks:</strong> 6 subjects × 100 marks each
          </small>
          <small className="text-muted d-block">
            • <strong>1200 Marks:</strong> 6 subjects × 200 marks each
          </small>
          <small className="text-muted d-block mt-2"><strong>Cutoff Calculation Logic:</strong></small>
          <small className="text-muted d-block">
            • <strong>Formula 1:</strong> (Biology/2 + Physics/4 + Chemistry/4) - Used when Biology is present
          </small>
          <small className="text-muted d-block">
            • <strong>Formula 2:</strong> (Mathematics/2 + Physics/4 + Chemistry/4) - Used when Mathematics is present (no Biology)
          </small>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Error Toast Container (Top Right) */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Student Details</h6>
            </div>

            {/* Form Card */}
            <div className="card h-100 p-0 radius-12">
              <div className="card-header border-bottom-0 p-24 pb-0">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-24">
                  <div>
                    <h6 className="text-lg fw-semibold mb-2">Add Student Details</h6>
                    <span className="text-sm fw-medium text-secondary-light">
                      Fill all the fields below to add student information
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className={`btn btn-sm ${showTable ? 'btn-success' : 'btn-outline-info'}`}
                      onClick={() => setShowTable(!showTable)}
                      title={showTable ? 'Hide Student Table' : 'Show Student Table'}
                    >
                      <i className={`fas ${showTable ? 'fa-eye-slash' : 'fa-table'} me-1`}></i>
                      {showTable ? 'Hide Table' : 'View Students'}
                    </button>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="nav-tabs-wrapper" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <nav className="nav nav-tabs flex-nowrap gap-2 gap-md-3" role="tablist" style={{ minWidth: 'fit-content' }}>
                    <button
                      className={`nav-link px-12 px-md-20 py-12 fw-semibold text-nowrap ${activeTab === 'basic' ? 'active' : ''}`}
                      onClick={() => setActiveTab('basic')}
                      role="tab"
                      type="button"
                    >
                      <iconify-icon icon="mdi:file-document-outline" className="me-1 me-md-2"></iconify-icon>
                      <span className="d-none d-sm-inline">Basic Information</span>
                      <span className="d-sm-none">Basic</span>
                    </button>
                    <button
                      className={`nav-link px-12 px-md-20 py-12 fw-semibold text-nowrap ${activeTab === 'personal' ? 'active' : ''}`}
                      onClick={() => setActiveTab('personal')}
                      role="tab"
                      type="button"
                    >
                      <iconify-icon icon="mdi:account-outline" className="me-1 me-md-2"></iconify-icon>
                      <span className="d-none d-sm-inline">Personal Details</span>
                      <span className="d-sm-none">Personal</span>
                    </button>
                    <button
                      className={`nav-link px-12 px-md-20 py-12 fw-semibold text-nowrap ${activeTab === 'bank' ? 'active' : ''}`}
                      onClick={() => setActiveTab('bank')}
                      role="tab"
                      type="button"
                    >
                      <iconify-icon icon="mdi:bank-outline" className="me-1 me-md-2"></iconify-icon>
                      <span className="d-none d-sm-inline">Bank Details</span>
                      <span className="d-sm-none">Bank</span>
                    </button>
                    <button
                      className={`nav-link px-12 px-md-20 py-12 fw-semibold text-nowrap ${activeTab === 'address' ? 'active' : ''}`}
                      onClick={() => setActiveTab('address')}
                      role="tab"
                      type="button"
                    >
                      <iconify-icon icon="mdi:map-marker-outline" className="me-1 me-md-2"></iconify-icon>
                      <span className="d-none d-sm-inline">Address</span>
                      <span className="d-sm-none">Addr</span>
                    </button>
                    <button
                      className={`nav-link px-12 px-md-20 py-12 fw-semibold text-nowrap ${activeTab === 'education' ? 'active' : ''}`}
                      onClick={() => setActiveTab('education')}
                      role="tab"
                      type="button"
                    >
                      <iconify-icon icon="mdi:school-outline" className="me-1 me-md-2"></iconify-icon>
                      <span className="d-none d-sm-inline">Education</span>
                      <span className="d-sm-none">Edu</span>
                    </button>
                    <button
                      className={`nav-link px-12 px-md-20 py-12 fw-semibold text-nowrap ${activeTab === 'course' ? 'active' : ''}`}
                      onClick={() => setActiveTab('course')}
                      role="tab"
                      type="button"
                    >
                      <iconify-icon icon="mdi:book-outline" className="me-1 me-md-2"></iconify-icon>
                      <span className="d-none d-sm-inline">Course Details</span>
                      <span className="d-sm-none">Course</span>
                    </button>
                  </nav>
                </div>
              </div>
              <div className="card-body p-24 pt-20">
                <form onSubmit={handleSubmit}>

                  {/* TAB 1: Basic Information */}
                  {activeTab === 'basic' && (
                    <div className="tab-content-section">
                      <div className="row g-3">
                        <div className="col-md-3">
                          <label className="form-label">Application No <span className="text-danger">*</span></label>
                          <div className="position-relative">
                            <input
                              type="text"
                              className={getFieldClasses('appNo')}
                              placeholder="Search Application No"
                              value={appSearchInput}
                              onChange={(e) => {
                                setAppSearchInput(e.target.value);
                              }}
                              onFocus={() => setIsAppDropdownOpen(true)}
                              onBlur={() => setTimeout(() => setIsAppDropdownOpen(false), 200)}
                            />
                            {form.appNo && (
                              <button
                                type="button"
                                className="btn btn-sm btn-link position-absolute end-0 top-50 translate-middle-y"
                                onClick={() => {
                                  setForm(prev => ({ ...prev, appNo: '', stuName: '' }));
                                  setAppSearchInput('');
                                  setTouchedFields(prev => ({ ...prev, appNo: true }));
                                }}
                                title="Clear selection"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            )}
                            {isAppDropdownOpen && applicationNumbers.length > 0 && (
                              <div className="dropdown-menu w-100 show position-absolute mt-1" style={{ maxHeight: '200px', overflowY: 'auto', zIndex: 1000 }}>
                                {applicationNumbers
                                  .filter(student =>
                                    (student.Application_No && student.Application_No.toLowerCase().includes(appSearchInput.toLowerCase())) ||
                                    (student.Student_Name && student.Student_Name.toLowerCase().includes(appSearchInput.toLowerCase()))
                                  )
                                  .map((student, idx) => (
                                    <button
                                      key={idx}
                                      type="button"
                                      className="dropdown-item"
                                      onClick={() => {
                                        setForm(prev => ({
                                          ...prev,
                                          appNo: student.Application_No,
                                          stuName: student.Student_Name
                                        }));
                                        setAppSearchInput(student.Application_No);
                                        setTouchedFields(prev => ({ ...prev, appNo: true }));
                                        handleStudentDataLoad(student);
                                      }}
                                    >
                                      <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                          <div className="fw-semibold">{student.Application_No}</div>
                                          <div className="small text-muted">{student.Student_Name}</div>
                                        </div>
                                      </div>
                                    </button>
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Student Name <span className="text-danger">*</span></label>
                          {renderFormField('stuName', 'input', {
                            placeholder: 'Enter student name'
                          })}
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Student Mobile <span className="text-danger">*</span></label>
                          {renderFormField('stdMobile', 'input', {
                            placeholder: 'Enter student mobile',
                            inputProps: { maxLength: '10' }
                          })}
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Date of Birth <span className="text-danger">*</span></label>
                          {renderFormField('dob', 'input', {
                            inputType: 'date'
                          })}
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Age <span className="text-danger">*</span></label>
                          {renderFormField('age', 'input', {
                            placeholder: 'Enter age'
                          })}
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Email <span className="text-danger">*</span></label>
                          {renderFormField('email', 'input', {
                            placeholder: 'Enter email address',
                            inputType: 'email'
                          })}
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Gender <span className="text-danger">*</span></label>
                          {renderFormField('gender', 'select', {
                            children: (
                              <>
                                <option value="">Select gender</option>
                                <option key="Male" value="Male">Male</option>
                                <option key="Female" value="Female">Female</option>
                                <option key="Other" value="Other">Other</option>
                              </>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Personal Details */}
                  {activeTab === 'personal' && (
                    <div className="tab-content-section">

                      {/* Section: Personal Details */}
                      <div className="mb-32 pb-16 border-bottom">
                        <h5 className="fw-semibold mb-3">Personal Details</h5>
                        <div className="row g-3">
                          <div className="col-md-3">
                            <label className="form-label">Father's Name</label>
                            {renderFormField('fatherName', 'input', {
                              placeholder: 'Enter father\'s name'
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Father Mobile </label>
                            {renderFormField('fatherContact', 'input', {
                              placeholder: 'Enter 10-digit number',
                              inputProps: { maxLength: '10', type: 'tel' }
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Father Occupation </label>
                            {renderFormField('fatherOccupation', 'input', {
                              placeholder: 'Enter father\'s occupation'
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Father Annual Income</label>
                            {renderFormField('fatherAnnualIncome', 'input', {
                              placeholder: 'Enter annual income',
                              inputType: 'number',
                              inputProps: { min: '0' }
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Mother's Name </label>
                            {renderFormField('motherName', 'input', {
                              placeholder: 'Enter mother\'s name'
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Mother Mobile </label>
                            {renderFormField('motherContact', 'input', {
                              placeholder: 'Enter 10-digit number',
                              inputProps: { maxLength: '10', type: 'tel' }
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Mother Occupation </label>
                            {renderFormField('motherOccupation', 'input', {
                              placeholder: 'Enter mother\'s occupation'
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Mother Annual Income</label>
                            {renderFormField('motherAnnualIncome', 'input', {
                              placeholder: 'Enter annual income',
                              inputType: 'number',
                              inputProps: { min: '0' }
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Guardian Name </label>
                            <div className="form-control-wrapper">
                              <input type="text" name="guardianName" value={form.guardianName || ''} onChange={handleChange} className="form-control" placeholder="Enter guardian name" />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Guardian Mobile </label>
                            <div className="form-control-wrapper">
                              <input type="tel" name="guardianMobile" value={form.guardianMobile || ''} onChange={handleChange} className="form-control" placeholder="Enter guardian mobile" maxLength="10" />
                              {fieldErrors['guardianMobile'] && (
                                <small className="text-danger d-block mt-1">
                                  <i className="fas fa-exclamation-circle me-1"></i> {fieldErrors['guardianMobile']}
                                </small>
                              )}
                            </div>
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Guardian Occupation </label>
                            <div className="form-control-wrapper">
                              <input type="text" name="guardianOccupation" value={form.guardianOccupation || ''} onChange={handleChange} className="form-control" placeholder="Enter guardian occupation" />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Guardian Relation </label>
                            <div className="form-control-wrapper">
                              <input type="text" name="guardianRelation" value={form.guardianRelation || ''} onChange={handleChange} className="form-control" placeholder="Enter guardian relation" />
                            </div>
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Guardian Annual Income</label>
                            {renderFormField('guardianAnnualIncome', 'input', {
                              placeholder: 'Enter annual income',
                              inputType: 'number',
                              inputProps: { min: '0' }
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Blood Group</label>
                            {renderFormField('bloodGroup', 'select', {
                              children: (
                                <>
                                  <option value="">Select Blood Group</option>
                                  <option key="A+" value="A+">A+</option>
                                  <option key="A-" value="A-">A-</option>
                                  <option key="B+" value="B+">B+</option>
                                  <option key="B-" value="B-">B-</option>
                                  <option key="AB+" value="AB+">AB+</option>
                                  <option key="AB-" value="AB-">AB-</option>
                                  <option key="O+" value="O+">O+</option>
                                  <option key="O-" value="O-">O-</option>
                                </>
                              )
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Nationality</label>
                            {renderFormField('nationality', 'input', {
                              placeholder: 'Enter nationality'
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Religion</label>
                            {renderFormField('religion', 'input', {
                              placeholder: 'Enter religion'
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Community</label>
                            {renderFormField('community', 'select', {
                              children: (
                                <>
                                  <option value="">Select Community</option>
                                  {communityOptions.map((c) => (
                                    <option key={c.id} value={c.Community}>{c.Community}</option>
                                  ))}
                                </>
                              )
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Caste</label>
                            {renderFormField('caste', 'input', {
                              placeholder: 'Enter caste'
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Physically Challenged</label>
                            {renderFormField('physicallyChallenged', 'select', {
                              children: (
                                <>
                                  <option value="">Select</option>
                                  <option key="No" value="No">No</option>
                                  <option key="Yes" value="Yes">Yes</option>
                                </>
                              )
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Marital Status</label>
                            {renderFormField('maritalStatus', 'select', {
                              children: (
                                <>
                                  <option value="">Select</option>
                                  <option key="Single" value="Single">Single</option>
                                  <option key="Married" value="Married">Married</option>
                                  <option key="Other" value="Other">Other</option>
                                </>
                              )
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Aadhar Number</label>
                            <input type="text" name="aadharNo" value={form.aadharNo || ''} onChange={handleChange} className="form-control" placeholder="Enter Aadhar number" maxLength="12" />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">PAN Number</label>
                            <input type="text" name="panNo" value={form.panNo || ''} onChange={handleChange} className="form-control" placeholder="Enter PAN number" maxLength="10" />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Mother Tongue</label>
                            {renderFormField('motherTongue', 'select', {
                              children: (
                                <>
                                  <option value="">Select Mother Tongue</option>
                                  <option key="Tamil" value="Tamil">Tamil</option>
                                  <option key="Malayalam" value="Malayalam">Malayalam</option>
                                  <option key="Telugu" value="Telugu">Telugu</option>
                                  <option key="Kannada" value="Kannada">Kannada</option>
                                  <option key="Hindi" value="Hindi">Hindi</option>
                                  <option key="English" value="English">English</option>
                                  <option key="Others" value="Others">Others</option>
                                </>
                              )
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">EMIS Number</label>
                            {renderFormField('emisNumber', 'input', {
                              placeholder: 'Enter EMIS number'
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Medium of Instruction</label>
                            {renderFormField('mediumOfInstruction', 'select', {
                              children: (
                                <>
                                  <option value="">Select Medium</option>
                                  <option value="English">English</option>
                                  <option value="Tamil">Tamil</option>
                                  <option value="Telugu">Telugu</option>
                                  <option value="Kannada">Kannada</option>
                                  <option value="Hindi">Hindi</option>
                                  <option value="Others">Others</option>
                                </>
                              )
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Section: Photo Upload */}
                      <div className="mb-32 pb-16 border-bottom">
                        <h5 className="fw-semibold mb-3">Photo Upload</h5>
                        <div className="row g-3">
                          <div className="col-md-4">
                            <div className="border border-dashed border-neutral-300 rounded-8 p-20 mb-12 text-center bg-light">
                              {photoFile ? (
                                <img
                                  src={URL.createObjectURL(photoFile)}
                                  alt="Preview"
                                  className="img-fluid rounded mb-3"
                                  style={{ maxWidth: '200px', maxHeight: '250px', objectFit: 'cover' }}
                                />
                              ) : editStudent && editStudent.Photo_Path ? (
                                <img
                                  src={`/api/studentMaster/student/student-image/${editStudent.Photo_Path}`}
                                  alt="Student Photo"
                                  className="img-fluid rounded mb-3"
                                  style={{ maxWidth: '200px', maxHeight: '250px', objectFit: 'cover' }}
                                  onError={(e) => { e.target.src = '/api/studentMaster/student/student-image/student.png'; }}
                                />
                              ) : (
                                <div className="py-20">
                                  <i className="fa fa-user fa-3x text-neutral-400 mb-8"></i>
                                  <p className="text-sm text-neutral-500 mb-8">{photoLabel}</p>
                                </div>
                              )}
                              <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="d-none" />
                              <button type="button" className="btn btn-outline-primary btn-sm" onClick={handlePhotoBrowse}>
                                <i className="fa fa-upload me-1"></i> {editStudent && editStudent.Photo_Path ? 'Change Photo' : 'Browse Photo'}
                              </button>
                            </div>
                            <small className="text-muted">Supported formats: JPG, PNG, WEBP (Max size: 5MB)</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: Bank Details */}
                  {activeTab === 'bank' && (
                    <div className="tab-content-section">

                      {/* Section: Bank Details */}
                      <div className="mb-32 pb-16 border-bottom">
                        <h5 className="fw-semibold mb-3">Bank Details</h5>
                        <div className="row g-3">
                          <div className="col-md-3">
                            <label className="form-label">Bank Name</label>
                            {renderFormField('bankName', 'input', {
                              placeholder: 'Enter bank name'
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Bank Branch</label>
                            {renderFormField('bankBranch', 'input', {
                              placeholder: 'Enter bank branch'
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Account Number</label>
                            {renderFormField('accountNumber', 'input', {
                              placeholder: 'Enter account number'
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">IFSC Code</label>
                            {renderFormField('ifscCode', 'input', {
                              placeholder: 'Enter IFSC code'
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">MICR Code</label>
                            {renderFormField('micrCode', 'input', {
                              placeholder: 'Enter MICR code'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: Address Details */}
                  {activeTab === 'address' && (
                    <div className="tab-content-section">

                      {/* Section: Address Details */}
                      <div className="mb-32 pb-16 border-bottom">
                        <h5 className="fw-semibold mb-3">Address Details</h5>
                        <div className="row g-3">
                          <div className="col-md-4">
                            <label className="form-label">Permanent District</label>
                            <div className="form-select-wrapper">
                              <select name="permanentDistrict" value={form.permanentDistrict || ''} onChange={handleChange} className="form-select">
                                <option value="">
                                  {districts.length === 0 ? 'Loading districts...' : 'Select District'}
                                </option>
                                {districts.map((d) => (
                                  <option key={`district-${d.id}`} value={d.District}>{d.District}</option>
                                ))}
                              </select>
                            </div>
                            {districts.length === 0 && (
                              <small className="text-warning d-block mt-1">
                                <i className="fas fa-exclamation-triangle me-1"></i>
                                No districts available. Check database.
                              </small>
                            )}
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Permanent State</label>
                            <input type="text" name="permanentState" value={form.permanentState || ''} readOnly className="form-control" placeholder="State will be auto-filled" />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Permanent Pincode</label>
                            <input type="text" name="permanentPincode" value={form.permanentPincode || ''} onChange={handleChange} className="form-control" />
                          </div>
                          <div className="col-md-12">
                            <label className="form-label">Permanent Address</label>
                            <textarea name="permanentAddress" value={form.permanentAddress || ''} onChange={handleChange} className="form-control" rows="2" placeholder="Enter permanent address" />
                          </div>
                          <div className="col-md-12 mb-3">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={handleSameAsPermanent}
                              title="Copy permanent address to current address"
                            >
                              <i className="fas fa-copy me-1"></i> Same as Permanent
                            </button>
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Current District</label>
                            <div className="form-select-wrapper">
                              <select name="currentDistrict" value={form.currentDistrict || ''} onChange={handleChange} className="form-select">
                                <option value="">
                                  {districts.length === 0 ? 'Loading districts...' : 'Select District'}
                                </option>
                                {districts.map((d) => (
                                  <option key={`district-${d.id}`} value={d.District}>{d.District}</option>
                                ))}
                              </select>
                            </div>
                            {districts.length === 0 && (
                              <small className="text-warning d-block mt-1">
                                <i className="fas fa-exclamation-triangle me-1"></i>
                                No districts available. Check database.
                              </small>
                            )}
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Current State</label>
                            <input type="text" name="currentState" value={form.currentState || ''} readOnly className="form-control" placeholder="State will be auto-filled" />
                          </div>
                          <div className="col-md-4">
                            <label className="form-label">Current Pincode</label>
                            <input type="text" name="currentPincode" value={form.currentPincode || ''} onChange={handleChange} className="form-control" />
                          </div>
                          <div className="col-md-12">
                            <label className="form-label">Current Address</label>
                            <textarea name="currentAddress" value={form.currentAddress || ''} onChange={handleChange} className="form-control" rows="2" placeholder="Enter current address" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: Education Details */}
                  {activeTab === 'education' && (
                    <div className="tab-content-section">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Select Education Sections to Display:</label>
                        <Select
                          isMulti
                          options={EDUCATION_SECTION_OPTIONS}
                          value={EDUCATION_SECTION_OPTIONS.filter(opt => educationSections[opt.value])}
                          onChange={selected => {
                            const newSections = { sslc: false, iti: false, vocational: false, hsc: false };
                            selected.forEach(opt => { newSections[opt.value] = true; });
                            setEducationSections(newSections);
                          }}
                          className="w-100 w-md-75 w-lg-50"
                          placeholder="Choose sections..."
                        />
                      </div>

                      {/* Conditionally render sections based on selection */}
                      {educationSections.sslc && renderSslcSection()}
                      {educationSections.iti && renderItiSection()}
                      {educationSections.vocational && renderVocationalSection()}
                      {educationSections.hsc && renderHscSection()}

                      {/* Section: Examination Attempts - By Education Type */}
                      <div className="mb-4 pb-3 pb-md-4 border-bottom">
                        <h5 className="fw-semibold mb-3">Examination Attempts by Education Type</h5>

                        {/* SSLC Examination Attempts */}
                        {educationSections.sslc && (
                          <div className="mb-5 pb-4 border-bottom">
                            <h6 className="fw-semibold text-primary mb-3">
                              <i className="fas fa-graduation-cap me-2"></i>SSLC Examination Attempts
                            </h6>
                            <div className="row g-3 mb-4">
                              <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
                                <label className="form-label fw-semibold">
                                  No. of Attempts
                                </label>
                                <select
                                  name="sslcNumberOfAttempts"
                                  value={form.sslcNumberOfAttempts || ''}
                                  onChange={handleChange}
                                  className="form-select"
                                >
                                  <option value="">Select Number</option>
                                  <option key="1" value="1">Attempt 1</option>
                                  <option key="2" value="2">Attempt 2</option>
                                  <option key="3" value="3">Attempt 3</option>
                                  <option key="4" value="4">Attempt 4</option>
                                  <option key="5" value="5">Attempt 5</option>
                                </select>
                              </div>
                            </div>

                            {form.sslcNumberOfAttempts && parseInt(form.sslcNumberOfAttempts) > 0 && Array.isArray(form.sslcExaminationAttempts) && form.sslcExaminationAttempts.length > 0 && (
                              <div className="attempts-container">
                                <div className="alert alert-info mb-3">
                                  <i className="fas fa-info-circle me-2"></i>
                                  Showing {form.sslcExaminationAttempts.length} attempt form(s) for {form.sslcNumberOfAttempts} attempts selected.
                                </div>
                                {form.sslcExaminationAttempts.map((attempt, index) => {
                                  const safeAttempt = attempt || {};
                                  return (
                                    <div key={`sslc-${index}`} className="card mb-4 shadow-sm">
                                      <div className="card-header bg-primary text-white">
                                        <h6 className="mb-0">
                                          <i className="fas fa-clipboard-list me-2"></i>
                                          SSLC Attempt {index + 1} Details
                                        </h6>
                                      </div>
                                      <div className="card-body">
                                        <div className="row g-3">
                                          <div className="col-12 col-sm-6 col-lg-4">
                                            <label className="form-label">
                                              MarkSheet
                                            </label>
                                            <input
                                              type="text"
                                              value={safeAttempt.markSheet || ''}
                                              onChange={(e) => handleAttemptFieldChange(index, 'markSheet', e.target.value, 'sslc')}
                                              className="form-control"
                                              placeholder="e.g., 21A54"
                                            />
                                            <small className="text-muted">Example: 21A54</small>
                                          </div>
                                          <div className="col-12 col-sm-6 col-lg-4">
                                            <label className="form-label">
                                              Exam Reg No
                                            </label>
                                            <input
                                              type="text"
                                              value={safeAttempt.examRegNo || ''}
                                              onChange={(e) => handleAttemptFieldChange(index, 'examRegNo', e.target.value, 'sslc')}
                                              className="form-control"
                                              placeholder="e.g., 21BE5780"
                                            />
                                            <small className="text-muted">Example: 21BE5780</small>
                                          </div>
                                          <div className="col-12 col-sm-6 col-lg-4">
                                            <label className="form-label">
                                              Month
                                            </label>
                                            <select
                                              value={safeAttempt.month || ''}
                                              onChange={(e) => handleAttemptFieldChange(index, 'month', e.target.value, 'sslc')}
                                              className="form-select"
                                            >
                                              <option value="">Select Month</option>
                                              <option key="January" value="January">January</option>
                                              <option key="February" value="February">February</option>
                                              <option key="March" value="March">March</option>
                                              <option key="April" value="April">April</option>
                                              <option key="May" value="May">May</option>
                                              <option key="June" value="June">June</option>
                                              <option key="July" value="July">July</option>
                                              <option key="August" value="August">August</option>
                                              <option key="September" value="September">September</option>
                                              <option key="October" value="October">October</option>
                                              <option key="November" value="November">November</option>
                                              <option key="December" value="December">December</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="row g-3 mt-2">
                                          <div className="col-12 col-sm-6 col-lg-4">
                                            <label className="form-label">
                                              Year
                                            </label>
                                            <input
                                              type="number"
                                              value={safeAttempt.year || ''}
                                              onChange={(e) => handleAttemptFieldChange(index, 'year', e.target.value, 'sslc')}
                                              className="form-control"
                                              placeholder="e.g., 2024"
                                              min="2000"
                                              max="2099"
                                            />
                                          </div>
                                          <div className="col-12 col-sm-6 col-lg-4">
                                            <label className="form-label">
                                              Total Marks
                                            </label>
                                            <input
                                              type="number"
                                              value={safeAttempt.totalMarks || ''}
                                              onChange={(e) => handleAttemptFieldChange(index, 'totalMarks', e.target.value, 'sslc')}
                                              className="form-control"
                                              placeholder="e.g., 500"
                                              min="0"
                                              max="500"
                                            />
                                            <small className="text-muted">Total marks obtained</small>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {(!form.sslcNumberOfAttempts || parseInt(form.sslcNumberOfAttempts) === 0) && (
                              <div className="alert alert-info">
                                <i className="fas fa-info-circle me-2"></i>
                                Please select the number of attempts to display the input forms.
                              </div>
                            )}
                          </div>
                        )}

                        {/* ITI Examination Attempts */}
                        {educationSections.iti && (
                          <div className="mb-5 pb-4 border-bottom">
                            <h6 className="fw-semibold text-primary mb-3">
                              <i className="fas fa-tools me-2"></i>ITI Examination Attempts
                            </h6>
                            <div className="row g-3 mb-4">
                              <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
                                <label className="form-label fw-semibold">
                                  No. of Attempts
                                </label>
                                <select
                                  name="itiNumberOfAttempts"
                                  value={form.itiNumberOfAttempts || ''}
                                  onChange={handleChange}
                                  className="form-select"
                                >
                                  <option value="">Select Number</option>
                                  <option key="1" value="1">Attempt 1</option>
                                  <option key="2" value="2">Attempt 2</option>
                                  <option key="3" value="3">Attempt 3</option>
                                  <option key="4" value="4">Attempt 4</option>
                                  <option key="5" value="5">Attempt 5</option>
                                </select>
                              </div>
                            </div>

                            {form.itiNumberOfAttempts && parseInt(form.itiNumberOfAttempts) > 0 && Array.isArray(form.itiExaminationAttempts) && form.itiExaminationAttempts.length > 0 && (
                              <div className="attempts-container">
                                <div className="alert alert-info mb-3">
                                  <i className="fas fa-info-circle me-2"></i>
                                  Showing {form.itiExaminationAttempts.length} attempt form(s) for {form.itiNumberOfAttempts} attempts selected.
                                </div>
                                {form.itiExaminationAttempts.map((attempt, index) => {
                                  const safeAttempt = attempt || {};
                                  return (
                                    <div key={`iti-${index}`} className="card mb-4 shadow-sm">
                                      <div className="card-header bg-info text-white">
                                        <h6 className="mb-0">
                                          <i className="fas fa-clipboard-list me-2"></i>
                                          ITI Attempt {index + 1} Details
                                        </h6>
                                      </div>
                                      <div className="card-body">
                                        <div className="row g-3">
                                          <div className="col-12 col-sm-6 col-lg-4">
                                            <label className="form-label">
                                              MarkSheet
                                            </label>
                                            <input
                                              type="text"
                                              value={safeAttempt.markSheet || ''}
                                              onChange={(e) => handleAttemptFieldChange(index, 'markSheet', e.target.value, 'iti')}
                                              className="form-control"
                                              placeholder="e.g., 21A54"
                                            />
                                            <small className="text-muted">Example: 21A54</small>
                                          </div>
                                          <div className="col-12 col-sm-6 col-lg-4">
                                            <label className="form-label">
                                              Exam Reg No
                                            </label>
                                            <input
                                              type="text"
                                              value={safeAttempt.examRegNo || ''}
                                              onChange={(e) => handleAttemptFieldChange(index, 'examRegNo', e.target.value, 'iti')}
                                              className="form-control"
                                              placeholder="e.g., 21BE5780"
                                            />
                                            <small className="text-muted">Example: 21BE5780</small>
                                          </div>
                                          <div className="col-12 col-sm-6 col-lg-4">
                                            <label className="form-label">
                                              Month
                                            </label>
                                            <select
                                              value={safeAttempt.month || ''}
                                              onChange={(e) => handleAttemptFieldChange(index, 'month', e.target.value, 'iti')}
                                              className="form-select"
                                            >
                                              <option value="">Select Month</option>
                                              <option key="January" value="January">January</option>
                                              <option key="February" value="February">February</option>
                                              <option key="March" value="March">March</option>
                                              <option key="April" value="April">April</option>
                                              <option key="May" value="May">May</option>
                                              <option key="June" value="June">June</option>
                                              <option key="July" value="July">July</option>
                                              <option key="August" value="August">August</option>
                                              <option key="September" value="September">September</option>
                                              <option key="October" value="October">October</option>
                                              <option key="November" value="November">November</option>
                                              <option key="December" value="December">December</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="row g-3 mt-2">
                                          <div className="col-12 col-sm-6 col-lg-4">
                                            <label className="form-label">
                                              Year
                                            </label>
                                            <input
                                              type="number"
                                              value={safeAttempt.year || ''}
                                              onChange={(e) => handleAttemptFieldChange(index, 'year', e.target.value, 'iti')}
                                              className="form-control"
                                              placeholder="e.g., 2024"
                                              min="2000"
                                              max="2099"
                                            />
                                          </div>
                                          <div className="col-12 col-sm-6 col-lg-4">
                                            <label className="form-label">
                                              Total Marks
                                            </label>
                                            <input
                                              type="number"
                                              value={safeAttempt.totalMarks || ''}
                                              onChange={(e) => handleAttemptFieldChange(index, 'totalMarks', e.target.value, 'iti')}
                                              className="form-control"
                                              placeholder="e.g., 700"
                                              min="0"
                                              max="700"
                                            />
                                            <small className="text-muted">Total marks obtained</small>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {(!form.itiNumberOfAttempts || parseInt(form.itiNumberOfAttempts) === 0) && (
                              <div className="alert alert-info">
                                <i className="fas fa-info-circle me-2"></i>
                                Please select the number of attempts to display the input forms.
                              </div>
                            )}
                          </div>
                        )}

                        {/* Vocational Examination Attempts */}
                        {educationSections.vocational && (
                          <div className="mb-5 pb-4 border-bottom">
                            <h6 className="fw-semibold text-primary mb-3">
                              <i className="fas fa-book me-2"></i>Vocational Examination Attempts
                            </h6>
                            <div className="row g-3 mb-4">
                              <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
                                <label className="form-label fw-semibold">
                                  No. of Attempts
                                </label>
                                <select
                                  name="vocationalNumberOfAttempts"
                                  value={form.vocationalNumberOfAttempts || ''}
                                  onChange={handleChange}
                                  className="form-select"
                                >
                                  <option value="">Select Number</option>
                                  <option key="1" value="1">Attempt 1</option>
                                  <option key="2" value="2">Attempt 2</option>
                                  <option key="3" value="3">Attempt 3</option>
                                  <option key="4" value="4">Attempt 4</option>
                                  <option key="5" value="5">Attempt 5</option>
                                </select>
                              </div>
                            </div>

                            {form.vocationalNumberOfAttempts && parseInt(form.vocationalNumberOfAttempts) > 0 && Array.isArray(form.vocationalExaminationAttempts) && form.vocationalExaminationAttempts.length > 0 && (
                              <div className="attempts-container">
                                <div className="alert alert-info mb-3">
                                  <i className="fas fa-info-circle me-2"></i>
                                  Showing {form.vocationalExaminationAttempts.length} attempt form(s) for {form.vocationalNumberOfAttempts} attempts selected.
                                </div>
                                {form.vocationalExaminationAttempts.map((attempt, index) => {
                                  const safeAttempt = attempt || {};
                                  return (
                                    <div key={`vocational-${index}`} className="card mb-4 shadow-sm">
                                      <div className="card-header bg-success text-white">
                                        <h6 className="mb-0">
                                          <i className="fas fa-clipboard-list me-2"></i>
                                          Vocational Attempt {index + 1} Details
                                        </h6>
                                      </div>
                                      <div className="card-body">
                                        <div className="row g-3">
                                          <div className="col-12 col-sm-6 col-lg-4">
                                            <label className="form-label">
                                              MarkSheet
                                            </label>
                                            <input
                                              type="text"
                                              value={safeAttempt.markSheet || ''}
                                              onChange={(e) => handleAttemptFieldChange(index, 'markSheet', e.target.value, 'vocational')}
                                              className="form-control"
                                              placeholder="e.g., 21A54"
                                            />
                                            <small className="text-muted">Example: 21A54</small>
                                          </div>
                                          <div className="col-12 col-sm-6 col-lg-4">
                                            <label className="form-label">
                                              Exam Reg No
                                            </label>
                                            <input
                                              type="text"
                                              value={safeAttempt.examRegNo || ''}
                                              onChange={(e) => handleAttemptFieldChange(index, 'examRegNo', e.target.value, 'vocational')}
                                              className="form-control"
                                              placeholder="e.g., 21BE5780"
                                            />
                                            <small className="text-muted">Example: 21BE5780</small>
                                          </div>
                                          <div className="col-12 col-sm-6 col-lg-4">
                                            <label className="form-label">
                                              Month
                                            </label>
                                            <select
                                              value={safeAttempt.month || ''}
                                              onChange={(e) => handleAttemptFieldChange(index, 'month', e.target.value, 'vocational')}
                                              className="form-select"
                                            >
                                              <option value="">Select option</option>
                                              <option key="January" value="January">January</option>
                                              <option key="February" value="February">February</option>
                                              <option key="March" value="March">March</option>
                                              <option key="April" value="April">April</option>
                                              <option key="May" value="May">May</option>
                                              <option key="June" value="June">June</option>
                                              <option key="July" value="July">July</option>
                                              <option key="August" value="August">August</option>
                                              <option key="September" value="September">September</option>
                                              <option key="October" value="October">October</option>
                                              <option key="November" value="November">November</option>
                                              <option key="December" value="December">December</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="row g-3 mt-2">
                                          <div className="col-12 col-sm-6 col-lg-4">
                                            <label className="form-label">
                                              Year
                                            </label>
                                            <input
                                              type="number"
                                              value={safeAttempt.year || ''}
                                              onChange={(e) => handleAttemptFieldChange(index, 'year', e.target.value, 'vocational')}
                                              className="form-control"
                                              placeholder="e.g., 2024"
                                              min="2000"
                                              max="2099"
                                            />
                                          </div>
                                          <div className="col-12 col-sm-6 col-lg-4">
                                            <label className="form-label">
                                              Total Marks
                                            </label>
                                            <input
                                              type="number"
                                              value={safeAttempt.totalMarks || ''}
                                              onChange={(e) => handleAttemptFieldChange(index, 'totalMarks', e.target.value, 'vocational')}
                                              className="form-control"
                                              placeholder="e.g., 1200"
                                              min="0"
                                              max="1200"
                                            />
                                            <small className="text-muted">Total marks obtained</small>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {(!form.vocationalNumberOfAttempts || parseInt(form.vocationalNumberOfAttempts) === 0) && (
                              <div className="alert alert-info">
                                <i className="fas fa-info-circle me-2"></i>
                                Please select the number of attempts to display the input forms.
                              </div>
                            )}
                          </div>
                        )}

                        {/* HSC Examination Attempts */}
                        {educationSections.hsc && (
                          <div className="mb-5 pb-4">
                            <h6 className="fw-semibold text-primary mb-3">
                              <i className="fas fa-mortar-board me-2"></i>HSC Examination Attempts
                            </h6>
                            <div className="row g-3 mb-4">
                              <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
                                <label className="form-label fw-semibold">
                                  No. of Attempts
                                </label>
                                <select
                                  name="hscNumberOfAttempts"
                                  value={form.hscNumberOfAttempts || ''}
                                  onChange={handleChange}
                                  className="form-select"
                                >
                                  <option value="">Select Number</option>
                                  <option key="1" value="1">Attempt 1</option>
                                  <option key="2" value="2">Attempt 2</option>
                                  <option key="3" value="3">Attempt 3</option>
                                  <option key="4" value="4">Attempt 4</option>
                                  <option key="5" value="5">Attempt 5</option>
                                </select>
                              </div>
                            </div>

                            {form.hscNumberOfAttempts && parseInt(form.hscNumberOfAttempts) > 0 && Array.isArray(form.hscExaminationAttempts) && form.hscExaminationAttempts.length > 0 && (
                              <div className="attempts-container">
                                <div className="alert alert-info mb-3">
                                  <i className="fas fa-info-circle me-2"></i>
                                  Showing {form.hscExaminationAttempts.length} attempt form(s) for {form.hscNumberOfAttempts} attempts selected.
                                </div>
                                {form.hscExaminationAttempts.map((attempt, index) => {
                                  const safeAttempt = attempt || {};
                                  return (
                                    <div key={`hsc-${index}`} className="card mb-4 shadow-sm">
                                      <div className="card-header bg-warning text-dark">
                                        <h6 className="mb-0">
                                          <i className="fas fa-clipboard-list me-2"></i>
                                          HSC Attempt {index + 1} Details
                                        </h6>
                                      </div>
                                      <div className="card-body">
                                        <div className="row g-3">
                                          <div className="col-12 col-sm-6 col-lg-4">
                                            <label className="form-label">
                                              MarkSheet
                                            </label>
                                            <input
                                              type="text"
                                              value={safeAttempt.markSheet || ''}
                                              onChange={(e) => handleAttemptFieldChange(index, 'markSheet', e.target.value, 'hsc')}
                                              className="form-control"
                                              placeholder="e.g., 21A54"
                                            />
                                            <small className="text-muted">Example: 21A54</small>
                                          </div>
                                          <div className="col-12 col-sm-6 col-lg-4">
                                            <label className="form-label">
                                              Exam Reg No
                                            </label>
                                            <input
                                              type="text"
                                              value={safeAttempt.examRegNo || ''}
                                              onChange={(e) => handleAttemptFieldChange(index, 'examRegNo', e.target.value, 'hsc')}
                                              className="form-control"
                                              placeholder="e.g., 21BE5780"
                                            />
                                            <small className="text-muted">Example: 21BE5780</small>
                                          </div>
                                          <div className="col-12 col-sm-6 col-lg-4">
                                            <label className="form-label">
                                              Month
                                            </label>
                                            <select
                                              value={safeAttempt.month || ''}
                                              onChange={(e) => handleAttemptFieldChange(index, 'month', e.target.value, 'hsc')}
                                              className="form-select"
                                            >
                                              <option value="">Select Month</option>
                                              <option key="January" value="January">January</option>
                                              <option key="February" value="February">February</option>
                                              <option key="March" value="March">March</option>
                                              <option key="April" value="April">April</option>
                                              <option key="May" value="May">May</option>
                                              <option key="June" value="June">June</option>
                                              <option key="July" value="July">July</option>
                                              <option key="August" value="August">August</option>
                                              <option key="September" value="September">September</option>
                                              <option key="October" value="October">October</option>
                                              <option key="November" value="November">November</option>
                                              <option key="December" value="December">December</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="row g-3 mt-2">
                                          <div className="col-12 col-sm-6 col-lg-4">
                                            <label className="form-label">
                                              Year
                                            </label>
                                            <input
                                              type="number"
                                              value={safeAttempt.year || ''}
                                              onChange={(e) => handleAttemptFieldChange(index, 'year', e.target.value, 'hsc')}
                                              className="form-control"
                                              placeholder="e.g., 2024"
                                              min="2000"
                                              max="2099"
                                            />
                                          </div>
                                          <div className="col-12 col-sm-6 col-lg-4">
                                            <label className="form-label">
                                              Total Marks
                                            </label>
                                            <input
                                              type="number"
                                              value={safeAttempt.totalMarks || ''}
                                              onChange={(e) => handleAttemptFieldChange(index, 'totalMarks', e.target.value, 'hsc')}
                                              className="form-control"
                                              placeholder="e.g., 1200"
                                              min="0"
                                              max="1200"
                                            />
                                            <small className="text-muted">Total marks obtained</small>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {(!form.hscNumberOfAttempts || parseInt(form.hscNumberOfAttempts) === 0) && (
                              <div className="alert alert-info">
                                <i className="fas fa-info-circle me-2"></i>
                                Please select the number of attempts to display the input forms.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 6: Course Details */}
                  {activeTab === 'course' && (
                    <div className="tab-content-section">

                      {/* Section: Other Information */}
                      <div className="mb-32 pb-16 border-bottom">
                        <h5 className="fw-semibold mb-3">Scholarship Information</h5>
                        <div className="row g-3">
                          <div className="col-md-3">
                            <label className="form-label">Scholarship</label>
                            <select name="scholarship" value={form.scholarship || ''} onChange={handleChange} className="form-select">
                              <option value="">Select Yes/No</option>
                              <option key="Yes" value="Yes">Yes</option>
                              <option key="No" value="No">No</option>
                            </select>
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">First Graduate</label>
                            <select name="firstGraduate" value={form.firstGraduate || ''} onChange={handleChange} className="form-select">
                              <option value="">Select Yes/No</option>
                              <option key="Yes" value="Yes">Yes</option>
                              <option key="No" value="No">No</option>
                            </select>
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Bank Loan</label>
                            <select name="bankLoan" value={form.bankLoan || ''} onChange={handleChange} className="form-select">
                              <option value="">Select Yes/No</option>
                              <option key="Yes" value="Yes">Yes</option>
                              <option key="No" value="No">No</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Section: Course Details */}
                      <div className="mb-32 pb-16 border-bottom">
                        <h5 className="fw-semibold mb-3">Course Details</h5>
                        <div className="row g-3">
                          <div className="col-md-3">
                            <label className="form-label">Mode of Joining <span className="text-danger">*</span></label>
                            {renderFormField('modeOfJoining', 'select', {
                              children: (
                                <>
                                  <option value="">Select Mode</option>
                                  <option key="Regular" value="Regular">Regular</option>
                                  <option key="Lateral" value="Lateral">Lateral</option>
                                </>
                              )
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Reference</label>
                            <select name="reference" value={form.reference || ''} onChange={handleChange} className="form-select">
                              <option value="">Select Yes/No</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Course <span className="text-danger">*</span></label>
                            {renderFormField('Course_Name', 'select', {
                              children: (
                                <>
                                  <option value="">
                                    {courses.length === 0 ? 'Loading courses...' : 'Select Course'}
                                  </option>
                                  {courses.map((course) => (
                                    <option key={course.Course_Name} value={course.Course_Name}>{course.Course_Name}</option>
                                  ))}
                                </>
                              )
                            })}
                            {courses.length === 0 && (
                              <small className="text-warning d-block mt-1">
                                <i className="fas fa-exclamation-triangle me-1"></i>
                                No courses available. Check database.
                              </small>
                            )}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Department <span className="text-danger">*</span></label>
                            {renderFormField('Dept_Name', 'select', {
                              children: (
                                <>
                                  <option value="">
                                    {departments.length === 0
                                      ? 'Loading departments...'
                                      : form.Course_Name
                                        ? 'Select Department'
                                        : 'Select Course First'
                                    }
                                  </option>
                                  {departments
                                    .filter(dept => dept.Course_Name === (form.Course_Name || form.course))
                                    .map((dept) => (
                                      <option key={dept.Dept_Code || dept.Dept_Name} value={dept.Dept_Name}>{dept.Dept_Name}</option>
                                    ))}
                                </>
                              )
                            })}
                            {departments.length === 0 && (
                              <small className="text-warning d-block mt-1">
                                <i className="fas fa-exclamation-triangle me-1"></i>
                                No departments available. Check database.
                              </small>
                            )}
                            {form.Course_Name && departments.filter(d => d.Course_Name === form.Course_Name).length === 0 && departments.length > 0 && (
                              <small className="text-info d-block mt-1">
                                <i className="fas fa-info-circle me-1"></i>
                                No departments for this course.
                              </small>
                            )}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Department Code <span className="text-danger">*</span></label>
                            {renderFormField('Dept_Code', 'input', {
                              inputProps: { readOnly: true },
                              placeholder: 'Enter department code'
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Allocated Quota <span className="text-danger">*</span></label>
                            {renderFormField('allocatedQuota', 'select', {
                              children: (
                                <>
                                  <option value="">Select Quota</option>
                                  <option key="GQ" value="GQ">GQ (Government Quota)</option>
                                  <option key="MQ" value="MQ">MQ (Management Quota)</option>
                                </>
                              )
                            })}
                          </div>

                          {/* Seats Availability Display */}
                          {form.allocatedQuota && (
                            <>
                              <div className="col-md-3">
                                <label className="form-label">Total Seats</label>
                                <div style={{
                                  padding: '10px 12px',
                                  borderRadius: '4px',
                                  backgroundColor: '#f0f4f8',
                                  border: '1px solid #d1d5db',
                                  fontSize: '16px',
                                  fontWeight: '600',
                                  color: '#1f2937',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  minHeight: '38px'
                                }}>
                                  {quotaLoading ? <span>Loading...</span> : quotaData.total || 0}
                                </div>
                              </div>

                              <div className="col-md-3">
                                <label className="form-label">Available Seats</label>
                                <div style={{
                                  padding: '10px 12px',
                                  borderRadius: '4px',
                                  backgroundColor: quotaData.available > quotaData.total * 0.3 ? '#d1fae5' : quotaData.available > 0 ? '#fef3c7' : '#fee2e2',
                                  border: quotaData.available > quotaData.total * 0.3 ? '2px solid #10b981' : quotaData.available > 0 ? '2px solid #f59e0b' : '2px solid #ef4444',
                                  fontSize: '16px',
                                  fontWeight: '600',
                                  color: quotaData.available > quotaData.total * 0.3 ? '#047857' : quotaData.available > 0 ? '#92400e' : '#b91c1c',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  minHeight: '38px'
                                }}>
                                  {quotaLoading ? <span>Loading...</span> : quotaData.available || 0}
                                </div>
                              </div>
                            </>
                          )}
                          <div className="col-md-3">
                            <label className="form-label">Semester <span className="text-danger">*</span></label>
                            {renderFormField('sem', 'select', {
                              children: (
                                <>
                                  <option value="">
                                    {form.modeOfJoining === '' ? 'Select Mode of Joining First' : 'Select Semester'}
                                  </option>
                                  {form.modeOfJoining === 'Lateral'
                                    ? semesters.filter((sem) => parseInt(sem.Semester) >= 3).map((sem) => (
                                      <option key={sem.Semester} value={sem.Semester}>{sem.Semester}</option>
                                    ))
                                    : semesters.map((sem) => (
                                      <option key={sem.Semester} value={sem.Semester}>{sem.Semester}</option>
                                    ))
                                  }
                                </>
                              )
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Year <span className="text-danger">*</span></label>
                            {renderFormField('year', 'input', {
                              inputProps: { readOnly: true },
                              placeholder: 'Year will be auto-filled'
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Admission Status</label>
                            <input type="text" name="admissionStatus" value={form.admissionStatus || 'Pending'} readOnly className="form-control" placeholder="Admission Status" />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Admission Date <span className="text-danger">*</span></label>
                            {renderFormField('admissionDate', 'input', {
                              inputType: 'date',
                              placeholder: 'Enter admission date'
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Academic Year <span className="text-danger">*</span></label>
                            {renderFormField('academicYear', 'select', {
                              selectProps: { disabled: availableAcademicYears.length === 0 },
                              children: (
                                <>
                                  <option value="">Select Academic Year</option>
                                  {availableAcademicYears.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                  ))}
                                </>
                              )
                            })}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">
                              Hostel Required
                              {form.transportRequired === 'Yes' && <span className="text-danger ms-1">(Disabled)</span>}
                            </label>
                            <select name="hostelRequired" value={form.hostelRequired || ''} onChange={handleChange} className="form-select" disabled={form.transportRequired === 'Yes'} style={form.transportRequired === 'Yes' ? { backgroundColor: '#e9ecef', cursor: 'not-allowed' } : {}}>
                              <option value="">Select Yes/No</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                            {form.transportRequired === 'Yes' && <small className="text-muted d-block mt-1">✓ Transport is selected, so Hostel is disabled</small>}
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">
                              Transport Required
                              {form.hostelRequired === 'Yes' && <span className="text-danger ms-1">(Disabled)</span>}
                            </label>
                            <select name="transportRequired" value={form.transportRequired || ''} onChange={handleChange} className="form-select" disabled={form.hostelRequired === 'Yes'} style={form.hostelRequired === 'Yes' ? { backgroundColor: '#e9ecef', cursor: 'not-allowed' } : {}}>
                              <option value="">Select Yes/No</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                            {form.hostelRequired === 'Yes' && <small className="text-muted d-block mt-1">✓ Hostel is selected, so Transport is disabled</small>}
                          </div>

                        </div>
                      </div>
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                    <button type="submit" className="btn btn-outline-primary-600 radius-8 px-20 py-11" title="Save all student details">Save Student Details</button>
                    <button type="button" className="btn btn-outline-secondary px-20" onClick={handleReset} title="Reset all fields">Reset</button>
                  </div>
                </form>
              </div>
            </div>

            {/* Student Table Section */}
            {showTable && <StudentTable refreshTrigger={refreshTable} setEditStudent={setEditStudent} />}
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default StudentDetails;
