import { ExamFee } from '../models/Exam.js';

const mapRow = (r) => ({
  id: r._id, regno: r.regNo, studName: r.studName,
  course: r.course, sem: r.sem, fine: r.fine, fee: r.fee, totFee: r.totFee,
  semCols: [r.sem1, r.sem2, r.sem3, r.sem4, r.sem5, r.sem6, r.sem7, r.sem8]
});

export const getExamFees = async (req, res) => {
  try {
    const rows = await ExamFee.find();
    res.json(rows.map(mapRow));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const addExamFee = async (req, res) => {
  try {
    const f = req.body;
    const doc = await ExamFee.create({
      regNo: f.RegNo, studName: f.StudName, course: f.Course, sem: f.Sem,
      fine: f.Fine, fee: f.Fee, totFee: f.TotFee,
      sem1: f.Sem_1 || '', sem2: f.Sem_2 || '', sem3: f.Sem_3 || '', sem4: f.Sem_4 || '',
      sem5: f.Sem_5 || '', sem6: f.Sem_6 || '', sem7: f.Sem_7 || '', sem8: f.Sem_8 || ''
    });
    res.json(mapRow(doc));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const editExamFee = async (req, res) => {
  try {
    const { id } = req.params;
    const f = req.body;
    await ExamFee.findByIdAndUpdate(id, {
      regNo: f.regno, studName: f.studName, course: f.course, sem: f.sem,
      fine: f.fine, fee: f.fee, totFee: f.totFee,
      sem1: f.semCols?.[0] || '', sem2: f.semCols?.[1] || '', sem3: f.semCols?.[2] || '',
      sem4: f.semCols?.[3] || '', sem5: f.semCols?.[4] || '', sem6: f.semCols?.[5] || '',
      sem7: f.semCols?.[6] || '', sem8: f.semCols?.[7] || ''
    });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteExamFee = async (req, res) => {
  try {
    await ExamFee.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
