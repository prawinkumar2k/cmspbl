import React from 'react';
import './SeatAllocationDisplay.css';

const SeatAllocationDisplay = ({ seatData, examDate, session }) => {
  if (!seatData || seatData.length === 0) {
    return <div className="no-data">No seat allocation data available</div>;
  }

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="seat-allocation-display paper-PaperA4">
      {seatData.map((dept, deptIdx) => (
        <div key={deptIdx}>
          {dept.subjects.map((subject, subjectIdx) => (
            <div key={`${deptIdx}-${subjectIdx}`} className="subject-section page-break">
              {/* Title */}
              <h5 style={{ textAlign: 'center', marginBottom: '15px', fontSize: '14px', fontWeight: 'bold' }}>
                Seat Allocation Report
              </h5>

              {/* Date & Session */}
              <div style={{ marginBottom: '10px', fontSize: '11px' }}>
                <span><strong>Date & Session :</strong> {formatDate(examDate)} & {session}</span>
              </div>

              {/* Department Info */}
              <div style={{ marginBottom: '10px', fontSize: '11px' }}>
                <span><strong>Dept.Code & Dept.Name :</strong> {dept.dept_code} & {dept.dept_name}</span>
              </div>

              {/* Subject Info */}
              <div style={{ marginBottom: '20px', fontSize: '11px' }}>
                <span><strong>Sub.Code & Sub.Name :</strong> {subject.subject_code} & {subject.subject_name}</span>
              </div>

              {/* Hall Allocations */}
              {subject.halls.map((hall, hallIdx) => (
                <div key={hallIdx} style={{ marginBottom: '30px' }}>
                  {/* Hall Number */}
                  <div style={{ marginBottom: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                    Hall.No : {hall.hall_name || hall.hall_id}
                  </div>

                  {/* Register Numbers Grid */}
                  <div style={{ marginBottom: '10px' }}>
                    {String(hall.register_numbers)
                      .trim()
                      .split(/\s+/)
                      .reduce((rows, reg, idx) => {
                        if (idx % 8 === 0) rows.push([]);
                        rows[rows.length - 1].push(reg);
                        return rows;
                      }, [])
                      .map((row, rowIdx) => (
                        <div key={rowIdx} style={{ 
                          display: 'flex', 
                          justifyContent: 'flex-start', 
                          gap: '30px',
                          marginBottom: '8px',
                          fontSize: '11px',
                          fontFamily: 'monospace'
                        }}>
                          {row.map((reg, regIdx) => (
                            <span key={regIdx}>{reg}</span>
                          ))}
                        </div>
                      ))
                    }
                  </div>

                  {/* Hall Strength */}
                  <div style={{ 
                    textAlign: 'right', 
                    fontSize: '11px', 
                    marginBottom: '15px',
                    paddingBottom: '10px',
                    borderBottom: '1px dashed #666'
                  }}>
                    <strong>Hall Strength : {hall.hall_strength}</strong>
                  </div>
                </div>
              ))}

              {/* Total Strength */}
              <div style={{ 
                textAlign: 'right', 
                fontSize: '11px',
                marginTop: '15px',
                fontWeight: 'bold',
                paddingTop: '10px'
              }}>
                <strong>Total Strength : {subject.halls.reduce((sum, h) => sum + (h.hall_strength || 0), 0)}</strong>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SeatAllocationDisplay;
