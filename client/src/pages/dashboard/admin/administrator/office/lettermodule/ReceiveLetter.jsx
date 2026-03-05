import React, { useState, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../../../../../components/Sidebar';
import Navbar from '../../../../../../components/Navbar';
import Footer from '../../../../../../components/footer';
import RecieveTable from './ReceiveTable';

const INITIAL_FORM_STATE = {
  date: new Date().toISOString().split('T')[0],
  from: '',
  message: '',
  status: 'Confirm',
  replay: ''
};

const RecieveLetter = () => {
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

  const handleReceived = useCallback(async (e) => {
    e.preventDefault();
    // Required fields validation with toast messages
    if (!form.date) {
      toast.error('Date is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!form.from || !form.from.trim()) {
      toast.error('Sender (From) is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!form.status || !form.status.trim()) {
      toast.error('Status is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!form.replay || !form.replay.trim()) {
      toast.error('Replay is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!form.message || !form.message.trim()) {
      toast.error('Message is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    // Prepare all possible fields for backend
    const payload = {
      date: form.date,
      from: form.from,
      message: form.message,
      status: form.status,
      replay: form.replay,
      // Optional fields, can be extended as needed
      letterId: form.letterId || null,
      priority: form.priority || 'Normal',
      department: form.department || null,
      receivedDate: form.receivedDate || form.date || null,
      receivedBy: form.receivedBy || 'Admin'
    };
    try {
      const res = await fetch('/api/receiverletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        let errText = `Server returned ${res.status}`;
        try {
          const errBody = await res.json();
          if (errBody && errBody.message) errText = `${errText}: ${errBody.message}`;
        } catch { }
        throw new Error(errText);
      }
      toast.success('Letter received successfully!');
      setRefreshTable(prev => prev + 1);
    } catch (err) {
      toast.error('Failed to receive letter');
      console.error('Receive letter error:', err);
    }
  }, [form]);

  const handleUpdate = useCallback(async () => {
    // Required fields validation for update
    if (!form.from || !form.from.trim()) {
      toast.error('Sender (From) is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!form.message || !form.message.trim()) {
      toast.error('Message is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!form.id) {
      toast.error('No letter selected for update', { position: "top-right", autoClose: 3000 });
      return;
    }
    // Prepare all possible fields for backend
    const payload = {
      date: form.date,
      from: form.from,
      message: form.message,
      status: form.status,
      replay: form.replay,
      letterId: form.letterId || null,
      priority: form.priority || 'Normal',
      department: form.department || null,
      receivedDate: form.receivedDate || form.date || null,
      receivedBy: form.receivedBy || 'Admin'
    };
    try {
      const res = await fetch(`/api/receiverletter/${form.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        let errText = `Server returned ${res.status}`;
        try {
          const errBody = await res.json();
          if (errBody && errBody.message) errText = `${errText}: ${errBody.message}`;
        } catch { }
        throw new Error(errText);
      }
      toast.success('Letter updated successfully!');
      setRefreshTable(prev => prev + 1);
    } catch (err) {
      toast.error('Failed to update letter');
      console.error('Update letter error:', err);
    }
  }, [form]);

  const handleClose = useCallback(() => {
    setForm(INITIAL_FORM_STATE);
    toast.info('Form cleared and reset!', { position: "top-right", autoClose: 2000 });
  }, []);

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
              <h6 className="fw-semibold mb-0">Receive Letter</h6>
            </div>

            {/* Main Card */}
            <div className="card h-100 p-0 radius-12">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <h6 className="text-lg fw-semibold mb-2">Receive Letter</h6>
                  <span className="text-sm fw-medium text-secondary-light">
                    Fill all the fields below to receive letter information
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
                    {showTable ? 'Hide Table' : 'View Received Letters'}
                  </button>
                </div>
              </div>

              <div className="card-body p-24">
                <form onSubmit={handleReceived}>
                  {/* Receive Letter Form */}
                  <div className="mb-24">
                    <h6 className="text-lg fw-semibold mb-16 pb-8 border-bottom border-neutral-200">
                      Received Letter Information
                    </h6>

                    {/* Letter Entry Form with Tan/Beige Background and Border */}
                    <div className="p-20 mb-20 rounded">
                      {/* First Row */}
                      <div className="row g-20 align-items-end mb-20">
                        {/* Date Field */}
                        <div className="col-12 col-md-6 col-lg-3">
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
                            <i
                              className="fas fa-calendar-alt position-absolute"
                              style={{
                                right: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#666',
                                pointerEvents: 'none'
                              }}
                            ></i>
                          </div>
                        </div>

                        {/* From Field */}
                        <div className="col-12 col-md-6 col-lg-3">
                          <label className="form-label fw-semibold mb-8" style={{ color: '#333' }}>
                            From <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="from"
                            value={form.from}
                            onChange={handleChange}
                            className="form-control radius-8"
                            placeholder="Enter sender name"
                            style={{
                              backgroundColor: 'white',
                              border: '1px solid #ddd',
                              color: '#333'
                            }}
                          />
                        </div>
                        {/* Status Field */}
                        <div className="col-12 col-md-6 col-lg-3">
                          <label className="form-label fw-semibold mb-8" style={{ color: '#333' }}>
                            Status <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="form-control radius-8"
                            placeholder="Enter status"
                            style={{
                              backgroundColor: 'white',
                              border: '1px solid #ddd',
                              color: '#333'
                            }}
                          />
                        </div>

                        {/* Replay Field */}
                        <div className="col-12 col-md-6 col-lg-3">
                          <label className="form-label fw-semibold mb-8" style={{ color: '#333' }}>
                            Replay <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="replay"
                            value={form.replay}
                            onChange={handleChange}
                            className="form-control radius-8"
                            placeholder="Enter replay"
                            style={{
                              backgroundColor: 'white',
                              border: '1px solid #ddd',
                              color: '#333'
                            }}
                          />
                        </div>

                        {/* Message Field */}
                        <div className="col-12">
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
                      </div>
                      {/* Received Button */}
                      <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                        <button
                          type="submit"
                          className="btn btn-outline-success btn-sm"
                          title="Mark as received"
                        >
                          <i className="fas fa-check me-2"></i>
                          RECEIVED
                        </button>
                        {/* Action Buttons */}
                        <button
                          type="submit"
                          className="btn btn-outline-primary btn-sm"
                          title="Submit letter"
                        >
                          <i className="fas fa-paper-plane me-2"></i>
                          SUBMIT
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Receive Table Section */}
            {showTable && <RecieveTable refreshTrigger={refreshTable} />}
          </div>

          <Footer />
        </div>
      </section>
    </>
  );
};

export default RecieveLetter;
