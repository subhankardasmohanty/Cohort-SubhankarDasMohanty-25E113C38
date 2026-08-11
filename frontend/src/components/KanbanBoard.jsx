import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import client from "../api/client";
import TaskCard from "./TaskCard";

function KanbanBoard({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setError("");

        const response = await client.get(`/tasks/${projectId}`);

        setTasks(response.data.tasks || []);
      } catch (error) {
        console.error(error);

        setError(error.response?.data?.message || "Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [projectId]);

  const columns = [
    {
      id: "todo",
      title: "To Do",
    },
    {
      id: "in_progress",
      title: "In Progress",
    },
    {
      id: "done",
      title: "Done",
    },
  ];

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // User dropped the task outside a column
    if (!destination) {
      return;
    }

    // User dropped the task in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const taskId = Number(draggableId);
    const newStatus = destination.droppableId;

    // Optimistically update the UI
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      ),
    );

    try {
      const response = await client.patch(`/tasks/${taskId}/status`, {
        status: newStatus,
      });

      const updatedTask = response.data.task || response.data.data;

      if (updatedTask) {
        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task,
          ),
        );
      }
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message || "Failed to update task status.",
      );

      // Revert the optimistic update
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? { ...task, status: source.droppableId } : task,
        ),
      );
    }
  };

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  if (error && tasks.length === 0) {
    return <p>{error}</p>;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div
        style={{
          display: "flex",
          gap: "20px",
          padding: "30px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {columns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.id);

          return (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    flex: 1,
                    minHeight: "500px",
                    padding: "20px",
                    background: "#111827",
                    border: "1px solid #263244",
                    borderRadius: "8px",
                  }}
                >
                  <h2>{column.title}</h2>

                  {columnTasks.length === 0 && <p>No tasks yet.</p>}

                  {columnTasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={String(task.id)}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard
                            task={task}
                            onTaskUpdated={(updatedTask) => {
                              setTasks((currentTasks) =>
                                currentTasks.map((currentTask) =>
                                  currentTask.id === updatedTask.id
                                    ? updatedTask
                                    : currentTask,
                                ),
                              );
                            }}
                            onTaskDeleted={(deletedTaskId) => {
                              setTasks((currentTasks) =>
                                currentTasks.filter(
                                  (currentTask) =>
                                    currentTask.id !== deletedTaskId,
                                ),
                              );
                            }}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
}

export default KanbanBoard;
