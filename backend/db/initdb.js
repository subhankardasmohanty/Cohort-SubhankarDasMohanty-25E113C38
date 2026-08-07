const fs = require("fs");
const path = require("path");
const { query } = require("../models/connection");

const initDatabase = async () => {
    try {
        const sql = fs.readFileSync(
            path.join(__dirname, "initdb.sql"),
            "utf8"
        );

        await query(sql);

        console.log("Database initialized successfully.");
    } catch (error) {
        console.error("Database initialization failed:");
        console.error(error);

        process.exit(1);
    }
};

module.exports = {
    initDatabase,
};