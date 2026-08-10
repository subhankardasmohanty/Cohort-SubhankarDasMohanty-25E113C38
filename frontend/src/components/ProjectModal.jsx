import { useState } from "react";
import client from "../api/client";

function ProjectModal({ onClose, onProjectCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
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

      const response = await client.post("/projects", {
        name,
        description,
      });

      const newProject =
        response.data.project || response.data.data;

      onProjectCreated(newProject);

      setName("");
      setDescription("");

      onClose();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to create project."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
        <h2>Create Project</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
            }}
          />

          <textarea
            placeholder="Project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
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
            style={{
              marginRight: "10px",
              padding: "10px 15px",
            }}
          >
            {loading ? "Creating..." : "Create Project"}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              padding: "10px 15px",
            }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProjectModal;