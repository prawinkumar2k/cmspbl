import api from "./api";

// Fetch all student master records (for application numbers)
export const fetchApplicationNos = async () => {
  // server exposes '/students' which returns all student_master rows
  const res = await api.get("/studentMaster/students");
  return res.data;
};

// Fetch a student by application number
export const fetchStudentByApplicationNo = async (applicationNo) => {
  // Server does not have a GET by applicationNo route, so fetch all and find the match
  const res = await api.get("/studentMaster/students");
  const items = res.data || [];
  const found = items.find((s) => s.Application_No === applicationNo || s.ApplicationNo === applicationNo || s.Application_No === Number(applicationNo));
  if (!found) throw new Error('Student not found');
  return found;
};
