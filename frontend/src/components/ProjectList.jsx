import { useEffect, useState } from "react";
import client from "../api/client";
import ProjectModal from "./ProjectModal";
import { useNavigate } from "react-router-dom";

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setError("");

        const response = await client.get("/projects");

        setProjects(response.data.projects || response.data.data || []);
      } catch (error) {
        console.error(error);

        setError(error.response?.data?.message || "Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

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
        onClick={() => setShowModal(true)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        + New Project
      </button>

      {loading && <p>Loading projects...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && projects.length === 0 && <p>No projects yet.</p>}

      {!loading && !error && projects.length > 0 && (
        <div>
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/project/${project.id}`)}
              style={{
                padding: "12px",
                marginBottom: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              <h3>{project.name}</h3>

              {project.description && <p>{project.description}</p>}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ProjectModal
          onClose={() => setShowModal(false)}
          onProjectCreated={(newProject) => {
            setProjects((currentProjects) => [...currentProjects, newProject]);
          }}
        />
      )}

    </div>
  );
}

export default ProjectList;
