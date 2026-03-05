import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DataTable, { StatusBadge } from '../../../../components/DataTable/DataTable';

const FeeTable = ({ refreshTrigger, setForm, setEditId, setFilteredDepartments }) => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define table columns for fee management
  const columns = [
    {
      accessorKey: 'slNo',
      header: 'S.No',
      cell: ({ row }) => (
        <div className="fw-medium">{row.index + 1}</div>
      ),
    },
    {
      accessorKey: 'Academic_Year',
      header: 'Academic Year',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.Academic_Year}</div>
      ),
    },
    {
      accessorKey: 'Mode_of_Join',
      header: 'Mode of Join',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.Mode_of_Join}</div>
      ),
    },
    {
      accessorKey: 'Type',
      header: 'Type',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.Type}</div>
      ),
    },
    {
      accessorKey: 'Course_Name',
      header: 'Course Name',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.Course_Name}</div>
      ),
    },
    {
      accessorKey: 'Dept_Name',
      header: 'Department',
      cell: ({ row }) => (
        <div>
          <div className="fw-medium">{row.original.Dept_Name}</div>
          <small className="text-muted">Code: {row.original.Dept_Code}</small>
        </div>
      ),
    },
    {
      accessorKey: 'Semester',
      header: 'Semester',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.Semester}</div>
      ),
    },
    {
      accessorKey: 'Year',
      header: 'Year',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.Year}</div>
      ),
    },
    {
      accessorKey: 'Fees_Type',
      header: 'Fee Type',
      cell: ({ row }) => (
        <div>
          <span className={`badge ${
            row.original.Fees_Type === 'TUITION FEE' ? 'bg-primary' :
            row.original.Fees_Type === 'HOSTEL FEE' ? 'bg-success' :
            row.original.Fees_Type === 'MESS FEE' ? 'bg-warning' :
            row.original.Fees_Type === 'TRANSPORT FEE' ? 'bg-info' :
            row.original.Fees_Type === 'LAB FEE' ? 'bg-secondary' :
            row.original.Fees_Type === 'LIBRARY FEE' ? 'bg-dark' :
            'bg-secondary'
          }`}>
            {row.original.Fees_Type}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'Amount',
      header: 'Amount',
      cell: ({ row }) => (
        <div className="fw-medium text-success">
          ₹{Number(row.original.Amount).toLocaleString()}
        </div>
      ),
    },
  ];

  // Fetch fee details from API
  useEffect(() => {
    const fetchFees = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/courseFees');
        if (!response.ok) throw new Error('Failed to fetch fee details');
        const data = await response.json();
        setFees(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch fee data');
        toast.error('Failed to load fee data');
        setFees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, [refreshTrigger]);

  const handleEdit = async (fee) => {
    // Fetch departments for the selected course
    try {
      const response = await fetch('/api/courseFees/departments');
      const allDepts = await response.json();
      const filtered = Array.isArray(allDepts) 
        ? allDepts.filter(dept => dept.Course_Name === fee.Course_Name)
        : [];
      setFilteredDepartments(filtered);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }

    // Populate form with fee details
    setForm({
      academicYear: fee.Academic_Year || '',
      modeOfJoin: fee.Mode_of_Join || '',
      type: fee.Type || '',
      course: fee.Course_Name || '',
      department: fee.Dept_Name || '',
      departmentCode: fee.Dept_Code || '',
      feeSem: fee.Semester || '',
      year: fee.Year || '',
      feeType: fee.Fees_Type || '',
      amount: fee.Amount || ''
    });
    
    setEditId(fee.Id);
    toast.info('Fee details loaded for editing', { autoClose: 2000 });
    
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                  const res = await fetch(`/api/courseFees/${fee.Id}`, { method: 'DELETE' });
                  if (!res.ok) throw new Error('Delete failed');
                  setFees(prev => prev.filter(f => f.Id !== fee.Id));
                  toast.success('Fee record deleted successfully', { autoClose: 2000 });
                } catch (err) {
                  toast.error('Failed to delete fee record');
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
        title="Fee Management"
        onEdit={handleEdit}
        onDelete={handleDelete}
        enableExport={false}
        enableSelection={true}
        pageSize={10}
      />
    </div>
  );
};

export default FeeTable;
