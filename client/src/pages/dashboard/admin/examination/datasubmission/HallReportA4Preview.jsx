import React from "react";

const HallReportA4Preview = React.forwardRef(({ data }, ref) => {
  if (!data || data.length === 0) return (
    <div style={{ textAlign: 'center', padding: 40 }}>No hall data found.</div>
  );
  let sno = 1;

  // Calculate total capacity
  const totalCapacity = data.reduce((sum, row) => sum + (parseInt(row.capacity) || 0), 0);

  const LOGO_SRC = '/public/assets/images/GRT.png';

  return (
    <div className="nominal-roll-a4-container" ref={ref} style={{ width: '100%', minHeight: '297mm', margin: '0 auto', background: '#fff', overflow: 'auto', position: 'relative' }}>
      <style>{`
        @media print {
          html, body { margin: 0 !important; padding: 0 !important; height: 100%; }
          .sidebar, .navbar, .footer, .dashboard-main-body > .card, .dashboard-main-body > .d-flex, .print-hide, .btn, button, .cd-table-container, .mb-4, .gap-2, .gap-3, .Toaster { display: none !important; }
          .dashboard-main-body { padding: 0 !important; }
          body * { visibility: hidden !important; }
          .nominal-roll-a4-container, .nominal-roll-a4-container * { visibility: visible !important; }
          .nominal-roll-a4-container {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 10mm !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            background: #fff !important;
            z-index: 9999 !important;
          }
          .nominal-roll-a4-border { 
            border: 2px solid #000 !important; 
            box-sizing: border-box !important; 
            width: 100%; 
            height: 100%; 
            padding: 12px !important;
          }
          .nominal-roll-table th, .nominal-roll-table td { font-size: 11px !important; border: 1.5px solid #000 !important; }
          .nominal-roll-table th { background: #f2f2f2 !important; }
        }
        @page { size: A4 portrait; margin: 0; }
        .nominal-roll-a4-container { font-family: 'Times New Roman', Times, serif; }
        .nominal-roll-a4-border { border: 2px solid #000; box-sizing: border-box; width: 100%; padding: 12px; height: 100%; display: flex; flex-direction: column; }
        .nominal-roll-a4-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; gap: 10px; }
        .nominal-roll-a4-logo { width: 80px; height: 80px; object-fit: contain; flex-shrink: 0; }
        .nominal-roll-a4-header-center { flex: 1; text-align: center; }
        .nominal-roll-a4-college-name { font-size: 18px; font-weight: 900; letter-spacing: 0.5px; color: #000; line-height: 1.1; }
        .nominal-roll-a4-college-addr { font-size: 11px; font-weight: 500; color: #000; line-height: 1.2; margin-top: 2px; }
        .nominal-roll-a4-college-info { font-size: 10px; color: #000; line-height: 1.2; }
        .nominal-roll-a4-title { font-size: 15px; font-weight: 900; letter-spacing: 0.8px; margin: 10px 0; text-align: center; }
        .nominal-roll-table { width: 100%; border-collapse: collapse; margin-top: 5px; table-layout: fixed; }
        .nominal-roll-table th, .nominal-roll-table td { border: 1.5px solid #000; padding: 4px; text-align: center; font-size: 11px; }
        .nominal-roll-table th { background: #f2f2f2; font-weight: bold; font-size: 10px; }
        .nominal-roll-a4-footer { margin-top: auto; padding-top: 15px; text-align: right; font-size: 11px; padding-right: 20px; }
      `}</style>
      <div className="nominal-roll-a4-border">
        {/* Header */}
        <div className="nominal-roll-a4-header">
          <div style={{ width: '80px', textAlign: 'center', flexShrink: 0 }}>
            <img src={LOGO_SRC} alt="logo" className="nominal-roll-a4-logo" />
          </div>
          <div className="nominal-roll-a4-header-center">
            <div className="nominal-roll-a4-college-name">
              GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH
            </div>
            <div className="nominal-roll-a4-college-addr">
              GRT Mahalakshmi Nagar, Chennai - Tirupati Highway, Tiruttani - 631209.
            </div>
            <div className="nominal-roll-a4-college-info">
              Phone : 044-27885997 / 98 E-mail : grtper@grt.edu.in
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="nominal-roll-a4-title">HALL DETAILS REPORT</div>

        {/* Content */}
        <div style={{ marginTop: 8, flex: 1, overflow: 'auto' }}>
          <table className="nominal-roll-table">
            <thead>
              <tr style={{ height: '32px' }}>
                <th style={{ width: '10%' }}>Sl.No</th>
                <th style={{ width: '15%' }}>Preference</th>
                <th style={{ width: '35%' }}>Hall Name</th>
                <th style={{ width: '13%' }}>Row</th>
                <th style={{ width: '13%' }}>Column</th>
                <th style={{ width: '14%' }}>Capacity</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={row.id || idx} style={{ height: '34px' }}>
                  <td>{sno++}</td>
                  <td>{row.preference}</td>
                  <td style={{ textAlign: 'left' }}>{row.hall_name}</td>
                  <td>{row.rows}</td>
                  <td>{row.columns}</td>
                  <td>{row.capacity}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: 'bold', backgroundColor: '#f2f2f2', height: '34px' }}>
                <td colSpan="5" style={{ textAlign: 'right', paddingRight: '10px' }}>Total :</td>
                <td>{totalCapacity}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="nominal-roll-a4-footer">
          <div><b>Principal</b></div>
        </div>
      </div>
    </div>
  );
});

export default HallReportA4Preview;
