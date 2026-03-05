import React, { useState, useCallback, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../../../../../components/Sidebar';
import Navbar from '../../../../../../components/Navbar';
import Footer from '../../../../../../components/footer';
import AssetTable from './AssetTable';

const INITIAL_FORM_STATE = {
  date: new Date().toISOString().split('T')[0],
  assets: 'Land',
  description: 'Land',
  qty: '5',
  rate: '2000',
  amount: '10000'
};

const AssetEntry = () => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [showTable, setShowTable] = useState(false);
  const [refreshTable, setRefreshTable] = useState(0);
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const newForm = {
        ...prev,
        [name]: value
      };

      // Auto-calculate amount when qty or rate changes
      if (name === 'qty' || name === 'rate') {
        const qty = parseFloat(name === 'qty' ? value : newForm.qty) || 0;
        const rate = parseFloat(name === 'rate' ? value : newForm.rate) || 0;
        newForm.amount = (qty * rate).toFixed(2);
      }

      return newForm;
    });
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();

    // Required fields validation with toast messages
    if (!form.date) {
      toast.error('Date is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!form.assets || !form.assets.trim()) {
      toast.error('Asset Type is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!form.description || !form.description.trim()) {
      toast.error('Description is required', { position: "top-right", autoClose: 3000 });
      return;
    }

    const qtyVal = parseFloat(form.qty);
    const rateVal = parseFloat(form.rate);

    if (isNaN(qtyVal) || qtyVal <= 0) {
      toast.error('Please enter a valid quantity', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (isNaN(rateVal) || rateVal <= 0) {
      toast.error('Please enter a valid rate', { position: "top-right", autoClose: 3000 });
      return;
    }

    // POST to backend API to save the asset
    (async () => {
      try {
        const res = await fetch('/api/stocks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        if (!res.ok) {
          let msg = `Server returned ${res.status}`;
          try { const body = await res.json(); if (body && body.message) msg = body.message; } catch (err) { }
          throw new Error(msg);
        }
        const saved = await res.json().catch(() => null);
        toast.success('Asset entry saved to server.');
        // Refresh the table to show new data
        setRefreshTable(prev => prev + 1);
        // Reset form
        setForm(INITIAL_FORM_STATE);
      } catch (err) {
        console.error('save asset error:', err);
        toast.error('Failed to save asset to server');
      }
    })();
  }, [form]);

  const handleReset = useCallback(() => {
    setForm(INITIAL_FORM_STATE);
    toast.success('Form reset successfully!', { position: "top-right", autoClose: 2000 });
  }, []);

  // Preview & Print Logic
  const [previewData, setPreviewData] = useState(null);
  const previewRef = useRef();

  const handleGenerate = () => {
    // Validation before generating
    if (!form.date) {
      toast.error('Date is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!form.assets || !form.assets.trim()) {
      toast.error('Asset Type is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!form.description || !form.description.trim()) {
      toast.error('Description is required', { position: "top-right", autoClose: 3000 });
      return;
    }

    const qtyVal = parseFloat(form.qty);
    const rateVal = parseFloat(form.rate);

    if (isNaN(qtyVal) || qtyVal <= 0) {
      toast.error('Please enter a valid quantity', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (isNaN(rateVal) || rateVal <= 0) {
      toast.error('Please enter a valid rate', { position: "top-right", autoClose: 3000 });
      return;
    }

    const data = {
      ...form,
      qty: parseFloat(form.qty).toFixed(0),
      rate: parseFloat(form.rate).toFixed(2),
      amount: parseFloat(form.amount).toFixed(2),
      dateStr: form.date ? new Date(form.date).toLocaleDateString("en-IN") : new Date().toLocaleDateString("en-IN"),
      refNo: `ASSET/${Math.floor(Math.random() * 10000)}/${new Date().getFullYear()}`,
    };

    setPreviewData(data);
    setTimeout(() => previewRef.current?.scrollIntoView({ behavior: "smooth" }), 150);
  };

  const handlePrint = () => {
    const content = document.getElementById("asset-preview").innerHTML;
    const style = `
      @page { size: A4 portrait; margin: 10mm; }
      body { font-family: "Times New Roman"; margin: 0; }
    `;

    const win = window.open("", "_blank");

    const absoluteContent = content.replace(/src="\/([^"]*)"/g, (match, path) => {
      return `src="${window.location.origin}/${path}"`;
    }).replace(/src='\/([^']*)'/g, (match, path) => {
      return `src='${window.location.origin}/${path}'`;
    });

    win.document.write(`
      <html>
        <head><style>${style}</style></head>
        <body>${absoluteContent}</body>
      </html>
    `);

    win.document.close();
    win.onload = () => win.print();
  };

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
              <h6 className="fw-semibold mb-0">Asset Entry</h6>
            </div>

            {/* Main Card */}
            <div className="card h-100 p-0 radius-12">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <h6 className="text-lg fw-semibold mb-2">Add Asset Entry</h6>
                  <span className="text-sm fw-medium text-secondary-light">
                    Fill all the fields below to add asset information
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className={`btn btn-sm ${showTable ? 'btn-success' : 'btn-outline-info'}`}
                    onClick={() => setShowTable(!showTable)}
                    title={showTable ? 'Hide Asset Table' : 'Show Asset Table'}
                  >
                    <i className={`fas ${showTable ? 'fa-eye-slash' : 'fa-table'} me-1`}></i>
                    {showTable ? 'Hide Table' : 'View Assets'}
                  </button>
                </div>
              </div>

              <div className="card-body p-24">
                <form onSubmit={handleSubmit}>
                  {/* Asset Entry Form */}
                  <div className="mb-24">
                    <h6 className="text-lg fw-semibold mb-16 pb-8 border-bottom border-neutral-200">
                      Asset Information
                    </h6>

                    {/* Asset Entry Form Bar with Tan/Beige Background */}
                    <div className="p-20 mb-20 rounded">
                      <div className="row g-20 align-items-end">
                        {/* Date Field */}
                        <div className="col-12 col-md-6 col-lg-2">
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

                        {/* Assets Dropdown */}
                        <div className="col-12 col-md-6 col-lg-2">
                          <label className="form-label fw-semibold mb-8" style={{ color: '#333' }}>
                            Assets <span className="text-danger">*</span>
                          </label>
                          <select
                            name="assets"
                            value={form.assets}
                            onChange={handleChange}
                            className="form-select radius-8"
                            style={{
                              backgroundColor: 'white',
                              border: '1px solid #ddd',
                              color: '#333'
                            }}
                          >
                            <option value="Land">Land</option>
                            <option value="Building">Building</option>
                            <option value="Machinery">Machinery</option>
                            <option value="Equipment">Equipment</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Vehicles">Vehicles</option>
                            <option value="Computer">Computer</option>
                            <option value="Software">Software</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        {/* Description Field */}
                        <div className="col-12 col-md-6 col-lg-2">
                          <label className="form-label fw-semibold mb-8" style={{ color: '#333' }}>
                            Description <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="form-control radius-8"
                            placeholder="Enter description"
                            style={{
                              backgroundColor: 'white',
                              border: '1px solid #ddd',
                              color: '#333'
                            }}
                          />
                        </div>

                        {/* Qty Field */}
                        <div className="col-12 col-md-6 col-lg-2">
                          <label className="form-label fw-semibold mb-8" style={{ color: '#333' }}>
                            Qty <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            name="qty"
                            value={form.qty}
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

                        {/* Rate Field */}
                        <div className="col-12 col-md-6 col-lg-2">
                          <label className="form-label fw-semibold mb-8" style={{ color: '#333' }}>
                            Rate <span className="text-danger">*</span>
                          </label>
                          <input
                            type="number"
                            name="rate"
                            value={form.rate}
                            onChange={handleChange}
                            className="form-control radius-8"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            style={{
                              backgroundColor: 'white',
                              border: '1px solid #ddd',
                              color: '#333'
                            }}
                          />
                        </div>

                        {/* Amount Field (Auto-calculated) */}
                        <div className="col-12 col-md-6 col-lg-2">
                          <label className="form-label fw-semibold mb-8" style={{ color: '#333' }}>
                            Amount
                          </label>
                          <input
                            type="number"
                            name="amount"
                            value={form.amount}
                            readOnly
                            className="form-control radius-8"
                            step="0.01"
                            style={{
                              backgroundColor: '#f8f9fa',
                              border: '1px solid #ddd',
                              color: '#333'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit, Generate and Reset Buttons */}
                  <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                    <button
                      type="button"
                      className="btn btn-outline-info px-20"
                      onClick={handleGenerate}
                    >
                      <i className="fas fa-file-alt me-2"></i> Generate View
                    </button>

                    <button
                      type="submit"
                      className="btn px-32"
                      title="Submit asset entry"
                      style={{
                        backgroundColor: '#2e92e9ff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '500'
                      }}
                    >
                      <i className="fas fa-save me-2"></i>
                      SUBMIT
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-primary px-20"
                      onClick={handleReset}
                      title="Reset all fields"
                    >
                      <i className="fas fa-undo me-2"></i>
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Asset Table Section */}
            {showTable && <AssetTable refreshTrigger={refreshTable} />}

            {/* PREVIEW SECTION */}
            <div ref={previewRef} className="mt-4">
              {previewData ? (
                <div id="asset-preview" style={{ background: "#fff" }}>
                  <div
                    style={{
                      border: "2px solid #000",
                      margin: "12px auto",
                      padding: "12mm",
                      width: "210mm",
                      boxSizing: "border-box",
                      background: "#fff",
                      position: "relative",
                      fontFamily: '"Times New Roman", Times, serif'
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", borderBottom: "2px solid #000", paddingBottom: "10px", marginBottom: "15px" }}>
                      <div style={{ width: 80, flexShrink: 0, textAlign: "center" }}>
                        <img
                          src="/assets/images/GRT.png"
                          alt="logo"
                          style={{ width: 70, height: 70, objectFit: "contain" }}
                        />
                      </div>
                      <div style={{ flex: 1, textAlign: "center", paddingRight: "40px" }}>
                        <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: "0.5px", color: "#000", lineWeight: 1.1 }}>
                          GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH
                        </div>
                        <div style={{ fontSize: 10, fontWeight: 500, color: "#000", lineHeight: 1.2, marginTop: "4px" }}>
                          GRT Mahalakshmi Nagar, Chennai - Tirupati Highway, Tiruttani - 631209.
                        </div>
                        <div style={{ fontSize: 9, color: "#000", lineHeight: 1.2 }}>
                          Phone : 044-27885997 / 98 E-mail : grtper@grt.edu.in
                        </div>
                      </div>
                    </div>

                    {/* Report Title */}
                    <div style={{ textAlign: "center", fontSize: 14, fontWeight: 900, margin: "15px 0", letterSpacing: "1px", textTransform: "uppercase" }}>
                      ASSET ENTRY REPORT
                    </div>

                    <div style={{ padding: "0 10px" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
                        <tbody>
                          <tr>
                            <td style={{ fontWeight: "bold", padding: "6px", width: "30%", border: "1px solid #000" }}>Date:</td>
                            <td style={{ padding: "6px", border: "1px solid #000" }}>{previewData.dateStr}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold", padding: "6px", border: "1px solid #000" }}>Asset Type:</td>
                            <td style={{ padding: "6px", border: "1px solid #000" }}>{previewData.assets}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold", padding: "6px", border: "1px solid #000" }}>Description:</td>
                            <td style={{ padding: "6px", border: "1px solid #000" }}>{previewData.description}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold", padding: "6px", border: "1px solid #000" }}>Rate:</td>
                            <td style={{ padding: "6px", border: "1px solid #000" }}>{previewData.rate}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold", padding: "6px", border: "1px solid #000" }}>Quantity:</td>
                            <td style={{ padding: "6px", border: "1px solid #000" }}>{previewData.qty}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold", padding: "6px", border: "1px solid #000", backgroundColor: "#f2f2f2" }}>Total Amount:</td>
                            <td style={{ padding: "6px", border: "1px solid #000", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>{previewData.amount}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Signatures */}
                    <div style={{ padding: "40px 10px 10px 10px", display: 'flex', justifyContent: 'space-between', fontSize: "11px", fontWeight: "bold" }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ marginTop: "30px" }}>CHECKED BY</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ marginTop: "30px" }}>PRINCIPAL</div>
                      </div>
                    </div>

                  </div>
                </div>
              ) : null}

              {previewData && (
                <div className="d-flex justify-content-end mt-3 gap-2">
                  <button className="btn btn-outline-secondary" onClick={() => setPreviewData(null)}>
                    Clear Preview
                  </button>
                  <button className="btn btn-outline-primary" onClick={handlePrint}>
                    <i className="fas fa-print me-2" /> Print
                  </button>
                </div>
              )}
            </div>
          </div>

          <Footer />
        </div>
      </section>

      <style>{`
        #asset-preview {
          background: #fff !important;
          margin: 0 !important;
          padding: 0 !important;
          box-shadow: none !important;
          border: none !important;
          border-radius: 0 !important;
          width: 100% !important;
          max-width: none !important;
        }
        @media print {
          html, body {
            background: #fff !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body * { visibility: hidden !important; }
          #asset-preview, #asset-preview * { visibility: visible !important; }
          #asset-preview {
            position: absolute !important;
            left: 0; top: 0;
            width: 100vw !important;
            min-height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
            box-shadow: none !important;
            border: none !important;
          }
          nav, .breadcrumb, button, .btn, footer, .card { display: none !important; }
          @page { size: A4; margin: 8mm; }
        }
      `}</style>
    </>
  );
};

export default AssetEntry;
