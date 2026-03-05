import React, { useState, useEffect } from 'react';
import DataTable, { StatusBadge } from '../../../../components/DataTable/DataTable';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BranchTable = ({ refreshTrigger, setBranchState, branchState, setEditId }) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Define table columns
  const columns = [
    {
      accessorKey: 'deptCode',
      header: 'Department Code',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.Dept_Code}</div>
      ),
    },
    {
      accessorKey: 'deptName',
      header: 'Department Name',
      cell: ({ row }) => (
        <div>
          <div className="fw-medium">{row.original.Dept_Name}</div>
        </div>
      ),
    },
    {
      accessorKey: 'deptYearOfCourse',
      header: 'Year of Department',
      cell: ({ row }) => (
        <div>
          <div className="fw-medium">{row.original.Year_Of_Course}</div>
        </div>
      ),
    },
    {
      accessorKey: 'deptOrder',
      header: 'Department Order',
      cell: ({ row }) => (
        <div>
          <div className="fw-medium">{row.original.Dept_Order}</div>
        </div>
      ),
    },
    {
      accessorKey: 'institutionType',
      header: 'Institution Type',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.Ins_Type}</div>
      ),
    },
    {
      accessorKey: 'mode',
      header: 'Course Mode',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.Course_Mode}</div>
      ),
    },
    {
      accessorKey: 'courseName',
      header: 'Course Name',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.Course_Name}</div>
      ),
    },
    {
      accessorKey: 'sanctionedIntake',
      header: 'Intake',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.Intake}</div>
      ),
    },
    {
      accessorKey: 'addlSeats',
      header: 'Addl Seats',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.AddlSeats}</div>
      ),
    },
    {
      accessorKey: 'gq',
      header: 'GQ',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.GoiQuota}</div>
      ),
    },
    {
      accessorKey: 'mq',
      header: 'MQ',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.MgtQuota}</div>
      ),
    },
    {
      accessorKey: 'aicteApproval',
      header: 'AICTE Approval',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.AICTE_Approval}</div>
      ),
    },
    {
      accessorKey: 'activeNo',
      header: 'Active No',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.AICTE_Approval_No}</div>
      ),
    },
    // S1-S8
    ...[...Array(8)].map((_, i) => ({ accessorKey: `S${i + 1}`, header: `S${i + 1}`, cell: ({ row }) => <div className="fw-medium">{row.original[`S${i + 1}`]}</div> })),
    // R1-R8
    ...[...Array(8)].map((_, i) => ({ accessorKey: `R${i + 1}`, header: `R${i + 1}`, cell: ({ row }) => <div className="fw-medium">{row.original[`R${i + 1}`]}</div> })),
    // Quota fields
    { accessorKey: 'oc', header: 'OC', cell: ({ row }) => <div className="fw-medium">{row.original.OC}</div> },
    { accessorKey: 'bc', header: 'BC', cell: ({ row }) => <div className="fw-medium">{row.original.BC}</div> },
    { accessorKey: 'bco', header: 'BCO', cell: ({ row }) => <div className="fw-medium">{row.original.BCO}</div> },
    { accessorKey: 'bcm', header: 'BCM', cell: ({ row }) => <div className="fw-medium">{row.original.BCM}</div> },
    { accessorKey: ',mbc_dnc', header: 'MBC_DNC', cell: ({ row }) => <div className="fw-medium">{row.original.MBC_DNC}</div> },
    { accessorKey: 'sc', header: 'SC', cell: ({ row }) => <div className="fw-medium">{row.original.SC}</div> },
    { accessorKey: 'sca', header: 'SCA', cell: ({ row }) => <div className="fw-medium">{row.original.SCA}</div> },
    { accessorKey: 'st', header: 'ST', cell: ({ row }) => <div className="fw-medium">{row.original.ST}</div> },
    { accessorKey: 'other', header: 'Other', cell: ({ row }) => <div className="fw-medium">{row.original.Other}</div> },
  ];

  // Simulate API call
  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/branch');
        if (!res.ok) throw new Error('Failed to fetch branches');
        const data = await res.json();
        setBranches(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch branches data');
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, [refreshTrigger]);

  const handleEdit = (branch) => {
    setBranchState({ ...branch });
    // Use branch.id if present, else branch.ID (adjust as per your backend)
    setEditId(branch.id ?? branch.ID);
    toast.info('Branch details loaded for editing', { autoClose: 2000 });
  };

  const handleDelete = async (branch) => {
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
                  const res = await fetch(`/api/branch/${branch.id ?? branch.ID}`, { method: 'DELETE' });
                  if (!res.ok) throw new Error('Delete failed');
                  setBranches(prev => prev.filter(b => (b.id ?? b.ID) !== (branch.id ?? branch.ID)));
                  toast.success('Branch deleted successfully');
                } catch (err) {
                  toast.error('Failed to delete branch');
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
        data={branches}
        columns={columns}
        loading={loading}
        error={error}
        title="Branch Management"
        onEdit={handleEdit}
        onDelete={handleDelete}
        enableExport={false}
        enableSelection={true}
        pageSize={10}
      />
      {/* <ToastContainer position="top-right" /> */}
    </div>
  );
}

export default BranchTable;
