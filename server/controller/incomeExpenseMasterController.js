import { IncomeExpenseMaster } from '../models/IncomeExpense.js';

/* ==========================================
   CREATE MASTER DATA
========================================== */
export const createIncomeExpenseMaster = async (req, res) => {
  try {
    const { group, category, person } = req.body;

    if (!group) {
      return res.status(400).json({
        success: false,
        message: "Group is required"
      });
    }

    // Using updateOne with upsert to mimic INSERT IGNORE but still have update capability
    // Or just findOne and then create if not exists
    await IncomeExpenseMaster.findOneAndUpdate(
      { groupName: group, categoryName: category || null, personName: person || null },
      { groupName: group, categoryName: category || null, personName: person || null },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: "Master data saved" });

  } catch (err) {
    console.error("Master Create Error:", err);
    res.status(500).json({ success: false });
  }
};

/* ==========================================
   GET GROUP LIST
========================================== */
export const getGroups = async (req, res) => {
  try {
    const groups = await IncomeExpenseMaster.distinct('groupName');
    res.json(groups.sort().map(g => ({ group: g })));
  } catch (err) {
    console.error("Fetch Groups Error:", err);
    res.status(500).json([]);
  }
};

/* ==========================================
   GET CATEGORY BY GROUP
========================================== */
export const getCategoriesByGroup = async (req, res) => {
  try {
    const { group } = req.params;
    const categories = await IncomeExpenseMaster.distinct('categoryName', {
      groupName: group,
      categoryName: { $ne: null }
    });
    res.json(categories.sort().map(c => ({ category: c })));
  } catch (err) {
    console.error("Fetch Categories Error:", err);
    res.status(500).json([]);
  }
};

/* ==========================================
   GET PERSON BY GROUP & CATEGORY
========================================== */
export const getPersonsByCategory = async (req, res) => {
  try {
    const { group, category } = req.params;
    const persons = await IncomeExpenseMaster.distinct('personName', {
      groupName: group,
      categoryName: category,
      personName: { $ne: null }
    });
    res.json(persons.sort().map(p => ({ person: p })));
  } catch (err) {
    console.error("Fetch Persons Error:", err);
    res.status(500).json([]);
  }
};
