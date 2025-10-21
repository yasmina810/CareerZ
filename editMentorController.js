import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

export const editMentor = async (req, res) => {
  const { id } = req.params;
  const { name, phone, linkedin, bio, currentPassword, newPassword } = req.body;

  try {
    
    const [rows] = await pool.query("SELECT * FROM mentors WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Mentor not found" });

    const mentor = rows[0];

    
    let hashedPassword = mentor.password;

    
    if (newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, mentor.password);
      if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    
    await pool.query(
      `UPDATE mentors 
       SET name = ?, phone = ?, linkedin = ?, bio = ?, password = ? 
       WHERE id = ?`,
      [
        name || mentor.name,
        phone || mentor.phone,
        linkedin || mentor.linkedin,
        bio || mentor.bio,
        hashedPassword,
        id
      ]
    );

    res.json({ message: "Mentor profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
