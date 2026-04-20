const express = require('express');
const cors = require('cors');
const { RouterOSClient } = require('routeros-client');

const app = express();
app.use(express.json());
app.use(cors());

const MT_HOST = "123.49.45.77";
const MT_USER = "admin";
const MT_PASS = "n7337*73"; // change this

// Generate Bxxx username
function generateUsername() {
    const num = Math.floor(100 + Math.random() * 900);
    return "B" + num;
}

app.post('/create-user', async (req, res) => {
    const username = generateUsername();
    const password = "1234";

    const client = new RouterOSClient({
        host: MT_HOST,
        user: MT_USER,
        password: MT_PASS,
    });

    try {
        // Handle client errors
        client.on('error', (err) => {
            console.error('RouterOS Client Error:', err.message);
        });

        const conn = await client.connect();

        const um = conn.menu("/user-manager/user");

        // MATCHING YOUR CLI COMMAND
        await um.add({
            name: username,
            password: password,
            group: "default"
        });

        res.json({
            success: true,
            username,
            password
        });

    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});