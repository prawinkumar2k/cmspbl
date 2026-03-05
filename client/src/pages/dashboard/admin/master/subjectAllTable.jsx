import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataTable from '../../../../components/DataTable/DataTable';

const SubjectAllTable = ({ refreshTrigger, onEditRecord }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    { accessorKey: 'Staff_ID', header: 'Staff ID', cell: ({ row }) => <div className="fw-medium">{row.original.Staff_Id}</div> },
    { accessorKey: 'Staff_Name', header: 'Staff Name', cell: ({ row }) => <div className="fw-medium">{row.original.Staff_Name}</div> },
    { accessorKey: 'Academic_Year', header: 'Academic Year', cell: ({ row }) => <div className="fw-medium">{row.original.Academic_Year}</div> },
    { accessorKey: 'Sem_Type', header: 'Sem Type', cell: ({ row }) => <div className="fw-medium">{row.original.Sem_Type}</div> },
    { accessorKey: 'Course_Name', header: 'Course', cell: ({ row }) => <div className="fw-medium">{row.original.Course_Name}</div> },
    { accessorKey: 'Dept_Name', header: 'Department', cell: ({ row }) => <div className="fw-medium">{row.original.Dept_Name}</div> },
    { accessorKey: 'Dept_Code', header: 'Dept Code', cell: ({ row }) => <div className="fw-medium">{row.original.Dept_Code}</div> },
    { accessorKey: 'Semester', header: 'Semester', cell: ({ row }) => <div className="fw-medium">{row.original.Semester}</div> },
    { accessorKey: 'Regulation', header: 'Regulation', cell: ({ row }) => <div className="fw-medium">{row.original.Regulation}</div> },
    { accessorKey: 'Sub1_Name', header: 'Sub1 Name', cell: ({ row }) => <div className="fw-medium">{row.original.Sub1_Name}</div> },
    { accessorKey: 'Sub1_Code', header: 'Sub1 Code', cell: ({ row }) => <div className="fw-medium">{row.original.Sub1_Code}</div> },
    { accessorKey: 'Sub1_Dept_Name', header: 'Sub1 Dept Name', cell: ({ row }) => <div className="fw-medium">{row.original.Sub1_Dept_Name}</div> },
    { accessorKey: 'Sub1_Dept_Code', header: 'Sub1 Dept Code', cell: ({ row }) => <div className="fw-medium">{row.original.Sub1_Dept_Code}</div> },
    { accessorKey: 'Sub1_Semester', header: 'Sub1 Semester', cell: ({ row }) => <div className="fw-medium">{row.original.Sub1_Semester}</div> },
    { accessorKey: 'Sub1_Regulation', header: 'Sub1 Regulation', cell: ({ row }) => <div className="fw-medium">{row.original.Sub1_Regulation}</div> },
    { accessorKey: 'Sub2_Name', header: 'Sub2 Name', cell: ({ row }) => <div className="fw-medium">{row.original.Sub2_Name}</div> },
    { accessorKey: 'Sub2_Code', header: 'Sub2 Code', cell: ({ row }) => <div className="fw-medium">{row.original.Sub2_Code}</div> },
    { accessorKey: 'Sub2_Dept_Name', header: 'Sub2 Dept Name', cell: ({ row }) => <div className="fw-medium">{row.original.Sub2_Dept_Name}</div> },
    { accessorKey: 'Sub2_Dept_Code', header: 'Sub2 Dept Code', cell: ({ row }) => <div className="fw-medium">{row.original.Sub2_Dept_Code}</div> },
    { accessorKey: 'Sub2_Semester', header: 'Sub2 Semester', cell: ({ row }) => <div className="fw-medium">{row.original.Sub2_Semester}</div> },
    { accessorKey: 'Sub2_Regulation', header: 'Sub2 Regulation', cell: ({ row }) => <div className="fw-medium">{row.original.Sub2_Regulation}</div> },
    { accessorKey: 'Sub3_Name', header: 'Sub3 Name', cell: ({ row }) => <div className="fw-medium">{row.original.Sub3_Name}</div> },
    { accessorKey: 'Sub3_Code', header: 'Sub3 Code', cell: ({ row }) => <div className="fw-medium">{row.original.Sub3_Code}</div> },
    { accessorKey: 'Sub3_Dept_Name', header: 'Sub3 Dept Name', cell: ({ row }) => <div className="fw-medium">{row.original.Sub3_Dept_Name}</div> },
    { accessorKey: 'Sub3_Dept_Code', header: 'Sub3 Dept Code', cell: ({ row }) => <div className="fw-medium">{row.original.Sub3_Dept_Code}</div> },
    { accessorKey: 'Sub3_Semester', header: 'Sub3 Semester', cell: ({ row }) => <div className="fw-medium">{row.original.Sub3_Semester}</div> },
    { accessorKey: 'Sub3_Regulation', header: 'Sub3 Regulation', cell: ({ row }) => <div className="fw-medium">{row.original.Sub3_Regulation}</div> },
    { accessorKey: 'Sub4_Name', header: 'Sub4 Name', cell: ({ row }) => <div className="fw-medium">{row.original.Sub4_Name}</div> },
    { accessorKey: 'Sub4_Code', header: 'Sub4 Code', cell: ({ row }) => <div className="fw-medium">{row.original.Sub4_Code}</div> },
    { accessorKey: 'Sub4_Dept_Name', header: 'Sub4 Dept Name', cell: ({ row }) => <div className="fw-medium">{row.original.Sub4_Dept_Name}</div> },
    { accessorKey: 'Sub4_Dept_Code', header: 'Sub4 Dept Code', cell: ({ row }) => <div className="fw-medium">{row.original.Sub4_Dept_Code}</div> },
    { accessorKey: 'Sub4_Semester', header: 'Sub4 Semester', cell: ({ row }) => <div className="fw-medium">{row.original.Sub4_Semester}</div> },
    { accessorKey: 'Sub4_Regulation', header: 'Sub4 Regulation', cell: ({ row }) => <div className="fw-medium">{row.original.Sub4_Regulation}</div> },
    { accessorKey: 'Sub5_Name', header: 'Sub5 Name', cell: ({ row }) => <div className="fw-medium">{row.original.Sub5_Name}</div> },
    { accessorKey: 'Sub5_Code', header: 'Sub5 Code', cell: ({ row }) => <div className="fw-medium">{row.original.Sub5_Code}</div> },
    { accessorKey: 'Sub5_Dept_Name', header: 'Sub5 Dept Name', cell: ({ row }) => <div className="fw-medium">{row.original.Sub5_Dept_Name}</div> },
    { accessorKey: 'Sub5_Dept_Code', header: 'Sub5 Dept Code', cell: ({ row }) => <div className="fw-medium">{row.original.Sub5_Dept_Code}</div> },
    { accessorKey: 'Sub5_Semester', header: 'Sub5 Semester', cell: ({ row }) => <div className="fw-medium">{row.original.Sub5_Semester}</div> },
    { accessorKey: 'Sub5_Regulation', header: 'Sub5 Regulation', cell: ({ row }) => <div className="fw-medium">{row.original.Sub5_Regulation}</div> },
    { accessorKey: 'Sub6_Name', header: 'Sub6 Name', cell: ({ row }) => <div className="fw-medium">{row.original.Sub6_Name}</div> },
    { accessorKey: 'Sub6_Code', header: 'Sub6 Code', cell: ({ row }) => <div className="fw-medium">{row.original.Sub6_Code}</div> },
    { accessorKey: 'Sub6_Dept_Name', header: 'Sub6 Dept Name', cell: ({ row }) => <div className="fw-medium">{row.original.Sub6_Dept_Name}</div> },
    { accessorKey: 'Sub6_Dept_Code', header: 'Sub6 Dept Code', cell: ({ row }) => <div className="fw-medium">{row.original.Sub6_Dept_Code}</div> },
    { accessorKey: 'Sub6_Semester', header: 'Sub6 Semester', cell: ({ row }) => <div className="fw-medium">{row.original.Sub6_Semester}</div> },
    { accessorKey: 'Sub6_Regulation', header: 'Sub6 Regulation', cell: ({ row }) => <div className="fw-medium">{row.original.Sub6_Regulation}</div> },
    { accessorKey: 'Sub7_Name', header: 'Sub7 Name', cell: ({ row }) => <div className="fw-medium">{row.original.Sub7_Name}</div> },
    { accessorKey: 'Sub7_Code', header: 'Sub7 Code', cell: ({ row }) => <div className="fw-medium">{row.original.Sub7_Code}</div> },
    { accessorKey: 'Sub7_Dept_Name', header: 'Sub7 Dept Name', cell: ({ row }) => <div className="fw-medium">{row.original.Sub7_Dept_Name}</div> },
    { accessorKey: 'Sub7_Dept_Code', header: 'Sub7 Dept Code', cell: ({ row }) => <div className="fw-medium">{row.original.Sub7_Dept_Code}</div> },
    { accessorKey: 'Sub7_Semester', header: 'Sub7 Semester', cell: ({ row }) => <div className="fw-medium">{row.original.Sub7_Semester}</div> },
    { accessorKey: 'Sub7_Regulation', header: 'Sub7 Regulation', cell: ({ row }) => <div className="fw-medium">{row.original.Sub7_Regulation}</div> },
  ];

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/subject_allocation');
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
    // If parent provided an edit handler, invoke it so the record loads into the form
    if (typeof onEditRecord === 'function') {
      onEditRecord(subject);
      toast.info('Allocation loaded for editing', { autoClose: 2000 });
      return;
    }
    toast.info(`Loaded for edit: ${subject.Sub_Name}`, { autoClose: 2000 });
  };


  const handleDelete = async (subject) => {
    toast.dismiss();
    const recordId = subject.Id || subject.ID || subject.id;
    if (!recordId) {
      toast.error('Cannot delete: missing record ID');
      return;
    }
    const toastId = toast(
      ({ closeToast }) => (
        <div>
          <div>Are you sure you want to delete?</div>
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <button
              style={{ background: '#d32f2f', color: 'white', border: 'none', padding: '4px 12px', borderRadius: 4 }}
              onClick={async () => {
                try {
                  const res = await fetch(`/api/subject_allocation/${recordId}`, { method: 'DELETE' });
                  if (!res.ok) throw new Error('Delete failed');
                  setSubjects(prev => prev.filter(s => (s.Id || s.ID || s.id) !== recordId));
                  toast.success('Allocation deleted successfully');
                } catch (err) {
                  toast.error('Failed to delete allocation');
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
        title="Subject Allocation"
        onEdit={handleEdit}
        onDelete={handleDelete}
        enableExport={false}
        enableSElectivetion={true}
        pageSize={10}
      />
    </div>
  );
};

export default SubjectAllTable;
