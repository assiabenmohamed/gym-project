import { User } from "../models/users.js";

export async function verifyAdmin(req, res, next) {
  const { id } = req.cookies.user;

  const userExists = await User.findOne({
    id,
  });

  if (userExists.role != "admin") {
    return res.status(403).json({
      message: "No permissions",
    });
  }

  next();
}
