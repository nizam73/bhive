const express = require('express');
const RouterOSClient = require('routeros-client').RouterOSClient;
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const MT_HOST = "123.49.45.77";
const MT_USER = "admin";
const MT_PASS = "pass*73";

function generateUsername() {
    return "B" + Math.floor(100 + Math.random() * 900);
}

app.post('/create-user', async (req, res) => {
    const username = generateUsername();
    const password = "1234";

    const client = new RouterOSClient({
        host: MT_HOST,
        user: MT_USER,
        password: MT_PASS,
        port: 8728
    });

    try {
        const conn = await client.connect();

        const um = conn.menu("/ip/hotspot/user");

        await um.add({
            name: username,
            password: password
        });

        res.json({
            success: true,
            username,
            password
        });

        await client.close();

    } catch (err) {
        console.log("ERROR:", err);

        res.status(500).json({
            success: false,
            error: err.message
        });

        try { await client.close(); } catch {}
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
