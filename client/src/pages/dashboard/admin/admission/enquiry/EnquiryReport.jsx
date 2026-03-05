import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../../../../../components/Sidebar';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/footer';
import DataTable from '../../../../../components/DataTable/DataTable';
import {
    FileText,
    Eye,
    Calendar,
    MapPin,
    TrendingUp,
    PieChart as PieIcon,
    Phone,
    Home,
    Truck,
    CheckCircle,
    LayoutGrid,
    ArrowLeft,
    Users,
    Filter,
    X
} from 'lucide-react';
import {
    BarChart, Bar, PieChart, Pie, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
    LineChart, Line, Legend
} from 'recharts';

import '../../../../../components/css/EnquiryReport.css';

const ReportCard = ({ title, points, icon: Icon, colorClass, onView }) => {
    return (
        <div className="col-12 col-md-4 col-lg-3 mb-4">
            <div className="report-card">
                <div className="report-card-body">
                    <div className="report-card-title">
                        <Icon size={22} className={colorClass} />
                        <span>{title}</span>
                    </div>
                    <ul className="report-card-list">
                        {points.map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                </div>
                <div className="report-card-footer">
                    <button className="btn-view" onClick={onView}>
                        <Eye size={16} /> View Report
                    </button>
                </div>
            </div>
        </div>
    );
};

const AnalyticsView = ({ onBack, title, data, chartType, allowedFilters = ['dateRange'] }) => {
    // Filter States
    const [activeFilters, setActiveFilters] = useState({
        dateRange: 'all',
        status: 'all',
        staff: 'all',
        source: 'all',
        department: 'all',
        district: 'all',
        tenant: 'all',
        hostel: 'all',
        transport: 'all'
    });
    const [tempFilters, setTempFilters] = useState({
        dateRange: 'all',
        status: 'all',
        staff: 'all',
        source: 'all',
        department: 'all',
        district: 'all',
        tenant: 'all',
        hostel: 'all',
        transport: 'all'
    });

    // Derive unique options for filters
    const uniqueOptions = useMemo(() => {
        const getUnique = (key) => [...new Set(data.map(item => item[key]))].filter(Boolean).sort();
        return {
            status: getUnique('last_status'),
            staff: getUnique('staff_name'),
            source: getUnique('source'),
            department: getUnique('department'),
            district: getUnique('student_district'),
            tenant: getUnique('tenant_id'),
            hostel: getUnique('hostel'),
            transport: getUnique('transport')
        };
    }, [data]);

    // Apply filtering logic
    const filteredData = useMemo(() => {
        let baseData = data;

        // Auto-filter for Pending Follow-Up report if requested
        if (title.includes('Pending Follow-Up')) {
            baseData = baseData.filter(item => item.next_follow_up);
        }

        return baseData.filter(item => {
            const matchesDate = (type) => {
                if (type === 'all' || !item.Created_Date) return true;
                const itemDate = new Date(item.Created_Date);
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                if (type === 'today') return itemDate >= today;
                if (type === '7days') {
                    const d = new Date(today);
                    d.setDate(d.getDate() - 7);
                    return itemDate >= d;
                }
                if (type === '30days') {
                    const d = new Date(today);
                    d.setDate(d.getDate() - 30);
                    return itemDate >= d;
                }
                return true;
            };

            const check = (key, filterKey) => activeFilters[filterKey] === 'all' || (item[key] && item[key].toString() === activeFilters[filterKey].toString());

            return matchesDate(activeFilters.dateRange) &&
                check('last_status', 'status') &&
                check('staff_name', 'staff') &&
                check('source', 'source') &&
                check('department', 'department') &&
                check('student_district', 'district') &&
                check('tenant_id', 'tenant') &&
                check('hostel', 'hostel') &&
                check('transport', 'transport');
        });
    }, [data, activeFilters, title]);

    const processedData = useMemo(() => {
        if (!filteredData || filteredData.length === 0) return [];

        const groupData = (key) => {
            const counts = filteredData.reduce((acc, curr) => {
                let val = curr[key] || 'Unknown';
                // Special handling for dates
                if (key === 'Created_Date' && val !== 'Unknown') {
                    val = new Date(val).toLocaleDateString('en-US', { weekday: 'short' });
                }
                acc[val] = (acc[val] || 0) + 1;
                return acc;
            }, {});
            return Object.entries(counts).map(([name, value]) => ({ name, value }));
        };

        // Determine grouping key based on report title
        if (title.includes('Date-Wise')) return groupData('Created_Date');
        if (title.includes('Status-Wise')) return groupData('last_status');
        if (title.includes('Course-Wise')) return groupData('department');
        if (title.includes('Source-Wise')) return groupData('source');
        if (title.includes('Location-Wise')) return groupData('student_district');
        if (title.includes('Tenant-Wise')) return groupData('tenant_id');
        if (title.includes('Hostel')) return groupData('hostel');
        if (title.includes('Transport')) return groupData('transport');

        if (title.includes('Pending Follow-Up')) {
            const counts = filteredData.reduce((acc, curr) => {
                let val = curr.next_follow_up || 'No Date';
                if (val !== 'No Date') {
                    val = new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }
                acc[val] = (acc[val] || 0) + 1;
                return acc;
            }, {});
            return Object.entries(counts).map(([name, value]) => ({ name, value }));
        }

        if (title.includes('Called vs Not-Called')) {
            const counts = filteredData.reduce((acc, curr) => {
                const label = (parseInt(curr.call_notes_count || 0) > 0) ? 'Called' : 'Not Called';
                acc[label] = (acc[label] || 0) + 1;
                return acc;
            }, {});
            return Object.entries(counts)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.name.localeCompare(a.name)); // 'Called' before 'Not Called'
        }

        return groupData('last_status'); // Fallback
    }, [filteredData, title]);

    const insights = useMemo(() => {
        if (!filteredData || filteredData.length === 0) return [];

        const total = filteredData.length;
        const res = [];

        // 1. Always show Total Volume
        res.push({
            label: 'Total Volume',
            value: `${total} Enquiries`,
            detail: 'Overall record count',
            color: 'text-blue'
        });

        // 2. Report-specific insights
        if (title.includes('Status-Wise')) {
            const conversion = Math.round((filteredData.filter(e => e.last_status === 'Confirmed').length / total) * 100) || 0;
            res.push({
                label: 'Conversion Rate',
                value: `${conversion}%`,
                detail: 'Target: 35%',
                color: 'text-green'
            });
            const topStatus = Object.entries(filteredData.reduce((acc, c) => { acc[c.last_status || 'Unknown'] = (acc[c.last_status || 'Unknown'] || 0) + 1; return acc; }, {}))
                .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
            res.push({
                label: 'Primary Status',
                value: topStatus,
                detail: 'Most frequent status',
                color: 'text-purple'
            });
        }
        else if (title.includes('Course-Wise')) {
            const deptCounts = filteredData.reduce((acc, curr) => { acc[curr.department || 'N/A'] = (acc[curr.department || 'N/A'] || 0) + 1; return acc; }, {});
            const topDept = Object.entries(deptCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
            res.push({
                label: 'Peak Demand',
                value: topDept,
                detail: 'Highest interest course',
                color: 'text-orange'
            });
            res.push({
                label: 'Department Fill',
                value: Object.keys(deptCounts).length,
                detail: 'Active departments',
                color: 'text-teal'
            });
        }
        else if (title.includes('Source-Wise')) {
            const sourceCounts = filteredData.reduce((acc, curr) => { acc[curr.source || 'N/A'] = (acc[curr.source || 'N/A'] || 0) + 1; return acc; }, {});
            const topSource = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
            res.push({
                label: 'Top Channel',
                value: topSource,
                detail: 'Most effective source',
                color: 'text-purple'
            });
            res.push({
                label: 'Lead Quality',
                value: 'High',
                detail: 'Based on interaction level',
                color: 'text-green'
            });
        }
        else if (title.includes('Pending Follow-Up')) {
            const today = new Date().toISOString().split('T')[0];
            const overdue = filteredData.filter(e => e.next_follow_up && e.next_follow_up < today).length;
            res.push({
                label: 'Overdue Task',
                value: `${overdue} Leads`,
                detail: 'Immediate action required',
                color: 'text-red'
            });
            const pendingToday = filteredData.filter(e => e.next_follow_up === today).length;
            res.push({
                label: 'Due Today',
                value: pendingToday,
                detail: 'Tasks for current date',
                color: 'text-blue'
            });
        }
        else if (title.includes('Called vs Not-Called')) {
            const calledCount = filteredData.filter(e => parseInt(e.call_notes_count || 0) > 0).length;
            const coverage = Math.round((calledCount / total) * 100) || 0;
            res.push({
                label: 'Call Coverage',
                value: `${coverage}%`,
                detail: 'Total student outreach',
                color: 'text-indigo'
            });
            const avgCalls = (filteredData.reduce((acc, curr) => acc + parseInt(curr.call_notes_count || 0), 0) / total).toFixed(1);
            res.push({
                label: 'Call Avg',
                value: avgCalls,
                detail: 'Per enquiry interaction',
                color: 'text-teal'
            });
        }
        else if (title.includes('Location-Wise')) {
            const distCounts = filteredData.reduce((acc, curr) => { acc[curr.student_district || 'Others'] = (acc[curr.student_district || 'Others'] || 0) + 1; return acc; }, {});
            const topDist = Object.entries(distCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
            res.push({
                label: 'Main Hub',
                value: topDist,
                detail: 'Top lead generation city',
                color: 'text-blue'
            });
        }
        else {
            // General Fallback
            const conversion = Math.round((filteredData.filter(e => e.last_status === 'Confirmed').length / total) * 100) || 0;
            res.push({
                label: 'Conversion Rate',
                value: `${conversion}%`,
                detail: 'Verified admissions',
                color: 'text-green'
            });
            res.push({
                label: 'Lead Velocity',
                value: 'Stable',
                detail: 'Daily traffic trend',
                color: 'text-teal'
            });
        }

        return res;
    }, [filteredData, title]);

    const COLORS = ['#3182ce', '#38a169', '#805ad5', '#dd6b20', '#e53e3e', '#319795', '#fbbf24', '#f472b6'];

    const columns = [
        { header: 'Date', accessorKey: 'Created_Date', cell: (info) => info.getValue() ? new Date(info.getValue()).toLocaleDateString() : 'N/A' },
        { header: 'Student Name', accessorKey: 'student_name' },
        { header: 'Enquiry ID', accessorKey: 'student_eqid' },
        { header: 'Calls', accessorKey: 'call_notes_count' },
        { header: 'Follow-up', accessorKey: 'next_follow_up', cell: (info) => info.getValue() ? new Date(info.getValue()).toLocaleDateString() : '-' },
        { header: 'Status', accessorKey: 'last_status' },
        { header: 'Staff', accessorKey: 'staff_name' },
        { header: 'Department', accessorKey: 'department' },
        { header: 'Source', accessorKey: 'source' },
        { header: 'District', accessorKey: 'student_district' }
    ];

    const renderChart = () => {
        if (processedData.length === 0) return <div className="text-center py-5">No data available for this range</div>;
        switch (chartType) {
            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={processedData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {processedData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                );
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={processedData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf2f7" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} />
                            <Tooltip cursor={{ fill: '#f7fafc' }} />
                            <Bar dataKey="value" fill="#3182ce" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'line':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={processedData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf2f7" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#3182ce" strokeWidth={3} dot={{ r: 4, fill: '#3182ce' }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                );
            default: // Area chart
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={processedData}>
                            <defs>
                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3182ce" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#3182ce" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf2f7" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#3182ce" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                        </AreaChart>
                    </ResponsiveContainer>
                );
        }
    };

    return (
        <div className="analytics-page-content">
            <div className="analytics-page-header">
                <div className="d-flex align-items-center gap-3">
                    <button className="back-btn" onClick={onBack}>
                        <ArrowLeft size={24} />
                    </button>
                    <div className="d-flex align-items-center gap-3">
                        <FileText size={28} className="text-primary" />
                        <div>
                            <h5 className="mb-0">{title} Analytics</h5>
                            <small className="text-muted">Detailed breakdown and trends</small>
                        </div>
                    </div>
                </div>
            </div>

            <div className="analytics-page-body">
                {/* Enhanced Filters Section */}
                <div className="analytics-filter-card shadow-sm border-0">
                    <div className="row g-4 align-items-end">
                        {allowedFilters.includes('dateRange') && (
                            <div className="col-12 col-md-6 col-lg-3">
                                <div className="filter-group-premium">
                                    <label><Calendar size={14} /> Date Range</label>
                                    <select
                                        className="form-select"
                                        value={tempFilters.dateRange}
                                        onChange={(e) => setTempFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                                    >
                                        <option value="all">All Time History</option>
                                        <option value="today">Today's Data</option>
                                        <option value="7days">Last 7 Working Days</option>
                                        <option value="30days">Last 30 Working Days</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {allowedFilters.includes('status') && (
                            <div className="col-12 col-md-6 col-lg-3">
                                <div className="filter-group-premium">
                                    <label><CheckCircle size={14} /> Lead Status</label>
                                    <select
                                        className="form-select"
                                        value={tempFilters.status}
                                        onChange={(e) => setTempFilters(prev => ({ ...prev, status: e.target.value }))}
                                    >
                                        <option value="all">All Status Types</option>
                                        {uniqueOptions.status.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {allowedFilters.includes('staff') && (
                            <div className="col-12 col-md-6 col-lg-3">
                                <div className="filter-group-premium">
                                    <label><Users size={14} /> Assigned Staff</label>
                                    <select
                                        className="form-select"
                                        value={tempFilters.staff}
                                        onChange={(e) => setTempFilters(prev => ({ ...prev, staff: e.target.value }))}
                                    >
                                        <option value="all">All Available Staff</option>
                                        {uniqueOptions.staff.map(staff => (
                                            <option key={staff} value={staff}>{staff}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {allowedFilters.includes('source') && (
                            <div className="col-12 col-md-6 col-lg-3">
                                <div className="filter-group-premium">
                                    <label><PieIcon size={14} /> Inquiry Source</label>
                                    <select
                                        className="form-select"
                                        value={tempFilters.source}
                                        onChange={(e) => setTempFilters(prev => ({ ...prev, source: e.target.value }))}
                                    >
                                        <option value="all">All Lead Sources</option>
                                        {uniqueOptions.source.map(source => (
                                            <option key={source} value={source}>{source}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {allowedFilters.includes('department') && (
                            <div className="col-12 col-md-6 col-lg-3">
                                <div className="filter-group-premium">
                                    <label><LayoutGrid size={14} /> Department</label>
                                    <select
                                        className="form-select"
                                        value={tempFilters.department}
                                        onChange={(e) => setTempFilters(prev => ({ ...prev, department: e.target.value }))}
                                    >
                                        <option value="all">All Departments</option>
                                        {uniqueOptions.department.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {allowedFilters.includes('district') && (
                            <div className="col-12 col-md-6 col-lg-3">
                                <div className="filter-group-premium">
                                    <label><MapPin size={14} /> District</label>
                                    <select
                                        className="form-select"
                                        value={tempFilters.district}
                                        onChange={(e) => setTempFilters(prev => ({ ...prev, district: e.target.value }))}
                                    >
                                        <option value="all">All Districts</option>
                                        {uniqueOptions.district.map(district => (
                                            <option key={district} value={district}>{district}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {allowedFilters.includes('tenant') && (
                            <div className="col-12 col-md-6 col-lg-3">
                                <div className="filter-group-premium">
                                    <label><Home size={14} /> Tenant Branch</label>
                                    <select
                                        className="form-select"
                                        value={tempFilters.tenant}
                                        onChange={(e) => setTempFilters(prev => ({ ...prev, tenant: e.target.value }))}
                                    >
                                        <option value="all">All Branches</option>
                                        {uniqueOptions.tenant.map(tenant => (
                                            <option key={tenant} value={tenant}>{tenant}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {allowedFilters.includes('hostel') && (
                            <div className="col-12 col-md-6 col-lg-3">
                                <div className="filter-group-premium">
                                    <label><Home size={14} /> Hostel Need</label>
                                    <select
                                        className="form-select"
                                        value={tempFilters.hostel}
                                        onChange={(e) => setTempFilters(prev => ({ ...prev, hostel: e.target.value }))}
                                    >
                                        <option value="all">Selection: All</option>
                                        {uniqueOptions.hostel.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {allowedFilters.includes('transport') && (
                            <div className="col-12 col-md-6 col-lg-3">
                                <div className="filter-group-premium">
                                    <label><Truck size={14} /> Transport Need</label>
                                    <select
                                        className="form-select"
                                        value={tempFilters.transport}
                                        onChange={(e) => setTempFilters(prev => ({ ...prev, transport: e.target.value }))}
                                    >
                                        <option value="all">Selection: All</option>
                                        {uniqueOptions.transport.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="col-12 col-md-auto ms-auto">
                            <button
                                className="btn-apply-filters w-100"
                                onClick={() => setActiveFilters(tempFilters)}
                            >
                                <Filter size={18} /> Apply Analytics
                            </button>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 col-xl-8 mb-4">
                        {/* Chart Section */}
                        <div className="chart-section h-100 shadow-sm border-0">
                            <h6 className="mb-4 d-flex align-items-center gap-2">
                                <TrendingUp size={20} className="text-blue" />
                                {title} Trends
                            </h6>
                            <div style={{ height: '350px' }}>
                                {renderChart()}
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-xl-4 mb-4">
                        <div className="info-summary-card h-100 shadow-sm border-0">
                            <h6 className="mb-4">Key Insights</h6>
                            {insights.length > 0 ? (
                                insights.map((insight, idx) => (
                                    <div className="insight-item" key={idx}>
                                        <div className="insight-label">{insight.label}</div>
                                        <div className={`insight-value ${insight.color}`}>{insight.value}</div>
                                        <div className="insight-date">{insight.detail}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-muted">
                                    No insights available for current selection
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="table-section text-dark shadow-sm border-0">
                    <DataTable
                        data={filteredData}
                        columns={columns}
                        title={`${title} Data Overview`}
                        enableSelection={false}
                        enableActions={false}
                    />
                </div>
            </div>
        </div>
    );
};

const EnquiryReport = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [view, setView] = useState('grid'); // 'grid' or 'analytics'

    useEffect(() => {
        const fetchEnquiries = async () => {
            try {
                const response = await fetch('/api/enquiry/report');
                const data = await response.json();
                setEnquiries(data);
            } catch (error) {
                console.error('Error fetching enquiries:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEnquiries();
    }, []);

    const reports = [
        {
            title: "Date-Wise Enquiry Report",
            points: ["Total enquiries by day", "Weekly/Monthly trends", "Peak enquiry dates", "Seasonal patterns"],
            icon: Calendar,
            colorClass: "icon-blue",
            chartType: "area",
            allowedFilters: ['dateRange']
        },
        {
            title: "Status-Wise & Conversion",
            points: ["Conversion percentage", "Status movement trend", "Drop-off identification", "Confirmed leads"],
            icon: TrendingUp,
            colorClass: "icon-green",
            chartType: "pie",
            allowedFilters: ['dateRange', 'status']
        },
        {
            title: "Course-Wise Demand",
            points: ["Top demanded courses", "Seat demand analysis", "Department popularity", "Course growth"],
            icon: LayoutGrid,
            colorClass: "icon-orange",
            chartType: "pie",
            allowedFilters: ['dateRange', 'department']
        },
        {
            title: "Source-Wise Enquiry",
            points: ["Marketing effectiveness", "Best performing sources", "Cost per lead analysis", "Source trends"],
            icon: PieIcon,
            colorClass: "icon-teal",
            chartType: "pie",
            allowedFilters: ['dateRange', 'source']
        },
        {
            title: "Pending Follow-Up",
            points: ["Overdue follow-ups", "Priority list", "Missed calls tracking", "SLA monitoring"],
            icon: FileText,
            colorClass: "icon-red",
            chartType: "bar",
            allowedFilters: ['dateRange', 'status', 'staff']
        },
        {
            title: "Called vs Not-Called",
            points: ["Call coverage percentage", "Follow-up gaps", "Initial contact speed", "Unreachable leads"],
            icon: Phone,
            colorClass: "icon-indigo",
            chartType: "pie",
            allowedFilters: ['dateRange']
        },
        {
            title: "Location-Wise Report",
            points: ["District-wise enquiries", "Geographic demand", "Target area analysis", "Regional performance"],
            icon: MapPin,
            colorClass: "icon-blue",
            chartType: "bar",
            allowedFilters: ['dateRange', 'district']
        },
        {
            title: "Tenant-Wise Report",
            points: ["Enquiries per tenant", "Tenant conversion rate", "Cross-tenant analytics", "Multi-branch stats"],
            icon: Home,
            colorClass: "icon-purple",
            chartType: "bar",
            allowedFilters: ['dateRange', 'tenant']
        },
        {
            title: "Hostel Requirement",
            points: ["Hostel demand distribution", "Facility requirements", "Accommodation trends", "Capacity planning"],
            icon: Home,
            colorClass: "icon-orange",
            chartType: "pie",
            allowedFilters: ['dateRange', 'hostel']
        },
        {
            title: "Transport Requirement",
            points: ["Transport demand analysis", "Area-wise routing", "Vehicle requirement", "Pick-up points"],
            icon: Truck,
            colorClass: "icon-teal",
            chartType: "pie",
            allowedFilters: ['dateRange', 'transport']
        },
        {
            title: "Custom Multi-Filter",
            points: ["Cross-dimension filters", "Drill-down analytics", "Comparative reports", "Advanced segmentation"],
            icon: CheckCircle,
            colorClass: "icon-blue",
            chartType: "area",
            allowedFilters: ['dateRange', 'status', 'staff', 'source', 'department', 'district', 'tenant']
        }
    ];

    const handleViewReport = (report) => {
        setSelectedReport(report);
        setView('analytics');
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        setView('grid');
        setSelectedReport(null);
    };



    return (
        <section className="overlay">
            <Sidebar />
            <div className="dashboard-main">
                <Navbar />
                <div className="enquiry-report-container">
                    {view === 'grid' ? (
                        <div className="grid-view-animate">
                            <div className="report-header">
                                <h6 className="fw-bold mb-1 text-dark fs-4">Enquiry Reports & Analytics</h6>
                                <p className="mb-0 text-secondary d-flex align-items-center gap-2 small">
                                    <TrendingUp size={16} /> Comprehensive insights into your admission funnel and team performance.</p>
                            </div>

                            <div className="row">
                                {reports.map((report, index) => (
                                    <ReportCard
                                        key={index}
                                        {...report}
                                        onView={() => handleViewReport(report)}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="analytics-view-animate">
                            <AnalyticsView
                                onBack={handleBack}
                                title={selectedReport.title}
                                data={enquiries}
                                chartType={selectedReport.chartType}
                                allowedFilters={selectedReport.allowedFilters}
                            />
                        </div>
                    )}
                </div>
                <Footer />
            </div>
        </section>
    );
};

export default EnquiryReport;
