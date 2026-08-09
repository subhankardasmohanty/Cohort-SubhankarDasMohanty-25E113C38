const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { query } = require("../models/connection");

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  try {
    const checkUserQuery = `
        SELECT * FROM users
        WHERE username = $1 OR email = $2;
    `;

    const existingUser = await query(checkUserQuery, [username, email]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Username or Email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUserQuery = `
    INSERT INTO users (username, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, username, email, created_at;
    `;

    const newUser = await query(insertUserQuery, [
      username,
      email,
      hashedPassword,
    ]);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: newUser.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and Password are required.",
    });
  }

  try {
    const findUserQuery = `
      SELECT id, username, email, password_hash
      FROM users
      WHERE email = $1;
    `;
    const result = await query(findUserQuery, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
