const express = require("express");
const app = express();
require("dotenv").config();
const { initDatabase } = require("./controllers/initDb.js");
const dp = require("./models/connection.js");
const cors = require("cors");

initDatabase();

PORT = process.env.PORT;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

// 1. Home Route
app.get("/", (req, res) => {
  
  res.status(200).json({
    status: "success",
    message: "Welcome to Home Page",
  });
});

// 2. Get all users
app.get("/users", async (req, res) => {
  
  const checkColumnsQuery = `SELECT * FROM users;`;

  try {
    const result = await dp.query(checkColumnsQuery);

    res.status(200).json({
      status: "success",
      message: "Actual database column names:",
      data: result.rows,
    });
  }
  catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Could not fetch table metadata",
      error: error.message || error,
    });
  }
});

// 3. Add new server
app.post("/user", async (req, res) => {
  
  const { id, name, registration_no, email, password, age } = req.body;

  const createUserQuery = `
        INSERT INTO users (name, registration_no, email, password, age)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, registration_no, email, age;
    `;
  try {
    const result = await dp.query(createUserQuery, [
      name,
      registration_no,
      email,
      password,
      age,
    ]);

    res.status(201).json({
      status: "Success",
      message: "User created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: "User Cannot be created",
      error: error,
    });
  }
});

// 4. Login
app.post("/login", async (req, res) => {
  
  const { name, password } = req.body;

  
  if (!name || !password) {
    return res.status(400).json({
      status: "error",
      message: "Username and password are required",
    });
  }

  const loginQuery = `
        SELECT id, name, registration_no, email, password, age 
        FROM users 
        WHERE name = $1 AND password = $2;
    `;

  try {
    const result = await dp.query(loginQuery, [name, password]);

    
    if (result.rows.length === 0) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    const user = result.rows[0];

    if (user.password !== password) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }
  
    delete user.password;

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred during login",
      error: error.message || error,
    });
  }
});

// 5. Update Profile
app.patch("/profile", async (req, res) => {

  const { currentEmail, currentPassword, email, password, age } = req.body;

  if (!currentEmail || !currentPassword) {
    return res.status(400).json({
      status: "error",
      message:
        "Verification credentials (currentEmail and currentPassword) are required.",
    });
  }

  try {
    
    const verifyQuery = `SELECT * FROM users WHERE email = $1 AND password = $2;`;
    const verifyResult = await dp.query(verifyQuery, [
      currentEmail,
      currentPassword,
    ]);

    if (
      verifyResult.rows.length === 0 ||
      verifyResult.rows[0].password !== currentPassword
    ) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials. Profile modification unauthorized.",
      });
    }

    
    const currentUser = verifyResult.rows[0];

    const updatedEmail = email !== undefined ? email : currentUser.email;
    const updatedPassword =
      password !== undefined ? password : currentUser.password;
    const updatedAge = age !== undefined ? age : currentUser.age;

    
    const updateQuery = `
            UPDATE users 
            SET email = $1, password = $2, age = $3 
            WHERE id = $4
            RETURNING id, name, registration_no, email, age;
        `;

    const updateResult = await dp.query(updateQuery, [
      updatedEmail,
      updatedPassword,
      updatedAge,
      currentUser.id,
    ]);

    
    res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: updateResult.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Profile update failed",
      error: error.message || error,
    });
  }
});

// 6. Delete Profile)
app.delete("/profile", async (req, res) => {
 
  const { email, password } = req.body;

  
  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Email and password are required to delete your account.",
    });
  }

  try {
    
    const verifyQuery = `SELECT id, password FROM users WHERE email = $1 AND password = $2;`;
    const verifyResult = await dp.query(verifyQuery, [email, password]);

    
    if (verifyResult.rows.length === 0) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials. Account deletion unauthorized.",
      });
    }

    const user = verifyResult.rows[0];

    
    if (user.password !== password) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials. Account deletion unauthorized.",
      });
    }

    
    const deleteQuery = `
            DELETE FROM users 
            WHERE id = $1;
        `;
    await dp.query(deleteQuery, [user.id]);

    
    res.status(200).json({
      status: "success",
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while deleting the profile",
      error: error.message || error,
    });
  }
});

app.listen(process.env.PORT, (err) => {
  if (err) console.log(err);

  console.log(`Server is running on port ${PORT}`);
});
