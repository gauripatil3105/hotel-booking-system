
const API_URL = "http://localhost:8081/api";

document.getElementById("register-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const phone = document.getElementById("register-phone").value;
    const password = document.getElementById("register-password").value;
    const message = document.getElementById("register-message");

    const userData = {
        name: name,
        email: email,
        phone: phone,
        password: password
    };

    try {
        const response = await fetch(`${API_URL}/users`, {
method: "POST",
    headers: {
    "Content-Type": "application/json"
},
body: JSON.stringify(userData)
});

const data = await response.json();

if (response.ok) {
    message.style.color = "green";
    message.textContent = "Registration successful! Redirecting to login...";

    document.getElementById("register-form").reset();

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);

} else {
    message.style.color = "red";

    if (data.messages) {
        message.textContent = Object.values(data.messages).join(", ");
    } else {
        message.textContent = data.message || "Registration failed.";
    }
}

} catch (error) {
    message.style.color = "red";
    message.textContent = "Unable to connect to the server.";
    console.error(error);
}
});

