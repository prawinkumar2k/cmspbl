import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from '../../../../../../components/Sidebar';
import Navbar from '../../../../../../components/Navbar';
import Footer from '../../../../../../components/footer';

const LOGO_SRC = '/assets/images/GRT.png';

const REPORT_CATEGORIES = [
  { id: 'daily', label: 'Daily Transport' },
  { id: 'monthly', label: 'Monthly Transport' },
  { id: 'year', label: 'Year Transport' },
  { id: 'route', label: 'Route Utilization' },
  { id: 'fuel', label: 'Fuel & Mileage' },
  { id: 'compliance', label: 'Compliance Register' }
];

const VEHICLE_TYPES = [
  { value: 'ALL', label: 'ALL' },
  { value: 'Bus', label: 'Bus' },
  { value: 'Mini Bus', label: 'Mini Bus' },
  { value: 'Van', label: 'Van' },
  { value: 'EV', label: 'EV' }
];

const TransportReports = () => {
  const navigate = useNavigate();
  const printRef = useRef(null);
  console.log('TransportReports component loaded successfully!');

  const [filters, setFilters] = useState({
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    type: 'ALL'
  });

  const [activeCategory, setActiveCategory] = useState('daily');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock API functions
  const getDailyFleet = useCallback(async ({ date, type }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = [
          {
            slNo: 1,
            vehicleNo: 'TN01AB1234',
            vehicleType: 'Bus',
            routeName: 'City Center Route',
            routeNo: '101',
            driver: 'Rajesh Kumar',
            conductor: 'Ramesh Sharma',
            trips: 4,
            distance: 120.5,
            revenue: 2400,
            startTime: '07:00',
            endTime: '19:30'
          },
          {
            slNo: 2,
            vehicleNo: 'TN02CD5678',
            vehicleType: 'Mini Bus',
            routeName: 'Industrial Area Route',
            routeNo: '102',
            driver: 'Suresh Singh',
            conductor: 'Dinesh Gupta',
            trips: 3,
            distance: 95.2,
            revenue: 1850,
            startTime: '07:30',
            endTime: '18:45'
          },
          {
            slNo: 3,
            vehicleNo: 'TN03EF9012',
            vehicleType: 'Van',
            routeName: 'Residential Complex Route',
            routeNo: '103',
            driver: 'Mahesh Patel',
            conductor: 'Ganesh Yadav',
            trips: 2,
            distance: 68.8,
            revenue: 1200,
            startTime: '08:00',
            endTime: '17:15'
          }
        ];

        let filteredData = mockData;
        if (type !== 'ALL') {
          filteredData = mockData.filter(item => item.vehicleType === type);
        }

        console.log('Fetching daily fleet for date:', date, 'type:', type);
        resolve({ success: true, data: filteredData });
      }, 1000);
    });
  }, []);

  const getMonthlyFleet = useCallback(async ({ month, year, type }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = [
          {
            slNo: 1,
            vehicleNo: 'TN01AB1234',
            routes: 'City Center Route, Market Route',
            totalTrips: 124,
            totalDistance: 3650.5,
            totalRevenue: 72400,
            avgRevenuePerTrip: 584
          },
          {
            slNo: 2,
            vehicleNo: 'TN02CD5678',
            routes: 'Industrial Area Route',
            totalTrips: 96,
            totalDistance: 2890.2,
            totalRevenue: 55800,
            avgRevenuePerTrip: 581
          }
        ];

        console.log('Fetching monthly fleet for:', month, year, 'type:', type);
        resolve({ success: true, data: mockData });
      }, 1000);
    });
  }, []);

  const getYearFleet = useCallback(async ({ year, type }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = [
          {
            slNo: 1,
            vehicleNo: 'TN01AB1234',
            monthsActive: 12,
            trips: 1488,
            distance: 43806,
            revenue: 868800,
            avgTripsPerMonth: 124
          },
          {
            slNo: 2,
            vehicleNo: 'TN02CD5678',
            monthsActive: 11,
            trips: 1056,
            distance: 31792,
            revenue: 638800,
            avgTripsPerMonth: 96
          }
        ];

        console.log('Fetching year fleet for:', year, 'type:', type);
        resolve({ success: true, data: mockData });
      }, 1000);
    });
  }, []);

  const getRouteUtilization = useCallback(async ({ from, to, type }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = [
          {
            routeName: 'City Center Route',
            vehicleNo: 'TN01AB1234',
            capacity: 45,
            avgOccupancy: 78,
            trips: 124,
            avgDistance: 28.5,
            underutilizedTrips: 12
          },
          {
            routeName: 'Industrial Area Route',
            vehicleNo: 'TN02CD5678',
            capacity: 25,
            avgOccupancy: 65,
            trips: 96,
            avgDistance: 32.1,
            underutilizedTrips: 28
          },
          {
            routeName: 'Residential Complex Route',
            vehicleNo: 'TN03EF9012',
            capacity: 12,
            avgOccupancy: 45,
            trips: 68,
            avgDistance: 24.8,
            underutilizedTrips: 42
          }
        ];

        console.log('Fetching route utilization for:', from, to, 'type:', type);
        resolve({ success: true, data: mockData });
      }, 1000);
    });
  }, []);

  const getFuelMileage = useCallback(async ({ from, to, type }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = [
          {
            slNo: 1,
            vehicleNo: 'TN01AB1234',
            fuelType: 'Diesel',
            fuelIssued: 1850.5,
            distance: 3650.5,
            mileage: 1.97,
            cost: 148040
          },
          {
            slNo: 2,
            vehicleNo: 'TN02CD5678',
            fuelType: 'CNG',
            fuelIssued: 1420.8,
            distance: 2890.2,
            mileage: 2.03,
            cost: 85248
          },
          {
            slNo: 3,
            vehicleNo: 'TN03EF9012',
            fuelType: 'Diesel',
            fuelIssued: 890.3,
            distance: 1680.8,
            mileage: 1.89,
            cost: 71224
          }
        ];

        console.log('Fetching fuel mileage for:', from, to, 'type:', type);
        resolve({ success: true, data: mockData });
      }, 1000);
    });
  }, []);

  const getComplianceRegister = useCallback(async ({ from, to, type }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = [
          {
            slNo: 1,
            vehicleNo: 'TN01AB1234',
            registration: 'TN01AB1234',
            insuranceExpiry: '2025-03-10',
            fitnessExpiry: '2024-12-15',
            permitExpiry: '2024-11-25',
            lastService: '2024-10-15',
            nextServiceDue: '2024-12-15',
            status: 'warning'
          },
          {
            slNo: 2,
            vehicleNo: 'TN02CD5678',
            registration: 'TN02CD5678',
            insuranceExpiry: '2025-02-15',
            fitnessExpiry: '2025-01-20',
            permitExpiry: '2024-12-05',
            lastService: '2024-10-20',
            nextServiceDue: '2024-12-20',
            status: 'good'
          },
          {
            slNo: 3,
            vehicleNo: 'TN03EF9012',
            registration: 'TN03EF9012',
            insuranceExpiry: '2024-11-30',
            fitnessExpiry: '2025-02-28',
            permitExpiry: '2025-01-10',
            lastService: '2024-11-01',
            nextServiceDue: '2025-01-01',
            status: 'critical'
          }
        ];

        console.log('Fetching compliance register for:', from, to, 'type:', type);
        resolve({ success: true, data: mockData });
      }, 1000);
    });
  }, []);

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleShow = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      switch (activeCategory) {
        case 'daily': {
          response = await getDailyFleet({
            date: filters.fromDate,
            type: filters.type
          });
          break;
        }
        case 'monthly': {
          const date = new Date(filters.fromDate);
          response = await getMonthlyFleet({
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            type: filters.type
          });
          break;
        }
        case 'year': {
          const yearDate = new Date(filters.fromDate);
          response = await getYearFleet({
            year: yearDate.getFullYear(),
            type: filters.type
          });
          break;
        }
        case 'route': {
          response = await getRouteUtilization({
            from: filters.fromDate,
            to: filters.toDate,
            type: filters.type
          });
          break;
        }
        case 'fuel': {
          response = await getFuelMileage({
            from: filters.fromDate,
            to: filters.toDate,
            type: filters.type
          });
          break;
        }
        case 'compliance': {
          response = await getComplianceRegister({
            from: filters.fromDate,
            to: filters.toDate,
            type: filters.type
          });
          break;
        }
        default: {
          response = { success: false, message: 'Invalid category' };
          break;
        }
      }

      if (response.success) {
        setReportData(response.data);
        toast.success('Report generated successfully');
      } else {
        toast.error(response.message || 'Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Error generating report');
    } finally {
      setLoading(false);
    }
  }, [activeCategory, filters, getDailyFleet, getMonthlyFleet, getYearFleet, getRouteUtilization, getFuelMileage, getComplianceRegister]);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handlePrint = useCallback(() => {
    if (!reportData) {
      toast.error('No data to print');
      return;
    }
    window.print();
  }, [reportData]);

  const handleExport = useCallback((format) => {
    if (!reportData) {
      toast.error('No data to export');
      return;
    }

    if (format === 'pdf') {
      toast.success('PDF export functionality will be implemented');
    } else if (format === 'xlsx') {
      toast.success('Excel export functionality will be implemented');
    }
  }, [reportData]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
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
        <div style={{ borderTop: '1.5px solid #000', width: '180px', marginBottom: '8px' }}></div>
        <div style={{ fontSize: '13px', fontWeight: '700' }}>Transport In-charge</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ borderTop: '1.5px solid #000', width: '180px', marginBottom: '8px' }}></div>
        <div style={{ fontSize: '13px', fontWeight: '700' }}>AO / HOD</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ borderTop: '1.5px solid #000', width: '180px', marginBottom: '8px' }}></div>
        <div style={{ fontSize: '13px', fontWeight: '700' }}>Principal</div>
      </div>
    </div>
  );

  const getReportTitle = useCallback(() => {
    switch (activeCategory) {
      case 'daily':
        return `Daily Transport - Vehicle Movements (${formatDate(filters.fromDate)})`;
      case 'monthly': {
        const monthDate = new Date(filters.fromDate);
        return `Monthly Transport Summary (${monthDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })})`;
      }
      case 'year': {
        const yearDate = new Date(filters.fromDate);
        return `Year Transport Consolidated (${yearDate.getFullYear()})`;
      }
      case 'route':
        return `Route Utilization Report (${formatDate(filters.fromDate)} - ${formatDate(filters.toDate)})`;
      case 'fuel':
        return `Fuel & Mileage Report (${formatDate(filters.fromDate)} - ${formatDate(filters.toDate)})`;
      case 'compliance':
        return `Compliance Register Report (${formatDate(filters.fromDate)} - ${formatDate(filters.toDate)})`;
      default:
        return 'Transport Report';
    }
  }, [activeCategory, filters, formatDate]);

  const renderReportTable = (data, category) => {
    if (!data || !Array.isArray(data)) return null;

    switch (category) {
      case 'daily':
        return (
          <table className="transport-table">
            <thead>
              <tr>
                <th>Sl.No.</th>
                <th>Vehicle No</th>
                <th>Vehicle Type</th>
                <th>Route Name</th>
                <th>Route No</th>
                <th>Driver</th>
                <th>Conductor</th>
                <th>Trips</th>
                <th>Distance (km)</th>
                <th>Revenue (₹)</th>
                <th>Start–End Time</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  <td className="center">{row.slNo}</td>
                  <td className="center">{row.vehicleNo}</td>
                  <td>{row.vehicleType}</td>
                  <td>{row.routeName}</td>
                  <td className="center">{row.routeNo}</td>
                  <td>{row.driver}</td>
                  <td>{row.conductor}</td>
                  <td className="center">{row.trips}</td>
                  <td className="right">{row.distance}</td>
                  <td className="right">{row.revenue}</td>
                  <td className="center">{row.startTime}–{row.endTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'monthly':
        return (
          <table className="transport-table">
            <thead>
              <tr>
                <th>Sl.No.</th>
                <th>Vehicle No</th>
                <th>Route(s)</th>
                <th>Total Trips</th>
                <th>Total Distance (km)</th>
                <th>Total Revenue (₹)</th>
                <th>Avg. Revenue/Trip (₹)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  <td className="center">{row.slNo}</td>
                  <td className="center">{row.vehicleNo}</td>
                  <td>{row.routes}</td>
                  <td className="center">{row.totalTrips}</td>
                  <td className="right">{row.totalDistance}</td>
                  <td className="right">{row.totalRevenue}</td>
                  <td className="right">{row.avgRevenuePerTrip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'year':
        return (
          <table className="transport-table">
            <thead>
              <tr>
                <th>Sl.No.</th>
                <th>Vehicle No</th>
                <th>Months Active</th>
                <th>Total Trips</th>
                <th>Total Distance (km)</th>
                <th>Total Revenue (₹)</th>
                <th>Avg. Trips/Month</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  <td className="center">{row.slNo}</td>
                  <td className="center">{row.vehicleNo}</td>
                  <td className="center">{row.monthsActive}</td>
                  <td className="center">{row.trips}</td>
                  <td className="right">{row.distance}</td>
                  <td className="right">{row.revenue}</td>
                  <td className="center">{row.avgTripsPerMonth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'route':
        return (
          <table className="transport-table">
            <thead>
              <tr>
                <th>Route Name</th>
                <th>Vehicle No</th>
                <th>Capacity</th>
                <th>Avg. Occupancy%</th>
                <th>Trips</th>
                <th>Avg. Distance (km)</th>
                <th>Underutilized Trips</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className={row.avgOccupancy < 60 ? 'underutilized' : ''}>
                  <td>{row.routeName}</td>
                  <td className="center">{row.vehicleNo}</td>
                  <td className="center">{row.capacity}</td>
                  <td className="center">{row.avgOccupancy}%</td>
                  <td className="center">{row.trips}</td>
                  <td className="right">{row.avgDistance}</td>
                  <td className="center">{row.underutilizedTrips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'fuel':
        return (
          <table className="transport-table">
            <thead>
              <tr>
                <th>Sl.No.</th>
                <th>Vehicle No</th>
                <th>Fuel Type</th>
                <th>Fuel Issued (L)</th>
                <th>Distance (km)</th>
                <th>Mileage (km/L)</th>
                <th>Cost (₹)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  <td className="center">{row.slNo}</td>
                  <td className="center">{row.vehicleNo}</td>
                  <td className="center">{row.fuelType}</td>
                  <td className="right">{row.fuelIssued}</td>
                  <td className="right">{row.distance}</td>
                  <td className="right">{row.mileage}</td>
                  <td className="right">{row.cost ? row.cost.toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'compliance':
        return (
          <table className="transport-table">
            <thead>
              <tr>
                <th>Sl.No.</th>
                <th>Vehicle No</th>
                <th>Registration</th>
                <th>Insurance Expiry</th>
                <th>Fitness Expiry</th>
                <th>Permit Expiry</th>
                <th>Last Service</th>
                <th>Next Service Due</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className={row.status === 'critical' ? 'critical' : row.status === 'warning' ? 'warning' : ''}>
                  <td className="center">{row.slNo}</td>
                  <td className="center">{row.vehicleNo}</td>
                  <td className="center">{row.registration}</td>
                  <td className="center">{formatDate(row.insuranceExpiry)}</td>
                  <td className="center">{formatDate(row.fitnessExpiry)}</td>
                  <td className="center">{formatDate(row.permitExpiry)}</td>
                  <td className="center">{formatDate(row.lastService)}</td>
                  <td className="center">{formatDate(row.nextServiceDue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };

  const renderReport = () => {
    return renderReportTable(reportData, activeCategory);
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

            {/* Report Categories */}
            <div className="report-categories mb-3">
              {REPORT_CATEGORIES.map(category => (
                <button
                  key={category.id}
                  type="button"
                  className={`btn btn-sm me-2 ${activeCategory === category.id ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Filter Bar */}
            <div className="filter-bar mb-4">
              <div className="row g-3">
                <div className="col-12 col-md-6 col-lg-4">
                  <label className="filter-label">From Date</label>
                  <input
                    type="date"
                    name="fromDate"
                    value={filters.fromDate}
                    onChange={handleFilterChange}
                    className="form-control form-control-sm filter-input"
                    style={{ minWidth: '130px' }}
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                  <label className="filter-label">To Date</label>
                  <input
                    type="date"
                    name="toDate"
                    value={filters.toDate}
                    onChange={handleFilterChange}
                    className="form-control form-control-sm filter-input"
                    style={{ minWidth: '130px' }}
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-4">
                  <label className="filter-label">Type</label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="form-select form-select filter-input"
                    style={{ minWidth: '120px' }}
                  >
                    {VEHICLE_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>


                <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                  <div className="col-auto">
                    <button
                      type="button"
                      className="btn btn-outline-primary-600 radius-8 px-20 py-11"
                      onClick={handleShow}
                      disabled={loading}
                      style={{ minWidth: '80px' }}
                    >
                      {loading ? 'Loading...' : 'SHOW'}
                    </button>
                  </div>
                  <div className="col-auto">
                    <button
                      type="button"
                      className="btn btn-outline-danger-600 radius-8 px-20 py-11"
                      onClick={handleClose}
                      style={{ minWidth: '80px' }}
                    >
                      CLOSE
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Content */}
            <div className="report-container">
              {reportData ? (
                <>
                  {/* Action Buttons */}
                  <div className="report-actions mb-3">
                    <button
                      type="button"
                      className="btn btn-outline-success radius-8 px-20 py-11 me-2"
                      onClick={handlePrint}
                    >
                      <i className="fas fa-print me-2"></i>
                      Print
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-primary radius-8 px-20 py-11 me-2"
                      onClick={() => handleExport('pdf')}
                    >
                      <i className="fas fa-file-pdf me-2"></i>
                      Export PDF
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-info radius-8 px-20 py-11"
                      onClick={() => handleExport('xlsx')}
                    >
                      <i className="fas fa-file-excel me-2"></i>
                      Export Excel
                    </button>
                  </div>

                  {/* Standardized Print Content */}
                  <div id="transport-report" className="transport-report-print-container" style={{ display: 'none' }}>
                    <style>
                      {`
                        @media print {
                          body * { visibility: hidden; }
                          #transport-report, #transport-report * { visibility: visible; }
                          #transport-report {
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
                            min-height: 190mm; /* A4 Landscape relative height */
                            display: flex;
                            flex-direction: column;
                            box-sizing: border-box;
                            margin-bottom: 0;
                          }
                          .page-container:last-child {
                            page-break-after: auto;
                          }
                          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                          @page { size: A4 landscape; margin: 5mm; }
                        }
                      `}
                    </style>
                    {(() => {
                      const ROWS_PER_PAGE = 15;
                      const chunks = chunkArray(reportData, ROWS_PER_PAGE);

                      return chunks.map((chunk, pageIdx) => (
                        <div key={pageIdx} className="page-container" style={{ background: '#fff', fontFamily: "'Times New Roman', serif" }}>
                          {renderHeader()}

                          <div style={{ textAlign: "center", fontSize: "18px", fontWeight: "900", textDecoration: "underline", marginBottom: "20px", color: "#000", textTransform: 'uppercase' }}>
                            {getReportTitle()}
                          </div>

                          <div style={{ flex: 1 }}>
                            {renderReportTable(chunk, activeCategory)}

                            {/* Empty rows to maintain table height if needed */}
                            {chunk.length < ROWS_PER_PAGE && (
                              <table className="transport-table" style={{ borderTop: 'none' }}>
                                <tbody>
                                  {Array.from({ length: ROWS_PER_PAGE - chunk.length }).map((_, i) => (
                                    <tr key={`empty-\${i}`}>
                                      {activeCategory === 'daily' && Array.from({ length: 11 }).map((_, j) => <td key={j} style={{ padding: '16px' }}>&nbsp;</td>)}
                                      {activeCategory === 'monthly' && Array.from({ length: 7 }).map((_, j) => <td key={j} style={{ padding: '16px' }}>&nbsp;</td>)}
                                      {activeCategory === 'year' && Array.from({ length: 7 }).map((_, j) => <td key={j} style={{ padding: '16px' }}>&nbsp;</td>)}
                                      {activeCategory === 'route' && Array.from({ length: 7 }).map((_, j) => <td key={j} style={{ padding: '16px' }}>&nbsp;</td>)}
                                      {activeCategory === 'fuel' && Array.from({ length: 7 }).map((_, j) => <td key={j} style={{ padding: '16px' }}>&nbsp;</td>)}
                                      {activeCategory === 'compliance' && Array.from({ length: 8 }).map((_, j) => <td key={j} style={{ padding: '16px' }}>&nbsp;</td>)}
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

                  <div className="report-content-preview">
                    {renderReport()}
                  </div>
                </>
              ) : (
                <div className="no-data">
                  <p>No records found for the selected criteria.</p>
                  <p>Please select filters and click "SHOW" to generate report.</p>
                </div>
              )}
            </div>
          </div>
          <Footer />
        </div>
      </section>

      {/* Custom Styles */}
      <style jsx>{`
        .report-categories {
          margin-bottom: 20px;
        }

        .filter-bar {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          border: 1px solid #dee2e6;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .filter-bar .row {
          align-items: end;
        }

        .filter-bar .col-auto {
          margin-bottom: 5px;
        }

        .filter-label {
          font-size: 11px;
          font-weight: 500;
          color: #333;
          margin-bottom: 2px;
          display: block;
        }

        .filter-input {
          font-size: 12px;
          height: 32px;
          border: 1px solid #ced4da;
          border-radius: 4px;
          padding: 4px 8px;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }

        .filter-input:focus {
          border-color: #86b7fe;
          outline: 0;
          box-shadow: 0 0 0 0.15rem rgba(13, 110, 253, 0.25);
        }

        .form-select.filter-input {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m1 6 7 7 7-7'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 8px center;
          background-size: 12px 12px;
          padding-right: 28px;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
        }

        .btn-dark.btn-sm {
          background-color: #495057;
          border-color: #495057;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-dark.btn-sm:hover {
          background-color: #343a40;
          border-color: #343a40;
        }

        .btn-secondary.btn-sm {
          background-color: #6c757d;
          border-color: #6c757d;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-secondary.btn-sm:hover {
          background-color: #5c636a;
          border-color: #5c636a;
        }

        .report-container {
          background: white;
          border: 1px solid #ddd;
          border-radius: 5px;
          padding: 20px;
          min-height: 400px;
        }

        .report-actions {
          text-align: right;
        }

        .report-content {
          width: 100%;
        }

        .report-header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 1px solid #ccc;
          padding-bottom: 15px;
        }

        .college-title {
          color: #d63031;
          font-size: 16px;
          font-weight: bold;
          margin: 0 0 5px 0;
          text-transform: uppercase;
        }

        .report-title {
          font-size: 14px;
          font-weight: bold;
          margin: 0 0 10px 0;
          color: #333;
        }

        .transport-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 11px;
          border: 1px solid #000;
        }

        .transport-table th,
        .transport-table td {
          border: 1px solid #000;
          padding: 4px 6px;
          text-align: left;
          vertical-align: top;
        }

        .transport-table th {
          background: #f5f5f5;
          font-weight: bold;
          text-align: center;
          font-size: 10px;
        }

        .center {
          text-align: center;
        }

        .right {
          text-align: right;
        }

        .underutilized {
          background-color: #fff3cd;
        }

        .warning {
          background-color: #fff3cd;
        }

        .critical {
          background-color: #f8d7da;
        }

        .no-data {
          text-align: center;
          padding: 50px;
          color: #666;
        }

        @media print {
          .dashboard-main {
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .sidebar, .navbar, .footer, .report-categories, .filter-bar, .report-actions {
            display: none !important;
          }
          
          .report-container {
            border: none;
            padding: 0;
            box-shadow: none;
          }
          
          .report-content {
            padding: 20px;
          }
          
          .transport-table {
            page-break-inside: auto;
          }
          
          .transport-table tr {
            page-break-inside: avoid;
          }
          
          .report-header {
            page-break-after: avoid;
          }
          
          @page {
            margin: 1cm;
            size: A4 landscape;
          }
        }
      `}</style>
    </>
  );
};

export default TransportReports;
