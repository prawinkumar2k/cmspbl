import db from '../db.js';

/**
 * Log user activity to log_details table
 * @param {string} username - The username of the user performing the action
 * @param {string} role - The role of the user
 * @param {string} action - Description of the action taken
 * @returns {Promise<void>}
 */
export const logActivity = async (username, role, action) => {
  try {
    const query = `
      INSERT INTO log_details (username, role, login_date, action, CreatedAt, UpdatedAt)
      VALUES (?, ?, NOW(), ?, NOW(), NOW())
    `;
    
    await db.query(query, [username, role, action]);
    console.log(`✅ Activity logged: ${username} (${role}) - ${action}`);
  } catch (error) {
    console.error('❌ Error logging activity:', error.message);
    // Don't throw error to prevent activity logging from breaking the main flow
  }
};

/**
 * Log user login activity
 * @param {string} username - The username of the user logging in
 * @param {string} role - The role of the user
 * @returns {Promise<void>}
 */
export const logLogin = async (username, role) => {
  const action = `Logged in`;
  await logActivity(username, role, action);
};

/**
 * Log user logout activity
 * @param {string} username - The username of the user logging out
 * @param {string} role - The role of the user
 * @returns {Promise<void>}
 */
export const logLogout = async (username, role) => {
  const action = 'Logged out';
  await logActivity(username, role, action);
};

/**
 * Middleware to log all user activities
 * This middleware should be used after authentication middleware
 */
export const activityLoggerMiddleware = async (req, res, next) => {
  // Only log if user is authenticated
  if (req.user && req.user.username && req.user.role_name) {
    const method = req.method;
    const path = req.path;
    const action = `${method} request to ${path}`;
    
    // Log activity asynchronously without waiting
    logActivity(req.user.username, req.user.role_name, action).catch(err => {
      console.error('Activity logging failed:', err);
    });
  }
  
  next();
};

export default {
  logActivity,
  logLogin,
  logLogout,
  activityLoggerMiddleware
};
