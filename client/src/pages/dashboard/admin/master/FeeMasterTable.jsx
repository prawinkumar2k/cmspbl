import React, { useEffect, useState } from 'react';
import DataTable from '../../../../components/DataTable/DataTable';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FeeMasterTable = ({ refresh, setEditId, setFormState }) => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    {
      accessorKey: 'sno',
      header: 'S.No',
      cell: ({ row }) => <div className="fw-medium">{row.index + 1}</div>
    },
    {
      accessorKey: 'Fee_Type',
      header: 'Fee Type',
      cell: ({ row }) => <div className="fw-medium">{row.original.Fee_Type}</div>
    }
  ];

  useEffect(() => {
    const fetchFees = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/feeMaster');
        if (!res.ok) throw new Error('Failed to fetch fees');
        const data = await res.json();
        setFees(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch fees');
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, [refresh]);

  const handleEdit = (fee) => {
    setEditId(fee.id);
    setFormState({ Fee_Type: fee.Fee_Type });
    toast.info('Fee type loaded for editing', { autoClose: 2000 });
  };

  const handleDelete = async (fee) => {
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
                  const res = await fetch(`/api/feeMaster/${fee.id}`, { method: 'DELETE' });
                  if (!res.ok) throw new Error('Delete failed');
                  setFees(prev => prev.filter(c => c.id !== fee.id));
                  toast.success('Fee type deleted successfully');
                } catch (err) {
                  toast.error('Failed to delete fee type');
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
        data={fees}
        columns={columns}
        loading={loading}
        error={error}
        title="Fee Master Management"
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

export default FeeMasterTable;
