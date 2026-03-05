/**
 * Digital Numbering Report Controller — MongoDB version
 * GROUP_CONCAT(register_number ORDER BY ...) → $group $push + sort
 */
import { ExamSeatPlan } from '../models/Exam.js';

export const getDigitalNumberingReport = async (req, res) => {
	try {
		const { examDate, session } = req.query;
		if (!examDate || !session) return res.status(400).json({ error: 'Missing examDate or session' });

		const start = new Date(examDate); start.setHours(0, 0, 0, 0);
		const end = new Date(examDate); end.setHours(23, 59, 59, 999);

		// ✅ $sort before $group ensures ORDER BY register_number in GROUP_CONCAT
		const results = await ExamSeatPlan.aggregate([
			{ $match: { examDate: { $gte: start, $lte: end }, session } },
			{ $sort: { registerNumber: 1 } },
			{
				$group: {
					_id: { deptCode: '$deptCode', deptName: '$deptName', subjectCode: '$subjectCode', subjectName: '$subjectName' },
					registerNumbers: { $push: '$registerNumber' },
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
				register_numbers: row.registerNumbers.map(r => String(r).trim()),
				total_strength: row.total_strength
			});
		});

		return res.json(Object.values(deptData));
	} catch (err) {
		console.error('Error in getDigitalNumberingReport:', err);
		return res.status(500).json({ error: 'Server error', details: err.message });
	}
};

export default { getDigitalNumberingReport };
