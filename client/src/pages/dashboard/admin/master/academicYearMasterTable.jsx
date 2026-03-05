import React, { useEffect, useState } from 'react';
import DataTable from '../../../../components/DataTable/DataTable';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AcademicYearMasterTable = ({ refresh, setEditId, setFormState }) => {
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    {
      accessorKey: 'sno',
      header: 'S.No',
      cell: ({ row }) => <div className="fw-medium">{row.index + 1}</div>
    },
    {
      accessorKey: 'Academic_Year',
      header: 'Academic Year',
      cell: ({ row }) => <div className="fw-medium">{row.original.Academic_Year}</div>
    }
  ];

  useEffect(() => {
    const fetchYears = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/academicYearMaster');
        if (!res.ok) throw new Error('Failed to fetch academic years');
        const data = await res.json();
        setYears(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch academic years');
      } finally {
        setLoading(false);
      }
    };
    fetchYears();
  }, [refresh]);

  const handleEdit = (year) => {
    setEditId(year.Id);
    setFormState({ Academic_Year: year.Academic_Year });
    toast.info('Academic year loaded for editing', { autoClose: 2000 });
  };

  const handleDelete = async (year) => {
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
                  const res = await fetch(`/api/academicYearMaster/${year.Id}`, { method: 'DELETE' });
                  if (!res.ok) throw new Error('Delete failed');
                  setYears(prev => prev.filter(c => c.Id !== year.Id));
                  toast.success('Academic year deleted successfully');
                } catch (err) {
                  toast.error('Failed to delete academic year');
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
        data={years}
        columns={columns}
        loading={loading}
        error={error}
        title="Academic Year Master Management"
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

export default AcademicYearMasterTable;
