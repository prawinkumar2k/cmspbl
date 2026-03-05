import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../../../../../components/Sidebar";
import Navbar from "../../../../../../components/Navbar";
import Footer from "../../../../../../components/footer";

const FEE_HEADS = [
	{ head: "Tuition", type: "Monthly", amount: 1200 },
	{ head: "Bus", type: "Monthly", amount: 300 },
	{ head: "Hostel", type: "Monthly", amount: 500 },
	{ head: "Exam", type: "One-time", amount: 800 },
	{ head: "Miscellaneous", type: "One-time", amount: 200 }
];
const FEE_TYPES = ["Monthly", "Term", "One-time"];
const PAYMENT_MODES = ["Cash", "Bank", "UPI", "Online", "Card"];

const MOCK_STUDENTS = {
	"A1001": { name: "Edison", class: "10", section: "A" },
	"A1002": { name: "Fayaz", class: "9", section: "B" },
	"A1003": { name: "Amelia", class: "8", section: "C" }
};

const INITIAL_FORM = {
	admissionNo: "",
	studentName: "",
	class: "",
	section: "",
	feeHead: "",
	feeType: "",
	amountPayable: "",
	concession: "",
	fine: "",
	totalAmount: "",
	amountPaid: "",
	balance: "",
	paymentMode: "Cash",
	referenceNo: "",
	paymentDate: new Date().toISOString().slice(0, 10)
};

