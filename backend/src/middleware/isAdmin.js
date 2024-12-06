const isAdmin = (req, res, next) => {
  if (req.role !== "admin") {
    return res.status(403).send({success: false, message: "Unauthorized" });
  }
  next();
};

module.exports = isAdmin;
