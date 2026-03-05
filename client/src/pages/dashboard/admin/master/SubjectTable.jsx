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
    { accessorKey: 'Dept_Code', header: 'Department Code', cell: ({ row }) => <div className="fw-medium">{row.original.Dept_Code}</div> },
    { accessorKey: 'Sub_Code', header: 'Subject Code', cell: ({ row }) => <div className="fw-medium">{row.original.Sub_Code}</div> },
    { accessorKey: 'Sub_Name', header: 'Subject Name', cell: ({ row }) => <div className="fw-medium">{row.original.Sub_Name}</div> },
    { accessorKey: 'Semester', header: 'Semester', cell: ({ row }) => <div className="fw-medium">{row.original.Semester}</div> },
    { accessorKey: 'Col_No', header: 'Col No', cell: ({ row }) => <div className="fw-medium">{row.original.Col_No}</div> },
    { accessorKey: 'Regulation', header: 'Regulation', cell: ({ row }) => <div className="fw-medium">{row.original.Regulation}</div> },
    { accessorKey: 'Sub_Type', header: 'Type', cell: ({ row }) => <div className="fw-medium">{row.original.Sub_Type}</div> },
    { accessorKey: 'Total_Hours', header: 'Total Hours', cell: ({ row }) => <div className="fw-medium">{row.original.Total_Hours}</div> },
    { accessorKey: 'Elective', header: 'Elective', cell: ({ row }) => <div className="fw-medium">{row.original.Elective}</div> },
    { accessorKey: 'Elective_No', header: 'Elective_No', cell: ({ row }) => <div className="fw-medium">{row.original.Elective_No}</div> },
    { accessorKey: 'QPC', header: 'QPC', cell: ({ row }) => <div className="fw-medium">{row.original.QPC}</div> },
    { accessorKey: 'Max_Mark', header: 'Max Mark', cell: ({ row }) => <div className="fw-medium">{row.original.Max_Mark}</div> },
    { accessorKey: 'Pass_Mark', header: 'Pass Mark', cell: ({ row }) => <div className="fw-medium">{row.original.Pass_Mark}</div> },
    { accessorKey: 'Internal_Max_Mark', header: 'Internal Max', cell: ({ row }) => <div className="fw-medium">{row.original.Internal_Max_Mark}</div> },
    { accessorKey: 'Internal_Min_Mark', header: 'Internal Min', cell: ({ row }) => <div className="fw-medium">{row.original.Internal_Min_Mark}</div> },
    { accessorKey: 'External_Max_Mark', header: 'External Max', cell: ({ row }) => <div className="fw-medium">{row.original.External_Max_Mark}</div> },
    { accessorKey: 'External_Min_Mark', header: 'External Min', cell: ({ row }) => <div className="fw-medium">{row.original.External_Min_Mark}</div> },
  ];

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/subject');
        if (!res.ok) throw new Error('Failed to fetch subjects');
        const data = await res.json();
        setSubjects(data);
        setError(null);
      } catch (err) {
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
                  const res = await fetch(`/api/subject/${subject.id}`, { method: 'DELETE' });
                  if (!res.ok) throw new Error('Delete failed');
                  setSubjects(prev => prev.filter(s => s.id !== subject.id));
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
        enableSElectivetion={true}
        pageSize={10}
      />
    </div>
  );
};

export default SubjectTable;
