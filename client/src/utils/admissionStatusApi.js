import { buildApiUrl } from './apiBase';

export const fetchAdmissionDashboard = async () => {
  const res = await fetch(buildApiUrl('/dashboard/admission-status'));
  if (!res.ok) throw new Error('Failed to fetch dashboard data');
  return res.json();
};
