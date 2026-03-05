import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from '../../../../../../components/Sidebar';
import Navbar from '../../../../../../components/Navbar';
import Footer from '../../../../../../components/footer';
import DataTable from '../../../../../../components/DataTable/DataTable';

const LOGO_SRC = '/assets/images/GRT.png';

const REPORT_CATEGORIES = [
  { value: 'daily-expenses', label: 'Daily Expenses' },
  { value: 'monthly-expenses', label: 'Monthly Expenses' },
  { value: 'yearly-expenses', label: 'Yearly Expenses' },
  { value: 'driver-payroll', label: 'Driver Payroll' },
  { value: 'bus-cost-sheet', label: 'Bus Cost Sheet' },
  { value: 'fuel-mileage', label: 'Fuel & Mileage' },
  { value: 'vendor-ledger', label: 'Vendor Ledger' }
];

const DRIVER_IDS = ["BS001", "BS002", "BS003", "BS004", "BS005", "BS006", "BS007", "BS008", "BS009", "BS010"];
const BUS_NUMBERS = ["BUS01", "BUS02", "BUS03", "BUS04", "BUS05", "BUS06", "BUS07", "BUS08", "BUS09", "BUS10"];

const INITIAL_FORM_STATE = {
  category: 'daily-expenses',
  fromDate: new Date().toISOString().split('T')[0],
  toDate: new Date().toISOString().split('T')[0],
  busNumber: '',
  driverId: '',
  vendor: ''
};

