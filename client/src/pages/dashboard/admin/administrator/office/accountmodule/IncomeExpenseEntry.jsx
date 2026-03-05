
import React, { useState, useEffect } from "react";
import Sidebar from "../../../../../../components/Sidebar";
import Navbar from "../../../../../../components/Navbar";
import Footer from "../../../../../../components/footer";
import DataTable from "../../../../../../components/DataTable/DataTable";
import toast from 'react-hot-toast';

const DEFAULT_GROUPS = [];
const DEFAULT_CATEGORIES = [];
const DEFAULT_PERSONS = [];
const AUTHORIZATIONS = ["Principal", "Manager", "Accountant"];
const PAYMENT_MODES = ["Cash", "Cheque"];
// Fields that we will validate and show toast warnings for when missing
const REQUIRED_FIELDS = {
	date: 'Date',
	group: 'Group',
	category: 'Category',
	person: 'Person',
	authorization: 'Authorization',
	paymentMode: 'Payment Mode'
};

export default function IncomeExpenseEntry() {
	// DataTable columns for receipts
	const receiptColumns = [
		{ accessorKey: 'date', header: 'Date' },
		{ accessorKey: 'group', header: 'Group' },
		{ accessorKey: 'category', header: 'Category' },
		{ accessorKey: 'person', header: 'Person' },
		{ accessorKey: 'authorization', header: 'Authorization' },
		{ accessorKey: 'paymentMode', header: 'Payment Mode' },
		{ accessorKey: 'detail', header: 'Detail' },
		{ accessorKey: 'income', header: 'Income' },
		{ accessorKey: 'expense', header: 'Expense' },
		{ accessorKey: 'sno', header: 'Bill No' },
	];

	// Helper to build a readable label for staff records
	const getStaffLabel = (s) => {
		if (!s || typeof s !== 'object') return String(s || '');
		const candidates = [
			s.name,
			s.Name,
			s.staffName,
			s.name_display,
			s.StaffName,
			s.full_name,
			s.FullName,
			s.first_name && s.last_name ? `${s.first_name} ${s.last_name}` : null,
			s.firstName && s.lastName ? `${s.firstName} ${s.lastName}` : null,
			s.fname,
			s.displayName,
		].filter(Boolean);
		return candidates.length ? String(candidates[0]) : JSON.stringify(s);
	};

	const getStaffKey = (s) => {
		return s && (s.id || s._id || s.staffId || s.staff_id) ? (s.id || s._id || s.staffId || s.staff_id) : getStaffLabel(s);
	};

	// Actions for DataTable (DataTable uses onEdit/onDelete props)
	// Receipts state
	const [showReceipts, setShowReceipts] = useState(false);
	const [receipts, setReceipts] = useState([]);
	const [loadingReceipts, setLoadingReceipts] = useState(false);
	// mappings derived from stored receipts for cascading selects
	const [groupToCategories, setGroupToCategories] = useState({});
	const [groupCategoryToPersons, setGroupCategoryToPersons] = useState({});
	const [editingReceiptId, setEditingReceiptId] = useState(null);

	// Helper: fetch all receipts (used to build mappings)
	const fetchAllReceipts = async () => {
		try {
			const res = await fetch('/api/income-expense');
			if (res.ok) {
				const data = await res.json();
				setReceipts(Array.isArray(data) ? data : []);
			}
		} catch (err) {
			console.error('Error fetching receipts for mapping', err);
		}
	};

	const handleViewReceipts = async () => {
		setLoadingReceipts(true);
		try {
			const res = await fetch('/api/income-expense');
			if (res.ok) {
				const data = await res.json();
				setReceipts(Array.isArray(data) ? data : []);
				setShowReceipts(true);
			} else {
				console.warn('Failed to fetch receipts', res.status);
				setReceipts([]);
				setShowReceipts(true);
			}
		} catch (err) {
			console.error('Error fetching receipts', err);
			setReceipts([]);
			setShowReceipts(true);
		} finally {
			setLoadingReceipts(false);
		}
	};

	// Build mappings whenever receipts change
	useEffect(() => {
		const gToC = {};
		const gcToP = {};
		receipts.forEach(r => {
			const g = r.group || '';
			const c = r.category || '';
			const p = r.person || '';
			if (!gToC[g]) gToC[g] = new Set();
			if (c) gToC[g].add(c);
			const key = `${g}||${c}`;
			if (!gcToP[key]) gcToP[key] = new Set();
			if (p) gcToP[key].add(p);
		});
		// convert sets to arrays
		const gToCOut = {};
		Object.keys(gToC).forEach(k => gToCOut[k] = Array.from(gToC[k]));
		const gcToPOut = {};
		Object.keys(gcToP).forEach(k => gcToPOut[k] = Array.from(gcToP[k]));
		setGroupToCategories(gToCOut);
		setGroupCategoryToPersons(gcToPOut);
	}, [receipts]);

	// Fetch receipts once on mount to populate mappings (no UI change)
	useEffect(() => {
		fetchAllReceipts();
		// also load master groups on mount
		(async () => {
			try {
				const gres = await fetch('/api/income-expense-master/groups');
				if (gres.ok) {
					const gdata = await gres.json();
					if (Array.isArray(gdata)) {
						const list = gdata.map(r => r.group).filter(Boolean);
						setGroups(prev => {
							// merge keeping unique
							const merged = Array.from(new Set([...(prev || []), ...list]));
							return merged;
						});
					}
				}
			} catch (err) {
				console.error('Failed to load master groups', err);
			}
		})();
	}, []);



	// Load a receipt into the form for editing
	const handleEditReceipt = (row) => {
		if (!row) return;
		setDate(row.date || '');
		setGroup(row.group || '');
		setCategory(row.category || '');
		setPerson(row.person || '');
		setAuthorization(row.authorization || '');
		setPaymentMode(row.paymentMode || 'Cash');
		setDetail(row.detail || '');
		setIncome(row.income ?? '');
		setExpense(row.expense ?? '');
		setSuspense(!!row.suspense);
		setSno(row.sno || '');
		setEditingReceiptId(row.id || null);
		setShowReceipts(false);
		toast.success('Receipt loaded for edit');
	};

	// Cascading handlers
	const handleGroupChange = (e) => {
		const value = e.target.value;
		setGroup(value);
		// fetch categories from master service
		(async () => {
			if (!value) {
				setCategories([]);
				setCategory('');
				setPersons([]);
				setPerson('');
				return;
			}
			try {
				const cres = await fetch(`/api/income-expense-master/categories/${encodeURIComponent(value)}`);
				if (cres.ok) {
					const cdata = await cres.json();
					const list = Array.isArray(cdata) ? cdata.map(r => r.category).filter(Boolean) : [];
					setCategories(list.length ? list : DEFAULT_CATEGORIES);
					if (list.length === 1) {
						setCategory(list[0]);
						// fetch persons for that category
						const pres = await fetch(`/api/income-expense-master/persons/${encodeURIComponent(value)}/${encodeURIComponent(list[0])}`);
						if (pres.ok) {
							const pdata = await pres.json();
							const plist = Array.isArray(pdata) ? pdata.map(r => r.person).filter(Boolean) : [];
							setPersons(plist.length ? plist : DEFAULT_PERSONS);
							if (plist.length === 1) setPerson(plist[0]);
						}
					} else {
						setCategory('');
						setPersons(DEFAULT_PERSONS);
						setPerson('');
					}
				} else {
					setCategories([]);
					setPersons([]);
				}
			} catch (err) {
				console.error('Failed to fetch categories for group', err);
				setCategories([]);
				setPersons([]);
			}
		})();
	};

	const handleCategoryChange = (e) => {
		const value = e.target.value;
		setCategory(value);
		// fetch persons for selected group+category
		(async () => {
			if (!group || !value) {
				setPersons([]);
				setPerson('');
				return;
			}
			try {
				const pres = await fetch(`/api/income-expense-master/persons/${encodeURIComponent(group)}/${encodeURIComponent(value)}`);
				if (pres.ok) {
					const pdata = await pres.json();
					const plist = Array.isArray(pdata) ? pdata.map(r => r.person).filter(Boolean) : [];
					setPersons(plist.length ? plist : DEFAULT_PERSONS);
					if (plist.length === 1) setPerson(plist[0]);
				} else {
					setPersons(DEFAULT_PERSONS);
				}
			} catch (err) {
				console.error('Failed to fetch persons for group/category', err);
				setPersons([]);
			}
		})();

		// After selecting a category, check if there's a matching suspense amount
		checkAndFillSuspense(value, person);
	};

	// When person changes, use this handler so we can check for suspense amounts
	const handlePersonChange = (e) => {
		const value = e.target.value;
		setPerson(value);
		setFieldErrors(prev => ({ ...prev, person: false }));
		checkAndFillSuspense(category, value);
	};

	// Delete receipt with confirmation
	const handleDeleteReceipt = (row) => {
		if (!row) return;
		toast((t) => (
			<div>
				<div>Are you sure you want to delete this receipt?</div>
				<div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
					<button
						style={{ background: '#d32f2f', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4 }}
						onClick={async () => {
							const id = row.id || row.sno || row._id;
							if (!id) {
								toast.dismiss(t.id);
								toast.error('No id available to delete');
								return;
							}
							try {
								const res = await fetch(`/api/income-expense/${id}`, { method: 'DELETE' });
								if (!res.ok) throw new Error('Delete failed');
								setReceipts(prev => prev.filter(r => (r.id || r.sno || r._id) !== id));
								toast.dismiss(t.id);
								toast.success('Deleted');
							} catch (err) {
								toast.dismiss(t.id);
								toast.error('Failed to delete');
								console.error('Delete error', err);
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
	};
	const [date, setDate] = useState("");
	const [groups, setGroups] = useState([]);
	const [categories, setCategories] = useState([]);
	const [persons, setPersons] = useState([]);
	const [group, setGroup] = useState("");
	const [category, setCategory] = useState("");
	const [person, setPerson] = useState("");
	const [fieldErrors, setFieldErrors] = useState({});
	const [newGroup, setNewGroup] = useState("");
	const [isCreatingGroup, setIsCreatingGroup] = useState(false);
	const [isCreatingCategory, setIsCreatingCategory] = useState(false);
	const [isCreatingPerson, setIsCreatingPerson] = useState(false);
	const [newCategory, setNewCategory] = useState("");
	const [newPerson, setNewPerson] = useState("");
	const [staffList, setStaffList] = useState([]); // [{id, name}]
	const [selectedStaffName, setSelectedStaffName] = useState("");
	const [selectedStaffId, setSelectedStaffId] = useState("");
	const [authorization, setAuthorization] = useState("");
	const [paymentMode, setPaymentMode] = useState("Cash");
	const [detail, setDetail] = useState("");
	const [bill, setBill] = useState(false);
	const [income, setIncome] = useState("");
	const [expense, setExpense] = useState("");
	const [isIncomeDisabled, setIsIncomeDisabled] = useState(false);
	const [isExpenseDisabled, setIsExpenseDisabled] = useState(false);
	const [suspense, setSuspense] = useState(false);
	const [sno, setSno] = useState("");

	// When user wants to create/assign a person, fetch staff master list once
	useEffect(() => {
		if (!isCreatingPerson) return;
		(async () => {
			try {
				const res = await fetch('/api/staff_master');
				if (!res.ok) throw new Error('Failed');
				const j = await res.json();
				let list = [];
				if (Array.isArray(j)) list = j;
				else if (j && Array.isArray(j.data)) list = j.data;
				// normalize to { id, name }
				const normalized = list.map(s => ({
					id: s.Staff_ID ?? s.staff_id ?? s.staffId ?? s.id ?? '',
					name: s.Staff_Name ?? s.StaffName ?? s.name ?? s.Name ?? s.staffName ?? ''
				}));
				setStaffList(normalized);
			} catch (err) {
				console.error('Failed to load staff master', err);
				setStaffList([]);
			}
		})();
	}, [isCreatingPerson]);

	// Helper: if there's a settlement row matching expense_type and person, show it
	const checkAndFillSuspense = async (expenseType, personName) => {
		if (!expenseType || !personName) return;
		try {
			const q = new URLSearchParams({ expense_type: expenseType, person: personName });
			const res = await fetch(`/api/settlements?${q.toString()}`);
			if (!res.ok) return;
			const data = await res.json();
			if (Array.isArray(data) && data.length) {
				const row = data[0];
				if (row && (row.amount || row.amount === 0)) {
					setExpense(String(row.amount));
					setSuspense(true);
					setIsExpenseDisabled(false);
					toast.info('Filled suspense amount from existing settlement');
				}
			} else {
				setSuspense(false);
			}
		} catch (err) {
			console.error('Error checking suspense amount', err);
		}
	};

	// Placeholder handlers
	const handleSubmit = (e) => {
		e.preventDefault();
		handleUpdate();
	};

	// Validate required fields. Returns true if valid, false otherwise.
	const validateForm = () => {
		const errors = {};
		// check required fields
		Object.keys(REQUIRED_FIELDS).forEach(key => {
			let val = '';
			switch (key) {
				case 'date': val = date; break;
				case 'group': val = group; break;
				case 'category': val = category; break;
				case 'person': val = person; break;
				case 'authorization': val = authorization; break;
				case 'paymentMode': val = paymentMode; break;
				default: val = '';
			}
			if (!val || (typeof val === 'string' && val.trim() === '')) {
				errors[key] = true;
				toast.error(`${REQUIRED_FIELDS[key]} is required`);
			}
		});
		setFieldErrors(errors);
		return Object.keys(errors).length === 0;
	};
	const handleUpdate = async () => {
		const payload = {
			date,
			group,
			category,
			person,
			authorization,
			paymentMode,
			detail,
			sno,
			income: income ? parseFloat(income) : 0,
			expense: expense ? parseFloat(expense) : 0,
			suspense: !!suspense
		};

		// Client-side validation to avoid server 400
		if (!validateForm()) return;

		try {
			let res;
			if (editingReceiptId) {
				res = await fetch(`/api/income-expense/${editingReceiptId}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload)
				});
			} else {
				res = await fetch('/api/income-expense', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload)
				});
			}

			if (!res.ok) {
				let errMsg = 'Save failed';
				try {
					const j = await res.json();
					if (j && j.message) errMsg = j.message;
				} catch (e) { }
				throw new Error(errMsg);
			}
			const data = await res.json();
			toast.success(editingReceiptId ? 'Updated successfully' : 'Saved successfully');
			// refresh receipts if visible
			if (showReceipts) await handleViewReceipts();
			// reset form
			setEditingReceiptId(null);
			handleClose();
		} catch (err) {
			console.error('Save error', err);
			toast.error('Failed to save');
		}
	};
	const handleVoucher = () => {
		console.log("Voucher", { date, group, category, person, authorization, paymentMode, detail, bill, income, suspense, expense, sno });
	};
	const handleClose = () => {
		setDate("");
		setGroup("");
		setCategory("");
		setPerson("");
		setAuthorization("");
		setPaymentMode("Cash");
		setDetail("");
		setBill(false);
		setIncome("");
		setExpense("");
		setIsIncomeDisabled(false);
		setIsExpenseDisabled(false);
		setSuspense(false);
		setSno("");
		console.log("Form closed");
	};
	const handlePaymentModeChange = (e) => {
		setPaymentMode(e.target.value);
		console.log("Payment mode changed:", e.target.value);
	};

	// Print receipts table in a new window
	const handlePrintReceipts = () => {
		try {
			const cols = receiptColumns;
			const headers = cols.map(c => c.header || c.accessorKey || '').filter(Boolean);
			let rowsHtml = receipts.map(r => {
				const cells = cols.map(c => {
					const key = c.accessorKey;
					let v = '';
					if (!key) return '';
					v = r[key] ?? r[key.replace(/[A-Z]/g, m => `_${m.toLowerCase()}`)] ?? '';
					return `<td style="padding:6px; border:1px solid #ddd;">${String(v ?? '')}</td>`;
				}).join('');
				return `<tr>${cells}</tr>`;
			}).join('');

			if (!rowsHtml) rowsHtml = '<tr><td colspan="' + headers.length + '" style="padding:8px;text-align:center">No records</td></tr>';

			const headerHtml = headers.map(h => `<th style="padding:8px; border:1px solid #ddd; background:#f7f7f7; text-align:left">${h}</th>`).join('');

			const html = `
				<html>
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width,initial-scale=1" />
					<title>Receipts</title>
					<style>
						body { font-family: Arial, Helvetica, sans-serif; padding: 12px; }
						table { border-collapse: collapse; width: 100%; font-size: 13px; }
						th, td { border: 1px solid #ddd; padding: 8px; }
						th { background: #f7f7f7; }
						@media print { button { display:none } }
					</style>
				</head>
				<body>
					<h3>Receipts</h3>
					<table>
						<thead><tr>${headerHtml}</tr></thead>
						<tbody>${rowsHtml}</tbody>
					</table>
				</body>
				</html>`;

			const w = window.open('', '_blank', 'width=900,height=700');
			if (!w) { toast.error('Pop-up blocked. Allow pop-ups and try again.'); return; }
			w.document.open();
			w.document.write(html);
			w.document.close();
			// wait briefly for render then print
			setTimeout(() => { try { w.focus(); w.print(); } catch (e) { console.error(e); } }, 200);
		} catch (err) {
			console.error('Print failed', err);
			toast.error('Failed to print');
		}
	};

	// income/expense mutual exclusivity: entering a positive value disables the other field
	const handleIncomeChange = (val) => {
		setIncome(val);
		const n = parseFloat(val);
		if (!isNaN(n) && n > 0) {
			setIsExpenseDisabled(true);
		} else {
			setIsExpenseDisabled(false);
		}
	};

	const handleExpenseChange = (val) => {
		setExpense(val);
		const n = parseFloat(val);
		if (!isNaN(n) && n > 0) {
			setIsIncomeDisabled(true);
		} else {
			setIsIncomeDisabled(false);
		}
	};

	const handleAddGroup = (e) => {
		e.preventDefault();
		if (newGroup && !groups.includes(newGroup)) {
			setGroups([...groups, newGroup]);
			setGroup(newGroup);
			setNewGroup("");
		}
	};

	const handleCreateGroup = () => {
		if (!newGroup || !newGroup.trim()) {
			console.warn('Please enter a group name');
			return;
		}
		const created = newGroup.trim();
		// POST to master API
		(async () => {
			try {
				const res = await fetch('/api/income-expense-master', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ group: created })
				});
				if (res.ok) {
					setGroups(prev => Array.from(new Set([...(prev || []), created])));
					setGroup(created);
					setNewGroup('');
					setIsCreatingGroup(false);
					console.log('Group created (master):', created);
				} else {
					console.warn('Failed to save group to master, adding locally');
					setGroups(prev => [...prev, created]);
					setGroup(created);
					setNewGroup('');
					setIsCreatingGroup(false);
				}
			} catch (err) {
				console.error('Create group failed, adding locally', err);
				setGroups(prev => [...prev, created]);
				setGroup(created);
				setNewGroup('');
				setIsCreatingGroup(false);
			}
		})();
	};

	const handleCreateCategory = () => {
		if (!newCategory || !newCategory.trim()) {
			console.warn('Please enter a category name');
			return;
		}
		const created = newCategory.trim();
		(async () => {
			try {
				const res = await fetch('/api/income-expense-master', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ group: group || null, category: created })
				});
				if (res.ok) {
					setCategories(prev => Array.from(new Set([...(prev || []), created])));
					setCategory(created);
					setNewCategory('');
					setIsCreatingCategory(false);
					console.log('Category created (master):', created);
				} else {
					setCategories(prev => [...prev, created]);
					setCategory(created);
					setNewCategory('');
					setIsCreatingCategory(false);
				}
			} catch (err) {
				console.error('Create category failed, adding locally', err);
				setCategories(prev => [...prev, created]);
				setCategory(created);
				setNewCategory('');
				setIsCreatingCategory(false);
			}
		})();
	};

	const handleCreatePerson = () => {
		if (!newPerson || !newPerson.trim()) {
			console.warn('Please enter a person name');
			return;
		}
		const created = newPerson.trim();
		(async () => {
			try {
				const res = await fetch('/api/income-expense-master', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ group: group || null, category: category || null, person: created })
				});
				if (res.ok) {
					setPersons(prev => Array.from(new Set([...(prev || []), created])));
					setPerson(created);
					checkAndFillSuspense(category, created);
					setNewPerson('');
					setIsCreatingPerson(false);
					console.log('Person created (master):', created);
				} else {
					setPersons(prev => [...prev, created]);
					setPerson(created);
					checkAndFillSuspense(category, created);
					setNewPerson('');
					setIsCreatingPerson(false);
				}
			} catch (err) {
				console.error('Create person failed, adding locally', err);
				setPersons(prev => [...prev, created]);
				setPerson(created);
				checkAndFillSuspense(category, created);
				setNewPerson('');
				setIsCreatingPerson(false);
			}
		})();
	};
	const handleAddCategory = (e) => {
		e.preventDefault();
		if (newCategory && !categories.includes(newCategory)) {
			setCategories([...categories, newCategory]);
			setCategory(newCategory);
			setNewCategory("");
		}
	};
	const handleAddPerson = (e) => {
		e.preventDefault();
		if (newPerson && !persons.includes(newPerson)) {
			setPersons([...persons, newPerson]);
			setPerson(newPerson);
			setNewPerson("");
		}
	};

	return (
		<>
			<Sidebar />
			<div className="dashboard-main">
				<Navbar />
				<div className="dashboard-main-body">
					<div className="card radius-12 p-0" style={{ background: "#f7f7fa" }}>
						<div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
							<div>
								<h6 className="text-lg fw-semibold mb-2">Income/Expense Entry</h6>
								<span className="text-sm fw-medium text-secondary-light">Record income and expenses for accounts</span>
							</div>
							<div style={{ display: "flex", gap: 8 }}>
								<button
									type="button"
									className={`btn btn-sm ${showReceipts ? "btn-success" : "btn-outline-info"}`}
									onClick={() => {
										if (showReceipts) setShowReceipts(false);
										else handleViewReceipts();
									}}
									title={showReceipts ? "Hide Data" : "View Data"}
								>
									<i className={`fas ${showReceipts ? "fa-eye-slash" : "fa-table"} me-1`}></i>
									{showReceipts ? "Hide Data" : "View Data"}
								</button>
								<button
									type="button"
									className="btn btn-sm btn-outline-primary"
									onClick={handlePrintReceipts}
									title="Print"
								>
									<i className="fas fa-print me-1" />
									Print
								</button>
							</div>
						</div>
						<div className="card-body p-24">
							<form className="row g-3 align-items-end mb-3" onSubmit={handleSubmit}>
								<div className="col-md-3">
									<label className="form-label fw-semibold">Date</label>
									<input type="date" className={`form-control ${fieldErrors.date ? 'is-invalid' : (date ? 'is-valid' : '')}`} value={date} onChange={e => { setDate(e.target.value); setFieldErrors(prev => ({ ...prev, date: false })); }} />
								</div>
								<div className="col-md-3">
									<label className="form-label fw-semibold">Group</label>
									{!isCreatingGroup ? (
										<div className="d-flex gap-2">
											<select className={`form-select ${fieldErrors.group ? 'is-invalid' : (group ? 'is-valid' : '')}`} value={group} onChange={(e) => { handleGroupChange(e); setFieldErrors(prev => ({ ...prev, group: false })); }}>
												<option value="">Select</option>
												{groups.map(g => <option key={g} value={g}>{g}</option>)}
											</select>
											<button
												type="button"
												className="btn btn-outline-primary px-3"
												onClick={() => setIsCreatingGroup(true)}
												title="Create New Group"
											>
												<i className="fas fa-plus"></i>
											</button>
										</div>
									) : (
										<div className="d-flex gap-2">
											<input
												type="text"
												className="form-control"
												placeholder="Enter new group"
												value={newGroup}
												onChange={e => setNewGroup(e.target.value)}
											/>
											<button
												type="button"
												className="btn btn-success px-3"
												onClick={handleCreateGroup}
												title="Save Group"
											>
												<i className="fas fa-check"></i>
											</button>
											<button
												type="button"
												className="btn btn-danger px-3"
												onClick={() => { setIsCreatingGroup(false); setNewGroup(''); }}
												title="Cancel"
											>
												<i className="fas fa-times"></i>
											</button>
										</div>
									)}
								</div>
								<div className="col-md-3">
									<label className="form-label fw-semibold">Category</label>
									{!isCreatingCategory ? (
										<div className="d-flex gap-2">
											<select className={`form-select ${fieldErrors.category ? 'is-invalid' : (category ? 'is-valid' : '')}`} value={category} onChange={(e) => { handleCategoryChange(e); setFieldErrors(prev => ({ ...prev, category: false })); }}>
												<option value="">Select</option>
												{categories.map(c => <option key={c} value={c}>{c}</option>)}
											</select>
											<button
												type="button"
												className="btn btn-outline-primary px-3"
												onClick={() => setIsCreatingCategory(true)}
												title="Create New Category"
											>
												<i className="fas fa-plus"></i>
											</button>
										</div>
									) : (
										<div className="d-flex gap-2">
											<input
												type="text"
												className="form-control"
												placeholder="Enter new category"
												value={newCategory}
												onChange={e => setNewCategory(e.target.value)}
											/>
											<button
												type="button"
												className="btn btn-success px-3"
												onClick={handleCreateCategory}
												title="Save Category"
											>
												<i className="fas fa-check"></i>
											</button>
											<button
												type="button"
												className="btn btn-danger px-3"
												onClick={() => { setIsCreatingCategory(false); setNewCategory(''); }}
												title="Cancel"
											>
												<i className="fas fa-times"></i>
											</button>
										</div>
									)}
								</div>
								<div className="col-md-3">
									<label className="form-label fw-semibold">Person</label>
									{!isCreatingPerson ? (
										<div className="d-flex gap-2">
											<select className={`form-select ${fieldErrors.person ? 'is-invalid' : (person ? 'is-valid' : '')}`} value={person} onChange={handlePersonChange}>
												<option value="">Select</option>
												{persons.map(p => <option key={p} value={p}>{p}</option>)}
											</select>
											<button
												type="button"
												className="btn btn-outline-primary px-3"
												onClick={() => setIsCreatingPerson(true)}
												title="Create New Person"
											>
												<i className="fas fa-plus"></i>
											</button>
										</div>
									) : (
										<div className="d-flex gap-2">
											<input
												list="staffOptions"
												className="form-control"
												placeholder="Type staff name"
												value={selectedStaffName}
												onChange={e => {
													const v = e.target.value;
													setSelectedStaffName(v);
													// try to find exact match 'Name (ID)' or just name
													const match = staffList.find(s => `${s.name} (${s.id})` === v || s.name === v);
													setSelectedStaffId(match ? match.id : '');
												}}
											/>
											<datalist id="staffOptions">
												{staffList.map(s => <option key={s.id || s.name} value={`${s.name} (${s.id})`} />)}
											</datalist>
											<button
												type="button"
												className="btn btn-success px-3"
												onClick={async () => {
													if (!selectedStaffName) {
														toast.error('Please select a staff to assign');
														return;
													}
													try {
														const res = await fetch('/api/income-expense-master', {
															method: 'POST',
															headers: { 'Content-Type': 'application/json' },
															body: JSON.stringify({ group: group || null, category: category || null, person: selectedStaffName })
														});
														if (res.ok) {
															setPersons(prev => Array.from(new Set([...(prev || []), selectedStaffName])));
															setPerson(selectedStaffName);
															checkAndFillSuspense(category, selectedStaffName);
															setSelectedStaffName('');
															setSelectedStaffId('');
															setIsCreatingPerson(false);
															toast.success('Person assigned');
														} else {
															setPersons(prev => [...prev, selectedStaffName]);
															setPerson(selectedStaffName);
															checkAndFillSuspense(category, selectedStaffName);
															setSelectedStaffName('');
															setSelectedStaffId('');
															setIsCreatingPerson(false);
															toast.success('Person added locally');
														}
													} catch (err) {
														console.error('Assign person failed', err);
														setPersons(prev => [...prev, selectedStaffName]);
														setPerson(selectedStaffName);
														checkAndFillSuspense(category, selectedStaffName);
														setSelectedStaffName('');
														setSelectedStaffId('');
														setIsCreatingPerson(false);
														toast.success('Person added locally');
													}
												}}
												title="Assign Person"
											>
												<i className="fas fa-check"></i>
											</button>
											<button
												type="button"
												className="btn btn-danger px-3"
												onClick={() => { setIsCreatingPerson(false); setSelectedStaffName(''); setSelectedStaffId(''); }}
												title="Cancel"
											>
												<i className="fas fa-times"></i>
											</button>
										</div>
									)}
								</div>
								<div className="col-md-3">
									<label className="form-label fw-semibold">Authorization</label>
									<select className={`form-select ${fieldErrors.authorization ? 'is-invalid' : (authorization ? 'is-valid' : '')}`} value={authorization} onChange={e => { setAuthorization(e.target.value); setFieldErrors(prev => ({ ...prev, authorization: false })); }}>
										<option value="">Select</option>
										{AUTHORIZATIONS.map(a => <option key={a} value={a}>{a}</option>)}
									</select>
								</div>
								<div className="col-md-3">
									<label className="form-label fw-semibold">Detail</label>
									<input type="text" className="form-control" value={detail} onChange={e => setDetail(e.target.value)} />
								</div>

								<div className="col-md-3">
									<label className="form-label fw-semibold">Bill no</label>
									<input type="text" className="form-control" value={sno} onChange={e => setSno(e.target.value)} />
								</div>

								<div className="col-md-3">
									<label className="form-label fw-semibold">Payment Mode</label>
									<select className="form-select" value={paymentMode} onChange={handlePaymentModeChange}>
										<option value="">Select</option>
										{PAYMENT_MODES.map(mode => (
											<option key={mode} value={mode}>{mode}</option>
										))}
									</select>
								</div>


								<div className="col-md-3">
									<label className="form-label fw-semibold">Income</label>
									<input type="number" className={`form-control ${fieldErrors.income ? 'is-invalid' : (income ? 'is-valid' : '')}`} value={income} onChange={e => { handleIncomeChange(e.target.value); setFieldErrors(prev => ({ ...prev, income: false })); }} disabled={isIncomeDisabled} />
								</div>

								<div className="col-md-3">
									<label className="form-label fw-semibold">Expense</label>
									<input type="number" className={`form-control ${fieldErrors.expense ? 'is-invalid' : (expense ? 'is-valid' : '')}`} value={expense} onChange={e => { handleExpenseChange(e.target.value); setFieldErrors(prev => ({ ...prev, expense: false })); }} disabled={isExpenseDisabled} />
								</div>

								<div className="col-md-3 d-flex align-items-center">
									<div className="form-check">
										<input
											type="checkbox"
											className="form-check-input"
											id="suspenseCheckbox"
											checked={suspense}
											onChange={e => setSuspense(e.target.checked)}
										/>
										<label className="form-check-label" htmlFor="suspenseCheckbox">Suspense</label>
									</div>
								</div>

								<div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">

									<button
										type="button"
										className="btn btn-outline-primary w-10"
										onClick={handleUpdate}
									>
										SUBMIT
									</button>

									<button
										type="button"
										className="btn btn-outline-info w-10"
										onClick={handleVoucher}
									>


										CLOSE
									</button>

								</div>
							</form>
							{/* Receipts DataTable */}
							{showReceipts && (
								<div className="mt-4">
									<h6 className="fw-semibold mb-2">Receipts</h6>
									{loadingReceipts ? (
										<div>Loading...</div>
									) : (
										<>
											<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 8 }}>
												<button
													className="btn btn-sm btn-outline-primary"
													onClick={() => handlePrintReceipts()}
													title="Print Receipts"
												>
													<i className="fas fa-print me-1" /> Print
												</button>
											</div>
											<DataTable
												data={receipts}
												columns={receiptColumns}
												title="Receipts"
												pageSize={10}
												onEdit={handleEditReceipt}
												onDelete={handleDeleteReceipt}
												enableExport={false}
											/>
										</>
									)}
								</div>
							)}
						</div>
					</div>

				</div>
				<Footer />
			</div>
		</>
	);
}
