import React, { useState, useEffect } from 'react';
import DataTable from '../../../../../../components/DataTable/DataTable';
import toast from 'react-hot-toast';

// Normalize DB row to UI shape
const mapDbRowToUi = (r = {}) => {
  if (!r) return null;
  return {
    id: r.id ?? null,
    date: r.date ?? '',
    rollNo: r.roll_no ?? '',
    applicationNo: r.application_no ?? '',
    studentName: r.student_name ?? '',
    department: r.department ?? '',
    sem: r.sem ?? '',
    feeType: r.fee_type ?? '',
    totalAmount: r.total_amount ?? 0,
    payNow: r.pay_now ?? 0,
    paidAmount: r.paid_amount ?? 0,
    pendingAmount: r.pending_amount ?? 0,
    status: r.status ?? '',
    academic: r.academic ?? '',
    securityCode: r.security_code ?? '',
    _raw: r,
  };
};

const normalizeResponseToArray = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (raw.data && Array.isArray(raw.data)) return raw.data;
  if (raw.rows && Array.isArray(raw.rows)) return raw.rows;
  if (raw.results && Array.isArray(raw.results)) return raw.results;
  if (raw.payload && Array.isArray(raw.payload)) return raw.payload;
  if (raw.success && raw.data && Array.isArray(raw.data)) return raw.data;
  if (typeof raw === 'object') return [raw];
  return [];
};

export default function FeeTable({ refreshTrigger, onViewReceipt, onEdit, onDelete, onShowReport }) {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/fee-receipt')
      .then(res => res.json())
      .then(json => {
        const arr = normalizeResponseToArray(json).map(mapDbRowToUi);
        setFees(arr);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch fee receipts');
        setLoading(false);
      });
  }, [refreshTrigger]);

  const columns = [
    { accessorKey: 'date', header: 'Date' },
    { accessorKey: 'rollNo', header: 'Roll/Reg No' },
    { accessorKey: 'studentName', header: 'Student Name' },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'sem', header: 'Semester' },
    { accessorKey: 'feeType', header: 'Fee Type' },
    { accessorKey: 'totalAmount', header: 'Total Amount' },
    { accessorKey: 'payNow', header: 'This Payment' },
    { accessorKey: 'paidAmount', header: 'Paid (Cumulative)' },
    { accessorKey: 'pendingAmount', header: 'Pending' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'academic', header: 'Academic Year' },
    { accessorKey: 'securityCode', header: 'Dept Code' },
    {
      accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-sm btn-outline-info" onClick={() => onViewReceipt(row.original)}>
              View
            </button>
            <button
              className="btn btn-sm btn-outline-warning"
              onClick={() => {
                if (typeof onEdit === 'function') onEdit(row.original);
              }}
            >
              Edit
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => {
                // confirmation toast
                toast((t) => (
                  <div>
                    <div>Are you sure you want to delete this receipt?</div>
                    <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                      <button
                        style={{ background: '#d32f2f', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4 }}
                        onClick={async () => {
                          try {
                            const res = await fetch(`/api/fee-receipt/${row.original.id}`, { method: 'DELETE' });
                            if (!res.ok) throw new Error('Delete failed');
                            setFees((prev) => prev.filter((f) => f.id !== row.original.id));
                            if (typeof onDelete === 'function') onDelete(row.original);
                            toast.dismiss(t.id);
                            toast.success('Deleted');
                          } catch (err) {
                            toast.dismiss(t.id);
                            toast.error('Failed to delete');
                          }
                        }}
                      >
                        Delete
                      </button>
                      <button
                        style={{ background: '#757575', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4 }}
                        onClick={() => toast.dismiss(t.id)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ), { duration: Infinity });
              }}
            >
              Delete
            </button>
          </div>
        ),
      },
  ];

  return (
    <div className="mt-4">
      <h6 className="fw-semibold mb-2">Fee Receipts Table</h6>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={() => {
            if (typeof onShowReport === 'function') onShowReport();
          }}
          title="Download Fee Receipts Report"
        >
          <i className="fas fa-file-download me-1" /> Download Report
        </button>
      </div>
      <DataTable
        columns={columns}
        data={fees}
        loading={loading}
        error={error}
        pageSize={10}
        enableActions={false}
        enableExport={false}
        rowKey="id"
      />
    </div>
  );
}
