const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createTask,
    getTasks,
    updateTask,
    updateTaskStatus,
    deleteTask
} = require("../controllers/taskController");

router.post("/", authMiddleware, createTask);

router.get("/:projectId", authMiddleware, getTasks);

router.patch("/:id", authMiddleware, updateTask);

router.patch("/:id/status", authMiddleware, updateTaskStatus);

router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;