import React from 'react';
import './HallChartDisplay.css';

const HallChartDisplay = ({ hallData, examDate, session }) => {
    if (!hallData || hallData.length === 0) {
        return <div className="no-data">No hall data available</div>;
    }

    // Helper to format date
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // Helper to get day name
    const getDayName = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { weekday: 'long' });
    };

    return (
        <div className="hall-chart-display paper-PaperA4">
            {hallData.map((hall, hallIdx) => (
                <div key={hallIdx} className="hall-section page-break">
                    {/* Header Section */}
                    <div className="hall-header">
                        <div className="header-row">
                            <div className="header-cell">
                                <strong>DATE</strong> <br /> {formatDate(hall.exam_date)}
                            </div>
                            <div className="header-cell">
                                <strong>SESSION</strong> <br /> {hall.session}
                            </div>
                            <div className="header-cell">
                                <strong>DAY</strong> <br /> {getDayName(hall.exam_date)}
                            </div>
                            <div className="header-cell">
                                <strong>HALL NO</strong> <br /> {hall.hall_code}
                            </div>
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="hall-summary">
                        <table className="summary-table">
                            <thead>
                                <tr>
                                    <th>Sem</th>
                                    <th>Department</th>
                                    <th>Subject</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Group students by semester/dept for summary */}
                                {(() => {
                                    const summary = {};
                                    hall.students.forEach(student => {
                                        const key = `${student.semester}-${student.dept_short}-${student.subject_code}`;
                                        if (!summary[key]) {
                                            summary[key] = {
                                                semester: student.semester,
                                                dept_name: student.dept_name,
                                                subject_name: student.subject_name,
                                                count: 0
                                            };
                                        }
                                        summary[key].count++;
                                    });

                                    return Object.values(summary).map((item, idx) => (
                                        <tr key={idx}>
                                            <td>{item.semester}</td>
                                            <td>{item.dept_name}</td>
                                            <td>{item.subject_name}</td>
                                            <td>{item.count}</td>
                                        </tr>
                                    ));
                                })()}
                                <tr className="total-row">
                                    <td colSpan="3"><strong>TOTAL :</strong></td>
                                    <td><strong>{hall.students.length}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Seats Grid */}
                    <div className="seats-grid">
                        {(() => {
                            // Group students by seat column (A, B, C, D, E, etc.)
                            const columns = {};
                            hall.students.forEach(student => {
                                const col = student.seat_column || 'A';
                                if (!columns[col]) {
                                    columns[col] = [];
                                }
                                columns[col].push(student);
                            });

                            return Object.keys(columns).sort().map(colLetter => (
                                <div key={colLetter} className="seat-column">
                                    <div className="column-header">{colLetter}</div>
                                    <div className="seats">
                                        {columns[colLetter]
                                            .sort((a, b) => (a.seat_label || 0) - (b.seat_label || 0))
                                            .map((student, idx) => (
                                                <div key={idx} className="seat">
                                                    <div className="seat-label">{student.seat_label_full}</div>
                                                    <div className="seat-reg">{student.register_number}</div>
                                                    <div className="seat-dept">{student.dept_short}</div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>

                    {/* Signature Footer */}
                    <div className="signature-footer">
                        <div className="signature-text">
                            Chief Superintendent
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HallChartDisplay;
