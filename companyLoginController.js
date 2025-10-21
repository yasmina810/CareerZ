import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findCompanyByEmail } from "../model/CompanyModel.js";

export async function companyLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const company = await findCompanyByEmail(email);
    if (!company) return res.status(400).json({ error: "Email not registered" });

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: company.company_id, name: company.name, email: company.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
