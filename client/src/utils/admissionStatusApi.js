export const fetchAdmissionDashboard = async () => {
  const res = await fetch('http://localhost:5000/api/dashboard/admission-status');
  if (!res.ok) throw new Error('Failed to fetch dashboard data');
  return res.json();
};
