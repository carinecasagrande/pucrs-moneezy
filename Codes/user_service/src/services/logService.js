const { AuditLog } = require("../models");

/**
 * Saves user action in log
 */
const saveLog = async (req, action, user_id) => {
  await AuditLog.create({
    user_id,
    action,
    ip_address: req.ip,
    user_agent: req.headers["user-agent"],
  });
};

module.exports = {
  saveLog,
};
