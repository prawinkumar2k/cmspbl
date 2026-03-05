import { ExamSeatPlan } from '../models/Exam.js';

export const getExamDates = async (req, res) => {
	try {
		// ✅ MongoDB distinct replaces SELECT DISTINCT exam_date
		const dates = await ExamSeatPlan.distinct('examDate', { examDate: { $ne: null } });
		const sorted = dates.sort((a, b) => b - a).map(d => d.toISOString().split('T')[0]);
		return res.json(sorted);
	} catch (err) {
		console.error('Error in getExamDates:', err);
		return res.status(500).json({ error: 'Server error', details: err.message });
	}
};

export const getSeatAssignments = async (req, res) => {
	try {
		const { examDate, session } = req.query;
		if (!examDate || !session) return res.status(400).json({ error: 'Missing examDate or session' });

		const start = new Date(examDate); start.setHours(0, 0, 0, 0);
		const end = new Date(examDate); end.setHours(23, 59, 59, 999);

		const results = await ExamSeatPlan.find({ examDate: { $gte: start, $lte: end }, session })
			.sort({ hallCode: 1, seatLabel: 1 });

		// Group by hall — same JS logic as original
		const hallData = {};
		results.forEach(row => {
			if (!hallData[row.hallCode]) {
				hallData[row.hallCode] = {
					hall_code: String(row.hallCode), exam_date: row.examDate,
					day_order: row.dayOrder, session: String(row.session), students: []
				};
			}
			const seatLabelStr = String(row.seatLabel).trim();
			const colMatch = seatLabelStr.match(/^([A-Z]+)/);
			const numMatch = seatLabelStr.match(/(\d+)$/);
			hallData[row.hallCode].students.push({
				seat_column: colMatch ? colMatch[1] : (String(row.colLetter).trim() || 'A'),
				seat_label: numMatch ? parseInt(numMatch[1]) : 0,
				seat_label_full: seatLabelStr,
				register_number: String(row.registerNumber).trim(),
				subject_code: String(row.subjectCode).trim(),
				subject_name: String(row.subjectName).trim(),
				dept_code: String(row.deptCode).trim(),
				dept_name: String(row.deptName).trim(),
				dept_short: String(row.deptShort || '').trim(),
				semester: parseInt(row.semester) || 0
			});
		});

		return res.json(Object.values(hallData));
	} catch (err) {
		console.error('Error in getSeatAssignments:', err);
		return res.status(500).json({ error: 'Server error', details: err.message });
	}
};
