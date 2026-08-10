import { useState } from "react";
import { useParams } from "react-router-dom";
import KanbanBoard from "../components/KanbanBoard";
import TaskModal from "../components/TaskModal";

function ProjectBoard() {
  const { id } = useParams();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTaskCreated = () => {
    setShowTaskModal(false);
    setRefreshKey((currentKey) => currentKey + 1);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 30px",
        }}
      >
        <div>
          <h1>Project Board</h1>
          <p>Project ID: {id}</p>
        </div>

        <button onClick={() => setShowTaskModal(true)}>
          + New Task
        </button>
      </div>

      <KanbanBoard
        key={refreshKey}
        projectId={id}
      />

      {showTaskModal && (
        <TaskModal
          projectId={id}
          onClose={() => setShowTaskModal(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
}

export default ProjectBoard;
