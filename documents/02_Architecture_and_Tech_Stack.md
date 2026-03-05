# Architecture & Tech Stack

The SF ERP system follows a modern client-server architecture, containerized for reliable deployment and scalability.

## High-Level Architecture

```text
[ Client (React/Vite) ] <--- HTTP/JSON ---> [ Server (Node.js/Express) ] <---> [ Database (MySQL) ]
                                                   |
                                                   |---> [ File System (Uploads) ]
```

## Technology Stack

### Frontend
- **Framework**: [React.js](https://reactjs.org/) (Vite for build tooling)
- **Styling**: Vanilla CSS, Bootstrap 5 (for grid/forms), and custom UI components.
- **Icons**: [Iconify](https://iconify.design/) and Font Awesome.
- **Data Fetching**: Axios and Fetch API.
- **Authentication**: JWT stored in Local Storage.

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: Express.js
- **Database**: [MySQL 8.0](https://www.mysql.com/)
- **Database Driver**: `mysql2/promise` (supporting async/await).
- **Security**:
    - `bcryptjs`: For password hashing.
    - `jsonwebtoken`: For auth tokens.
    - `helmet`: For security headers.
    - `cors`: For cross-origin resource sharing.

### Infrastructure
- **Containerization**: [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/).
- **Web Server (Production)**: Nginx (to serve static frontend assets and proxy API requests).

## Database Design

- **Normalization**: Relational schema with primary keys, foreign keys, and indexes for performance.
- **Critical Tables**:
    - `users`: Stores login credentials and role data.
    - `student_master`: Master student profiles.
    - `staff_master`: Master staff profiles.
    - `student_attendance_entry`: Records daily attendance.
    - `sidebar_modules`: Manages dynamic sidebar menu per role.

## Directory Structure

- `/client`: React frontend source code.
- `/server`: Node.js backend source code.
- `/documents`: System documentation (this folder).
- `/cms.sql`: Main database schema dump.
- `docker-compose.yml`: Orchestration for the entire stack.
