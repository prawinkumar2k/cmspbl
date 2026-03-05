import React, { useEffect, useState } from 'react';
import DataTable from '../../../../components/DataTable/DataTable';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SemesterMasterTable = ({ refresh, setEditId, setFormState }) => {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    {
      accessorKey: 'sno',
      header: 'S.No',
      cell: ({ row }) => <div className="fw-medium">{row.index + 1}</div>
    },
    {
      accessorKey: 'Semester',
      header: 'Semester',
      cell: ({ row }) => <div className="fw-medium">{row.original.Semester}</div>
    },
    {
      accessorKey: 'Year',
      header: 'Year',
      cell: ({ row }) => <div className="fw-medium">{row.original.Year}</div>
    }

  ];

  useEffect(() => {
    const fetchSemesters = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/semesterMaster');
        if (!res.ok) throw new Error('Failed to fetch semesters');
        const data = await res.json();
        setSemesters(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch semesters');
      } finally {
        setLoading(false);
      }
    };
    fetchSemesters();
  }, [refresh]);

  const handleEdit = (semester) => {
    setEditId(semester.id);
    setFormState({ Semester: semester.Semester, Year: semester.Year });
    toast.info('Semester loaded for editing', { autoClose: 2000 });
  };

  const handleDelete = async (semester) => {
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
                  const res = await fetch(`/api/semesterMaster/${semester.id}`, { method: 'DELETE' });
                  if (!res.ok) throw new Error('Delete failed');
                  setSemesters(prev => prev.filter(c => c.id !== semester.id));
                  toast.success('Semester deleted successfully');
                } catch (err) {
                  toast.error('Failed to delete semester');
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
        data={semesters}
        columns={columns}
        loading={loading}
        error={error}
        title="Semester Master Management"
        onEdit={handleEdit}
        onDelete={handleDelete}
        enableExport={false}
        enableSelection={true}
        pageSize={10}
      />
      <ToastContainer position="top-right" />
    </div>
  );
};

export default SemesterMasterTable;
