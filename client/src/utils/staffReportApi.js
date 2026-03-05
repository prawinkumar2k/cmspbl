import axios from "axios";

export const getStaffProfile = async (empNo) => {
  const res = await axios.get(`/api/staff/profile/${empNo}`);
  return res.data;
};

export const getStaffSubjects = async (empNo) => {
  const res = await axios.get(`/api/staff/subjects/${empNo}`);
  return res.data;
};
