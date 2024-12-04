const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
    });
    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to log out, please try again later.",
    });
  }
};

module.exports = logout;
