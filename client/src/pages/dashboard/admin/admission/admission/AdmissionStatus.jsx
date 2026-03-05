// AnimatedCircle component for animated circular vacancy status
const AnimatedCircle = ({ percent, color, label, vacant, sanctioned }) => {
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    setTimeout(() => setProgress(percent), 100);
  }, [percent]);
  const size = 70;
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (progress / 100) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 10 }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#eee"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,2,.6,1)' }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="0.3em"
          fontSize="16"
          fontWeight="bold"
          fill={color}
        >
          {percent}%
        </text>
      </svg>
      <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>{label}</div>
      <div style={{ fontSize: 12, color: '#888' }}>{vacant}/{sanctioned} vacant</div>
    </div>
  );
};

// AnimatedBar component for horizontal progress bar with animation
const AnimatedBar = ({ label, percent, color, admitted, sanctioned }) => {
  const [width, setWidth] = React.useState(0);
  React.useEffect(() => {
    setTimeout(() => setWidth(percent), 100); // animate after mount
  }, [percent]);
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, marginBottom: 2 }}>
        <span style={{ fontWeight: 500 }}>{label}</span>
        <span style={{ fontWeight: 500 }}>
          {admitted}/{sanctioned} <span style={{ color: '#888', fontSize: 13, marginLeft: 4 }}>({percent}%)</span>
        </span>
      </div>
      <div style={{ background: '#eee', borderRadius: 8, height: 8, width: '100%', overflow: 'hidden' }}>
        <div
          style={{
            height: 8,
            width: width + '%',
            background: color,
            borderRadius: 8,
            transition: 'width 1s cubic-bezier(.4,2,.6,1)',
            boxShadow: '0 1px 4px 0 rgba(0,0,0,0.07)'
          }}
        />
      </div>
    </div>
  );
};

import React, { useEffect, useState } from "react";

