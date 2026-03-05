import React, { useState, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../../../../../components/Sidebar';
import Navbar from '../../../../../../components/Navbar';
import Footer from '../../../../../../components/footer';
import SendTable from './SendTable';

const INITIAL_FORM_STATE = {
  date: new Date().toISOString().split('T')[0],
  to: '',
  message: '',
  address: '',
  typeOfPost: 'Register',
  cost: ''
};

const SendLetter = () => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [showTable, setShowTable] = useState(false);
  const [refreshTable, setRefreshTable] = useState(0);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    // Required fields validation with toast messages
    if (!form.date) {
      toast.error('Date is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!form.to || !form.to.trim()) {
      toast.error('Recipient (To) is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!form.message || !form.message.trim()) {
      toast.error('Message is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!form.address || !form.address.trim()) {
      toast.error('Address is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!form.typeOfPost) {
      toast.error('Type of Post is required', { position: "top-right", autoClose: 3000 });
      return;
    }

    const costVal = parseFloat(form.cost);
    if (isNaN(costVal) || costVal <= 0) {
      toast.error('Please enter a valid cost', { position: "top-right", autoClose: 3000 });
      return;
    }
    try {
      const res = await fetch('/api/sendletters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        let errText = `Server returned ${res.status}`;
        try {
          const errBody = await res.json();
          if (errBody && errBody.message) errText = `${errText}: ${errBody.message}`;
        } catch { }
        throw new Error(errText);
      }
      toast.success('Letter sent successfully!');
      setRefreshTable(prev => prev + 1);
    } catch (err) {
      toast.error('Failed to send letter');
      console.error('Send letter error:', err);
    }
  }, [form]);

  const handleUpdate = useCallback(() => {
    // Required fields validation for update
    if (!form.to || !form.to.trim()) {
      toast.error('Recipient (To) is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!form.message || !form.message.trim()) {
      toast.error('Message is required', { position: "top-right", autoClose: 3000 });
      return;
    }

    console.log('Update Letter Form Data:', form);
    toast.success('Letter updated successfully!');

    // Refresh the table to show updated data
    setRefreshTable(prev => prev + 1);
  }, [form]);

  return (
    <>
      <ToastContainer />
      <section className="overlay">
        <Sidebar />
        <div className="dashboard-main">
          <Navbar />
          <div className="dashboard-main-body">
            {/* Breadcrumb */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Send Letter</h6>
            </div>

            {/* Main Card */}
            <div className="card h-100 p-0 radius-12">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <h6 className="text-lg fw-semibold mb-2">Send Letter</h6>
                  <span className="text-sm fw-medium text-secondary-light">
                    Fill all the fields below to send letter information
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className={`btn btn-sm ${showTable ? 'btn-success' : 'btn-outline-info'}`}
                    onClick={() => setShowTable(!showTable)}
                    title={showTable ? 'Hide Letter Table' : 'Show Letter Table'}
                  >
                    <i className={`fas ${showTable ? 'fa-eye-slash' : 'fa-table'} me-1`}></i>
                    {showTable ? 'Hide Table' : 'View Letters'}
                  </button>
                </div>
              </div>

              <div className="card-body p-24">
                <form onSubmit={handleSubmit}>
                  {/* Send Letter Form */}
                  <div className="mb-24">
                    {/* Letter Entry Form with Tan/Beige Background and Border */}
                    <div className="p-20 mb-20 rounded">
                      {/* First Row */}
                      <div className="row g-20 align-items-end mb-20">
                        {/* Date Field */}
                        <div className="col-12 col-md-6 col-lg-4">
                          <label className="form-label fw-semibold mb-8" style={{ color: '#333' }}>
                            Date <span className="text-danger">*</span>
                          </label>
                          <div className="position-relative">
                            <input
                              type="date"
                              name="date"
                              value={form.date}
                              onChange={handleChange}
                              className="form-control radius-8"
                              style={{
                                backgroundColor: 'white',
                                border: '1px solid #ddd',
                                color: '#333'
                              }}
                            />
                          </div>
                        </div>

                        {/* To Field */}
                        <div className="col-12 col-md-6 col-lg-4">
                          <label className="form-label fw-semibold mb-8" style={{ color: '#333' }}>
                            To <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="to"
                            value={form.to}
                            onChange={handleChange}
                            className="form-control radius-8"
                            placeholder="Enter recipient name"
                            style={{
                              backgroundColor: 'white',
                              border: '1px solid #ddd',
                              color: '#333'
                            }}
                          />
                        </div>

                        {/* Message Field */}
                        <div className="col-12 col-md-6 col-lg-4">
                          <label className="form-label fw-semibold mb-8" style={{ color: '#333' }}>
                            Message <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            className="form-control radius-8"
                            placeholder="Enter message"
                            style={{
                              backgroundColor: 'white',
                              border: '1px solid #ddd',
                              color: '#333'
                            }}
                          />
                        </div>
                        {/* Address Field */}
                        <div className="col-12 col-md-6 col-lg-4">
                          <label className="form-label fw-semibold mb-8" style={{ color: '#333' }}>
                            Address <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            className="form-control radius-8"
                            placeholder="Enter complete address"
                            style={{
                              backgroundColor: 'white',
                              border: '1px solid #ddd',
                              color: '#333'
                            }}
                          />
                        </div>

                        {/* Type of Post Field */}
                        <div className="col-12 col-md-6 col-lg-4">
                          <label className="form-label fw-semibold mb-8" style={{ color: '#333' }}>
                            Type of Post <span className="text-danger">*</span>
                          </label>
                          <select
                            name="typeOfPost"
                            value={form.typeOfPost}
                            onChange={handleChange}
                            className="form-select radius-8"
                            style={{
                              backgroundColor: 'white',
                              border: '1px solid #ddd',
                              color: '#333'
                            }}
                          >
                            <option value="Register">Register</option>
                            <option value="Speed Post">Speed Post</option>
                            <option value="Express">Express</option>
                            <option value="Ordinary">Ordinary</option>
                            <option value="Courier">Courier</option>
                            <option value="Parcel">Parcel</option>
                            <option value="Book Post">Book Post</option>
                          </select>
                        </div>

                        {/* Cost Field */}
                        <div className="col-12 col-md-6 col-lg-4">
                          <label className="form-label fw-semibold mb-8" style={{ color: '#333' }}>
                            Cost <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            name="cost"
                            value={form.cost}
                            onChange={handleChange}
                            className="form-control radius-8"
                            placeholder="0"
                            step="1"
                            min="0"
                            style={{
                              backgroundColor: 'white',
                              border: '1px solid #ddd',
                              color: '#333'
                            }}
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                        <button
                          type="submit"
                          className="btn btn-outline-success btn-sm"
                          title="Send letter"
                        >
                          <i className="fas fa-paper-plane me-2"></i>
                          Send
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={handleUpdate}
                          title="Update letter"
                        >
                          <i className="fas fa-edit me-2"></i>
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Send Table Section */}
            {showTable && <SendTable refreshTrigger={refreshTable} />}
          </div>

          <Footer />
        </div>
      </section>
    </>
  );
};

export default SendLetter;
