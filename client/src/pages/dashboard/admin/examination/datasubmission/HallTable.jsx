import React, { useState, useEffect, useRef } from "react";
import DataTable from "../../../../../components/DataTable/DataTable";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Helpers (copied/adapted from StockTable) to normalize backend responses and map DB rows to UI
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

const mapDbRowToUi = (r = {}) => {
  const rows = r.rows ?? r.Total_Rows ?? r.TotalRows ?? r.total_rows ?? r.totalRows ?? r.hrow ?? r.hRow ?? r.h_row ?? r.row ?? null;
  const columns = r.columns ?? r.Total_Columns ?? r.TotalColumns ?? r.total_columns ?? r.totalColumns ?? r.hcolumn ?? r.hColumn ?? r.h_column ?? r.column ?? null;
  const capacity = r.capacity ?? r.Seating_Capacity ?? r.SeatingCapacity ?? r.seating_capacity ?? r.seatingCapacity ?? r.cap ?? (rows && columns ? Number(rows) * Number(columns) : null);
  const hallName = r.hall_name ?? r.Hall_Name ?? r.hallName ?? r.hall_no ?? r.name ?? '';
  const preference = r.preference ?? r.Preference_Order ?? r.PreferenceOrder ?? r.preference_order ?? r.preferenceOrder ?? r.hallPrefer ?? r.hall_prefer ?? '';
  return {
    ...r,
    id: r.id ?? r._id ?? r.hallno ?? null,
    hall_name: hallName,
    rows: rows ?? '',
    columns: columns ?? '',
    capacity: capacity ?? '',
    preference: preference
  };
};

const HallTable = ({ setForm, setEditMode, setEditId, setInitialForm, refreshTable, onEdit, editingRowId, editedData, setEditedData }) => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchHalls = async () => {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/hall', { signal });
        if (!res.ok) {
          let errText = `Server returned ${res.status}`;
          try {
            const body = await res.json();
            if (body && body.error) errText = `${errText}: ${body.error}`;
          } catch {}
          throw new Error(errText);
        }
        const raw = await res.json().catch(() => null);
        const arr = normalizeResponseToArray(raw);
        const mapped = arr.map(mapDbRowToUi);
        const sorted = mapped.sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));
        if (signal.aborted) return;
        setHalls(sorted);
        setError(null);
      } catch (err) {
        if (!signal.aborted) {
          console.error('Error fetching halls:', err);
          setError('Failed to fetch halls');
          setHalls([]);
        }
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
      }
    };
    fetchHalls();
    return () => controller.abort();
  }, [refreshTable]);

  const columns = [
    { header: "SNo", accessorKey: "sno", cell: ({ row }) => row.index + 1 },
    { accessorKey: "hall_name", header: "Hall Name", cell: ({ row }) => <div className="fw-medium">{row.original.hall_name}</div> },
    { accessorKey: "rows", header: "Row", cell: ({ row }) => <div className="fw-medium">{row.original.rows}</div> },
    { accessorKey: "columns", header: "Column", cell: ({ row }) => <div className="fw-medium">{row.original.columns}</div> },
    { accessorKey: "capacity", header: "Capacity", cell: ({ row }) => <div className="fw-medium">{row.original.capacity}</div> },
    { accessorKey: "hall_code", header: "Hall Code", cell: ({ row }) => <div className="fw-medium">{row.original.Hall_Code || row.original.hall_code || ''}</div> },
    { accessorKey: "type", header: "Type", cell: ({ row }) => <div className="fw-medium">{row.original.Hall_Type || row.original.hall_type || ''}</div> },
    { accessorKey: "building", header: "Building", cell: ({ row }) => <div className="fw-medium">{row.original.Block_Name || row.original.block_name || ''}</div> },
    { accessorKey: "floor", header: "Floor", cell: ({ row }) => <div className="fw-medium">{row.original.Floor_Number || row.original.floor_number || ''}</div> },
    { accessorKey: "location_note", header: "Location Note", cell: ({ row }) => <div className="fw-medium">{row.original.Location_Note || row.original.location_note || ''}</div> },
    { accessorKey: "facilities", header: "Facilities", cell: ({ row }) => <div className="fw-medium">{row.original.Facilities || row.original.facilities || ''}</div> },
    { accessorKey: "preference", header: "Preference", cell: ({ row }) => <div className="fw-medium">{row.original.Preference || row.original.preference || ''}</div> },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <div className="fw-medium">{row.original.Status || row.original.status || ''}</div> },
  ];

  // Handler for edit action from DataTable
  const handleEdit = (row) => {
  // row may be a data object or a row object with .original
  const data = row?.original || row;
  if (onEdit && data) {
    onEdit(data);
  }
};

  // Handler for delete action from DataTable
  const handleDelete = (row) => {
    toast.dismiss();
    const toastId = toast(
      ({ closeToast }) => (
        <div>
          <div>Are you sure you want to delete?</div>
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <button
              style={{ background: '#d32f2f', color: 'white', border: 'none', padding: '4px 12px', borderRadius: 4 }}
              onClick={async () => {
                setDeleting(true);
                try {
                  const res = await fetch(`/api/hall/${row.id}`, { method: 'DELETE' });
                  if (!res.ok) {
                    const text = await res.text().catch(() => null);
                    throw new Error(text || `Delete failed ${res.status}`);
                  }
                  // remove locally
                  setHalls(prev => prev.filter(h => h.id !== row.id));
                  toast.success('Hall deleted successfully');
                  if (typeof refreshTable === 'function') refreshTable(prev => !prev);
                } catch (e) {
                  console.error('Error deleting hall', e);
                  toast.error('Failed to delete hall');
                }
                setDeleting(false);
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
        data={halls}
        columns={columns}
        loading={loading || deleting}
        error={error}
        title="Hall Records"
        enableExport={false}
        enableSelection={false}
        pageSize={10}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default HallTable;
