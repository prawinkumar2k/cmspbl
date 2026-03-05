import React, { useState, useEffect, useRef } from 'react';
import DataTable from '../../../../../../components/DataTable/DataTable';
// import api from '../../../../../../utils/api';
import Sidebar from '../../../../../../components/Sidebar';
import Navbar from '../../../../../../components/Navbar';
import Footer from '../../../../../../components/footer';
import toast, { Toaster } from 'react-hot-toast';

const courses = ['DPHARM', 'BPHARM', 'MLT', 'BSC', 'MSC'];
const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

const ChallanEntry = () => {
	// Modal/report state
	const [showReportModal, setShowReportModal] = useState(false);
	const [reportDownloadType, setReportDownloadType] = useState('pdf');
	const [reportForm, setReportForm] = useState({ fromDate: '', toDate: '', reportType: 'all' });
	const [showReceipt, setShowReceipt] = useState(false);
	const [receiptData, setReceiptData] = useState(null);
	const receiptRef = useRef(null);
		// Validation state
		const [errors, setErrors] = useState({});
		// Academic year and date range (mock for now)
		const [academicYear, setAcademicYear] = useState("");
		const [dateFrom, setDateFrom] = useState("");
		const [dateTo, setDateTo] = useState("");
		// Validation logic
		const validate = () => {
			const errs = {};
			if (!academicYear) errs.academicYear = "Academic Year is required.";
			if (!dateFrom) errs.dateFrom = "From date is required.";
			if (!dateTo) errs.dateTo = "To date is required.";
			if (dateFrom && dateTo && dateFrom > dateTo) errs.dateTo = "To date must be after From date.";
			return errs;
		};
	const [candidateType, setCandidateType] = useState('admitting');
	const [course, setCourse] = useState(courses[0]);
	const [sem, setSem] = useState(semesters[0]);
	const [regNo, setRegNo] = useState('');
	const [studentSuggestions, setStudentSuggestions] = useState([]);
	const [studentLoading, setStudentLoading] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState(null);
	const studentFetchTimeout = useRef();
	const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
	const [lastChallanNo, setLastChallanNo] = useState(5);
	const [challanNo, setChallanNo] = useState('');
	const nextChallanNo = lastChallanNo ? Number(lastChallanNo) + 1 : 1;
	const [isPaid, setIsPaid] = useState(false);
	const [challanEntries, setChallanEntries] = useState([]);
	const [loading, setLoading] = useState(false);

	// Fetch challan entries from backend
	const fetchChallanEntries = async () => {
		setLoading(true);
		try {
			const res = await fetch('/api/challan');
			let data = [];
			try {
				const json = await res.json();
				data = Array.isArray(json) ? json : (json.data && Array.isArray(json.data) ? json.data : []);
			} catch {
				data = [];
			}
			setChallanEntries(data);
			if (data.length > 0 && data[0].challanNo) setLastChallanNo(data[0].challanNo);
		} catch (err) {
			toast.error('Failed to fetch challan entries');
			setChallanEntries([]);
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchChallanEntries();
	}, []);

	const handleGenerate = async () => {
		const errs = validate();
		try {
			const finalChallanNo = challanNo || nextChallanNo;
			const payload = {
				candidateType,
				course,
				sem,
				regNo,
				date,
				challanNo: finalChallanNo,
				isPaid
			};
			const res = await fetch('/api/challan', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify(payload)
			});
			const text = await res.text();
			let json = null;
			try { json = text ? JSON.parse(text) : null; } catch { json = null; }
			if (!res.ok) {
				let serverMsg = `HTTP ${res.status}`;
				if (json) {
					if (json.errors && Array.isArray(json.errors)) {
						serverMsg = json.errors.map(e => e.msg || JSON.stringify(e)).join('; ');
					} else if (json.message) {
						serverMsg = json.message;
					} else {
						serverMsg = JSON.stringify(json);
					}
				} else if (text) {
					serverMsg = text;
				}
				throw new Error(serverMsg);
			}
			toast.success('Challan generated successfully!');
			setLastChallanNo(Number(finalChallanNo));
			setChallanNo(String(finalChallanNo)); // Auto-fill challanNo field
			fetchChallanEntries();
			// Show receipt preview
			setReceiptData({
				candidateType,
				course,
				sem,
				regNo,
				date,
				challanNo: finalChallanNo,
				isPaid
			});
			setShowReceipt(true);
		} catch (err) {
			console.error(err);
			toast.error('Failed to generate challan');
		}
	};

	const handlePaid = async () => {
		if (!challanNo) {
			toast.error('Enter Challan No to mark as paid');
			return;
		}
		// Check if challan exists in challanEntries
		const challanExists = challanEntries.some(entry => String(entry.challanNo) === String(challanNo));
		if (!challanExists) {
			toast.error('Challan not found. Please enter a valid challan number.');
			return;
		}
		try {
			const res = await fetch(`/api/challan/${challanNo}/paid`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			});
			const text = await res.text();
			let json = null;
			try { json = text ? JSON.parse(text) : null; } catch { json = null; }
			if (!res.ok) {
				let serverMsg = `HTTP ${res.status}`;
				if (json && json.message) serverMsg = json.message;
				else if (text) serverMsg = text;
				toast.error(serverMsg);
				return;
			}
			setIsPaid(true);
			toast.success('Challan marked as PAID');
			fetchChallanEntries();
		} catch (err) {
			console.error(err);
			toast.error('Failed to mark challan as paid');
		}
	};

	const handleClear = () => {
		setRegNo('');
		setChallanNo('');
		setIsPaid(false);
		setCourse(courses[0]);
		setSem(semesters[0]);
		setCandidateType('admitting');
		setDate(new Date().toISOString().slice(0, 10));
		toast.success('Form cleared');
	};

	// Autocomplete: fetch student suggestions
	const fetchStudentSuggestions = async (query) => {
		setStudentLoading(true);
		// Placeholder: simulate API call
		setTimeout(() => {
			// Dummy data
			const dummy = [
				{ regNo: "1001", name: "EDISON", rollNo: "A12", dept: "DPHARM", class: "DPHARM-1", mobile: "9876543210" },
				{ regNo: "1002", name: "Fayaz", rollNo: "B23", dept: "BPHARM", class: "BPHARM-2", mobile: "9876543211" },
				{ regNo: "1003", name: "Amelia", rollNo: "C34", dept: "MLT", class: "MLT-1", mobile: "9876543212" }
			];
			setStudentSuggestions(dummy.filter(s => s.regNo.includes(query) || s.name.toLowerCase().includes(query.toLowerCase())));
			setStudentLoading(false);
		}, 400);
	};

	// Debounced input handler
	const handleRegNoInput = (e) => {
		const value = e.target.value;
		setRegNo(value);
		setSelectedStudent(null);
		if (studentFetchTimeout.current) clearTimeout(studentFetchTimeout.current);
		if (value.length >= 2) {
			studentFetchTimeout.current = setTimeout(() => fetchStudentSuggestions(value), 300);
		} else {
			setStudentSuggestions([]);
		}
	};

	// Select student from suggestions
	const handleStudentSelect = (student) => {
		setRegNo(student.regNo);
		setSelectedStudent(student);
		setStudentSuggestions([]);
	};
	const columns = [
		{ accessorKey: 'candidateType', header: 'Candidate Type' },
		{ accessorKey: 'course', header: 'Course' },
		{ accessorKey: 'sem', header: 'Semester' },
		{ accessorKey: 'regNo', header: 'Reg No' },
		{ accessorKey: 'date', header: 'Date' },
		{ accessorKey: 'challanNo', header: 'Challan No' },
		{ accessorKey: 'isPaid', header: 'Paid', cell: ({ row }) => row.original.isPaid ? <span className="badge bg-success">Paid</span> : <span className="badge bg-danger">Unpaid</span> },
	];

	return (
		<>
			<Toaster position="top-right" />
			<section className="overlay">
				<Sidebar />
				<div className="dashboard-main">
					<Navbar />
					<div className="dashboard-main-body">
						<div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
							<h6 className="fw-semibold mb-0">Challan Entry</h6>
							<ul className="d-flex align-items-center gap-2 list-unstyled mb-0">
								<li className="fw-medium">
									<a href="/admin/adminDashboard" className="d-flex align-items-center gap-1 hover-text-primary">
										<iconify-icon icon="solar:home-smile-angle-outline" className="icon text-lg"></iconify-icon>
										Dashboard
									</a>
								</li>
								<li>-</li>
								<li className="fw-medium">Administration</li>
								<li>-</li>
								<li className="fw-medium">Office</li>
								<li>-</li>
								<li className="fw-medium">Challan Entry</li>
							</ul>
						</div>

						<div className="card h-100 p-0 radius-12">
							<div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
								<div>
									<h6 className="text-lg fw-semibold mb-2">Fee Challan Entry</h6>
									
								</div>
								<div>
									<button className="btn btn-outline-primary btn-sm" onClick={() => setShowReportModal(true)}>
										<i className="fas fa-file-alt me-1"></i> Download/Print Report
									</button>
								</div>
							</div>
							<div className="card-body p-24">

								<form className="row g-3 align-items-end mb-3">
									<div className="col-md-2">
										<label className="form-label fw-semibold">Academic Year</label>
										<select className="form-select" value={academicYear} onChange={e => setAcademicYear(e.target.value)}>
											<option value="">Select</option>
											<option value="2023-24">2023-24</option>
											<option value="2024-25">2024-25</option>
											<option value="2025-26">2025-26</option>
										</select>
										{errors.academicYear && <span className="text-danger" style={{ fontSize: '0.85em' }}>{errors.academicYear}</span>}
									</div>
									<div className="col-md-2">
										<label className="form-label fw-semibold">From Date</label>
										<input className="form-control" type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
										{errors.dateFrom && <span className="text-danger" style={{ fontSize: '0.85em' }}>{errors.dateFrom}</span>}
									</div>
									<div className="col-md-2">
										<label className="form-label fw-semibold">To Date</label>
										<input className="form-control" type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
										{errors.dateTo && <span className="text-danger" style={{ fontSize: '0.85em' }}>{errors.dateTo}</span>}
									</div>
									<div className="col-md-2">
										<label className="form-label fw-semibold">Candidate Type</label>
										<select className="form-select" value={candidateType} onChange={e => setCandidateType(e.target.value)}>
											<option value="admitting">Admitting Candidate</option>
											<option value="registered">Registered Student</option>
										</select>
									</div>
									<div className="col-md-2">
										<label className="form-label fw-semibold">Course</label>
										<select className="form-select" value={course} onChange={e => setCourse(e.target.value)}>
											{courses.map(c => <option key={c} value={c}>{c}</option>)}
										</select>
									</div>
									<div className="col-md-2">
										<label className="form-label fw-semibold">Semester</label>
										<select className="form-select" value={sem} onChange={e => setSem(e.target.value)}>
											{semesters.map(s => <option key={s} value={s}>{s}</option>)}
										</select>
									</div>
									<div className="col-md-3 position-relative">
										<label className="form-label fw-semibold">Reg No / Roll No</label>
										<input className="form-control" type="text" placeholder="Reg No / Roll No" value={regNo} onChange={handleRegNoInput} autoComplete="off" />
										{studentLoading && (
											<span className="spinner-border spinner-border-sm position-absolute" style={{ right: 8, top: 38 }}></span>
										)}
										{studentSuggestions.length > 0 && (
											<ul className="list-group position-absolute w-100" style={{ zIndex: 10, top: 60 }}>
												{studentSuggestions.map(s => (
													<li key={s.regNo} className="list-group-item list-group-item-action" style={{ cursor: "pointer" }} onClick={() => handleStudentSelect(s)}>
														{s.name} ({s.regNo}) - {s.dept}
													</li>
												))}
											</ul>
										)}
									</div>
									<div className="col-md-2">
										<label className="form-label fw-semibold">Date</label>
										<input className="form-control" type="date" value={date} onChange={e => setDate(e.target.value)} />
									</div>
									<div className="col-md-2">
										<label className="form-label fw-semibold">Last Challan No</label>
										<div className="fw-semibold">{lastChallanNo}</div>
									</div>
									<div className="col-md-2">
										<label className="form-label fw-semibold">Challan No</label>
										<input className="form-control" type="number" placeholder="Enter Challan No" value={challanNo} onChange={e => setChallanNo(e.target.value)} />
										<small className="text-muted" style={{ fontSize: '0.85em' }}>Auto-generated unless manually entered</small>
									</div>
									<div className="col-md-1 d-flex align-items-end">
										<button type="button" className="btn btn-primary w-100" onClick={handleGenerate} disabled={Object.keys(validate()).length > 0}>Generate</button>
									</div>
									<div className="col-md-1 d-flex align-items-end">
										<button type="button" className="btn btn-success w-100" onClick={handlePaid}>PAID</button>
									</div>
									<div className="col-md-1 d-flex align-items-end">
										<button type="button" className="btn btn-secondary w-100" onClick={handleClear}>Clear</button>
									</div>
								</form>
								{isPaid && <div className="alert alert-success mt-2 mb-0 py-2 px-3">Challan marked as PAID</div>}

								{/* Challan Entries Table */}
								<div className="mt-4">
									<DataTable
										data={challanEntries}
										columns={columns}
										loading={loading}
										title="Challan Entries"
										pageSize={5}
									/>
								</div>

								{/* Receipt Preview (like FeeRecipt) */}
								{showReceipt && receiptData && (
									<div className="mt-4" ref={receiptRef}>
										<div className="card p-4" style={{ background: '#fff', maxWidth: 600, margin: '0 auto' }}>
											<div style={{ border: '2px solid #b8860b', padding: 16 }}>
												<div style={{ textAlign: 'center', marginBottom: 12 }}>
													<img src="/assets/images/GRT.png" alt="logo" style={{ width: 80, height: 80, objectFit: 'contain' }} />
													<h5 className="fw-bold mt-2">GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH</h5>
													<div style={{ fontSize: 13, color: '#0b4e80' }}>Chennai - Tirupati Highway, Tiruttani - 631 209</div>
												</div>
												<hr />
												<div className="mb-2"><strong>Challan No:</strong> {receiptData.challanNo}</div>
												<div className="mb-2"><strong>Date:</strong> {receiptData.date}</div>
												<div className="mb-2"><strong>Reg No:</strong> {receiptData.regNo}</div>
												<div className="mb-2"><strong>Course:</strong> {receiptData.course}</div>
												<div className="mb-2"><strong>Semester:</strong> {receiptData.sem}</div>
												<div className="mb-2"><strong>Candidate Type:</strong> {receiptData.candidateType}</div>
												<div className="mb-2"><strong>Status:</strong> {receiptData.isPaid ? 'Paid' : 'Unpaid'}</div>
												<div className="mt-3" style={{ textAlign: 'right', fontWeight: 700 }}>PRINCIPAL</div>
											</div>
										</div>
									</div>
								)}

								{/* Report Modal (like FeeRecipt) */}
								{showReportModal && (
									<div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.2)' }}>
										<div className="modal-dialog modal-lg">
											<div className="modal-content">
												<div className="modal-header">
													<h5 className="modal-title">Download/Print Challan Report</h5>
													<button type="button" className="btn-close" onClick={() => setShowReportModal(false)}></button>
												</div>
												<div className="modal-body">
													<div className="row g-3 mb-3">
														<div className="col-md-4">
															<label className="form-label">From Date</label>
															<input type="date" className="form-control" value={reportForm.fromDate} onChange={e => setReportForm(f => ({ ...f, fromDate: e.target.value }))} />
														</div>
														<div className="col-md-4">
															<label className="form-label">To Date</label>
															<input type="date" className="form-control" value={reportForm.toDate} onChange={e => setReportForm(f => ({ ...f, toDate: e.target.value }))} />
														</div>
														<div className="col-md-4">
															<label className="form-label">Report Type</label>
															<select className="form-select" value={reportForm.reportType} onChange={e => setReportForm(f => ({ ...f, reportType: e.target.value }))}>
																<option value="all">All</option>
																<option value="paid">Paid Only</option>
																<option value="unpaid">Unpaid Only</option>
															</select>
														</div>
													</div>
													<div className="d-flex gap-2">
														<button className="btn btn-outline-primary" onClick={() => setReportDownloadType('pdf')}>Printable View</button>
														<button className="btn btn-outline-success" onClick={() => setReportDownloadType('csv')}>Export CSV</button>
													</div>
												</div>
												<div className="modal-footer">
													<button type="button" className="btn btn-secondary" onClick={() => setShowReportModal(false)}>Close</button>
													<button type="button" className="btn btn-primary" onClick={() => handleDownloadReport(reportDownloadType)}>Download</button>
												</div>
											</div>
										</div>
									</div>
								)}

							</div>
							<Footer />
						</div>
					</div>
				</div>
			</section>
		</>
	);

	// --- Report download/print logic ---
	function handleDownloadReport(type) {
		// Filter entries by date/reportType
		let rows = challanEntries;
		if (reportForm.fromDate) rows = rows.filter(r => r.date >= reportForm.fromDate);
		if (reportForm.toDate) rows = rows.filter(r => r.date <= reportForm.toDate);
		if (reportForm.reportType === 'paid') rows = rows.filter(r => r.isPaid);
		if (reportForm.reportType === 'unpaid') rows = rows.filter(r => !r.isPaid);

		if (type === 'csv') {
			const header = ['Candidate Type', 'Course', 'Semester', 'Reg No', 'Date', 'Challan No', 'Paid'];
			const dataRows = rows.map(r => [r.candidateType, r.course, r.sem, r.regNo, r.date, r.challanNo, r.isPaid ? 'Paid' : 'Unpaid']);
			const csv = [header.join(','), ...dataRows.map(row => row.join(','))].join('\n');
			const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'challan_report.csv';
			a.click();
			URL.revokeObjectURL(url);
		} else {
			// Printable HTML table
			const html = `
				<html><head><title>Challan Report</title><style>
					body { font-family: Arial, sans-serif; }
					table { width: 100%; border-collapse: collapse; font-size: 13px; }
					th, td { border: 1px solid #333; padding: 4px 8px; }
					th { background: #f5f5f5; }
				</style></head><body>
				<h3>Challan Report</h3>
				<table><thead><tr>
					<th>Candidate Type</th><th>Course</th><th>Semester</th><th>Reg No</th><th>Date</th><th>Challan No</th><th>Paid</th>
				</tr></thead><tbody>
				${rows.map(r => `<tr><td>${r.candidateType}</td><td>${r.course}</td><td>${r.sem}</td><td>${r.regNo}</td><td>${r.date}</td><td>${r.challanNo}</td><td>${r.isPaid ? 'Paid' : 'Unpaid'}</td></tr>`).join('')}
				</tbody></table></body></html>
			`;
			const win = window.open('', '_blank');
			win.document.write(html);
			win.document.close();
			win.onload = () => win.print();
		}
	}

};

export default ChallanEntry;
