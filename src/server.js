require("dotenv").config();

const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        const connection = await pool.getConnection();
        console.log("✅ Connected to MySQL");
        connection.release();

        app.listen(PORT, () => {
            console.log(` Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
    }
}

startServer();