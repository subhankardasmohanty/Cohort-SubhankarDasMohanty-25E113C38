import { useState } from "react";
import client from "../api/client";

function ProjectModal({
  project,
  onClose,
  onProjectCreated,
  onProjectUpdated,
}) {
  const isEditing = !!project;

  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(
    project?.description || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (isEditing) {
        const response = await client.patch(
          `/projects/${project.id}`,
          {
            name: name.trim(),
            description: description.trim(),
          }
        );

        const updatedProject =
          response.data.project || response.data.data;

        onProjectUpdated(updatedProject);
      } else {
        const response = await client.post("/projects", {
          name: name.trim(),
          description: description.trim(),
        });

        const newProject =
          response.data.project || response.data.data;

        onProjectCreated(newProject);
      }

      onClose();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "create"} project.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "8px",
          width: "400px",
        }}
      >
        <h2>{isEditing ? "Edit Project" : "Create Project"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              boxSizing: "border-box",
            }}
          />

          <textarea
            placeholder="Project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            rows="4"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              boxSizing: "border-box",
            }}
          />

          {error && (
            <p style={{ color: "red" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? isEditing
                ? "Saving..."
                : "Creating..."
              : isEditing
                ? "Save Changes"
                : "Create Project"}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProjectModal;