const { query } = require("../models/connection");

const createProject = async (req, res) => {

    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Project name is required."
        });
    }

    const ownerId = req.user.id;

    try {

        // Create Project
        const createProjectQuery = `
            INSERT INTO projects
            (name, description, owner_id)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;

        const projectResult = await query(
            createProjectQuery,
            [name, description, ownerId]
        );

        const project = projectResult.rows[0];

        // Add Owner to Project Members
        const addOwnerQuery = `
            INSERT INTO project_members
            (project_id, user_id, role)
            VALUES ($1, $2, 'owner');
        `;

        await query(
            addOwnerQuery,
            [project.id, ownerId]
        );

        return res.status(201).json({
            success: true,
            message: "Project created successfully.",
            project
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Project creation failed.",
            error: error.message
        });

    }

};


const getProjects = async (req, res) => {

    const userId = req.user.id;

    try {

        const getProjectsQuery = `
            SELECT
                id,
                name,
                description,
                owner_id,
                created_at
            FROM projects
            WHERE owner_id = $1
            ORDER BY created_at DESC;
        `;

        const result = await query(
            getProjectsQuery,
            [userId]
        );

        return res.status(200).json({
            success: true,
            count: result.rows.length,
            projects: result.rows,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to fetch projects.",
            error: error.message,
        });

    }

};

const getProjectById = async (req, res) => {

    const projectId = req.params.id;
    const userId = req.user.id;

    try {

        const getProjectQuery = `
            SELECT *
            FROM projects
            WHERE id = $1
            AND owner_id = $2;
        `;

        const result = await query(
            getProjectQuery,
            [projectId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }

        return res.status(200).json({
            success: true,
            project: result.rows[0]
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to fetch project.",
            error: error.message
        });

    }

};

const updateProject = async (req, res) => {

    const projectId = req.params.id;
    const userId = req.user.id;

    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Project name is required."
        });
    }

    try {

        const updateProjectQuery = `
            UPDATE projects
            SET
                name = $1,
                description = $2
            WHERE
                id = $3
                AND owner_id = $4
            RETURNING *;
        `;

        const result = await query(
            updateProjectQuery,
            [
                name,
                description,
                projectId,
                userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Project updated successfully.",
            project: result.rows[0]
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to update project.",
            error: error.message
        });

    }

};

const deleteProject = async (req, res) => {

    const projectId = req.params.id;
    const userId = req.user.id;

    try {

        const deleteProjectQuery = `
            DELETE FROM projects
            WHERE
                id = $1
                AND owner_id = $2
            RETURNING *;
        `;

        const result = await query(
            deleteProjectQuery,
            [
                projectId,
                userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Project not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully."
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to delete project.",
            error: error.message
        });

    }

};

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
};