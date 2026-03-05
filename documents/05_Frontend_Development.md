# Frontend Development Guide

The frontend is a modern React application built with Vite.

## Project Structure
- `/client/src/components`: Reusable UI components (Navbar, Sidebar, Footer, DataTable).
- `/client/src/pages`: Main page components, organized by feature.
- `/client/src/context`: React Context providers (AuthContext).
- `/client/src/App.jsx`: Main routing logic using `react-router-dom`.
- `/client/src/main.jsx`: Application entry point.

## Pages Organization
- `/client/src/pages/dashboard`: Process-specific dashboards (Admin, Student).
- `/client/src/pages/dashboard/admin/master`: Master data management (Subjects, Semester, Staff).

## Authentication Flow

1.  **Login**: `LoginPage.jsx` sends credentials to `/api/auth/login`.
2.  **Success**: Server returns a JWT token and user info.
3.  **Storage**: `AuthContext.jsx` saves the token in `localStorage`.
4.  **Protected Routes**: The `ProtectedRoute.jsx` component wraps pages to ensure only authenticated users can access them.

## Data Fetching Pattern

Standard fetch or Axios is used. Always include the Authorization header for protected endpoints:

```javascript
const token = localStorage.getItem('token');
const response = await axios.get('/api/users', {
  headers: { Authorization: `Bearer ${token}` }
});
```

## Creating a New Page

1.  Create the `.jsx` file in `/client/src/pages/`.
2.  Define the route in `App.jsx`.
3.  Add the page to the `sidebar_modules` table in the database to make it appear in the navigation menu (linked to the appropriate role).

## Dynamic Sidebar

The sidebar is not hardcoded. It is fetched from the `/api/auth/sidebar` endpoint based on the user's `module_access` string (a comma-separated list of module keys).

## Styling Guidelines

- Use global CSS in `client/src/index.css`.
- Use feature-specific CSS in appropriate folders.
- Follow Bootstrap 5 utility classes for layout and spacing.
