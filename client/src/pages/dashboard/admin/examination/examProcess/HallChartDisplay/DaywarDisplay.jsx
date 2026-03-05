import React from 'react';
import './DaywarDisplay.css';

const DayWarDisplay = ({ daywarData, examDate, session }) => {
  if (!daywarData || daywarData.length === 0) {
    return <div className="no-data">No daywar data available</div>;
  }

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="daywar-display paper-PaperA4">
      {daywarData.map((dept, deptIdx) => (
        <div key={deptIdx}>
          {dept.subjects.map((subject, subjectIdx) => (
            <div key={`${deptIdx}-${subjectIdx}`} className="subject-section page-break">
              {/* Title */}
              <h5 style={{ textAlign: 'center', marginBottom: '15px', fontSize: '14px', fontWeight: 'bold' }}>
                Daywar Statement
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

              {/* Students Grid Layout */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(8, 1fr)',
                  gap: '12px',
                  fontSize: '10px',
                  marginBottom: '15px'
                }}>
                  {subject.students.map((student, idx) => (
                    <div key={idx} style={{ 
                      textAlign: 'center',
                      fontFamily: 'monospace',
                      wordBreak: 'break-word'
                    }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        {student.register_number}
                      </div>
                      {student.student_name && (
                        <div style={{ fontSize: '9px', color: '#555' }}>
                          {student.student_name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Row */}
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                marginBottom: '15px',
                paddingBottom: '10px',
                borderBottom: '1px dashed #666'
              }}>
                <div>
                  <strong>No Of Regular Candidates : {subject.total_strength}</strong>
                </div>
                <div>
                  <strong>Department Strength : {subject.total_strength}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DayWarDisplay;
