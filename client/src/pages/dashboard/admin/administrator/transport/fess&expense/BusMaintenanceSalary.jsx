import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from '../../../../../../components/Sidebar';
import Navbar from '../../../../../../components/Navbar';
import Footer from '../../../../../../components/footer';
import DataTable from '../../../../../../components/DataTable';

// Constants
const DRIVER_IDS = ["BS001", "BS002", "BS003", "BS004", "BS005", "BS006", "BS007", "BS008", "BS009", "BS010"];
const BUS_NUMBERS = ["BUS01", "BUS02", "BUS03", "BUS04", "BUS05", "BUS06", "BUS07", "BUS08", "BUS09", "BUS10"];
const EXPENSE_TYPES = [
  "Engine Repair", "Oil Change", "Tire Replacement", "Brake Service", 
  "AC Service", "Body Work", "Battery Replacement", "Transmission Service",
  "Suspension Repair", "Electrical Work", "Cleaning Service", "Other"
];
const FUEL_TYPES = ["Petrol", "Diesel", "CNG"];

const DRIVER_BUS_MAPPING = {
  "BS001": "BUS01", "BS002": "BUS02", "BS003": "BUS03", "BS004": "BUS04", "BS005": "BUS05",
  "BS006": "BUS06", "BS007": "BUS07", "BS008": "BUS08", "BS009": "BUS09", "BS010": "BUS10"
};

const INITIAL_FORM_STATE = {
  // Maintenance fields
  date: new Date().toISOString().split('T')[0],
  busNumber: '',
  driverId: '',
  expenseType: '',
  vendor: '',
  billNumber: '',
  amount: '',
  tax: '',
  grandTotal: '',
  description: '',
  
  // Fuel fields
  fuelDate: new Date().toISOString().split('T')[0],
  fuelBusNumber: '',
  fuelDriverId: '',
  fuelType: 'Diesel',
  fuelQuantity: '',
  fuelRate: '',
  fuelTotalCost: '',
  fuelStation: '',
  
  // Salary fields
  salaryMonth: new Date().toISOString().slice(0, 7),
  salaryDriverId: '',
  baseSalary: '',
  tripAllowance: '',
  shiftAllowance: '',
  otHours: '',
  otRate: '',
  totalEarnings: '',
  deductions: '',
  advance: '',
  otherAdjustments: '',
  netPay: ''
};

const mockDrivers = [
  { id: 'BS001', name: 'Rajesh Kumar', phone: '9876543210', license: 'TN1234567890', experience: '5 years' },
  { id: 'BS002', name: 'Suresh Babu', phone: '9876543211', license: 'TN1234567891', experience: '8 years' },
  { id: 'BS003', name: 'Murugan S', phone: '9876543212', license: 'TN1234567892', experience: '3 years' },
  { id: 'BS004', name: 'Kumar Raja', phone: '9876543213', license: 'TN1234567893', experience: '6 years' },
  { id: 'BS005', name: 'Selvam P', phone: '9876543214', license: 'TN1234567894', experience: '4 years' },
  { id: 'BS006', name: 'Raman K', phone: '9876543215', license: 'TN1234567895', experience: '7 years' },
  { id: 'BS007', name: 'Ganesh M', phone: '9876543216', license: 'TN1234567896', experience: '2 years' },
  { id: 'BS008', name: 'Velu R', phone: '9876543217', license: 'TN1234567897', experience: '9 years' },
  { id: 'BS009', name: 'Arjun T', phone: '9876543218', license: 'TN1234567898', experience: '5 years' },
  { id: 'BS010', name: 'Dinesh V', phone: '9876543219', license: 'TN1234567899', experience: '6 years' }
];

