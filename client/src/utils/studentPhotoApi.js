// client/src/utils/studentPhotoApi.js
const BASE_URL = '/api/studentPhoto';

export async function fetchStudentPhotos() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch student photos');
  return res.json();
}

export async function createStudentPhoto(data) {
  const formData = new FormData();
  formData.append('branch', data.branch);
  formData.append('branchCode', data.branchCode);
  formData.append('year', data.year);
  formData.append('studentRegNo', data.studentRegNo);
  formData.append('studentName', data.studentName);
  formData.append('photoPath', data.photoPath);
  formData.append('uploadDate', data.uploadDate);
  if (data.photoFile) formData.append('photoFile', data.photoFile);

  const res = await fetch(`${BASE_URL}/create`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to create photo record');
  return res.json();
}

export async function updateStudentPhoto(id, data) {
  const formData = new FormData();
  formData.append('branch', data.branch);
  formData.append('branchCode', data.branchCode);
  formData.append('year', data.year);
  formData.append('studentRegNo', data.studentRegNo);
  formData.append('studentName', data.studentName);
  formData.append('photoPath', data.photoPath);
  formData.append('uploadDate', data.uploadDate);
  if (data.photoFile) formData.append('photoFile', data.photoFile);

  const res = await fetch(`${BASE_URL}/update/${id}`, {
    method: 'PUT',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to update photo record');
  return res.json();
}

export async function deleteStudentPhoto(id) {
  const res = await fetch(`${BASE_URL}/delete/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete photo record');
  return res.json();
}
