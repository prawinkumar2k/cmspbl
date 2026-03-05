// utils/reportTemplate.js

export function generateTemplateHtmlForRows(rows = [], type = 'Stock') {
  // You can customize the header and row fields based on type
  const logo = '/assets/images/GRT.png';
  const watermark = '/assets/images/GRT.png';

  const headerHtml = `
    <div style="font-family: 'Times New Roman', Times, serif; text-align:center;">
      <img src="${logo}" style="width:120px;height:120px;object-fit:contain;vertical-align:middle;margin-right:12px;" />
      <div style="display:inline-block;vertical-align:middle;max-width:75%;">
        <div style="font-size:28px;font-weight:700;letter-spacing:0.3px;">GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH</div>
        <div style="font-size:14px;color:#1a237e;font-weight:700;margin-top:6px;">
          GRT Mahalakshmi Nagar, Chennai - Tirupati Highway, Tiruttani - 631 209.<br/>
          Phone No : 044-27885997 / 98 / 27885400 &nbsp; E-mail : grtper@grt.edu.in
        </div>
        <div style="font-size:13px;color:#222;margin-top:6px;">
          Approved by Pharmacy Council of India, New Delhi and Affiliated to T.N. Dr. MGR Medical University, Chennai
        </div>
      </div>
    </div>
    <hr style="border:none;border-top:2px solid #222;margin:12px 0;" />
  `;

  const rowsHtml = rows.map((r, idx) => {
    if (type === 'Stock') {
      // Stock row
      return `
        <div style="margin:18px 24px;padding:12px;border:1px solid #e6e6e6;border-radius:6px;page-break-inside:avoid;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <div style="font-weight:700">Stock ID: <span style="color:#b30000">${r.stockId ?? '-'}</span></div>
            <div style="font-weight:700">Date: <span style="color:#b30000">${r.date ?? '-'}</span></div>
          </div>
          <table style="width:100%;font-family: 'Times New Roman', Times, serif;border-collapse:collapse;">
            <tbody>
              <tr><td style="width:30%;padding:8px;font-weight:600">Product Name</td><td style="padding:8px;color:#b30000;font-weight:700">${r.productName}</td></tr>
              <tr><td style="padding:8px;font-weight:600">Brand</td><td style="padding:8px;color:#b30000;font-weight:700">${r.brandName}</td></tr>
              <tr><td style="padding:8px;font-weight:600">Rate</td><td style="padding:8px;color:#b30000;font-weight:700">₹${Number(r.rate||0).toFixed(2)}</td></tr>
              <tr><td style="padding:8px;font-weight:600">Quantity</td><td style="padding:8px;color:#b30000;font-weight:700">${Number(r.qty||0)} ${r.scale}</td></tr>
              <tr><td style="padding:8px;font-weight:600">Total Value</td><td style="padding:8px;color:#b30000;font-weight:700">₹${Number(r.total_value||((r.rate||0)*(r.qty||0))).toFixed(2)}</td></tr>
              <tr><td style="padding:8px;font-weight:600">Remarks</td><td style="padding:8px;">${r.remarks ?? '-'}</td></tr>
            </tbody>
          </table>
        </div>
      `;
    } else if (type === 'Purchase') {
      // Purchase row
      return `
        <div style="margin:18px 24px;padding:12px;border:1px solid #e6e6e6;border-radius:6px;page-break-inside:avoid;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <div style="font-weight:700">Purchase ID: <span style="color:#b30000">${r.purchaseId ?? '-'}</span></div>
            <div style="font-weight:700">Date: <span style="color:#b30000">${r.date ?? '-'}</span></div>
          </div>
          <table style="width:100%;font-family: 'Times New Roman', Times, serif;border-collapse:collapse;">
            <tbody>
              <tr><td style="width:30%;padding:8px;font-weight:600">Product Name</td><td style="padding:8px;color:#b30000;font-weight:700">${r.productName}</td></tr>
              <tr><td style="padding:8px;font-weight:600">Brand</td><td style="padding:8px;color:#b30000;font-weight:700">${r.brandName}</td></tr>
              <tr><td style="padding:8px;font-weight:600">Vendor</td><td style="padding:8px;color:#b30000;font-weight:700">${r.companyVendor}</td></tr>
              <tr><td style="padding:8px;font-weight:600">Bill No</td><td style="padding:8px;color:#b30000;font-weight:700">${r.billNo}</td></tr>
              <tr><td style="padding:8px;font-weight:600">Quantity</td><td style="padding:8px;color:#b30000;font-weight:700">${r.qty}</td></tr>
              <tr><td style="padding:8px;font-weight:600">Rate</td><td style="padding:8px;color:#b30000;font-weight:700">₹${Number(r.rate||0).toLocaleString()}</td></tr>
              <tr><td style="padding:8px;font-weight:600">Total Amount</td><td style="padding:8px;color:#b30000;font-weight:700">₹${Number(r.totalAmount||0).toLocaleString()}</td></tr>
            </tbody>
          </table>
        </div>
      `;
    } else if (type === 'Asset') {
      // Asset row
      return `
        <div style="margin:18px 24px;padding:12px;border:1px solid #e6e6e6;border-radius:6px;page-break-inside:avoid;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <div style="font-weight:700">Asset ID: <span style="color:#b30000">${r.assetId ?? '-'}</span></div>
            <div style="font-weight:700">Date: <span style="color:#b30000">${r.date ?? '-'}</span></div>
          </div>
          <table style="width:100%;font-family: 'Times New Roman', Times, serif;border-collapse:collapse;">
            <tbody>
              <tr><td style="width:30%;padding:8px;font-weight:600">Asset Type</td><td style="padding:8px;color:#b30000;font-weight:700">${r.assets}</td></tr>
              <tr><td style="padding:8px;font-weight:600">Description</td><td style="padding:8px;color:#b30000;font-weight:700">${r.description}</td></tr>
              <tr><td style="padding:8px;font-weight:600">Location</td><td style="padding:8px;color:#b30000;font-weight:700">${r.location}</td></tr>
              <tr><td style="padding:8px;font-weight:600">Condition</td><td style="padding:8px;color:#b30000;font-weight:700">${r.condition}</td></tr>
              <tr><td style="padding:8px;font-weight:600">Quantity</td><td style="padding:8px;color:#b30000;font-weight:700">${r.qty}</td></tr>
              <tr><td style="padding:8px;font-weight:600">Rate</td><td style="padding:8px;color:#b30000;font-weight:700">₹${Number(r.rate||0).toLocaleString()}</td></tr>
              <tr><td style="padding:8px;font-weight:600">Total Amount</td><td style="padding:8px;color:#b30000;font-weight:700">₹${Number(r.amount||0).toLocaleString()}</td></tr>
              <tr><td style="padding:8px;font-weight:600">Status</td><td style="padding:8px;">${r.status}</td></tr>
            </tbody>
          </table>
        </div>
      `;
    }
    return '';
  }).join("\n");

  const html = `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <title>${type} Report</title>
    <style>
      @media print {
        body { -webkit-print-color-adjust: exact; }
      }
      body { margin:0; padding:18px; font-family: 'Times New Roman', Times, serif; background:#fff; color:#222; }
      .watermark {
        position: fixed; left:50%; top:50%; transform:translate(-50%,-50%); opacity:0.08; z-index:0; pointer-events:none;
      }
    </style>
  </head>
  <body>
    <img src="${watermark}" class="watermark" style="width:420px;height:420px;"/>
    ${headerHtml}
    <div>
      ${rowsHtml}
    </div>
    <script>
      window.onload = function() {
        try { window.focus(); } catch(e){}
      };
    </script>
  </body>
  </html>
  `;
  return html;
}

