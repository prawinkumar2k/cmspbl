import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";

import Sidebar from "../../../../../../components/Sidebar";
import Navbar from "../../../../../../components/Navbar";
import Footer from "../../../../../../components/footer";
import DataTable from "../../../../../../components/DataTable/DataTable";
import toast, { Toaster } from "react-hot-toast";

const SEMS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function FeesTypeWise() {
	const [form, setForm] = useState({ academic: "", department: "", sem: "", status: "" });
	const [feeOptions, setFeeOptions] = useState([]);
	const [entries, setEntries] = useState([]);
	const [filtered, setFiltered] = useState([]);
	const [loading, setLoading] = useState(false);

	const [departmentList, setDepartmentList] = useState([]);
	const [departmentMap, setDepartmentMap] = useState({}); // code -> name
	const [academicList, setAcademicList] = useState([]);

	const reportRef = useRef();

	useEffect(() => {
		fetchFeeOptions();
		fetchEntries();
	}, []);

	// fetch department master to map codes -> names
	useEffect(() => {
		fetch('/api/department_master')
			.then((res) => res.json())
			.then((data) => {
				if (Array.isArray(data)) {
					const names = data.map((d) => d.Dept_Name).filter(Boolean);
					const map = {};
					data.forEach((d) => {
						if (d.Dept_Code) map[d.Dept_Code] = d.Dept_Name || d.Dept_Code;
					});
					setDepartmentList(names);
					setDepartmentMap(map);
				} else {
					setDepartmentList([]);
					setDepartmentMap({});
				}
			})
			.catch(() => {
				setDepartmentList([]);
				setDepartmentMap({});
			});
	}, []);

	useEffect(() => {
		// derive dropdown lists and default filtered
		// derive academic list from entries; departmentList primarily comes from master
		const academics = Array.from(new Set((entries || []).map((r) => r.academic).filter(Boolean))).sort();
		// also ensure departmentList contains any department names that appear in entries (convert codes to names)
		const deptNamesFromEntries = Array.from(
			new Set(
				(entries || [])
					.map((r) => {
						if (!r.department) return null;
						// if department stored as code, map to name
						if (departmentMap && departmentMap[r.department]) return departmentMap[r.department];
						return r.department;
					})
					.filter(Boolean)
			)
		).sort();
		// merge master list and derived names
		const mergedDepts = Array.from(new Set([...(departmentList || []), ...deptNamesFromEntries])).sort();
		setDepartmentList(mergedDepts);
		setAcademicList(academics);
		setFiltered(entries);
	}, [entries, departmentMap]);

	const fetchFeeOptions = async () => {
		try {
			const res = await fetch("/api/student-fee-master/student-fee-master");
			const json = await res.json();
			if (json?.success && Array.isArray(json.data)) setFeeOptions(json.data);
		} catch (err) {
			console.error(err);
		}
	};

	const fetchEntries = async () => {
		try {
			const res = await fetch("/api/fee-receipt");
			const json = await res.json();
			if (json?.success) {
				const rows = Array.isArray(json.data) ? json.data : [];
				const normalized = rows.map((r) => {
					// normalize common possible key names to the table fields
					const rollNo = r.rollNo || r.roll_no || r.RollNo || r.Roll_No || r.roll || r.student_roll || r.Roll || "";
					const studentName = r.studentName || r.student_name || r.Student_Name || r.name || r.student || "";
					const feestype = r.feestype || r.feeType || r.fee_type || r.feetype || r.fee || "";
					const academic = r.academic || r.academicYear || r.Academic || r.ac_year || "";
					const sem = r.sem || r.Sem || r.semester || r.Semester || "";
					// preserve original department value (could be code or name)
					const department = r.department || r.dept || r.Dept_Name || r.Dept_Code || r.departmentName || "";
					const status = r.status || r.Status || (r.paidAmount && Number(r.paidAmount) > 0 ? "Partially Paid" : "Not Paid") || "";
					return {
						...r,
						rollNo,
						studentName,
						feestype,
						academic,
						sem,
						department,
						status,
					};
				});
				setEntries(normalized);
			}
		} catch (err) {
			console.error(err);
			toast.error("Failed to load entries");
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((s) => ({ ...s, [name]: value }));
	};

	const handleView = () => {
		const { academic, department, sem, status } = form;
		const filteredRows = (entries || []).filter((r) => {
			if (academic && String(r.academic) !== String(academic)) return false;
			if (department) {
				const rowDeptName = (departmentMap && departmentMap[r.department]) || r.department || "";
				if (String(rowDeptName) !== String(department)) return false;
			}
			if (sem && String(r.sem) !== String(sem)) return false;
			if (status) {
				const rowStatus = r.status || r.Status || (r.paidAmount && Number(r.paidAmount) > 0 ? "Partially Paid" : (r.paidAmount === 0 || !r.paidAmount ? "Unpaid" : ""));
				if (status === "Unpaid") {
					if (!(rowStatus === "Unpaid" || rowStatus === "Not Paid" || !rowStatus)) return false;
				} else if (rowStatus !== status) {
					return false;
				}
			}
			return true;
		});
		setFiltered(filteredRows);
	};

	const handleSave = async (payload) => {
		setLoading(true);
		try {
			const res = await fetch("/api/fee-type-entry", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			const json = await res.json();
			if (json?.success) {
				toast.success("Saved");
				fetchEntries();
			} else {
				toast.error(json?.message || "Save failed");
			}
		} catch (err) {
			console.error(err);
			toast.error("Save failed");
		} finally {
			setLoading(false);
		}
	};

	const columns = useMemo(() => [
		{ accessorKey: "academic", header: "Academic" },
		{
			accessorKey: "department",
			header: "Department",
			cell: ({ row }) => {
				const val = row.original.department;
				return (departmentMap && departmentMap[val]) || val || "";
			},
		},
		{ accessorKey: "sem", header: "Sem" },
		{ accessorKey: "rollNo", header: "Roll No" },
		{ accessorKey: "studentName", header: "Student Name" },
		{ accessorKey: "feestype", header: "Fee Type" },
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => {
				const s = row.original.status;
				const cls =
					s === "Paid"
						? "badge bg-success"
						: s === "Partially Paid"
							? "badge bg-warning text-dark"
							: "badge bg-danger";
				return <span className={cls}>{s}</span>;
			},
		},
	], [departmentMap]);

	const handlePrint = useCallback(() => {
		const rows = filtered || [];
		const styles = `body{font-family:Arial;padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:8px}`;
		const rowsHtml = rows.map(r => {
			const deptName = (departmentMap && departmentMap[r.department]) || r.department || '';
			return `<tr><td>${r.academic || ''}</td><td>${deptName}</td><td>${r.sem || ''}</td><td>${r.rollNo || ''}</td><td>${r.studentName || ''}</td><td>${r.feestype || ''}</td><td>${r.status || ''}</td></tr>`;
		}).join('');
		const html = `<!doctype html><html><head><meta charset="utf-8"><title>Fees Report</title><style>${styles}</style></head><body><h2>Fees Report</h2><table><thead><tr><th>Academic</th><th>Department</th><th>Sem</th><th>Roll No</th><th>Name</th><th>Fee Type</th><th>Status</th></tr></thead><tbody>${rowsHtml}</tbody></table></body></html>`;
		const w = window.open("", "_blank", "width=900,height=700");
		if (!w) return toast.error("Popup blocked");
		w.document.write(html);
		w.document.close();
		w.focus();
		w.print();
	}, [filtered, departmentMap]);

	return (
		<>
			<Toaster position="top-right" />
			<section className="overlay">
				<Sidebar />

				<div className="dashboard-main">
					<Navbar />

					<div className="dashboard-main-body">

						<div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
							<h6 className="fw-semibold mb-0">Fees Type Wise</h6>
							<ul className="d-flex align-items-center gap-2 list-unstyled mb-0">
								<li className="fw-medium">
									<a href="index.html" className="d-flex align-items-center gap-1 hover-text-primary">
										<iconify-icon icon="solar:home-smile-angle-outline" className="icon text-lg"></iconify-icon>
										Dashboard
									</a>
								</li>
								<li>-</li>
								<li className="fw-medium">Administration</li>
								<li>-</li>
								<li className="fw-medium">Office</li>
								<li>-</li>
								<li className="fw-medium">Fees Type Wise</li>
							</ul>
						</div>

						<div className="card h-100 p-0 radius-12">
							<div className="card-header border-bottom-0 p-24 pb-0 d-flex align-items-center justify-content-between gap-3" style={{ flexWrap: 'nowrap' }}>
								<div style={{ flex: 1, minWidth: 0 }}>
									<form className="row g-3">
										<div className="col-md-3">
											<label className="form-label">Academic Year</label>
											<select className="form-select" name="academic" value={form.academic} onChange={handleChange}>
												<option value="">All</option>
												{academicList.map(a => <option key={a} value={a}>{a}</option>)}
											</select>
										</div>
										<div className="col-md-3">
											<label className="form-label">Department</label>
											<select className="form-select" name="department" value={form.department} onChange={handleChange}>
												<option value="">All</option>
												{departmentList.map(d => <option key={d} value={d}>{d}</option>)}
											</select>
										</div>
										<div className="col-md-2">
											<label className="form-label">Semester</label>
											<select className="form-select" name="sem" value={form.sem} onChange={handleChange}>
												<option value="">All</option>
												{SEMS.map(s => <option key={s} value={s}>{s}</option>)}
											</select>
										</div>

										<div className="col-md-2">
											<label className="form-label">Status</label>
											<select className="form-select" name="status" value={form.status} onChange={handleChange}>
												<option value="">All</option>
												<option value="Partially Paid">Partially Paid</option>
												<option value="Paid">Paid</option>
												<option value="Unpaid">Unpaid</option>
											</select>
										</div>
									</form>
								</div>
								<div className="d-flex align-items-center gap-2 ms-auto">
									<button type="button" className="btn btn-sm btn-outline-primary" onClick={handleView}>View</button>
									<button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => { setForm({ academic: '', department: '', sem: '', status: '' }); setFiltered(entries); }}>Reset</button>
								</div>
							</div>

							<div className="card-body p-24 pt-20">
								<div className="card">
									<div className="card-header d-flex justify-content-between">
										<h6 className="mb-0">Entries</h6>
										<div>
											<button className="btn btn-outline-primary btn-sm me-2" onClick={handlePrint}>Print</button>
										</div>
									</div>
									<div className="card-body">
										<DataTable data={filtered} columns={columns} pageSize={10} loading={loading} />
									</div>
								</div>
							</div>
						</div>

					</div>
					<Footer />
				</div>
			</section>
		</>
	);
}

