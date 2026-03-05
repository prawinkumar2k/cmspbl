import React from 'react';
import './TheoryNameListDisplay.css';

const TheoryNameListDisplay = ({ theoryData, examDate, session }) => {
  if (!theoryData || theoryData.length === 0) {
    return <div className="no-data">No theory name list data available</div>;
  }

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Paginate students into chunks of 25
  const paginateStudents = (students) => {
    const pages = [];
    const recordsPerPage = 25;
    for (let i = 0; i < students.length; i += recordsPerPage) {
      pages.push(students.slice(i, i + recordsPerPage));
    }
    return pages;
  };

  return (
    <div className="theory-name-list-display paper-PaperA4">
      {theoryData.map((dept, deptIdx) => (
        <div key={deptIdx}>
          {dept.subjects.map((subject, subjectIdx) => (
            <div key={`${deptIdx}-${subjectIdx}`}>
              {subject.halls.map((hall, hallIdx) => {
                const studentPages = paginateStudents(hall.students);
                return (
                  <div key={hallIdx}>
                    {studentPages.map((pageStudents, pageIdx) => (
                      <div key={`${hallIdx}-${pageIdx}`} className="subject-section page-break">
                        {/* Header */}
                        <div style={{ marginBottom: '15px' }}>
                          <div style={{ textAlign: 'center', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' }}>
                            EX - 7
                          </div>
                          <div style={{ textAlign: 'center', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold' }}>
                            BOARD EXAMINATIONS - OCTOBER 2025
                          </div>
                          <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                            ATTENDANCE PARTICULARS OF CANDIDATES
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px', fontSize: '11px' }}>
                          <div>
                            <strong>Centre :</strong> 786, GRT INSTITUTE OF PHARMACEUTICAL EDUCATION AND RESEARCH
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <strong>Ques. Code :</strong> <input style={{ width: '100px', border: '1px solid #000', padding: '2px' }} />
                          </div>
                          <div>
                            <strong>Sem / Branch :</strong> {dept.dept_code} / {dept.dept_name}
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <strong>Hall Name / No :</strong> {hall.hall_name}
                          </div>
                          <div>
                            <strong>Subject :</strong> {subject.subject_name}
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <strong>Date & Session :</strong> {formatDate(examDate)} {session}
                          </div>
                        </div>

                        {/* Table */}
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '10px' }}>
                          <thead>
                            <tr>
                              <th style={{ border: '1px solid #423f3fff', padding: '8px', textAlign: 'center', fontWeight: 'bold'}}>SNO</th>
                              <th style={{ border: '1px solid #423f3fff', padding: '8px', textAlign: 'center', fontWeight: 'bold'}}>REGISTER No</th>
                              <th style={{ border: '1px solid #423f3fff', padding: '8px', textAlign: 'center', fontWeight: 'bold'}}>STUDENT NAME</th>
                              <th style={{ border: '1px solid #423f3fff', padding: '8px', textAlign: 'center', fontWeight: 'bold'}}>ANSWER BOOK NO</th>
                              <th style={{ border: '1px solid #423f3fff', padding: '8px', textAlign: 'center', fontWeight: 'bold'}}>SIGNATURE</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pageStudents.map((student, idx) => (
                              <tr key={idx}>
                                <td style={{ border: '1px solid #423f3fff', padding: '4px', textAlign: 'center' }}>{student.sno}</td>
                                <td style={{ border: '1px solid #423f3fff', padding: '4px', fontFamily: 'monospace' }}>{student.register_number}</td>
                                <td style={{ border: '1px solid #423f3fff', padding: '4px' }}>{student.student_name}</td>
                                <td style={{ border: '1px solid #423f3fff', padding: '4px', textAlign: 'center' }}></td>
                                <td style={{ border: '1px solid #423f3fff', padding: '4px', textAlign: 'center' }}></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Footer Stats */}
                        <div style={{ marginBottom: '20px', marginTop: '15px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold' }}>
                            <div>
                              Total number of candidates present : <input style={{ width: '80px', border: '1px solid #000', padding: '2px' }} />
                            </div>
                            <div>
                              Total number of candidates absent : <input style={{ width: '80px', border: '1px solid #000', padding: '2px' }} />
                            </div>
                          </div>
                        </div>

                        {/* Signatures */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '11px' }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontWeight: 'bold' }}>Hall Superintendent</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontWeight: 'bold' }}>Addl. Chief Superintendent</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontWeight: 'bold' }}>Chief Superintendent</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TheoryNameListDisplay;
