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
      return res.status(404).send({
        message: noDataMessage,
      });
    }

    return res.status(200).json({
      data: information.rows,
      message: successMessage,
    });
  } catch (e) {
    console.error("Error fetching data:", e.message);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

module.exports = fetchHelper;
