const pool = require("../database/postgres");

const fetchHelper = async (
  fetchQuery,
  params,
  res,
  noDataMessage,
  successMessage,
) => {
  try {
    const information = await pool.query(fetchQuery, params);
    if (information.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: noDataMessage,
      });
    }
    else {
      return res.status(200).json({
      success: true,
      data: information.rows,
      message: successMessage,
    }); } 
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = fetchHelper;