import React, { useState } from 'react';
import Sidebar from "../../../../components/Sidebar";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/footer";
import AcademicYearMasterTable from './academicYearMasterTable';

const AcademicYearMaster = () => {
  const [formState, setFormState] = useState({ Academic_Year: '' });
  const [editId, setEditId] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const axios = (await import('axios')).default;
    if (editId) {
      await axios.put(`/api/academicYearMaster/${editId}`, formState);
    } else {
      await axios.post('/api/academicYearMaster', formState);
    }
    setFormState({ Academic_Year: '' });
    setEditId(null);
    setRefresh(r => r + 1);
  };

  return (
    <section className="overlay">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-main-body">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
            <h6 className="fw-semibold mb-0">Academic Year Master</h6>
          </div>
          <div className="card h-100 p-0 radius-12">
            <div className="card-body p-24">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold text-primary-light mb-8">Academic Year <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      name="Academic_Year"
                      value={formState.Academic_Year}
                      onChange={handleChange}
                      className="form-control radius-8"
                      placeholder="Enter academic year (e.g. 2025-2026)"
                      required
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                  <button type="submit" className="btn btn-outline-primary-600 radius-8 px-20 py-11">
                    {editId ? 'Update' : 'Save'}
                  </button>
                  {editId && (
                    <button type="button" className="btn btn-outline-secondary px-20 py-11" onClick={() => { setEditId(null); setFormState({ Academic_Year: '' }); }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
          <div className="card-body ">
            <AcademicYearMasterTable refresh={refresh} setEditId={setEditId} setFormState={setFormState} />
          </div>
        </div>
        <Footer />
      </div>
    </section>
  );
};

export default AcademicYearMaster;
