import { useState } from "react";
import client from "../api/client";

function TaskModal({ projectId, onClose, onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await client.post("/tasks", {
        project_id: Number(projectId),
        title: title.trim(),
        description: description.trim(),
        status,
      });

      const newTask = response.data.task || response.data.data;

      onTaskCreated(newTask);

      setTitle("");
      setDescription("");
      setStatus("todo");

      onClose();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to create task."
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
        <h2>Create Task</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              boxSizing: "border-box",
            }}
          />

          <textarea
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              boxSizing: "border-box",
            }}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
            }}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>

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
            {loading ? "Creating..." : "Create Task"}
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

export default TaskModal;