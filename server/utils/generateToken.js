import jwt from "jsonwebtoken";

export const generateToken = (res, user) => {
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  // Set the cookie
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
};
