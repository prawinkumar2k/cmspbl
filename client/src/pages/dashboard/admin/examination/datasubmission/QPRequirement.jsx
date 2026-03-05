import React, { useState, useEffect, useMemo } from "react";
import { toast, ToastContainer } from 'react-toastify';
import { Icon } from "@iconify/react";
import Navbar from "../../../../../components/Navbar";
import Sidebar from "../../../../../components/Sidebar";
import Footer from "../../../../../components/footer";
import DataTable from "../../../../../components/DataTable/DataTable";
import api from '../../../../../utils/api';
// import "./CourseDetails.css";


const QPRequirement = () => {
  const [qpData, setQpData] = useState([]);
  const [viewModal, setViewModal] = useState({ show: false, qp: null });
  const [expandedRows, setExpandedRows] = useState(new Set());


  useEffect(() => {
    api.get('/qpRequirement')
      .then(res => setQpData(res.data))
      .catch(() => toast.error('Failed to fetch QP Requirement data'));
  }, []);

  const getCurrentDate = () =>
    new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });



  // View action: show modal with details
  const handleView = (item) => setViewModal({ show: true, qp: item });

  // Edit action: expand row for inline editing
  const handleEdit = (item) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(item.id)) newSet.delete(item.id);
      else newSet.add(item.id);
      return newSet;
    });
  };

  // Delete action: remove from DB and update UI
  const handleDeleteRow = async (item) => {
    try {
      await api.delete(`/qpRequirement/${item.id}`);
      // Refresh data from DB
      const res = await api.get('/qpRequirement');
      setQpData(res.data);
      toast.success('QP Requirement deleted');
    } catch {
      toast.error('Failed to delete QP Requirement');
    }
  };

  const handleFieldChange = (rowId, field, value) => {
    setQpData(prevData => prevData.map(qp =>
      qp.id === rowId ? { ...qp, [field]: value, _edited: true } : qp
    ));
  };

  const handleOk = async (rowId) => {
    const qp = qpData.find(q => q.id === rowId);
    try {
      const payload = {
        eqc: qp.eqc,
        course: qp.course,
        cno: qp.cno,
        sem: qp.sem,
        elective: qp.elective,
        regl: qp.regl,
        subcode: qp.subcode,
        subname: qp.subname,
        candidates: qp.candidates
      };
      await api.put(`/qpRequirement/${rowId}`, payload);
      // Refresh data from DB
      const res = await api.get('/qpRequirement');
      setQpData(res.data);
      setQpData(prev => prev.map(q => q.id === rowId ? { ...q, _edited: false } : q));
      setExpandedRows(prev => {
        const newSet = new Set(prev);
        newSet.delete(rowId);
        return newSet;
      });
      toast.success('QP Requirement updated');
    } catch {
      toast.error('Failed to update QP Requirement');
    }
  };

  const columns = [
    {
      accessorKey: 'sno',
      header: 'S.No',
      cell: ({ row }) => <div className="fw-medium">{row.index + 1}</div>
    },
    { accessorKey: 'eqc', header: 'QPC/EQC', cell: ({ row }) => <div>{row?.original?.eqc ?? '-'}</div> },
    { accessorKey: 'course', header: 'Dept Code', cell: ({ row }) => <div>{row?.original?.course ?? '-'}</div> },
    { accessorKey: 'elective', header: 'Elective', cell: ({ row }) => <div>{row?.original?.elective ?? '-'}</div> },
    { accessorKey: 'sem', header: 'Semester', cell: ({ row }) => <div>{row?.original?.sem ?? '-'}</div> },
    { accessorKey: 'regl', header: 'Regulation', cell: ({ row }) => <div>{row?.original?.regl ?? '-'}</div> },
    { accessorKey: 'subcode', header: 'Subject Code', cell: ({ row }) => <div>{row?.original?.subcode ?? '-'}</div> },
    { accessorKey: 'subname', header: 'Subject Name', cell: ({ row }) => <div>{row?.original?.subname ?? '-'}</div> },
    { accessorKey: 'regular_count', header: 'Regular Count', cell: ({ row }) => <div>{row?.original?.regular_count ?? 0}</div> },
    { accessorKey: 'arrear_count', header: 'Arrear Count', cell: ({ row }) => <div>{row?.original?.arrear_count ?? 0}</div> },
    { accessorKey: 'candidates', header: 'Total Candidates', cell: ({ row }) => <div className="badge bg-success fw-bold">{row?.original?.candidates ?? 0}</div> },
  ];

  return (
    <>
      {viewModal.show && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#fff', borderRadius: 8, minWidth: 320, maxWidth: 400, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.15)', position: 'relative' }}>
            <button style={{ position: 'absolute', top: 8, right: 12, border: 'none', background: 'none', fontSize: 22, cursor: 'pointer' }} onClick={() => setViewModal({ show: false, qp: null })}>&times;</button>
            <h5 style={{ marginBottom: 18 }}>QP Requirement Details</h5>
            {viewModal.qp && (
              <div style={{ lineHeight: 2 }}>
                <div><b>EQC:</b> {viewModal.qp.eqc}</div>
                <div><b>Course:</b> {viewModal.qp.course}</div>
                <div><b>CNo:</b> {viewModal.qp.cno}</div>
                <div><b>Sem:</b> {viewModal.qp.sem}</div>
                <div><b>Elective:</b> {viewModal.qp.elective}</div>
                <div><b>Regl:</b> {viewModal.qp.regl}</div>
                <div><b>SubCode:</b> {viewModal.qp.subcode}</div>
                <div><b>Subject Name:</b> {viewModal.qp.subname}</div>
                <div><b>Regular Count:</b> {viewModal.qp.regular_count}</div>
                <div><b>Arrear Count:</b> {viewModal.qp.arrear_count}</div>
                <div><b>Total Candidates:</b> {viewModal.qp.candidates}</div>
              </div>
            )}
            <div style={{ textAlign: 'right', marginTop: 18 }}>
              <button className="btn btn-outline-primary-600" onClick={() => setViewModal({ show: false, qp: null })}>Close</button>
            </div>
          </div>
        </div>
      )}
      <section className="overlay">
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">
            {/* Breadcrumb Header */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">QP Requirement</h6>
            </div>
            {/* Use CourseDetails style classes for consistent layout */}
            <div className="cd-table-container" style={{ marginTop: 16 }}>
              {/* Main card with table - removed outer card, fieldset, and legend as per HallDetails.jsx */}
              <DataTable
                data={qpData}
                columns={columns}
                loading={false}
                title={""}
                enableExport={false}
                enableSelection={false}
                showControls={false}
                showHeader={false}
                enableActions={false}
                pageSize={10}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteRow}
              />
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
};

export default QPRequirement;
