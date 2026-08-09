const { query } = require("../models/connection");

const createTask = async (req, res) => {

    const {
        title,
        description,
        priority,
        due_date,
        project_id,
        assigned_to,
    } = req.body;

    if (!title || !project_id) {
        return res.status(400).json({
            success: false,
            message: "Title and Project ID are required.",
        });
    }

    try {

        // Check Project Exists
        const checkProjectQuery = `
            SELECT id
            FROM projects
            WHERE id = $1;
        `;

        const project = await query(
            checkProjectQuery,
            [project_id]
        );

        if (project.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Project not found.",
            });
        }

        // Insert Task
        const createTaskQuery = `
            INSERT INTO tasks
            (
                title,
                description,
                priority,
                due_date,
                project_id,
                assigned_to
            )
            VALUES
            (
                $1,$2,$3,$4,$5,$6
            )
            RETURNING *;
        `;

        const task = await query(
            createTaskQuery,
            [
                title,
                description,
                priority,
                due_date,
                project_id,
                assigned_to,
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Task created successfully.",
            task: task.rows[0],
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Task creation failed.",
            error: error.message,
        });

    }

};

const getTasks = async (req, res) => {

    const { projectId } = req.params;

    try {

        const getTasksQuery = `
            SELECT
                id,
                title,
                description,
                status,
                priority,
                due_date,
                assigned_to,
                created_at
            FROM tasks
            WHERE project_id = $1
            ORDER BY created_at DESC;
        `;

        const result = await query(
            getTasksQuery,
            [projectId]
        );

        return res.status(200).json({
            success: true,
            count: result.rows.length,
            tasks: result.rows,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to fetch tasks.",
            error: error.message,
        });

    }

};

const updateTask = async (req, res) => {

    const taskId = req.params.id;

    const {
        title,
        description,
        priority,
        due_date,
        assigned_to,
    } = req.body;

    if (!title) {
        return res.status(400).json({
            success: false,
            message: "Task title is required.",
        });
    }

    try {

        const updateTaskQuery = `
            UPDATE tasks
            SET
                title = $1,
                description = $2,
                priority = $3,
                due_date = $4,
                assigned_to = $5
            WHERE id = $6
            RETURNING *;
        `;

        const result = await query(
            updateTaskQuery,
            [
                title,
                description,
                priority,
                due_date,
                assigned_to,
                taskId,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task updated successfully.",
            task: result.rows[0],
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Task update failed.",
            error: error.message,
        });

    }

};

const updateTaskStatus = async (req, res) => {

    const taskId = req.params.id;

    const { status } = req.body;

    const validStatus = [
        "todo",
        "in_progress",
        "done",
    ];

    if (!validStatus.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid task status.",
        });
    }

    try {

        const updateStatusQuery = `
            UPDATE tasks
            SET status = $1
            WHERE id = $2
            RETURNING *;
        `;

        const result = await query(
            updateStatusQuery,
            [
                status,
                taskId,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task status updated successfully.",
            task: result.rows[0],
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Status update failed.",
            error: error.message,
        });

    }

};

const deleteTask = async (req, res) => {

    const taskId = req.params.id;

    try {

        const deleteTaskQuery = `
            DELETE FROM tasks
            WHERE id = $1
            RETURNING *;
        `;

        const result = await query(
            deleteTaskQuery,
            [taskId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Task deleted successfully.",
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Task deletion failed.",
            error: error.message,
        });

    }

};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    updateTaskStatus,
    deleteTask,
};