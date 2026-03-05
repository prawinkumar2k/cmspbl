import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { toast, ToastContainer } from 'react-toastify';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../../../../components/css/style.css";
import Navbar from "../../../../../components/Navbar";
import Sidebar from "../../../../../components/Sidebar";
import Footer from "../../../../../components/footer";

const ExamSettings = () => {
	const [month, setMonth] = useState("");
	const [year, setYear] = useState("");
	const [chiefName, setChiefName] = useState("");
	const [rollback, setRollback] = useState(false);
	const [selectedTable, setSelectedTable] = useState("");

	// Fee fields state
	const [feeEditable, setFeeEditable] = useState(true);
	const [fees, setFees] = useState({
		subject: "",
		markSheet: "",
		application: "",
		provisional: "",
		consolidate: "",
		diploma: ""
	});

	// UI state for button actions (loading + success)
	const [loading, setLoading] = useState({});
	const [success, setSuccess] = useState({});

	const runAction = (key, ms = 700) => {
		setLoading((s) => ({ ...s, [key]: true }));
		setSuccess((s) => ({ ...s, [key]: false }));
		setTimeout(() => {
			setLoading((s) => ({ ...s, [key]: false }));
			setSuccess((s) => ({ ...s, [key]: true }));
			setTimeout(() => setSuccess((s) => ({ ...s, [key]: false })), 1200);
		}, ms);
	};

	// Handlers for buttons
	const handleSet = () => {
		if (!month || !year) {
			toast.error('Please fill in both Month and Year fields');
			return;
		}
		const id = toast.loading('Changing settings...');
		runAction('set');
		setTimeout(() => {
			toast.dismiss(id);
			toast.success('Month Year Settings Successfully Changed');
		}, 1200);
	};
	const handleNominal = () => runAction("nominal");
	const handleImport = () => runAction("import");
	const handleSubject = () => runAction("subject");
	const handleTimetable = () => runAction("timetable");
	const handleClear = () => runAction("clear");
	const handleExport = async () => {
		if (!selectedTable) {
			toast.error('Please select a table to export');
			return;
		}

		try {
			// Check if the browser supports the File System Access API
			if ('showDirectoryPicker' in window) {
				// Open folder browser dialog
				const directoryHandle = await window.showDirectoryPicker();

				const id = toast.loading('Exporting to Excel...');
				runAction('export');
				setTimeout(() => {
					toast.dismiss(id);
					toast.success(`${selectedTable} exported to ${directoryHandle.name} successfully!`);
				}, 1200);
			} else {
				// Fallback for browsers that don't support the API
				const id = toast.loading('Exporting to Excel...');
				runAction('export');
				setTimeout(() => {
					toast.dismiss(id);
					toast.success(`${selectedTable} exported successfully!`);
				}, 1200);
			}
		} catch (err) {
			// User cancelled the picker
			if (err.name === 'AbortError') {
				toast.info('Export cancelled');
			} else {
				console.error('Error selecting folder:', err);
				toast.error('Failed to select folder');
			}
		}
	};
	const handleSave = () => {
		const id = toast.loading('Saving settings...');
		runAction('save');
		setTimeout(() => {
			toast.dismiss(id);
			toast.success('Saved Successfully');
		}, 1200);
	};
	const handleEditFee = () => {
		setFeeEditable(true);
		toast.info('Fee fields are now editable');
	};
	const handleSetFee = () => {
		// Check if all fee fields are filled
		if (!fees.subject || !fees.markSheet || !fees.application ||
			!fees.provisional || !fees.consolidate || !fees.diploma) {
			toast.error('Please fill in all fee fields');
			return;
		}
		const id = toast.loading('Setting fees...');
		runAction('setFee');
		setTimeout(() => {
			toast.dismiss(id);
			toast.success('Fee Settings Successfully Changed');
			setFeeEditable(false);
		}, 1200);
	};
	const handleMenuGeneration = () => runAction("menu");
	const handleClose = () => {
		toast.success('Closing exam settings');
		runAction('close');
		setTimeout(() => window.history.back(), 1000);
	};

	return (
		<section className="overlay">
			<ToastContainer
				position="top-right"
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<Sidebar />
			<div className="dashboard-main">
				<Navbar />
				<div className="dashboard-main-body">
					{/* Header */}
					<div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
						<h6 className="fw-semibold mb-0">Exam Settings</h6>
					</div>
					<div className="d-flex align-items-center justify-content-between mb-4 ExamSettings-header">
						<div className="d-flex align-items-center ExamSettings-gap-lg" style={{ flexShrink: 0 }}>
							<div className="ExamSettings-icon-wrapper">
								<Icon icon="mdi:lock" style={{ width: 18, height: 18, color: "#000000" }} />
							</div>
							<div className="security d-flex align-items-center ExamSettings-gap-lg" style={{ flexShrink: 0 }}>
								<label className="fw-semibold mb-0" style={{ fontSize: "14px", whiteSpace: "nowrap" }}>Security Code:</label>
								<input
									className="form-control ExamSettings-input ExamSettings-input-light"
									style={{ width: 120, flexShrink: 0 }}
									placeholder="Enter code"
								/>
							</div>
						</div>
						<div className="d-flex align-items-center ms-auto" style={{ gap: "16.3px", flexShrink: 0 }}>
							<div className="d-flex align-items-center ExamSettings-gap-sm" style={{ flexShrink: 0 }}>
								<div className="ExamSettings-status-dot"></div>
								<span className="text-sm" style={{ whiteSpace: "nowrap" }}>System Active</span>
							</div>
							<button onClick={handleClose} className="btn btn-outline-danger-600 radius-8 px-20 py-11" style={{ whiteSpace: "nowrap", padding: "8px 25px 10px" }}>
								CLOSE
							</button>
						</div>
					</div>

					<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
						<div className="row g-3">
							<div className="col-xxl-6 col-lg-6">
								<div className="card border-0 shadow-sm h-100 ExamSettings-card">
									<div className="card-body" style={{ padding: "24.6px 24.4px 24.8px 25px" }}>
										<div className="d-flex align-items-center mb-3 ExamSettings-gap-sm">
											<Icon icon="mdi:calendar-month" className="ExamSettings-icon" />
											<h6 className="mb-0 ExamSettings-card-title">Set Month-Year</h6>
										</div>
										<div className="d-flex flex-column ExamSettings-gap-lg">
											<div className="d-flex w-100 ExamSettings-gap-md">
												<div className="ExamSettings-form-group flex-fill" style={{ gap: "8.6px" }}>
													<label className="ExamSettings-label">Month</label>
													<select
														value={month}
														onChange={(e) => setMonth(e.target.value)}
														className="form-control ExamSettings-select ExamSettings-input-select w-100"
													>
														<option value="" disabled>select..</option>
														<option value="January">January</option>
														<option value="February">February</option>
														<option value="March">March</option>
														<option value="April">April</option>
														<option value="May">May</option>
														<option value="June">June</option>
														<option value="July">July</option>
														<option value="August">August</option>
														<option value="September">September</option>
														<option value="October">October</option>
														<option value="November">November</option>
														<option value="December">December</option>
													</select>
												</div>
												<div className="ExamSettings-form-group flex-fill" style={{ gap: "9px" }}>
													<label className="ExamSettings-label">Year</label>
													<input
														value={year}
														onChange={(e) => setYear(e.target.value)}
														className="form-control ExamSettings-input ExamSettings-input-light w-100"
														placeholder="Year"
													/>
												</div>
											</div>
											<button onClick={handleSet} className="btn btn-outline-primary-600 radius-8 px-20 py-11" style={{ padding: "8px 233px 10px", position: "relative" }}>
												{loading.set && <span className=" col-12 col-md-6 col-lg-4 position-absolute top-50 start-50 translate-middle" role="status" aria-hidden="true"></span>}
												SET
											</button>
										</div>
									</div>
								</div>
							</div>

							<div className="col-xxl-6 col-lg-6">
								<div className="card border-0 shadow-sm h-100 ExamSettings-card">
									<div className="card-body" style={{ padding: "24.6px 24.2px 57.8px 25.2px" }}>
										<div className="d-flex align-items-center mb-3 ExamSettings-gap-sm">
											<Icon icon="mdi:update" className="ExamSettings-icon" />
											<h6 className="mb-0 ExamSettings-card-title">Nominal Updation</h6>
										</div>
										<div className="d-flex flex-column ExamSettings-gap-lg">
											<div className="d-flex align-items-center ExamSettings-gap-md">
												<input
													type="checkbox"
													id="rollback"
													className="form-check-input"
													checked={rollback}
													onChange={(e) => setRollback(e.target.checked)}
													style={{ cursor: 'pointer' }}
												/>
												<label htmlFor="rollback" className="ExamSettings-label" style={{ cursor: 'pointer', marginLeft: '8px' }}>Roll Back</label>
											</div>
											<button onClick={handleNominal} className="btn btn-outline-primary-600 radius-8 px-20 py-11" style={{ fontSize: "14px", padding: "12px 211px 14px 212px", position: "relative" }}>
												{loading.nominal && <span className="col-12 col-md-6 col-lg-4 position-absolute top-50 start-50 translate-middle" role="status" aria-hidden="true"></span>}
												NOMINAL
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="row g-3">
							<div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
								<div className="card border-0 shadow-sm h-100 ExamSettings-card">
									<div className="card-body" style={{ padding: "24.8px 24.8px 55px 25px" }}>
										<div className="d-flex align-items-center mb-3 ExamSettings-gap-sm">
											<Icon icon="mdi:import" className="ExamSettings-icon" />
											<h6 className="mb-0 ExamSettings-card-title">Import</h6>
										</div>
										<div className="d-flex flex-column" style={{ gap: "11px" }}>
											<button onClick={handleImport} className="btn btn-outline-primary-600 radius-8 px-20 py-11" style={{ padding: "8px 128px 10px 127px", position: "relative" }}>
												{loading.import && <span className="col-12 col-md-6 col-lg-4 position-absolute top-50 start-50 translate-middle" role="status" aria-hidden="true"></span>}
												IMPORT
											</button>
											<button onClick={handleSubject} className="btn btn-outline-primary-600 radius-8 px-20 py-11" style={{ padding: "9px 123px", position: "relative" }}>
												{loading.subject && <span className="col-12 col-md-6 col-lg-4 position-absolute top-50 start-50 translate-middle" role="status" aria-hidden="true"></span>}
												SUBJECT
											</button>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
								<div className="card border-0 shadow-sm h-100 ExamSettings-card">
									<div className="card-body" style={{ padding: "24.8px 25px 44px 24.8px" }}>
										<div className="d-flex align-items-center mb-3 ExamSettings-gap-sm">
											<Icon icon="mdi:delete-sweep" className="ExamSettings-icon" />
											<h6 className="mb-0 ExamSettings-card-title">Clear ExamProcess</h6>
										</div>
										<div className="d-flex flex-column" style={{ gap: "11.4px" }}>
											<input
												className="form-control ExamSettings-input w-100"
												defaultValue="05-Jul-2025_FN"
												style={{ padding: "17px 195px 15px 13px", border: "1px solid #E3E8F2" }}
											/>
											<div className="d-flex w-100" style={{ gap: "7px" }}>
												<button onClick={handleTimetable} className="btn btn-outline-primary-600 radius-8 px-20 py-11" style={{ padding: "9px", position: "relative" }}>
													{loading.timetable && <span className="col-12 col-md-6 col-lg-4 position-absolute top-50 start-50 translate-middle" role="status" aria-hidden="true"></span>}
													TIMETAB
												</button>
												<button onClick={handleClear} className="btn btn-outline-danger-600 radius-8 px-20 py-11" style={{ padding: "9px", position: "relative" }}>
													{loading.clear && <span className="col-12 col-md-6 col-lg-4 position-absolute top-50 start-50 translate-middle" role="status" aria-hidden="true"></span>}
													CLEAR
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
								<div className="card border-0 shadow-sm h-100 ExamSettings-card">
									<div className="card-body" style={{ padding: "24.8px 25.2px 24.6px 24.6px" }}>
										<div className="d-flex align-items-center mb-3 ExamSettings-gap-sm">
											<Icon icon="mdi:export" className="ExamSettings-icon" />
											<h6 className="mb-0 ExamSettings-card-title">Export to Excel</h6>
										</div>
										<div className="d-flex flex-column" style={{ gap: "12.5px" }}>
											<label className="ExamSettings-label">List of Tables</label>
											<select
												className="form-control ExamSettings-select ExamSettings-input-select w-100"
												value={selectedTable}
												onChange={(e) => setSelectedTable(e.target.value)}
											>
												<option value="">select..</option>
												<option value="STUDENT">STUDENT</option>
												<option value="TheorySubject">TheorySubject</option>
												<option value="PracticalSubject">PracticalSubject</option>
												<option value="TimeTable">TimeTable</option>
												<option value="CourseDetails">CourseDetails</option>
												<option value="HallDetails">HallDetails</option>
												<option value="ExamProcess">ExamProcess</option>
												<option value="StaffDetails">StaffDetails</option>
											</select>
											<button onClick={handleExport} className="btn btn-outline-primary-600 radius-8 px-20 py-11" style={{ padding: "8px 127px 10px 126px", position: "relative" }}>
												{loading.export && <span className="col-12 col-md-6 col-lg-4 position-absolute top-50 start-50 translate-middle" role="status" aria-hidden="true"></span>}
												EXPORT
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="row g-3">
							<div className="col-12">
								<div className="card border-0 shadow-sm ExamSettings-card">
									<div className="card-body" style={{ padding: "25px 24.2px 24px 25px" }}>
										<div className="d-flex align-items-center mb-3 ExamSettings-gap-sm">
											<Icon icon="mdi:account-tie" className="ExamSettings-icon" />
											<h6 className="mb-0 ExamSettings-card-title">Chief/Addl Superintendent</h6>
										</div>
										<div className="d-flex flex-column ExamSettings-gap-lg">
											<div className="d-flex w-100 ExamSettings-gap-lg">
												<div className="ExamSettings-form-group flex-fill" style={{ gap: "9px" }}>
													<label className="ExamSettings-label">Chief Name</label>
													<input
														className="form-control ExamSettings-input ExamSettings-input-select w-100"
														value={chiefName}
														onChange={(e) => setChiefName(e.target.value)}
														placeholder="Enter name"
													/>
												</div>
												<div className="ExamSettings-form-group flex-fill" style={{ gap: "9px" }}>
													<label className="ExamSettings-label">Addl Chief 1</label>
													<input
														className="form-control ExamSettings-input ExamSettings-input-select w-100"
														placeholder="Enter name"
													/>
												</div>
												<div className="ExamSettings-form-group flex-fill" style={{ gap: "9px" }}>
													<label className="ExamSettings-label">Addl Chief 2</label>
													<input
														className="form-control ExamSettings-input ExamSettings-input-select w-100"
														placeholder="Enter name"
													/>
												</div>
												<div className="ExamSettings-form-group flex-fill" style={{ gap: "9px" }}>
													<label className="ExamSettings-label">Addl Chief 3</label>
													<input
														className="form-control ExamSettings-input ExamSettings-input-select w-100"
														placeholder="Enter name"
													/>
												</div>
											</div>
											<button onClick={handleSave} className="btn btn-outline-primary-600 radius-8 px-20 py-11" style={{ padding: "8px 32px 10px 33px", width: "fit-content", position: "relative" }}>
												{loading.save && <span className="col-12 col-md-6 col-lg-4 position-absolute top-50 start-50 translate-middle" role="status" aria-hidden="true"></span>}
												SAVE
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="row g-3">
							<div className="col-12">
								<div className="card border-0 shadow-sm ExamSettings-card">
									<div className="card-body" style={{ padding: "25.2px 24.2px 24.2px 25px" }}>
										<div className="d-flex align-items-center mb-3 ExamSettings-gap-sm">
											<Icon icon="mdi:cash" className="ExamSettings-icon" />
											<h6 className="mb-0 ExamSettings-card-title">Exam Fee Setting</h6>
										</div>
										<div className="d-flex flex-column ExamSettings-gap-lg">
											<div className="d-flex flex-wrap w-100 ExamSettings-gap-md">
												<div className="ExamSettings-form-group d-flex flex-column align-items-center flex-fill" style={{ gap: "4px" }}>
													<label className="ExamSettings-label-small text-center">Subject</label>
													<input
														className="form-control ExamSettings-input ExamSettings-input-select w-100 text-center"
														placeholder="Enter amount"
														value={fees.subject}
														onChange={(e) => setFees({ ...fees, subject: e.target.value })}
														disabled={!feeEditable}
													/>
												</div>
												<div className="ExamSettings-form-group d-flex flex-column align-items-center flex-fill" style={{ gap: "4px" }}>
													<label className="ExamSettings-label-small text-center">Mark Sheet</label>
													<input
														className="form-control ExamSettings-input ExamSettings-input-select w-100 text-center"
														placeholder="Enter amount"
														value={fees.markSheet}
														onChange={(e) => setFees({ ...fees, markSheet: e.target.value })}
														disabled={!feeEditable}
													/>
												</div>
												<div className="ExamSettings-form-group d-flex flex-column align-items-center flex-fill" style={{ gap: "4px" }}>
													<label className="ExamSettings-label-small text-center">Application</label>
													<input
														className="form-control ExamSettings-input ExamSettings-input-select w-100 text-center"
														placeholder="Enter amount"
														value={fees.application}
														onChange={(e) => setFees({ ...fees, application: e.target.value })}
														disabled={!feeEditable}
													/>
												</div>
												<div className="ExamSettings-form-group d-flex flex-column align-items-center flex-fill" style={{ gap: "4px" }}>
													<label className="ExamSettings-label-small text-center">Provisional</label>
													<input
														className="form-control ExamSettings-input ExamSettings-input-select w-100 text-center"
														placeholder="Enter amount"
														value={fees.provisional}
														onChange={(e) => setFees({ ...fees, provisional: e.target.value })}
														disabled={!feeEditable}
													/>
												</div>
												<div className="ExamSettings-form-group d-flex flex-column align-items-center flex-fill" style={{ gap: "4px" }}>
													<label className="ExamSettings-label-small text-center">Consolidate</label>
													<input
														className="form-control ExamSettings-input ExamSettings-input-select w-100 text-center"
														placeholder="Enter amount"
														value={fees.consolidate}
														onChange={(e) => setFees({ ...fees, consolidate: e.target.value })}
														disabled={!feeEditable}
													/>
												</div>
												<div className="ExamSettings-form-group d-flex flex-column align-items-center flex-fill" style={{ gap: "4px" }}>
													<label className="ExamSettings-label-small text-center">Diploma</label>
													<input
														className="form-control ExamSettings-input ExamSettings-input-select w-100 text-center"
														placeholder="Enter amount"
														value={fees.diploma}
														onChange={(e) => setFees({ ...fees, diploma: e.target.value })}
														disabled={!feeEditable}
													/>
												</div>
											</div>
											<div className="d-flex ExamSettings-gap-lg">
												<button onClick={handleEditFee} className="btn btn-outline-primary-600 radius-8 px-20 py-11" style={{ padding: "9px 16px 8px 17px", position: "relative" }}>
													Edit Fee
												</button>
												<button onClick={handleSetFee} className="btn btn-outline-primary-600 radius-8 px-20 py-11" style={{ padding: "8px 24px 10px 25px", position: "relative" }}>
													{loading.setFee && <span className="col-12 col-md-6 col-lg-4 position-absolute top-50 start-50 translate-middle" role="status" aria-hidden="true"></span>}
													SET FEE
												</button>
												<button onClick={handleMenuGeneration} className="btn btn-outline-primary-600 radius-8 px-20 py-11" style={{ padding: "8px 33px 10px", position: "relative" }}>
													{loading.menu && <span className="col-12 col-md-6 col-lg-4 position-absolute top-50 start-50 translate-middle" role="status" aria-hidden="true"></span>}
													MENU GENERATION
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

				</div>
				<Footer />
			</div>
		</section>
	);
};

export default ExamSettings;
