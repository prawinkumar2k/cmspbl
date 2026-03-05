import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../../../../components/Sidebar';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/footer';
import { WhatsAppButton } from '../../../../../components/WhatsAppButton';
import { DataTable } from '../../../../../components/DataTable';
import { Search, Eye, Phone, TrendingUp, Target, Users, Calendar, AlertCircle } from 'lucide-react';
import '../../../../../components/css/LeadManagement.css';

export default function LeadManagement() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch leads from API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/leadManagement');
        if (!response.ok) {
          throw new Error('Failed to fetch leads');
        }
        const data = await response.json();
        setLeads(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching leads:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const matchesStatus = !statusFilter || l.last_status === statusFilter;
      const matchesSearch =
        l.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.phone?.includes(searchTerm) ||
        l.hscRegNo?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [leads, statusFilter, searchTerm]);

  const uniqueStatuses = [...new Set(leads.map(l => l.last_status))];

  const columns = [
    {
      accessorKey: 'student_eqid',
      header: 'EQID',
      cell: ({ getValue }) => (
        <span className="font-bold text-blue-600">{getValue()}</span>
      ),
    },
    {
      accessorKey: 'studentName',
      header: 'Student Name',
      cell: ({ getValue }) => (
        <span className="font-semibold text-gray-900">{getValue()}</span>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ getValue }) => (
        <a href={`tel:${getValue()}`} className="text-blue-600 hover:underline font-medium">
          {getValue()}
        </a>
      ),
    },
    {
      accessorKey: 'student_reg_no',
      header: 'Student Reg No',
      cell: ({ getValue }) => (
        <span className="text-gray-600">{getValue() || '-'}</span>
      ),
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ getValue }) => (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
          {getValue() || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'city',
      header: 'City',
      cell: ({ getValue }) => (
        <span className="text-gray-600">{getValue() || '-'}</span>
      ),
    },
    {
      accessorKey: 'tenant_id',
      header: 'Tenant ID',
      cell: ({ getValue }) => (
        <span className="text-gray-600">{getValue() || '-'}</span>
      ),
    },
    {
      accessorKey: 'staff_id',
      header: 'Staff Id',
      cell: ({ getValue }) => (
        <span className="text-gray-600">{getValue() || '-'}</span>
      ),
    },
    {
      accessorKey: 'staff_name',
      header: 'Staff Name',
      cell: ({ getValue }) => (
        <span className="text-gray-600">{getValue() || '-'}</span>
      ),
    },
    {
      accessorKey: 'last_status',
      header: 'Status',
      cell: ({ getValue }) => (
        <div>
          <span className={`badge ${getValue() === 'Interested' ? 'bg-primary' :
            getValue() === 'Confirmed' ? 'bg-success' :
              getValue() === 'Closed' ? 'bg-danger' :
                getValue() === 'New' ? 'bg-info' :
                  getValue() === 'Forwarded' ? 'bg-warning' :
                    getValue() === 'Interested' ? 'bg-primary' :
                      'bg-secondary'
            }`}>
            {getValue()}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'call_notes_count',
      header: 'Calls',
      cell: ({ getValue }) => (
        <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
          {getValue() || 0}
        </span>
      ),
    },
    {
      accessorKey: 'next_follow_up',
      header: 'Next Follow Up',
      cell: ({ getValue }) => (
        <span className="text-gray-600">{getValue() || '-'}</span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link to={`/admin/admission/enquiry/leads/${row.original.student_eqid}`}>
            <button className="p-2 hover:bg-blue-100 rounded-lg transition">
              <Eye size={18} style={{ color: '#2550d3' }} />
            </button>
          </Link>
          <WhatsAppButton
            phone={row.original.phone}
            studentName={row.original.studentName}
            showText={false}
          />
        </div>
      ),
    },
  ];

  const stats = {
    total: leads.length,
    active: leads.filter(l => l.last_status !== 'Closed' && l.last_status !== 'Rejected').length,
    confirmed: leads.filter(l => l.last_status === 'Confirmed').length,
    closed: leads.filter(l => l.last_status === 'Closed').length,
  };

  return (
    <>
      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">

            {/* Header */}
            <div className="dashboard-header mb-6">
              <h6 className="fw-bold mb-1 text-dark fs-4">Lead Management</h6>
              <p className="mb-0 text-secondary d-flex align-items-center gap-2 small">
                <TrendingUp size={16} />
                Track and nurture leads through the sales pipeline
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-secondary">Loading leads...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="alert alert-danger" role="alert">
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* STATS */}
            {!loading && !error && (
              <>
                <div className="stat-grid">
                  <StatCard
                    title="Total Leads"
                    value={stats.total}
                    icon={Users}
                    color="#2563eb"
                    progress={65}
                    left="Total history"
                    right={`${leads.length} leads`}
                  />
                  <StatCard
                    title="Active Leads"
                    value={stats.active}
                    icon={Phone}
                    color="#059669"
                    progress={Math.round((stats.active / stats.total) * 100) || 0}
                    left="Nurturing now"
                    right="Follow-up active"
                  />
                  <StatCard
                    title="Confirmed Leads"
                    value={stats.confirmed}
                    icon={TrendingUp}
                    color="#9333ea"
                    progress={Math.round((stats.confirmed / stats.total) * 100) || 0}
                    left="Conversion success"
                    right="Verified students"
                  />
                  <StatCard
                    title="Rejected/Closed"
                    value={stats.closed}
                    icon={AlertCircle}
                    color="#ea580c"
                    progress={Math.round((stats.closed / stats.total) * 100) || 0}
                    left="Dropped leads"
                    right="Requires review"
                  />
                </div>

                {/* FILTERS */}
                <div className="lead-filter-card">
                  <div className="lead-filter-grid">

                    <div className="lead-search">
                      <Search size={18} />
                      <input
                        placeholder="Search by name, phone, or HSC no..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="lead-filter-select"
                    >
                      <option value="">All Status</option>
                      {uniqueStatuses.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>

                    <div className="lead-count">
                      Showing <span>{filteredLeads.length}</span> of <span>{leads.length}</span> leads
                    </div>

                  </div>
                </div>

                {/* TABLE */}
                <DataTable
                  data={filteredLeads}
                  columns={columns}
                  title="Lead Management"
                  enableExport={false}
                  enableSelection={false}
                  enableActions={false}
                  pageSize={10}
                />
              </>
            )}

          </div>
          <Footer />
        </div>
      </section>
    </>
  );
}

/* ================== STAT CARD ================== */
function StatCard({ title, value, icon: Icon, color, progress, left, right }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div>
          <div className="stat-title">{title}</div>
          <div className="stat-value" style={{ color }}>{value}</div>
        </div>
        <Icon size={26} color={color} />
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${progress}%`, background: color }}
        />
      </div>

      <div className="stat-footer">
        <span>{left}</span>
        <span>{right}</span>
      </div>
    </div>
  );
}
