import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import "./css/style.css";

const Sidebar = () => {
  const [dropdowns, setDropdowns] = useState({
    filemenu: false,
    officeModule: false,
    payrollModule: false,
    hostelModule: false,
    transportModule: false,
    sms: false,
    // Office nested dropdowns
    generalModule: false,
    stockModule: false,
    letterModule: false,
    feeModule: false,
    accountsModule: false,
    transactionModule: false,
    budgetModule: false,
    // Payroll nested dropdowns
    attendanceModule: false,
    salaryModule: false,
    // Hostel nested dropdowns
    hostelStudentModule: false,
    hostelFeeModule: false,
    hostelProvisionModule: false,
    hostelAccountsModule: false,
    // Transport nested dropdowns
    vehicleModule: false,
    transportFeeModule: false,
    // Exam Management nested dropdowns
    dataSubmissionModule: false,
    practicalExaminationModule: false,
    examProcessModule: false,
    examFormsModule: false,
    staffDutyAssignModule: false,
    remunerationModule: false,
    // Admission Management nested dropdowns
    enquiryManagementModule: false,
    applicationAdmissionModule: false,
    applicationFormModule: false,
    studentMasterProfileModule: false,
    certificatesDocumentsModule: false,
    feeScholarshipModule: false,
    // Library Management nested dropdowns
    bookManagementModule: false,
    borrowerManagementModule: false,
    bookCirculationModule: false,
    fineManagementModule: false,
    reportsTrackingModule: false,
    barcodeIdentificationModule: false,
    // Academic module nested dropdowns
    academicPlanningModule: false,
    attendanceManagementModule: false,
    internalAssessmentModule: false,
    studentPlacementModule: false,
    // SMS module nested dropdowns
    smsManagementModule: false,
    eDiaryModule: false,
    emailCommunicationModule: false,
  });
  const submenuRefs = useRef({});
  const sidebarRef = useRef(null);

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
  }, [dropdowns]);

  return (
    <aside
      ref={sidebarRef}
      className="sidebar"
    >
      {/* Close Button */}
      <button type="button" className="sidebar-close-btn" onClick={closeSidebar}>
        <Icon icon="radix-icons:cross-2" />
      </button>

      {/* Logo Section */}
      <div>
        <a href="index.html" className="sidebar-logo">
          <img src="/assets/images/logo.png" alt="site logo" className="light-logo" />
          <img src="/assets/images/logo-light.png" alt="site logo" className="dark-logo" />
          <img src="/assets/images/logo-icon.png" alt="site logo" className="logo-icon" />
        </a>
      </div>

      {/* Menu Section */}
      <div className="sidebar-menu-area">
        <ul className="sidebar-menu" id="sidebar-menu">
          <li>
            <a href="">
              <Icon icon="solar:home-smile-angle-outline" className="menu-icon" />
              <span>Dashboard</span>
            </a>
          </li>

                  {/* Dropdown - File */}
          <li className={`dropdown ${dropdowns.filemenu ? "dropdown-open" : ""}`}>
            <a
              href="#"
              onClick={(e) => toggleDropdown("filemenu", e)}
              className="dropdown-toggle"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Icon icon="solar:home-smile-angle-outline" className="menu-icon" />
              <span style={{ flex: 1 }}>File</span>
              <Icon
                icon="iconamoon:arrow-down-2-bold"
                className={`dropdown-arrow ${dropdowns.filemenu ? "rotate" : ""}`}
                style={{ fontSize: '1rem', flexShrink: 0 }}
              />
            </a>

            <ul
              className="sidebar-submenu"
              ref={(el) => (submenuRefs.current.filemenu = el)}
              style={{
                display: dropdowns.filemenu ? "block" : "none",
                overflow: "hidden",
                transition: "height 0.3s ease",
              }}
            >
              <li>
                <a href="file-list.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                  </span>
                  <span>User Details</span>
                </a>
              </li>
              <li>
                <a href="file-preview.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                  </span>
                  <span>Log Details</span>
                </a>
              </li>
              <li>
                <a href="file-add.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                  </span>
                  <span>User Manual</span>
                </a>
              </li>
            </ul>
          </li>

          {/* <li className="sidebar-menu-group-title">Master</li> */}

          <li className="sidebar-menu-group-title">Admission</li>

          {/* Enquiry Management Module */}
          <li className={`dropdown ${dropdowns.enquiryManagementModule ? "dropdown-open" : ""}`}>
            <a
              href="#"
              onClick={(e) => toggleDropdown("enquiryManagementModule", e)}
              className="dropdown-toggle"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Icon icon="solar:question-circle-outline" className="menu-icon" />
              <span style={{ flex: 1 }}>Enquiry</span>
              <Icon
                icon="iconamoon:arrow-down-2-bold"
                className={`dropdown-arrow ${dropdowns.enquiryManagementModule ? "rotate" : ""}`}
                style={{ fontSize: '0.8rem', flexShrink: 0 }}
              />
            </a>
            <ul
              className="sidebar-submenu"
              ref={(el) => (submenuRefs.current.enquiryManagementModule = el)}
              style={{
                display: dropdowns.enquiryManagementModule ? "block" : "none",
                overflow: "hidden",
                transition: "height 0.3s ease",
              }}
            >
              <li>
                <a href="enquiry-details.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                  </span>
                  <span>Enquiry Details</span>
                </a>
              </li>
              <li>
                <a href="student-enquiry.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                  </span>
                  <span>Student Enquiry</span>
                </a>
              </li>
              <li>
                <a href="edit-student-enquiry.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                  </span>
                  <span>Edit Student Enquiry</span>
                </a>
              </li>
              <li>
                <a href="call-entry.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                  </span>
                  <span>Call Entry</span>
                </a>
              </li>
              <li>
                <a href="set-serial-number-wise-call.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                  </span>
                  <span>Set Serial Number Wise Call</span>
                </a>
              </li>
              <li>
                <a href="enquiry-report.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                  </span>
                  <span>Enquiry Report (Student, Subject, Community, School, and District Wise)</span>
                </a>
              </li>
              <li>
                <a href="call-report.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                  </span>
                  <span>Call Report</span>
                </a>
              </li>
              <li>
                <a href="reminder.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                  </span>
                  <span>Reminder</span>
                </a>
              </li>
            </ul>
          </li>

          {/* Application & Admission Module */}
          <li className={`dropdown ${dropdowns.applicationAdmissionModule ? "dropdown-open" : ""}`}>
            <a
              href="#"
              onClick={(e) => toggleDropdown("applicationAdmissionModule", e)}
              className="dropdown-toggle"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Icon icon="solar:document-add-outline" className="menu-icon" />
              <span style={{ flex: 1 }}>Application</span>
              <Icon
                icon="iconamoon:arrow-down-2-bold"
                className={`dropdown-arrow ${dropdowns.applicationAdmissionModule ? "rotate" : ""}`}
                style={{ fontSize: '0.8rem', flexShrink: 0 }}
              />
            </a>
            <ul
              className="sidebar-submenu"
              ref={(el) => (submenuRefs.current.applicationAdmissionModule = el)}
              style={{
                display: dropdowns.applicationAdmissionModule ? "block" : "none",
                overflow: "hidden",
                transition: "height 0.3s ease",
              }}
            >
              <li>
                <a href="admission-statistics.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                  </span>
                  <span>Quota Allocation</span>
                </a>
              </li>
              <li>
                <a href="application-issue.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                  </span>
                  <span>Application Issue</span>
                </a>
              </li>
              <li>
                <a href="application-issue-report.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                  </span>
                  <span>Application Issue Report (Number, Course & Consolidate Wise)</span>
                </a>
              </li>
              <li>
                <a href="application-submission-details.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                  </span>
                  <span>Application Submission Details</span>
                </a>
              </li>
              <li>
                <a href="admission-statistics.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                  </span>
                  <span>Admission Statistics</span>
                </a>
              </li>
              <li>
                <a href="admission-statistics-report.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                  </span>
                  <span>Admission Statistics Report</span>
                </a>
              </li>
              <li>
                <a href="ranking-details.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                  </span>
                  <span>Ranking Details</span>
                </a>
              </li>
              <li>
                <a href="student-admitted-report.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                  </span>
                  <span>Student Admitted Report</span>
                </a>
              </li>
              <li>
                <a href="general-enquiry-report.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                  </span>
                  <span>General Enquiry Report</span>
                </a>
              </li>
              <li>
                <a href="certificate-verification-report.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                  </span>
                  <span>Certificate Verification Report</span>
                </a>
              </li>

              {/* Form Nested Dropdown */}
              <li className={`dropdown ${dropdowns.applicationFormModule ? "dropdown-open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => toggleDropdown("applicationFormModule", e)}
                  className="dropdown-toggle"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon icon="solar:document-outline" className="menu-icon" />
                  <span style={{ flex: 1 }}>Form</span>
                  <Icon
                    icon="iconamoon:arrow-down-2-bold"
                    className={`dropdown-arrow ${dropdowns.applicationFormModule ? "rotate" : ""}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  />
                </a>
                <ul
                  className="sidebar-submenu"
                  ref={(el) => (submenuRefs.current.applicationFormModule = el)}
                  style={{
                    display: dropdowns.applicationFormModule ? "block" : "none",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <li>
                    <a href="form-a.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Form A</span>
                    </a>
                  </li>
                  <li>
                    <a href="form-b.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Form B</span>
                    </a>
                  </li>
                  <li>
                    <a href="form-c.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>Form C</span>
                    </a>
                  </li>
                  <li>
                    <a href="form-d.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Form D</span>
                    </a>
                  </li>
                  <li>
                    <a href="form-f1.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>Form F1</span>
                    </a>
                  </li>
                  <li>
                    <a href="form-f2.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Form F2</span>
                    </a>
                  </li>
                  <li>
                    <a href="form-f3.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Form F3</span>
                    </a>
                  </li>
                  <li>
                    <a href="form-e-entry.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>Form E Entry</span>
                    </a>
                  </li>
                  <li>
                    <a href="form-e.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Form E</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </li>

          {/* Student Master & Profile Module */}
          <li className={`dropdown ${dropdowns.studentMasterProfileModule ? "dropdown-open" : ""}`}>
            <a
              href="#"
              onClick={(e) => toggleDropdown("studentMasterProfileModule", e)}
              className="dropdown-toggle"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Icon icon="solar:user-id-outline" className="menu-icon" />
              <span style={{ flex: 1 }}>Student Master</span>
              <Icon
                icon="iconamoon:arrow-down-2-bold"
                className={`dropdown-arrow ${dropdowns.studentMasterProfileModule ? "rotate" : ""}`}
                style={{ fontSize: '0.8rem', flexShrink: 0 }}
              />
            </a>
            <ul
              className="sidebar-submenu"
              ref={(el) => (submenuRefs.current.studentMasterProfileModule = el)}
              style={{
                display: dropdowns.studentMasterProfileModule ? "block" : "none",
                overflow: "hidden",
                transition: "height 0.3s ease",
              }}
            >
              <li>
                <a href="student-register.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                  </span>
                  <span>Student Register</span>
                </a>
              </li>
              <li>
                <a href="edit-student-details.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                  </span>
                  <span>Edit Student Details</span>
                </a>
              </li>
              <li>
                <a href="student-profile.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                  </span>
                  <span>Student Profile</span>
                </a>
              </li>
              <li>
                <a href="edit-photo.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                  </span>
                  <span>Edit Photo</span>
                </a>
              </li>
              <li>
                <a href="student-common-report.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                  </span>
                  <span>Student Common Report</span>
                </a>
              </li>
              <li>
                <a href="student-mark-details.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                  </span>
                  <span>Student Mark Details</span>
                </a>
              </li>
            </ul>
          </li>

          {/* Certificates & Documents Module */}
          <li className={`dropdown ${dropdowns.certificatesDocumentsModule ? "dropdown-open" : ""}`}>
            <a
              href="#"
              onClick={(e) => toggleDropdown("certificatesDocumentsModule", e)}
              className="dropdown-toggle"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Icon icon="solar:diploma-outline" className="menu-icon" />
              <span style={{ flex: 1 }}>Certificates</span>
              <Icon
                icon="iconamoon:arrow-down-2-bold"
                className={`dropdown-arrow ${dropdowns.certificatesDocumentsModule ? "rotate" : ""}`}
                style={{ fontSize: '0.8rem', flexShrink: 0 }}
              />
            </a>
            <ul
              className="sidebar-submenu"
              ref={(el) => (submenuRefs.current.certificatesDocumentsModule = el)}
              style={{
                display: dropdowns.certificatesDocumentsModule ? "block" : "none",
                overflow: "hidden",
                transition: "height 0.3s ease",
              }}
            >
              <li>
                <a href="tc-entry.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                  </span>
                  <span>TC Entry</span>
                </a>
              </li>
              <li>
                <a href="transfer-certificate.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                  </span>
                  <span>Transfer Certificate</span>
                </a>
              </li>
              <li>
                <a href="conduct-certificate.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                  </span>
                  <span>Conduct Certificate</span>
                </a>
              </li>
              <li>
                <a href="bonafide-certificate.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                  </span>
                  <span>Bonafide Certificate</span>
                </a>
              </li>
              <li>
                <a href="attendance-certificate.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                  </span>
                  <span>Attendance Certificate</span>
                </a>
              </li>
            </ul>
          </li>

          {/* Fee & Scholarship Module */}
          <li className={`dropdown ${dropdowns.feeScholarshipModule ? "dropdown-open" : ""}`}>
            <a
              href="#"
              onClick={(e) => toggleDropdown("feeScholarshipModule", e)}
              className="dropdown-toggle"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Icon icon="solar:money-bag-outline" className="menu-icon" />
              <span style={{ flex: 1 }}>Fees</span>
              <Icon
                icon="iconamoon:arrow-down-2-bold"
                className={`dropdown-arrow ${dropdowns.feeScholarshipModule ? "rotate" : ""}`}
                style={{ fontSize: '0.8rem', flexShrink: 0 }}
              />
            </a>
            <ul
              className="sidebar-submenu"
              ref={(el) => (submenuRefs.current.feeScholarshipModule = el)}
              style={{
                display: dropdowns.feeScholarshipModule ? "block" : "none",
                overflow: "hidden",
                transition: "height 0.3s ease",
              }}
            >
              <li>
                <a href="fees-estimation-report.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                  </span>
                  <span>Fees Estimation Report</span>
                </a>
              </li>
              <li>
                <a href="scholarship-details.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                  </span>
                  <span>Scholarship Details</span>
                </a>
              </li>
              <li>
                <a href="laptop-distribution-details.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                  </span>
                  <span>Laptop Distribution Details</span>
                </a>
              </li>
            </ul>
          </li>

          <li className="sidebar-menu-group-title">Administrator</li>

          <li className={`dropdown ${dropdowns.officeModule ? "dropdown-open" : ""}`}>
            <a
              href="#"
              onClick={(e) => toggleDropdown("officeModule", e)}
              className="dropdown-toggle"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Icon icon="mdi:bank" className="menu-icon" />
              <span style={{ flex: 1 }}>Office</span>
              <Icon
                icon="iconamoon:arrow-down-2-bold"
                className={`dropdown-arrow ${dropdowns.officeModule ? "rotate" : ""}`}
                style={{ fontSize: '1rem', flexShrink: 0 }}
              />
            </a>
            <ul
              className="sidebar-submenu"
              ref={(el) => (submenuRefs.current.officeModule = el)}
              style={{
                display: dropdowns.officeModule ? "block" : "none",
                overflow: "hidden",
                transition: "height 0.3s ease",
              }}
            >
              {/* General / Master Module */}
              <li className={`dropdown ${dropdowns.generalModule ? "dropdown-open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => toggleDropdown("generalModule", e)}
                  className="dropdown-toggle"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon icon="solar:buildings-2-outline" className="menu-icon" />
                  <span style={{ flex: 1 }}>General</span>
                  <Icon
                    icon="iconamoon:arrow-down-2-bold"
                    className={`dropdown-arrow ${dropdowns.generalModule ? "rotate" : ""}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  />
                </a>
                <ul
                  className="sidebar-submenu"
                  ref={(el) => (submenuRefs.current.generalModule = el)}
                  style={{
                    display: dropdowns.generalModule ? "block" : "none",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <li>
                    <a href="general-data.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>General Data</span>
                    </a>
                  </li>
                  <li>
                    <a href="vendor-details.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Vendor Details & Report</span>
                    </a>
                  </li>
                </ul>
              </li>

              {/* Stock Management Module */}
              <li className={`dropdown ${dropdowns.stockModule ? "dropdown-open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => toggleDropdown("stockModule", e)}
                  className="dropdown-toggle"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon icon="solar:box-outline" className="menu-icon" />
                  <span style={{ flex: 1 }}>Stock</span>
                  <Icon
                    icon="iconamoon:arrow-down-2-bold"
                    className={`dropdown-arrow ${dropdowns.stockModule ? "rotate" : ""}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  />
                </a>
                <ul
                  className="sidebar-submenu"
                  ref={(el) => (submenuRefs.current.stockModule = el)}
                  style={{
                    display: dropdowns.stockModule ? "block" : "none",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <li>
                    <a href="stock-entry.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Stock Entry</span>
                    </a>
                  </li>
                  <li>
                    <a href="all-stock-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>All Stock Report</span>
                    </a>
                  </li>
                  <li>
                    <a href="date-wise-stock-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Date Wise Stock Report</span>
                    </a>
                  </li>
                  <li>
                    <a href="purchase-entry-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>Purchase Entry & Report</span>
                    </a>
                  </li>
                  <li>
                    <a href="asset-entry-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Asset Entry & Report</span>
                    </a>
                  </li>
                </ul>
              </li>

              {/* Letter Management Module */}
              <li className={`dropdown ${dropdowns.letterModule ? "dropdown-open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => toggleDropdown("letterModule", e)}
                  className="dropdown-toggle"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon icon="solar:letter-outline" className="menu-icon" />
                  <span style={{ flex: 1 }}>Letter</span>
                  <Icon
                    icon="iconamoon:arrow-down-2-bold"
                    className={`dropdown-arrow ${dropdowns.letterModule ? "rotate" : ""}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  />
                </a>
                <ul
                  className="sidebar-submenu"
                  ref={(el) => (submenuRefs.current.letterModule = el)}
                  style={{
                    display: dropdowns.letterModule ? "block" : "none",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <li>
                    <a href="send-letter.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Send Letter</span>
                    </a>
                  </li>
                  <li>
                    <a href="receive-letter.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>Receive Letter</span>
                    </a>
                  </li>
                  <li>
                    <a href="letter-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Letter Report</span>
                    </a>
                  </li>
                </ul>
              </li>

              {/* Fee Management Module */}
              <li className={`dropdown ${dropdowns.feeModule ? "dropdown-open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => toggleDropdown("feeModule", e)}
                  className="dropdown-toggle"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon icon="solar:dollar-outline" className="menu-icon" />
                  <span style={{ flex: 1 }}>Fees</span>
                  <Icon
                    icon="iconamoon:arrow-down-2-bold"
                    className={`dropdown-arrow ${dropdowns.feeModule ? "rotate" : ""}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  />
                </a>
                <ul
                  className="sidebar-submenu"
                  ref={(el) => (submenuRefs.current.feeModule = el)}
                  style={{
                    display: dropdowns.feeModule ? "block" : "none",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <li>
                    <a href="fee-master.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>Fee Master</span>
                    </a>
                  </li>
                  <li>
                    <a href="fee-view.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Fee View</span>
                    </a>
                  </li>
                  <li>
                    <a href="challan-entry.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Challan Entry</span>
                    </a>
                  </li>
                  <li>
                    <a href="fee-receipt.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>Fee Receipt</span>
                    </a>
                  </li>
                  <li>
                    <a href="not-pay-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Not Pay Report</span>
                    </a>
                  </li>
                  <li>
                    <a href="fee-type-wise-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>Fee Type Wise Report</span>
                    </a>
                  </li>
                  <li>
                    <a href="class-wise-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Class Wise Report</span>
                    </a>
                  </li>
                  <li>
                    <a href="date-wise-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Date Wise Report</span>
                    </a>
                  </li>
                  <li>
                    <a href="fee-collection.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>Fee Collection</span>
                    </a>
                  </li>
                  <li>
                    <a href="individual-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Individual Report</span>
                    </a>
                  </li>
                  <li>
                    <a href="consolidate-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>Consolidate Report</span>
                    </a>
                  </li>
                  <li>
                    <a href="balance-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Balance Report</span>
                    </a>
                  </li>
                  <li>
                    <a href="canceled-receipt.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Canceled Receipt</span>
                    </a>
                  </li>
                </ul>
              </li>

              {/* Accounts & Finance Module */}
              <li className={`dropdown ${dropdowns.accountsModule ? "dropdown-open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => toggleDropdown("accountsModule", e)}
                  className="dropdown-toggle"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon icon="solar:calculator-outline" className="menu-icon" />
                  <span style={{ flex: 1 }}>Accounts</span>
                  <Icon
                    icon="iconamoon:arrow-down-2-bold"
                    className={`dropdown-arrow ${dropdowns.accountsModule ? "rotate" : ""}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  />
                </a>
                <ul
                  className="sidebar-submenu"
                  ref={(el) => (submenuRefs.current.accountsModule = el)}
                  style={{
                    display: dropdowns.accountsModule ? "block" : "none",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <li>
                    <a href="cash-book.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>Cash Book</span>
                    </a>
                  </li>
                  <li>
                    <a href="income-expenditure-entry.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Income / Expenditure Entry</span>
                    </a>
                  </li>
                  <li>
                    <a href="income-expenditure-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>Income / Expenditure Report</span>
                    </a>
                  </li>
                </ul>
              </li>

              {/* Transaction & Settlement Module */}
              <li className={`dropdown ${dropdowns.transactionModule ? "dropdown-open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => toggleDropdown("transactionModule", e)}
                  className="dropdown-toggle"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon icon="solar:card-transfer-outline" className="menu-icon" />
                  <span style={{ flex: 1 }}>Transaction</span>
                  <Icon
                    icon="iconamoon:arrow-down-2-bold"
                    className={`dropdown-arrow ${dropdowns.transactionModule ? "rotate" : ""}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  />
                </a>
                <ul
                  className="sidebar-submenu"
                  ref={(el) => (submenuRefs.current.transactionModule = el)}
                  style={{
                    display: dropdowns.transactionModule ? "block" : "none",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <li>
                    <a href="transaction-details.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Transaction Details</span>
                    </a>
                  </li>
                  <li>
                    <a href="suspense-settlement.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Suspense / Settlement</span>
                    </a>
                  </li>
                </ul>
              </li>

              {/* Budget Management Module */}
              <li className={`dropdown ${dropdowns.budgetModule ? "dropdown-open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => toggleDropdown("budgetModule", e)}
                  className="dropdown-toggle"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon icon="solar:chart-2-outline" className="menu-icon" />
                  <span style={{ flex: 1 }}>Budget</span>
                  <Icon
                    icon="iconamoon:arrow-down-2-bold"
                    className={`dropdown-arrow ${dropdowns.budgetModule ? "rotate" : ""}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  />
                </a>
                <ul
                  className="sidebar-submenu"
                  ref={(el) => (submenuRefs.current.budgetModule = el)}
                  style={{
                    display: dropdowns.budgetModule ? "block" : "none",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <li>
                    <a href="budget-expense.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>Budget Expense</span>
                    </a>
                  </li>
                  <li>
                    <a href="budget-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Budget Report</span>
                    </a>
                  </li>
                  <li>
                    <a href="budget-expense-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>Budget Expense Report</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
            </li>

          <li className={`dropdown ${dropdowns.payrollModule ? "dropdown-open" : ""}`}>
            <a
              href="#"
              onClick={(e) => toggleDropdown("payrollModule", e)}
              className="dropdown-toggle"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Icon icon="mdi:chart-bar" className="menu-icon" />
              <span style={{ flex: 1 }}>Payroll</span>
              <Icon
                icon="iconamoon:arrow-down-2-bold"
                className={`dropdown-arrow ${dropdowns.payrollModule ? "rotate" : ""}`}
                style={{ fontSize: '1rem', flexShrink: 0 }}
              />
            </a>
            <ul
              className="sidebar-submenu"
              ref={(el) => (submenuRefs.current.payrollModule = el)}
              style={{
                display: dropdowns.payrollModule ? "block" : "none",
                overflow: "hidden",
                transition: "height 0.3s ease",
              }}
            >
              {/* Staff Attendance & Leave Management */}
              <li className={`dropdown ${dropdowns.attendanceModule ? "dropdown-open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => toggleDropdown("attendanceModule", e)}
                  className="dropdown-toggle"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon icon="solar:calendar-mark-outline" className="menu-icon" />
                  <span style={{ flex: 1 }}>Staff</span>
                  <Icon
                    icon="iconamoon:arrow-down-2-bold"
                    className={`dropdown-arrow ${dropdowns.attendanceModule ? "rotate" : ""}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  />
                </a>
                <ul
                  className="sidebar-submenu"
                  ref={(el) => (submenuRefs.current.attendanceModule = el)}
                  style={{
                    display: dropdowns.attendanceModule ? "block" : "none",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <li>
                    <a href="staff-attendance.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Staff Attendance</span>
                    </a>
                  </li>
                  <li>
                    <a href="leave-entry.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Leave Entry</span>
                    </a>
                  </li>
                  <li>
                    <a href="permission.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>Permission</span>
                    </a>
                  </li>
                  <li>
                    <a href="daily-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Daily Report</span>
                    </a>
                  </li>
                  <li>
                    <a href="monthly-list.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>Monthly List</span>
                    </a>
                  </li>
                  <li>
                    <a href="individual-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Individual Report</span>
                    </a>
                  </li>
                  <li>
                    <a href="leave-register.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Leave Register</span>
                    </a>
                  </li>
                </ul>
              </li>

              {/* Payroll & Salary Management */}
              <li className={`dropdown ${dropdowns.salaryModule ? "dropdown-open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => toggleDropdown("salaryModule", e)}
                  className="dropdown-toggle"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon icon="solar:wallet-money-outline" className="menu-icon" />
                  <span style={{ flex: 1 }}>Salary</span>
                  <Icon
                    icon="iconamoon:arrow-down-2-bold"
                    className={`dropdown-arrow ${dropdowns.salaryModule ? "rotate" : ""}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  />
                </a>
                <ul
                  className="sidebar-submenu"
                  ref={(el) => (submenuRefs.current.salaryModule = el)}
                  style={{
                    display: dropdowns.salaryModule ? "block" : "none",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <li>
                    <a href="payroll-staff-details.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>Payroll (Staff Details)</span>
                    </a>
                  </li>
                  <li>
                    <a href="staff-salary-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Staff Salary & Report</span>
                    </a>
                  </li>
                  <li>
                    <a href="bank-statement.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>Bank Statement</span>
                    </a>
                  </li>
                  <li>
                    <a href="cash-disburse.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Cash Disburse</span>
                    </a>
                  </li>
                  <li>
                    <a href="pay-certificate.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Pay Certificate</span>
                    </a>
                  </li>
                  <li>
                    <a href="pay-bill-details.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>Pay Bill Details</span>
                    </a>
                  </li>
                  <li>
                    <a href="abstract.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Abstract</span>
                    </a>
                  </li>
                  <li>
                    <a href="bonus-pay-bill.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>Bonus Pay Bill</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </li>

          <li className={`dropdown ${dropdowns.hostelModule ? "dropdown-open" : ""}`}>
            <a
              href="#"
              onClick={(e) => toggleDropdown("hostelModule", e)}
              className="dropdown-toggle"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Icon icon="mdi:office-building" className="menu-icon" />
              <span style={{ flex: 1 }}>Hostel</span>
              <Icon
                icon="iconamoon:arrow-down-2-bold"
                className={`dropdown-arrow ${dropdowns.hostelModule ? "rotate" : ""}`}
                style={{ fontSize: '1rem', flexShrink: 0 }}
              />
            </a>
            <ul
              className="sidebar-submenu"
              ref={(el) => (submenuRefs.current.hostelModule = el)}
              style={{
                display: dropdowns.hostelModule ? "block" : "none",
                overflow: "hidden",
                transition: "height 0.3s ease",
              }}
            >
              {/* Hostel Student Management */}
              <li className={`dropdown ${dropdowns.hostelStudentModule ? "dropdown-open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => toggleDropdown("hostelStudentModule", e)}
                  className="dropdown-toggle"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon icon="solar:user-id-outline" className="menu-icon" />
                  <span style={{ flex: 1 }}>Student</span>
                  <Icon
                    icon="iconamoon:arrow-down-2-bold"
                    className={`dropdown-arrow ${dropdowns.hostelStudentModule ? "rotate" : ""}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  />
                </a>
                <ul
                  className="sidebar-submenu"
                  ref={(el) => (submenuRefs.current.hostelStudentModule = el)}
                  style={{
                    display: dropdowns.hostelStudentModule ? "block" : "none",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <li>
                    <a href="edit-hosteller.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Edit Hosteller</span>
                    </a>
                  </li>
                  <li>
                    <a href="hostel-student-profile.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Hostel Student Profile</span>
                    </a>
                  </li>
                  <li>
                    <a href="student-leave-days-entry.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>Student Leave Days Entry</span>
                    </a>
                  </li>
                  <li>
                    <a href="vacate-student-list.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Vacate Student List</span>
                    </a>
                  </li>
                </ul>
              </li>

              {/* Hostel Fee & Billing */}
              <li className={`dropdown ${dropdowns.hostelFeeModule ? "dropdown-open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => toggleDropdown("hostelFeeModule", e)}
                  className="dropdown-toggle"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon icon="solar:dollar-minimalistic-outline" className="menu-icon" />
                  <span style={{ flex: 1 }}>Fee & Billing</span>
                  <Icon
                    icon="iconamoon:arrow-down-2-bold"
                    className={`dropdown-arrow ${dropdowns.hostelFeeModule ? "rotate" : ""}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  />
                </a>
                <ul
                  className="sidebar-submenu"
                  ref={(el) => (submenuRefs.current.hostelFeeModule = el)}
                  style={{
                    display: dropdowns.hostelFeeModule ? "block" : "none",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <li>
                    <a href="hostel-fee.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>Hostel Fee</span>
                    </a>
                  </li>
                  <li>
                    <a href="mess-bill-generation.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Mess Bill Generation</span>
                    </a>
                  </li>
                  <li>
                    <a href="mess-fee-collection.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Mess Fee Collection</span>
                    </a>
                  </li>
                  <li>
                    <a href="fee-collection-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>Fee Collection Report</span>
                    </a>
                  </li>
                  <li>
                    <a href="due-refund-list.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Due and Refund List</span>
                    </a>
                  </li>
                </ul>
              </li>

              {/* Provision / Mess Management */}
              <li className={`dropdown ${dropdowns.hostelProvisionModule ? "dropdown-open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => toggleDropdown("hostelProvisionModule", e)}
                  className="dropdown-toggle"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon icon="solar:chef-hat-outline" className="menu-icon" />
                  <span style={{ flex: 1 }}>Mess</span>
                  <Icon
                    icon="iconamoon:arrow-down-2-bold"
                    className={`dropdown-arrow ${dropdowns.hostelProvisionModule ? "rotate" : ""}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  />
                </a>
                <ul
                  className="sidebar-submenu"
                  ref={(el) => (submenuRefs.current.hostelProvisionModule = el)}
                  style={{
                    display: dropdowns.hostelProvisionModule ? "block" : "none",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <li>
                    <a href="provision-list.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>Provision List</span>
                    </a>
                  </li>
                  <li>
                    <a href="provision-purchase-entry.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Provision Purchase Entry</span>
                    </a>
                  </li>
                  <li>
                    <a href="provision-balance-entry.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Provision Balance Entry</span>
                    </a>
                  </li>
                  <li>
                    <a href="provision-generate-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>Provision Generate and Report</span>
                    </a>
                  </li>
                </ul>
              </li>

              {/* Hostel Accounts & Finance */}
              <li className={`dropdown ${dropdowns.hostelAccountsModule ? "dropdown-open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => toggleDropdown("hostelAccountsModule", e)}
                  className="dropdown-toggle"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon icon="solar:calculator-minimalistic-outline" className="menu-icon" />
                  <span style={{ flex: 1 }}>Accounts</span>
                  <Icon
                    icon="iconamoon:arrow-down-2-bold"
                    className={`dropdown-arrow ${dropdowns.hostelAccountsModule ? "rotate" : ""}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  />
                </a>
                <ul
                  className="sidebar-submenu"
                  ref={(el) => (submenuRefs.current.hostelAccountsModule = el)}
                  style={{
                    display: dropdowns.hostelAccountsModule ? "block" : "none",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <li>
                    <a href="hostel-income-entry.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Hostel Income Entry</span>
                    </a>
                  </li>
                  <li>
                    <a href="income-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>Income Report</span>
                    </a>
                  </li>
                  <li>
                    <a href="hostel-expense-entry.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Hostel Expense Entry</span>
                    </a>
                  </li>
                  <li>
                    <a href="expense-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Expense Report</span>
                    </a>
                  </li>
                  <li>
                    <a href="personal-ledger.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>Personal Ledger</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </li>

          <li className={`dropdown ${dropdowns.transportModule ? "dropdown-open" : ""}`}>
            <a
              href="#"
              onClick={(e) => toggleDropdown("transportModule", e)}
              className="dropdown-toggle"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Icon icon="mdi:bus" className="menu-icon" />
              <span style={{ flex: 1 }}>Transport</span>
              <Icon
                icon="iconamoon:arrow-down-2-bold"
                className={`dropdown-arrow ${dropdowns.transportModule ? "rotate" : ""}`}
                style={{ fontSize: '1rem', flexShrink: 0 }}
              />
            </a>
            <ul
              className="sidebar-submenu"
              ref={(el) => (submenuRefs.current.transportModule = el)}
              style={{
                display: dropdowns.transportModule ? "block" : "none",
                overflow: "hidden",
                transition: "height 0.3s ease",
              }}
            >
              {/* Vehicle Management */}
              <li className={`dropdown ${dropdowns.vehicleModule ? "dropdown-open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => toggleDropdown("vehicleModule", e)}
                  className="dropdown-toggle"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon icon="solar:bus-outline" className="menu-icon" />
                  <span style={{ flex: 1 }}>Vehicle</span>
                  <Icon
                    icon="iconamoon:arrow-down-2-bold"
                    className={`dropdown-arrow ${dropdowns.vehicleModule ? "rotate" : ""}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  />
                </a>
                <ul
                  className="sidebar-submenu"
                  ref={(el) => (submenuRefs.current.vehicleModule = el)}
                  style={{
                    display: dropdowns.vehicleModule ? "block" : "none",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <li>
                    <a href="vehicle-details.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Vehicle Details</span>
                    </a>
                  </li>
                  <li>
                    <a href="vehicle-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>Vehicle Report</span>
                    </a>
                  </li>
                </ul>
              </li>

              {/* Transport Fee & Expense */}
              <li className={`dropdown ${dropdowns.transportFeeModule ? "dropdown-open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => toggleDropdown("transportFeeModule", e)}
                  className="dropdown-toggle"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon icon="solar:dollar-minimalistic-outline" className="menu-icon" />
                  <span style={{ flex: 1 }}>Accounts</span>
                  <Icon
                    icon="iconamoon:arrow-down-2-bold"
                    className={`dropdown-arrow ${dropdowns.transportFeeModule ? "rotate" : ""}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  />
                </a>
                <ul
                  className="sidebar-submenu"
                  ref={(el) => (submenuRefs.current.transportFeeModule = el)}
                  style={{
                    display: dropdowns.transportFeeModule ? "block" : "none",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <li>
                    <a href="fee-structure.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Fee Structure</span>
                    </a>
                  </li>
                  <li>
                    <a href="vehicle-expense.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Vehicle Expense</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </li>

          <li className="sidebar-menu-group-title">Academic</li>

          {/* Academic Planning Module */}
              <li className={`dropdown ${dropdowns.academicPlanningModule ? "dropdown-open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => toggleDropdown("academicPlanningModule", e)}
                  className="dropdown-toggle"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon icon="solar:calendar-outline" className="menu-icon" />
                  <span style={{ flex: 1 }}>Planning</span>
                  <Icon
                    icon="iconamoon:arrow-down-2-bold"
                    className={`dropdown-arrow ${dropdowns.academicPlanningModule ? "rotate" : ""}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  />
                </a>
                <ul
                  className="sidebar-submenu"
                  ref={(el) => (submenuRefs.current.academicPlanningModule = el)}
                  style={{
                    display: dropdowns.academicPlanningModule ? "block" : "none",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <li>
                    <a href="academic-calendar.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>Academic Calendar</span>
                    </a>
                  </li>
                </ul>
              </li>

              {/* Attendance Management Module */}
              <li className={`dropdown ${dropdowns.attendanceManagementModule ? "dropdown-open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => toggleDropdown("attendanceManagementModule", e)}
                  className="dropdown-toggle"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon icon="solar:clipboard-check-outline" className="menu-icon" />
                  <span style={{ flex: 1 }}>Attendance</span>
                  <Icon
                    icon="iconamoon:arrow-down-2-bold"
                    className={`dropdown-arrow ${dropdowns.attendanceManagementModule ? "rotate" : ""}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  />
                </a>
                <ul
                  className="sidebar-submenu"
                  ref={(el) => (submenuRefs.current.attendanceManagementModule = el)}
                  style={{
                    display: dropdowns.attendanceManagementModule ? "block" : "none",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <li>
                    <a href="daily-attendance.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Daily Attendance</span>
                    </a>
                  </li>
                  <li>
                    <a href="daily-attendance-export.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>Daily Attendance Date Range Export</span>
                    </a>
                  </li>
                  <li>
                    <a href="attendance-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Attendance Report</span>
                    </a>
                  </li>
                  <li>
                    <a href="late-attendance.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Late Attendance</span>
                    </a>
                  </li>
                  <li>
                    <a href="spell-attendance.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>Spell Attendance</span>
                    </a>
                  </li>
                  <li>
                    <a href="spell-attendance-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Spell Attendance Report</span>
                    </a>
                  </li>
                </ul>
              </li>

              {/* Internal Assessment Module */}
              <li className={`dropdown ${dropdowns.internalAssessmentModule ? "dropdown-open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => toggleDropdown("internalAssessmentModule", e)}
                  className="dropdown-toggle"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon icon="solar:document-add-outline" className="menu-icon" />
                  <span style={{ flex: 1 }}>Assessment</span>
                  <Icon
                    icon="iconamoon:arrow-down-2-bold"
                    className={`dropdown-arrow ${dropdowns.internalAssessmentModule ? "rotate" : ""}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  />
                </a>
                <ul
                  className="sidebar-submenu"
                  ref={(el) => (submenuRefs.current.internalAssessmentModule = el)}
                  style={{
                    display: dropdowns.internalAssessmentModule ? "block" : "none",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <li>
                    <a href="assignment-mark-entry.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>Assignment Mark Entry</span>
                    </a>
                  </li>
                  <li>
                    <a href="assignment-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Assignment Report</span>
                    </a>
                  </li>
                  <li>
                    <a href="unit-test-mark-entry.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Unit Test Mark Entry</span>
                    </a>
                  </li>
                  <li>
                    <a href="unit-test-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>Unit Test Report</span>
                    </a>
                  </li>
                  <li>
                    <a href="external-mark-entry.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>External Mark Entry</span>
                    </a>
                  </li>
                  <li>
                    <a href="progress-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>Progress Report</span>
                    </a>
                  </li>
                </ul>
              </li>

              {/* Student Placement Module */}
              <li className={`dropdown ${dropdowns.studentPlacementModule ? "dropdown-open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => toggleDropdown("studentPlacementModule", e)}
                  className="dropdown-toggle"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon icon="solar:case-round-outline" className="menu-icon" />
                  <span style={{ flex: 1 }}>Placement</span>
                  <Icon
                    icon="iconamoon:arrow-down-2-bold"
                    className={`dropdown-arrow ${dropdowns.studentPlacementModule ? "rotate" : ""}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  />
                </a>
                <ul
                  className="sidebar-submenu"
                  ref={(el) => (submenuRefs.current.studentPlacementModule = el)}
                  style={{
                    display: dropdowns.studentPlacementModule ? "block" : "none",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <li>
                    <a href="placement-details.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Placement Details</span>
                    </a>
                  </li>
                </ul>
              </li>
             

             <li className="sidebar-menu-group-title">Exam Management</li>

          {/* Data Submission Module */}
          <li className={`dropdown ${dropdowns.dataSubmissionModule ? "dropdown-open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => toggleDropdown("dataSubmissionModule", e)}
                  className="dropdown-toggle"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon icon="solar:database-outline" className="menu-icon" />
                  <span style={{ flex: 1 }}>Data Entry</span>
                  <Icon
                    icon="iconamoon:arrow-down-2-bold"
                    className={`dropdown-arrow ${dropdowns.dataSubmissionModule ? "rotate" : ""}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  />
                </a>
                <ul
                  className="sidebar-submenu"
                  ref={(el) => (submenuRefs.current.dataSubmissionModule = el)}
                  style={{
                    display: dropdowns.dataSubmissionModule ? "block" : "none",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <li>
                    <a href="ExamSettings.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Exam Settings</span>
                    </a>
                  </li>
                  <li>
                    <a href="CourseDetails.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>Course Details</span>
                    </a>
                  </li>
                  <li>
                    <a href="hall-details.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Hall Details</span>
                    </a>
                  </li>
                  <li>
                    <a href="time-table.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>Time Table</span>
                    </a>
                  </li>
                  <li>
                    <a href="edit-nominal.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Edit Nominal</span>
                    </a>
                  </li>
                  <li>
                    <a href="exam-fee.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Exam Fee</span>
                    </a>
                  </li>
                  <li>
                    <a href="nominal-roll.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>Nominal Roll</span>
                    </a>
                  </li>
                  <li>
                    <a href="qp-requirement.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>QP Requirement</span>
                    </a>
                  </li>
                  <li>
                    <a href="strength-list.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>Strength List</span>
                    </a>
                  </li>
                  <li>
                    <a href="normal-strength-list.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Normal Strength List</span>
                    </a>
                  </li>
                  <li>
                    <a href="simple-strength-list.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Simple Strength List</span>
                    </a>
                  </li>
                  <li>
                    <a href="detail-strength-list.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>Detail Strength List</span>
                    </a>
                  </li>
                  <li>
                    <a href="check-list.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Check List</span>
                    </a>
                  </li>
                  <li>
                    <a href="college-strength.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>College Strength</span>
                    </a>
                  </li>
                </ul>
              </li>

              {/* Practical Examination Module */}
              <li className={`dropdown ${dropdowns.practicalExaminationModule ? "dropdown-open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => toggleDropdown("practicalExaminationModule", e)}
                  className="dropdown-toggle"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon icon="solar:test-tube-outline" className="menu-icon" />
                  <span style={{ flex: 1 }}>Practical Exam</span>
                  <Icon
                    icon="iconamoon:arrow-down-2-bold"
                    className={`dropdown-arrow ${dropdowns.practicalExaminationModule ? "rotate" : ""}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  />
                </a>
                <ul
                  className="sidebar-submenu"
                  ref={(el) => (submenuRefs.current.practicalExaminationModule = el)}
                  style={{
                    display: dropdowns.practicalExaminationModule ? "block" : "none",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <li>
                    <a href="practical-panel.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Practical Panel</span>
                    </a>
                  </li>
                  <li>
                    <a href="practical-time-table.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Practical Time Table</span>
                    </a>
                  </li>
                  <li>
                    <a href="practical-name-list.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>Practical Name List</span>
                    </a>
                  </li>
                  <li>
                    <a href="form-p8.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Form P-8</span>
                    </a>
                  </li>
                  <li>
                    <a href="form-p5.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>Form P-5</span>
                    </a>
                  </li>
                  <li>
                    <a href="practical-absentees-entry.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Absentees Entry</span>
                    </a>
                  </li>
                  <li>
                    <a href="practical-remuneration.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Practical Remuneration</span>
                    </a>
                  </li>
                  <li>
                    <a href="practical-attendance.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>Practical Attendance</span>
                    </a>
                  </li>
                </ul>
              </li>

              {/* Exam Process Module */}
              <li className={`dropdown ${dropdowns.examProcessModule ? "dropdown-open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => toggleDropdown("examProcessModule", e)}
                  className="dropdown-toggle"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon icon="solar:settings-outline" className="menu-icon" />
                  <span style={{ flex: 1 }}>Exam Process</span>
                  <Icon
                    icon="iconamoon:arrow-down-2-bold"
                    className={`dropdown-arrow ${dropdowns.examProcessModule ? "rotate" : ""}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  />
                </a>
                <ul
                  className="sidebar-submenu"
                  ref={(el) => (submenuRefs.current.examProcessModule = el)}
                  style={{
                    display: dropdowns.examProcessModule ? "block" : "none",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <li>
                    <a href="exam-generation.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Exam Generation</span>
                    </a>
                  </li>
                  <li>
                    <a href="hall-chart.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>Hall Chart</span>
                    </a>
                  </li>
                  <li>
                    <a href="seat-allotment.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Seat Allotment</span>
                    </a>
                  </li>
                  <li>
                    <a href="day-war-statement.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Day War Statement</span>
                    </a>
                  </li>
                  <li>
                    <a href="digital-numbering.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>Digital Numbering</span>
                    </a>
                  </li>
                  <li>
                    <a href="theory-name-list.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Theory Name List</span>
                    </a>
                  </li>
                  <li>
                    <a href="qp-distribution.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>QP Distribution</span>
                    </a>
                  </li>
                  <li>
                    <a href="edit-exam-process.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Edit Exam Process</span>
                    </a>
                  </li>
                  <li>
                    <a href="duplicate-finder.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Duplicate Finder</span>
                    </a>
                  </li>
                </ul>
              </li>

              {/* Exam Forms Module */}
              <li className={`dropdown ${dropdowns.examFormsModule ? "dropdown-open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => toggleDropdown("examFormsModule", e)}
                  className="dropdown-toggle"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon icon="solar:document-add-outline" className="menu-icon" />
                  <span style={{ flex: 1 }}>Exam Forms</span>
                  <Icon
                    icon="iconamoon:arrow-down-2-bold"
                    className={`dropdown-arrow ${dropdowns.examFormsModule ? "rotate" : ""}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  />
                </a>
                <ul
                  className="sidebar-submenu"
                  ref={(el) => (submenuRefs.current.examFormsModule = el)}
                  style={{
                    display: dropdowns.examFormsModule ? "block" : "none",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <li>
                    <a href="exam-absentees-entry.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>Absentees Entry</span>
                    </a>
                  </li>
                  <li>
                    <a href="ex2-present.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Ex2 Present</span>
                    </a>
                  </li>
                  <li>
                    <a href="ex2-absent.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>Ex2 Absent</span>
                    </a>
                  </li>
                  <li>
                    <a href="form-ex1.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Form Ex1</span>
                    </a>
                  </li>
                  <li>
                    <a href="form-ex6.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Form Ex6</span>
                    </a>
                  </li>
                  <li>
                    <a href="qpc-report.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>QPC Report</span>
                    </a>
                  </li>
                  <li>
                    <a href="export-absentees.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Export Absentees</span>
                    </a>
                  </li>
                  <li>
                    <a href="consolidated-absentees.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>Consolidated Absentees</span>
                    </a>
                  </li>
                  <li>
                    <a href="export-conattendance.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Export ConAttendance</span>
                    </a>
                  </li>
                </ul>
              </li>

              {/* Staff Duty Assign Module */}
              <li className={`dropdown ${dropdowns.staffDutyAssignModule ? "dropdown-open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => toggleDropdown("staffDutyAssignModule", e)}
                  className="dropdown-toggle"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon icon="solar:user-check-outline" className="menu-icon" />
                  <span style={{ flex: 1 }}>Staff Duty</span>
                  <Icon
                    icon="iconamoon:arrow-down-2-bold"
                    className={`dropdown-arrow ${dropdowns.staffDutyAssignModule ? "rotate" : ""}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  />
                </a>
                <ul
                  className="sidebar-submenu"
                  ref={(el) => (submenuRefs.current.staffDutyAssignModule = el)}
                  style={{
                    display: dropdowns.staffDutyAssignModule ? "block" : "none",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <li>
                    <a href="staff-details.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Staff Details</span>
                    </a>
                  </li>
                  <li>
                    <a href="assign-duty.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>Assign Duty</span>
                    </a>
                  </li>
                  <li>
                    <a href="date-wise-duty-list.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Date Wise Duty List</span>
                    </a>
                  </li>
                  <li>
                    <a href="consolidate-duty.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>Consolidate Duty</span>
                    </a>
                  </li>
                  <li>
                    <a href="staff-attendance-certificate.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Staff Attendance Certificate</span>
                    </a>
                  </li>
                  <li>
                    <a href="staff-annexure.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Staff Annexure</span>
                    </a>
                  </li>
                  <li>
                    <a href="staff-session.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>Staff Session</span>
                    </a>
                  </li>
                </ul>
              </li>

              {/* Remuneration Module */}
              <li className={`dropdown ${dropdowns.remunerationModule ? "dropdown-open" : ""}`}>
                <a
                  href="#"
                  onClick={(e) => toggleDropdown("remunerationModule", e)}
                  className="dropdown-toggle"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Icon icon="solar:wallet-money-outline" className="menu-icon" />
                  <span style={{ flex: 1 }}>Remuneration</span>
                  <Icon
                    icon="iconamoon:arrow-down-2-bold"
                    className={`dropdown-arrow ${dropdowns.remunerationModule ? "rotate" : ""}`}
                    style={{ fontSize: '0.8rem', flexShrink: 0 }}
                  />
                </a>
                <ul
                  className="sidebar-submenu"
                  ref={(el) => (submenuRefs.current.remunerationModule = el)}
                  style={{
                    display: dropdowns.remunerationModule ? "block" : "none",
                    overflow: "hidden",
                    transition: "height 0.3s ease",
                  }}
                >
                  <li>
                    <a href="annexure-i.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Annexure I</span>
                    </a>
                  </li>
                  <li>
                    <a href="annexure-ii.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                      </span>
                      <span>Annexure II</span>
                    </a>
                  </li>
                  <li>
                    <a href="annexure-iii-a.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                      </span>
                      <span>Annexure III-A</span>
                    </a>
                  </li>
                  <li>
                    <a href="annexure-iii-b.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                      </span>
                      <span>Annexure III-B</span>
                    </a>
                  </li>
                  <li>
                    <a href="tada.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                      </span>
                      <span>TADA</span>
                    </a>
                  </li>
                  <li>
                    <a href="acquittance.html">
                      <span className="submenu-icon-wrapper">
                        <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                      </span>
                      <span>Acquittance</span>
                    </a>
                  </li>
                </ul>
              </li>
              
          <li className="sidebar-menu-group-title">Library Management</li>

          <li>
            <a href="">
              <Icon icon="solar:library-outline" className="menu-icon" />
              <span>Library Master</span>
            </a>
          </li>

          {/* Book Management Module */}
          <li className={`dropdown ${dropdowns.bookManagementModule ? "dropdown-open" : ""}`}>
            <a
              href="#"
              onClick={(e) => toggleDropdown("bookManagementModule", e)}
              className="dropdown-toggle"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Icon icon="solar:book-outline" className="menu-icon" />
              <span style={{ flex: 1 }}>Management</span>
              <Icon
                icon="iconamoon:arrow-down-2-bold"
                className={`dropdown-arrow ${dropdowns.bookManagementModule ? "rotate" : ""}`}
                style={{ fontSize: '0.8rem', flexShrink: 0 }}
              />
            </a>
            <ul
              className="sidebar-submenu"
              ref={(el) => (submenuRefs.current.bookManagementModule = el)}
              style={{
                display: dropdowns.bookManagementModule ? "block" : "none",
                overflow: "hidden",
                transition: "height 0.3s ease",
              }}
            >
              <li>
                <a href="add-book.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                  </span>
                  <span>Book Management</span>
                </a>
              </li>
              <li>
                <a href="book-position.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                  </span>
                  <span>Book Position</span>
                </a>
              </li>
              <li>
                <a href="book-availability.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                  </span>
                  <span>Book Availability</span>
                </a>
              </li>
              <li>
                <a href="missing-books.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                  </span>
                  <span>Missing Books</span>
                </a>
              </li>
              <li>
                <a href="stock-verification.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                  </span>
                  <span>Stock Verification</span>
                </a>
              </li>
            </ul>
          </li>

          {/* Borrower Management Module */}
          <li className={`dropdown ${dropdowns.borrowerManagementModule ? "dropdown-open" : ""}`}>
            <a
              href="#"
              onClick={(e) => toggleDropdown("borrowerManagementModule", e)}
              className="dropdown-toggle"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Icon icon="solar:user-id-outline" className="menu-icon" />
              <span style={{ flex: 1 }}>Borrower</span>
              <Icon
                icon="iconamoon:arrow-down-2-bold"
                className={`dropdown-arrow ${dropdowns.borrowerManagementModule ? "rotate" : ""}`}
                style={{ fontSize: '0.8rem', flexShrink: 0 }}
              />
            </a>
            <ul
              className="sidebar-submenu"
              ref={(el) => (submenuRefs.current.borrowerManagementModule = el)}
              style={{
                display: dropdowns.borrowerManagementModule ? "block" : "none",
                overflow: "hidden",
                transition: "height 0.3s ease",
              }}
            >
              <li>
                <a href="add-borrower.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                  </span>
                  <span>Add Borrower</span>
                </a>
              </li>
              <li>
                <a href="modify-borrower-detail.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                  </span>
                  <span>Modify Borrower Detail</span>
                </a>
              </li>
              <li>
                <a href="view-borrower-history.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                  </span>
                  <span>View Borrower History</span>
                </a>
              </li>
              <li>
                <a href="current-borrower.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                  </span>
                  <span>Current Borrower</span>
                </a>
              </li>
              <li>
                <a href="current-borrower-report.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                  </span>
                  <span>Current Borrower Report</span>
                </a>
              </li>
              <li>
                <a href="student-entry-detail.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                  </span>
                  <span>Student Entry Detail</span>
                </a>
              </li>
            </ul>
          </li>

          {/* Book Circulation Module */}
          <li className={`dropdown ${dropdowns.bookCirculationModule ? "dropdown-open" : ""}`}>
            <a
              href="#"
              onClick={(e) => toggleDropdown("bookCirculationModule", e)}
              className="dropdown-toggle"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Icon icon="solar:refresh-outline" className="menu-icon" />
              <span style={{ flex: 1 }}>Circulation</span>
              <Icon
                icon="iconamoon:arrow-down-2-bold"
                className={`dropdown-arrow ${dropdowns.bookCirculationModule ? "rotate" : ""}`}
                style={{ fontSize: '0.8rem', flexShrink: 0 }}
              />
            </a>
            <ul
              className="sidebar-submenu"
              ref={(el) => (submenuRefs.current.bookCirculationModule = el)}
              style={{
                display: dropdowns.bookCirculationModule ? "block" : "none",
                overflow: "hidden",
                transition: "height 0.3s ease",
              }}
            >
              <li>
                <a href="book-issue.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                  </span>
                  <span>Book Issue</span>
                </a>
              </li>
              <li>
                <a href="book-issue-report.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                  </span>
                  <span>Book Issue Report</span>
                </a>
              </li>
              <li>
                <a href="book-return.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                  </span>
                  <span>Book Return</span>
                </a>
              </li>
              <li>
                <a href="book-renewal.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                  </span>
                  <span>Book Renewal</span>
                </a>
              </li>
              <li>
                <a href="due-date-exit-report.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                  </span>
                  <span>Due Date Exit Report</span>
                </a>
              </li>
              <li>
                <a href="no-due-certificate.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                  </span>
                  <span>No Due Certificate</span>
                </a>
              </li>
            </ul>
          </li>

          {/* Fine Management Module */}
          <li className={`dropdown ${dropdowns.fineManagementModule ? "dropdown-open" : ""}`}>
            <a
              href="#"
              onClick={(e) => toggleDropdown("fineManagementModule", e)}
              className="dropdown-toggle"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Icon icon="solar:money-bag-outline" className="menu-icon" />
              <span style={{ flex: 1 }}>Fine</span>
              <Icon
                icon="iconamoon:arrow-down-2-bold"
                className={`dropdown-arrow ${dropdowns.fineManagementModule ? "rotate" : ""}`}
                style={{ fontSize: '0.8rem', flexShrink: 0 }}
              />
            </a>
            <ul
              className="sidebar-submenu"
              ref={(el) => (submenuRefs.current.fineManagementModule = el)}
              style={{
                display: dropdowns.fineManagementModule ? "block" : "none",
                overflow: "hidden",
                transition: "height 0.3s ease",
              }}
            >
              <li>
                <a href="fine-details.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                  </span>
                  <span>Fine Details</span>
                </a>
              </li>
              <li>
                <a href="fine-report.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                  </span>
                  <span>Fine Report</span>
                </a>
              </li>
            </ul>
          </li>

          {/* Reports & Tracking Module */}
          <li className={`dropdown ${dropdowns.reportsTrackingModule ? "dropdown-open" : ""}`}>
            <a
              href="#"
              onClick={(e) => toggleDropdown("reportsTrackingModule", e)}
              className="dropdown-toggle"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Icon icon="solar:document-text-outline" className="menu-icon" />
              <span style={{ flex: 1 }}>Reports</span>
              <Icon
                icon="iconamoon:arrow-down-2-bold"
                className={`dropdown-arrow ${dropdowns.reportsTrackingModule ? "rotate" : ""}`}
                style={{ fontSize: '0.8rem', flexShrink: 0 }}
              />
            </a>
            <ul
              className="sidebar-submenu"
              ref={(el) => (submenuRefs.current.reportsTrackingModule = el)}
              style={{
                display: dropdowns.reportsTrackingModule ? "block" : "none",
                overflow: "hidden",
                transition: "height 0.3s ease",
              }}
            >
              <li>
                <a href="book-history.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                  </span>
                  <span>Book History</span>
                </a>
              </li>
            </ul>
          </li>

          {/* Barcode & Identification Module */}
          <li className={`dropdown ${dropdowns.barcodeIdentificationModule ? "dropdown-open" : ""}`}>
            <a
              href="#"
              onClick={(e) => toggleDropdown("barcodeIdentificationModule", e)}
              className="dropdown-toggle"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Icon icon="solar:qr-code-outline" className="menu-icon" />
              <span style={{ flex: 1 }}>Barcode</span>
              <Icon
                icon="iconamoon:arrow-down-2-bold"
                className={`dropdown-arrow ${dropdowns.barcodeIdentificationModule ? "rotate" : ""}`}
                style={{ fontSize: '0.8rem', flexShrink: 0 }}
              />
            </a>
            <ul
              className="sidebar-submenu"
              ref={(el) => (submenuRefs.current.barcodeIdentificationModule = el)}
              style={{
                display: dropdowns.barcodeIdentificationModule ? "block" : "none",
                overflow: "hidden",
                transition: "height 0.3s ease",
              }}
            >
              <li>
                <a href="bar-code-generation-book.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                  </span>
                  <span>Bar Code Generation for Book</span>
                </a>
              </li>
              <li>
                <a href="bar-code-generation-student.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                  </span>
                  <span>Bar Code Generation for Student</span>
                </a>
              </li>
            </ul>
          </li>

          <li className="sidebar-menu-group-title">SMS</li>

          {/* SMS Management Module */}
          <li className={`dropdown ${dropdowns.smsManagementModule ? "dropdown-open" : ""}`}>
            <a
              href="#"
              onClick={(e) => toggleDropdown("smsManagementModule", e)}
              className="dropdown-toggle"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Icon icon="solar:chat-round-dots-outline" className="menu-icon" />
              <span style={{ flex: 1 }}>Send</span>
              <Icon
                icon="iconamoon:arrow-down-2-bold"
                className={`dropdown-arrow ${dropdowns.smsManagementModule ? "rotate" : ""}`}
                style={{ fontSize: '0.8rem', flexShrink: 0 }}
              />
            </a>
            <ul
              className="sidebar-submenu"
              ref={(el) => (submenuRefs.current.smsManagementModule = el)}
              style={{
                display: dropdowns.smsManagementModule ? "block" : "none",
                overflow: "hidden",
                transition: "height 0.3s ease",
              }}
            >
              <li>
                <a href="send-sms.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                  </span>
                  <span>Send SMS</span>
                </a>
              </li>
              <li>
                <a href="group-sms.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                  </span>
                  <span>Group SMS</span>
                </a>
              </li>
              <li>
                <a href="daily-attendance-sms.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                  </span>
                  <span>Daily Attendance SMS</span>
                </a>
              </li>
              <li>
                <a href="late-attendance-sms.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-warning-600" />
                  </span>
                  <span>Late Attendance SMS</span>
                </a>
              </li>
            </ul>
          </li>

          {/* E-Diary & Communication Module */}
          <li className={`dropdown ${dropdowns.eDiaryModule ? "dropdown-open" : ""}`}>
            <a
              href="#"
              onClick={(e) => toggleDropdown("eDiaryModule", e)}
              className="dropdown-toggle"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Icon icon="solar:notebook-outline" className="menu-icon" />
              <span style={{ flex: 1 }}>E-Diary</span>
              <Icon
                icon="iconamoon:arrow-down-2-bold"
                className={`dropdown-arrow ${dropdowns.eDiaryModule ? "rotate" : ""}`}
                style={{ fontSize: '0.8rem', flexShrink: 0 }}
              />
            </a>
            <ul
              className="sidebar-submenu"
              ref={(el) => (submenuRefs.current.eDiaryModule = el)}
              style={{
                display: dropdowns.eDiaryModule ? "block" : "none",
                overflow: "hidden",
                transition: "height 0.3s ease",
              }}
            >
              <li>
                <a href="e-diary.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-info-600" />
                  </span>
                  <span>E-Diary</span>
                </a>
              </li>
              <li>
                <a href="custom-contact-entry.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-danger-600" />
                  </span>
                  <span>Custom Contact Entry</span>
                </a>
              </li>
              <li>
                <a href="templates.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-primary-600" />
                  </span>
                  <span>Templates</span>
                </a>
              </li>
            </ul>
          </li>

          {/* Email Communication Module */}
          <li className={`dropdown ${dropdowns.emailCommunicationModule ? "dropdown-open" : ""}`}>
            <a
              href="#"
              onClick={(e) => toggleDropdown("emailCommunicationModule", e)}
              className="dropdown-toggle"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Icon icon="solar:letter-opened-outline" className="menu-icon" />
              <span style={{ flex: 1 }}>Email</span>
              <Icon
                icon="iconamoon:arrow-down-2-bold"
                className={`dropdown-arrow ${dropdowns.emailCommunicationModule ? "rotate" : ""}`}
                style={{ fontSize: '0.8rem', flexShrink: 0 }}
              />
            </a>
            <ul
              className="sidebar-submenu"
              ref={(el) => (submenuRefs.current.emailCommunicationModule = el)}
              style={{
                display: dropdowns.emailCommunicationModule ? "block" : "none",
                overflow: "hidden",
                transition: "height 0.3s ease",
              }}
            >
              <li>
                <a href="email-communication.html">
                  <span className="submenu-icon-wrapper">
                    <Icon icon="material-symbols:circle" className="submenu-icon text-success-600" />
                  </span>
                  <span>Email</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;


