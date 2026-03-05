import { PracticalExamTimetable, Subject, Student } from '../models/index.js';

/**
 * GET Practical Exam Student List
 */
export const getPracticalExamStudents = async (req, res) => {
  try {
    const q = req.query;
    const filter = {};
    if (q.Exam_Date) filter.examDate = q.Exam_Date;
    if (q.Session) filter.session = q.Session;
    if (q.Dept_Code) filter.deptCode = q.Dept_Code;
    if (q.QPC) filter.qpc = q.QPC;
    if (q.Regulation) filter.regulation = q.Regulation;
    if (q.Semester) filter.semester = q.Semester;

    // 1. Get timetables
    const timetables = await PracticalExamTimetable.find(filter);

    const allData = [];

    for (const et of timetables) {
      // 2. Get subjects matched by QPC and Dept
      const subjects = await Subject.find({
        qpc: et.qpc,
        deptCode: et.deptCode
      });

      for (const sub of subjects) {
        const subCode = sub.subCode;
        const regExp = new RegExp(`(^|,)${subCode}(,|$)`);

        // 3. Get Regular Students (enrolled in current semester and having this sub)
        const regularStudents = await Student.find({
          deptCode: et.deptCode,
          semester: String(et.semester),
          admissionStatus: 'Admitted',
          [`arrearSem${et.semester}`]: regExp
        });

        regularStudents.forEach(st => {
          allData.push({
            exam_timetable_id: et._id,
            Exam_Date: et.examDate,
            Session: et.session,
            Dept_Code: et.deptCode,
            QPC: et.qpc,
            Regulation: et.regulation,
            Semester: et.semester,
            Sub_Code: subCode,
            Register_Number: st.registerNumber,
            Student_Name: st.studentName,
            Exam_Type: 'R'
          });
        });

        // 4. Get Arrear Students (having this sub in ANY previous semester)
        if (parseInt(et.semester) > 1) {
          const arrearFilters = [];
          for (let i = 1; i < parseInt(et.semester); i++) {
            arrearFilters.push({ [`arrearSem${i}`]: regExp });
          }

          const arrearStudents = await Student.find({
            deptCode: et.deptCode,
            admissionStatus: 'Admitted',
            $or: arrearFilters
          });

          arrearStudents.forEach(st => {
            // Avoid duplicates if a student is already in Regular for the same sub (rare but possible in logic)
            if (!allData.find(d => d.Register_Number === st.registerNumber && d.Sub_Code === subCode && d.Exam_Type === 'R')) {
              allData.push({
                exam_timetable_id: et._id,
                Exam_Date: et.examDate,
                Session: et.session,
                Dept_Code: et.deptCode,
                QPC: et.qpc,
                Regulation: et.regulation,
                Semester: et.semester,
                Sub_Code: subCode,
                Register_Number: st.registerNumber,
                Student_Name: st.studentName,
                Exam_Type: 'A'
              });
            }
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      count: allData.length,
      data: allData
    });
  } catch (error) {
    console.error("Practical Exam Fetch Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch practical exam students"
    });
  }
};