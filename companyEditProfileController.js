import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

export const editCompanyProfile = async (req, res) => {
  const { id } = req.params;
  const { name, email, number, bio, image, currentPassword, newPassword } = req.body;

  try {
    
    const [rows] = await pool.query("SELECT * FROM company WHERE company_id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Company not found" });

    const company = rows[0];

    let hashedPassword = company.password;

    if (newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, company.password);
      if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    
    await pool.query(
      `UPDATE company 
       SET name = ?, email = ?, number = ?, bio = ?, image = ?, password = ?
       WHERE company_id = ?`,
      [
        name || company.name,
        email || company.email,
        number || company.number,
        bio || company.bio,
        image || company.image,
        hashedPassword,
        id
      ]
    );

    res.json({ message: "Company profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
