import jwt from "jsonwebtoken";

const generateCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("session", token, {
    httpOnly: true,
    secure: false,        // ✅ false for local development
    sameSite: "lax",      // ✅ changed from "None" to "lax"
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateCookie;