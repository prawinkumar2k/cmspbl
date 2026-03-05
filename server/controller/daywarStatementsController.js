/**
 * Daywar Statements Controller — MongoDB version
 * GROUP_CONCAT(register|student_name) → $group $push
 */
import { ExamSeatPlan } from '../models/Exam.js';

export const getDaywarReport = async (req, res) => {
	try {
		const { examDate, session } = req.query;
		if (!examDate || !session) return res.status(400).json({ error: 'Missing examDate or session' });

		const start = new Date(examDate); start.setHours(0, 0, 0, 0);
		const end = new Date(examDate); end.setHours(23, 59, 59, 999);

		const results = await ExamSeatPlan.aggregate([
			{ $match: { examDate: { $gte: start, $lte: end }, session } },
			{ $sort: { registerNumber: 1 } },
			{
				$group: {
					_id: { deptCode: '$deptCode', deptName: '$deptName', subjectCode: '$subjectCode', subjectName: '$subjectName' },
					// ✅ replaces GROUP_CONCAT(CONCAT(register_number,'|', student_name) SEPARATOR '||')
					students: { $push: { registerNumber: '$registerNumber', studentName: '$studentName' } },
					total_strength: { $sum: 1 }
				}
			},
			{ $sort: { '_id.deptCode': 1, '_id.subjectCode': 1 } }
		]);

		const deptData = {};
		results.forEach(row => {
			const d = row._id;
			if (!deptData[d.deptCode]) {
				deptData[d.deptCode] = { dept_code: d.deptCode, dept_name: d.deptName, subjects: [] };
			}
			deptData[d.deptCode].subjects.push({
				subject_code: d.subjectCode,
				subject_name: d.subjectName,
				students: row.students.map(s => ({
					register_number: String(s.registerNumber || '').trim(),
					student_name: String(s.studentName || '').trim()
				})),
				total_strength: row.total_strength
			});
		});

		return res.json(Object.values(deptData));
	} catch (err) {
		console.error('Error in getDaywarReport:', err);
		return res.status(500).json({ error: 'Server error', details: err.message });
	}
};

export default { getDaywarReport };