import Sidebar from "../../../../../components/Sidebar";
import Navbar from "../../../../../components/Navbar";
import Footer from "../../../../../components/footer";
import { Icon } from "@iconify/react";
import {
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell,
  LineChart, Line
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#E91E63", "#9C27B0"];

// STATIC SAMPLE DATA (replace with API later)
const SAMPLE_DATA = {
  courseStats: [
    { course: "D.PHARM", admitted: 100 }, // 90% of 110
    { course: "B.PHARM", admitted: 72 }, // 60% of 120
    { course: "M.PHARM", admitted: 9 }   // 50% of 12
  ],

  categoryStats: [
    { course: "D.PHARM", category: "OC", count: 2 },
    { course: "D.PHARM", category: "BC", count: 39 },
    { course: "D.PHARM", category: "MBC", count: 39 },
    { course: "D.PHARM", category: "DNC", count: 0 },
    { course: "D.PHARM", category: "SC", count: 27 },
    { course: "D.PHARM", category: "ST", count: 1 },
  ],

  vacancyData: [
    { course: "B.PHARM", sanctioned: 120, admitted: 0, vacant: 120 },
    { course: "D.PHARM", sanctioned: 100, admitted: 108, vacant: 8 },
    { course: "M.PHARM", sanctioned: 12, admitted: 0, vacant: 10 }
  ],

  trendStats: [
    { date: "2025-01-10", admitted: 10 },
    { date: "2025-01-11", admitted: 18 },
    { date: "2025-01-12", admitted: 33 },
    { date: "2025-01-13", admitted: 50 },
    { date: "2025-01-14", admitted: 75 },
    { date: "2025-01-15", admitted: 108 },
  ]
};

// PREDICTIVE FORECAST (simple projection)
const generateForecast = (trend) => {
  if (!trend.length) return [];

  const last = trend[trend.length - 1];
  const forecast = [];
  const lastDate = new Date(last.date);

  for (let i = 1; i <= 7; i++) {
    const d = new Date(lastDate);
    d.setDate(d.getDate() + i);

    forecast.push({
      date: d.toISOString().slice(0, 10),
      admitted: last.admitted + i * 3 // assume +3 per day
    });
  }

  return forecast;
};

const AdmissionStatus = () => {
  const [dashboard, setDashboard] = useState({
    courseStats: [],
    categorySeries: [],
    vacancyData: [],
    trendStats: [],
    forecast: []
  });

  useEffect(() => {
    const data = SAMPLE_DATA;

    // Convert categoryStats -> stacked category series
    const grouped = {};
    data.categoryStats.forEach((c) => {
      if (!grouped[c.course]) grouped[c.course] = { course: c.course };
      grouped[c.course][c.category] = c.count;
    });

    const categories = ["OC", "BC", "MBC", "DNC", "SC", "ST"];
    const categorySeries = Object.values(grouped).map((row) => {
      categories.forEach((cat) => (row[cat] = row[cat] || 0));
      return row;
    });

    const forecast = generateForecast(data.trendStats);

    setDashboard({
      ...data,
      categorySeries,
      forecast
    });
  }, []);

  const { courseStats, categorySeries, vacancyData, trendStats, forecast } =
    dashboard;

  const pieData = courseStats.map((c) => ({
    name: c.course,
    value: c.admitted
  }));

  return (
    <section className="overlay">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />

        <div className="dashboard-main-body p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h5 className="fw-semibold mb-0">Admission Status Dashboard</h5>
          </div>

          <div className="row g-4">

            {/* COURSE-WISE ADMISSIONS - ANIMATED PROGRESS BARS */}
            <div className="col-lg-6">
              <div className="card p-3">
                <h6 className="fw-semibold mb-3">Course-wise Admissions</h6>
                <div style={{ minHeight: 180 }}>
                  {courseStats.map((c, i) => {
                    // Find sanctioned for this course (for % calculation)
                    const sanctioned = (dashboard.vacancyData.find(v => v.course === c.course)?.sanctioned) || 100;
                    const percent = Math.max(0, Math.min(100, Math.round((c.admitted / sanctioned) * 100)));
                    return (
                      <AnimatedBar
                        key={c.course}
                        label={c.course}
                        percent={percent}
                        color={COLORS[i % COLORS.length]}
                        admitted={c.admitted}
                        sanctioned={sanctioned}
                      />
                    );
                  })}
                </div>
              </div>
            </div>


              {/* ADMISSION TREND & FORECAST - GROUP COLUMN CHART */}
              <div className="col-lg-6">
                <div className="card p-3">
                  <h6 className="fw-semibold mb-3">Admission Trend & Forecast</h6>
                  <BarChart width={500} height={300} data={trendStats.map((d, i) => ({
                    date: d.date,
                    Actual: d.admitted,
                    Forecast: forecast[i] ? forecast[i].admitted : null
                  }))} barCategoryGap={20}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Actual" fill="#0088FE" isAnimationActive={true} animationDuration={1200} />
                    <Bar dataKey="Forecast" fill="#00C49F" isAnimationActive={true} animationDuration={1200} />
                  </BarChart>
                </div>
              </div>


            {/* VACANCY STATUS - ANIMATED CIRCULAR PROGRESS */}
            <div className="col-lg-6">
              <div className="card p-3">
                <h6 className="fw-semibold mb-3">Vacancy Status</h6>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  {vacancyData.map((v, i) => {
                    const percent = v.sanctioned > 0 ? Math.max(0, Math.round((v.vacant / v.sanctioned) * 100)) : 0;
                    return (
                      <AnimatedCircle
                        key={v.course}
                        percent={percent}
                        color={COLORS[i % COLORS.length]}
                        label={v.course}
                        vacant={v.vacant}
                        sanctioned={v.sanctioned}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ADMISSION TREND & FORECAST - GROUP COLUMN CHART */}
            {/* <div className="col-lg-6">
              <div className="card p-3">
                <h6 className="fw-semibold mb-3">Admission Trend & Forecast</h6>
                <BarChart width={500} height={300} data={trendStats.map((d, i) => ({
                  date: d.date,
                  Actual: d.admitted,
                  Forecast: forecast[i] ? forecast[i].admitted : null
                }))} barCategoryGap={20}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Actual" fill="#0088FE" isAnimationActive={true} animationDuration={1200} />
                  <Bar dataKey="Forecast" fill="#00C49F" isAnimationActive={true} animationDuration={1200} />
                </BarChart>
              </div>
            </div> */}

          </div>
        </div>

        <Footer />
      </div>
    </section>
  );
};

export default AdmissionStatus;
