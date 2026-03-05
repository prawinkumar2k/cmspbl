import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from '../../../../../../components/Sidebar';
import Navbar from '../../../../../../components/Navbar';
import Footer from '../../../../../../components/footer';

const VEHICLE_TYPES = [
  { value: 'Bus', label: 'Bus' },
  { value: 'Mini Bus', label: 'Mini Bus' }
];

const SHIFTS = [
  { value: 'Morning', label: 'Morning' },
  { value: 'Evening', label: 'Evening' },
  { value: 'Both', label: 'Both' }
];

const FUEL_TYPES = [
  { value: 'Diesel', label: 'Diesel' },
  { value: 'CNG', label: 'CNG' },
  { value: 'EV-kWh', label: 'EV-kWh' }
];

const INITIAL_FORM_STATE = {
  date: new Date().toISOString().split('T')[0],
  shift: 'Morning',
  busNumber: '',
  vehicleType: '',
  capacity: '',
  registrationNo: '',
  fitnessExpiry: '',
  permitExpiry: '',
  insuranceExpiry: '',
  routeName: '',
  routeNo: '',
  stageNo: '',
  stageName: '',
  amount: '',
  driver: '',
  driverId: '',
  gateEntryTime: '',
  gateExitTime: '',
  startOdo: '',
  endOdo: '',
  distance: '',
  collectedAmount: '',
  fuelIssued: '',
  fuelType: 'Diesel',
  mileage: '',
  issues: '',
  remarks: ''
};

const apiBase = '/api/transport';

