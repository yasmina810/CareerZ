import bcrypt from "bcrypt";
import { createCompany, findCompanyByEmail } from "../model/CompanyModel.js";

export async function companySignUp(req, res) {
  try {
    const { name, email, password, confirmPassword, number, bio, image } = req.body;

    if (!name || !email || !password || !confirmPassword || !number) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: "Invalid email format" });

    // email exists
    const existing = await findCompanyByEmail(email);
    if (existing) return res.status(400).json({ error: "Email already exists" });

    // password check
    if (password !== confirmPassword) return res.status(400).json({ error: "Passwords do not match" });
    if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const companyId = await createCompany(name, email, hashedPassword, number, bio, image);

    res.status(201).json({ message: "Company registered successfully", companyId });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
