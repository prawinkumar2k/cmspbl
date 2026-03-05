import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from "../../../../components/Navbar";
import Sidebar from "../../../../components/Sidebar";
import Footer from "../../../../components/footer";
import axios from 'axios';
import api from '../../../../utils/api';

const SalaryStructure = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [salaryData, setSalaryData] = useState({
        basic: 0,
        hra: 0,
        da: 0,
        conveyance: 0,
        medical: 0,
        special: 0,
        pf: 0,
        esi: 0,
        tax: 0,
        loan: 0
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/staff_master');
            setEmployees(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error:', error);
            setEmployees([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredEmployees = employees.filter(e =>
        e.Staff_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.Staff_ID?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectEmployee = (emp) => {
        setSelectedEmployee(emp);
        // Set mock salary data
        setSalaryData({
            basic: 25000,
            hra: 10000,
            da: 5000,
            conveyance: 2000,
            medical: 1500,
            special: 3000,
            pf: 3000,
            esi: 700,
            tax: 2000,
            loan: 0
        });
    };

    const handleInputChange = (field, value) => {
        setSalaryData(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
    };

    const grossEarnings = salaryData.basic + salaryData.hra + salaryData.da + salaryData.conveyance + salaryData.medical + salaryData.special;
    const totalDeductions = salaryData.pf + salaryData.esi + salaryData.tax + salaryData.loan;
    const netSalary = grossEarnings - totalDeductions;

    const handleSave = () => {
        toast.success(`Salary structure saved for ${selectedEmployee?.Staff_Name}`);
    };

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <section className="overlay">
                <Sidebar />
                <div className="dashboard-main">
                    <Navbar />
                    <div className="dashboard-main-body">
                        {/* Page Header */}
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
                            <h6 className="fw-semibold mb-0 d-flex align-items-center gap-2">
                                <Icon icon="mdi:cash-multiple" className="text-success" style={{ fontSize: '28px' }} />
                                Salary Structure
                            </h6>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb mb-0">
                                    <li className="breadcrumb-item"><a href="/hr/dashboard">HR</a></li>
                                    <li className="breadcrumb-item active">Salary Structure</li>
                                </ol>
                            </nav>
                        </div>

                        <div className="row g-4">
                            {/* Employee List */}
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-header bg-white py-3">
                                        <h6 className="mb-0 fw-semibold">
                                            <Icon icon="mdi:account-search" className="me-2" />
                                            Select Employee
                                        </h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="input-group mb-3">
                                            <span className="input-group-text bg-light"><Icon icon="mdi:magnify" /></span>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search employee..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                            {loading ? (
                                                <div className="text-center py-3">
                                                    <div className="spinner-border spinner-border-sm text-primary"></div>
                                                </div>
                                            ) : (
                                                filteredEmployees.slice(0, 20).map(emp => (
                                                    <div
                                                        key={emp.Staff_ID}
                                                        className={`p-3 border-bottom cursor-pointer ${selectedEmployee?.Staff_ID === emp.Staff_ID ? 'bg-primary-subtle' : ''}`}
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => handleSelectEmployee(emp)}
                                                    >
                                                        <p className="mb-0 fw-medium">{emp.Staff_Name}</p>
                                                        <small className="text-muted">{emp.Staff_ID} • {emp.Designation || 'N/A'}</small>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Salary Structure */}
                            <div className="col-md-8">
                                {selectedEmployee ? (
                                    <>
                                        {/* Employee Info */}
                                        <div className="card border-0 shadow-sm mb-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                            <div className="card-body py-4 text-white">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="bg-white rounded-circle p-3">
                                                        <Icon icon="mdi:account" style={{ fontSize: '28px', color: '#667eea' }} />
                                                    </div>
                                                    <div>
                                                        <h5 className="mb-0 fw-bold">{selectedEmployee.Staff_Name}</h5>
                                                        <small>{selectedEmployee.Staff_ID} • {selectedEmployee.Designation || 'Staff'} • {selectedEmployee.Dept_Name || 'General'}</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row g-4">
                                            {/* Earnings */}
                                            <div className="col-md-6">
                                                <div className="card border-0 shadow-sm h-100">
                                                    <div className="card-header bg-success-subtle py-3">
                                                        <h6 className="mb-0 fw-semibold text-success"><Icon icon="mdi:plus-circle" className="me-2" />Earnings</h6>
                                                    </div>
                                                    <div className="card-body">
                                                        {[
                                                            { key: 'basic', label: 'Basic Salary' },
                                                            { key: 'hra', label: 'HRA' },
                                                            { key: 'da', label: 'Dearness Allowance' },
                                                            { key: 'conveyance', label: 'Conveyance' },
                                                            { key: 'medical', label: 'Medical Allowance' },
                                                            { key: 'special', label: 'Special Allowance' },
                                                        ].map(({ key, label }) => (
                                                            <div className="d-flex align-items-center justify-content-between mb-2" key={key}>
                                                                <label className="form-label mb-0">{label}</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control form-control-sm text-end"
                                                                    style={{ maxWidth: '120px' }}
                                                                    value={salaryData[key]}
                                                                    onChange={(e) => handleInputChange(key, e.target.value)}
                                                                />
                                                            </div>
                                                        ))}
                                                        <hr />
                                                        <div className="d-flex justify-content-between fw-bold text-success">
                                                            <span>Gross Earnings</span>
                                                            <span>₹{grossEarnings.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Deductions */}
                                            <div className="col-md-6">
                                                <div className="card border-0 shadow-sm h-100">
                                                    <div className="card-header bg-danger-subtle py-3">
                                                        <h6 className="mb-0 fw-semibold text-danger"><Icon icon="mdi:minus-circle" className="me-2" />Deductions</h6>
                                                    </div>
                                                    <div className="card-body">
                                                        {[
                                                            { key: 'pf', label: 'Provident Fund' },
                                                            { key: 'esi', label: 'ESI' },
                                                            { key: 'tax', label: 'Professional Tax' },
                                                            { key: 'loan', label: 'Loan EMI' },
                                                        ].map(({ key, label }) => (
                                                            <div className="d-flex align-items-center justify-content-between mb-2" key={key}>
                                                                <label className="form-label mb-0">{label}</label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control form-control-sm text-end"
                                                                    style={{ maxWidth: '120px' }}
                                                                    value={salaryData[key]}
                                                                    onChange={(e) => handleInputChange(key, e.target.value)}
                                                                />
                                                            </div>
                                                        ))}
                                                        <hr />
                                                        <div className="d-flex justify-content-between fw-bold text-danger">
                                                            <span>Total Deductions</span>
                                                            <span>₹{totalDeductions.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Net Salary */}
                                        <div className="card border-0 shadow-sm mt-4" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
                                            <div className="card-body py-4 text-white d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h4 className="mb-0 fw-bold">Net Salary</h4>
                                                    <small>Monthly Take Home</small>
                                                </div>
                                                <h2 className="mb-0 fw-bold">₹{netSalary.toLocaleString()}</h2>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="d-flex gap-3 mt-4">
                                            <button className="btn btn-primary" onClick={handleSave}>
                                                <Icon icon="mdi:content-save" className="me-1" />
                                                Save Structure
                                            </button>
                                            <button className="btn btn-outline-secondary">
                                                <Icon icon="mdi:printer" className="me-1" />
                                                Print
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="card border-0 shadow-sm h-100 d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
                                        <div className="text-center text-muted">
                                            <Icon icon="mdi:account-arrow-left" style={{ fontSize: '64px' }} />
                                            <p className="mt-3">Select an employee to view/edit salary structure</p>
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

export default SalaryStructure;
