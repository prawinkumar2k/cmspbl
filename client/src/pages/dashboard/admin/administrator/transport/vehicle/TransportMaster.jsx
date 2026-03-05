// src/pages/TransportMaster.jsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from '../../../../../../components/Sidebar';
import Navbar from '../../../../../../components/Navbar';
import Footer from '../../../../../../components/footer';
import DataTable from '../../../../../../components/DataTable'; // Adjust path as needed

/*
  TransportMaster.jsx — connected to backend (/api/transport)
*/

// DataTable column configurations
const vehicleColumns = [
  { accessorKey: 'vehicle_number', header: 'Vehicle Number' },
  { accessorKey: 'vehicle_type', header: 'Type' },
  { accessorKey: 'registration_no', header: 'Registration No' },
  { accessorKey: 'seating_capacity', header: 'Seating' },
  { accessorKey: 'fuel_type', header: 'Fuel Type' }
];

const routeColumns = [
  { accessorKey: 'route_name', header: 'Route Name' },
  { accessorKey: 'start_point', header: 'Start Point' },
  { accessorKey: 'end_point', header: 'End Point' },
  { accessorKey: 'total_distance_km', header: 'Distance (km)' },
  { accessorKey: 'shift', header: 'Shift' }
];

const driverColumns = [
  { accessorKey: 'driver_name', header: 'Driver Name' },
  { accessorKey: 'phone', header: 'Phone' },
  { accessorKey: 'license_no', header: 'License No' },
  { accessorKey: 'license_valid_till', header: 'License Valid Till' },
  { accessorKey: 'status', header: 'Status' }
];

const VEHICLE_TYPES = [
  { value: 'Bus', label: 'Bus' },
  { value: 'Mini Bus', label: 'Mini Bus' },
  { value: 'Van', label: 'Van' },
  { value: 'Car', label: 'Car' }
];

const SHIFTS = [
  { value: 'Morning', label: 'Morning' },
  { value: 'Evening', label: 'Evening' },
  { value: 'Both', label: 'Both' }
];

const FUEL_TYPES = [
  { value: 'Diesel', label: 'Diesel' },
  { value: 'Petrol', label: 'Petrol' },
  { value: 'CNG', label: 'CNG' },
  { value: 'EV', label: 'EV' }
];

const DEFAULTS = {
  vehicles: [],
  routes: [],
  drivers: [],
  maintenanceRecords: []
};

const apiBase = '/api/transport';

