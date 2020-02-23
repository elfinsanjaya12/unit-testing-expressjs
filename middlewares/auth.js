const jwt = require("jsonwebtoken");

module.exports = {
  auth: (req, res, next) => {

    if (!req.headers.authorization) {
      return res.status(401).json({ message: "not authenticated" });
    }

    const secretKey = process.env.JWT_SECRET_KEY || "secret";

    const token = req.headers.authorization.split(" ")[1];

    try {
      const user = jwt.verify(token, secretKey);
      if (user) {
        req.user = user;
        return next();
      }
      return res.status(401).json({ message: "token invalid" });
    } catch (error) {
      res.send(error);
    }
  }
}