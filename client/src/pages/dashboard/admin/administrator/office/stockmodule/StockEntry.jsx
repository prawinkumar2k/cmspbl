import React, { useState, useCallback, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../../../../../components/Sidebar';
import Navbar from '../../../../../../components/Navbar';
import Footer from '../../../../../../components/footer';
import StockTable from './StockTable';

/**
 * Uploaded file local path (provided by you).
 * We'll include it as a preview URL if you want to show an uploaded image.
 * Path: /mnt/data/e0a6cee1-09c7-4b51-8528-7c1e715f9d07.png
 */
const UPLOADED_FILE_URL = '/mnt/data/e0a6cee1-09c7-4b51-8528-7c1e715f9d07.png';

const INITIAL_FORM_STATE = {
  date: new Date().toISOString().split('T')[0],
  code: '',
  productName: '',
  brandName: '',
  rate: '0.00',
  qty: '0.00',
  scale: 'Bundle',
  totalValue: '0.00'
};

const StockEntry = () => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [showTable, setShowTable] = useState(false);
  const [refreshTable, setRefreshTable] = useState(0);

  // For edit flow
  const [editId, setEditId] = useState(null);
  const [stockState, setStockState] = useState(null);

  // populate form when StockTable sets stockState for editing
  useEffect(() => {
    if (stockState && editId) {
      setForm({
        date: stockState.date ? String(stockState.date).slice(0, 10) : INITIAL_FORM_STATE.date,
        code: stockState.code ?? '',
        productName: stockState.productName ?? stockState.product_name ?? '',
        brandName: stockState.brandName ?? stockState.brand_name ?? '',
        rate: (stockState.rate !== undefined && stockState.rate !== null) ? String(stockState.rate) : '0.00',
        qty: (stockState.qty !== undefined && stockState.qty !== null) ? String(stockState.qty) : '0.00',
        scale: stockState.scale ?? 'Bundle',
        totalValue: (stockState.total_value !== undefined && stockState.total_value !== null) ? String(stockState.total_value) : String((parseFloat(stockState.rate || 0) * parseFloat(stockState.qty || 0)).toFixed(2))
      });

      toast('Loaded stock for editing', { icon: '✏️' });
    }
  }, [stockState, editId]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const next = { ...prev, [name]: value };

      // auto-calc totalValue when rate or qty change
      if (name === 'rate' || name === 'qty') {
        const rate = parseFloat(name === 'rate' ? value : next.rate) || 0;
        const qty = parseFloat(name === 'qty' ? value : next.qty) || 0;
        // ensure correct two-decimal formatting
        next.totalValue = (rate * qty).toFixed(2);
      }
      return next;
    });
  }, []);

  const resetFormLocal = useCallback(() => {
    setForm(INITIAL_FORM_STATE);
    setEditId(null);
    setStockState(null);
  }, []);

  // handle image file selection


  // scan lookup (barcode or code)


  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // Required fields validation with toast messages
    if (!form.date) {
      toast.error('Date is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!form.productName || !form.productName.trim()) {
      toast.error('Product Name is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!form.brandName || !form.brandName.trim()) {
      toast.error('Brand Name is required', { position: "top-right", autoClose: 3000 });
      return;
    }

    const rateVal = parseFloat(form.rate);
    const qtyVal = parseFloat(form.qty);

    if (isNaN(rateVal) || rateVal <= 0) {
      toast.error('Please enter a valid rate', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (isNaN(qtyVal) || qtyVal <= 0) {
      toast.error('Please enter a valid quantity', { position: "top-right", autoClose: 3000 });
      return;
    }

    // Only send JSON, no image upload
    try {
      let res;
      const payload = {
        date: form.date || null,
        productName: form.productName.trim(),
        brandName: form.brandName.trim(),
        rate: Number(rateVal),
        qty: Number(qtyVal),
        scale: form.scale,
        totalValue: Number((rateVal * qtyVal).toFixed(2))
      };

      if (editId) {
        res = await fetch(`/api/stocks/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`/api/stocks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || `Server error ${res.status}`);
      }

      await res.json().catch(() => null);

      toast.success(editId ? 'Stock updated successfully!' : 'Stock entry submitted successfully!');
      setRefreshTable(prev => prev + 1);
      resetFormLocal();
    } catch (err) {
      console.error(err);
      toast.error(editId ? 'Error updating stock entry' : 'Error submitting stock entry');
    }
  }, [form, editId, resetFormLocal]);

  const handleReset = useCallback(() => {
    resetFormLocal();
    toast.success('Form reset successfully!', { position: "top-right", autoClose: 2000 });
  }, [resetFormLocal]);

  const handleCancelEdit = useCallback(() => {
    resetFormLocal();
    toast('Edit cancelled');
  }, [resetFormLocal]);

  const [previewData, setPreviewData] = useState(null);
  const previewRef = React.useRef();

  const handleGenerate = () => {
    // Validation before generating
    if (!form.date) {
      toast.error('Date is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!form.productName || !form.productName.trim()) {
      toast.error('Product Name is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!form.brandName || !form.brandName.trim()) {
      toast.error('Brand Name is required', { position: "top-right", autoClose: 3000 });
      return;
    }

    const rateVal = parseFloat(form.rate);
    const qtyVal = parseFloat(form.qty);

    if (isNaN(rateVal) || rateVal <= 0) {
      toast.error('Please enter a valid rate', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (isNaN(qtyVal) || qtyVal <= 0) {
      toast.error('Please enter a valid quantity', { position: "top-right", autoClose: 3000 });
      return;
    }

    const data = {
      ...form,
      rate: isNaN(rateVal) ? "0.00" : rateVal.toFixed(2),
      qty: isNaN(qtyVal) ? "0.00" : qtyVal.toFixed(2),
      totalValue: ((isNaN(rateVal) ? 0 : rateVal) * (isNaN(qtyVal) ? 0 : qtyVal)).toFixed(2),
      dateStr: form.date ? new Date(form.date).toLocaleDateString("en-IN") : new Date().toLocaleDateString("en-IN"),
      // Generate a dummy ref since it's a new entry preview
      refNo: `STOCK/${Math.floor(Math.random() * 10000)}/${new Date().getFullYear()}`,
    };

    setPreviewData(data);
    setTimeout(() => previewRef.current?.scrollIntoView({ behavior: "smooth" }), 150);
  };

  const handlePrint = () => {
    const content = document.getElementById("stock-preview").innerHTML;

    const style = `
      @page { size: A4 portrait; margin: 10mm; }
      body { font-family: "Times New Roman"; margin: 0; }
    `;

    const win = window.open("", "_blank");

    // Fix relative image paths
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
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Stock Entry</h6>
              <div>

              </div>
            </div>

            <div className="card h-100 p-0 radius-12">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <h6 className="text-lg fw-semibold mb-2">{editId ? 'Edit Stock Entry' : 'Add Stock Entry'}</h6>
                  <span className="text-sm fw-medium text-secondary-light">
                    Fill all the fields below to {editId ? 'update' : 'add'} stock information
                  </span>
                </div>
                <button
                  type="button"
                  className={`btn btn-sm ${showTable ? 'btn-outline-success' : 'btn-outline-info'}`}
                  onClick={() => setShowTable(prev => !prev)}
                >
                  <i className={`fas ${showTable ? 'fa-eye-slash' : 'fa-table'} me-1`}></i>
                  {showTable ? 'Hide Table' : 'View Stock'}
                </button>
              </div>

              <div className="card-body p-24">
                <form onSubmit={handleSubmit}>
                  <div className="mb-24">
                    <h6 className="text-lg fw-semibold mb-16 pb-8 border-bottom border-neutral-200">
                      Stock Information
                    </h6>

                    <div className="row g-20 mb-20">
                      <div className="col-12 col-md-6 col-lg-4">
                        <label className="form-label fw-semibold text-primary-light mb-8">Date <span className="text-danger">*</span></label>
                        <input type="date" name="date" value={form.date} onChange={handleChange} className="form-control radius-8" />
                      </div>
                      <div className="col-12 col-md-6 col-lg-4">
                        <label className="form-label fw-semibold text-primary-light mb-8">Product Name <span className="text-danger">*</span></label>
                        <input type="text" name="productName" value={form.productName} onChange={handleChange} className="form-control radius-8" placeholder="Enter product name" />
                      </div>
                      <div className="col-12 col-md-6 col-lg-4">
                        <label className="form-label fw-semibold text-primary-light mb-8">Brand Name <span className="text-danger">*</span></label>
                        <input type="text" name="brandName" value={form.brandName} onChange={handleChange} className="form-control radius-8" placeholder="Enter brand" />
                      </div>
                    </div>

                    <div className="row g-20 mb-20">
                      <div className="col-12 col-md-6 col-lg-4">
                        <label className="form-label fw-semibold text-primary-light mb-8">Rate <span className="text-danger">*</span></label>
                        <input type="number" name="rate" value={form.rate} onChange={handleChange} className="form-control radius-8" step="0.01" min="0" />
                      </div>

                      <div className="col-12 col-md-6 col-lg-4">
                        <label className="form-label fw-semibold text-primary-light mb-8">Qty <span className="text-danger">*</span></label>
                        <input type="number" name="qty" value={form.qty} onChange={handleChange} className="form-control radius-8" step="0.01" min="0" />
                      </div>

                      <div className="col-12 col-md-6 col-lg-4">
                        <label className="form-label fw-semibold text-primary-light mb-8">Scale</label>
                        <select name="scale" value={form.scale} onChange={handleChange} className="form-select radius-8">
                          <option>Bundle</option><option>Piece</option><option>Box</option><option>Packet</option>
                          <option>Kilogram</option><option>Gram</option><option>Liter</option><option>Meter</option>
                          <option>Dozen</option><option>Set</option>
                        </select>
                      </div>
                    </div>

                    <div className="row g-20 mb-20">
                      <div className="col-12 col-md-6 col-lg-4">
                        <label className="form-label fw-semibold mb-8">Total Value</label>
                        <input type="number" name="totalValue" value={form.totalValue} readOnly className="form-control radius-8 bg-neutral-50" />
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-3 mt-24 pt-24 border-top border-neutral-200">
                    {/* Generate Button to Preview */}
                    <button type="button" className="btn btn-outline-info px-20" onClick={handleGenerate}>
                      <i className="fas fa-file-alt me-2" /> Generate View
                    </button>

                    {editId ? (
                      <>
                        <button type="submit" className="btn btn-primary px-32"><i className="fas fa-save me-2" /> UPDATE</button>
                        <button type="button" className="btn btn-outline-secondary px-20" onClick={handleCancelEdit}><i className="fas fa-times me-2" /> Cancel</button>
                      </>
                    ) : (
                      <>
                        <button type="submit" className="btn btn-outline-primary px-32"><i className="fas fa-save me-2" /> SUBMIT</button>
                        <button type="button" className="btn btn-outline-secondary px-20" onClick={handleReset}><i className="fas fa-undo me-2" /> Reset</button>
                      </>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* PREVIEW SECTION */}
            <div ref={previewRef} className="mt-4">
              {previewData ? (
                <div id="stock-preview" style={{ background: "#fff" }}>
                  <div
                    style={{
                      border: "3px solid #222",
                      margin: "12px auto",
                      padding: 0,
                      maxWidth: "210mm",
                      boxSizing: "border-box",
                      background: "#fff",
                      position: "relative",
                      fontFamily: '"Times New Roman", Times, serif'
                    }}
                  >
                    {/* Header from Bonafide */}
                    <div style={{ display: "flex", alignItems: "center", marginTop: 24, flexShrink: 0 }}>
                      <div style={{ width: 140, minWidth: 140, textAlign: "center" }}>
                        <img
                          src="/assets/images/GRT.png"
                          alt="logo"
                          style={{ width: 110, height: 110, objectFit: "contain" }}
                        />
                      </div>
                      <div style={{ flex: 1, textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 1, color: "#222" }}>
                          GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: "#222" }}>
                          GRT Mahalakshmi Nagar, Chennai - Tirupati Highway, Tiruttani - 631209.
                        </div>
                        <div style={{ fontSize: 13, color: "#222" }}>
                          Phone : 044-27885997 / 98 E-mail : grtper@grt.edu.in
                        </div>
                      </div>
                      <div style={{ width: 140, minWidth: 140 }}></div>
                    </div>

                    <hr style={{ border: "none", borderTop: "2px solid #ffffffff", margin: "12px 20px", flexShrink: 0 }} />

                    {/* Content */}
                    <div style={{ textAlign: "center", fontSize: 16, fontWeight: 800, margin: "10px 0 20px 0", flexShrink: 0 }}>
                      STOCK ENTRY REPORT
                    </div>

                    <div style={{ padding: "0 40px" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
                        <tbody>
                          <tr>
                            <td style={{ fontWeight: "bold", padding: 8, width: "30%" }}>Date:</td>
                            <td style={{ padding: 8 }}>{previewData.dateStr}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold", padding: 8 }}>Product Name:</td>
                            <td style={{ padding: 8 }}>{previewData.productName}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold", padding: 8 }}>Brand Name:</td>
                            <td style={{ padding: 8 }}>{previewData.brandName}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold", padding: 8 }}>Rate:</td>
                            <td style={{ padding: 8 }}>{previewData.rate}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold", padding: 8 }}>Quantity:</td>
                            <td style={{ padding: 8 }}>{previewData.qty} {previewData.scale}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold", padding: 8 }}>Total Value:</td>
                            <td style={{ padding: 8, fontWeight: "bold" }}>{previewData.totalValue}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Signatures - Pushed to bottom */}
                    <div style={{ padding: "0 40px 40px 40px", display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginTop: '60px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <br />
                        <span>Store Keeper</span>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <br />
                        <span>Checked By</span>
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

            <div style={{ minHeight: 520, transition: 'min-height 0.2s' }}>
              {showTable && (
                <div className="card mt-4">
                  <div className="card-body p-0">
                    <StockTable
                      refreshTrigger={refreshTable}
                      setStockState={setStockState}
                      setEditId={setEditId}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <Footer />
        </div>
      </section>

      <style>{`
        #stock-preview {
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
          #stock-preview, #stock-preview * { visibility: visible !important; }
          #stock-preview {
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

export default StockEntry;
