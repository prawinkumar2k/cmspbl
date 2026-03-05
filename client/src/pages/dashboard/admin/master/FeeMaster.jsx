import React, { useState } from 'react';
import Sidebar from "../../../../components/Sidebar";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/footer";
import FeeMasterTable from './FeeMasterTable';

const FeeMaster = () => {
  const [formState, setFormState] = useState({ Fee_Type: '' });
  const [editId, setEditId] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const axios = (await import('axios')).default;
    if (editId) {
      await axios.put(`/api/feeMaster/${editId}`, formState);
    } else {
      await axios.post('/api/feeMaster', formState);
    }
    setFormState({ Fee_Type: '' });
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
            <h6 className="fw-semibold mb-0">Fee Master</h6>
          </div>
          <div className="card h-100 p-0 radius-12">
            <div className="card-body p-24">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label fw-semibold text-primary-light mb-8">Fee Type <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      name="Fee_Type"
                      value={formState.Fee_Type}
                      onChange={handleChange}
                      className="form-control radius-8"
                      placeholder="Enter fee type (e.g. Mess, Exam, Hostel)"
                      required
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                  <button type="submit" className="btn btn-outline-primary-600 radius-8 px-20 py-11">
                    {editId ? 'Update' : 'Save'}
                  </button>
                  {editId && (
                    <button type="button" className="btn btn-outline-secondary px-20 py-11" onClick={() => { setEditId(null); setFormState({ Fee_Type: '' }); }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
          <div className="card-body ">
            <FeeMasterTable refresh={refresh} setEditId={setEditId} setFormState={setFormState} />
          </div>
        </div>
        <Footer />
      </div>
    </section>
  );
};

export default FeeMaster;
