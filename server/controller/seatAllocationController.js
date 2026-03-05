/**
 * Seat Allocation Controller — MongoDB version
 * GROUP_CONCAT(register_number ORDER BY seat_label) → $group $push sorted
 */
import { ExamSeatPlan } from '../models/Exam.js';

export const getSeatAllocationReport = async (req, res) => {
	try {
		const { examDate, session } = req.query;
		if (!examDate || !session) return res.status(400).json({ error: 'Missing examDate or session' });

		const start = new Date(examDate); start.setHours(0, 0, 0, 0);
		const end = new Date(examDate); end.setHours(23, 59, 59, 999);

		// ✅ MongoDB aggregation replaces:
		//    GROUP_CONCAT(register_number ORDER BY seat_label SEPARATOR ' ') + COUNT(*) GROUP BY dept, subj, hall
		const results = await ExamSeatPlan.aggregate([
			{ $match: { examDate: { $gte: start, $lte: end }, session } },
			{ $sort: { seatLabel: 1 } },
			{
				$group: {
					_id: { deptCode: '$deptCode', deptName: '$deptName', subjectCode: '$subjectCode', subjectName: '$subjectName', hallCode: '$hallCode' },
					register_numbers: { $push: '$registerNumber' },
					hall_strength: { $sum: 1 }
				}
			},
			{ $sort: { '_id.deptCode': 1, '_id.subjectCode': 1, '_id.hallCode': 1 } }
		]);

		const deptData = {};
		results.forEach(row => {
			const d = row._id;
			if (!deptData[d.deptCode]) {
				deptData[d.deptCode] = { dept_code: d.deptCode, dept_name: d.deptName, subjects: [] };
			}
			let subject = deptData[d.deptCode].subjects.find(s => s.subject_code === d.subjectCode);
			if (!subject) {
				subject = { subject_code: d.subjectCode, subject_name: d.subjectName, halls: [] };
				deptData[d.deptCode].subjects.push(subject);
			}
			subject.halls.push({
				hall_id: d.hallCode,
				hall_name: d.hallCode,
				register_numbers: row.register_numbers.join(' '),
				hall_strength: row.hall_strength
			});
		});

		return res.json(Object.values(deptData));
	} catch (err) {
		console.error('Error in getSeatAllocationReport:', err);
		return res.status(500).json({ error: 'Server error', details: err.message });
	}
};

export default { getSeatAllocationReport };
