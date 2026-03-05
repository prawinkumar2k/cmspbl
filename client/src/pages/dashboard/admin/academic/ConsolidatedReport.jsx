import React, { useState, useEffect, useRef } from 'react';
import { toast } from "react-hot-toast";
import DataTable from '../../../../components/DataTable/DataTable';
import Sidebar from '../../../../components/Sidebar';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/footer';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../../components/css/style.css";

const StudentSubjectConsolidatedReport = () => {
    // Filter state
    const [filters, setFilters] = useState({
        deptName: '',
        deptCode: '',
        semester: '',
        year: '',
        regulation: '',
        subName: '',
        subCode: ''
    });

    // Master data for filters
    const [filterOptions, setFilterOptions] = useState({
        departments: [],
        semesters: [],
        regulations: [],
        subjects: []
    });

    // Table state
    const [reportData, setReportData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Print ref
    const printableRef = useRef(null);

    // Table styles for print report
    const thStyle = {
        border: "1px solid #222",
        padding: "6px 8px",
        fontWeight: 700,
        background: "#f4f4f4",
        textAlign: "center",
        fontSize: "11px",
        color: "#222"
    };

    const tdStyle = {
        border: "1px solid #222",
        padding: "5px 8px",
        textAlign: "center",
        fontSize: "10px",
        color: "#222"
    };

    // Print function
    const handlePrint = () => {
        if (!filteredData || filteredData.length === 0) {
            toast.error("No data to print");
            return;
        }
        window.print();
    };

    // Fetch initial data and filter options
    useEffect(() => {
        fetchInitialData();
        fetchFilterOptions();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/consolidateReport/data');
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            setReportData(data);
            setFilteredData(data); // Initially show all
        } catch (error) {
            console.error('Error fetching initial data:', error);
            toast.error('Failed to load report data');
        } finally {
            setLoading(false);
        }
    };

    const fetchFilterOptions = async () => {
        try {
            const response = await fetch('/api/consolidateReport/filters');
            if (!response.ok) throw new Error('Failed to fetch filter options');
            const data = await response.json();
            setFilterOptions(data);
        } catch (error) {
            console.error('Error fetching filter options:', error);
            toast.error('Failed to load filter options');
        }
    };

    // Handle filter changes
    const handleFilterChange = (name, value) => {
        setFilters(prev => {
            const newFilters = { ...prev, [name]: value };

            // Auto-fill logic
            if (name === 'deptName') {
                const selected = filterOptions.departments.find(d => d.deptName === value);
                newFilters.deptCode = selected ? selected.deptCode : '';
            }
            if (name === 'semester') {
                const selected = filterOptions.semesters.find(s => s.semester === value);
                newFilters.year = selected ? selected.year : '';
            }
            if (name === 'subName') {
                const selected = filterOptions.subjects.find(s => s.subName === value);
                newFilters.subCode = selected ? selected.subCode : '';
            }

            return newFilters;
        });
    };

    // Apply filters
    const handleApplyFilters = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (filters.deptName) queryParams.append('deptName', filters.deptName);
            if (filters.semester) queryParams.append('semester', filters.semester);
            if (filters.regulation) queryParams.append('regulation', filters.regulation);
            if (filters.subName) queryParams.append('subName', filters.subName);

            const response = await fetch(`/api/consolidateReport/data?${queryParams.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch filtered data');
            const data = await response.json();
            setFilteredData(data);

            if (data.length === 0) {
                toast.error('No records found');
            } else {
                toast.success(`${data.length} records found`);
            }
        } catch (error) {
            console.error('Error applying filters:', error);
            toast.error('Failed to filter data');
        } finally {
            setLoading(false);
        }
    };

    // Reset filters
    const handleReset = () => {
        setFilters({
            deptName: '',
            deptCode: '',
            semester: '',
            year: '',
            regulation: '',
            subName: '',
            subCode: ''
        });
        setFilteredData(reportData); // Reset to initial all records
        toast.success('Filters reset');
    };

    const columns = [
        {
            accessorKey: 'sno',
            header: 'S.No',
            cell: ({ row }) => <div className="fw-medium">{row.index + 1}</div>
        },
        {
            accessorKey: 'Register_Number',
            header: 'Register Number',
            cell: ({ row }) => <div className="fw-medium">{row.original.Register_Number}</div>,
        },
        {
            accessorKey: 'Student_Name',
            header: 'Student Name',
            cell: ({ row }) => <div className="fw-medium">{row.original.Student_Name}</div>,
        },
        {
            accessorKey: 'Dept_Code',
            header: 'Dept Code',
            cell: ({ row }) => <div className="fw-medium">{row.original.Dept_Code}</div>,
        },
        {
            accessorKey: 'Dept_Name',
            header: 'Dept Name',
            cell: ({ row }) => <div className="fw-medium">{row.original.Dept_Name}</div>,
        },
        {
            accessorKey: 'Semester',
            header: 'Semester',
            cell: ({ row }) => <div className="fw-medium">{row.original.Semester}</div>,
        },
        {
            accessorKey: 'Year',
            header: 'Year',
            cell: ({ row }) => <div className="fw-medium">{row.original.Year}</div>,
        },
        {
            accessorKey: 'Regulation',
            header: 'Regulation',
            cell: ({ row }) => <div className="fw-medium">{row.original.Regulation}</div>,
        },
        {
            accessorKey: 'Sub_Code',
            header: 'Subject Code',
            cell: ({ row }) => <div className="fw-medium">{row.original.Sub_Code}</div>,
        },
        {
            accessorKey: 'Sub_Name',
            header: 'Subject Name',
            cell: ({ row }) => <div className="fw-medium">{row.original.Sub_Name}</div>,
        },
        {
            accessorKey: 'assignment_percentage',
            header: 'Assignment %',
            cell: ({ row }) => <div className="fw-medium">{row.original.assignment_percentage}</div>,
        },
        {
            accessorKey: 'unit_test_percentage',
            header: 'Unit Test %',
            cell: ({ row }) => <div className="fw-medium">{row.original.unit_test_percentage}</div>,
        },

        {
            accessorKey: 'attendance_percentage',
            header: 'Attendance %',
            cell: ({ row }) => <div className="fw-medium">{row.original.attendance_percentage}</div>,
        },
        {
            accessorKey: 'final_consolidated_percentage',
            header: 'Final Consolidated %',
            cell: ({ row }) => <div className="fw-medium">{row.original.final_consolidated_percentage}</div>,
        },
    ];

    return (
        <section className="overlay">
            <Sidebar />
            <div className="dashboard-main">
                <Navbar />
                <div className="dashboard-main-body">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
                        <h6 className="fw-semibold mb-0">Student Subject Consolidated Report</h6>
                    </div>

                    {/* Filter Section */}
                    <div className="card h-100 p-0 radius-12 mb-4">
                        <div className="card-body p-24">
                            <div className="row g-3">
                                {/* Department Name */}
                                <div className="col-12 col-md-4">
                                    <label className="form-label fw-semibold text-primary-light mb-8">Department Name</label>
                                    <select
                                        className="form-select radius-8"
                                        value={filters.deptName}
                                        onChange={(e) => handleFilterChange('deptName', e.target.value)}
                                    >
                                        <option value="">Select Department</option>
                                        {filterOptions.departments.map((dept, index) => (
                                            <option key={index} value={dept.deptName}>{dept.deptName}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Department Code */}
                                <div className="col-12 col-md-2">
                                    <label className="form-label fw-semibold text-primary-light mb-8">Dept Code</label>
                                    <input
                                        type="text"
                                        className="form-control radius-8"
                                        value={filters.deptCode}
                                        readOnly
                                    />
                                </div>

                                {/* Semester */}
                                <div className="col-12 col-md-3">
                                    <label className="form-label fw-semibold text-primary-light mb-8">Semester</label>
                                    <select
                                        className="form-select radius-8"
                                        value={filters.semester}
                                        onChange={(e) => handleFilterChange('semester', e.target.value)}
                                    >
                                        <option value="">Select Semester</option>
                                        {filterOptions.semesters.map((sem, index) => (
                                            <option key={index} value={sem.semester}>{sem.semester}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Year */}
                                <div className="col-12 col-md-3">
                                    <label className="form-label fw-semibold text-primary-light mb-8">Year</label>
                                    <input
                                        type="text"
                                        className="form-control radius-8"
                                        value={filters.year}
                                        readOnly
                                    />
                                </div>

                                {/* Regulation */}
                                <div className="col-12 col-md-4">
                                    <label className="form-label fw-semibold text-primary-light mb-8">Regulation</label>
                                    <select
                                        className="form-select radius-8"
                                        value={filters.regulation}
                                        onChange={(e) => handleFilterChange('regulation', e.target.value)}
                                    >
                                        <option value="">Select Regulation</option>
                                        {filterOptions.regulations.map((reg, index) => (
                                            <option key={index} value={reg.regulation}>{reg.regulation}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Subject Name */}
                                <div className="col-12 col-md-4">
                                    <label className="form-label fw-semibold text-primary-light mb-8">Subject Name</label>
                                    <select
                                        className="form-select radius-8"
                                        value={filters.subName}
                                        onChange={(e) => handleFilterChange('subName', e.target.value)}
                                    >
                                        <option value="">Select Subject</option>
                                        {filterOptions.subjects.map((sub, index) => (
                                            <option key={index} value={sub.subName}>{sub.subName}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Subject Code */}
                                <div className="col-12 col-md-2">
                                    <label className="form-label fw-semibold text-primary-light mb-8">Subject Code</label>
                                    <input
                                        type="text"
                                        className="form-control radius-8"
                                        value={filters.subCode}
                                        readOnly
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                                    <button
                                        className="btn btn-outline-primary radius-8 px-20 py-11"
                                        onClick={handleApplyFilters}
                                        disabled={loading}
                                    >
                                        {loading ? 'Filtering...' : 'Apply Filter'}
                                    </button>
                                    <button
                                        className="btn btn-outline-success radius-8 px-20 py-11"
                                        onClick={handlePrint}
                                        disabled={filteredData.length === 0}
                                    >
                                        <i className="fas fa-print me-2"></i>Print Report
                                    </button>
                                    <button
                                        className="btn btn-outline-secondary radius-8 px-20 py-11"
                                        onClick={handleReset}
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="card h-100 p-0 radius-12">
                        <div className="card-body p-24">
                            {loading && reportData.length === 0 ? (
                                <div className="text-center py-4">Loading...</div>
                            ) : (
                                <DataTable
                                    columns={columns}
                                    data={filteredData}
                                    enableActions={false}
                                />
                            )}
                        </div>
                    </div>

                    {/* Printable Report Section - Hidden on screen, visible on print */}
                    <div id="consolidated-report-print" ref={printableRef} className="consolidated-print-container" style={{ display: 'none' }}>
                        <div style={{
                            border: '2px solid #222',
                            margin: '10px',
                            padding: 0,
                            background: '#fff',
                            fontFamily: "'Times New Roman', Times, serif"
                        }}>
                            {/* Header */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24, marginBottom: 12 }}>
                                <div style={{ width: 100, minWidth: 100, textAlign: "center" }}>
                                    <img
                                        src="/assets/images/GRT.png"
                                        alt="logo"
                                        style={{ width: 80, height: 80, objectFit: "contain" }}
                                    />
                                </div>
                                <div style={{ flex: 1, textAlign: "center" }}>
                                    <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: 0.5, color: "#222", textTransform: 'uppercase' }}>
                                        GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH
                                    </div>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: "#222", marginTop: 4 }}>
                                        GRT Mahalakshmi Nagar, Chennai - Tirupati Highway, Tiruttani - 631209.
                                    </div>
                                    <div style={{ fontSize: 12, fontWeight: 500, color: "#222", marginTop: 2 }}>
                                        Phone : 044-27885997 / 98 E-mail : grtper@grt.edu.in
                                    </div>
                                </div>
                                <div style={{ width: 100, minWidth: 100 }}></div>
                            </div>

                            {/* Report Title */}
                            <div style={{ textAlign: "center", fontWeight: 700, fontSize: 16, textDecoration: "underline", margin: "16px 0 12px 0", textTransform: 'uppercase' }}>
                                STUDENT SUBJECT CONSOLIDATED REPORT
                            </div>

                            {/* Filter Info */}
                            <div style={{ padding: "0 24px", marginBottom: 12 }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: 12, border: '1px solid #222', padding: '8px 12px' }}>
                                    {filters.deptName && <span><strong>Department:</strong> {filters.deptName}</span>}
                                    {filters.semester && <span><strong>Semester:</strong> {filters.semester}</span>}
                                    {filters.regulation && <span><strong>Regulation:</strong> {filters.regulation}</span>}
                                    {filters.subName && <span><strong>Subject:</strong> {filters.subName}</span>}
                                    {!filters.deptName && !filters.semester && !filters.regulation && !filters.subName && <span><strong>All Records</strong></span>}
                                </div>
                            </div>

                            {/* Data Table */}
                            <div style={{ padding: "0 16px", overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
                                    <thead>
                                        <tr>
                                            <th style={thStyle}>S.No</th>
                                            <th style={thStyle}>Reg No</th>
                                            <th style={{ ...thStyle, textAlign: 'left' }}>Student Name</th>
                                            <th style={thStyle}>Dept</th>
                                            <th style={thStyle}>Sem</th>
                                            <th style={thStyle}>Year</th>
                                            <th style={thStyle}>Reg</th>
                                            <th style={thStyle}>Sub Code</th>
                                            <th style={{ ...thStyle, textAlign: 'left' }}>Subject Name</th>
                                            <th style={thStyle}>Assign %</th>
                                            <th style={thStyle}>Unit %</th>

                                            <th style={thStyle}>Attend %</th>
                                            <th style={thStyle}>Final %</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((row, idx) => (
                                            <tr key={idx}>
                                                <td style={tdStyle}>{idx + 1}</td>
                                                <td style={tdStyle}>{row.Register_Number}</td>
                                                <td style={{ ...tdStyle, textAlign: 'left' }}>{row.Student_Name}</td>
                                                <td style={tdStyle}>{row.Dept_Code}</td>
                                                <td style={tdStyle}>{row.Semester}</td>
                                                <td style={tdStyle}>{row.Year}</td>
                                                <td style={tdStyle}>{row.Regulation}</td>
                                                <td style={tdStyle}>{row.Sub_Code}</td>
                                                <td style={{ ...tdStyle, textAlign: 'left' }}>{row.Sub_Name}</td>
                                                <td style={tdStyle}>{row.assignment_percentage || '-'}</td>
                                                <td style={tdStyle}>{row.unit_test_percentage || '-'}</td>

                                                <td style={tdStyle}>{row.attendance_percentage || '-'}</td>
                                                <td style={{ ...tdStyle, fontWeight: 700 }}>{row.final_consolidated_percentage || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Footer / Signatures */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px', marginBottom: '24px', padding: '0 48px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ borderTop: '1.5px solid #000', width: '150px', marginBottom: '8px' }}></div>
                                    <div style={{ fontSize: '12px', fontWeight: '700' }}>Class Advisor</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ borderTop: '1.5px solid #000', width: '150px', marginBottom: '8px' }}></div>
                                    <div style={{ fontSize: '12px', fontWeight: '700' }}>HOD</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ borderTop: '1.5px solid #000', width: '150px', marginBottom: '8px' }}></div>
                                    <div style={{ fontSize: '12px', fontWeight: '700' }}>Principal</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>

            {/* Print CSS */}
            <style>{`
                @media print {
                    body * { visibility: hidden !important; }
                    #consolidated-report-print, #consolidated-report-print * { visibility: visible !important; }
                    #consolidated-report-print {
                        display: block !important;
                        position: absolute !important;
                        left: 0;
                        top: 0;
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: #fff !important;
                    }
                    nav, .sidebar, .navbar, .breadcrumb, button, .btn, footer, .filter-card, .card { display: none !important; }
                    @page { size: A4 landscape; margin: 8mm; }
                }
            `}</style>
        </section>
    );
};

export default StudentSubjectConsolidatedReport;