import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../../../../components/Sidebar";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/footer";
import DesignationMasterTable from './DesignationMasterTable';

const DesignationMaster = () => {
  const [formState, setFormState] = useState({ Designation: '' });
  const [editId, setEditId] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [designations, setDesignations] = useState([]);

  // Fetch all designations on component mount
  React.useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const res = await fetch('/api/designationMaster');
        const data = await res.json();
        setDesignations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching designations:', error);
      }
    };
    fetchDesignations();
  }, [refresh]);

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if designation already exists (case-insensitive)
    const designationExists = designations.some(d => 
      d.Designation.toLowerCase().trim() === formState.Designation.toLowerCase().trim() &&
      d.id !== editId // Exclude current record if editing
    );

    if (designationExists) {
      toast.error('This designation already exists!', { autoClose: 2000 });
      return;
    }
    
    const axios = (await import('axios')).default;
    try {
      if (editId) {
        await axios.put(`/api/designationMaster/${editId}`, formState);
        toast.success('Designation updated successfully!', { autoClose: 2000 });
      } else {
        await axios.post('/api/designationMaster', formState);
        toast.success('Designation saved successfully!', { autoClose: 2000 });
      }
      setFormState({ Designation: '' });
      setEditId(null);
      setRefresh(r => r + 1);
    } catch (error) {
      toast.error('Error: Failed to save designation');
      console.error('Error:', error);
    }
  };

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
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
            <h6 className="fw-semibold mb-0">Designation Master</h6>
          </div>
          <div className="card h-100 p-0 radius-12">
            <div className="card-body p-24">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold text-primary-light mb-8">Designation <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      name="Designation"
                      value={formState.Designation}
                      onChange={handleChange}
                      className="form-control radius-8"
                      placeholder="Enter designation (e.g. Tutor, Lecturer)"
                      required
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                  <button type="submit" className="btn btn-outline-primary-600 radius-8 px-20 py-11">
                    {editId ? 'Update' : 'Save'}
                  </button>
                  {editId && (
                    <button type="button" className="btn btn-outline-secondary px-20 py-11" onClick={() => { setEditId(null); setFormState({ Designation: '' }); }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
          <div className="card-body ">
            <DesignationMasterTable refresh={refresh} setEditId={setEditId} setFormState={setFormState} />
          </div>
        </div>
        <Footer />
      </div>
    </section>
    </>
  );
};

export default DesignationMaster;
