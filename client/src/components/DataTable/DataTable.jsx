import React, { useState, useMemo, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  ChevronUp,
  ChevronDown,
  Edit,
  Trash2,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './DataTable.css';

const StatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'active':
      case 'approved':
        return 'badge-success';
      case 'pending':
      case 'processing':
        return 'badge-warning';
      case 'cancelled':
      case 'inactive':
      case 'rejected':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  return (
    <span className={`badge ${getStatusClass(status)}`}>
      {status}
    </span>
  );
};

const Avatar = ({ src, name, size = 40 }) => {
  const [imgError, setImgError] = useState(false);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!src || imgError) {
    return (
      <div
        className="avatar-placeholder"
        style={{ width: size, height: size }}
      >
        {getInitials(name || 'NA')}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className="avatar-img"
      style={{ width: size, height: size }}
      onError={() => setImgError(true)}
    />
  );
};

const LoadingSkeleton = ({ rows = 5, columns = 6 }) => (
  <div className="table-skeleton">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="skeleton-row">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div key={colIndex} className="skeleton-cell">
            <div className="skeleton-content"></div>
          </div>
        ))}
      </div>
    ))}
  </div>
);


const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  error = null,
  title = "Data Table",
  onEdit = () => { },
  onDelete = () => { },
  enableExport = true,
  enableSelection = true,
  enableActions = true,
  pageSize: initialPageSize = 10,
  onRowSelectionChange = null,
  rowSelection: propRowSelection = null,
  externalRowSelection = null,
  enableRowSelection = null,
  preservePaginationOnUpdate = true
}) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [internalRowSelection, setInternalRowSelection] = useState({});
  const [currentView, setCurrentView] = useState('table');

  // Consolidate selection enablement
  // enableSelection defaults to true in props destructuring (line 112)
  const isSelectionEnabled = enableSelection !== true ? enableSelection : (enableRowSelection ?? enableSelection);

  // ✅ STEP 1: Add controlled pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const prevDataLengthRef = useRef(data.length);

  // Determine effective row selection state and setter
  const effectiveExternalRowSelection = propRowSelection !== null ? propRowSelection : externalRowSelection;
  const rowSelection = effectiveExternalRowSelection !== null ? effectiveExternalRowSelection : internalRowSelection;
  const setRowSelection = onRowSelectionChange !== null ? onRowSelectionChange : setInternalRowSelection;

  // Detect if data was updated but NOT completely replaced
  useEffect(() => {
    if (preservePaginationOnUpdate && data.length > 0 && prevDataLengthRef.current === data.length) {
      prevDataLengthRef.current = data.length;
    } else if (data.length === 0) {
      prevDataLengthRef.current = 0;
    } else {
      prevDataLengthRef.current = data.length;
    }
  }, [data, preservePaginationOnUpdate]);

  // Enhanced columns with selection and actions
  const enhancedColumns = useMemo(() => {
    const cols = [];

    // Selection column
    if (isSelectionEnabled) {
      cols.push({
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            className="form-check-input"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="form-check-input"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        size: 50,
        enableSorting: false,
      });
    }

    // Serial number column
    // cols.push({
    //   id: 'serial',
    //   header: 'S.No',
    //   cell: ({ row }) => row.original.serialNo || row.original.serial_no || '',
    //   size: 60,
    //   enableSorting: false,
    // });

    // Add user columns
    cols.push(...columns);

    // Actions column (only if enabled)
    if (enableActions) {
      cols.push({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="action-buttons">
            <button
              className="btn btn-sm btn-outline-warning me-1"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onEdit(row.original);
              }}
              title="Edit"
            >
              <Edit size={16} />
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => onDelete(row.original)}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
        size: 120,
        enableSorting: false,
      });
    }

    return cols;
  }, [columns, isSelectionEnabled, enableActions, onEdit]);

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination, // ✅ STEP 2: Handle pagination changes
    globalFilterFn: 'includesString',
    state: {
      sorting,
      globalFilter,
      rowSelection,
      pagination, // ✅ STEP 2: Controlled pagination state
    },
    autoResetPageIndex: false, // ⭐ KEY LINE: Prevent reset on data change
  });

  // Remove handleDelete, handled by parent

  // const exportToPDF = () => {
  //   const doc = new jsPDF();
  //   const tableData = data.map(item => Object.values(item));
  //   const tableHeaders = columns.map(col => col.header);

  //   doc.autoTable({
  //     head: [tableHeaders],
  //     body: tableData,
  //     startY: 20,
  //   });

  //   doc.text(title, 14, 15);
  //   doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
  // };

  const csvData = useMemo(() => {
    return data.map(item => {
      const csvItem = {};
      columns.forEach(col => {
        csvItem[col.header] = item[col.accessorKey] || '';
      });
      return csvItem;
    });
  }, [data, columns]);

  if (error) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="alert alert-danger">
            <h5>Error Loading Data</h5>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="data-table-container">
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h5 className="card-title mb-0">{title}</h5>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-end gap-2">
                {enableExport && (
                  <>
                    <CSVLink
                      data={csvData}
                      filename={`${title.toLowerCase().replace(/\s+/g, '_')}.csv`}
                      className="btn btn-sm btn-outline-success"
                    >
                      <Download size={16} className="me-1" />
                      CSV
                    </CSVLink>
                    {/* <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={exportToPDF}
                    >
                      <Download size={16} className="me-1" />
                      PDF
                    </button> */}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          {/* Controls */}
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <label className="me-2">Show:</label>
                <select
                  className="form-select form-select-sm"
                  style={{ width: 'auto' }}
                  value={table.getState().pagination.pageSize}
                  onChange={e => table.setPageSize(Number(e.target.value))}
                >
                  {[5, 10, 20, 30, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
                <span className="ms-2">Entries Per Page</span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="position-relative">
                <Search className="position-absolute top-50 translate-middle-y ms-2" size={16} />
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Search..."
                  value={globalFilter}
                  onChange={e => setGlobalFilter(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header, colIdx) => (
                        <th
                          key={headerGroup.id + '-' + header.id + '-' + colIdx}
                          style={{ width: header.getSize() }}
                          className={
                            [
                              header.column.getCanSort() ? 'sortable' : '',
                              // Sticky classes for first three columns
                              colIdx === (isSelectionEnabled ? 1 : 0) ? 'sticky-sl' : '',
                              colIdx === (isSelectionEnabled ? 2 : 1) ? 'sticky-deptcode' : '',
                              colIdx === (isSelectionEnabled ? 3 : 2) ? 'sticky-deptname' : '',
                            ].filter(Boolean).join(' ')
                          }
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              className={`d-flex align-items-center ${header.column.getCanSort() ? 'cursor-pointer' : ''
                                }`}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {header.column.getCanSort() && (
                                <span className="ms-1">
                                  {header.column.getIsSorted() === 'asc' ? (
                                    <ChevronUp size={14} />
                                  ) : header.column.getIsSorted() === 'desc' ? (
                                    <ChevronDown size={14} />
                                  ) : (
                                    <span style={{ opacity: 0.3 }}>
                                      <ChevronUp size={14} />
                                    </span>
                                  )}
                                </span>
                              )}
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row, rowIdx) => (
                    <tr key={row.id || row.original?.id || row.original?.roll_no || rowIdx}>
                      {row.getVisibleCells().map((cell, colIdx) => (
                        <td
                          key={`${row.id || row.original?.id || row.original?.roll_no || rowIdx}_${cell.column.id}_${colIdx}`}
                          className={
                            [
                              colIdx === (isSelectionEnabled ? 1 : 0) ? 'sticky-sl' : '',
                              colIdx === (isSelectionEnabled ? 2 : 1) ? 'sticky-deptcode' : '',
                              colIdx === (isSelectionEnabled ? 3 : 2) ? 'sticky-deptname' : '',
                            ].filter(Boolean).join(' ')
                          }
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="row align-items-center mt-3">
            <div className="col-md-6">
              <p className="mb-0 text-muted">
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getPrePaginationRowModel().rows.length
                )}{' '}
                of {table.getPrePaginationRowModel().rows.length} entries
              </p>
            </div>
            <div className="col-md-6">
              <nav>
                <ul className="pagination pagination-sm justify-content-end mb-0">
                  <li className={`page-item ${!table.getCanPreviousPage() ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => table.setPageIndex(0)}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <ChevronsLeft size={16} />
                    </button>
                  </li>
                  <li className={`page-item ${!table.getCanPreviousPage() ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <ChevronLeft size={16} />
                    </button>
                  </li>

                  {/* Page numbers */}
                  {Array.from({ length: table.getPageCount() }, (_, i) => i)
                    .filter(pageIndex => {
                      const currentPage = table.getState().pagination.pageIndex;
                      return pageIndex >= currentPage - 2 && pageIndex <= currentPage + 2;
                    })
                    .map(pageIndex => (
                      <li
                        key={pageIndex}
                        className={`page-item ${pageIndex === table.getState().pagination.pageIndex ? 'active' : ''
                          }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => table.setPageIndex(pageIndex)}
                        >
                          {pageIndex + 1}
                        </button>
                      </li>
                    ))}

                  <li className={`page-item ${!table.getCanNextPage() ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </li>
                  <li className={`page-item ${!table.getCanNextPage() ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                      disabled={!table.getCanNextPage()}
                    >
                      <ChevronsRight size={16} />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Dialog removed, handled by parent with toast */}
    </div>
  );
};

export { DataTable, StatusBadge, Avatar };
export default DataTable;
