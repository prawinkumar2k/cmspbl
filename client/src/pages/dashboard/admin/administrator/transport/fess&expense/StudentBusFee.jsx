import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from '../../../../../../components/Sidebar';
import Navbar from '../../../../../../components/Navbar';
import Footer from '../../../../../../components/footer';
import DataTable from '../../../../../../components/DataTable/DataTable';

const PASS_TYPES = [
  { value: 'Monthly', label: 'Monthly', months: 1 },
  { value: 'Term', label: 'Term (3 Months)', months: 3 },
  { value: 'Semester', label: 'Semester (6 Months)', months: 6 },
  { value: 'Yearly', label: 'Yearly (12 Months)', months: 12 }
];

const PAYMENT_MODES = [
  { value: 'Cash', label: 'Cash' },
  { value: 'UPI', label: 'UPI' },
  { value: 'Card', label: 'Debit/Credit Card' },
  { value: 'Bank', label: 'Bank Transfer' }
];

const DISCOUNT_TYPES = [
  { value: 'None', label: 'No Discount', percentage: 0 },
  { value: 'Sibling', label: 'Sibling Discount', percentage: 10 },
  { value: 'Scholarship', label: 'Scholarship', percentage: 15 },
  { value: 'Concession', label: 'SC/ST Concession', percentage: 20 }
];

// NEW: Principal info – replace these with your actual data / image path
const PRINCIPAL_INFO = {
  name: 'Dr. K. Principal',
  designation: 'Principal',
  signUrl: '/assets/images/principal-sign.png' // put your real signature image path
};

const INITIAL_FORM_STATE = {
  studentId: '',
  name: '',
  rollNo: '',
  class: '',
  department: '',
  gender: '',
  phone: '',
  homeAddress: '',
  routeName: '',
  routeId: '',
  stageNo: '',
  stageName: '',
  distance: '',
  busNumber: '',
  driverId: '',
  passType: 'Monthly',
  validFrom: new Date().toISOString().split('T')[0],
  validTo: '',
  baseFare: '',
  taxPercentage: 5,
  discountType: 'None',
  discountAmount: '',
  finalAmount: '',
  paymentMode: 'Cash',
  collectNow: false,
  receiptNo: '',
  transactionRef: '',
  adminOverride: false,
  overrideReason: '',
  capacity: '',
  currentBookings: 0
};

