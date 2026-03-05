import React, { useMemo, useEffect, useState } from "react";
import Sidebar from "../../../../../components/Sidebar";
import Navbar from "../../../../../components/Navbar";
import Footer from "../../../../../components/footer";
import {Airplay } from 'react-feather';

import {
  BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

import {
  Users, Calendar, Target, AlertCircle,
  CheckCircle, TrendingUp
} from "lucide-react";

import "../../../../../components/css/EnquiryDashboard.css";

/* ---------------- TOOLTIP ---------------- */
const DashboardTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="dashboard-tooltip">
      <strong>{label}</strong>
      <div>Value : {payload[0].value}</div>
    </div>
  );
};

/* ---------------- STAT CARD ---------------- */
const StatCard = ({ title, value, icon: Icon, color, progress, left, right }) => (
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

/* ---------------- MAIN COMPONENT ---------------- */
const EnquiryDashboard = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEnquiries() {
      try {
        const res = await fetch("/api/enquiry/all");
        if (!res.ok) throw new Error("Failed to fetch enquiries");
        const data = await res.json();
        setEnquiries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEnquiries();
  }, []);

  const analytics = useMemo(() => {
    if (!enquiries.length) return {
      total: 0,
      today: 0,
      conversion: "0%",
      pending: 0,
      source: [],
      course: [],
      school: [],
      status: [],
      hostel: [],
      area: []
    };
    // Grouping logic based on backend data structure
    const group = (key) =>
      Object.entries(
        enquiries.reduce((a, c) => {
          a[c[key]] = (a[c[key]] || 0) + 1;
          return a;
        }, {})
      ).map(([name, value]) => ({ name, value }));

    // Helper to extract short name (before first space or parenthesis)
    const getShortName = (str) => {
      if (!str) return '';
      // If there's a parenthesis, take before it, else take first word
      const parenIdx = str.indexOf('(');
      if (parenIdx > 0) return str.slice(0, parenIdx).trim();
      // Otherwise, take up to first space
      return str.split(' ')[0];
    };

    // Conversion rate and pending follow-ups
    const converted = enquiries.filter(e => e.last_status === "Confirmed").length;
    const pending = enquiries.filter(e => e.next_follow_up !== null).length;
    // Today enquiry: Created_Date matches today (date only, yyyy-mm-dd, no timezone issues)
    const today = new Date().toISOString().slice(0, 10); // "2026-01-26"
    const todaysEnquiries = enquiries.filter(e => e.Created_Date.slice(0, 10) === today);


    return {
      total: enquiries.length,
      today: todaysEnquiries,
      conversion: `${Math.round((converted / enquiries.length) * 100) || 0}%`,
      pending,
      source: group("source"),
      // Add shortName for each course
      course: group("department").map(c => ({ ...c, shortName: getShortName(c.name) })),
      school: group("school_type"),
      status: group("last_status"),
      hostel: [
        { name: "With Hostel", value: enquiries.filter(e => e.hostel === "Yes").length },
        { name: "Without Hostel", value: enquiries.filter(e => e.hostel !== "Yes").length }
      ],
      area: group("student_district")
    };
  }, [enquiries]);

  // Optionally show loading/error
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="overlay">
      <Sidebar />

      <div className="dashboard-main">
        <Navbar />

        <div className="dashboard-body">

          {/* HEADER */}
          <div className="dashboard-header">
            <h6>Dashboard Overview</h6>
            <p className="text-secondary flex items-center gap-2">
              <Airplay size={16} /> Real-time analytics and performance metrics</p>
          </div>

          {/* STAT CARDS */}
          <div className="stat-grid">
            <StatCard title="Total Enquiries" value={analytics.total} icon={Users} color="#2563eb" progress={65} left="0% today" right="+12% from last month" />
            <StatCard title="Today's Enquiries" value={analytics.today.length} icon={Calendar} color="#059669" progress={30} left="New registrations" right="Right on track" />
            <StatCard title="Conversion Rate" value={analytics.conversion} icon={Target} color="#9333ea" progress={20} left="1 lead converted" right="Industry avg 28%" />
            <StatCard title="Pending Follow-ups" value={analytics.pending} icon={AlertCircle} color="#ea580c" progress={75} left="Action needed" right="Requires attention" />
          </div>

          {/* METRICS */}
          {/* ===== ENHANCED METRIC CARDS ===== */}
<div className="metric-grid">

  {/* Converted Leads: last_status === 'Confirmed' */}
  <div className="metric-card gradient-green">
    <div className="metric-header">
      <h6>Converted Leads</h6>
      <CheckCircle className="metric-icon green" />
    </div>
    <div className="metric-value green-text">{enquiries.filter(e => e.last_status === 'Confirmed').length}</div>
    <div className="metric-progress">
      <span className="fill green-fill" style={{ width: `${enquiries.length ? (enquiries.filter(e => e.last_status === 'Confirmed').length / enquiries.length) * 100 : 0}%` }} />
    </div>
    <p className="metric-note">📈 Strong conversion pipeline</p>
  </div>

  {/* Active Callers: unique staff_name count */}
  <div className="metric-card gradient-blue">
    <div className="metric-header">
      <h6>Active Callers</h6>
      <Users className="metric-icon blue" />
    </div>
    <div className="metric-value blue-text">{[...new Set(enquiries.map(e => e.staff_name))].length}</div>
    <div className="metric-progress">
      <span className="fill blue-fill" style={{ width: `${enquiries.length ? ([...new Set(enquiries.map(e => e.staff_name))].length / enquiries.length) * 100 : 0}%` }} />
    </div>
    <p className="metric-note">✅ Team fully operational</p>
  </div>

  {/* Top Lead Status: most frequent last_status */}
  <div className="metric-card gradient-purple">
    <div className="metric-header">
      <h6>Top Lead Status</h6>
      <TrendingUp className="metric-icon purple" />
    </div>
    <div className="metric-value purple-text">{
      (() => {
        if (!enquiries.length) return '-';
        const freq = enquiries.reduce((a, c) => {
          a[c.last_status] = (a[c.last_status] || 0) + 1;
          return a;
        }, {});
        return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
      })()
    }</div>
    <div className="metric-progress">
      <span className="fill purple-fill" style={{ width: `${enquiries.length ? (Math.max(...Object.values(enquiries.reduce((a, c) => { a[c.last_status] = (a[c.last_status] || 0) + 1; return a; }, {}))) / enquiries.length) * 100 : 0}%` }} />
    </div>
    <p className="metric-note">📊 Majority shows strong interest</p>
  </div>

</div>


          {/* CHARTS ROW 1 */}
          <div className="chart-grid">
            <div className="chart-card">
              <h6>Source-wise Enquiries</h6>
              <p className="chart-subtitle">📊 Channel performance analysis</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={analytics.source}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip content={<DashboardTooltip />} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h6>Top Courses Demanded</h6>
              <p className="chart-subtitle">🎓 Student preferences overview</p>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={analytics.course} dataKey="value" outerRadius={90} label={({ shortName, value }) => `${shortName}: ${value}`}>
                    {analytics.course.map((_, i) => (
                      <Cell key={i} fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444"][i]} />
                    ))}
                  </Pie>
                  <Tooltip content={<DashboardTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CHARTS ROW 2 (NEW) */}
          <div className="triple-chart-grid">

            <div className="chart-card soft-pink">
              <h6>School Type</h6>
              <p className="chart-subtitle">🏛️ Institution analysis</p>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={analytics.school} dataKey="value" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                    <Cell fill="#3b82f6" />
                    <Cell fill="#10b981" />
                  </Pie>
                  <Tooltip content={<DashboardTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card soft-green">
              <h6>Hostel Requirement</h6>
              <p className="chart-subtitle">🏠 Facility demand</p>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={analytics.hostel} dataKey="value" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                    <Cell fill="#3b82f6" />
                    <Cell fill="#10b981" />
                  </Pie>
                  <Tooltip content={<DashboardTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card soft-yellow">
              <h6>Status Distribution</h6>
              <p className="chart-subtitle">📊 Enquiry lifecycle</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart layout="vertical" data={analytics.status} margin={{ left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" fontSize={12} />
                  <YAxis type="category" dataKey="name" fontSize={12} />
                  <Tooltip content={<DashboardTooltip />} />
                  <Bar dataKey="value" fill="#10b981" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>

          {/* AREA */}
          <div className="chart-card full">
            <h6>Area-wise Enquiries (Top 5)</h6>
            <p className="chart-subtitle">🗺️ Geographic distribution of leads</p>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.area}>
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip content={<DashboardTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#0284c7" fill="url(#areaFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </div>

        <Footer />
      </div>
    </section>
  );
};

export default EnquiryDashboard;
