import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from '../../../../../../components/Sidebar';
import Navbar from '../../../../../../components/Navbar';
import Footer from '../../../../../../components/footer';
import DataTable from '../../../../../../components/DataTable/DataTable';

const LOGO_SRC = '/assets/images/GRT.png';

const REPORT_CATEGORIES = [
  { value: 'daily-issues', label: 'Daily Issues' },
  { value: 'monthly-summary', label: 'Monthly Summary' },
  { value: 'year-summary', label: 'Year Summary' },
  { value: 'student-ledger', label: 'Student Ledger' },
  { value: 'route-revenue', label: 'Route/Stage Revenue' },
  { value: 'outstanding-dues', label: 'Outstanding Dues' }
];

const DRIVER_IDS = ["BS001", "BS002", "BS003", "BS004", "BS005", "BS006", "BS007", "BS008", "BS009", "BS010"];
const BUS_NUMBERS = ["BUS01", "BUS02", "BUS03", "BUS04", "BUS05", "BUS06", "BUS07", "BUS08", "BUS09", "BUS10"];

const CLASSES = [
  { value: '', label: 'All Classes' },
  { value: 'I Year', label: 'I Year' },
  { value: 'II Year', label: 'II Year' },
  { value: 'III Year', label: 'III Year' },
  { value: 'IV Year', label: 'IV Year' }
];

const ROUTES = [
  { value: '', label: 'All Routes' },
  { value: 'R001', label: 'City Center Route' },
  { value: 'R002', label: 'Industrial Area Route' },
  { value: 'R003', label: 'Residential Complex Route' }
];

const INITIAL_FILTERS = {
  fromDate: new Date().toISOString().split('T')[0],
  toDate: new Date().toISOString().split('T')[0],
  category: 'daily-issues',
  class: '',
  route: '',
  busNumber: '',
  driverId: '',
  studentSearch: ''
};

