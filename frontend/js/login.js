
const API_URL = "http://localhost:8081/api";

document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const message = document.getElementById("login-message");

    try {
        const response = await fetch(`${API_URL}/users`);

if (!response.ok) {
    throw new Error("Unable to fetch users");
}

const users = await response.json();

const user = users.find(
    user => user.email === email && user.password === password
);

if (user) {
    localStorage.setItem("loggedInUserId", user.id);
    localStorage.setItem("loggedInUserName", user.name);
    localStorage.setItem("loggedInUserEmail", user.email);

    message.style.color = "green";
    message.textContent = "Login successful! Redirecting...";

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000);

} else {
    message.style.color = "red";
    message.textContent = "Invalid email or password.";
}

} catch (error) {
    message.style.color = "red";
    message.textContent = "Unable to connect to the server.";
    console.error(error);
}
});

