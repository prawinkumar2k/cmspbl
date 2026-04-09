import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataTable, { StatusBadge } from '../../../../components/DataTable/DataTable';

const SubjectTable = ({ refreshTrigger, onEdit }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define table columns
  const columns = [
    { accessorKey: 'deptCode', header: 'Department Code', cell: ({ row }) => <div className="fw-medium">{row.original.deptCode || row.original.Dept_Code}</div> },
    { accessorKey: 'subCode', header: 'Subject Code', cell: ({ row }) => <div className="fw-medium">{row.original.subCode || row.original.Sub_Code}</div> },
    { accessorKey: 'subName', header: 'Subject Name', cell: ({ row }) => <div className="fw-medium">{row.original.subName || row.original.Sub_Name}</div> },
    { accessorKey: 'semester', header: 'Semester', cell: ({ row }) => <div className="fw-medium">{row.original.semester || row.original.Semester}</div> },
    { accessorKey: 'colNo', header: 'Col No', cell: ({ row }) => <div className="fw-medium">{row.original.colNo || row.original.Col_No}</div> },
    { accessorKey: 'regulation', header: 'Regulation', cell: ({ row }) => <div className="fw-medium">{row.original.regulation || row.original.Regulation}</div> },
    { accessorKey: 'subType', header: 'Type', cell: ({ row }) => <div className="fw-medium">{row.original.subType || row.original.Sub_Type}</div> },
    { accessorKey: 'totalHours', header: 'Total Hours', cell: ({ row }) => <div className="fw-medium">{row.original.totalHours || row.original.Total_Hours}</div> },
    { accessorKey: 'elective', header: 'Elective', cell: ({ row }) => <div className="fw-medium">{row.original.elective || row.original.Elective}</div> },
    { accessorKey: 'electiveNo', header: 'Elective_No', cell: ({ row }) => <div className="fw-medium">{row.original.electiveNo || row.original.Elective_No}</div> },
    { accessorKey: 'qpc', header: 'QPC', cell: ({ row }) => <div className="fw-medium">{row.original.qpc || row.original.QPC}</div> },
    { accessorKey: 'maxMark', header: 'Max Mark', cell: ({ row }) => <div className="fw-medium">{row.original.maxMark || row.original.Max_Mark}</div> },
    { accessorKey: 'minMark', header: 'Pass Mark', cell: ({ row }) => <div className="fw-medium">{row.original.minMark || row.original.Pass_Mark}</div> },
    { accessorKey: 'internalMaxMark', header: 'Internal Max', cell: ({ row }) => <div className="fw-medium">{row.original.internalMaxMark || row.original.Internal_Max_Mark}</div> },
    { accessorKey: 'internalMinMark', header: 'Internal Min', cell: ({ row }) => <div className="fw-medium">{row.original.internalMinMark || row.original.Internal_Min_Mark}</div> },
    { accessorKey: 'externalMaxMark', header: 'External Max', cell: ({ row }) => <div className="fw-medium">{row.original.externalMaxMark || row.original.External_Max_Mark}</div> },
    { accessorKey: 'externalMinMark', header: 'External Min', cell: ({ row }) => <div className="fw-medium">{row.original.externalMinMark || row.original.External_Min_Mark}</div> },
  ];

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/subject');
        if (!res.ok) throw new Error('Failed to fetch subjects');
        const data = await res.json();
        setSubjects(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setSubjects([]);
        setError('Failed to fetch subjects data');
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [refreshTrigger]);

  const handleEdit = (subject) => {
    if (onEdit) onEdit(subject);
    toast.info('Subject details loaded for editing', { autoClose: 2000 });
  };

  const handleDelete = async (subject) => {
    const id = subject._id || subject.id;
    toast.dismiss();
    const toastId = toast(
      ({ closeToast }) => (
        <div>
          <div>Are you sure you want to delete?</div>
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <button
              style={{ background: '#d32f2f', color: 'white', border: 'none', padding: '4px 12px', borderRadius: 4 }}
              onClick={async () => {
                try {
                  const res = await fetch(`/api/subject/${id}`, { method: 'DELETE' });
                  if (!res.ok) throw new Error('Delete failed');
                  setSubjects(prev => prev.filter(s => (s._id || s.id) !== id));
                  toast.success('Subject deleted successfully');
                } catch (err) {
                  toast.error('Failed to delete subject');
                }
                toast.dismiss(toastId);
              }}
            >Delete</button>
            <button
              style={{ background: '#757575', color: 'white', border: 'none', padding: '4px 12px', borderRadius: 4 }}
              onClick={() => toast.dismiss(toastId)}
            >Cancel</button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  return (
    <div className="mt-4">
      <DataTable
        data={subjects}
        columns={columns}
        loading={loading}
        error={error}
        title="Subject Management"
        onEdit={handleEdit}
        onDelete={handleDelete}
        enableExport={false}
        enableSelection={true}
        pageSize={10}
      />
    </div>
  );
};

export default SubjectTable;
