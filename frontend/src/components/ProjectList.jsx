import { useEffect, useState } from "react";
import client from "../api/client";
import ProjectModal from "./ProjectModal";
import { useNavigate } from "react-router-dom";

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setError("");

        const response = await client.get("/projects");

        setProjects(
          response.data.projects ||
            response.data.data ||
            []
        );
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to load projects."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleDelete = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await client.delete(`/projects/${projectId}`);

      setProjects((currentProjects) =>
        currentProjects.filter(
          (project) => project.id !== projectId
        )
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to delete project."
      );
    }
  };

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
        onClick={() => {
          setEditingProject(null);
          setShowModal(true);
        }}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        + New Project
      </button>

      {loading && <p>Loading projects...</p>}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        projects.length === 0 && (
          <p>No projects yet.</p>
        )}

      {!loading &&
        projects.length > 0 && (
          <div>
            {projects.map((project) => (
              <div
                key={project.id}
                style={{
                  padding: "12px",
                  marginBottom: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                }}
              >
                <div
                  onClick={() =>
                    navigate(`/project/${project.id}`)
                  }
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <h3>{project.name}</h3>

                  {project.description && (
                    <p>{project.description}</p>
                  )}
                </div>

                <div style={{ marginTop: "10px" }}>
                  <button
                    onClick={() => {
                      setEditingProject(project);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(project.id)
                    }
                    style={{ marginLeft: "8px" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      {showModal && (
        <ProjectModal
          project={editingProject}
          onClose={() => {
            setShowModal(false);
            setEditingProject(null);
          }}
          onProjectCreated={(newProject) => {
            setProjects((currentProjects) => [
              ...currentProjects,
              newProject,
            ]);
          }}
          onProjectUpdated={(updatedProject) => {
            setProjects((currentProjects) =>
              currentProjects.map((project) =>
                project.id === updatedProject.id
                  ? updatedProject
                  : project
              )
            );
          }}
        />
      )}
    </div>
  );
}

export default ProjectList;