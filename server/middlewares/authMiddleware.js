import jwt from 'jsonwebtoken';

// Verify JWT Token
export const verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access denied. Invalid token format.' });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
    );

    // Attach user data to request object
    req.user = {
      id: decoded.user_id,
      user_id: decoded.user_id,
      username: decoded.username,
      role_id: decoded.role_id,
      role_name: decoded.role_name,
      staff_name: decoded.staff_name,
      staff_id: decoded.staff_id,
      module_access: decoded.module_access
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please login again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    console.error('Token verification error:', error);
    return res.status(500).json({ error: 'Token verification failed.' });
  }
};

// Authorize specific roles
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated (verifyToken should run before this)
      if (!req.user || !req.user.role_name) {
        return res.status(401).json({ error: 'Authentication required.' });
      }

      // Check if user's role is in the allowed roles list
      const userRole = req.user.role_name.toLowerCase();
      const hasPermission = allowedRoles.some(
        role => role.toLowerCase() === userRole
      );

      if (!hasPermission) {
        return res.status(403).json({ 
          error: 'Access denied. You do not have permission to access this resource.',
          requiredRoles: allowedRoles,
          userRole: req.user.role_name
        });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({ error: 'Authorization failed.' });
    }
  };
};

// Check if user has access to specific module
export const checkModuleAccess = (requiredModule) => {
  return (req, res, next) => {
    try {
      // Admin has access to all modules
      if (req.user.role_name.toLowerCase() === 'admin') {
        return next();
      }

      // Check if user has module access
      const userModules = req.user.module_access 
        ? req.user.module_access.split(',') 
        : [];

      if (userModules.includes(requiredModule)) {
        return next();
      }

      return res.status(403).json({ 
        error: 'Access denied. You do not have access to this module.',
        requiredModule,
        userModules
      });
    } catch (error) {
      console.error('Module access check error:', error);
      return res.status(500).json({ error: 'Module access verification failed.' });
    }
  };
};
