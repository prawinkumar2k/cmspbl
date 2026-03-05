import React, { useState, useEffect } from 'react';
import DataTable from '../../../../components/DataTable/DataTable';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StaffTable = ({ refresh, onDelete, setEditId, onEdit }) => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    {
      accessorKey: 'Staff_ID',
      header: 'Staff ID',
      cell: ({ row }) => <strong>{row.original.Staff_ID}</strong>,
    },
    {
      accessorKey: 'Staff_Name',
      header: 'Name',
      cell: ({ row }) => (
        <div>
          <div className="fw-medium">{row.original.Staff_Name}</div>
        </div>
      ),
    },
    {
      accessorKey: 'Photo',
      header: 'Photo',
      cell: ({ row }) => (
        <img
          src={`/api/staff/staff-image/${row.original.Photo}`}
          alt="Staff"
          style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '50%' }}
          onError={(e) => { e.target.src = '/api/staff/staff-image/staff.png'; }}
        />
      ),
    },
    { accessorKey: 'Designation', header: 'Designation' },
    { accessorKey: 'Qualification', header: 'Qualification' },
    { accessorKey: 'Category', header: 'Category' },
    { accessorKey: 'Course_Name', header: 'Section' },
    { accessorKey: 'Dept_Code', header: 'Department Code' },
    { accessorKey: 'Dept_Name', header: 'Department Name' },

    {
      accessorKey: 'DOB',
      header: 'DOB',
      cell: ({ row }) =>
        row.original.DOB ? new Date(row.original.DOB).toLocaleDateString() : '',
    },
    { accessorKey: 'Mobile', header: 'Mobile' },
    { accessorKey: 'Email', header: 'Email' },
    { accessorKey: 'Religion', header: 'Religion' },
    { accessorKey: 'Community', header: 'Community' },
    { accessorKey: 'Caste', header: 'Caste' },
    { accessorKey: 'Temporary_Address', header: 'Temp Address' },
    { accessorKey: 'Permanent_Address', header: 'Perm Address' },
    { accessorKey: 'Basic_Pay', header: 'Basic Pay' },
    { accessorKey: 'PF_Number', header: 'PF No' },
    {
      accessorKey: 'Joining_Date',
      header: 'Joining Date',
      cell: ({ row }) =>
        row.original.Joining_Date
          ? new Date(row.original.Joining_Date).toLocaleDateString()
          : '',
    },
    {
      accessorKey: 'Reliving_Date',
      header: 'Relieving Date',
      cell: ({ row }) =>
        row.original.Reliving_Date
          ? new Date(row.original.Reliving_Date).toLocaleDateString()
          : '',
    },
    { accessorKey: 'Account_Number', header: 'Account No' },
    { accessorKey: 'Bank_Name', header: 'Bank Name' },
    { accessorKey: 'PAN_Number', header: 'PAN No' },
    { accessorKey: 'Aadhar_Number', header: 'Aadhar No' },
    { accessorKey: 'User_ID', header: 'User ID' },
    { accessorKey: 'Password', header: 'Password' },
    { accessorKey: 'User_Role', header: 'Role' },
  ];

  // ✅ EDIT HANDLER (Same as BranchTable style)
  const handleEdit = (rowData) => {
    if (onEdit) onEdit(rowData);
    if (setEditId) setEditId(rowData.Staff_ID);

    toast.info('Staff details loaded for editing');
  };

  // ✅ DELETE HANDLER (Same as BranchTable style)
  const handleDelete = async (rowData) => {
    const staffDbId = rowData.id;

    toast.dismiss();
    toast(
      ({ closeToast }) => (
        <div>
          <div>Are you sure you want to delete?</div>
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <button
              style={{
                background: '#d32f2f',
                color: 'white',
                border: 'none',
                padding: '4px 12px',
                borderRadius: 4,
              }}
              onClick={async () => {
                try {
                  const res = await fetch(`/api/staff_master/${staffDbId}`, {
                    method: 'DELETE',
                  });
                  if (!res.ok) throw new Error('Delete failed');

                  setStaff((prev) => prev.filter((st) => st.id !== staffDbId));
                  toast.success('Staff deleted successfully');

                  if (onDelete) onDelete(staffDbId);

                } catch (err) {
                  toast.error('Failed to delete staff');
                }
                closeToast();
              }}
            >
              Delete
            </button>
            <button
              style={{
                background: '#757575',
                color: 'white',
                border: 'none',
                padding: '4px 12px',
                borderRadius: 4,
              }}
              onClick={closeToast}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  // FETCH DATA
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/staff_master');
        if (!res.ok) throw new Error('Failed to fetch');

        const data = await res.json();
        setStaff(data);
        setError(null);

      } catch (err) {
        setError('Failed to fetch staff data');
        toast.error('Failed to load staff data');
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [refresh]);

  return (
    <div className="mt-4">
      <DataTable
        data={staff}
        columns={columns}
        loading={loading}
        error={error}
        title="Staff Management"
        onEdit={handleEdit}
        onDelete={handleDelete}
        enableExport={false}
        enableSelection={true}
        pageSize={10}
      />

      {/* Toast container same as BranchTable */}
      <ToastContainer position="top-right" />
    </div>
  );
};

export default StaffTable;
