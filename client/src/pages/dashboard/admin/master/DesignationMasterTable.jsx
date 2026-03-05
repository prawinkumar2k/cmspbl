import React, { useEffect, useState } from 'react';
import DataTable from '../../../../components/DataTable/DataTable';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DesignationMasterTable = ({ refresh, setEditId, setFormState }) => {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    {
      accessorKey: 'sno',
      header: 'S.No',
      cell: ({ row }) => <div className="fw-medium">{row.index + 1}</div>
    },
    {
      accessorKey: 'Designation',
      header: 'Designation',
      cell: ({ row }) => <div className="fw-medium">{row.original.Designation}</div>
    }
  ];

  useEffect(() => {
    const fetchDesignations = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/designationMaster');
        if (!res.ok) throw new Error('Failed to fetch designations');
        const data = await res.json();
        setDesignations(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch designations');
      } finally {
        setLoading(false);
      }
    };
    fetchDesignations();
  }, [refresh]);

  const handleEdit = (designation) => {
    setEditId(designation.id);
    setFormState({ Designation: designation.Designation });
    toast.info('Designation loaded for editing', { autoClose: 2000 });
  };

  const handleDelete = async (designation) => {
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
                  const res = await fetch(`/api/designationMaster/${designation.id}`, { method: 'DELETE' });
                  if (!res.ok) throw new Error('Delete failed');
                  setDesignations(prev => prev.filter(c => c.id !== designation.id));
                  toast.success('Designation deleted successfully');
                } catch (err) {
                  toast.error('Failed to delete designation');
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
        data={designations}
        columns={columns}
        loading={loading}
        error={error}
        title="Designation Master Management"
        onEdit={handleEdit}
        onDelete={handleDelete}
        enableExport={false}
        enableSelection={true}
        pageSize={10}
      />
    </div>
  );
};

export default DesignationMasterTable;