export function generateReceiptHtml(receipt = {}) {
  const logo = '/assets/images/GRT.png';
  const watermark = '/assets/images/GRT.png';
  const fmtMoney = (v) => {
    const n = Number(v || 0);
    return '₹' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const html = `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <title>Fee Receipt</title>
    <style>
      @media print { body { -webkit-print-color-adjust: exact; } }
      body { margin:0; padding:18px; font-family: 'Times New Roman', Times, serif; background:#fff; color:#222; }
      .watermark { position: fixed; left:50%; top:50%; transform:translate(-50%,-50%); opacity:0.06; z-index:0; pointer-events:none; }
      .receipt-wrap{ border:3px solid #b8860b; padding:18px; }
      .header{ display:flex; align-items:center; gap:12px; }
      .logo{ width:120px; height:120px; object-fit:contain }
      .center{ text-align:center; flex:1 }
      .title{ font-weight:700; font-size:18px; text-transform:uppercase }
      .sub{ font-size:13px; margin-top:6px }
      table{ width:100%; margin-top:12px; border-collapse:collapse }
      td{ padding:6px; vertical-align:top }
      .label{ width:40%; font-weight:600 }
      .value{ color:#b30000; font-weight:700 }
      .footer{ margin-top:30px; display:flex; justify-content:space-between }
    </style>
  </head>
  <body>
    <img src="${watermark}" class="watermark" style="width:420px;height:420px;"/>
    <div class="receipt-wrap">
      <div class="header">
        <img src="${logo}" class="logo" />
        <div class="center">
          <div class="title">GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH</div>
          <div class="sub">GRT Mahalakshmi Nagar, Chennai - Tirupati Highway, Tiruttani - 631 209.<br/>Phone : 044-27885997 / 98 E-mail : grtper@grt.edu.in</div>
          <div style="font-size:12px;margin-top:6px;">Fee Receipt</div>
        </div>
        <div style="width:120px"></div>
      </div>

      <table>
        <tr><td class="label">Date</td><td class="value">${receipt.date || ''}</td></tr>
        <tr><td class="label">Roll / Reg No</td><td class="value">${receipt.roll_no || receipt.rollNo || ''}</td></tr>
        <tr><td class="label">Application No</td><td class="value">${receipt.application_no || ''}</td></tr>
        <tr><td class="label">Student Name</td><td class="value">${receipt.student_name || receipt.studentName || ''}</td></tr>
        <tr><td class="label">Department / Code</td><td class="value">${receipt.department || ''} / ${receipt.security_code || receipt.securityCode || ''}</td></tr>
        <tr><td class="label">Semester</td><td class="value">${receipt.sem || ''}</td></tr>
        <tr><td class="label">Academic Year</td><td class="value">${receipt.academic || ''}</td></tr>
        <tr><td class="label">Fee Type</td><td class="value">${receipt.fee_type || receipt.feeType || ''}</td></tr>
        <tr><td class="label">Total Amount</td><td class="value">${fmtMoney(receipt.total_amount || receipt.totalAmount)}</td></tr>
        <tr><td class="label">This Payment</td><td class="value">${fmtMoney(receipt.pay_now || receipt.payNow)}</td></tr>
        <tr><td class="label">Paid (Cumulative)</td><td class="value">${fmtMoney(receipt.paid_amount || receipt.paidAmount)}</td></tr>
        <tr><td class="label">Pending</td><td class="value">${fmtMoney(receipt.pending_amount || receipt.pendingAmount)}</td></tr>
        <tr><td class="label">Status</td><td class="value">${receipt.status || ''}</td></tr>
      </table>

      <div class="footer">
        <div>Signature of Student</div>
        <div>Institution Seal</div>
        <div>Signature of Principal</div>
      </div>
    </div>
    <script>window.onload = function(){ try{ window.focus(); }catch(e){} };</script>
  </body>
  </html>
  `;

  return html;
}
