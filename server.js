const express = require('express');
const { RouterOSClient } = require('routeros-client');
const path = require('path');

const app = express();
app.use(express.json());

// ✅ Serve frontend files (index.html, css, js)
app.use(express.static(path.join(__dirname)));

// 🔐 MikroTik credentials
const MT_HOST = "123.49.45.77";
const MT_USER = "admin";
const MT_PASS = "n7337*73"; // ⚠️ change or use env later

// 🔢 Generate Bxxx username
function generateUsername() {
    const num = Math.floor(100 + Math.random() * 900);
    return "B" + num;
}

// 🚀 API endpoint
app.post('/create-user', async (req, res) => {
    const username = generateUsername();
    const password = "1234";

    const client = new RouterOSClient({
        host: MT_HOST,
        user: MT_USER,
        password: MT_PASS,
    });

    try {
        const conn = await client.connect();

        const um = conn.menu("/user-manager/user");

        await um.add({
            name: username,
            password: password,
            group: "default"
        });

        // ✅ Send response FIRST (important for stability)
        res.json({
            success: true,
            username,
            password
        });

        // ✅ Then close connection
        await client.close();

    } catch (err) {
        console.log("ERROR:", err);

        res.status(500).json({
            success: false,
            error: err.message
        });

        // Ensure connection closes even on error
        try { await client.close(); } catch {}
    }
});

// 🌐 Dynamic port (Render compatible)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
