import { pool } from "../config/db.js";

// This assumes multer is configured in your route to handle `profile_image`
export const editUser = async (req, res) => {
  try {
    // user_id should come from req.user (decoded JWT) or frontend
    const { user_id } = req.body; 
    const { name,email, phone, linkedin, bio ,user_cv} = req.body;
    const profileImage = req.file ? req.file.filename : null; // multer stores file info

    // 1. Check if user exists
    const [rows] = await pool.query("SELECT * FROM user WHERE user_id = ?", [user_id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    // 2. Update fields (fallback to existing values if not provided)
    await pool.query(
      `UPDATE user 
       SET user_name = ?, email = ?, phone_number = ?, user_image = ?,  bio = ?,user_cv = ?,linkedin_url = ?
       WHERE user_id = ?`,
      [
        name || user.user_name,
        email || user.email,
        phone || user.phone_number,
        profileImage || user.user_image, // keep old image if not uploading new one
        bio || user.bio,
        user_cv || user.user_cv,
        linkedin || user.linkedin_url,
        user_id
      ]
    );

    res.json({ message: "Profile updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
