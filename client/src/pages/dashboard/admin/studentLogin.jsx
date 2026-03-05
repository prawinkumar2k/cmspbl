import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/footer";
import { Edit2, Save, X, Key } from "lucide-react";
import DataTable from "../../../components/DataTable/DataTable";

const StudentLogin = () => {
	const [students, setStudents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editingId, setEditingId] = useState(null);
	const [editPassword, setEditPassword] = useState("");

	useEffect(() => {
		fetchStudents();
	}, []);

	const fetchStudents = async () => {
		try {
			const response = await axios.get("/api/student-login");
			setStudents(response.data);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching students:", error);
			toast.error("Failed to fetch students");
			setLoading(false);
		}
	};

	const handleEdit = (student) => {
		setEditingId(student.Id);
		setEditPassword(student.password || "");
	};

	const handleCancel = () => {
		setEditingId(null);
		setEditPassword("");
	};

	const handleSave = async (id) => {
		if (!editPassword) {
			toast.error("Password cannot be empty");
			return;
		}

		try {
			const response = await axios.put(`/api/student-login/update-password/${id}`, {
				password: editPassword,
			});

			if (response.data.success) {
				toast.success("Password updated successfully");
				setEditingId(null);
				fetchStudents(); // Refresh the list
			}
		} catch (error) {
			console.error("Error updating password:", error);
			toast.error("Failed to update password");
		}
	};

	const columns = [
		{
			header: "Dept Name",
			accessorKey: "Dept_Name",
		},
		{
			header: "Dept Code",
			accessorKey: "Dept_Code",
		},
		{
			header: "Semester",
			accessorKey: "Semester",
		},
		{
			header: "Year",
			accessorKey: "Year",
		},
		{
			header: "Student Name",
			accessorKey: "Student_Name",
		},
		{
			header: "Register Number",
			accessorKey: "Register_Number",
		},
		{
			header: "Password",
			accessorKey: "password",
			cell: ({ row }) => {
				const student = row.original;
				const isEditing = editingId === student.Id;

				return isEditing ? (
					<input
						type="text"
						className="form-control form-control-sm"
						value={editPassword}
						onChange={(e) => setEditPassword(e.target.value)}
						autoFocus
						onClick={(e) => e.stopPropagation()}
					/>
				) : (
					<div className="d-flex align-items-center gap-2">
						<Key size={14} className="text-muted" />
						<span>{student.password || "N/A"}</span>
					</div>
				);
			},
		},
		{
			id: "custom-actions",
			header: "Actions",
			cell: ({ row }) => {
				const student = row.original;
				const isEditing = editingId === student.Id;

				return (
					<div className="d-flex align-items-center gap-2">
						{isEditing ? (
							<>
								<button
									className="btn btn-sm btn-outline-success p-1 d-flex align-items-center justify-content-center"
									onClick={() => handleSave(student.Id)}
									title="Save"
								>
									<Save size={16} />
								</button>
								<button
									className="btn btn-sm btn-outline-danger p-1 d-flex align-items-center justify-content-center"
									onClick={handleCancel}
									title="Cancel"
								>
									<X size={16} />
								</button>
							</>
						) : (
							<button
								className="btn btn-sm btn-outline-primary p-1 d-flex align-items-center justify-content-center"
								onClick={() => handleEdit(student)}
								title="Edit Password"
							>
								<Edit2 size={16} />
							</button>
						)}
					</div>
				);
			},
		},
	];

	return (
		<>
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
			<section className="overlay">
				<Sidebar />
				<div className="dashboard-main">
					<Navbar />
					<div className="dashboard-main-body">
						<div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
							<h6 className="fw-semibold mb-0">Student Login Management</h6>
							<ul className="d-flex align-items-center gap-2">
								<li className="fw-medium">
									<a href="/admin/adminDashboard" className="d-flex align-items-center gap-1 hover-text-primary">
										<iconify-icon icon="solar:home-smile-angle-outline" className="icon text-lg" />
										Dashboard
									</a>
								</li>
								<li>-</li>
								<li className="fw-medium">Student Login</li>
							</ul>
						</div>

						<div className="card h-100 p-0 radius-12 overflow-hidden shadow-sm border-0">
							<div className="card-body p-0">
								<DataTable
									title="Admitted Students Login Details"
									data={students}
									columns={columns}
									loading={loading}
									enableActions={false}
									enableSelection={false}
									pageSize={10}
								/>
							</div>
						</div>
					</div>
					<Footer />
				</div>
			</section>

			<style>{`
        .btn-success-600 {
          background-color: #16a34a;
          color: white;
          border: none;
        }
        .btn-success-600:hover {
          background-color: #15803d;
          color: white;
        }
        .btn-danger-600 {
          background-color: #dc2626;
          color: white;
          border: none;
        }
        .btn-danger-600:hover {
          background-color: #b91c1c;
          color: white;
        }
        .btn-primary-600 {
          background-color: #487fff;
          color: white;
          border: none;
        }
        .btn-primary-600:hover {
          background-color: #3b66cc;
          color: white;
        }
        .hover-text-primary:hover {
          color: #487fff !important;
        }
      `}</style>
		</>
	);
};

export default StudentLogin;
