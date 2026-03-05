import React, { useState, useCallback, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../../../../../components/Sidebar';
import Navbar from '../../../../../../components/Navbar';
import Footer from '../../../../../../components/footer';
import PurchaseTable from './PurchaseTable';

const INITIAL_FORM_STATE = {
  date: new Date().toISOString().split('T')[0],
  productName: '',
  brandName: '',
  companyVendor: '',
  purchaseOrderNo: '',
  orderDate: new Date().toISOString().split('T')[0],
  dcNo: '',
  billNo: '',
  billDate: new Date().toISOString().split('T')[0],
  qty: '',
  rate: '',
  totalAmount: ''
};

const PurchaseEntry = () => {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [showTable, setShowTable] = useState(false);
  const [refreshTable, setRefreshTable] = useState(0);

  // For edit flow
  const [editId, setEditId] = useState(null);
  const [purchaseState, setPurchaseState] = useState(null);

  // Populate form when PurchaseTable sets purchaseState for editing
  useEffect(() => {
    if (purchaseState && editId) {
      setForm(prev => {
        const normalized = {
          date: purchaseState.date ?? prev.date,
          productName: purchaseState.productName ?? purchaseState.product_name ?? prev.productName,
          brandName: purchaseState.brandName ?? purchaseState.brand_name ?? prev.brandName,
          companyVendor: purchaseState.companyVendor ?? purchaseState.company_vendor ?? prev.companyVendor,
          purchaseOrderNo: purchaseState.purchaseOrderNo ?? purchaseState.purchase_order_no ?? prev.purchaseOrderNo,
          orderDate: purchaseState.orderDate ?? purchaseState.order_date ?? prev.orderDate,
          dcNo: purchaseState.dcNo ?? purchaseState.dc_no ?? prev.dcNo,
          billNo: purchaseState.billNo ?? purchaseState.bill_no ?? prev.billNo,
          billDate: purchaseState.billDate ?? purchaseState.bill_date ?? prev.billDate,
          qty: String(purchaseState.qty ?? purchaseState.quantity ?? prev.qty),
          rate: String(purchaseState.rate ?? prev.rate),
          // ...existing code...
          totalAmount: String(purchaseState.totalAmount ?? purchaseState.total_amount ?? prev.totalAmount)
        };

        return normalized;
      });

      toast('Loaded purchase for editing', { icon: '✏️' });
    }
  }, [purchaseState, editId]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    setForm(prev => {
      const newForm = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };

      if (['qty', 'rate'].includes(name)) {
        const qty = parseFloat(name === 'qty' ? value : newForm.qty) || 0;
        const rate = parseFloat(name === 'rate' ? value : newForm.rate) || 0;
        let total = qty * rate;
        newForm.totalAmount = total.toFixed(2);
      }

      return newForm;
    });
  }, []);

  const resetFormLocal = useCallback(() => {
    setForm(INITIAL_FORM_STATE);
    setEditId(null);
    setPurchaseState(null);
  }, []);

  const handleSubmit = useCallback((e) => {
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
    if (!form.companyVendor || !form.companyVendor.trim()) {
      toast.error('Company/Vendor is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!form.purchaseOrderNo || !form.purchaseOrderNo.trim()) {
      toast.error('Purchase Order No is required', { position: "top-right", autoClose: 3000 });
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

    const payload = {
      date: form.date,
      productName: form.productName,
      brandName: form.brandName,
      companyVendor: form.companyVendor,
      purchaseOrderNo: form.purchaseOrderNo,
      orderDate: form.orderDate,
      dcNo: form.dcNo,
      billNo: form.billNo,
      billDate: form.billDate,
      qty: parseFloat(form.qty),
      rate: parseFloat(form.rate),
      totalAmount: parseFloat(form.totalAmount) || 0
    };

    const submit = async () => {
      try {
        let response;
        if (editId) {
          response = await fetch(`/api/purchases/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } else {
          response = await fetch('/api/purchases', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }

        if (!response.ok) {
          const text = await response.text().catch(() => null);
          throw new Error(text || 'Failed to submit purchase entry');
        }

        toast.success(editId ? 'Purchase updated successfully!' : 'Purchase entry submitted successfully!');

        setRefreshTable(prev => prev + 1);
        resetFormLocal();
      } catch (err) {
        console.error(err);
        toast.error(editId ? 'Error updating purchase entry' : 'Error submitting purchase entry');
      }
    };

    submit();
  }, [form, editId, resetFormLocal]);

  const handleReset = useCallback(() => {
    resetFormLocal();
    toast.success('Form reset successfully!', { position: "top-right", autoClose: 2000 });
  }, [resetFormLocal]);

  const handleCancelEdit = useCallback(() => {
    resetFormLocal();
    toast('Edit cancelled');
  }, [resetFormLocal]);

  // Preview & Print Logic
  const [previewData, setPreviewData] = useState(null);
  const previewRef = useRef();

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
    if (!form.companyVendor || !form.companyVendor.trim()) {
      toast.error('Company/Vendor is required', { position: "top-right", autoClose: 3000 });
      return;
    }
    if (!form.purchaseOrderNo || !form.purchaseOrderNo.trim()) {
      toast.error('Purchase Order No is required', { position: "top-right", autoClose: 3000 });
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
      qty: parseFloat(form.qty).toFixed(2),
      rate: parseFloat(form.rate).toFixed(2),
      totalAmount: parseFloat(form.totalAmount).toFixed(2),
      dateStr: form.date ? new Date(form.date).toLocaleDateString("en-IN") : new Date().toLocaleDateString("en-IN"),
      // Dummy ref for preview if needed
      refNo: `PUR/${Math.floor(Math.random() * 10000)}/${new Date().getFullYear()}`,
    };

    setPreviewData(data);
    setTimeout(() => previewRef.current?.scrollIntoView({ behavior: "smooth" }), 150);
  };

  const handlePrint = () => {
    const content = document.getElementById("purchase-preview").innerHTML;
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
            {/* Breadcrumb */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
              <h6 className="fw-semibold mb-0">Purchase Entry</h6>
            </div>

            {/* Main Card */}
            <div className="card h-100 p-0 radius-12">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-3">
                <div>
                  <h6 className="text-lg fw-semibold mb-2">{editId ? 'Edit Purchase Entry' : 'Add Purchase Entry'}</h6>
                  <span className="text-sm fw-medium text-secondary-light">
                    Fill all the fields below to {editId ? 'update' : 'add'} purchase information
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className={`btn btn-sm ${showTable ? 'btn-success' : 'btn-outline-info'}`}
                    onClick={() => setShowTable(prev => !prev)}
                    title={showTable ? 'Hide Purchase Table' : 'Show Purchase Table'}
                  >
                    <i className={`fas ${showTable ? 'fa-eye-slash' : 'fa-table'} me-1`}></i>
                    {showTable ? 'Hide Table' : 'View Purchases'}
                  </button>
                </div>
              </div>

              <div className="card-body p-24">
                <form onSubmit={handleSubmit}>
                  {/* Purchase Entry Form */}
                  <div className="mb-24">
                    <h6 className="text-lg fw-semibold mb-16 pb-8 border-bottom border-neutral-200">
                      Purchase Information
                    </h6>

                    {/* First Row - Basic Information */}
                    <div className="row g-20 mb-20">
                      <div className="col-12 col-md-6 col-lg-3">
                        <label className="form-label fw-semibold text-primary-light mb-8">
                          Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          name="date"
                          value={form.date}
                          onChange={handleChange}
                          className="form-control radius-8"
                        />
                      </div>

                      <div className="col-12 col-md-6 col-lg-3">
                        <label className="form-label fw-semibold text-primary-light mb-8">
                          Product Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="productName"
                          value={form.productName}
                          onChange={handleChange}
                          className="form-control radius-8"
                          placeholder="Enter product name"
                        />
                      </div>

                      <div className="col-12 col-md-6 col-lg-3">
                        <label className="form-label fw-semibold text-primary-light mb-8">
                          Brand Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="brandName"
                          value={form.brandName}
                          onChange={handleChange}
                          className="form-control radius-8"
                          placeholder="Enter brand name"
                        />
                      </div>

                      <div className="col-12 col-md-6 col-lg-3">
                        <label className="form-label fw-semibold text-primary-light mb-8">
                          Company/Vendor <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="companyVendor"
                          value={form.companyVendor}
                          onChange={handleChange}
                          className="form-control radius-8"
                          placeholder="Enter vendor name"
                        />
                      </div>
                    </div>

                    {/* Second Row - Order & Bill Information */}
                    <div className="row g-20 mb-20">
                      <div className="col-12 col-md-6 col-lg-3">
                        <label className="form-label fw-semibold text-primary-light mb-8">
                          Purchase Order No <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="purchaseOrderNo"
                          value={form.purchaseOrderNo}
                          onChange={handleChange}
                          className="form-control radius-8"
                          placeholder="Enter PO number"
                        />
                      </div>

                      <div className="col-12 col-md-6 col-lg-3">
                        <label className="form-label fw-semibold text-primary-light mb-8">
                          Order Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          name="orderDate"
                          value={form.orderDate}
                          onChange={handleChange}
                          className="form-control radius-8"
                        />
                      </div>

                      <div className="col-12 col-md-6 col-lg-3">
                        <label className="form-label fw-semibold text-primary-light mb-8">
                          D.C. No
                        </label>
                        <input
                          type="text"
                          name="dcNo"
                          value={form.dcNo}
                          onChange={handleChange}
                          className="form-control radius-8"
                          placeholder="Enter DC number"
                        />
                      </div>

                      <div className="col-12 col-md-6 col-lg-3">
                        <label className="form-label fw-semibold text-primary-light mb-8">
                          Bill No
                        </label>
                        <input
                          type="text"
                          name="billNo"
                          value={form.billNo}
                          onChange={handleChange}
                          className="form-control radius-8"
                          placeholder="Enter bill number"
                        />
                      </div>
                    </div>

                    {/* Third Row - Pricing & Quantity Information */}
                    <div className="row g-20 mb-20">
                      <div className="col-12 col-md-6 col-lg-3">
                        <label className="form-label fw-semibold text-primary-light mb-8">
                          Bill Date
                        </label>
                        <input
                          type="date"
                          name="billDate"
                          value={form.billDate}
                          onChange={handleChange}
                          className="form-control radius-8"
                        />
                      </div>

                      <div className="col-12 col-md-6 col-lg-3">
                        <label className="form-label fw-semibold text-primary-light mb-8">
                          Qty <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          name="qty"
                          value={form.qty}
                          onChange={handleChange}
                          className="form-control radius-8"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </div>

                      <div className="col-12 col-md-6 col-lg-3">
                        <label className="form-label fw-semibold text-primary-light mb-8">
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
                        />
                      </div>

                      <div className="col-12 col-md-6 col-lg-3">
                        <label className="form-label fw-semibold text-primary-light mb-8">
                          Total Amount
                        </label>
                        <input
                          type="number"
                          name="totalAmount"
                          value={form.totalAmount}
                          readOnly
                          className="form-control radius-8 bg-neutral-50"
                          step="0.01"
                        />
                      </div>
                    </div>


                  </div>

                  {/* Submit and Reset Buttons */}
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
                      className="btn btn-primary px-32"
                      title="Submit purchase entry"
                    >
                      <i className="fas fa-save me-2"></i>
                      SUBMIT
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-20"
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

            {/* PREVIEW SECTION */}
            <div ref={previewRef} className="mt-4">
              {previewData ? (
                <div id="purchase-preview" style={{ background: "#fff" }}>
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
                      PURCHASE ENTRY REPORT
                    </div>

                    <div style={{ padding: "0 10px" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
                        <tbody>
                          <tr>
                            <td style={{ fontWeight: "bold", padding: "6px", width: "30%", border: "1px solid #000" }}>Date:</td>
                            <td style={{ padding: "6px", border: "1px solid #000" }}>{previewData.dateStr}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold", padding: "6px", border: "1px solid #000" }}>Product Name:</td>
                            <td style={{ padding: "6px", border: "1px solid #000" }}>{previewData.productName}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold", padding: "6px", border: "1px solid #000" }}>Brand Name:</td>
                            <td style={{ padding: "6px", border: "1px solid #000" }}>{previewData.brandName}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold", padding: "6px", border: "1px solid #000" }}>Vendor:</td>
                            <td style={{ padding: "6px", border: "1px solid #000" }}>{previewData.companyVendor}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold", padding: "6px", border: "1px solid #000" }}>PO No:</td>
                            <td style={{ padding: "6px", border: "1px solid #000" }}>{previewData.purchaseOrderNo}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold", padding: "6px", border: "1px solid #000" }}>Bill No:</td>
                            <td style={{ padding: "6px", border: "1px solid #000" }}>{previewData.billNo || '-'}</td>
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
                            <td style={{ padding: "6px", border: "1px solid #000", fontWeight: "bold", backgroundColor: "#f2f2f2" }}>{previewData.totalAmount}</td>
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

            {/* Purchase Table Section */}
            {showTable && (
              <PurchaseTable
                refreshTrigger={refreshTable}
                setPurchaseState={setPurchaseState}
                purchaseState={purchaseState}
                setEditId={setEditId}
              />
            )}
          </div>

          <Footer />
        </div>
      </section>

      <style>{`
        #purchase-preview {
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
          #purchase-preview, #purchase-preview * { visibility: visible !important; }
          #purchase-preview {
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

export default PurchaseEntry;
