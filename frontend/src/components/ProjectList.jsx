function ProjectList() {
  return (
    <div
      style={{
        width: "300px",
        padding: "20px",
        borderRight: "1px solid #ddd",
      }}
    >
      <h2>Projects</h2>

      <button
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        + New Project
      </button>

      <p>No projects yet.</p>
    </div>
  );
}

export default ProjectList;