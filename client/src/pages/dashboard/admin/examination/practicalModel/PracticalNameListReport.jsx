import React from "react";

const PracticalNameListReport = () => {
  return (
    <div style={styles.page}>
      {/* GRT Institute Header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <img src="/public/assets/images/GRT.png" alt="logo" style={{ width: 70, height: 70, objectFit: 'contain' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={styles.collegeName}>
              GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH
            </div>
            <div style={styles.address}>
              GRT Mahalakshmi Nagar, Chennai - Tirupati Highway, Tiruttani - 631209.
            </div>
            <div style={styles.contact}>
              Phone : 044-27885997 / 98 E-mail : grtper@grt.edu.in
            </div>
          </div>
        </div>
        <div style={styles.reportTitle}>PRACTICAL NAMELIST</div>
      </div>

      {/* Course Info Table */}
      <table style={styles.infoTable}>
        <tbody>
          <tr>
            <td><b>Date and Session</b></td>
            <td></td>
            <td><b>COURSE</b></td>
            <td>DCE</td>
            <td><b>SEM</b></td>
            <td>1</td>
            <td><b>SUBJECT NAME</b></td>
            <td>Basic English for Employability</td>
          </tr>
        </tbody>
      </table>

      {/* Student Table */}
      <table style={styles.mainTable}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>S.NO</th>
            <th>REGISTER NO</th>
            <th>STUDENT NAME</th>
            <th>EX. NO</th>
            <th>SIGNATURE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>24503897</td>
            <td>BALAMURUGAN M</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      {/* Signature Block */}
      <div style={styles.signature}>
        <b>Exam Controller</b>
      </div>
    </div>
  );
};

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    background: "#fff",
    padding: "20px",
    fontFamily: "'Times New Roman', serif",
    fontSize: "12px",
    color: "#000",
    width: "100%",
    border: "2px solid #000",
    boxSizing: "border-box",
  },

  header: {
    textAlign: "center",
    marginBottom: "15px",
  },

  collegeName: {
    fontWeight: "900",
    fontSize: "16px",
    letterSpacing: "0.5px",
  },

  address: {
    fontSize: "11px",
    marginTop: "2px",
  },

  contact: {
    fontSize: "10px",
  },

  reportTitle: {
    marginTop: "10px",
    fontWeight: "900",
    fontSize: "14px",
    letterSpacing: "0.8px",
  },

  infoTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },

  mainTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },

  signature: {
    marginTop: "30px",
    textAlign: "right",
    paddingRight: "30px",
    fontSize: "11px",
  },
};

/* Table Borders */
const tableStyle = `
table, th, td {
  border: 1.5px solid #000;
}
th, td {
  padding: 6px;
  text-align: center;
}
th {
  background-color: #f2f2f2;
}
`;

export default PracticalNameListReport;

/* Inject table CSS */
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = tableStyle;
  document.head.appendChild(style);
}
