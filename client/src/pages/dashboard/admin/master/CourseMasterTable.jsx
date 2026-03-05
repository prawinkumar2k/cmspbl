import React, { useEffect, useState } from 'react';
import DataTable from '../../../../components/DataTable/DataTable';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CourseMasterTable = ({ refresh, setEditId, setFormState }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    {
      accessorKey: 'sno',
      header: 'S.No',
      cell: ({ row }) => <div className="fw-medium">{row.index + 1}</div>
    },
    {
      accessorKey: 'Course_Name',
      header: 'Course Name',
      cell: ({ row }) => <div className="fw-medium">{row.original.Course_Name}</div>
    }
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/courseMaster');
        if (!res.ok) throw new Error('Failed to fetch courses');
        const data = await res.json();
        setCourses(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [refresh]);

  const handleEdit = (course) => {
    setEditId(course.id);
    setFormState({ Course_Name: course.Course_Name });
    toast.info('Course loaded for editing', { autoClose: 2000 });
  };

  const handleDelete = async (course) => {
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
                  const res = await fetch(`/api/courseMaster/${course.id}`, { method: 'DELETE' });
                  if (!res.ok) throw new Error('Delete failed');
                  setCourses(prev => prev.filter(c => c.id !== course.id));
                  toast.success('Course deleted successfully');
                } catch (err) {
                  toast.error('Failed to delete course');
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
        data={courses}
        columns={columns}
        loading={loading}
        error={error}
        title="Course Master Management"
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

export default CourseMasterTable;
