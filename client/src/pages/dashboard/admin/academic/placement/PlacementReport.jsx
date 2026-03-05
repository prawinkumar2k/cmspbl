import React, { useState, useEffect, useMemo } from 'react';
import api from '../../../../../utils/api';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import DataTable from '../../../../../components/DataTable/DataTable';
import Sidebar from '../../../../../components/Sidebar';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/footer';

const GRADIENT_COLORS = [
    { id: 'grad1', start: '#0088FE', end: '#00C6FF' },
    { id: 'grad2', start: '#00C49F', end: '#00E5A8' },
    { id: 'grad3', start: '#FFBB28', end: '#FFD66E' },
    { id: 'grad4', start: '#FF8042', end: '#FFB347' },
    { id: 'grad5', start: '#8884d8', end: '#B39DDB' },
];

const PlacementReport = () => {
    const [stats, setStats] = useState({ companyStats: [], academicYearStats: [] });
    const [placements, setPlacements] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        dept_name: '',
        year: '',
        academic_year: '',
        company_name: '',
        package_level: '',
        company_location: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, placementsRes] = await Promise.all([
                api.get('/placement/stats'),
                api.get('/placement')
            ]);

            if (!statsRes.data || !placementsRes.data) throw new Error('Fetch failed');

            setStats(await statsRes.data);
            setPlacements(await placementsRes.data);
        } catch (err) {
            toast.error('Failed to load placement report');
        } finally {
            setLoading(false);
        }
    };

    const filterOptions = useMemo(() => {
        const getUnique = key =>
            [...new Set(placements.map(p => p[key]).filter(Boolean))].sort();

        return {
            dept_name: getUnique('dept_name'),
            year: getUnique('year'),
            academic_year: getUnique('academic_year'),
            company_name: getUnique('company_name'),
            package_level: getUnique('package_level'),
            company_location: getUnique('company_location'),
        };
    }, [placements]);

    const filteredPlacements = useMemo(() => {
        return placements.filter(p =>
            (!filters.dept_name || p.dept_name === filters.dept_name) &&
            (!filters.year || p.year.toString() === filters.year) &&
            (!filters.academic_year || p.academic_year === filters.academic_year) &&
            (!filters.company_name || p.company_name === filters.company_name) &&
            (!filters.package_level || p.package_level === filters.package_level) &&
            (!filters.company_location || p.company_location === filters.company_location)
        ).map((item, index) => ({ ...item, sno: index + 1 }));
    }, [placements, filters]);

    const handleFilterChange = e => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({
            dept_name: '',
            year: '',
            academic_year: '',
            company_name: '',
            package_level: '',
            company_location: ''
        });
    };

    const columns = useMemo(() => [
        {
            accessorKey: 'sno',
            header: 'S.No',
            cell: ({ row }) => row.index + 1
        },
        { accessorKey: 'register_number', header: 'Register No' },
        { accessorKey: 'student_name', header: 'Student Name' },
        { accessorKey: 'dept_name', header: 'Department' },
        { accessorKey: 'year', header: 'Year' },
        { accessorKey: 'academic_year', header: 'Academic Year' },
        {
            accessorKey: 'company_name',
            header: 'Company',
            cell: ({ row }) => (
                <span className="fw-semibold text-primary">
                    {row.original.company_name}
                </span>
            )
        },
        { accessorKey: 'company_location', header: 'Location' },
        {
            accessorKey: 'package_level',
            header: 'Package',
            cell: ({ row }) => (
                <span className="badge bg-success bg-opacity-10 text-success">
                    {row.original.package_level}
                </span>
            )
        }
    ], []);

    return (
        <>
            <ToastContainer position="top-right" autoClose={2000} />

            <section className="overlay">
                <Sidebar />
                <div className="dashboard-main">
                    <Navbar />

                    <div className="dashboard-main-body">
                        <h6 className="fw-bold mb-4">Placement Report</h6>

                        {/* ===== CHARTS ===== */}
                        <div className="row g-4 mb-4">
                            {/* Doughnut Chart */}
                            <div className="col-12 col-md-6">
                                <div className="card h-100">
                                    <div className="card-header bg-transparent">
                                        <h6 className="fs-5 fw-semibold">Top Companies</h6>
                                    </div>
                                    <div className="card-body" style={{ height: 280 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <defs>
                                                    {GRADIENT_COLORS.map(g => (
                                                        <linearGradient
                                                            key={g.id}
                                                            id={g.id}
                                                            x1="0"
                                                            y1="0"
                                                            x2="1"
                                                            y2="1"
                                                        >
                                                            <stop offset="0%" stopColor={g.start} />
                                                            <stop offset="100%" stopColor={g.end} />
                                                        </linearGradient>
                                                    ))}
                                                </defs>

                                                <Pie
                                                    data={stats.companyStats.slice(0, 5)}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={55}
                                                    outerRadius={90}
                                                    paddingAngle={3}
                                                    dataKey="count"
                                                    nameKey="company_name"
                                                >
                                                    {stats.companyStats.slice(0, 5).map((_, i) => (
                                                        <Cell
                                                            key={i}
                                                            fill={`url(#${GRADIENT_COLORS[i % GRADIENT_COLORS.length].id})`}
                                                        />
                                                    ))}
                                                </Pie>

                                                <Tooltip />
                                                <Legend verticalAlign="bottom" />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Gradient Bar Chart */}
                            <div className="col-12 col-md-6">
                                <div className="card h-100">
                                    <div className="card-header bg-transparent">
                                        <h6 className="fs-5 fw-semibold">Placements by Academic Year</h6>
                                    </div>
                                    <div className="card-body" style={{ height: 280 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={stats.academicYearStats}>
                                                <defs>
                                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#82ca9d" />
                                                        <stop offset="100%" stopColor="#4CAF50" />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="academic_year" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar
                                                    dataKey="count"
                                                    fill="url(#barGradient)"
                                                    radius={[6, 6, 0, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ===== FILTERS ===== */}
                        <div className="card mb-4">
                            <div className="card-header d-flex justify-content-between">
                                <h6 className="fw-semibold mb-0">Filter Report</h6>
                                <button className="btn btn-sm btn-outline-danger" onClick={clearFilters}>
                                    Clear Filters
                                </button>
                            </div>

                            <div className="card-body">
                                <div className="row g-3">
                                    {Object.keys(filters).map(key => (
                                        <div key={key} className="col-12 col-md-6 col-lg-2">
                                            <label className="form-label small text-muted text-capitalize">
                                                {key.replace('_', ' ')}
                                            </label>
                                            <select
                                                className="form-select"
                                                name={key}
                                                value={filters[key]}
                                                onChange={handleFilterChange}
                                            >
                                                <option value="">All</option>
                                                {filterOptions[key]?.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ===== TABLE ===== */}
                        <DataTable
                            data={filteredPlacements}
                            columns={columns}
                            loading={loading}
                            title="Detailed Placement Report"
                            enableExport
                            enableSelection={false}
                            enableActions={false}
                        />
                    </div>

                    <Footer />
                </div>
            </section>
        </>
    );
};

export default PlacementReport;
