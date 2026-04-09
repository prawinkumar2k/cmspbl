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
        <div className="fw-medium">{row.original.deptCode || row.original.Dept_Code}</div>
      ),
    },
    {
      accessorKey: 'deptName',
      header: 'Department Name',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.deptName || row.original.Dept_Name}</div>
      ),
    },
    {
      accessorKey: 'yearOfCourse',
      header: 'Year of Department',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.yearOfCourse || row.original.Year_Of_Course}</div>
      ),
    },
    {
      accessorKey: 'deptOrder',
      header: 'Department Order',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.deptOrder || row.original.Dept_Order}</div>
      ),
    },
    {
      accessorKey: 'insType',
      header: 'Institution Type',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.insType || row.original.Ins_Type}</div>
      ),
    },
    {
      accessorKey: 'courseMode',
      header: 'Course Mode',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.courseMode || row.original.Course_Mode}</div>
      ),
    },
    {
      accessorKey: 'courseName',
      header: 'Course Name',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.courseName || row.original.Course_Name}</div>
      ),
    },
    {
      accessorKey: 'intake',
      header: 'Intake',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.intake || row.original.Intake}</div>
      ),
    },
    {
      accessorKey: 'addlSeats',
      header: 'Addl Seats',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.addlSeats || row.original.AddlSeats}</div>
      ),
    },
    {
      accessorKey: 'goiQuota',
      header: 'GQ',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.goiQuota || row.original.GoiQuota}</div>
      ),
    },
    {
      accessorKey: 'mgtQuota',
      header: 'MQ',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.mgtQuota || row.original.MgtQuota}</div>
      ),
    },
    {
      accessorKey: 'aicteApproval',
      header: 'AICTE Approval',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.aicteApproval || row.original.AICTE_Approval}</div>
      ),
    },
    {
      accessorKey: 'aicteApprovalNo',
      header: 'Active No',
      cell: ({ row }) => (
        <div className="fw-medium">{row.original.aicteApprovalNo || row.original.AICTE_Approval_No}</div>
      ),
    },
    // S1-S8
    ...[...Array(8)].map((_, i) => ({
      accessorKey: `s${i + 1}`,
      header: `S${i + 1}`,
      cell: ({ row }) => <div className="fw-medium">{row.original[`s${i + 1}`] || row.original[`S${i + 1}`]}</div>
    })),
    // R1-R8
    ...[...Array(8)].map((_, i) => ({
      accessorKey: `r${i + 1}`,
      header: `R${i + 1}`,
      cell: ({ row }) => <div className="fw-medium">{row.original[`r${i + 1}`] || row.original[`R${i + 1}`]}</div>
    })),
    // Quota fields
    { accessorKey: 'oc', header: 'OC', cell: ({ row }) => <div className="fw-medium">{row.original.oc || row.original.OC}</div> },
    { accessorKey: 'bc', header: 'BC', cell: ({ row }) => <div className="fw-medium">{row.original.bc || row.original.BC}</div> },
    { accessorKey: 'bco', header: 'BCO', cell: ({ row }) => <div className="fw-medium">{row.original.bco || row.original.BCO}</div> },
    { accessorKey: 'bcm', header: 'BCM', cell: ({ row }) => <div className="fw-medium">{row.original.bcm || row.original.BCM}</div> },
    { accessorKey: 'mbcDnc', header: 'MBC_DNC', cell: ({ row }) => <div className="fw-medium">{row.original.mbcDnc || row.original.MBC_DNC}</div> },
    { accessorKey: 'sc', header: 'SC', cell: ({ row }) => <div className="fw-medium">{row.original.sc || row.original.SC}</div> },
    { accessorKey: 'sca', header: 'SCA', cell: ({ row }) => <div className="fw-medium">{row.original.sca || row.original.SCA}</div> },
    { accessorKey: 'st', header: 'ST', cell: ({ row }) => <div className="fw-medium">{row.original.st || row.original.ST}</div> },
    { accessorKey: 'other', header: 'Other', cell: ({ row }) => <div className="fw-medium">{row.original.other || row.original.Other}</div> },
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
    // Map camelCase fields from backend to PascalCase/Snake_Case expected by Branch.jsx form
    const mappedBranch = {
      Course_Mode: branch.courseMode || branch.Course_Mode || '',
      Course_Name: branch.courseName || branch.Course_Name || '',
      Dept_Code: branch.deptCode || branch.Dept_Code || '',
      Dept_Name: branch.deptName || branch.Dept_Name || '',
      Year_Of_Course: branch.yearOfCourse || branch.Year_Of_Course || '',
      Dept_Order: branch.deptOrder || branch.Dept_Order || '',
      AICTE_Approval: branch.aicteApproval || branch.AICTE_Approval || '',
      AICTE_Approval_No: branch.aicteApprovalNo || branch.AICTE_Approval_No || '',
      Intake: branch.intake || branch.Intake || '',
      AddlSeats: branch.addlSeats || branch.AddlSeats || '',
      OC: branch.oc || branch.OC || '',
      BC: branch.bc || branch.BC || '',
      BCO: branch.bco || branch.BCO || '',
      BCM: branch.bcm || branch.BCM || '',
      MBC_DNC: branch.mbcDnc || branch.MBC_DNC || '',
      SC: branch.sc || branch.SC || '',
      SCA: branch.sca || branch.SCA || '',
      ST: branch.st || branch.ST || '',
      Other: branch.other || branch.Other || '',
      GoiQuota: branch.goiQuota || branch.GoiQuota || '',
      MgtQuota: branch.mgtQuota || branch.MgtQuota || '',
      Ins_Type: branch.insType || branch.Ins_Type || '',
    };

    // Map S1-S8 and R1-R8
    for (let i = 1; i <= 8; i++) {
      mappedBranch[`S${i}`] = branch[`s${i}`] || branch[`S${i}`] || '';
      mappedBranch[`R${i}`] = branch[`r${i}`] || branch[`R${i}`] || '';
    }

    setBranchState(mappedBranch);
    setEditId(branch._id || branch.id || branch.ID);
    toast.info('Branch details loaded for editing', { autoClose: 2000 });
  };

  const handleDelete = async (branch) => {
    const id = branch._id || branch.id || branch.ID;
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
                  const res = await fetch(`/api/branch/${id}`, { method: 'DELETE' });
                  if (!res.ok) throw new Error('Delete failed');
                  setBranches(prev => prev.filter(b => (b._id || b.id || b.ID) !== id));
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
