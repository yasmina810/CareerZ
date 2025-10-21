import { pool } from "../config/db.js";

export const getCompanyProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query("SELECT company_id, name, email, number, bio, image FROM company WHERE company_id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Company not found" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
