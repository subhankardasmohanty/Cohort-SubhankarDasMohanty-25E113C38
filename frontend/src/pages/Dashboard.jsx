import Navbar from "../components/Navbar";
import ProjectList from "../components/ProjectList";

function Dashboard() {
  return (
    <div>
      <Navbar />

      <div
        style={{
          display: "flex",
          height: "calc(100vh - 70px)",
        }}
      >
        <ProjectList />

        <div
          style={{
            flex: 1,
            padding: "40px",
          }}
        >
          <h1>Dashboard</h1>

          <p>Select a project or create a new one.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;