const mockVehicles = [
  { busNumber: 'BUS01', model: 'Tata 407', capacity: 25, registrationNo: 'TN01AB1234', year: '2020' },
  { busNumber: 'BUS02', model: 'Ashok Leyland', capacity: 35, registrationNo: 'TN01AB1235', year: '2019' },
  { busNumber: 'BUS03', model: 'Mahindra Tourister', capacity: 30, registrationNo: 'TN01AB1236', year: '2021' },
  { busNumber: 'BUS04', model: 'Force Traveller', capacity: 20, registrationNo: 'TN01AB1237', year: '2020' },
  { busNumber: 'BUS05', model: 'Tata 407', capacity: 25, registrationNo: 'TN01AB1238', year: '2018' },
  { busNumber: 'BUS06', model: 'Ashok Leyland', capacity: 35, registrationNo: 'TN01AB1239', year: '2019' },
  { busNumber: 'BUS07', model: 'Mahindra Tourister', capacity: 30, registrationNo: 'TN01AB1240', year: '2021' },
  { busNumber: 'BUS08', model: 'Force Traveller', capacity: 20, registrationNo: 'TN01AB1241', year: '2022' },
  { busNumber: 'BUS09', model: 'Tata 407', capacity: 25, registrationNo: 'TN01AB1242', year: '2020' },
  { busNumber: 'BUS10', model: 'Ashok Leyland', capacity: 35, registrationNo: 'TN01AB1243', year: '2019' }
];

// Mock records for DataTable
const mockRecords = [
  {
    type: 'Maintenance',
    date: '2025-12-01',
    busNumber: 'BUS01',
    driver: 'Rajesh Kumar',
    expenseType: 'Engine Repair',
    vendor: 'ABC Motors',
    billNumber: 'BILL123',
    amount: 12000,
    tax: 1200,
    grandTotal: 13200,
    description: 'Engine overhaul',
  },
  {
    type: 'Fuel',
    date: '2025-12-01',
    busNumber: 'BUS02',
    driver: 'Suresh Babu',
    fuelType: 'Diesel',
    fuelQuantity: 50,
    fuelRate: 90,
    fuelTotalCost: 4500,
    fuelStation: 'HP Petrol',
    startOdometer: 12000,
    endOdometer: 12100,
    distance: 100,
    mileage: 2,
  },
  {
    type: 'Salary',
    salaryMonth: '2025-12',
    driver: 'Murugan S',
    baseSalary: 18000,
    tripAllowance: 2000,
    shiftAllowance: 1000,
    otHours: 5,
    otRate: 200,
    totalEarnings: 20000,
    deductions: 1000,
    advance: 2000,
    otherAdjustments: 0,
    netPay: 17000,
  },
];

// DataTable columns (FeeRecipt style)
const columns = [
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'date', header: 'Date' },
  { accessorKey: 'busNumber', header: 'Bus No' },
  { accessorKey: 'driver', header: 'Driver' },
  { accessorKey: 'expenseType', header: 'Expense Type' },
  { accessorKey: 'vendor', header: 'Vendor' },
  { accessorKey: 'billNumber', header: 'Bill No' },
  { accessorKey: 'amount', header: 'Amount', cell: ({ row }) => `₹${row.original.amount || row.original.fuelTotalCost || row.original.totalEarnings || row.original.netPay}` },
  { accessorKey: 'tax', header: 'Tax' },
  { accessorKey: 'grandTotal', header: 'Grand Total' },
  { accessorKey: 'fuelType', header: 'Fuel Type' },
  { accessorKey: 'fuelQuantity', header: 'Fuel Qty' },
  { accessorKey: 'fuelRate', header: 'Fuel Rate' },
  { accessorKey: 'fuelTotalCost', header: 'Fuel Cost' },
  { accessorKey: 'fuelStation', header: 'Fuel Station' },
  // ...removed Start Odo, End Odo, Distance, Mileage columns
  { accessorKey: 'salaryMonth', header: 'Salary Month' },
  { accessorKey: 'baseSalary', header: 'Base Salary' },
  { accessorKey: 'tripAllowance', header: 'Trip Allowance' },
  { accessorKey: 'shiftAllowance', header: 'Shift Allowance' },
  { accessorKey: 'otHours', header: 'OT Hours' },
  { accessorKey: 'otRate', header: 'OT Rate' },
  { accessorKey: 'totalEarnings', header: 'Total Earnings' },
  { accessorKey: 'deductions', header: 'Deductions' },
  { accessorKey: 'advance', header: 'Advance' },
  { accessorKey: 'otherAdjustments', header: 'Other Adj.' },
  { accessorKey: 'netPay', header: 'Net Pay' },
  { accessorKey: 'description', header: 'Description' },
];

