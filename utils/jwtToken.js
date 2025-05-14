export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();

  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only secure in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // allow in cross-origin only in prod
    })
    .json({
      success: true,
      message,
      token,
      user,
    });
};
