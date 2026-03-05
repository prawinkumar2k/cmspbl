/**
 * Academic Calendar Controller — MongoDB version
 * Upsert per-date update/insert → findOneAndUpdate({upsert:true})
 * Bulk date generation → insertMany after deleteMany
 */
import { AcademicCalendar, AcademicCalendarDateFix } from '../models/AcademicCalendar.js';

export const getAllEvents = async (req, res) => {
  try {
    const rows = await AcademicCalendar.find({
      $or: [
        { eventTitle: { $ne: null, $nin: ['', null] } },
        { status: 'H' }
      ]
    });

    const events = rows.map(row => {
      let start = row.calendarDate?.toISOString().slice(0, 10);
      let end = start;

      if (row.eventTiming?.includes(' to ')) {
        const [s, e] = row.eventTiming.split(' to ');
        start = s;
        end = e || s;
      } else if (row.eventTiming) {
        start = end = row.eventTiming;
      }

      const isHoliday = row.status === 'H' && (!row.eventTitle || row.eventTitle.trim() === '');
      return {
        id: row._id.toString(),
        title: isHoliday ? 'Holiday' : row.eventTitle?.trim(),
        description: isHoliday ? '' : row.description,
        category: isHoliday ? 'holiday' : row.label,
        start, end,
        eventTiming: row.eventTiming
      };
    });

    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: err.message });
  }
};

const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  let current = new Date(startDate);
  const last = new Date(endDate);
  while (current <= last) {
    dates.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

export const addEvent = async (req, res) => {
  try {
    const { title, description, category, startDate, endDate } = req.body;
    const eventTiming = `${startDate} to ${endDate}`;
    const status = category === 'holiday' ? 'H' : 'W';
    const dates = getDatesInRange(startDate, endDate);

    // ✅ MongoDB: upsert per date replaces UPDATE→INSERT fallback pattern
    await Promise.all(dates.map(date =>
      AcademicCalendar.findOneAndUpdate(
        { calendarDate: new Date(date) },
        { $set: { eventTitle: title, description, label: category, eventTiming, status } },
        { upsert: true }
      )
    ));

    res.json({ message: 'Event added successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const editEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, startDate, endDate } = req.body;
    const eventTiming = `${startDate} to ${endDate}`;
    const status = category === 'holiday' ? 'H' : 'W';

    await AcademicCalendar.findByIdAndUpdate(id, {
      eventTitle: title, description, label: category,
      eventTiming, calendarDate: new Date(startDate), status
    });
    res.json({ message: 'Event updated successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const deleteEvent = async (req, res) => {
  try {
    // "Delete" in original = clear event fields but keep the date row
    await AcademicCalendar.findByIdAndUpdate(req.params.id, {
      $set: { eventTitle: null, eventTiming: null, label: null, description: null }
    });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

export const getAcademicYearRange = async (req, res) => {
  try {
    const record = await AcademicCalendarDateFix.findOne().sort({ createdAt: -1 });
    if (record) {
      res.json({
        startDate: record.startDate?.toISOString().slice(0, 10),
        endDate: record.endDate?.toISOString().slice(0, 10),
        totalWeeks: record.totalWeeks
      });
    } else { res.json(null); }
  } catch (err) {
    console.error('Error fetching academic year range:', err);
    res.status(500).json({ error: err.message });
  }
};

export const saveAcademicYearRange = async (req, res) => {
  try {
    const { startDate, endDate, totalWeeks } = req.body;

    // ✅ upsert: replaces SELECT→UPDATE or INSERT pattern
    await AcademicCalendarDateFix.findOneAndUpdate(
      {},
      { startDate: new Date(startDate), endDate: new Date(endDate), totalWeeks },
      { upsert: true, sort: { createdAt: -1 } }
    );

    await generateAcademicCalendarDates(startDate, endDate);
    res.json({ message: 'Academic year range saved and calendar dates generated successfully' });
  } catch (err) {
    console.error('Error saving academic year range:', err);
    res.status(500).json({ error: err.message });
  }
};

const generateAcademicCalendarDates = async (startDate, endDate) => {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dates = [];
  let current = new Date(startDate);
  const last = new Date(endDate);

  while (current <= last) {
    dates.push({
      calendarDate: new Date(current),
      dayOrder: dayNames[current.getDay()],
      status: current.getDay() === 0 ? 'H' : 'W',
      reason: current.getDay() === 0 ? 'Sunday' : null
    });
    current.setDate(current.getDate() + 1);
  }

  // ✅ DELETE range + insertMany replaces per-date INSERT loop
  await AcademicCalendar.deleteMany({
    calendarDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
  });
  await AcademicCalendar.insertMany(dates);
  console.log(`Generated ${dates.length} calendar dates from ${startDate} to ${endDate}`);
};
