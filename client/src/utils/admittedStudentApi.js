import axios from "axios";

// Create a new student record
export async function createStudent(data) {
	const res = await axios.post("/api/admittedStudent/create", data);
	return res.data;
}

// Update an existing student record
export async function updateStudent(id, data) {
	const res = await axios.put(`/api/admittedStudent/update/${id}`, data);
	return res.data;
}

// Delete a student record
export async function deleteStudent(id) {
	const res = await axios.delete(`/api/admittedStudent/delete/${id}`);
	return res.data;
}
