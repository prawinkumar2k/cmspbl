import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DataTable, { StatusBadge } from '../../../../../components/DataTable/DataTable';

const StudentTable = ({ refreshTrigger, setEditStudent }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define table columns matching the image structure
  const columns = [
    // Only show columns present in student_master table
    {
      accessorKey: 'slNo',
      header: 'S.No',
      cell: ({ row }) => (
        <div className="fw-medium">{row.index + 1}</div>
      ),
    },
    { accessorKey: 'Std_UID', header: 'Student ID' },
    { accessorKey: 'Application_No', header: 'Application No' },
    {
      accessorKey: 'Photo_Path',
      header: 'Photo',
      cell: ({ row }) => (
        <img
          src={`/api/studentMaster/student/student-image/${row.original.Photo_Path}`}
          alt="Student"
          style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '50%' }}
          onError={(e) => { e.target.src = '/api/studentMaster/student/student-image/student.png'; }}
        />
      ),
    },
    { accessorKey: 'Register_Number', header: 'Register Number' },
    { accessorKey: 'Student_Name', header: 'Student Name' },
    { accessorKey: 'Mode_Of_Joinig', header: 'Mode Of Joining' },
    { accessorKey: 'Reference', header: 'Reference' },
    { accessorKey: 'Present', header: 'Present' },
    { accessorKey: 'Course_Name', header: 'Course Name' },
    { accessorKey: 'Dept_Name', header: 'Department Name' },
    { accessorKey: 'Dept_Code', header: 'Department Code' },
    { accessorKey: 'Semester', header: 'Semester' },
    { accessorKey: 'Year', header: 'Year' },
    {
      accessorKey: 'Admission_Date',
      header: 'Admission Date',
      cell: ({ row }) => {
        const val = row.original.Admission_Date;
        if (!val) return '';
        const date = new Date(val);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      }
    },
    { accessorKey: 'Gender', header: 'Gender' },
    { accessorKey: 'Student_Mobile', header: 'Mobile' },
    {
      accessorKey: 'Dob',
      header: 'DOB',
      cell: ({ row }) => {
        const val = row.original.Dob;
        if (!val) return '';
        const date = new Date(val);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      }
    },
    { accessorKey: 'Age', header: 'Age' },
    { accessorKey: 'Umis_No', header: 'UMIS No' },
    { accessorKey: 'Std_Email', header: 'Email' },
    { accessorKey: 'Father_Name', header: 'Father Name' },
    { accessorKey: 'Father_Mobile', header: 'Father Mobile' },
    { accessorKey: 'Father_Occupation', header: 'Father Occupation' },
    { accessorKey: 'Mother_Name', header: 'Mother Name' },
    { accessorKey: 'Mother_Mobile', header: 'Mother Mobile' },
    { accessorKey: 'Mother_Occupation', header: 'Mother Occupation' },
    { accessorKey: 'Guardian_Name', header: 'Guardian Name' },
    { accessorKey: 'Guardian_Mobile', header: 'Guardian Mobile' },
    { accessorKey: 'Guardian_Occupation', header: 'Guardian Occupation' },
    { accessorKey: 'Guardian_Relation', header: 'Guardian Relation' },
    { accessorKey: 'Blood_Group', header: 'Blood Group' },
    { accessorKey: 'Nationality', header: 'Nationality' },
    { accessorKey: 'Religion', header: 'Religion' },
    { accessorKey: 'Community', header: 'Community' },
    { accessorKey: 'Caste', header: 'Caste' },
    { accessorKey: 'Physically_Challenged', header: 'Physically Challenged' },
    { accessorKey: 'Marital_Status', header: 'Marital Status' },
    { accessorKey: 'Aadhaar_No', header: 'Aadhaar No' },
    { accessorKey: 'Pan_No', header: 'PAN No' },
    { accessorKey: 'Mother_Tongue', header: 'Mother Tongue' },
    { accessorKey: 'Family_Income', header: 'Family Income' },
    { accessorKey: 'Permanent_District', header: 'Permanent District' },
    { accessorKey: 'Permanent_State', header: 'Permanent State' },
    { accessorKey: 'Permanent_Pincode', header: 'Permanent Pincode' },
    { accessorKey: 'Permanent_Address', header: 'Permanent Address' },
    { accessorKey: 'Current_District', header: 'Current District' },
    { accessorKey: 'Current_State', header: 'Current State' },
    { accessorKey: 'Current_Pincode', header: 'Current Pincode' },
    { accessorKey: 'Current_Address', header: 'Current Address' },
    { accessorKey: 'Scholarship', header: 'Scholarship' },
    { accessorKey: 'First_Graduate', header: 'First Graduate' },
    { accessorKey: 'Bank_Loan', header: 'Bank Loan' },
    { accessorKey: 'Hostel_Required', header: 'Hostel Required' },
    { accessorKey: 'Transport_Required', header: 'Transport Required' },
    { accessorKey: 'Admission_Status', header: 'Admission Status' },
  ];

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/studentMaster/all');
        if (!response.ok) throw new Error('Failed to fetch student data');
        const data = await response.json();
        setStudents(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch student data');
        toast.error('Failed to load student data');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [refreshTrigger]);



  const handleDelete = (student) => {
    toast((t) => (
      <div>
        <p className="mb-2">Delete student: <strong>{student.Student_Name}</strong>?</p>
        <p className="text-danger mb-2" style={{ fontSize: '0.85rem' }}>This will delete all associated records including education details.</p>
        <div className="d-flex gap-2">
          <button
            className="btn btn-danger btn-sm"
            onClick={async () => {
              try {
                // Call backend API to delete student from both tables
                const res = await fetch(`/api/studentMaster/delete/${student.Id}`, {
                  method: 'DELETE',
                });
                if (!res.ok) {
                  const errorData = await res.json();
                  throw new Error(errorData.error || 'Delete failed');
                }
                setStudents(prev => prev.filter(s => s.Id !== student.Id));
                toast.success(`Student "${student.Student_Name}" deleted successfully!`);
              } catch (err) {
                toast.error(`Failed to delete student: ${err.message}`);
              }
              toast.dismiss(t.id);
            }}
          >
            Confirm Delete
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
    });
  };

  return (
    <div className="mt-4">
      <DataTable
        data={students}
        columns={columns}
        loading={loading}
        error={error}
        title="Student Management"
        enableActions={true}
        onEdit={(row) => setEditStudent(row)}
        onDelete={handleDelete}
        enableExport={false}
        enableSelection={true}
        pageSize={10}
      />
    </div>
  );
};

export default StudentTable;