export default function FeesLedgerForm() {
	const [form, setForm] = useState(INITIAL_FORM);
	const [errors, setErrors] = useState({});
	const [summary, setSummary] = useState({});
	const [showReceipt, setShowReceipt] = useState(false);
	const [entries, setEntries] = useState([]);
	const formRef = useRef(null);

	// Student search
	useEffect(() => {
		if (form.admissionNo && MOCK_STUDENTS[form.admissionNo]) {
			const s = MOCK_STUDENTS[form.admissionNo];
			setForm(prev => ({ ...prev, studentName: s.name, class: s.class, section: s.section }));
		} else {
			setForm(prev => ({ ...prev, studentName: "", class: "", section: "" }));
		}
	}, [form.admissionNo]);

	// Fee Head selection
	useEffect(() => {
		if (form.feeHead) {
			const headObj = FEE_HEADS.find(h => h.head === form.feeHead);
			setForm(prev => ({
				...prev,
				amountPayable: headObj ? headObj.amount : "",
				feeType: headObj ? headObj.type : ""
			}));
		} else {
			setForm(prev => ({ ...prev, amountPayable: "", feeType: "" }));
		}
	}, [form.feeHead]);

	// Auto-calc total amount
	useEffect(() => {
		const payable = parseFloat(form.amountPayable) || 0;
		const concession = parseFloat(form.concession) || 0;
		const fine = parseFloat(form.fine) || 0;
		const total = payable - concession + fine;
		setForm(prev => ({ ...prev, totalAmount: total > 0 ? total.toFixed(2) : "" }));
	}, [form.amountPayable, form.concession, form.fine]);

	// Auto-calc balance
	useEffect(() => {
		const total = parseFloat(form.totalAmount) || 0;
		const paid = parseFloat(form.amountPaid) || 0;
		const bal = total - paid;
		setForm(prev => ({ ...prev, balance: bal >= 0 ? bal.toFixed(2) : "" }));
	}, [form.totalAmount, form.amountPaid]);

	// Live summary
	useEffect(() => {
		setSummary({
			Payable: form.amountPayable,
			Concession: form.concession,
			Fine: form.fine,
			Total: form.totalAmount,
			PaidNow: form.amountPaid,
			Balance: form.balance
		});
	}, [form]);

	// Validation
	const validate = () => {
		const e = {};
		if (!form.admissionNo) e.admissionNo = "Admission No required";
		if (!form.feeHead) e.feeHead = "Fee Head required";
		if (parseFloat(form.amountPaid) > parseFloat(form.totalAmount)) e.amountPaid = "Paid cannot exceed Total";
		return e;
	};

	// Handlers
	const handleChange = e => {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
	};

	const handleClear = () => {
		setForm(INITIAL_FORM);
		setErrors({});
		setShowReceipt(false);
	};

	const handleSave = () => {
		const e = validate();
		setErrors(e);
		if (Object.keys(e).length) return;
		setEntries(prev => [...prev, { ...form }]);
		setShowReceipt(false);
		alert("Entry saved!");
	};

	const handleGenerateReceipt = () => {
		const e = validate();
		setErrors(e);
		if (Object.keys(e).length) return;
		setShowReceipt(true);
		console.log("Receipt generated:", form);
	};

	// UI
	return (
		<>
			<section className="overlay">
				<Sidebar />
				<div className="dashboard-main">
					<Navbar />
					<div className="dashboard-main-body">
						<div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
							<h6 className="fw-semibold mb-0">Fee Ledger Entry</h6>
							<div style={{ display: 'flex', gap: 8 }}>
								<button type="button" className="btn btn-sm btn-outline-info" onClick={handleClear}>
									<i className="fas fa-eraser me-1"></i>Clear Form
								</button>
								<button type="button" className="btn btn-sm btn-primary" onClick={handleSave}>
									<i className="fas fa-save me-1"></i>Save Entry
								</button>
								<button type="button" className="btn btn-sm btn-success" onClick={handleGenerateReceipt}>
									<i className="fas fa-file-invoice me-1"></i>Generate Receipt
								</button>
							</div>
						</div>

						<div className="card h-100 p-0 radius-12">
							<div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
								<div>
									<h6 className="text-lg fw-semibold mb-2">Student Search</h6>
								</div>
							</div>
							<div className="card-body p-24">
								<form ref={formRef} className="row g-3 align-items-end mb-3">
									<div className="col-md-3">
										<label className="form-label fw-semibold">Admission No</label>
										<input type="text" name="admissionNo" value={form.admissionNo} onChange={handleChange} className={`form-control ${errors.admissionNo ? 'is-invalid' : ''}`} placeholder="Enter Admission No" required />
										{errors.admissionNo && <div className="invalid-feedback">{errors.admissionNo}</div>}
									</div>
									<div className="col-md-3">
										<label className="form-label fw-semibold">Student Name</label>
										<input type="text" name="studentName" value={form.studentName} className="form-control" readOnly />
									</div>
									<div className="col-md-2">
										<label className="form-label fw-semibold">Class</label>
										<input type="text" name="class" value={form.class} className="form-control" readOnly />
									</div>
									<div className="col-md-2">
										<label className="form-label fw-semibold">Section</label>
										<input type="text" name="section" value={form.section} className="form-control" readOnly />
									</div>
								</form>

								<div className="border-bottom pb-3 mb-20 mt-2">
									<h6 className="text-md fw-semibold mb-3 text-primary-600">Fee Ledger Entry Form</h6>
								</div>
								<form className="row g-3 align-items-end mb-3">
									<div className="col-md-3">
										<label className="form-label fw-semibold">Fee Head</label>
										<select name="feeHead" value={form.feeHead} onChange={handleChange} className={`form-select ${errors.feeHead ? 'is-invalid' : ''}`} required>
											<option value="">Select</option>
											{FEE_HEADS.map(f => <option key={f.head} value={f.head}>{f.head}</option>)}
										</select>
										{errors.feeHead && <div className="invalid-feedback">{errors.feeHead}</div>}
									</div>
									<div className="col-md-3">
										<label className="form-label fw-semibold">Fee Type</label>
										<select name="feeType" value={form.feeType} onChange={handleChange} className="form-select" required>
											<option value="">Select</option>
											{FEE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
										</select>
									</div>
									<div className="col-md-2">
										<label className="form-label fw-semibold">Amount Payable</label>
										<input type="number" name="amountPayable" value={form.amountPayable} className="form-control" readOnly />
									</div>
									<div className="col-md-2">
										<label className="form-label fw-semibold">Concession</label>
										<input type="number" name="concession" value={form.concession} onChange={handleChange} className="form-control" min="0" />
									</div>
									<div className="col-md-2">
										<label className="form-label fw-semibold">Fine</label>
										<input type="number" name="fine" value={form.fine} onChange={handleChange} className="form-control" min="0" />
									</div>
									<div className="col-md-2">
										<label className="form-label fw-semibold">Total Amount</label>
										<input type="number" name="totalAmount" value={form.totalAmount} className="form-control" readOnly />
									</div>
									<div className="col-md-2">
										<label className="form-label fw-semibold">Amount Paid Now</label>
										<input type="number" name="amountPaid" value={form.amountPaid} onChange={handleChange} className={`form-control ${errors.amountPaid ? 'is-invalid' : ''}`} min="0" />
										{errors.amountPaid && <div className="invalid-feedback">{errors.amountPaid}</div>}
									</div>
									<div className="col-md-2">
										<label className="form-label fw-semibold">Balance</label>
										<input type="number" name="balance" value={form.balance} className="form-control" readOnly />
									</div>
								</form>

								<div className="border-bottom pb-3 mb-20 mt-2">
									<h6 className="text-md fw-semibold mb-3 text-primary-600">Payment Section</h6>
								</div>
								<form className="row g-3 align-items-end mb-3">
									<div className="col-md-3">
										<label className="form-label fw-semibold">Payment Mode</label>
										<select name="paymentMode" value={form.paymentMode} onChange={handleChange} className="form-select" required>
											{PAYMENT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
										</select>
									</div>
									{form.paymentMode !== "Cash" && (
										<div className="col-md-3">
											<label className="form-label fw-semibold">Reference No</label>
											<input type="text" name="referenceNo" value={form.referenceNo} onChange={handleChange} className="form-control" />
										</div>
									)}
									<div className="col-md-3">
										<label className="form-label fw-semibold">Payment Date</label>
										<input type="date" name="paymentDate" value={form.paymentDate} onChange={handleChange} className="form-control" />
									</div>
								</form>

								{/* Ledger Summary Preview Panel */}
								<div className="card mt-4 mb-4 radius-12 bg-info-50 p-3">
									<h6 className="fw-semibold mb-2">Ledger Summary</h6>
									<div className="row">
										{Object.entries(summary).map(([k, v]) => (
											<div className="col-md-2" key={k}>
												<div className="fw-bold text-primary-700">{k}</div>
												<div className="fs-6">{v}</div>
											</div>
										))}
									</div>
								</div>

								{/* Receipt Preview (mock) */}
								{showReceipt && (
									<div className="card mt-4 mb-4 radius-12 p-3 bg-success-50">
										<h6 className="fw-semibold mb-2">Receipt Preview (Mock)</h6>
										<div><b>Admission No:</b> {form.admissionNo}</div>
										<div><b>Student Name:</b> {form.studentName}</div>
										<div><b>Class:</b> {form.class}</div>
										<div><b>Section:</b> {form.section}</div>
										<div><b>Fee Head:</b> {form.feeHead}</div>
										<div><b>Fee Type:</b> {form.feeType}</div>
										<div><b>Amount Payable:</b> {form.amountPayable}</div>
										<div><b>Concession:</b> {form.concession}</div>
										<div><b>Fine:</b> {form.fine}</div>
										<div><b>Total Amount:</b> {form.totalAmount}</div>
										<div><b>Amount Paid:</b> {form.amountPaid}</div>
										<div><b>Balance:</b> {form.balance}</div>
										<div><b>Payment Mode:</b> {form.paymentMode}</div>
										{form.paymentMode !== "Cash" && <div><b>Reference No:</b> {form.referenceNo}</div>}
										<div><b>Payment Date:</b> {form.paymentDate}</div>
									</div>
								)}

								{/* Data Table for Entries */}
								{entries.length > 0 && (
									<div className="card mt-4 mb-4 radius-12 p-3">
										<h6 className="fw-semibold mb-2">Ledger Entries</h6>
										<div className="table-responsive">
											<table className="table table-bordered table-striped">
												<thead className="table-light">
													<tr>
														<th>Admission No</th>
														<th>Student Name</th>
														<th>Class</th>
														<th>Section</th>
														<th>Fee Head</th>
														<th>Fee Type</th>
														<th>Payable</th>
														<th>Concession</th>
														<th>Fine</th>
														<th>Total</th>
														<th>Paid</th>
														<th>Balance</th>
														<th>Mode</th>
														<th>Ref No</th>
														<th>Date</th>
													</tr>
												</thead>
												<tbody>
													{entries.map((row, idx) => (
														<tr key={idx}>
															<td>{row.admissionNo}</td>
															<td>{row.studentName}</td>
															<td>{row.class}</td>
															<td>{row.section}</td>
															<td>{row.feeHead}</td>
															<td>{row.feeType}</td>
															<td>{row.amountPayable}</td>
															<td>{row.concession}</td>
															<td>{row.fine}</td>
															<td>{row.totalAmount}</td>
															<td>{row.amountPaid}</td>
															<td>{row.balance}</td>
															<td>{row.paymentMode}</td>
															<td>{row.referenceNo}</td>
															<td>{row.paymentDate}</td>
														</tr>
													))}
												</tbody>
											</table>
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
}
