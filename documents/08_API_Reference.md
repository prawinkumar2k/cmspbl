# API Reference

The SF ERP provides a RESTful API returning JSON responses.

## Authentication Endpoints

- `POST /api/auth/login`: Authenticate and receive JWT.
- `GET /api/auth/roles`: Fetch list of available user roles.
- `GET /api/auth/sidebar`: Fetch sidebar modules for the logged-in user (Requires Token).
- `GET /api/auth/profile`: Get profile details for the logged-in user (Requires Token).

## Dashboard Endpoints

- `GET /api/dashboard/stats`: Retrieve general institution statistics.
- `GET /api/dashboard/dept-attendance`: Get attendance counts per department.
- `GET /api/dashboard/gender-ratio`: Get student gender distribution.

## Staff & User Endpoints

- `GET /api/staff_master`: List all staff records.
- `GET /api/staff_master/id/:id`: Get specific staff record.
- `POST /api/staff_master`: Create new staff record (Multi-part form/Photo).
- `GET /api/users`: List all system users.
- `POST /api/users`: Create a new login account.

## Student & Academic Endpoints

- `GET /api/student_master`: List all students.
- `GET /api/dbSemester/list`: List all available semesters.
- `GET /api/semesterMaster`: Manage semester data.
- `POST /api/attendance`: Submit student attendance entries.

## Communication Endpoints

- `GET /api/memo/staff`: List memos for staff members.
- `POST /api/memo/staff`: Create a new staff memo.
- `GET /api/memo/student`: List memos for students.
- `POST /api/memo/student`: Create a new student memo.

## Caller & Enquiry Endpoints

- `GET /api/callers`: List enquiry callers/telecallers.
- `POST /api/assignCall`: Assign calls to staff members.

---

*Note: All protected endpoints require an `Authorization: Bearer <token>` header.*
