import api from './api';

// Base endpoint
const ENDPOINT = '/studentEnquiry';
const CREATE_ENDPOINT = '/studentEnquiry/create';

// Get all student enquiries
export const getAllStudentEnquiries = async () => {
  try {
    const response = await api.get(ENDPOINT);
    return response.data;
  } catch (error) {
    console.error('Error fetching student enquiries:', error);
    throw error;
  }
};

// Get student enquiry by ID
export const getStudentEnquiryById = async (id) => {
  try {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student enquiry:', error);
    throw error;
  }
};

// Get student enquiry by serial number
export const getStudentEnquiryBySerialNo = async (serialNo) => {
  try {
    const response = await api.get(`${ENDPOINT}/serial/${serialNo}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student enquiry:', error);
    throw error;
  }
};

// Search student enquiries
export const searchStudentEnquiries = async (params) => {
  try {
    const response = await api.get(`${ENDPOINT}/search`, { params });
    return response.data;
  } catch (error) {
    console.error('Error searching student enquiries:', error);
    throw error;
  }
};

// Add new student enquiry
export const addStudentEnquiry = async (data) => {
  try {
    const response = await api.post(CREATE_ENDPOINT, data);
    return response.data;
  } catch (error) {
    console.error('Error adding student enquiry:', error);
    throw error;
  }
};

// Update student enquiry
export const updateStudentEnquiry = async (id, data) => {
  try {
    const response = await api.put(`${ENDPOINT}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating student enquiry:', error);
    throw error;
  }
};

// Delete student enquiry
export const deleteStudentEnquiry = async (id) => {
  try {
    const response = await api.delete(`${ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting student enquiry:', error);
    throw error;
  }
};

// Get statistics
export const getStudentEnquiryStatistics = async () => {
  try {
    const response = await api.get(`${ENDPOINT}/statistics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
};

// Bulk delete student enquiries
export const bulkDeleteStudentEnquiries = async (ids) => {
  try {
    const response = await api.post(`${ENDPOINT}/bulk-delete`, { ids });
    return response.data;
  } catch (error) {
    console.error('Error bulk deleting student enquiries:', error);
    throw error;
  }
};
