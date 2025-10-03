/**
 * Role-based authorization middleware
 * @param {string|string[]} roles - Allowed roles (e.g., "admin" or ["admin", "user"])
 */
module.exports = function authorize(roles = []) {
  if (typeof roles === "string") roles = [roles];

  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient permissions" });
    }
    next();
  };
};

