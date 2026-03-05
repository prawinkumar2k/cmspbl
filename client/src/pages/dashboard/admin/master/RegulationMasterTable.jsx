import React, { useEffect, useState } from 'react';
import DataTable from '../../../../components/DataTable/DataTable';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegulationMasterTable = ({ refresh, setEditId, setFormState }) => {
  const [regulations, setRegulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    {
      accessorKey: 'sno',
      header: 'S.No',
      cell: ({ row }) => <div className="fw-medium">{row.index + 1}</div>
    },
    {
      accessorKey: 'Regulation',
      header: 'Regulation',
      cell: ({ row }) => <div className="fw-medium">{row.original.Regulation}</div>
    }
  ];

  useEffect(() => {
    const fetchRegulations = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/regulationMaster');
        if (!res.ok) throw new Error('Failed to fetch regulations');
        const data = await res.json();
        setRegulations(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch regulations');
      } finally {
        setLoading(false);
      }
    };
    fetchRegulations();
  }, [refresh]);

  const handleEdit = (regulation) => {
    setEditId(regulation.id);
    setFormState({ Regulation: regulation.Regulation });
    toast.info('Regulation loaded for editing', { autoClose: 2000 });
  };

  const handleDelete = async (regulation) => {
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
                  const res = await fetch(`/api/regulationMaster/${regulation.id}`, { method: 'DELETE' });
                  if (!res.ok) throw new Error('Delete failed');
                  setRegulations(prev => prev.filter(c => c.id !== regulation.id));
                  toast.success('Regulation deleted successfully');
                } catch (err) {
                  toast.error('Failed to delete regulation');
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
        data={regulations}
        columns={columns}
        loading={loading}
        error={error}
        title="Regulation Master Management"
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

export default RegulationMasterTable;