const TransportMaster = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [activeTab, setActiveTab] = useState('vehicle'); // 'vehicle', 'route', 'driver'
  const [showRecords, setShowRecords] = useState(false);

  // Collections (backed by server)
  const [vehicles, setVehicles] = useState(DEFAULTS.vehicles);
  const [routes, setRoutes] = useState(DEFAULTS.routes);
  const [drivers, setDrivers] = useState(DEFAULTS.drivers);
  const [maintenanceRecords, setMaintenanceRecords] = useState(DEFAULTS.maintenanceRecords);

  // Temporary forms
  const [vehicleForm, setVehicleForm] = useState({
    vehicleNumber: '',
    vehicleType: 'Bus',
    registrationNo: '',
    regExpiry: '',
    seatingCapacity: '',
    fuelType: 'Diesel',
    assignedDriverId: '',
    status: 'Active',
    remarks: ''
  });

  const [routeForm, setRouteForm] = useState({
    routeName: '',
    startPoint: '',
    endPoint: '',
    totalDistanceKm: '',
    shift: 'Morning',
    assignedVehicleId: '',
    status: 'Active'
  });

  const [stageList, setStageList] = useState([]); // for current route edit
  const [stageForm, setStageForm] = useState({
    stageName: '',
    sequenceNo: 1,
    distanceFromStartKm: '',
    stageFee: ''
  });

  const [driverForm, setDriverForm] = useState({
    driverName: '',
    phone: '',
    licenseNo: '',
    licenseValidTill: '',
    assignedVehicleId: '',
    status: 'Active'
  });

  // Maintenance form
  const [maintenanceForm, setMaintenanceForm] = useState({
    vehicleId: '',
    date: '',
    type: '',
    cost: '',
    notes: ''
  });

  // load initial data from backend
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [vRes, dRes, rRes, mRes] = await Promise.all([
        fetch(`${apiBase}/vehicles`),
        fetch(`${apiBase}/drivers`),
        fetch(`${apiBase}/routes`),
        fetch(`${apiBase}/maintenance`)
      ]);

      if (!vRes.ok || !dRes.ok || !rRes.ok || !mRes.ok) {
        throw new Error('Failed to fetch one or more resources');
      }

      const [vehiclesData, driversData, routesData, maintenanceData] = await Promise.all([
        vRes.json(),
        dRes.json(),
        rRes.json(),
        mRes.json()
      ]);

      setVehicles(vehiclesData.data || []);
      setDrivers(driversData.data || []);
      setRoutes(routesData.data || []);
      setMaintenanceRecords(maintenanceData.data || []);
    } catch (err) {
      console.error('fetchAll error', err);
      toast.error('Failed to fetch transport data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on mount (fix: show data after refresh)
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const generateId = useCallback((prefix) => `${prefix}${Date.now().toString().slice(-6)}`, []);

  // --- Vehicle handlers ---
  const handleVehicleChange = useCallback((e) => {
    const { name, value } = e.target;
    setVehicleForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const addVehicle = useCallback(async (e) => {
    e.preventDefault();
    if (!vehicleForm.vehicleNumber.trim()) {
      toast.error('Vehicle Number is required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        vehicle_number: vehicleForm.vehicleNumber.trim(),
        vehicle_type: vehicleForm.vehicleType,
        registration_no: vehicleForm.registrationNo || null,
        reg_expiry: vehicleForm.regExpiry || null,
        seating_capacity: vehicleForm.seatingCapacity ? Number(vehicleForm.seatingCapacity) : null,
        fuel_type: vehicleForm.fuelType || null,
        assigned_driver_id: vehicleForm.assignedDriverId || null,
        status: vehicleForm.status || 'Active',
        remarks: vehicleForm.remarks || null
      };

      const res = await fetch(`${apiBase}/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error('addVehicle failed', txt);
        toast.error('Failed to add vehicle');
        return;
      }

      const json = await res.json();
      const newVehicle = json.data;
      // push into local state
      setVehicles(prev => [newVehicle, ...prev]);
      setVehicleForm({
        vehicleNumber: '',
        vehicleType: 'Bus',
        registrationNo: '',
        regExpiry: '',
        seatingCapacity: '',
        fuelType: 'Diesel',
        assignedDriverId: '',
        status: 'Active',
        remarks: ''
      });
      toast.success('Vehicle added');
    } catch (err) {
      console.error('addVehicle error', err);
      toast.error('Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  }, [vehicleForm]);

  const removeVehicle = useCallback(async (id) => {
    if (!confirm('Delete this vehicle?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/vehicles/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const txt = await res.text();
        console.error('delete vehicle failed', txt);
        toast.error('Failed to delete vehicle');
        return;
      }
      // refresh local lists (server cascades or unlinks)
      setVehicles(prev => prev.filter(v => v.id !== id));
      // also update related local state
      setRoutes(prev => prev.map(r => (r.assigned_vehicle_id === id ? { ...r, assigned_vehicle_id: null } : r)));
      setDrivers(prev => prev.map(d => (d.assigned_vehicle_id === id ? { ...d, assigned_vehicle_id: null } : d)));
      setMaintenanceRecords(prev => prev.filter(m => m.vehicle_id !== id));
      toast.success('Vehicle removed');
    } catch (err) {
      console.error('removeVehicle error', err);
      toast.error('Failed to remove vehicle');
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Driver handlers ---
  const handleDriverChange = useCallback((e) => {
    const { name, value } = e.target;
    setDriverForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const addDriver = useCallback(async (e) => {
    e.preventDefault();
    if (!driverForm.driverName.trim()) {
      toast.error('Driver name is required');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        driver_name: driverForm.driverName.trim(),
        phone: driverForm.phone || null,
        license_no: driverForm.licenseNo || null,
        license_valid_till: driverForm.licenseValidTill || null,
        assigned_vehicle_id: driverForm.assignedVehicleId || null,
        status: driverForm.status || 'Active'
      };
      const res = await fetch(`${apiBase}/drivers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        console.error('addDriver failed', await res.text());
        toast.error('Failed to add driver');
        return;
      }
      const json = await res.json();
      setDrivers(prev => [json.data, ...prev]);
      setDriverForm({ driverName: '', phone: '', licenseNo: '', licenseValidTill: '', assignedVehicleId: '', status: 'Active' });
      toast.success('Driver added');
    } catch (err) {
      console.error('addDriver error', err);
      toast.error('Failed to add driver');
    } finally {
      setLoading(false);
    }
  }, [driverForm]);

  const removeDriver = useCallback(async (id) => {
    if (!confirm('Delete this driver?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/drivers/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        console.error('delete driver failed', await res.text());
        toast.error('Failed to delete driver');
        return;
      }
      setDrivers(prev => prev.filter(d => d.id !== id));
      // unlink assignedVehicle in vehicles
      setVehicles(prev => prev.map(v => (v.assigned_driver_id === id ? { ...v, assigned_driver_id: null } : v)));
      toast.success('Driver removed');
    } catch (err) {
      console.error('removeDriver error', err);
      toast.error('Failed to remove driver');
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Route & Stage handlers ---
  const handleRouteChange = useCallback((e) => {
    const { name, value } = e.target;
    setRouteForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleStageChange = useCallback((e) => {
    const { name, value } = e.target;
    setStageForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const addStageToList = useCallback((e) => {
    e.preventDefault();
    if (!stageForm.stageName.trim()) {
      toast.error('Stage name is required');
      return;
    }
    const newStage = {
      // temporarily keep same key names as backend expects stage_name etc when sending later
      id: generateId('S'),
      stage_name: stageForm.stageName,
      sequence_no: Number(stageForm.sequenceNo || 1),
      distance_from_start_km: stageForm.distanceFromStartKm || 0,
      stage_fee: stageForm.stageFee || 0,
      // keep UI-friendly fields too
      stageName: stageForm.stageName,
      sequenceNo: Number(stageForm.sequenceNo || 1),
      distanceFromStartKm: stageForm.distanceFromStartKm || '',
      stageFee: stageForm.stageFee || ''
    };
    setStageList(prev => [...prev, newStage]);
    setStageForm({ stageName: '', sequenceNo: (stageForm.sequenceNo || 1) + 1, distanceFromStartKm: '', stageFee: '' });
    toast.success('Stage added to route');
  }, [stageForm, generateId]);

  const removeStageFromList = useCallback((id) => {
    setStageList(prev => prev.filter(s => s.id !== id));
  }, []);

  const saveRoute = useCallback(async (e) => {
    e.preventDefault();
    if (!routeForm.routeName.trim()) {
      toast.error('Route name is required');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        route_name: routeForm.routeName.trim(),
        start_point: routeForm.startPoint || null,
        end_point: routeForm.endPoint || null,
        total_distance_km: routeForm.totalDistanceKm ? Number(routeForm.totalDistanceKm) : null,
        shift: routeForm.shift || null,
        assigned_vehicle_id: routeForm.assignedVehicleId || null,
        status: routeForm.status || 'Active',
        stages: stageList.map(s => ({
          id: s.id,
          stage_name: s.stage_name || s.stageName,
          sequence_no: Number(s.sequence_no || s.sequenceNo || 1),
          distance_from_start_km: s.distance_from_start_km || s.distanceFromStartKm || 0,
          stage_fee: Number(s.stage_fee || s.stageFee || 0)
        }))
      };

      const res = await fetch(`${apiBase}/routes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        console.error('saveRoute failed', await res.text());
        toast.error('Failed to save route');
        return;
      }
      const json = await res.json();
      setRoutes(prev => [json.data, ...prev]);
      setRouteForm({ routeName: '', startPoint: '', endPoint: '', totalDistanceKm: '', shift: 'Morning', assignedVehicleId: '', status: 'Active' });
      setStageList([]);
      toast.success('Route saved');
    } catch (err) {
      console.error('saveRoute error', err);
      toast.error('Failed to save route');
    } finally {
      setLoading(false);
    }
  }, [routeForm, stageList]);

  const removeRoute = useCallback(async (id) => {
    if (!confirm('Delete this route?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/routes/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        console.error('delete route failed', await res.text());
        toast.error('Failed to delete route');
        return;
      }
      setRoutes(prev => prev.filter(r => r.id !== id));
      toast.success('Route removed');
    } catch (err) {
      console.error('removeRoute error', err);
      toast.error('Failed to remove route');
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Maintenance handlers ---
  const handleMaintenanceChange = useCallback((e) => {
    const { name, value } = e.target;
    setMaintenanceForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const addMaintenance = useCallback(async (e) => {
    e.preventDefault();
    if (!maintenanceForm.vehicleId) {
      toast.error('Select vehicle for maintenance');
      return;
    }
    if (!maintenanceForm.date) {
      toast.error('Maintenance date is required');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        vehicle_id: maintenanceForm.vehicleId,
        date: maintenanceForm.date,
        type: maintenanceForm.type || null,
        cost: maintenanceForm.cost ? Number(maintenanceForm.cost) : 0,
        notes: maintenanceForm.notes || null
      };
      const res = await fetch(`${apiBase}/maintenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        console.error('addMaintenance failed', await res.text());
        toast.error('Failed to add maintenance record');
        return;
      }
      const json = await res.json();
      setMaintenanceRecords(prev => [json.data, ...prev]);
      setMaintenanceForm({ vehicleId: '', date: '', type: '', cost: '', notes: '' });
      toast.success('Maintenance record added');
    } catch (err) {
      console.error('addMaintenance error', err);
      toast.error('Failed to add maintenance');
    } finally {
      setLoading(false);
    }
  }, [maintenanceForm]);

  const removeMaintenance = useCallback(async (id) => {
    if (!confirm('Delete this maintenance record?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/maintenance/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        console.error('delete maintenance failed', await res.text());
        toast.error('Failed to delete maintenance record');
        return;
      }
      setMaintenanceRecords(prev => prev.filter(m => m.id !== id));
      toast.success('Maintenance record removed');
    } catch (err) {
      console.error('removeMaintenance error', err);
      toast.error('Failed to remove maintenance record');
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Save All / Export / Import / Reset ---
  const saveAll = useCallback(async () => {
    if (vehicles.length === 0 && routes.length === 0 && drivers.length === 0) {
      toast.error('Add at least one vehicle, route or driver before saving');
      return;
    }
    setLoading(true);
    try {
      // adapt to backend expected payload structure (use server column names)
      const payload = {
        vehicles: vehicles.map(v => ({
          id: v.id,
          vehicle_number: v.vehicle_number || v.vehicleNumber,
          vehicle_type: v.vehicle_type || v.vehicleType,
          registration_no: v.registration_no || v.registrationNo,
          reg_expiry: v.reg_expiry || v.regExpiry || null,
          seating_capacity: v.seating_capacity || v.seatingCapacity || null,
          fuel_type: v.fuel_type || v.fuelType || null,
          assigned_driver_id: v.assigned_driver_id || v.assignedDriverId || null,
          status: v.status || 'Active',
          remarks: v.remarks || null
        })),
        drivers: drivers.map(d => ({
          id: d.id,
          driver_name: d.driver_name || d.driverName,
          phone: d.phone || null,
          license_no: d.license_no || d.licenseNo || null,
          license_valid_till: d.license_valid_till || d.licenseValidTill || null,
          assigned_vehicle_id: d.assigned_vehicle_id || d.assignedVehicleId || null,
          status: d.status || 'Active'
        })),
        routes: routes.map(r => ({
          id: r.id,
          route_name: r.route_name || r.routeName,
          start_point: r.start_point || r.startPoint,
          end_point: r.end_point || r.endPoint,
          total_distance_km: r.total_distance_km || r.totalDistanceKm || null,
          shift: r.shift || null,
          assigned_vehicle_id: r.assigned_vehicle_id || r.assignedVehicleId || null,
          status: r.status || 'Active',
          stages: (r.stages || []).map(s => ({
            id: s.id,
            stage_name: s.stage_name || s.stageName,
            sequence_no: s.sequence_no || s.sequenceNo,
            distance_from_start_km: s.distance_from_start_km || s.distanceFromStartKm || 0,
            stage_fee: s.stage_fee || s.stageFee || 0
          }))
        })),
        maintenanceRecords: maintenanceRecords.map(m => ({
          id: m.id,
          vehicle_id: m.vehicle_id || m.vehicleId,
          date: m.date,
          type: m.type,
          cost: m.cost,
          notes: m.notes
        }))
      };

      const res = await fetch(`${apiBase}/save-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        console.error('saveAll failed', await res.text());
        toast.error('Failed to save transport master');
        return;
      }
      toast.success('Transport master saved to server (replaced)');
      // re-fetch authoritative data
      await fetchAll();
    } catch (err) {
      console.error('saveAll error', err);
      toast.error('Failed to save transport master');
    } finally {
      setLoading(false);
    }
  }, [vehicles, routes, drivers, maintenanceRecords, fetchAll]);

  const exportJSON = useCallback(() => {
    const data = { vehicles, routes, drivers, maintenanceRecords, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transport_master_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported JSON');
  }, [vehicles, routes, drivers, maintenanceRecords]);

  const importJSON = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = JSON.parse(evt.target.result);
        if (!(data.vehicles || data.routes || data.drivers || data.maintenanceRecords)) {
          toast.error('Invalid transport JSON file');
          return;
        }
        setLoading(true);
        // send to backend in merge mode (default)
        const res = await fetch(`${apiBase}/import`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'merge', data })
        });
        if (!res.ok) {
          console.error('import failed', await res.text());
          toast.error('Failed to import data to server');
          return;
        }
        toast.success('Imported JSON to server');
        // refresh authoritative data
        await fetchAll();
      } catch (err) {
        console.error('importJSON error', err);
        toast.error('Failed to parse or import JSON');
      } finally {
        setLoading(false);
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  }, [fetchAll]);

  const resetAll = useCallback(() => {
    setVehicles([]);
    setRoutes([]);
    setDrivers([]);
    setMaintenanceRecords([]);
    setVehicleForm({ vehicleNumber: '', vehicleType: 'Bus', registrationNo: '', regExpiry: '', seatingCapacity: '', fuelType: 'Diesel', assignedDriverId: '', status: 'Active', remarks: '' });
    setRouteForm({ routeName: '', startPoint: '', endPoint: '', totalDistanceKm: '', shift: 'Morning', assignedVehicleId: '', status: 'Active' });
    setStageList([]);
    setStageForm({ stageName: '', sequenceNo: 1, distanceFromStartKm: '', stageFee: '' });
    setDriverForm({ driverName: '', phone: '', licenseNo: '', licenseValidTill: '', assignedVehicleId: '', status: 'Active' });
    setMaintenanceForm({ vehicleId: '', date: '', type: '', cost: '', notes: '' });
    toast.success('Reset all local state (server not changed)');
  }, []);

  // Per-form resets for UI convenience (match BusMaintenanceSalary style)
  const resetVehicleForm = useCallback(() => {
    setVehicleForm({ vehicleNumber: '', vehicleType: 'Bus', registrationNo: '', regExpiry: '', seatingCapacity: '', fuelType: 'Diesel', assignedDriverId: '', status: 'Active', remarks: '' });
    toast.success('Vehicle form reset');
  }, []);

  const resetRouteForm = useCallback(() => {
    setRouteForm({ routeName: '', startPoint: '', endPoint: '', totalDistanceKm: '', shift: 'Morning', assignedVehicleId: '', status: 'Active' });
    setStageList([]);
    setStageForm({ stageName: '', sequenceNo: 1, distanceFromStartKm: '', stageFee: '' });
    toast.success('Route form reset');
  }, []);

  const resetDriverForm = useCallback(() => {
    setDriverForm({ driverName: '', phone: '', licenseNo: '', licenseValidTill: '', assignedVehicleId: '', status: 'Active' });
    toast.success('Driver form reset');
  }, []);

  const handleClose = useCallback(() => navigate(-1), [navigate]);

  // helpers
  const vehicleCount = vehicles.length;
  const routeCount = routes.length;
  const driverCount = drivers.length;
  const maintenanceCount = maintenanceRecords.length;

  const recentMaintenance = useMemo(() => [...maintenanceRecords].reverse().slice(0, 5), [maintenanceRecords]);

  // DataTable filtered records based on active tab
  const getFilteredRecords = useCallback(() => {
    if (activeTab === 'vehicle') {
      return vehicles;
    }
    if (activeTab === 'route') {
      return routes;
    }
    if (activeTab === 'driver') {
      return drivers;
    }
    return [];
  }, [activeTab, vehicles, routes, drivers]);

  // Dynamic columns based on active tab
  const columns = useMemo(() => {
    if (activeTab === 'vehicle') {
      return vehicleColumns;
    }
    if (activeTab === 'route') {
      return routeColumns;
    }
    if (activeTab === 'driver') {
      return driverColumns;
    }
    return [];
  }, [activeTab]);

  // toggle full screen: hide sidebar & navbar and reduce padding for more room
  const toggleFullScreen = useCallback(() => setFullScreen(fs => !fs), []);

  return (
    <>
      <Toaster position="top-right" />
      <section className="overlay">
        {/* Render Sidebar/Navbar only when not in full screen */}
        {!fullScreen && <Sidebar />}
        <div
          className="dashboard-main"
          style={{
            marginLeft: fullScreen ? 0 : undefined,
            transition: 'margin 200ms'
          }}
        >
          {!fullScreen && <Navbar />}
          <div
            className="dashboard-main-body"
            style={{
              padding: fullScreen ? '12px 20px' : '24px',
              maxWidth: fullScreen ? '100%' : undefined,
              width: '100%'
            }}
          >
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Transport Master </h6>
              <div className="d-flex gap-2">
                <button 
                        className="btn btn-sm btn-outline-info" 
                        onClick={() => setShowRecords(!showRecords)}
                      >
                        {showRecords ? 'Hide Records' : 'View Records'}
                      </button>

                {/* Full screen toggle */}
                <button
                  className="btn btn-sm btn-outline-dark"
                  onClick={toggleFullScreen}
                  title={fullScreen ? 'Exit full screen' : 'Full screen'}
                >
                  {fullScreen ? 'Exit Full Screen' : 'Full Screen'}
                </button>
              </div>
            </div>

            <div className="row">
              {/* Main column expands to full width */}
              <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200"></div>
              <div className="col-12">
              
                {/* Tab buttons */}
                <div className="d-flex gap-2 mb-4 flex-wrap">
                  <button
                    className={`btn btn-sm ${activeTab === 'vehicle' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('vehicle')}
                  >
                    Vehicle Master
                  </button>
                  <button
                    className={`btn btn-sm ${activeTab === 'route' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('route')}
                  >
                    Route Master
                  </button>
                  <button
                    className={`btn btn-sm ${activeTab === 'driver' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setActiveTab('driver')}
                  >
                    Driver Master
                  </button>
                </div>

                {/* Vehicle Master Tab */}
                <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200"></div>
                {activeTab === 'vehicle' && (
                <div className="card mb-16 radius-8">
                  <div className="card-header px-16 py-12">
                    <strong>Vehicle Master</strong>
                    
                  </div>
                  <div className="card-body p-16">
                    <form onSubmit={addVehicle}>
                      <div className="row g-3 mb-12">
                        <div className="col-sm-6 col-md-3">
                          <label className="form-label">Vehicle Number <span className="text-danger">*</span></label>
                          <input name="vehicleNumber" value={vehicleForm.vehicleNumber} onChange={handleVehicleChange} className="form-control radius-6" />
                        </div>
                        <div className="col-sm-6 col-md-3">
                          <label className="form-label">Vehicle Type</label>
                          <select name="vehicleType" value={vehicleForm.vehicleType} onChange={handleVehicleChange} className="form-select radius-6">
                            {VEHICLE_TYPES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                          </select>
                        </div>
                        <div className="col-sm-6 col-md-3">
                          <label className="form-label">Fuel Type</label>
                          <select name="fuelType" value={vehicleForm.fuelType} onChange={handleVehicleChange} className="form-select radius-6">
                            {FUEL_TYPES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                          </select>
                        </div>
                        <div className="col-sm-6 col-md-3">
                          <label className="form-label">Registration No</label>
                          <input name="registrationNo" value={vehicleForm.registrationNo} onChange={handleVehicleChange} className="form-control radius-6" />
                        </div>
                        <div className="col-sm-6 col-md-3">
                          <label className="form-label">Reg Expiry</label>
                          <input type="date" name="regExpiry" value={vehicleForm.regExpiry} onChange={handleVehicleChange} className="form-control radius-6" />
                        </div>
                        <div className="col-sm-6 col-md-3">
                          <label className="form-label">Seating Capacity</label>
                          <input name="seatingCapacity" value={vehicleForm.seatingCapacity} onChange={handleVehicleChange} className="form-control radius-6" />
                        </div>
                        <div className="col-sm-6 col-md-3">
                          <label className="form-label">Assigned Driver</label>
                          <select name="assignedDriverId" value={vehicleForm.assignedDriverId} onChange={handleVehicleChange} className="form-select radius-6">
                            <option value="">-- Select driver --</option>
                            {drivers.map(d => <option key={d.id} value={d.id}>{d.driver_name || d.driverName}</option>)}
                          </select>
                        </div>
                        <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                          <button className="btn btn-sm btn-outline-primary" type="submit">Add Vehicle</button>
                        </div>
                      </div>
                    </form>

                    <hr />

                    {showRecords && (
                      <div className="card h-100 p-0 radius-12 mb-4">
                        
                        <div className="card-body p-24">
                          <div className="table-responsive">
                            <DataTable
                              data={vehicles}
                              columns={vehicleColumns}
                              title="Vehicles"
                              enableSelection={false}
                              pageSize={10}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                )}

                {/* Route Master Tab */}
                {activeTab === 'route' && (
                <div className="card mb-16 radius-8">
                  <div className="card-header px-16 py-12">
                    <strong>Route Master</strong>
                    <span className="ms-3 text-muted">Create routes and add stages</span>
                  </div>
                  <div className="card-body p-16">
                    <form onSubmit={saveRoute}>
                      <div className="row g-3">
                        <div className="col-md-3">
                          <label className="form-label">Route Name <span className="text-danger">*</span></label>
                          <input name="routeName" value={routeForm.routeName} onChange={handleRouteChange} className="form-control radius-6" />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Start Point</label>
                          <input name="startPoint" value={routeForm.startPoint} onChange={handleRouteChange} className="form-control radius-6" />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">End Point</label>
                          <input name="endPoint" value={routeForm.endPoint} onChange={handleRouteChange} className="form-control radius-6" />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Total Distance (km)</label>
                          <input name="totalDistanceKm" value={routeForm.totalDistanceKm} onChange={handleRouteChange} className="form-control radius-6" />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Shift</label>
                          <select name="shift" value={routeForm.shift} onChange={handleRouteChange} className="form-select radius-6">
                            {SHIFTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                          </select>
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Assigned Vehicle</label>
                          <select name="assignedVehicleId" value={routeForm.assignedVehicleId} onChange={handleRouteChange} className="form-select radius-6">
                            <option value="">-- Select vehicle --</option>
                            {vehicles.map(v => <option key={v.id} value={v.id}>{v.vehicle_number || v.vehicleNumber}</option>)}
                          </select>
                        </div>

                        {/* Stages inline */}
                        <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200"></div>
                        <div className="col-12 mt-4 pt-4 border-top">
                          <h6 className="fw-semibold mb-3">Stages for this route</h6>
                          
                          <div className="row g-2 align-items-end mb-3">
                            
                            <div className="col-md-3">
                              <label className="form-label">Stage Name</label>
                              <input name="stageName" placeholder="Stage name" value={stageForm.stageName} onChange={handleStageChange} className="form-control radius-6" />
                            </div>
                            <div className="col-md-2">
                              <label className="form-label">Stage No</label>
                              <input name="sequenceNo" type="number" placeholder="Seq" value={stageForm.sequenceNo} onChange={handleStageChange} className="form-control radius-6" />
                            </div>
                            <div className="col-md-2">
                              <label className="form-label">Distance (km)</label>
                              <input name="distanceFromStartKm" placeholder="Distance km" value={stageForm.distanceFromStartKm} onChange={handleStageChange} className="form-control radius-6" />
                            </div>
                            <div className="col-md-2">
                              <label className="form-label">Stage Fee</label>
                              <input name="stageFee" placeholder="Fee" value={stageForm.stageFee} onChange={handleStageChange} className="form-control radius-6" />
                            </div>
                            <div className="col-md-3 d-flex gap-2">
                              <button className="btn btn-sm btn-outline-primary" onClick={addStageToList} type="button">Add Stage</button>
                            </div>
                          </div>

                          {/* Display added stages */}
                          {stageList.length > 0 && (
                            <div className="mb-3">
                              
                              <div className="list-group">
                                {stageList.map((stage, idx) => (
                                  <div key={stage.id} className="list-group-item px-3 py-2.5 d-flex justify-content-between align-items-center">
                                    <div>
                                      <span className="fw-semibold">{idx + 1}. {stage.stage_name || stage.stageName}</span>
                                      <span className="ms-3 text-muted text-sm">Distance: {stage.distance_from_start_km || stage.distanceFromStartKm} km • Fee: {stage.stage_fee || stage.stageFee}</span>
                                    </div>
                                    <button 
                                      className="btn btn-sm btn-outline-danger" 
                                      onClick={() => removeStageFromList(stage.id)}
                                      type="button"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                            <button className="btn btn-sm btn-outline-primary" type="submit">Save Route</button>
                          </div>
                        </div>
                      </div>
                    </form>
                    

                   
                    {showRecords && (
                      <div className="card h-100 p-0 radius-12 mb-4">
                        
                        <div className="card-body p-24">
                          <div className="table-responsive">
                            <DataTable
                              data={routes}
                              columns={routeColumns}
                              title="Routes"
                              enableSelection={false}
                              pageSize={10}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                )}

                {/* Driver Master Tab */}
                {activeTab === 'driver' && (
                <div className="card mb-16 radius-8">
                  <div className="card-header px-16 py-12">
                    <strong>Driver Master</strong>
                    <span className="ms-3 text-muted">Add and manage drivers</span>
                  </div>
                  <div className="card-body p-16">
                    <form onSubmit={addDriver}>
                      <div className="row g-3">
                        <div className="col-md-3">
                          <label className="form-label">Driver Name <span className="text-danger">*</span></label>
                          <input name="driverName" value={driverForm.driverName} onChange={handleDriverChange} className="form-control radius-6" />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">Phone</label>
                          <input name="phone" value={driverForm.phone} onChange={handleDriverChange} className="form-control radius-6" />
                        </div>
                         <div className="col-md-3">
                          <label className="form-label">LICENSE NO <span className="text-danger">*</span></label>
                          <input name="licenseNo" value={driverForm.licenseNo} onChange={handleDriverChange} className="form-control radius-6" />
                        </div>
                         <div className="col-md-3">
                          <label className="form-label">LICENSE VALID <span className="text-danger">*</span></label>
                          <input name="driverName" value={driverForm.driverName} onChange={handleDriverChange} className="form-control radius-6" />
                        </div>
                       <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                          <button className="btn btn-sm btn-outline-primary" type="submit">Add Driver</button>
                        </div>
                      </div>
                    </form>

                    <hr />

                    {showRecords && (
                      <div className="card h-100 p-0 radius-12 mb-4">
                        
                        <div className="card-body p-24">
                          <div className="table-responsive">
                            <DataTable
                              data={drivers}
                              columns={driverColumns}
                              title="Drivers"
                              enableSelection={false}
                              pageSize={10}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                )}

              </div>
            </div>

            {/* Footer actions */}
            <div className="mt-4 d-flex justify-content-end gap-2">
              <button className="btn btn-outline-danger btn-sm" onClick={handleClose}>Close</button>
              <button className="btn btn-outline-primary btn-sm" onClick={saveAll} disabled={loading}>{loading ? 'Saving...' : 'Save All'}</button>
            </div>

          </div>
          <Footer />
        </div>
      </section>
    </>
  );
};

export default TransportMaster;