const StudentBusFeeReports = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [kpiData, setKpiData] = useState({ passesIssued: 0, revenue: 0, avgFare: 0 });

  // Mock data for different report types
  const mockReportData = useMemo(() => ({
    'daily-issues': [
      {
        slNo: 1,
        date: '2025-11-06',
        studentId: 'ST001',
        name: 'Arun Kumar',
        class: 'III Year',
        busNumber: 'BUS01',
        driverId: 'BS001',
        route: 'City Center Route',
        stage: 'Market Square',
        passType: 'Monthly',
        amount: 280,
        paymentMode: 'UPI',
        receiptNo: 'RCP001'
      },
      {
        slNo: 2,
        date: '2025-11-06',
        studentId: 'ST002',
        name: 'Priya Sharma',
        class: 'II Year',
        busNumber: 'BUS02',
        driverId: 'BS002',
        route: 'Industrial Area Route',
        stage: 'College Gate',
        passType: 'Semester',
        amount: 1200,
        paymentMode: 'Cash',
        receiptNo: 'RCP002'
      },
      {
        slNo: 3,
        date: '2025-11-06',
        studentId: 'ST003',
        name: 'Raj Patel',
        class: 'I Year',
        busNumber: 'BUS03',
        driverId: 'BS003',
        route: 'Residential Complex Route',
        stage: 'Housing Complex B',
        passType: 'Term',
        amount: 540,
        paymentMode: 'Card',
        receiptNo: 'RCP003'
      }
    ],
    'monthly-summary': [
      {
        slNo: 1,
        busNumber: 'BUS01',
        driverId: 'BS001',
        route: 'City Center Route',
        stage: 'All Stages',
        passCount: 45,
        revenue: 12600,
        studentCount: 42,
        avgFarePerStudent: 300
      },
      {
        slNo: 2,
        busNumber: 'BUS02',
        driverId: 'BS002',
        route: 'Industrial Area Route',
        stage: 'All Stages',
        passCount: 32,
        revenue: 9600,
        studentCount: 30,
        avgFarePerStudent: 320
      },
      {
        slNo: 3,
        busNumber: 'BUS03',
        driverId: 'BS003',
        route: 'Residential Complex Route',
        stage: 'All Stages',
        passCount: 28,
        revenue: 7840,
        studentCount: 25,
        avgFarePerStudent: 314
      }
    ],
    'year-summary': [
      {
        slNo: 1,
        busNumber: 'BUS01',
        driverId: 'BS001',
        route: 'City Center Route',
        passCount: 540,
        revenue: 151200,
        avgPerMonth: 45,
        totalStudents: 504
      },
      {
        slNo: 2,
        busNumber: 'BUS02',
        driverId: 'BS002',
        route: 'Industrial Area Route',
        passCount: 384,
        revenue: 115200,
        avgPerMonth: 32,
        totalStudents: 360
      },
      {
        slNo: 3,
        busNumber: 'BUS03',
        driverId: 'BS003',
        route: 'Residential Complex Route',
        passCount: 336,
        revenue: 94080,
        avgPerMonth: 28,
        totalStudents: 300
      }
    ],
    'student-ledger': [
      {
        slNo: 1,
        date: '2025-10-01',
        studentId: 'ST001',
        name: 'Arun Kumar',
        busNumber: 'BUS01',
        driverId: 'BS001',
        particulars: 'Monthly Pass Issue',
        period: 'Oct 2025',
        debit: 280,
        credit: 0,
        balance: 280
      },
      {
        slNo: 2,
        date: '2025-10-15',
        studentId: 'ST001',
        name: 'Arun Kumar',
        busNumber: 'BUS01',
        driverId: 'BS001',
        particulars: 'Payment Received',
        period: 'Oct 2025',
        debit: 0,
        credit: 280,
        balance: 0
      },
      {
        slNo: 3,
        date: '2025-11-01',
        studentId: 'ST001',
        name: 'Arun Kumar',
        busNumber: 'BUS01',
        driverId: 'BS001',
        particulars: 'Monthly Pass Issue',
        period: 'Nov 2025',
        debit: 280,
        credit: 0,
        balance: 280
      }
    ],
    'route-revenue': [
      {
        slNo: 1,
        busNumber: 'BUS01',
        driverId: 'BS001',
        route: 'City Center Route',
        stage: 'Main Gate',
        passes: 15,
        totalRevenue: 2700,
        avgFare: 180,
        distance: 5.2,
        studentCount: 15
      },
      {
        slNo: 2,
        busNumber: 'BUS01',
        driverId: 'BS001',
        route: 'City Center Route',
        stage: 'City Center',
        passes: 12,
        totalRevenue: 2640,
        avgFare: 220,
        distance: 8.1,
        studentCount: 12
      },
      {
        slNo: 3,
        busNumber: 'BUS01',
        driverId: 'BS001',
        route: 'City Center Route',
        stage: 'Market Square',
        passes: 18,
        totalRevenue: 5040,
        avgFare: 280,
        distance: 12.5,
        studentCount: 18
      }
    ],
    'outstanding-dues': [
      {
        slNo: 1,
        studentId: 'ST005',
        name: 'Anitha Reddy',
        class: 'II Year',
        busNumber: 'BUS02',
        driverId: 'BS002',
        route: 'Industrial Area Route',
        lastPaidTill: '2025-10-31',
        dueFrom: '2025-11-01',
        estimatedDue: 280,
        contact: '9876543215'
      },
      {
        slNo: 2,
        studentId: 'ST008',
        name: 'Karthik Kumar',
        class: 'III Year',
        busNumber: 'BUS01',
        driverId: 'BS001',
        route: 'City Center Route',
        lastPaidTill: '2025-09-30',
        dueFrom: '2025-10-01',
        estimatedDue: 560,
        contact: '8765432108'
      }
    ]
  }), []);

  // Define table columns for different report types
  const getColumnsForCategory = useCallback((category) => {
    switch (category) {
      case 'daily-issues':
        return [
          {
            accessorKey: 'slNo',
            header: 'Sl.No.',
            cell: ({ row }) => (
              <div className="fw-medium">{row.original.slNo}</div>
            ),
          },
          {
            accessorKey: 'date',
            header: 'Date',
            cell: ({ row }) => (
              <div className="fw-medium">{row.original.date}</div>
            ),
          },
          {
            accessorKey: 'studentId',
            header: 'Student Details',
            cell: ({ row }) => (
              <div>
                <div className="fw-medium">{row.original.studentId}</div>
                <div className="text-sm text-secondary-light">{row.original.name}</div>
              </div>
            ),
          },
          {
            accessorKey: 'class',
            header: 'Class',
            cell: ({ row }) => (
              <div className="fw-medium text-primary">{row.original.class}</div>
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
            accessorKey: 'route',
            header: 'Route Details',
            cell: ({ row }) => (
              <div>
                <div className="fw-medium">{row.original.route}</div>
                <div className="text-sm text-secondary-light">{row.original.stage}</div>
              </div>
            ),
          },
          {
            accessorKey: 'passType',
            header: 'Pass Type',
            cell: ({ row }) => (
              <div className="fw-medium text-info">{row.original.passType}</div>
            ),
          },
          {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => (
              <div className="fw-medium text-success">
                ₹{Number(row.original.amount).toLocaleString()}
              </div>
            ),
          },
          {
            accessorKey: 'paymentMode',
            header: 'Payment',
            cell: ({ row }) => (
              <div>
                <div className="fw-medium">{row.original.paymentMode}</div>
                <div className="text-sm text-secondary-light">{row.original.receiptNo}</div>
              </div>
            ),
          },
        ];

      case 'monthly-summary':
        return [
          {
            accessorKey: 'slNo',
            header: 'Sl.No.',
            cell: ({ row }) => (
              <div className="fw-medium">{row.original.slNo}</div>
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
            accessorKey: 'route',
            header: 'Route',
            cell: ({ row }) => (
              <div className="fw-medium">{row.original.route}</div>
            ),
          },
          {
            accessorKey: 'stage',
            header: 'Stage',
            cell: ({ row }) => (
              <div className="fw-medium text-primary">{row.original.stage}</div>
            ),
          },
          {
            accessorKey: 'studentCount',
            header: 'Students',
            cell: ({ row }) => (
              <div className="fw-medium text-center text-info">{row.original.studentCount}</div>
            ),
          },
          {
            accessorKey: 'passCount',
            header: 'Pass Count',
            cell: ({ row }) => (
              <div className="fw-medium text-center">{row.original.passCount}</div>
            ),
          },
          {
            accessorKey: 'revenue',
            header: 'Revenue',
            cell: ({ row }) => (
              <div className="fw-medium text-success">
                ₹{Number(row.original.revenue).toLocaleString()}
              </div>
            ),
          },
          {
            accessorKey: 'avgFarePerStudent',
            header: 'Avg Fare',
            cell: ({ row }) => (
              <div className="fw-medium text-primary">
                ₹{row.original.avgFarePerStudent}
              </div>
            ),
          },
        ];

      case 'year-summary':
        return [
          {
            accessorKey: 'slNo',
            header: 'Sl.No.',
            cell: ({ row }) => (
              <div className="fw-medium">{row.original.slNo}</div>
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
            accessorKey: 'route',
            header: 'Route',
            cell: ({ row }) => (
              <div className="fw-medium">{row.original.route}</div>
            ),
          },
          {
            accessorKey: 'totalStudents',
            header: 'Total Students',
            cell: ({ row }) => (
              <div className="fw-medium text-center text-info">{row.original.totalStudents}</div>
            ),
          },
          {
            accessorKey: 'passCount',
            header: 'Pass Count',
            cell: ({ row }) => (
              <div className="fw-medium text-center">{row.original.passCount}</div>
            ),
          },
          {
            accessorKey: 'revenue',
            header: 'Revenue',
            cell: ({ row }) => (
              <div className="fw-medium text-success">
                ₹{Number(row.original.revenue).toLocaleString()}
              </div>
            ),
          },
          {
            accessorKey: 'avgPerMonth',
            header: 'Avg/Month',
            cell: ({ row }) => (
              <div className="fw-medium text-center">{row.original.avgPerMonth}</div>
            ),
          },
        ];

      case 'student-ledger':
        return [
          {
            accessorKey: 'slNo',
            header: 'Sl.No.',
            cell: ({ row }) => (
              <div className="fw-medium">{row.original.slNo}</div>
            ),
          },
          {
            accessorKey: 'date',
            header: 'Date',
            cell: ({ row }) => (
              <div className="fw-medium">{row.original.date}</div>
            ),
          },
          {
            accessorKey: 'studentId',
            header: 'Student Details',
            cell: ({ row }) => (
              <div>
                <div className="fw-medium">{row.original.studentId}</div>
                <div className="text-sm text-secondary-light">{row.original.name}</div>
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
            accessorKey: 'particulars',
            header: 'Particulars',
            cell: ({ row }) => (
              <div>
                <div className="fw-medium">{row.original.particulars}</div>
                <div className="text-sm text-secondary-light">{row.original.period}</div>
              </div>
            ),
          },
          {
            accessorKey: 'debit',
            header: 'Debit',
            cell: ({ row }) => (
              <div className="fw-medium text-danger text-end">
                {row.original.debit > 0 ? `₹${Number(row.original.debit).toLocaleString()}` : '-'}
              </div>
            ),
          },
          {
            accessorKey: 'credit',
            header: 'Credit',
            cell: ({ row }) => (
              <div className="fw-medium text-success text-end">
                {row.original.credit > 0 ? `₹${Number(row.original.credit).toLocaleString()}` : '-'}
              </div>
            ),
          },
          {
            accessorKey: 'balance',
            header: 'Balance',
            cell: ({ row }) => (
              <div className="fw-medium text-primary text-end">
                ₹{Number(row.original.balance).toLocaleString()}
              </div>
            ),
          },
        ];

      case 'route-revenue':
        return [
          {
            accessorKey: 'slNo',
            header: 'Sl.No.',
            cell: ({ row }) => (
              <div className="fw-medium">{row.original.slNo}</div>
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
            accessorKey: 'route',
            header: 'Route Details',
            cell: ({ row }) => (
              <div>
                <div className="fw-medium">{row.original.route}</div>
                <div className="text-sm text-secondary-light">{row.original.stage}</div>
              </div>
            ),
          },
          {
            accessorKey: 'studentCount',
            header: 'Students',
            cell: ({ row }) => (
              <div className="fw-medium text-center text-info">{row.original.studentCount}</div>
            ),
          },
          {
            accessorKey: 'passes',
            header: 'Passes',
            cell: ({ row }) => (
              <div className="fw-medium text-center">{row.original.passes}</div>
            ),
          },
          {
            accessorKey: 'totalRevenue',
            header: 'Total Revenue',
            cell: ({ row }) => (
              <div className="fw-medium text-success">
                ₹{Number(row.original.totalRevenue).toLocaleString()}
              </div>
            ),
          },
          {
            accessorKey: 'avgFare',
            header: 'Avg Fare',
            cell: ({ row }) => (
              <div className="fw-medium text-info">
                ₹{Number(row.original.avgFare).toLocaleString()}
              </div>
            ),
          },
          {
            accessorKey: 'distance',
            header: 'Distance (km)',
            cell: ({ row }) => (
              <div className="fw-medium text-center">{row.original.distance}</div>
            ),
          },
        ];

      case 'outstanding-dues':
        return [
          {
            accessorKey: 'slNo',
            header: 'Sl.No.',
            cell: ({ row }) => (
              <div className="fw-medium">{row.original.slNo}</div>
            ),
          },
          {
            accessorKey: 'studentId',
            header: 'Student Details',
            cell: ({ row }) => (
              <div>
                <div className="fw-medium">{row.original.studentId}</div>
                <div className="text-sm text-secondary-light">{row.original.name}</div>
              </div>
            ),
          },
          {
            accessorKey: 'class',
            header: 'Class',
            cell: ({ row }) => (
              <div className="fw-medium text-primary">{row.original.class}</div>
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
            accessorKey: 'route',
            header: 'Route',
            cell: ({ row }) => (
              <div className="fw-medium">{row.original.route}</div>
            ),
          },
          {
            accessorKey: 'lastPaidTill',
            header: 'Payment Status',
            cell: ({ row }) => (
              <div>
                <div className="fw-medium">Till: {row.original.lastPaidTill}</div>
                <div className="text-sm text-secondary-light">Due: {row.original.dueFrom}</div>
              </div>
            ),
          },
          {
            accessorKey: 'estimatedDue',
            header: 'Due Amount',
            cell: ({ row }) => (
              <div className="fw-medium text-danger">
                ₹{Number(row.original.estimatedDue).toLocaleString()}
              </div>
            ),
          },
          {
            accessorKey: 'contact',
            header: 'Contact',
            cell: ({ row }) => (
              <div className="fw-medium">{row.original.contact}</div>
            ),
          },
        ];

      default:
        return [];
    }
  }, []);

  const chunkArray = (arr, size) => {
    const chunks = [];
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
      case 'daily-issues':
        return (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Sl.No</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Student Details</th>
                <th style={thStyle}>Class</th>
                <th style={thStyle}>Bus & Driver</th>
                <th style={thStyle}>Route</th>
                <th style={thStyle}>Pass Type</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>Payment</th>
              </tr>
            </thead>
            <tbody>
              {chunk.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{row.slNo}</td>
                  <td style={tdStyle}>{row.date}</td>
                  <td style={tdStyle}>{row.studentId}<br />{row.name}</td>
                  <td style={tdStyle}>{row.class}</td>
                  <td style={tdStyle}>{row.busNumber}<br />{row.driverId}</td>
                  <td style={tdStyle}>{row.route}<br />{row.stage}</td>
                  <td style={tdStyle}>{row.passType}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>₹{row.amount}</td>
                  <td style={tdStyle}>{row.paymentMode}<br />{row.receiptNo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'monthly-summary':
      case 'year-summary':
        return (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Sl.No</th>
                <th style={thStyle}>Bus & Driver</th>
                <th style={thStyle}>Route</th>
                <th style={thStyle}>{category === 'monthly-summary' ? 'Stage' : 'Total Students'}</th>
                <th style={thStyle}>{category === 'monthly-summary' ? 'Students' : 'Passes'}</th>
                <th style={thStyle}>Pass Count</th>
                <th style={thStyle}>Revenue</th>
                <th style={thStyle}>{category === 'monthly-summary' ? 'Avg Fare' : 'Avg/Month'}</th>
              </tr>
            </thead>
            <tbody>
              {chunk.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{row.slNo}</td>
                  <td style={tdStyle}>{row.busNumber}<br />{row.driverId}</td>
                  <td style={tdStyle}>{row.route}</td>
                  <td style={tdStyle}>{category === 'monthly-summary' ? row.stage : row.totalStudents}</td>
                  <td style={tdStyle}>{category === 'monthly-summary' ? row.studentCount : row.passCount}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{row.passCount}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>₹{row.revenue}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{category === 'monthly-summary' ? `₹\${row.avgFarePerStudent}` : row.avgPerMonth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'student-ledger':
        return (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Sl.No</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Student Info</th>
                <th style={thStyle}>Particulars</th>
                <th style={thStyle}>Debit</th>
                <th style={thStyle}>Credit</th>
                <th style={thStyle}>Balance</th>
              </tr>
            </thead>
            <tbody>
              {chunk.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{row.slNo}</td>
                  <td style={tdStyle}>{row.date}</td>
                  <td style={tdStyle}>{row.studentId}<br />{row.name}</td>
                  <td style={tdStyle}>{row.particulars}<br />{row.period}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>{row.debit > 0 ? `₹\${row.debit}` : '-'}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>{row.credit > 0 ? `₹\${row.credit}` : '-'}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 'bold' }}>₹{row.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'route-revenue':
        return (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Sl.No</th>
                <th style={thStyle}>Bus & Driver</th>
                <th style={thStyle}>Route & Stage</th>
                <th style={thStyle}>Students</th>
                <th style={thStyle}>Passes</th>
                <th style={thStyle}>Revenue</th>
                <th style={thStyle}>Avg Fare</th>
                <th style={thStyle}>Distance</th>
              </tr>
            </thead>
            <tbody>
              {chunk.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{row.slNo}</td>
                  <td style={tdStyle}>{row.busNumber}<br />{row.driverId}</td>
                  <td style={tdStyle}>{row.route}<br />{row.stage}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{row.studentCount}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{row.passes}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>₹{row.totalRevenue}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>₹{row.avgFare}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{row.distance} km</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'outstanding-dues':
        return (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Sl.No</th>
                <th style={thStyle}>Student Info</th>
                <th style={thStyle}>Class</th>
                <th style={thStyle}>Bus & Route</th>
                <th style={thStyle}>Payment Status</th>
                <th style={thStyle}>Due Amount</th>
                <th style={thStyle}>Contact</th>
              </tr>
            </thead>
            <tbody>
              {chunk.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{row.slNo}</td>
                  <td style={tdStyle}>{row.studentId}<br />{row.name}</td>
                  <td style={tdStyle}>{row.class}</td>
                  <td style={tdStyle}>{row.busNumber}<br />{row.route}</td>
                  <td style={tdStyle}>Till: {row.lastPaidTill}<br />Due: {row.dueFrom}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 'bold', color: 'red' }}>₹{row.estimatedDue}</td>
                  <td style={tdStyle}>{row.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleShowReport = useCallback(async () => {
    if (!filters.category) {
      toast.error('Please select a report category');
      return;
    }

    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const data = mockReportData[filters.category] || [];
      setReportData(data);

      // Calculate KPIs based on report type
      let kpis = { passesIssued: 0, revenue: 0, avgFare: 0 };

      if (filters.category === 'daily-issues') {
        kpis.passesIssued = data.length;
        kpis.revenue = data.reduce((sum, item) => sum + item.amount, 0);
        kpis.avgFare = kpis.passesIssued > 0 ? kpis.revenue / kpis.passesIssued : 0;
      } else if (filters.category === 'monthly-summary' || filters.category === 'year-summary') {
        kpis.passesIssued = data.reduce((sum, item) => sum + item.passCount, 0);
        kpis.revenue = data.reduce((sum, item) => sum + item.revenue, 0);
        kpis.avgFare = kpis.passesIssued > 0 ? kpis.revenue / kpis.passesIssued : 0;
      } else if (filters.category === 'route-revenue') {
        kpis.passesIssued = data.reduce((sum, item) => sum + item.passes, 0);
        kpis.revenue = data.reduce((sum, item) => sum + item.totalRevenue, 0);
        kpis.avgFare = kpis.passesIssued > 0 ? kpis.revenue / kpis.passesIssued : 0;
      }

      setKpiData(kpis);
      setShowReport(true);
      toast.success('Report generated successfully');

    } catch {
      toast.error('Error generating report');
    } finally {
      setLoading(false);
    }
  }, [filters, mockReportData]);

  const handleExportPDF = useCallback(() => {
    toast.success('PDF export functionality will be implemented');
  }, []);

  const handleExportExcel = useCallback(() => {
    toast.success('Excel export functionality will be implemented');
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Table action handlers
  const handleView = useCallback((item) => {
    console.log('View item:', item);
    toast.success(`Viewing record: ${item.studentId || item.route || item.slNo}`);
  }, []);

  const handleEdit = useCallback((item) => {
    console.log('Edit item:', item);
    toast.success(`Editing record: ${item.studentId || item.route || item.slNo}`);
  }, []);

  const handleDelete = useCallback((item) => {
    console.log('Delete item:', item);

    toast((t) => (
      <div>
        <p className="mb-2">Delete this record?</p>
        <div className="d-flex gap-2">
          <button
            className="btn btn-danger btn-sm"
            onClick={() => {
              setReportData(prev => prev.filter(r => r.slNo !== item.slNo));
              toast.dismiss(t.id);
              toast.success('Record deleted successfully!');
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
  }, []);

  const renderReportTable = () => {
    if (!showReport || reportData.length === 0) {
      return (
        <div className="text-center py-5">
          <p className="text-secondary-light">No records found for the selected criteria.</p>
        </div>
      );
    }

    const columns = getColumnsForCategory(filters.category);
    const reportTitle = REPORT_CATEGORIES.find(c => c.value === filters.category)?.label || 'Report';

    return (
      <DataTable
        data={reportData}
        columns={columns}
        loading={loading}
        title={reportTitle}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        enableExport={true}
        enableSelection={true}
        pageSize={10}
      />
    );
  };

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
              <h6 className="fw-semibold mb-0">Student Bus Fee Reports</h6>
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
                <li className="fw-medium">Bus Fee Reports</li>
              </ul>
            </div>

            {/* Filter Section */}
            <div className="card p-0 radius-12 mb-4">
              <div className="card-header border-bottom bg-base py-16 px-24">
                <h6 className="text-lg fw-semibold mb-0">Report Filters</h6>
              </div>

              <div className="card-body p-24">
                <div className="row mb-20">
                  <div className="col-md-2">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      From Date <span className="text-danger-600">*</span>
                    </label>
                    <input
                      type="date"
                      name="fromDate"
                      value={filters.fromDate}
                      onChange={handleFilterChange}
                      className="form-control radius-8"
                      required
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      To Date <span className="text-danger-600">*</span>
                    </label>
                    <input
                      type="date"
                      name="toDate"
                      value={filters.toDate}
                      onChange={handleFilterChange}
                      className="form-control radius-8"
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Report Category <span className="text-danger-600">*</span>
                    </label>
                    <select
                      name="category"
                      value={filters.category}
                      onChange={handleFilterChange}
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
                  <div className="col-md-2">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Class/Department
                    </label>
                    <select
                      name="class"
                      value={filters.class}
                      onChange={handleFilterChange}
                      className="form-select radius-8"
                    >
                      {CLASSES.map(cls => (
                        <option key={cls.value} value={cls.value}>
                          {cls.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Route Filter
                    </label>
                    <select
                      name="route"
                      value={filters.route}
                      onChange={handleFilterChange}
                      className="form-select radius-8"
                    >
                      {ROUTES.map(route => (
                        <option key={route.value} value={route.value}>
                          {route.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row g-3 mb-20">
                  <div className="col-md-3">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Bus Number
                    </label>
                    <select
                      name="busNumber"
                      value={filters.busNumber}
                      onChange={handleFilterChange}
                      className="form-select radius-8"
                    >
                      <option value="">All Buses</option>
                      {BUS_NUMBERS.map(bus => (
                        <option key={bus} value={bus}>{bus}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                      Driver ID
                    </label>
                    <select
                      name="driverId"
                      value={filters.driverId}
                      onChange={handleFilterChange}
                      className="form-select radius-8"
                    >
                      <option value="">All Drivers</option>
                      {DRIVER_IDS.map(driver => (
                        <option key={driver} value={driver}>{driver}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {filters.category === 'student-ledger' && (
                  <div className="row mb-20">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Student ID/Name Search
                      </label>
                      <input
                        type="text"
                        name="studentSearch"
                        value={filters.studentSearch}
                        onChange={handleFilterChange}
                        className="form-control radius-8"
                        placeholder="Enter Student ID or Name"
                      />
                    </div>
                  </div>
                )}

                <div className="d-flex align-items-center gap-3">
                  <button
                    type="button"
                    className="btn btn-outline-primary-600 btn-sm px-20 py-11 radius-8"
                    onClick={handleShowReport}
                    disabled={loading}
                  >
                    <i className="fas fa-chart-bar me-1"></i>
                    {loading ? 'Generating...' : 'SHOW REPORT'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm px-20 py-11 radius-8"
                    onClick={handleClose}
                  >
                    <i className="fas fa-times me-1"></i>
                    CLOSE
                  </button>
                </div>
              </div>
            </div>

            {/* KPI Section removed per request */}

            {/* Report Section */}
            {showReport && (
              <div className="mt-4">
                {/* Standardized Print Content */}
                <div id="student-bus-fee-report" className="student-bus-fee-report-print-container" style={{ display: 'none' }}>
                  <style>
                    {`
                      @media print {
                        body * { visibility: hidden; }
                        #student-bus-fee-report, #student-bus-fee-report * { visibility: visible; }
                        #student-bus-fee-report {
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
                          {REPORT_CATEGORIES.find(c => c.value === filters.category)?.label} REPORT
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '13px', color: "#000" }}>
                          <div>
                            <div><strong>Period:</strong> {filters.fromDate} to {filters.toDate}</div>
                            {filters.class && <div><strong>Class:</strong> {filters.class}</div>}
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            {filters.busNumber && <div><strong>Bus Number:</strong> {filters.busNumber}</div>}
                            {filters.route && <div><strong>Route:</strong> {filters.route}</div>}
                          </div>
                        </div>

                        <div style={{ flex: 1 }}>
                          {renderPrintTable(chunk, filters.category)}

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

                <div className="report-preview-container mt-4">
                  {/* Action Buttons */}
                  <div className="card mb-4">
                    <div className="card-header">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <h5 className="card-title mb-0">
                            {REPORT_CATEGORIES.find(c => c.value === filters.category)?.label} Report Preview
                          </h5>
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex justify-content-end gap-2">
                            <button
                              type="button"
                              className="btn btn-outline-success radius-8 px-20 py-11"
                              onClick={handleExportExcel}
                            >
                              <i className="fas fa-file-excel me-2"></i> Excel
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-primary radius-8 px-20 py-11"
                              onClick={handleExportPDF}
                            >
                              <i className="fas fa-file-pdf me-2"></i> PDF
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-success radius-8 px-20 py-11"
                              onClick={handlePrint}
                            >
                              <i className="fas fa-print me-2"></i> Print
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {renderReportTable()}
                </div>
              </div>
            )}
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default StudentBusFeeReports;