const BusMaintenanceSalaryReports = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [kpiData, setKpiData] = useState({
    totalMaintenance: 0,
    totalFuel: 0,
    totalSalary: 0,
    avgMileage: 0,
    totalCostPerKm: 0
  });

  // Printable report preview data (Daily Expenses)
  const [previewData, setPreviewData] = useState(null);
  const previewRef = useRef(null);

  // Mock data for different report categories
  const mockReportData = useMemo(() => ({
    'daily-expenses': [
      {
        id: 1,
        date: '2024-11-07',
        busNumber: 'BUS01',
        driverId: 'BS001',
        expenseType: 'Engine Repair',
        vendor: 'Kumar Auto Works',
        amount: 5500,
        tax: 550,
        grandTotal: 6050,
        status: 'Verified'
      },
      {
        id: 2,
        date: '2024-11-06',
        busNumber: 'BUS02',
        driverId: 'BS002',
        expenseType: 'Oil Change',
        vendor: 'Prakash Motors',
        amount: 1200,
        tax: 120,
        grandTotal: 1320,
        status: 'Pending'
      },
      {
        id: 3,
        date: '2024-11-05',
        busNumber: 'BUS03',
        driverId: 'BS003',
        expenseType: 'Tire Replacement',
        vendor: 'MRF Service Center',
        amount: 8500,
        tax: 850,
        grandTotal: 9350,
        status: 'Verified'
      }
    ],
    'monthly-expenses': [
      {
        id: 1,
        month: '2024-11',
        busNumber: 'BUS01',
        totalMaintenance: 25000,
        totalFuel: 18000,
        totalOperations: 43000,
        avgCostPerKm: 12.5
      },
      {
        id: 2,
        month: '2024-10',
        busNumber: 'BUS01',
        totalMaintenance: 22000,
        totalFuel: 16500,
        totalOperations: 38500,
        avgCostPerKm: 11.8
      }
    ],
    'driver-payroll': [
      {
        id: 1,
        driverId: 'BS001',
        driverName: 'Rajesh Kumar',
        month: '2024-11',
        baseSalary: 18000,
        allowances: 3500,
        otAmount: 2000,
        totalEarnings: 23500,
        deductions: 1500,
        netPay: 22000,
        status: 'Paid'
      },
      {
        id: 2,
        driverId: 'BS002',
        driverName: 'Suresh Babu',
        month: '2024-11',
        baseSalary: 20000,
        allowances: 4000,
        otAmount: 1500,
        totalEarnings: 25500,
        deductions: 2000,
        netPay: 23500,
        status: 'Pending'
      }
    ],
    'fuel-mileage': [
      {
        id: 1,
        date: '2024-11-07',
        busNumber: 'BUS01',
        driverId: 'BS001',
        fuelType: 'Diesel',
        quantity: 50,
        rate: 85.5,
        totalCost: 4275,
        distance: 180,
        mileage: 3.6,
        station: 'HP Petrol Pump'
      },
      {
        id: 2,
        date: '2024-11-06',
        busNumber: 'BUS02',
        driverId: 'BS002',
        fuelType: 'Diesel',
        quantity: 45,
        rate: 85.5,
        totalCost: 3847.5,
        distance: 165,
        mileage: 3.67,
        station: 'BPCL Station'
      }
    ],
    'vendor-ledger': [
      {
        id: 1,
        vendor: 'Kumar Auto Works',
        totalInvoices: 5,
        totalAmount: 45000,
        lastTransaction: '2024-11-07',
        pendingAmount: 12000,
        status: 'Active'
      },
      {
        id: 2,
        vendor: 'Prakash Motors',
        totalInvoices: 8,
        totalAmount: 28000,
        lastTransaction: '2024-11-05',
        pendingAmount: 0,
        status: 'Active'
      }
    ]
  }), []);

  // Get columns based on selected category
  const getColumnsForCategory = useCallback((category) => {
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

    switch (category) {
      case 'daily-expenses':
        return [
          {
            accessorKey: 'date',
            header: 'Date',
            cell: ({ row }) => formatDate(row.original.date)
          },
          {
            accessorKey: 'busNumber',
            header: 'Bus Number',
          },
          {
            accessorKey: 'driverId',
            header: 'Driver ID',
          },
          {
            accessorKey: 'expenseType',
            header: 'Expense Type',
          },
          {
            accessorKey: 'vendor',
            header: 'Vendor',
          },
          {
            accessorKey: 'grandTotal',
            header: 'Amount',
            cell: ({ row }) => (
              <span className="fw-medium text-success">
                {formatCurrency(row.original.grandTotal)}
              </span>
            )
          },
          {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
              <span className={`badge bg-${row.original.status === 'Verified' ? 'success' : 'warning'} px-2 py-1 text-xs fw-medium`}>
                {row.original.status}
              </span>
            )
          }
        ];

      case 'monthly-expenses':
        return [
          {
            accessorKey: 'month',
            header: 'Month',
          },
          {
            accessorKey: 'busNumber',
            header: 'Bus Number',
          },
          {
            accessorKey: 'totalMaintenance',
            header: 'Maintenance',
            cell: ({ row }) => (
              <span className="fw-medium text-primary">
                {formatCurrency(row.original.totalMaintenance)}
              </span>
            )
          },
          {
            accessorKey: 'totalFuel',
            header: 'Fuel Cost',
            cell: ({ row }) => (
              <span className="fw-medium text-warning">
                {formatCurrency(row.original.totalFuel)}
              </span>
            )
          },
          {
            accessorKey: 'totalOperations',
            header: 'Total Operations',
            cell: ({ row }) => (
              <span className="fw-medium text-success">
                {formatCurrency(row.original.totalOperations)}
              </span>
            )
          },
          {
            accessorKey: 'avgCostPerKm',
            header: 'Cost/km',
            cell: ({ row }) => (
              <span className="fw-medium">
                ₹{row.original.avgCostPerKm}
              </span>
            )
          }
        ];

      case 'driver-payroll':
        return [
          {
            accessorKey: 'driverId',
            header: 'Driver ID',
          },
          {
            accessorKey: 'driverName',
            header: 'Driver Name',
          },
          {
            accessorKey: 'month',
            header: 'Month',
          },
          {
            accessorKey: 'baseSalary',
            header: 'Base Salary',
            cell: ({ row }) => formatCurrency(row.original.baseSalary)
          },
          {
            accessorKey: 'totalEarnings',
            header: 'Total Earnings',
            cell: ({ row }) => (
              <span className="fw-medium text-primary">
                {formatCurrency(row.original.totalEarnings)}
              </span>
            )
          },
          {
            accessorKey: 'netPay',
            header: 'Net Pay',
            cell: ({ row }) => (
              <span className="fw-medium text-success">
                {formatCurrency(row.original.netPay)}
              </span>
            )
          },
          {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
              <span className={`badge bg-${row.original.status === 'Paid' ? 'success' : 'warning'} px-2 py-1 text-xs fw-medium`}>
                {row.original.status}
              </span>
            )
          }
        ];

      case 'fuel-mileage':
        return [
          {
            accessorKey: 'date',
            header: 'Date',
            cell: ({ row }) => formatDate(row.original.date)
          },
          {
            accessorKey: 'busNumber',
            header: 'Bus Number',
          },
          {
            accessorKey: 'fuelType',
            header: 'Fuel Type',
          },
          {
            accessorKey: 'quantity',
            header: 'Quantity (L)',
            cell: ({ row }) => `${row.original.quantity} L`
          },
          {
            accessorKey: 'totalCost',
            header: 'Cost',
            cell: ({ row }) => formatCurrency(row.original.totalCost)
          },
          {
            accessorKey: 'distance',
            header: 'Distance (km)',
            cell: ({ row }) => `${row.original.distance} km`
          },
          {
            accessorKey: 'mileage',
            header: 'Mileage',
            cell: ({ row }) => (
              <span className="fw-medium text-info">
                {row.original.mileage} km/L
              </span>
            )
          }
        ];

      case 'vendor-ledger':
        return [
          {
            accessorKey: 'vendor',
            header: 'Vendor Name',
          },
          {
            accessorKey: 'totalInvoices',
            header: 'Total Invoices',
          },
          {
            accessorKey: 'totalAmount',
            header: 'Total Amount',
            cell: ({ row }) => formatCurrency(row.original.totalAmount)
          },
          {
            accessorKey: 'lastTransaction',
            header: 'Last Transaction',
            cell: ({ row }) => formatDate(row.original.lastTransaction)
          },
          {
            accessorKey: 'pendingAmount',
            header: 'Pending Amount',
            cell: ({ row }) => (
              <span className={`fw-medium ${row.original.pendingAmount > 0 ? 'text-danger' : 'text-success'}`}>
                {formatCurrency(row.original.pendingAmount)}
              </span>
            )
          },
          {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => (
              <span className={`badge bg-${row.original.status === 'Active' ? 'success' : 'secondary'} px-2 py-1 text-xs fw-medium`}>
                {row.original.status}
              </span>
            )
          }
        ];

      default:
        return [];
    }
  }, []);

  // Mock API functions
  const getMaintenanceReports = useCallback(async (filters) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const data = mockReportData[filters.category] || [];
        resolve({ success: true, data });
      }, 800);
    });
  }, [mockReportData]);

  const getSalaryReports = useCallback(async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        const data = mockReportData['driver-payroll'] || [];
        resolve({ success: true, data });
      }, 800);
    });
  }, [mockReportData]);

  const getFuelReports = useCallback(async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        const data = mockReportData['fuel-mileage'] || [];
        resolve({ success: true, data });
      }, 800);
    });
  }, [mockReportData]);

  // Form handlers
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    // clear preview when filters change
    setPreviewData(null);
  }, []);

  const chunkArray = (arr, size) => {
    const chunks = [];
    if (!arr) return chunks;
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const renderHeader = () => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
      <div style={{ width: 100, textAlign: "center" }}>
        <img src={LOGO_SRC} alt="logo" style={{ width: 90, height: 90, objectFit: "contain" }} />
      </div>
      <div style={{ flex: 1, textAlign: "center" }}>
        <div style={{ fontSize: "22px", fontWeight: "800", color: "#222", textTransform: "uppercase" }}>
          GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH
        </div>
        <div style={{ fontSize: "13px", fontWeight: "600", color: "#222", marginTop: 4 }}>
          GRT Mahalakshmi Nagar, Chennai - Tirupati Highway, Tiruttani - 631209.
        </div>
        <div style={{ fontSize: "13px", fontWeight: "500", color: "#222", marginTop: 2 }}>
          Phone : 044-27885997 / 98 E-mail : grtper@grt.edu.in
        </div>
      </div>
      <div style={{ width: 100 }}></div>
    </div>
  );

  const renderSignatures = () => (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '48px', paddingBottom: '24px' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ borderTop: '1.5px solid #000', width: '150px', marginBottom: '8px' }}></div>
        <div style={{ fontSize: '13px', fontWeight: '700' }}>Transport In-charge</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ borderTop: '1.5px solid #000', width: '150px', marginBottom: '8px' }}></div>
        <div style={{ fontSize: '13px', fontWeight: '700' }}>AO / HOD</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ borderTop: '1.5px solid #000', width: '150px', marginBottom: '8px' }}></div>
        <div style={{ fontSize: '13px', fontWeight: '700' }}>Principal</div>
      </div>
    </div>
  );

  const renderPrintTable = (chunk, category) => {
    const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '11px', color: '#000' };
    const thStyle = { border: '1px solid #222', padding: '6px', background: '#f4f4f4', textAlign: 'center' };
    const tdStyle = { border: '1px solid #222', padding: '6px' };

    switch (category) {
      case 'daily-expenses':
        return (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Sl.No</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Bus No</th>
                <th style={thStyle}>Driver ID</th>
                <th style={thStyle}>Expense Type</th>
                <th style={thStyle}>Vendor</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {chunk.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{idx + 1}</td>
                  <td style={tdStyle}>{row.date}</td>
                  <td style={tdStyle}>{row.busNumber}</td>
                  <td style={tdStyle}>{row.driverId}</td>
                  <td style={tdStyle}>{row.expenseType}</td>
                  <td style={tdStyle}>{row.vendor}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>₹{row.grandTotal}</td>
                  <td style={tdStyle}>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'monthly-expenses':
      case 'yearly-expenses':
        return (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Sl.No</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Maintenance</th>
                <th style={thStyle}>Fuel Cost</th>
                <th style={thStyle}>Total Operations</th>
                <th style={thStyle}>Cost/km</th>
              </tr>
            </thead>
            <tbody>
              {chunk.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{idx + 1}</td>
                  <td style={tdStyle}>{row.month || row.year}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>₹{row.totalMaintenance}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>₹{row.totalFuel}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>₹{row.totalOperations}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>₹{row.avgCostPerKm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'driver-payroll':
        return (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Sl.No</th>
                <th style={thStyle}>Driver Info</th>
                <th style={thStyle}>Earnings</th>
                <th style={thStyle}>Deductions</th>
                <th style={thStyle}>Net Pay</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {chunk.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{idx + 1}</td>
                  <td style={tdStyle}>{row.driverId}<br />{row.driverName}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>₹{row.totalEarnings}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>₹{row.deductions}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 'bold' }}>₹{row.netPay}</td>
                  <td style={tdStyle}>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'fuel-mileage':
        return (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Sl.No</th>
                <th style={thStyle}>Bus No</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Cost</th>
                <th style={thStyle}>Distance</th>
                <th style={thStyle}>Mileage</th>
              </tr>
            </thead>
            <tbody>
              {chunk.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{idx + 1}</td>
                  <td style={tdStyle}>{row.busNumber}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{row.quantity} L</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>₹{row.totalCost}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{row.distance} km</td>
                  <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 'bold' }}>{row.mileage} km/L</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'vendor-ledger':
        return (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Sl.No</th>
                <th style={thStyle}>Vendor</th>
                <th style={thStyle}>Invoices</th>
                <th style={thStyle}>Total Amount</th>
                <th style={thStyle}>Pending</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {chunk.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{idx + 1}</td>
                  <td style={tdStyle}>{row.vendor}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{row.totalInvoices}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>₹{row.totalAmount}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', color: 'red' }}>₹{row.pendingAmount}</td>
                  <td style={tdStyle}>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };

  const handleGenerateReport = useCallback(async () => {
    setLoading(true);
    setPreviewData(null);
    try {
      let response;

      if (form.category.includes('payroll')) {
        response = await getSalaryReports();
      } else if (form.category.includes('fuel')) {
        response = await getFuelReports();
      } else {
        response = await getMaintenanceReports(form);
      }

      if (response?.success) {
        setReportData(response.data);

        // Calculate KPI data
        const data = response.data;
        const totalMaintenance = data.reduce((sum, item) => sum + (item.grandTotal || item.totalMaintenance || 0), 0);
        const totalFuel = data.reduce((sum, item) => sum + (item.totalCost || item.totalFuel || 0), 0);
        const totalSalary = data.reduce((sum, item) => sum + (item.netPay || 0), 0);
        const avgMileage = data.length > 0 ? data.reduce((sum, item) => sum + (item.mileage || 0), 0) / data.length : 0;
        const totalCostPerKm = data.reduce((sum, item) => sum + (item.avgCostPerKm || 0), 0) / (data.length || 1);

        setKpiData({
          totalMaintenance,
          totalFuel,
          totalSalary,
          avgMileage: avgMileage.toFixed(2),
          totalCostPerKm: totalCostPerKm.toFixed(2)
        });

        toast.success('Report generated successfully!');
      } else {
        toast.error('Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Error generating report');
    } finally {
      setLoading(false);
    }
  }, [form, getMaintenanceReports, getSalaryReports, getFuelReports]);

  const handleView = (record) => {
    console.log('View record:', record);
    toast.success(`Viewing details for record: ${record.id}`);
  };

  const handleEdit = (record) => {
    console.log('Edit record:', record);
    toast.success(`Opening edit mode for record: ${record.id}`);
  };

  const handleDelete = (record) => {
    console.log('Delete record:', record);

    toast((t) => (
      <div>
        <p className="mb-2">Delete record: {record.id}?</p>
        <div className="d-flex gap-2">
          <button
            className="btn btn-danger btn-sm"
            onClick={() => {
              setReportData(prev => prev.filter(r => r.id !== record.id));
              toast.dismiss(t.id);
              toast.success(`Record "${record.id}" deleted successfully!`);
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

  // === New: Get Report -> build printable daily-expense report (Bonafide-style) ===
  const handleGetReport = () => {
    if (!reportData.length) {
      toast.error('Generate report first');
      return;
    }

    if (form.category !== 'daily-expenses') {
      toast.error('Printable report is available only for Daily Expenses');
      return;
    }

    const totalAmount = reportData.reduce(
      (sum, item) => sum + (item.grandTotal || 0),
      0
    );

    const preview = {
      date: new Date(form.fromDate).toLocaleDateString('en-IN'),
      fromDate: form.fromDate,
      toDate: form.toDate,
      busNumber: form.busNumber || 'All Buses',
      driverId: form.driverId || 'All Drivers',
      items: reportData,
      totalAmount,
      generatedAt: new Date().toLocaleString('en-IN')
    };

    setPreviewData(preview);

    setTimeout(() => {
      if (previewRef.current) {
        previewRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  // === New: Print only the daily report preview (like Bonafide.jsx) ===
  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const columns = useMemo(() => getColumnsForCategory(form.category), [form.category, getColumnsForCategory]);

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
              <h6 className="fw-semibold mb-0">Bus Maintenance & Salary Reports</h6>
              <ul className="d-flex align-items-center gap-2 list-unstyled mb-0">
                <li className="fw-medium">
                  <a href="index.html" className="d-flex align-items-center gap-1 hover-text-primary">
                    <iconify-icon icon="solar:home-smile-angle-outline" className="icon text-lg"></iconify-icon>
                    Dashboard
                  </a>
                </li>
                <li>-</li>
                <li className="fw-medium">Administration</li>
                <li>-</li>
                <li className="fw-medium">Transport</li>
                <li>-</li>
                <li className="fw-medium">Reports</li>
              </ul>
            </div>

            {/* Report Filters */}
            <div className="card h-100 p-0 radius-12">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <h6 className="text-lg fw-semibold mb-2">Report Generation Filters</h6>
                  <span className="text-sm fw-medium text-secondary-light">
                    Select filters and generate comprehensive reports for bus maintenance and salary data
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={handleClose}
                  >
                    <i className="fa fa-times me-1"></i>
                    Close
                  </button>
                </div>
              </div>
              <div className="card-body p-24">
                <div className="mb-24">
                  <h6 className="text-lg fw-semibold mb-16 pb-8 border-bottom border-neutral-200">
                    Filter Options
                  </h6>
                  <div className="row g-20">
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-primary-light mb-8">
                        Report Category <span className="text-danger">*</span>
                      </label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="form-select radius-8"
                        required
                      >
                        {REPORT_CATEGORIES.map(category => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-primary-light mb-8">
                        Bus Number
                      </label>
                      <select
                        name="busNumber"
                        value={form.busNumber}
                        onChange={handleChange}
                        className="form-select radius-8"
                      >
                        <option value="">All Buses</option>
                        {BUS_NUMBERS.map(bus => (
                          <option key={bus} value={bus}>{bus}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-primary-light mb-8">
                        Driver ID
                      </label>
                      <select
                        name="driverId"
                        value={form.driverId}
                        onChange={handleChange}
                        className="form-select radius-8"
                      >
                        <option value="">All Drivers</option>
                        {DRIVER_IDS.map(driver => (
                          <option key={driver} value={driver}>{driver}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-primary-light mb-8">
                        From Date
                      </label>
                      <input
                        type="date"
                        name="fromDate"
                        value={form.fromDate}
                        onChange={handleChange}
                        className="form-control radius-8"
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-primary-light mb-8">
                        To Date
                      </label>
                      <input
                        type="date"
                        name="toDate"
                        value={form.toDate}
                        onChange={handleChange}
                        className="form-control radius-8"
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="d-flex align-items-end h-100">
                        <button
                          type="button"
                          onClick={handleGenerateReport}
                          className="btn btn-outline-primary w-100 radius-8"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <div className="spinner-border spinner-border-sm me-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-search me-2"></i>
                              Generate Report
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* KPI Summary Cards */}
            {reportData.length > 0 && (
              <div className="card h-100 p-0 radius-12 mt-4">
                <div className="card-header border-bottom bg-base py-16 px-24">
                  <h6 className="text-lg fw-semibold mb-0">Key Performance Indicators</h6>
                  <span className="text-sm fw-medium text-secondary-light">
                    Summary overview of financial metrics and operational data
                  </span>
                </div>
                <div className="card-body p-24">
                  <div className="row g-20">
                    <div className="col-12 col-md-6 col-lg-2">
                      <div className="card bg-primary-50 border border-primary-200 radius-8">
                        <div className="card-body p-16 text-center">
                          <div className="mb-8">
                            <i className="fas fa-tools text-primary-600 fa-2x"></i>
                          </div>
                          <h6 className="text-primary-600 fw-bold mb-1">
                            {formatCurrency(kpiData.totalMaintenance)}
                          </h6>
                          <span className="text-sm fw-medium text-secondary-light">Total Maintenance</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-2">
                      <div className="card bg-warning-50 border border-warning-200 radius-8">
                        <div className="card-body p-16 text-center">
                          <div className="mb-8">
                            <i className="fas fa-gas-pump text-warning-600 fa-2x"></i>
                          </div>
                          <h6 className="text-warning-600 fw-bold mb-1">
                            {formatCurrency(kpiData.totalFuel)}
                          </h6>
                          <span className="text-sm fw-medium text-secondary-light">Total Fuel</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-2">
                      <div className="card bg-success-50 border border-success-200 radius-8">
                        <div className="card-body p-16 text-center">
                          <div className="mb-8">
                            <i className="fas fa-money-bill-wave text-success-600 fa-2x"></i>
                          </div>
                          <h6 className="text-success-600 fw-bold mb-1">
                            {formatCurrency(kpiData.totalSalary)}
                          </h6>
                          <span className="text-sm fw-medium text-secondary-light">Total Salary</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-2">
                      <div className="card bg-info-50 border border-info-200 radius-8">
                        <div className="card-body p-16 text-center">
                          <div className="mb-8">
                            <i className="fas fa-tachometer-alt text-info-600 fa-2x"></i>
                          </div>
                          <h6 className="text-info-600 fw-bold mb-1">
                            {kpiData.avgMileage} km/L
                          </h6>
                          <span className="text-sm fw-medium text-secondary-light">Avg Mileage</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-2">
                      <div className="card bg-danger-50 border border-danger-200 radius-8">
                        <div className="card-body p-16 text-center">
                          <div className="mb-8">
                            <i className="fas fa-chart-line text-danger-600 fa-2x"></i>
                          </div>
                          <h6 className="text-danger-600 fw-bold mb-1">
                            ₹{kpiData.totalCostPerKm}/km
                          </h6>
                          <span className="text-sm fw-medium text-secondary-light">Cost per KM</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-2">
                      <div className="card bg-neutral-50 border border-neutral-200 radius-8">
                        <div className="card-body p-16 text-center">
                          <div className="mb-8">
                            <i className="fas fa-times text-neutral-600 fa-2x"></i>
                          </div>
                          <button
                            type="button"
                            className="btn btn-outline-secondary w-100 btn-sm radius-8"
                            onClick={handleClose}
                          >
                            Close Reports
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Standardized Print Content */}
            <div id="maintenance-salary-report" className="maintenance-salary-report-print-container" style={{ display: 'none' }}>
              <style>
                {`
                  @media print {
                    body * { visibility: hidden; }
                    #maintenance-salary-report, #maintenance-salary-report * { visibility: visible; }
                    #maintenance-salary-report {
                      position: absolute;
                      left: 0;
                      top: 0;
                      width: 100%;
                      display: block !important;
                      background: #fff !important;
                    }
                    .page-container {
                      page-break-after: always;
                      border: 2px solid #222 !important;
                      padding: 12mm !important;
                      min-height: 277mm;
                      display: flex;
                      flex-direction: column;
                      box-sizing: border-box;
                      margin-bottom: 0;
                    }
                    .page-container:last-child {
                      page-break-after: auto;
                    }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    @page { size: A4 portrait; margin: 5mm; }
                  }
                `}
              </style>
              {(() => {
                const ROWS_PER_PAGE = 20;
                const chunks = chunkArray(reportData, ROWS_PER_PAGE);

                return chunks.map((chunk, pageIdx) => (
                  <div key={pageIdx} className="page-container" style={{ background: '#fff', fontFamily: "'Times New Roman', serif" }}>
                    {renderHeader()}

                    <div style={{ textAlign: "center", fontSize: "18px", fontWeight: "900", textDecoration: "underline", marginBottom: "20px", color: "#000", textTransform: 'uppercase' }}>
                      {REPORT_CATEGORIES.find(c => c.value === form.category)?.label} REPORT
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '13px', color: "#000" }}>
                      <div>
                        <div><strong>Period:</strong> {form.fromDate} to {form.toDate}</div>
                        {form.busNumber && <div><strong>Bus Number:</strong> {form.busNumber}</div>}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {form.driverId && <div><strong>Driver ID:</strong> {form.driverId}</div>}
                      </div>
                    </div>

                    <div style={{ flex: 1 }}>
                      {renderPrintTable(chunk, form.category)}

                      {/* Empty rows if needed */}
                      {chunk.length < ROWS_PER_PAGE && (
                        <table style={{ width: '100%', borderCollapse: 'collapse', borderTop: 'none' }}>
                          <tbody>
                            {Array.from({ length: ROWS_PER_PAGE - chunk.length }).map((_, i) => (
                              <tr key={`empty-\${i}`}>
                                <td style={{ border: '1px solid #222', padding: '16px' }}>&nbsp;</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                      {renderSignatures()}
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Data Table */}
            {reportData.length > 0 ? (
              <div className="card h-100 p-0 radius-12 mt-4">
                <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                  <div>
                    <h6 className="text-lg fw-semibold mb-2">
                      {REPORT_CATEGORIES.find(cat => cat.value === form.category)?.label} Report Data
                    </h6>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-outline-success radius-8 px-20 py-11"
                      onClick={handlePrint}
                    >
                      <i className="fas fa-print me-2"></i>
                      Print Report
                    </button>
                  </div>
                </div>
                <div className="card-body p-24">
                  <DataTable
                    data={reportData}
                    columns={columns}
                    loading={loading}
                    title={`${REPORT_CATEGORIES.find(cat => cat.value === form.category)?.label} Report`}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    enableExport={true}
                    enableSelection={true}
                    pageSize={10}
                  />
                </div>
              </div>
            ) : (
              !loading && (
                <div className="card h-100 p-0 radius-12 mt-4">
                  <div className="card-body p-24 text-center">
                    <div className="py-40">
                      <i className="fas fa-chart-bar text-neutral-400 display-4 mb-16"></i>
                      <h6 className="text-lg fw-semibold text-neutral-600 mb-8">No Records Found</h6>
                      <p className="text-sm fw-medium text-secondary-light mb-0">
                        Please select appropriate filters and click "Generate Report" to view data
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}


          </div>
          <Footer />
        </div>
      </section>

      {/* Optional: if you ever want in-page print instead of new window */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #transport-daily-report-preview, #transport-daily-report-preview * {
            visibility: visible;
          }
          #transport-daily-report-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default BusMaintenanceSalaryReports;
