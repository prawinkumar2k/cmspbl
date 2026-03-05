import React from 'react';
import './DigitalNumberDisplay.css';

const DigitalNumberDisplay = ({ digitalData, examDate, session }) => {
  if (!digitalData || digitalData.length === 0) {
    return <div className="no-data">No digital numbering data available</div>;
  }

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="digital-number-display paper-PaperA4">
      {digitalData.map((dept, deptIdx) => (
        <div key={deptIdx}>
          {dept.subjects.map((subject, subjectIdx) => (
            <div key={`${deptIdx}-${subjectIdx}`} className="subject-section page-break">
              {/* Title */}
              <h5 style={{ textAlign: 'center', marginBottom: '15px', fontSize: '14px', fontWeight: 'bold' }}>
                Digital Numbering Report
              </h5>

              {/* Date & Session */}
              <div style={{ marginBottom: '34px', fontSize: '11px' }}>
                <span><strong>Date & Session :</strong> {formatDate(examDate)} & {session}</span>
              </div>

              {/* Register Numbers Grid - 5 per row with space-between */}
              <div style={{ marginBottom: '20px' }}>
                {Array.from({ length: Math.ceil(subject.register_numbers.length / 5) }, (_, rowIdx) => (
                  <div key={rowIdx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '24px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    fontWeight: 'bold'
                  }}>
                    {subject.register_numbers.slice(rowIdx * 5, (rowIdx + 1) * 5).map((regNum, idx) => (
                      <div key={idx} style={{ flex: 1, textAlign: 'center' }}>
                        {regNum}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DigitalNumberDisplay;
