import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        background: "#111827",
        color: "#f8fafc",
        borderBottom: "1px solid #263244",
      }}
    >
      <h2>TaskSync</h2>

      <div>
        <span style={{ marginRight: "20px" }}>
          Welcome {user?.username || "User"}
        </span>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
