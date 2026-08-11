import { useState } from "react";
import client from "../api/client";

function TaskCard({ task, onTaskUpdated, onTaskDeleted }) {
  const [isEditing, setIsEditing] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await client.patch(`/tasks/${task.id}`, {
        title: title.trim(),
        description: description.trim(),
      });

      const updatedTask = response.data.task || response.data.data;

      onTaskUpdated(updatedTask);

      setIsEditing(false);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Failed to update task.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      await client.delete(`/tasks/${task.id}`);

      onTaskDeleted(task.id);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Failed to delete task.");

      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      setError("");

      const response = await client.patch(`/tasks/${task.id}/status`, {
        status: newStatus,
      });

      const updatedTask = response.data.task || response.data.data;

      onTaskUpdated(updatedTask);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "Failed to update task status.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div
        style={{
          background: "#151e2e",
          padding: "15px",
          marginTop: "10px",
          borderRadius: "6px",
          border: "1px solid #263244",
        }}
      >
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            disabled={loading}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              boxSizing: "border-box",
            }}
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
            disabled={loading}
            rows="3"
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              boxSizing: "border-box",
            }}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            onClick={() => setIsEditing(false)}
            disabled={loading}
            style={{ marginLeft: "8px" }}
          >
            Cancel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#151e2e",
        padding: "15px",
        marginTop: "10px",
        borderRadius: "6px",
        border: "1px solid #263244",
      }}
    >
      <h3>{task.title}</h3>

      {task.description && <p>{task.description}</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => setIsEditing(true)} disabled={loading}>
          Edit
        </button>

        <button
          onClick={handleDelete}
          disabled={loading}
          style={{
            marginLeft: "8px",
            background: "#ef4444",
          }}
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>

      <div
        style={{
          marginTop: "14px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <label
          style={{
            color: "#94a3b8",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          Status:
        </label>

        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={loading}
          style={{
            background: "#111827",
            color: "#f8fafc",
            border: "1px solid #263244",
            borderRadius: "8px",
            padding: "8px 12px",
            fontSize: "14px",
            outline: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  );
}

export default TaskCard;