// Bus Fee Table Component (unchanged)
const BusFeeTable = ({ busFeeRecords, loading }) => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportForm, setExportForm] = useState({
    fromDate: '',
    toDate: '',
    reportType: 'all'
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const columns = [
    {
      accessorKey: 'studentId',
      header: 'Student ID',
      cell: ({ row }) => (
        <div>
          <div className="fw-medium">{row.original.studentId}</div>
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Student Details',
      cell: ({ row }) => (
        <div>
          <div className="fw-medium">{row.original.name}</div>
          <div className="text-sm text-secondary-light">Roll: {row.original.rollNo}</div>
        </div>
      ),
    },
    {
      accessorKey: 'class',
      header: 'Academic Info',
      cell: ({ row }) => (
        <div>
          <div className="fw-medium">{row.original.class}</div>
          <div className="text-sm text-secondary-light">{row.original.department}</div>
        </div>
      ),
    },
    {
      accessorKey: 'busNumber',
      header: 'Bus & Driver',
      cell: ({ row }) => (
        <div>
          <div className="fw-medium text-warning">{row.original.busNumber}</div>
          <div className="text-sm text-secondary-light">{row.original.driverId}</div>
        </div>
      ),
    },
    {
      accessorKey: 'routeName',
      header: 'Route & Stage',
      cell: ({ row }) => (
        <div>
          <div className="fw-medium">{row.original.routeName}</div>
          <div className="text-sm text-secondary-light">{row.original.stageName}</div>
        </div>
      ),
    },
    {
      accessorKey: 'passType',
      header: 'Pass Details',
      cell: ({ row }) => (
        <div>
          <span className="badge bg-info px-2 py-1 text-xs fw-medium">{row.original.passType}</span>
          <div className="text-sm text-secondary-light mt-1">
            {formatDate(row.original.validFrom)} to {formatDate(row.original.validTo)}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'finalAmount',
      header: 'Payment',
      cell: ({ row }) => (
        <div>
          <div className="fw-medium text-success">
            {formatCurrency(row.original.finalAmount)}
          </div>
          <div className="text-sm text-secondary-light">{row.original.paymentMode}</div>
          <div className="text-xs text-secondary-light">Receipt: {row.original.receiptNo}</div>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const badgeClass = status === 'Active' ? 'success' : status === 'Expired' ? 'danger' : 'warning';
        return (
          <span className={`badge bg-${badgeClass} px-2 py-1 text-xs fw-medium`}>
            {status}
          </span>
        );
      },
    },
  ];

  const handleView = (record) => {
    console.log('View bus fee record:', record);
    toast.success(`Viewing details for ${record.name} - ${record.studentId}`);
  };

  const handleEdit = (record) => {
    console.log('Edit bus fee record:', record);
    toast.success(`Opening edit mode for: ${record.name} - ${record.studentId}`);
  };

  const handleDelete = (record) => {
    console.log('Delete bus fee record:', record);

    toast((t) => (
      <div>
        <p className="mb-2">Delete bus fee record: {record.name} - {record.studentId}?</p>
        <div className="d-flex gap-2">
          <button
            className="btn btn-danger btn-sm"
            onClick={() => {
              toast.dismiss(t.id);
              toast.success(`Bus fee record "${record.name} - ${record.studentId}" deleted successfully!`);
            }}
          >
            Delete
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
    });
  };

  const handleGetReport = () => {
    setShowExportModal(true);
  };

  const handleExportFormChange = (e) => {
    const { name, value } = e.target;
    setExportForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAllBusFeeReport = () => {
    const reportData = {
      reportType: 'All Bus Fee Report',
      generatedDate: new Date().toLocaleDateString(),
      totalItems: 'All bus fee records',
      format: 'PDF/Excel'
    };

    console.log('Generating All Bus Fee Report:', reportData);
    toast.success('All Bus Fee Report exported successfully!');
    setShowExportModal(false);
  };

  const handleDateWiseReport = () => {
    if (!exportForm.fromDate || !exportForm.toDate) {
      toast.error('Please select both From Date and To Date');
      return;
    }

    if (new Date(exportForm.fromDate) > new Date(exportForm.toDate)) {
      toast.error('From Date should be earlier than To Date');
      return;
    }

    const reportData = {
      reportType: 'Date-wise Bus Fee Report',
      fromDate: exportForm.fromDate,
      toDate: exportForm.toDate,
      generatedDate: new Date().toLocaleDateString(),
      format: 'PDF/Excel'
    };

    console.log('Generating Date-wise Bus Fee Report:', reportData);
    toast.success(`Date-wise Bus Fee Report (${exportForm.fromDate} to ${exportForm.toDate}) exported successfully!`);
    setShowExportModal(false);
  };

  return (
    <div className="mt-4">
      {/* Custom Header with Get Report Button */}
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h5 className="card-title mb-0">Bus Fee Management</h5>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-sm btn-outline-success"
                  onClick={handleGetReport}
                  title="Generate Bus Fee Reports"
                >
                  <i className="fas fa-file-alt me-1"></i>
                  Get Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        data={busFeeRecords}
        columns={columns}
        loading={loading}
        title="Bus Fee Management"
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        enableExport={true}
        enableSelection={true}
        pageSize={10}
      />

      {/* Export Modal */}
      {showExportModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Export Bus Fee Report</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowExportModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Select Report Type:</label>
                  <div className="d-flex gap-3 mt-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="reportType"
                        value="all"
                        checked={exportForm.reportType === 'all'}
                        onChange={handleExportFormChange}
                        id="allBusFee"
                      />
                      <label className="form-check-label" htmlFor="allBusFee">
                        All Bus Fee Report
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="reportType"
                        value="dateWise"
                        checked={exportForm.reportType === 'dateWise'}
                        onChange={handleExportFormChange}
                        id="dateWise"
                      />
                      <label className="form-check-label" htmlFor="dateWise">
                        Date-wise Report
                      </label>
                    </div>
                  </div>
                </div>

                {exportForm.reportType === 'dateWise' && (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">From Date:</label>
                      <input
                        type="date"
                        name="fromDate"
                        value={exportForm.fromDate}
                        onChange={handleExportFormChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">To Date:</label>
                      <input
                        type="date"
                        name="toDate"
                        value={exportForm.toDate}
                        onChange={handleExportFormChange}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowExportModal(false)}
                >
                  Cancel
                </button>
                {exportForm.reportType === 'all' ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAllBusFeeReport}
                  >
                    <i className="fas fa-download me-2"></i>
                    Export All Bus Fee Report
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleDateWiseReport}
                  >
                    <i className="fas fa-download me-2"></i>
                    Export Date-wise Report
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StudentBusFee = () => {
  const navigate = useNavigate();
  const studentIdRef = useRef(null);

  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [stages, setStages] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const [isAdmin] = useState(true); // Mock admin role
  const [passGenerated, setPassGenerated] = useState(false);
  const [passData, setPassData] = useState(null); // NEW: full pass info
  const [showBusFeeTable, setShowBusFeeTable] = useState(false);
  const [busFeeRecords, setBusFeeRecords] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  // Mock data
  const mockRoutes = useMemo(() => [
    {
      id: 'R001',
      routeName: 'City Center Route',
      routeNo: '101',
      busNumber: 'BUS01',
      driverId: 'BS001',
      capacity: 45,
      currentBookings: 38
    },
    {
      id: 'R002',
      routeName: 'Industrial Area Route',
      routeNo: '102',
      busNumber: 'BUS02',
      driverId: 'BS002',
      capacity: 25,
      currentBookings: 22
    },
    {
      id: 'R003',
      routeName: 'Residential Complex Route',
      routeNo: '103',
      busNumber: 'BUS03',
      driverId: 'BS003',
      capacity: 30,
      currentBookings: 15
    }
  ], []);

  const mockStages = useMemo(() => ({
    'R001': [
      { stageNo: '1', stageName: 'Main Gate', lat: 11.0168, lng: 76.9558, defaultFare: 180, distance: 5.2 },
      { stageNo: '2', stageName: 'City Center', lat: 11.0175, lng: 76.9545, defaultFare: 220, distance: 8.1 },
      { stageNo: '3', stageName: 'Market Square', lat: 11.0185, lng: 76.9535, defaultFare: 280, distance: 12.5 }
    ],
    'R002': [
      { stageNo: '1', stageName: 'College Gate', lat: 11.0162, lng: 76.9568, defaultFare: 200, distance: 6.8 },
      { stageNo: '2', stageName: 'Industrial Gate', lat: 11.0155, lng: 76.9578, defaultFare: 250, distance: 9.5 },
      { stageNo: '3', stageName: 'Factory Area', lat: 11.0145, lng: 76.9588, defaultFare: 320, distance: 15.2 }
    ],
    'R003': [
      { stageNo: '1', stageName: 'Housing Complex A', lat: 11.0178, lng: 76.9548, defaultFare: 150, distance: 3.5 },
      { stageNo: '2', stageName: 'Housing Complex B', lat: 11.0188, lng: 76.9538, defaultFare: 180, distance: 6.2 },
      { stageNo: '3', stageName: 'Apartment Zone', lat: 11.0198, lng: 76.9528, defaultFare: 220, distance: 9.8 }
    ]
  }), []);

  const MOCK_FARE_SLABS = useMemo(() => [
    { minDistance: 0, maxDistance: 5, fare: 150 },
    { minDistance: 5.1, maxDistance: 10, fare: 200 },
    { minDistance: 10.1, maxDistance: 15, fare: 280 },
    { minDistance: 15.1, maxDistance: 20, fare: 350 },
    { minDistance: 20.1, maxDistance: 999, fare: 400 }
  ], []);

  const mockStudents = useMemo(() => [
    {
      studentId: 'ST001',
      name: 'Arun Kumar',
      rollNo: '21CS001',
      class: 'III Year',
      department: 'Computer Science',
      gender: 'Male',
      phone: '9876543210',
      homeAddress: 'No.45, Anna Nagar, Coimbatore',
      lat: 11.0175,
      lng: 76.9545,
      lastRouteId: 'R001',
      lastStageNo: '2',
      lastBusNumber: 'BUS01',
      lastDriverId: 'BS001',
      photoUrl: '/assets/images/students/ST001.jpg' // NEW: sample photo URL
    },
    {
      studentId: 'ST002',
      name: 'Priya Sharma',
      rollNo: '21EC015',
      class: 'II Year',
      department: 'Electronics',
      gender: 'Female',
      phone: '8765432109',
      homeAddress: 'Plot 12, Saravanampatti, Coimbatore',
      lat: 11.0162,
      lng: 76.9568,
      lastRouteId: 'R002',
      lastStageNo: '1',
      lastBusNumber: 'BUS02',
      lastDriverId: 'BS002',
      photoUrl: '/assets/images/students/ST002.jpg'
    }
  ], []);

  // Initialize data
  useEffect(() => {
    setRoutes(mockRoutes);
  }, [mockRoutes]);

  // Auto-calculate valid to date when pass type changes
  useEffect(() => {
    if (form.validFrom && form.passType) {
      const passTypeData = PASS_TYPES.find(p => p.value === form.passType);
      if (passTypeData) {
        const fromDate = new Date(form.validFrom);
        const toDate = new Date(fromDate);
        toDate.setMonth(toDate.getMonth() + passTypeData.months);
        toDate.setDate(toDate.getDate() - 1);

        setForm(prev => ({
          ...prev,
          validTo: toDate.toISOString().split('T')[0]
        }));
      }
    }
  }, [form.validFrom, form.passType]);

  // Auto-calculate final amount
  useEffect(() => {
    if (form.baseFare) {
      const baseFare = parseFloat(form.baseFare) || 0;
      const taxAmount = (baseFare * parseFloat(form.taxPercentage)) / 100;
      const discountData = DISCOUNT_TYPES.find(d => d.value === form.discountType);
      const discountAmount = discountData ? (baseFare * discountData.percentage) / 100 : 0;
      const finalAmount = baseFare + taxAmount - discountAmount;

      setForm(prev => ({
        ...prev,
        discountAmount: discountAmount.toFixed(2),
        finalAmount: finalAmount.toFixed(2)
      }));
    }
  }, [form.baseFare, form.taxPercentage, form.discountType]);

  // API Functions (Mock implementations)
  const getStudentById = useCallback(async (studentId) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const student = mockStudents.find(s => s.studentId === studentId);
        resolve({ success: !!student, data: student });
      }, 500);
    });
  }, [mockStudents]);

  const getRouteStages = useCallback(async (routeId) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const stages = mockStages[routeId] || [];
        resolve({ success: true, data: stages });
      }, 200);
    });
  }, [mockStages]);

  const fetchBusFeeRecords = useCallback(async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockBusFeeData = [
          {
            id: 'BF001',
            studentId: 'ST001',
            name: 'Arun Kumar',
            rollNo: '21CS001',
            class: 'III Year',
            department: 'Computer Science',
            routeName: 'City Center Route',
            stageName: 'City Center',
            busNumber: 'BUS01',
            driverId: 'BS001',
            passType: 'Monthly',
            validFrom: '2024-11-01',
            validTo: '2024-11-30',
            finalAmount: '220.00',
            paymentMode: 'UPI',
            status: 'Active',
            issueDate: '2024-11-01',
            receiptNo: 'RCP001'
          },
          {
            id: 'BF002',
            studentId: 'ST002',
            name: 'Priya Sharma',
            rollNo: '21EC015',
            class: 'II Year',
            department: 'Electronics',
            routeName: 'Industrial Area Route',
            stageName: 'College Gate',
            busNumber: 'BUS02',
            driverId: 'BS002',
            passType: 'Semester',
            validFrom: '2024-11-01',
            validTo: '2025-04-30',
            finalAmount: '1200.00',
            paymentMode: 'Cash',
            status: 'Active',
            issueDate: '2024-11-01',
            receiptNo: 'RCP002'
          },
          {
            id: 'BF003',
            studentId: 'ST003',
            name: 'Rajesh Kumar',
            rollNo: '21ME020',
            class: 'II Year',
            department: 'Mechanical',
            routeName: 'Residential Complex Route',
            stageName: 'Housing Complex A',
            busNumber: 'BUS03',
            driverId: 'BS003',
            passType: 'Term',
            validFrom: '2024-11-01',
            validTo: '2025-01-31',
            finalAmount: '450.00',
            paymentMode: 'Bank',
            status: 'Active',
            issueDate: '2024-11-01',
            receiptNo: 'RCP003'
          },
          {
            id: 'BF004',
            studentId: 'ST004',
            name: 'Sneha Patel',
            rollNo: '21IT012',
            class: 'III Year',
            department: 'Information Technology',
            routeName: 'City Center Route',
            stageName: 'Market Square',
            busNumber: 'BUS01',
            driverId: 'BS001',
            passType: 'Monthly',
            validFrom: '2024-11-01',
            validTo: '2024-11-30',
            finalAmount: '280.00',
            paymentMode: 'UPI',
            status: 'Active',
            issueDate: '2024-11-01',
            receiptNo: 'RCP004'
          },
          {
            id: 'BF005',
            studentId: 'ST005',
            name: 'Amit Singh',
            rollNo: '21CS025',
            class: 'I Year',
            department: 'Computer Science',
            routeName: 'Industrial Area Route',
            stageName: 'Factory Area',
            busNumber: 'BUS02',
            driverId: 'BS002',
            passType: 'Yearly',
            validFrom: '2024-11-01',
            validTo: '2025-10-31',
            finalAmount: '3840.00',
            paymentMode: 'Card',
            status: 'Active',
            issueDate: '2024-11-01',
            receiptNo: 'RCP005'
          }
        ];

        resolve({
          success: true,
          data: mockBusFeeData
        });
      }, 800);
    });
  }, []);

  // Form handlers
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleStudentIdSearch = useCallback(async () => {
    if (!form.studentId.trim()) return;

    setLoading(true);
    try {
      const response = await getStudentById(form.studentId);
      if (response.success) {
        const student = response.data;
        setStudentDetails(student);

        setForm(prev => ({
          ...prev,
          name: student.name,
          rollNo: student.rollNo,
          class: student.class,
          department: student.department,
          gender: student.gender,
          phone: student.phone,
          homeAddress: student.homeAddress,
          busNumber: student.lastBusNumber || '',
          driverId: student.lastDriverId || ''
        }));

        if (student.lastRouteId) {
          const route = mockRoutes.find(r => r.id === student.lastRouteId);
          if (route) {
            setForm(prev => ({
              ...prev,
              routeName: route.routeName,
              routeId: route.id,
              busNumber: route.busNumber,
              driverId: route.driverId,
              capacity: route.capacity.toString(),
              currentBookings: route.currentBookings
            }));

            const stageResponse = await getRouteStages(student.lastRouteId);
            if (stageResponse.success) {
              setStages(stageResponse.data);

              if (student.lastStageNo) {
                const stage = stageResponse.data.find(s => s.stageNo === student.lastStageNo);
                if (stage) {
                  setForm(prev => ({
                    ...prev,
                    stageNo: stage.stageNo,
                    stageName: stage.stageName,
                    distance: stage.distance.toString(),
                    baseFare: stage.defaultFare.toString()
                  }));
                }
              }
            }
          }
        }

        toast.success(`Student found: ${student.name}`);
      } else {
        toast.error('Student not found');
        setStudentDetails(null);
      }
    } catch {
      toast.error('Error fetching student details');
    } finally {
      setLoading(false);
    }
  }, [form.studentId, getStudentById, mockRoutes, getRouteStages]);

  const handleRouteSelect = useCallback(async (routeId) => {
    if (!routeId) return;

    const route = routes.find(r => r.id === routeId);
    if (route) {
      setForm(prev => ({
        ...prev,
        routeId: routeId,
        routeName: route.routeName,
        busNumber: route.busNumber,
        driverId: route.driverId,
        capacity: route.capacity.toString(),
        currentBookings: route.currentBookings,
        stageNo: '',
        stageName: '',
        distance: '',
        baseFare: ''
      }));

      try {
        const response = await getRouteStages(routeId);
        if (response.success) {
          setStages(response.data);
        }
      } catch {
        toast.error('Error loading stages');
      }
    }
  }, [routes, getRouteStages]);

  const handleStageSelect = useCallback((stageNo) => {
    const stage = stages.find(s => s.stageNo === stageNo);
    if (stage) {
      setForm(prev => ({
        ...prev,
        stageNo: stage.stageNo,
        stageName: stage.stageName,
        distance: stage.distance.toString(),
        baseFare: stage.defaultFare.toString()
      }));

      toast.success(`Stage selected: ${stage.stageName} (${stage.distance} km)`);
    }
  }, [stages]);

  // NEW: Print pass (open only the card in a new window)
  const handlePrintPass = useCallback(() => {
    if (!passData) return;
    const content = document.getElementById('bus-pass-card');
    if (!content) return;

    const printWindow = window.open('', '', 'height=600,width=400');
    printWindow.document.write('<html><head><title>Bus Pass</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body{margin:0;padding:10px;font-family:Arial, sans-serif;}');
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(content.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }, [passData]);

  // UPDATED: build full passData and open modal
  const handleGeneratePass = useCallback(async () => {
    if (!form.studentId || !form.routeName || !form.finalAmount) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const pass = {
        passId: `PASS${Date.now()}`,
        studentId: form.studentId,
        studentName: form.name,
        rollNo: form.rollNo,
        class: form.class,
        department: form.department,
        routeName: form.routeName,
        stageName: form.stageName,
        busNumber: form.busNumber,
        passType: form.passType,
        validFrom: form.validFrom,
        validTo: form.validTo,
        amount: form.finalAmount,
        issueDate: new Date().toISOString().split('T')[0],
        photoUrl: studentDetails?.photoUrl || '',    // student photo from DB
        principalName: PRINCIPAL_INFO.name,
        principalDesignation: PRINCIPAL_INFO.designation,
        principalSignUrl: PRINCIPAL_INFO.signUrl,
        qrCode: `QR_${form.studentId}_${Date.now()}`
      };

      await new Promise(resolve => setTimeout(resolve, 500));

      setPassData(pass);
      setPassGenerated(true);
      toast.success('Bus pass generated successfully!');
    } catch {
      toast.error('Error generating pass');
    } finally {
      setLoading(false);
    }
  }, [form, studentDetails]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!form.studentId || !form.routeName || !form.stageName) {
      toast.error('Please fill all required fields');
      return;
    }

    if (form.adminOverride && !form.overrideReason.trim()) {
      toast.error('Override reason is required');
      return;
    }

    if (form.collectNow && !form.receiptNo.trim()) {
      toast.error('Receipt number is required for payment collection');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        createdBy: 'current_user',
        createdAt: new Date().toISOString()
      };

      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Saving payload', payload);
      toast.success('Student bus fee record saved successfully');

      if (form.collectNow) {
        toast.success(`Payment collected: ₹${form.finalAmount}`);
      }

      // Auto-generate pass after save
      handleGeneratePass();
    } catch {
      toast.error('Error saving fee record');
    } finally {
      setLoading(false);
    }
  }, [form, handleGeneratePass]);

  const handleClear = useCallback(() => {
    setForm(INITIAL_FORM_STATE);
    setStages([]);
    setStudentDetails(null);
    setPassGenerated(false);
    setPassData(null); // NEW
    toast.success('Form cleared for next entry');

    setTimeout(() => {
      if (studentIdRef.current) {
        studentIdRef.current.focus();
      }
    }, 100);
  }, []);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleBusFeeTable = useCallback(async () => {
    if (!showBusFeeTable) {
      setTableLoading(true);
      try {
        const response = await fetchBusFeeRecords();
        if (response.success) {
          setBusFeeRecords(response.data);
          setShowBusFeeTable(true);
          toast.success('Bus fee records loaded successfully');
        } else {
          toast.error('Failed to load bus fee records');
        }
      } catch (error) {
        console.error('Error fetching bus fee records:', error);
        toast.error('Error loading bus fee records');
      } finally {
        setTableLoading(false);
      }
    } else {
      setShowBusFeeTable(false);
      setBusFeeRecords([]);
      toast.success('Table hidden');
    }
  }, [showBusFeeTable, fetchBusFeeRecords]);

  const isCapacityExceeded = form.currentBookings >= parseInt(form.capacity || '0', 10);

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />

      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">

            {/* Header Breadcrumb */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Student Bus Fee & Pass Issue</h6>
              <ul className="d-flex align-items-center gap-2 list-unstyled mb-0">
                <li className="fw-medium">
                  <a href="/admin/adminDashboard" className="d-flex align-items-center gap-1 hover-text-primary">
                    Dashboard
                  </a>
                </li>
                <li>-</li>
                <li className="fw-medium">Administration</li>
                <li>-</li>
                <li className="fw-medium">Transport</li>
                <li>-</li>
                <li className="fw-medium">Student Bus Fee</li>
              </ul>
            </div>

            <div className="card h-100 p-0 radius-12">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <h6 className="text-lg fw-semibold mb-2">Student Transport Fee Management</h6>
                  <span className="text-sm fw-medium text-secondary-light">
                    Issue bus passes and manage student transport fees
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className={`btn ${showBusFeeTable ? 'btn-outline-warning' : 'btn-outline-info'} btn-sm`}
                    onClick={handleBusFeeTable}
                    disabled={tableLoading}
                  >
                    {tableLoading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-1" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Loading...
                      </>
                    ) : (
                      <>
                        <i className={`fas ${showBusFeeTable ? 'fa-eye-slash' : 'fa-table'} me-1`}></i>
                        {showBusFeeTable ? 'Hide Bus Fee Table' : 'View Bus Fee Table'}
                      </>
                    )}
                  </button>
                  {passGenerated && (
                    <button className="btn btn-success btn-sm">
                      <i className="fas fa-qrcode me-1"></i>
                      Pass Generated
                    </button>
                  )}
                </div>
              </div>

              <div className="card-body p-24">
                <form onSubmit={handleSubmit}>

                  {/* Student Search Section */}
                  <div className="row mb-20">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Student ID <span className="text-danger-600">*</span>
                      </label>
                      <input
                        ref={studentIdRef}
                        type="text"
                        name="studentId"
                        value={form.studentId}
                        onChange={handleChange}
                        onKeyPress={(e) => e.key === 'Enter' && handleStudentIdSearch()}
                        onBlur={handleStudentIdSearch}
                        className="form-control radius-8"
                        placeholder="Enter Student ID and press Enter"
                        required
                      />
                    </div>
                  </div>

                  {/* Student Details Section */}
                  {studentDetails && (
                    <>
                      <div className="border-bottom pb-3 mb-20 d-flex justify-content-between align-items-center">
                        <h6 className="text-md fw-semibold mb-0 text-primary-600">Student Details</h6>
                        {/* Small preview of photo */}
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-sm text-secondary-light">Photo</span>
                          <img
                            src={studentDetails.photoUrl || 'https://via.placeholder.com/80x100?text=Photo'}
                            alt="Student"
                            style={{ width: 50, height: 60, objectFit: 'cover', borderRadius: 4, border: '1px solid #ddd' }}
                          />
                        </div>
                      </div>

                      <div className="row mb-20">
                        <div className="col-md-3">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Student Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            className="form-control radius-8 bg-neutral-50"
                            readOnly
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Roll Number
                          </label>
                          <input
                            type="text"
                            name="rollNo"
                            value={form.rollNo}
                            className="form-control radius-8 bg-neutral-50"
                            readOnly
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Class
                          </label>
                          <input
                            type="text"
                            name="class"
                            value={form.class}
                            className="form-control radius-8 bg-neutral-50"
                            readOnly
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Department
                          </label>
                          <input
                            type="text"
                            name="department"
                            value={form.department}
                            className="form-control radius-8 bg-neutral-50"
                            readOnly
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Gender
                          </label>
                          <input
                            type="text"
                            name="gender"
                            value={form.gender}
                            className="form-control radius-8 bg-neutral-50"
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="row mb-20">
                        <div className="col-md-3">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            className="form-control radius-8 bg-neutral-50"
                            readOnly
                          />
                        </div>
                        <div className="col-md-9">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Home Address
                          </label>
                          <input
                            type="text"
                            name="homeAddress"
                            value={form.homeAddress}
                            className="form-control radius-8 bg-neutral-50"
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Transport Selection Section */}
                      <div className="border-bottom pb-3 mb-20">
                        <h6 className="text-md fw-semibold mb-3 text-primary-600">Transport Selection</h6>
                      </div>

                      <div className="row mb-20">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Route Name <span className="text-danger-600">*</span>
                          </label>
                          <select
                            name="routeId"
                            value={form.routeId}
                            onChange={(e) => handleRouteSelect(e.target.value)}
                            className="form-select radius-8"
                            required
                          >
                            <option value="">Select Route</option>
                            {routes.map(route => (
                              <option key={route.id} value={route.id}>
                                {route.routeName} (Bus: {route.busNumber})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-2">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Stage No <span className="text-danger-600">*</span>
                          </label>
                          <select
                            name="stageNo"
                            value={form.stageNo}
                            onChange={(e) => handleStageSelect(e.target.value)}
                            className="form-select radius-8"
                            required
                          >
                            <option value="">Select Stage</option>
                            {stages.map(stage => (
                              <option key={stage.stageNo} value={stage.stageNo}>
                                {stage.stageNo}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Stage Name
                          </label>
                          <input
                            type="text"
                            name="stageName"
                            value={form.stageName}
                            className="form-control radius-8 bg-neutral-50"
                            readOnly
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Distance (km)
                          </label>
                          <input
                            type="text"
                            name="distance"
                            value={form.distance}
                            className="form-control radius-8 bg-neutral-50"
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Bus Capacity Warning */}
                      {form.busNumber && (
                        <div className="row mb-20">
                          <div className="col-12">
                            <div className={`alert ${isCapacityExceeded ? 'alert-danger' : 'alert-info'} d-flex align-items-center`}>
                              <i className={`fas ${isCapacityExceeded ? 'fa-exclamation-triangle' : 'fa-info-circle'} me-2`}></i>
                              <div>
                                <strong>Bus Capacity Info:</strong> {form.busNumber} -
                                {' '}Current Bookings: {form.currentBookings} / {form.capacity}
                                {isCapacityExceeded && ' - CAPACITY EXCEEDED!'}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Fee Plan Section */}
                      <div className="border-bottom pb-3 mb-20">
                        <h6 className="text-md fw-semibold mb-3 text-primary-600">Fee Plan</h6>
                      </div>

                      <div className="row mb-20">
                        <div className="col-md-3">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Pass Type <span className="text-danger-600">*</span>
                          </label>
                          <select
                            name="passType"
                            value={form.passType}
                            onChange={handleChange}
                            className="form-select radius-8"
                            required
                          >
                            {PASS_TYPES.map(type => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Valid From <span className="text-danger-600">*</span>
                          </label>
                          <input
                            type="date"
                            name="validFrom"
                            value={form.validFrom}
                            onChange={handleChange}
                            className="form-control radius-8"
                            required
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Valid To
                          </label>
                          <input
                            type="date"
                            name="validTo"
                            value={form.validTo}
                            className="form-control radius-8 bg-neutral-50"
                            readOnly
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Base Fare (₹)
                          </label>
                          <input
                            type="number"
                            name="baseFare"
                            value={form.baseFare}
                            onChange={handleChange}
                            className={`form-control radius-8 ${!isAdmin ? 'bg-neutral-50' : ''}`}
                            readOnly={!isAdmin}
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>

                      <div className="row mb-20">
                        <div className="col-md-2">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Tax (%)
                          </label>
                          <input
                            type="number"
                            name="taxPercentage"
                            value={form.taxPercentage}
                            onChange={handleChange}
                            className="form-control radius-8"
                            min="0"
                            max="100"
                            step="0.1"
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Discount Type
                          </label>
                          <select
                            name="discountType"
                            value={form.discountType}
                            onChange={handleChange}
                            className="form-select radius-8"
                          >
                            {DISCOUNT_TYPES.map(discount => (
                              <option key={discount.value} value={discount.value}>
                                {discount.label} {discount.percentage > 0 && `(${discount.percentage}%)`}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-2">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Discount (₹)
                          </label>
                          <input
                            type="text"
                            name="discountAmount"
                            value={form.discountAmount}
                            className="form-control radius-8 bg-neutral-50"
                            readOnly
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Final Amount (₹) <span className="text-danger-600">*</span>
                          </label>
                          <input
                            type="text"
                            name="finalAmount"
                            value={form.finalAmount}
                            className="form-control radius-8 bg-success-50 fw-bold"
                            readOnly
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Payment Mode
                          </label>
                          <select
                            name="paymentMode"
                            value={form.paymentMode}
                            onChange={handleChange}
                            className="form-select radius-8"
                          >
                            {PAYMENT_MODES.map(mode => (
                              <option key={mode.value} value={mode.value}>
                                {mode.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Payment Collection Section */}
                      <div className="row mb-20">
                        <div className="col-md-2">
                          <div className="form-check mt-4">
                            <input
                              type="checkbox"
                              name="collectNow"
                              checked={form.collectNow}
                              onChange={handleChange}
                              className="form-check-input"
                              id="collectNow"
                            />
                            <label className="form-check-label fw-semibold text-primary-light" htmlFor="collectNow">
                              Collect Payment Now
                            </label>
                          </div>
                        </div>
                        {form.collectNow && (
                          <>
                            <div className="col-md-3">
                              <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                Receipt No <span className="text-danger-600">*</span>
                              </label>
                              <input
                                type="text"
                                name="receiptNo"
                                value={form.receiptNo}
                                onChange={handleChange}
                                className="form-control radius-8"
                                placeholder="Enter receipt number"
                                required
                              />
                            </div>
                            <div className="col-md-4">
                              <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                                Transaction Reference
                              </label>
                              <input
                                type="text"
                                name="transactionRef"
                                value={form.transactionRef}
                                onChange={handleChange}
                                className="form-control radius-8"
                                placeholder="UPI/Card transaction reference"
                              />
                            </div>
                          </>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex align-items-center justify-content-end flex-wrap gap-3">
                        <button
                          type="button"
                          className="btn btn-outline-info btn-sm px-20 py-11 radius-8"
                          onClick={handleGeneratePass}
                          disabled={!form.finalAmount || loading}
                        >
                          <i className="fas fa-qrcode me-1"></i>
                          Generate Pass
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm px-20 py-11 radius-8"
                          onClick={handleClear}
                        >
                          <i className="fas fa-broom me-1"></i>
                          Clear / Next
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm px-20 py-11 radius-8"
                          onClick={handleClose}
                        >
                          <i className="fas fa-times me-1"></i>
                          Close
                        </button>
                        <button
                          type="submit"
                          className="btn btn-outline-primary-600 btn-sm px-20 py-11 radius-8"
                          disabled={loading}
                        >
                          <i className="fas fa-save me-1"></i>
                          {loading ? 'Saving...' : form.collectNow ? 'Save & Collect' : 'Save Without Payment'}
                        </button>
                      </div>
                    </>
                  )}
                </form>
              </div>
            </div>

            {/* Bus Fee Table */}
            {showBusFeeTable && (
              <BusFeeTable
                busFeeRecords={busFeeRecords}
                loading={tableLoading}
              />
            )}
          </div>
          <Footer />
        </div>
      </section>

      {/* NEW: Bus Pass Modal (Card Type + Print) */}
      {passGenerated && passData && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header py-2">
                <h6 className="modal-title">Student Bus Pass</h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setPassGenerated(false);
                    // keep passData if you want to re-open; or clear:
                    // setPassData(null);
                  }}
                ></button>
              </div>
              <div className="modal-body d-flex justify-content-center">

                {/* Printable Card */}
                <div
                  id="bus-pass-card"
                  className="card shadow-sm"
                  style={{
                    width: 360,
                    borderRadius: 12,
                    border: '2px solid #0d6efd',
                    overflow: 'hidden',
                    fontSize: 12
                  }}
                >
                  {/* Header */}
                  <div
                    className="d-flex align-items-center justify-content-between px-3 py-2"
                    style={{ backgroundColor: '#0d6efd', color: '#fff' }}
                  >
                    <div className="d-flex flex-column">
                      <span style={{ fontWeight: 'bold', fontSize: 13 }}>Your College Name</span>
                      <span>Transport Pass</span>
                    </div>
                    <div style={{ fontSize: 10, textAlign: 'right' }}>
                      <div>Academic Year</div>
                      <div>{new Date().getFullYear()} - {new Date().getFullYear() + 1}</div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="px-3 py-2">
                    <div className="row">
                      {/* Photo */}
                      <div className="col-4 d-flex flex-column align-items-center">
                        <div
                          style={{
                            width: 90,
                            height: 110,
                            borderRadius: 6,
                            border: '1px solid #ccc',
                            overflow: 'hidden',
                            marginBottom: 4
                          }}
                        >
                          <img
                            src={passData.photoUrl || 'https://via.placeholder.com/90x110?text=Photo'}
                            alt="Student"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ fontSize: 10, textAlign: 'center' }}>Student Photo</div>
                      </div>

                      {/* Details */}
                      <div className="col-8">
                        <div className="d-flex justify-content-between">
                          <span><strong>ID:</strong> {passData.studentId}</span>
                          <span><strong>Roll:</strong> {passData.rollNo}</span>
                        </div>
                        <div><strong>Name:</strong> {passData.studentName}</div>
                        <div><strong>Class:</strong> {passData.class}</div>
                        <div><strong>Dept:</strong> {passData.department}</div>
                        <div><strong>Route:</strong> {passData.routeName}</div>
                        <div><strong>Stage:</strong> {passData.stageName}</div>
                        <div><strong>Bus No:</strong> {passData.busNumber}</div>
                        <div className="d-flex justify-content-between mt-1">
                          <span><strong>Pass:</strong> {passData.passType}</span>
                          <span><strong>Amount:</strong> ₹{passData.amount}</span>
                        </div>
                      </div>
                    </div>

                    <hr className="my-2" />

                    <div className="d-flex justify-content-between">
                      <div>
                        <div><strong>Valid From:</strong> {passData.validFrom}</div>
                        <div><strong>Valid To:</strong> {passData.validTo}</div>
                        <div><strong>Issue Date:</strong> {passData.issueDate}</div>
                      </div>
                      <div className="text-center">
                        {/* QR placeholder (you can replace with real QR) */}
                        <div
                          style={{
                            width: 70,
                            height: 70,
                            border: '1px dashed #999',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 9
                          }}
                        >
                          QR Code
                        </div>
                        <div style={{ fontSize: 9 }}>Scan for verification</div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end mt-2">
                      <div className="text-center">
                        <div style={{ height: 40 }}>
                          {passData.principalSignUrl && (
                            <img
                              src={passData.principalSignUrl}
                              alt="Principal Sign"
                              style={{ maxHeight: '100%' }}
                            />
                          )}
                        </div>
                        <div
                          style={{
                            borderTop: '1px solid #000',
                            fontSize: 10,
                            marginTop: 2
                          }}
                        >
                          {passData.principalName}<br />
                          {passData.principalDesignation}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End card */}
              </div>

              <div className="modal-footer py-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    setPassGenerated(false);
                  }}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handlePrintPass}
                >
                  <i className="fas fa-print me-1" />
                  Print Pass
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentBusFee;
