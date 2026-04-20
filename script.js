const btn = document.getElementById("createBtn");
const resultBox = document.getElementById("resultBox");
const usernameEl = document.getElementById("username");
const passwordEl = document.getElementById("password");
const statusEl = document.getElementById("status");

btn.addEventListener("click", async () => {
    statusEl.innerText = "Creating user...";
    resultBox.classList.add("hidden");

    try {
        const res = await fetch("http://localhost:3000/create-user", {
            method: "POST"
        });

        const data = await res.json();

        if (data.success) {
            usernameEl.innerText = data.username;
            passwordEl.innerText = data.password;

            resultBox.classList.remove("hidden");
            statusEl.innerText = "User created successfully ✅";
        } else {
            statusEl.innerText = "Error: " + data.error;
        }

    } catch (err) {
        statusEl.innerText = "Connection failed ❌";
    }
});