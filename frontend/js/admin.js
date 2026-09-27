
const API_URL = "http://localhost:8081/api";

async function loadAdminDashboard() {

    try {

        // Load users
        const usersResponse = await fetch(`${API_URL}/users`);
const users = await usersResponse.json();

document.getElementById("total-users").innerText = users.length;


// Load hotels
const hotelsResponse = await fetch(`${API_URL}/hotels`);
const hotels = await hotelsResponse.json();

document.getElementById("total-hotels").innerText = hotels.length;


// Load rooms
const roomsResponse = await fetch(`${API_URL}/rooms`);
const rooms = await roomsResponse.json();

document.getElementById("total-rooms").innerText = rooms.length;


// Load bookings
const bookingsResponse = await fetch(`${API_URL}/bookings`);
const bookings = await bookingsResponse.json();

document.getElementById("total-bookings").innerText = bookings.length;


// Load payments
const paymentsResponse = await fetch(`${API_URL}/payments`);
const payments = await paymentsResponse.json();

document.getElementById("total-payments").innerText = payments.length;


// Display all bookings
displayBookings(bookings);

} catch (error) {

    console.error("Admin dashboard error:", error);

    document.getElementById("admin-booking-list").innerHTML =
        "<p>Unable to load admin dashboard data.</p>";
}
}


function displayBookings(bookings) {

    const bookingList =
        document.getElementById("admin-booking-list");

    if (bookings.length === 0) {

        bookingList.innerHTML =
            "<p>No bookings available.</p>";

        return;
    }


    bookingList.innerHTML = "";


    bookings.forEach(booking => {

        const card = document.createElement("div");

        card.className = "admin-booking-card";


        card.innerHTML = `

            <h3>Booking #${booking.id}</h3>

            <p>
                <strong>Customer:</strong>
                ${booking.user ? booking.user.name : "Unknown"}
            </p>

            <p>
                <strong>Email:</strong>
                ${booking.user ? booking.user.email : "Unknown"}
            </p>

            <p>
                <strong>Room:</strong>
                ${booking.room ? booking.room.roomNumber : "Unknown"}
            </p>

            <p>
                <strong>Check-in:</strong>
                ${booking.checkInDate}
            </p>

            <p>
                <strong>Check-out:</strong>
                ${booking.checkOutDate}
            </p>

            <p>
                <strong>Total Amount:</strong>
                ₹${booking.totalAmount}
            </p>

            <p>
                <strong>Status:</strong>
                ${booking.status}
            </p>

        `;


        bookingList.appendChild(card);

    });
}


loadAdminDashboard();

