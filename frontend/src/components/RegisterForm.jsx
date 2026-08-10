import { useState } from "react";
import client from "../api/client";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await client.post("/auth/register", {
        username,
        email,
        password,
      });

      alert(response.data.message);

      setUsername("");
      setEmail("");
      setPassword("");

      console.log(response.data);
    } catch (error) {
      console.error(error.response?.data || error.message);

      alert(
        error.response?.data?.message || "Registration failed."
      );
    }
  };

  return (
    <div className="container">
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <br />
        <br />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br />
        <br />

        <button type="submit">
          Register
        </button>

      </form>
    </div>
  );
}

export default RegisterForm;
