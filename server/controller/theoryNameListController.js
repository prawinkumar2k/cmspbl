/**
 * Theory Name List Controller — MongoDB version
 * Replaces GROUP_CONCAT with $group + $push aggregation
 */
import { ExamSeatPlan } from '../models/Exam.js';

export const getTheoryNameListReport = async (req, res) => {
	try {
		const { examDate, session } = req.query;
		if (!examDate || !session) return res.status(400).json({ error: 'Missing examDate or session' });

		const start = new Date(examDate); start.setHours(0, 0, 0, 0);
		const end = new Date(examDate); end.setHours(23, 59, 59, 999);

		// ✅ MongoDB aggregation replaces:
		//    GROUP_CONCAT(register_number|student_name) + COUNT(*) GROUP BY dept, subject, hall
		const results = await ExamSeatPlan.aggregate([
			{ $match: { examDate: { $gte: start, $lte: end }, session } },
			{
				$group: {
					_id: { deptCode: '$deptCode', deptName: '$deptName', subjectCode: '$subjectCode', subjectName: '$subjectName', hallCode: '$hallCode', hallName: '$hallName' },
					students: {
						$push: { registerNumber: '$registerNumber', studentName: '$studentName' }
					},
					total_strength: { $sum: 1 }
				}
			},
			{ $sort: { '_id.deptCode': 1, '_id.subjectCode': 1, '_id.hallCode': 1 } }
		]);

		// Group into dept → subjects → halls structure (same as original JS grouping)
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
				hall_code: d.hallCode, hall_name: d.hallName,
				students: row.students.map((s, idx) => ({
					sno: idx + 1,
					register_number: String(s.registerNumber || '').trim(),
					student_name: String(s.studentName || '').trim()
				})),
				total_strength: row.total_strength
			});
		});

		return res.json(Object.values(deptData));
	} catch (err) {
		console.error('Error in getTheoryNameListReport:', err);
		return res.status(500).json({ error: 'Server error', details: err.message });
	}
};

export default { getTheoryNameListReport };
