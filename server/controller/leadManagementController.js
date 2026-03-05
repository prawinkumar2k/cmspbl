import { Lead, CallNote } from '../models/index.js';

// ------------------------------------------------------
// GET ALL LEADS
// ------------------------------------------------------
export const getAllLeads = async (req, res) => {
  try {
    const rows = await Lead.find();

    // Map to expected format
    const mapped = rows.map(lead => ({
      student_eqid: lead.studentEqid,
      student_address: lead.studentAddress,
      studentName: lead.studentName,
      phone: lead.studentMobile,
      hscRegNo: lead.studentEqid,
      source: lead.source,
      tenant_id: lead.tenantId,
      staff_id: lead.staffId,
      staff_name: lead.staffName,
      student_reg_no: lead.studentRegNo,
      city: lead.studentDistrict,
      last_status: lead.status,
      call_notes_count: 0, // Calculated later if needed
      next_follow_up: null, // Calculated later if needed
      callHistory: []
    }));

    res.json(mapped);
  } catch (err) {
    console.error("GET ALL LEADS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch leads" });
  }
};

// ------------------------------------------------------
// GET LEAD BY ID
// ------------------------------------------------------
export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findOne({ studentEqid: req.params.id });

    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    const callNotes = await CallNote.find({
      studentEqid: req.params.id,
      tenantId: lead.staffId
    }).sort({ createdAt: -1 });

    const data = {
      ...lead.toObject(),
      callHistory: callNotes.map(n => ({
        id: n._id,
        date: n.callNoteDate,
        time: n.callNoteTime,
        callerName: n.tenantName,
        outcome: n.outcome,
        notes: n.callNotes,
        nextFollowUp: n.nextFollowUp
      }))
    };

    res.json(data);
  } catch (err) {
    console.error("GET LEAD BY ID ERROR:", err);
    res.status(500).json({ error: "Failed to fetch lead" });
  }
};

// ------------------------------------------------------
// UPDATE LEAD STATUS
// ------------------------------------------------------
export const updateLead = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const lead = await Lead.findOneAndUpdate(
      { studentEqid: id },
      { $set: { status } },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    res.json({ message: "Lead updated successfully" });
  } catch (err) {
    console.error("UPDATE LEAD ERROR:", err);
    res.status(500).json({ error: "Failed to update lead" });
  }
};

// ------------------------------------------------------
// UPDATE STATUS AND ADD CALL NOTE (Atomic-ish)
// ------------------------------------------------------
export const addCallNote = async (req, res) => {
  try {
    const {
      staff_id,
      staff_name,
      tenant_id,
      student_eqid,
      student_name,
      outcome,
      call_notes,
      next_follow_up,
      call_note_date,
      call_note_time,
      role
    } = req.body;

    // 1. Update status in Lead
    const lead = await Lead.findOneAndUpdate(
      { studentEqid: student_eqid, staffId: staff_id },
      { $set: { status: outcome } }
    );

    if (!lead) {
      return res.status(404).json({ error: "Student not found for status update" });
    }

    // 2. Insert call note
    await CallNote.create({
      role,
      tenantId: staff_id,
      tenantName: staff_name,
      studentEqid: student_eqid,
      studentName: student_name,
      callNoteDate: call_note_date,
      callNoteTime: call_note_time,
      outcome,
      callNotes: call_notes,
      nextFollowUp: next_follow_up
    });

    res.json({ message: "Status updated and call note added successfully" });
  } catch (err) {
    console.error("ADD CALL NOTE ERROR:", err);
    res.status(500).json({ error: "Failed to update status and add call note" });
  }
};