const TransportEntry = () => {
  const navigate = useNavigate();
  // console.log('TransportEntry component loaded successfully!');

  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);

  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [stages, setStages] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [complianceWarnings, setComplianceWarnings] = useState([]);

  // -------------- LOAD MASTER DATA FROM BACKEND ----------------
  useEffect(() => {
    const fetchMasterData = async () => {
      setLoading(true);
      try {
        const [vRes, rRes, dRes] = await Promise.all([
          fetch(`${apiBase}/vehicles`),
          fetch(`${apiBase}/routes`),
          fetch(`${apiBase}/drivers`)
        ]);

        if (!vRes.ok || !rRes.ok || !dRes.ok) {
          throw new Error('Failed to fetch one or more resources');
        }

        const [vJson, rJson, dJson] = await Promise.all([
          vRes.json(),
          rRes.json(),
          dRes.json()
        ]);

        setVehicles(vJson.data || []);
        setRoutes(rJson.data || []);
        setDrivers(dJson.data || []);
      } catch (err) {
        console.error('fetchMasterData error', err);
        toast.error('Failed to load transport data');
      } finally {
        setLoading(false);
      }
    };

    fetchMasterData();
  }, []);

  // -------------- COMPLIANCE WARNINGS (from backend vehicle dates) --------------
  useEffect(() => {
    if (form.busNumber && vehicles.length) {
      const vehicle = vehicles.find(
        v => (v.vehicle_number || v.busNumber) === form.busNumber
      );
      if (!vehicle) {
        setComplianceWarnings([]);
        return;
      }

      const warnings = [];
      const today = new Date();
      const thirtyDaysFromNow = new Date(
        today.getTime() + 30 * 24 * 60 * 60 * 1000
      );

      const fitnessDateStr =
        vehicle.fitness_expiry || vehicle.fitnessExpiry || null;
      const permitDateStr =
        vehicle.permit_expiry || vehicle.permitExpiry || null;
      const insuranceDateStr =
        vehicle.insurance_expiry || vehicle.insuranceExpiry || null;

      const checkDate = (label, dateStr) => {
        if (!dateStr) return;
        const expiryDate = new Date(dateStr);
        if (expiryDate <= thirtyDaysFromNow) {
          warnings.push(
            `${label} expires on ${expiryDate.toLocaleDateString()}`
          );
        }
      };

      checkDate('Fitness', fitnessDateStr);
      checkDate('Permit', permitDateStr);
      checkDate('Insurance', insuranceDateStr);

      setComplianceWarnings(warnings);
    } else {
      setComplianceWarnings([]);
    }
  }, [form.busNumber, vehicles]);

  // -------------- API: CREATE DAILY LOG → /api/transport/entries --------------
  const createVehicleRouteLog = useCallback(async payload => {
    try {
      // ✅ CHANGED: use /api/transport/entries (not /daily-logs)
      const res = await fetch(`${apiBase}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error('createVehicleRouteLog failed', txt);
        return { success: false };
      }

      const json = await res.json();
      return { success: json.success, data: json.data };
    } catch (err) {
      console.error('createVehicleRouteLog error', err);
      return { success: false };
    }
  }, []);

  // -------------- FORM HANDLERS ----------------
  const handleChange = useCallback(
    e => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));

      // Auto-calculations
      if (name === 'startOdo' || name === 'endOdo') {
        const startOdo =
          name === 'startOdo'
            ? parseFloat(value) || 0
            : parseFloat(form.startOdo) || 0;
        const endOdo =
          name === 'endOdo'
            ? parseFloat(value) || 0
            : parseFloat(form.endOdo) || 0;

        if (endOdo > startOdo) {
          const distance = endOdo - startOdo;
          setForm(prev => ({ ...prev, distance: distance.toString() }));

          const fuel = parseFloat(form.fuelIssued) || 0;
          if (fuel > 0) {
            const mileage = (distance / fuel).toFixed(2);
            setForm(prev => ({ ...prev, mileage }));
          }
        }
      }

      if (name === 'fuelIssued') {
        const fuel = parseFloat(value) || 0;
        const distance = parseFloat(form.distance) || 0;
        if (fuel > 0 && distance > 0) {
          const mileage = (distance / fuel).toFixed(2);
          setForm(prev => ({ ...prev, mileage }));
        }
      }

      // Auto-fill distance based on vehicle type
      if (name === 'vehicleType') {
        let defaultDistance = '';
        if (value === 'Bus') {
          defaultDistance = '45';
        } else if (value === 'Mini Bus') {
          defaultDistance = '10';
        }
        setForm(prev => ({ ...prev, distance: defaultDistance }));
      }
    },
    [form.startOdo, form.endOdo, form.distance, form.fuelIssued]
  );

  // When user selects a bus number from dropdown
  const handleVehicleSelect = useCallback(
    busNumber => {
      if (!busNumber) return;

      const vehicle = vehicles.find(
        v => (v.vehicle_number || v.busNumber) === busNumber
      );
      if (!vehicle) return;

      const vType = vehicle.vehicle_type || vehicle.vehicleType || '';
      let defaultDistance = '';
      if (vType === 'Bus') defaultDistance = '45';
      else if (vType === 'Mini Bus') defaultDistance = '10';

      // Try to derive driver name from assigned_driver_id if available
      let driverName = form.driver;
      const assignedDriverId =
        vehicle.assigned_driver_id || vehicle.assignedDriverId || null;
      if (assignedDriverId && drivers.length) {
        const drv = drivers.find(d => d.id === assignedDriverId);
        if (drv) {
          driverName = drv.driver_name || drv.driverName || driverName;
        }
      }

      setForm(prev => ({
        ...prev,
        busNumber: vehicle.vehicle_number || vehicle.busNumber || '',
        vehicleType: vType,
        capacity: String(vehicle.seating_capacity || vehicle.capacity || ''),
        registrationNo:
          vehicle.registration_no || vehicle.registrationNo || '',
        fitnessExpiry:
          vehicle.fitness_expiry || vehicle.fitnessExpiry || '',
        permitExpiry: vehicle.permit_expiry || vehicle.permitExpiry || '',
        insuranceExpiry:
          vehicle.insurance_expiry || vehicle.insuranceExpiry || '',
        distance: defaultDistance,
        driver: driverName
      }));
    },
    [vehicles, drivers, form.driver]
  );

  // When user selects route
  const handleRouteSelect = useCallback(
    routeName => {
      if (!routeName) return;

      const route = routes.find(
        r => (r.route_name || r.routeName) === routeName
      );
      if (!route) {
        setStages([]);
        return;
      }

      const routeNo = route.route_no || route.routeNo || '';

      // Try to get driver from route if you store id/name there
      let driverName = form.driver;
      const routeDriverName =
        route.assigned_driver_name || route.assignedDriver || null;
      if (routeDriverName) {
        driverName = routeDriverName;
      }

      setForm(prev => ({
        ...prev,
        routeName: routeName,
        routeNo: routeNo,
        driver: driverName,
        stageNo: '',
        stageName: '',
        amount: ''
      }));

      // Map backend stages (route.stages) to UI format
      const backendStages = route.stages || [];
      const mappedStages = backendStages.map((s, index) => ({
        stageNo: String(
          s.sequence_no ?? s.stageNo ?? index + 1
        ),
        stageName: s.stage_name || s.stageName || '',
        amount: String(s.stage_fee || s.stageFee || '')
      }));
      setStages(mappedStages);
    },
    [routes, form.driver]
  );

  const handleStageSelect = useCallback(
    stageNo => {
      const stage = stages.find(s => s.stageNo === stageNo);
      if (stage) {
        setForm(prev => ({
          ...prev,
          stageNo: stage.stageNo,
          stageName: stage.stageName,
          amount: stage.amount,
          collectedAmount: stage.amount
        }));
      }
    },
    [stages]
  );

  const handleClearNext = useCallback(() => {
    setForm(INITIAL_FORM_STATE);
    setStages([]);
    setComplianceWarnings([]);
    toast.success('Form cleared for next entry');
  }, []);

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();

      if (!form.busNumber || !form.routeName || !form.driver) {
        toast.error('Please fill all required fields');
        return;
      }

      if (
        form.endOdo &&
        parseFloat(form.endOdo) <= parseFloat(form.startOdo || '0')
      ) {
        toast.error('End odometer must be greater than start odometer');
        return;
      }

      setLoading(true);
      try {
        const payload = {
          ...form,
          createdBy: 'current_user', // replace with actual logged-in user
          createdAt: new Date().toISOString()
        };

        const response = await createVehicleRouteLog(payload);
        if (response.success) {
          toast.success('Vehicle route log saved successfully');
          handleClearNext();
        } else {
          toast.error('Failed to save route log');
        }
      } catch (error) {
        console.error('Error saving route log:', error);
        toast.error('Error saving route log');
      } finally {
        setLoading(false);
      }
    },
    [form, createVehicleRouteLog, handleClearNext]
  );

  const handlePrintGateSlip = useCallback(() => {
    if (!form.busNumber || !form.routeName) {
      toast.error('Please fill vehicle and route details first');
      return;
    }
    toast.success('Gate slip print functionality will be implemented');
  }, [form.busNumber, form.routeName]);

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

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
            color: '#fff'
          },
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black'
            }
          }
        }}
      />

      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">
            {/* Header Breadcrumb */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Transport Entry</h6>
              <ul className="d-flex align-items-center gap-2 list-unstyled mb-0">
                <li className="fw-medium">
                  <a
                    href="/admin/adminDashboard"
                    className="d-flex align-items-center gap-1 hover-text-primary"
                  >
                    Dashboard
                  </a>
                </li>
                <li>-</li>
                <li className="fw-medium">Administration</li>
                <li>-</li>
                <li className="fw-medium">Transport</li>
                <li>-</li>
                <li className="fw-medium">Vehicle Route Entry</li>
              </ul>
            </div>

            <div className="card h-100 p-0 radius-12">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <h6 className="text-lg fw-semibold mb-2">
                    Daily College Vehicle Route Log
                  </h6>
                  <span className="text-sm fw-medium text-secondary-light">
                    Enter daily vehicle route and operation details
                  </span>
                </div>
              </div>

              <div className="card-body p-24">
                {/* Optional: show compliance warnings */}
                {complianceWarnings.length > 0 && (
                  <div className="alert alert-warning mb-3">
                    <ul className="mb-0">
                      {complianceWarnings.map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Basic Information Row */}
                  <div className="row mb-20">
                    <div className="col-sm-6 col-md-3">
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
                    <div className="col-sm-6 col-md-3">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Shift <span className="text-danger-600">*</span>
                      </label>
                      <select
                        name="shift"
                        value={form.shift}
                        onChange={handleChange}
                        className="form-select radius-8"
                        required
                      >
                        {SHIFTS.map(shift => (
                          <option key={shift.value} value={shift.value}>
                            {shift.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-sm-6 col-md-3">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Bus Number{' '}
                        <span className="text-danger-600">*</span>
                      </label>
                      <select
                        name="busNumber"
                        value={form.busNumber}
                        onChange={e => {
                          handleChange(e);
                          handleVehicleSelect(e.target.value);
                        }}
                        className="form-select radius-8"
                        required
                      >
                        <option value="">Select Vehicle</option>
                        {vehicles.map(vehicle => (
                          <option
                            key={vehicle.id}
                            value={vehicle.vehicle_number || vehicle.busNumber}
                          >
                            {(vehicle.vehicle_number || vehicle.busNumber) +
                              ' - ' +
                              (vehicle.vehicle_type || vehicle.vehicleType)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-sm-6 col-md-3">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Vehicle Type
                      </label>
                      <input
                        type="text"
                        name="vehicleType"
                        value={form.vehicleType}
                        className="form-control radius-8 bg-neutral-50"
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Vehicle Details Row */}
                  <div className="row mb-20">
                    <div className="col-sm-6 col-md-1">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Capacity
                      </label>
                      <input
                        type="text"
                        name="capacity"
                        value={form.capacity}
                        className="form-control radius-8 bg-neutral-50"
                        readOnly
                      />
                    </div>
                    <div className="col-sm-6 col-md-3">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Registration No
                      </label>
                      <input
                        type="text"
                        name="registrationNo"
                        value={form.registrationNo}
                        className="form-control radius-8 bg-neutral-50"
                        readOnly
                      />
                    </div>
                    <div className="col-sm-6 col-md-2">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Reg / Fitness Expiry
                      </label>
                      <input
                        type="date"
                        name="fitnessExpiry"
                        value={form.fitnessExpiry}
                        className="form-control radius-8 bg-neutral-50"
                        readOnly
                      />
                    </div>
                    <div className="col-sm-6 col-md-3">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Route Name{' '}
                        <span className="text-danger-600">*</span>
                      </label>
                      <select
                        name="routeName"
                        value={form.routeName}
                        onChange={e => handleRouteSelect(e.target.value)}
                        className="form-select radius-8"
                        required
                      >
                        <option value="">Select Route</option>
                        {routes.map(route => (
                          <option
                            key={route.id}
                            value={route.route_name || route.routeName}
                          >
                            {route.route_name || route.routeName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-sm-6 col-md-1">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Route No
                      </label>
                      <input
                        type="text"
                        name="routeNo"
                        value={form.routeNo}
                        className="form-control radius-8 bg-neutral-50"
                        readOnly
                      />
                    </div>
                    <div className="col-sm-6 col-md-2">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Stage No
                      </label>
                      <select
                        name="stageNo"
                        value={form.stageNo}
                        onChange={e => handleStageSelect(e.target.value)}
                        className="form-select radius-8"
                      >
                        <option value="">Select Stage</option>
                        {stages.map(stage => (
                          <option
                            key={stage.stageNo}
                            value={stage.stageNo}
                          >
                            {stage.stageNo}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Driver Assignment Row */}
                  <div className="row mb-20">
                    <div className="col-sm-6 col-md-12">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Assigned Driver{' '}
                        <span className="text-danger-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="driver"
                        value={form.driver}
                        className="form-control radius-8 bg-neutral-50"
                        readOnly
                        placeholder="Select vehicle / route to auto-fill driver"
                      />
                    </div>
                  </div>

                  {/* Gate Timings & Odometer */}
                  <div className="row mb-20">
                    <div className="col-sm-6 col-md-3">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Gate Entry Time (Morning)
                      </label>
                      <input
                        type="time"
                        name="gateEntryTime"
                        value={form.gateEntryTime}
                        onChange={handleChange}
                        className="form-control radius-8"
                      />
                    </div>
                    <div className="col-sm-6 col-md-3">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Gate Exit Time (Evening)
                      </label>
                      <input
                        type="time"
                        name="gateExitTime"
                        value={form.gateExitTime}
                        onChange={handleChange}
                        className="form-control radius-8"
                      />
                    </div>
                    <div className="col-sm-6 col-md-3">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Start Odo (km)
                      </label>
                      <input
                        type="number"
                        name="startOdo"
                        value={form.startOdo}
                        onChange={handleChange}
                        className="form-control radius-8"
                        min="0"
                        step="0.1"
                        placeholder="Campus entry odometer"
                      />
                    </div>
                    <div className="col-sm-6 col-md-3">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        End Odo (km)
                      </label>
                      <input
                        type="number"
                        name="endOdo"
                        value={form.endOdo}
                        onChange={handleChange}
                        className="form-control radius-8"
                        min="0"
                        step="0.1"
                        placeholder="Campus exit odometer"
                      />
                    </div>
                  </div>

                  {/* Distance */}
                  <div className="row mb-20">
                    <div className="col-sm-6 col-md-3">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Distance (km)
                      </label>
                      <input
                        type="number"
                        name="distance"
                        value={form.distance}
                        className="form-control radius-8 bg-neutral-50"
                        readOnly
                        placeholder="Auto-calculated"
                      />
                    </div>
                  </div>

                  {/* Issues & Remarks */}
                  <div className="row mb-20">
                    <div className="col-12">
                      <label className="form-label fw-semibold text-primary-light text-sm mb-8">
                        Issues / Remarks
                      </label>
                      <textarea
                        name="issues"
                        value={form.issues}
                        onChange={handleChange}
                        rows="3"
                        className="form-control radius-8"
                        placeholder="Enter any issues, maintenance notes, or remarks..."
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex align-items-center justify-content-end flex-wrap gap-3">
                    <button
                      type="button"
                      className="btn btn-outline-info btn-sm px-20 py-11 radius-8"
                      onClick={handlePrintGateSlip}
                    >
                      <i className="fas fa-print me-1"></i>
                      Print Gate Slip
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm px-20 py-11 radius-8"
                      onClick={handleClearNext}
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
                      className="btn btn-outline-primary-600 radius-8 px-20 py-11"
                      disabled={loading}
                    >
                      <i className="fas fa-save me-1"></i>
                      {loading ? 'Saving...' : 'SUBMIT'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default TransportEntry;
