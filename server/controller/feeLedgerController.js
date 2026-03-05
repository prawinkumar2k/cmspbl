import FeeLedger from '../models/FeeLedger.js';

export const getAll = async (req, res) => {
  try {
    const { department, semester, fee_type, roll_no, academic_year } = req.query;
    const filter = {};

    if (department) filter.department = department;
    if (semester) filter.semester = semester;
    if (fee_type) filter.feeType = fee_type;
    if (roll_no) filter.rollNo = { $regex: roll_no, $options: 'i' };
    if (academic_year) filter.academicYear = academic_year;

    const rows = await FeeLedger.find(filter).sort({ createdAt: -1 });

    // Map to expected snake_case format for frontend
    const mapped = rows.map(r => ({
      id: r._id,
      roll_no: r.rollNo,
      reg_no: r.registerNumber,
      name: r.studentName,
      department: r.department,
      semester: r.semester,
      fee_type: r.feeType,
      amount: r.amount,
      balance: r.balance,
      academic_year: r.academicYear,
      created_by: r.createdBy,
      created_at: r.createdAt,
      updated_at: r.updatedAt
    }));

    res.json(mapped);
  } catch (err) {
    console.error('getAll error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const r = await FeeLedger.findById(id);
    if (!r) return res.status(404).json({ error: 'Not found' });

    const data = {
      id: r._id,
      roll_no: r.rollNo,
      name: r.studentName,
      department: r.department,
      semester: r.semester,
      fee_type: r.feeType,
      amount: r.amount,
      balance: r.balance,
      academic_year: r.academicYear
    };

    res.json(data);
  } catch (err) {
    console.error('getById error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const create = async (req, res) => {
  try {
    const {
      roll_no, name, department, semester,
      fee_type, amount, balance, academic_year,
      created_by
    } = req.body;

    const entry = await FeeLedger.create({
      rollNo: roll_no,
      studentName: name,
      department,
      semester,
      feeType: fee_type,
      amount: amount,
      balance: balance,
      academicYear: academic_year,
      createdBy: created_by
    });

    res.status(201).json(entry);
  } catch (err) {
    console.error('create error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const b = req.body;

    const updateData = {};
    if (b.roll_no !== undefined) updateData.rollNo = b.roll_no;
    if (b.name !== undefined) updateData.studentName = b.name;
    if (b.department !== undefined) updateData.department = b.department;
    if (b.semester !== undefined) updateData.semester = b.semester;
    if (b.fee_type !== undefined) updateData.feeType = b.fee_type;
    if (b.amount !== undefined) updateData.amount = b.amount;
    if (b.balance !== undefined) updateData.balance = b.balance;
    if (b.academic_year !== undefined) updateData.academicYear = b.academic_year;
    if (b.updated_by !== undefined) updateData.updatedBy = b.updated_by;

    const updated = await FeeLedger.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    console.error('update error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await FeeLedger.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ error: 'Not found' });
    res.json({ deletedId: id });
  } catch (err) {
    console.error('remove error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Bulk update balances endpoint.
 */
export const bulkUpdateBalances = async (req, res) => {
  try {
    const updates = req.body; // expect array
    if (!Array.isArray(updates)) return res.status(400).json({ error: 'Expected array' });

    const bulkOps = updates.map(u => ({
      updateOne: {
        filter: { _id: u.id },
        update: { $set: { balance: u.balance } }
      }
    }));

    await FeeLedger.bulkWrite(bulkOps);
    res.json({ updated: updates.length });
  } catch (err) {
    console.error('bulkUpdateBalances error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