const BusMaintenanceSalary = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('maintenance');
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showTable, setShowTable] = useState(false);

  // Initialize data
  useEffect(() => {
    setDrivers(mockDrivers);
    setVehicles(mockVehicles);
  }, [mockDrivers, mockVehicles]);

  // Auto-calculate grand total for maintenance
  useEffect(() => {
    if (form.amount && form.tax) {
      const amount = parseFloat(form.amount) || 0;
      const tax = parseFloat(form.tax) || 0;
      const grandTotal = amount + tax;
      setForm(prev => ({
        ...prev,
        grandTotal: grandTotal.toFixed(2)
      }));
    }
  }, [form.amount, form.tax]);

  // Auto-calculate fuel total cost
  useEffect(() => {
    if (form.fuelQuantity && form.fuelRate) {
      const quantity = parseFloat(form.fuelQuantity) || 0;
      const rate = parseFloat(form.fuelRate) || 0;
      const totalCost = quantity * rate;
      setForm(prev => ({
        ...prev,
        fuelTotalCost: totalCost.toFixed(2)
      }));
    }
  }, [form.fuelQuantity, form.fuelRate]);

  // ...removed auto-calc for distance/mileage

  // Auto-calculate salary totals
  useEffect(() => {
    const baseSalary = parseFloat(form.baseSalary) || 0;
    const tripAllowance = parseFloat(form.tripAllowance) || 0;
    const shiftAllowance = parseFloat(form.shiftAllowance) || 0;
    const otHours = parseFloat(form.otHours) || 0;
    const otRate = parseFloat(form.otRate) || 0;
    const deductions = parseFloat(form.deductions) || 0;
    const advance = parseFloat(form.advance) || 0;
    const otherAdjustments = parseFloat(form.otherAdjustments) || 0;

    const totalEarnings = baseSalary + tripAllowance + shiftAllowance + (otHours * otRate) + otherAdjustments;
    const netPay = totalEarnings - deductions - advance;

    setForm(prev => ({
      ...prev,
      totalEarnings: totalEarnings.toFixed(2),
      netPay: netPay.toFixed(2)
    }));
  }, [form.baseSalary, form.tripAllowance, form.shiftAllowance, form.otHours, form.otRate, form.deductions, form.advance, form.otherAdjustments]);

  // API functions (mock implementations)
  // const getDrivers = useCallback(async () => {
  //   return new Promise(resolve => {
  //     setTimeout(() => resolve({ success: true, data: mockDrivers }), 300);
  //   });
  // }, [mockDrivers]);

  const createMaintenance = useCallback(async (payload) => {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Creating maintenance record:', payload);
        resolve({ success: true, data: { id: Date.now(), ...payload } });
      }, 500);
    });
  }, []);

  const createFuelEntry = useCallback(async (payload) => {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Creating fuel entry:', payload);
        resolve({ success: true, data: { id: Date.now(), ...payload } });
      }, 500);
    });
  }, []);

  const createDriverPayroll = useCallback(async (payload) => {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Creating driver payroll:', payload);
        resolve({ success: true, data: { id: Date.now(), ...payload } });
      }, 500);
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

  const handleDriverChange = useCallback((driverId) => {
    const defaultBus = DRIVER_BUS_MAPPING[driverId] || '';
    setForm(prev => ({
      ...prev,
      driverId,
      busNumber: defaultBus
    }));
  }, []);

  const handleReset = useCallback(() => {
    setForm(INITIAL_FORM_STATE);
    toast.success('Form cleared successfully');
  }, []);

  const validateForm = useCallback(() => {
    if (!form.busNumber) {
      toast.error('Please select a bus number');
      return false;
    }
    if (!form.driverId) {
      toast.error('Please select a driver');
      return false;
    }
    if (!form.date) {
      toast.error('Please select a date');
      return false;
    }

    if (activeTab === 'maintenance') {
      if (!form.expenseType) {
        toast.error('Please select expense type');
        return false;
      }
      if (!form.amount || parseFloat(form.amount) < 0) {
        toast.error('Please enter a valid amount');
        return false;
      }
    }

    if (activeTab === 'fuel') {
      if (!form.fuelType) {
        toast.error('Please select fuel type');
        return false;
      }
      if (!form.fuelQuantity || parseFloat(form.fuelQuantity) <= 0) {
        toast.error('Please enter valid fuel quantity');
        return false;
      }
      if (form.endOdometer && form.startOdometer) {
        if (parseFloat(form.endOdometer) < parseFloat(form.startOdometer)) {
          toast.error('End odometer reading must be greater than start reading');
          return false;
        }
      }
    }

    if (activeTab === 'salary') {
      if (!form.payrollMonth) {
        toast.error('Please select payroll month');
        return false;
      }
      if (!form.baseSalary || parseFloat(form.baseSalary) < 0) {
        toast.error('Please enter valid base salary');
        return false;
      }
    }

    return true;
  }, [form, activeTab]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      let response;
      
      if (activeTab === 'maintenance') {
        const payload = {
          date: form.date,
          busNumber: form.busNumber,
          driverId: form.driverId,
          expenseType: form.expenseType,
          vendor: form.vendor,
          invoiceNo: form.invoiceNo,
          amount: parseFloat(form.amount),
          tax: parseFloat(form.tax) || 0,
          grandTotal: parseFloat(form.grandTotal),
          remarks: form.remarks,
          status: 'Pending',
          createdAt: new Date().toISOString()
        };
        response = await createMaintenance(payload);
        
      } else if (activeTab === 'fuel') {
        const payload = {
          date: form.date,
          busNumber: form.busNumber,
          driverId: form.driverId,
          fuelType: form.fuelType,
          quantity: parseFloat(form.fuelQuantity),
          rate: parseFloat(form.fuelRate),
          totalCost: parseFloat(form.fuelTotalCost),
          station: form.fuelStation,
          startOdometer: parseFloat(form.startOdometer) || 0,
          endOdometer: parseFloat(form.endOdometer) || 0,
          distance: parseFloat(form.distance) || 0,
          mileage: parseFloat(form.mileage) || 0,
          createdAt: new Date().toISOString()
        };
        response = await createFuelEntry(payload);
        
      } else if (activeTab === 'salary') {
        const payload = {
          driverId: form.driverId,
          payrollMonth: form.payrollMonth,
          baseSalary: parseFloat(form.baseSalary),
          tripAllowance: parseFloat(form.tripAllowance) || 0,
          shiftAllowance: parseFloat(form.shiftAllowance) || 0,
          otHours: parseFloat(form.otHours) || 0,
          otRate: parseFloat(form.otRate) || 0,
          deductions: parseFloat(form.deductions) || 0,
          advance: parseFloat(form.advance) || 0,
          otherAdjustments: parseFloat(form.otherAdjustments) || 0,
          totalEarnings: parseFloat(form.totalEarnings),
          netPay: parseFloat(form.netPay),
          lockMonth: form.lockMonth,
          createdAt: new Date().toISOString()
        };
        response = await createDriverPayroll(payload);
      }

      if (response?.success) {
        toast.success(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} record saved successfully!`);
        handleReset();
      } else {
        toast.error('Failed to save record');
      }
    } catch (error) {
      console.error('Error saving record:', error);
      toast.error('Error saving record');
    } finally {
      setLoading(false);
    }
  }, [form, activeTab, validateForm, createMaintenance, createFuelEntry, createDriverPayroll, handleReset]);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const toggleTable = useCallback(() => {
    setShowTable(prev => !prev);
  }, []);

  const getFilteredRecords = () => {
    if (activeTab === 'maintenance') {
      return mockRecords.filter(r => r.type === 'Maintenance');
    }
    if (activeTab === 'fuel') {
      return mockRecords.filter(r => r.type === 'Fuel');
    }
    if (activeTab === 'salary') {
      return mockRecords.filter(r => r.type === 'Salary');
    }
    return mockRecords;
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
              <h6 className="fw-semibold mb-0">Bus Maintenance & Salary Management</h6>
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
                <li className="fw-medium">Bus Maintenance & Salary</li>
              </ul>
            </div>

            <div className="card h-100 p-0 radius-12">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <h6 className="text-lg fw-semibold mb-2">Bus Maintenance & Driver Salary Management</h6>
                  <span className="text-sm fw-medium text-secondary-light">
                    Manage maintenance expenses, fuel entries, and driver payroll
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button 
                    type="button" 
                    className={`btn ${showTable ? 'btn-outline-warning' : 'btn-outline-info'} btn-sm`}
                    onClick={toggleTable}
                  >
                    <i className={`fas ${showTable ? 'fa-eye-slash' : 'fa-table'} me-1`}></i>
                    {showTable ? 'Hide Records' : 'View Records'}
                  </button>
                </div>
              </div>
              
              <div className="card-body p-24">
                {/* Tab Navigation */}
                <div className="mb-24">
                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === 'maintenance' ? 'active' : ''}`}
                        onClick={() => setActiveTab('maintenance')}
                        type="button"
                      >
                        <i className="fas fa-tools me-2"></i>
                        Maintenance
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === 'fuel' ? 'active' : ''}`}
                        onClick={() => setActiveTab('fuel')}
                        type="button"
                      >
                        <i className="fas fa-gas-pump me-2"></i>
                        Fuel Entry
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === 'salary' ? 'active' : ''}`}
                        onClick={() => setActiveTab('salary')}
                        type="button"
                      >
                        <i className="fas fa-money-bill-wave me-2"></i>
                        Driver Salary
                      </button>
                    </li>
                  </ul>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Common Fields */}
                  <div className="row mb-20">
                    <div className="col-md-3">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Date <span className="text-danger-600">*</span>
                      </label>
                      <input 
                        type="date" 
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        className="form-control radius-8" 
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Driver ID <span className="text-danger-600">*</span>
                      </label>
                      <select 
                        name="driverId"
                        value={form.driverId}
                        onChange={(e) => handleDriverChange(e.target.value)}
                        className="form-select radius-8"
                        required
                      >
                        <option value="">Select Driver</option>
                        {drivers.map(driver => (
                          <option key={driver.id} value={driver.id}>
                            {driver.id} - {driver.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Bus Number <span className="text-danger-600">*</span>
                      </label>
                      <select 
                        name="busNumber"
                        value={form.busNumber}
                        onChange={handleChange}
                        className="form-select radius-8"
                        required
                      >
                        <option value="">Select Bus</option>
                        {vehicles.map(vehicle => (
                          <option key={vehicle.busNumber} value={vehicle.busNumber}>
                            {vehicle.busNumber} - {vehicle.model}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Maintenance Tab */}
                  {activeTab === 'maintenance' && (
                    <>
                      <div className="border-bottom pb-3 mb-20">
                        <h6 className="text-md fw-semibold mb-3 text-primary-600">Maintenance Details</h6>
                      </div>
                      
                      <div className="row mb-20">
                        <div className="col-md-3">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Expense Type <span className="text-danger-600">*</span>
                          </label>
                          <select 
                            name="expenseType"
                            value={form.expenseType}
                            onChange={handleChange}
                            className="form-select radius-8"
                            required
                          >
                            <option value="">Select Type</option>
                            {EXPENSE_TYPES.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Vendor Name
                          </label>
                          <input 
                            type="text" 
                            name="vendor"
                            value={form.vendor}
                            onChange={handleChange}
                            className="form-control radius-8" 
                            placeholder="Enter vendor name"
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Invoice No
                          </label>
                          <input 
                            type="text" 
                            name="invoiceNo"
                            value={form.invoiceNo}
                            onChange={handleChange}
                            className="form-control radius-8" 
                            placeholder="Enter invoice number"
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Amount (₹) <span className="text-danger-600">*</span>
                          </label>
                          <input 
                            type="number" 
                            name="amount"
                            value={form.amount}
                            onChange={handleChange}
                            className="form-control radius-8" 
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                      </div>

                      <div className="row mb-20">
                        <div className="col-md-3">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Tax (₹)
                          </label>
                          <input 
                            type="number" 
                            name="tax"
                            value={form.tax}
                            onChange={handleChange}
                            className="form-control radius-8" 
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Grand Total (₹)
                          </label>
                          <input 
                            type="text" 
                            name="grandTotal"
                            value={form.grandTotal}
                            className="form-control radius-8 bg-success-50 fw-bold" 
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Remarks
                          </label>
                          <textarea 
                            name="remarks"
                            value={form.remarks}
                            onChange={handleChange}
                            className="form-control radius-8" 
                            rows="3"
                            placeholder="Enter maintenance details"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Fuel Tab */}
                  {activeTab === 'fuel' && (
                    <>
                      <div className="border-bottom pb-3 mb-20">
                        <h6 className="text-md fw-semibold mb-3 text-primary-600">Fuel Entry Details</h6>
                      </div>
                      
                      <div className="row mb-20">
                        <div className="col-md-2">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Fuel Type <span className="text-danger-600">*</span>
                          </label>
                          <select 
                            name="fuelType"
                            value={form.fuelType}
                            onChange={handleChange}
                            className="form-select radius-8"
                            required
                          >
                            {FUEL_TYPES.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-2">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Quantity (L) <span className="text-danger-600">*</span>
                          </label>
                          <input 
                            type="number" 
                            name="fuelQuantity"
                            value={form.fuelQuantity}
                            onChange={handleChange}
                            className="form-control radius-8" 
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Rate (₹/L) <span className="text-danger-600">*</span>
                          </label>
                          <input 
                            type="number" 
                            name="fuelRate"
                            value={form.fuelRate}
                            onChange={handleChange}
                            className="form-control radius-8" 
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Total Cost (₹)
                          </label>
                          <input 
                            type="text" 
                            name="fuelTotalCost"
                            value={form.fuelTotalCost}
                            className="form-control radius-8 bg-success-50 fw-bold" 
                            readOnly
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Fuel Station
                          </label>
                          <input 
                            type="text" 
                            name="fuelStation"
                            value={form.fuelStation}
                            onChange={handleChange}
                            className="form-control radius-8" 
                            placeholder="Enter fuel station name"
                          />
                        </div>
                      </div>

                      {/* ...removed Start Odometer, End Odometer, Distance, Mileage fields... */}
                    </>
                  )}

                  {/* Salary Tab */}
                  {activeTab === 'salary' && (
                    <>
                      <div className="border-bottom pb-3 mb-20">
                        <h6 className="text-md fw-semibold mb-3 text-primary-600">Driver Salary Details</h6>
                      </div>
                      
                      <div className="row mb-20">
                        <div className="col-md-3">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Payroll Month <span className="text-danger-600">*</span>
                          </label>
                          <input 
                            type="month" 
                            name="payrollMonth"
                            value={form.payrollMonth}
                            onChange={handleChange}
                            className="form-control radius-8" 
                            required
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Base Salary (₹) <span className="text-danger-600">*</span>
                          </label>
                          <input 
                            type="number" 
                            name="baseSalary"
                            value={form.baseSalary}
                            onChange={handleChange}
                            className="form-control radius-8" 
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Trip Allowance (₹)
                          </label>
                          <input 
                            type="number" 
                            name="tripAllowance"
                            value={form.tripAllowance}
                            onChange={handleChange}
                            className="form-control radius-8" 
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Shift Allowance (₹)
                          </label>
                          <input 
                            type="number" 
                            name="shiftAllowance"
                            value={form.shiftAllowance}
                            onChange={handleChange}
                            className="form-control radius-8" 
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>

                      <div className="row mb-20">
                        <div className="col-md-2">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            OT Hours
                          </label>
                          <input 
                            type="number" 
                            name="otHours"
                            value={form.otHours}
                            onChange={handleChange}
                            className="form-control radius-8" 
                            placeholder="0"
                            min="0"
                            step="0.5"
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            OT Rate (₹/hr)
                          </label>
                          <input 
                            type="number" 
                            name="otRate"
                            value={form.otRate}
                            onChange={handleChange}
                            className="form-control radius-8" 
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Deductions (₹)
                          </label>
                          <input 
                            type="number" 
                            name="deductions"
                            value={form.deductions}
                            onChange={handleChange}
                            className="form-control radius-8" 
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Advance (₹)
                          </label>
                          <input 
                            type="number" 
                            name="advance"
                            value={form.advance}
                            onChange={handleChange}
                            className="form-control radius-8" 
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Other Adjustments (₹)
                          </label>
                          <input 
                            type="number" 
                            name="otherAdjustments"
                            value={form.otherAdjustments}
                            onChange={handleChange}
                            className="form-control radius-8" 
                            placeholder="0.00"
                            step="0.01"
                          />
                        </div>
                        <div className="col-md-2">
                          <div className="form-check mt-4">
                            <input 
                              type="checkbox" 
                              name="lockMonth"
                              checked={form.lockMonth}
                              onChange={handleChange}
                              className="form-check-input" 
                              id="lockMonth"
                            />
                            <label className="form-check-label fw-semibold text-warning-600" htmlFor="lockMonth">
                              Lock Month
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="row mb-20">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Total Earnings (₹)
                          </label>
                          <input 
                            type="text" 
                            name="totalEarnings"
                            value={form.totalEarnings}
                            className="form-control radius-8 bg-success-50 fw-bold" 
                            readOnly
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                            Net Pay (₹)
                          </label>
                          <input 
                            type="text" 
                            name="netPay"
                            value={form.netPay}
                            className="form-control radius-8 bg-primary-50 fw-bold" 
                            readOnly
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Action Buttons */}
                  <div className="d-flex align-items-center justify-content-end flex-wrap gap-3">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary btn-sm px-20 py-11 radius-8"
                      onClick={handleReset}
                    >
                      <i className="fas fa-broom me-1"></i>
                      Reset
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
                      {loading ? 'Saving...' : `Save ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
                    </button>
                  </div>
                </form>

                {/* DataTable - Records */}
                {showTable && (
                  <div className="card h-100 p-0 radius-12 mb-4">
                    <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                      <h6 className="text-lg fw-semibold mb-2">Bus Maintenance, Fuel & Salary Records</h6>
                    </div>
                    <div className="card-body p-24">
                      <div className="table-responsive">
                        <DataTable
                          data={getFilteredRecords()}
                          columns={columns}
                          title="Bus Maintenance, Fuel & Salary Records"
                          enableSelection={false}
                          pageSize={10}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default BusMaintenanceSalary;
