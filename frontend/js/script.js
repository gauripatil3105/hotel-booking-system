
const API_URL = "http://localhost:8081/api";


// =====================================================
// LOAD HOTELS
// =====================================================

async function loadHotels() {

    const hotelList =
        document.getElementById("hotel-list");

    try {

        const response =
            await fetch(`${API_URL}/hotels`);

const hotels =
    await response.json();

if (!response.ok) {

    hotelList.innerHTML =
        "<p>Unable to load hotels.</p>";

    return;
}

if (hotels.length === 0) {

    hotelList.innerHTML =
        "<p>No hotels available.</p>";

    return;
}

displayHotels(hotels);

} catch (error) {

    console.error(
        "Hotel loading error:",
        error
    );

    hotelList.innerHTML =
        "<p>Unable to connect to the server.</p>";
}
}


// =====================================================
// DISPLAY HOTELS
// =====================================================

function displayHotels(hotels) {

    const hotelList =
        document.getElementById("hotel-list");

    hotelList.innerHTML = "";


    hotels.forEach(hotel => {

        const card =
            document.createElement("div");

        card.className =
            "hotel-card";


        card.innerHTML = `

            <h3>
                ${hotel.name}
            </h3>

            <p>
                Location:
                ${hotel.location}
            </p>

            <p>
                ${hotel.description}
            </p>

            <p>
                Contact:
                ${hotel.contactNumber}
            </p>

            <button
                onclick="viewHotel(${hotel.id})">

                View Rooms

            </button>

        `;


        hotelList.appendChild(card);

    });
}


// =====================================================
// VIEW HOTEL ROOMS
// =====================================================

async function viewHotel(hotelId) {

    const roomList =
        document.getElementById("room-list");


    roomList.innerHTML =
        "<p>Loading rooms...</p>";


    try {

        const response =
            await fetch(`${API_URL}/rooms`);

        const rooms =
            await response.json();


        if (!response.ok) {

            roomList.innerHTML =
                "<p>Unable to load rooms.</p>";

            return;
        }


        const hotelRooms =
            rooms.filter(
                room =>
                    room.hotel &&
                    room.hotel.id === hotelId
            );


        if (hotelRooms.length === 0) {

            roomList.innerHTML =
                "<p>No rooms available for this hotel.</p>";

            return;
        }


        roomList.innerHTML = "";


        hotelRooms.forEach(room => {

            const card =
                document.createElement("div");

            card.className =
                "room-card";


            card.innerHTML = `

                <h3>
                    Room ${room.roomNumber}
                </h3>

                <p>
                    Type:
                    ${room.roomType}
                </p>

                <p>
                    Price:
                    ₹${room.pricePerNight} / night
                </p>

                <button
                    onclick="bookRoom(
                        ${room.id},
                        ${room.pricePerNight}
                    )">

                    Book Now

                </button>

            `;


            roomList.appendChild(card);

        });


        document
            .getElementById("rooms")
            .scrollIntoView({
                behavior: "smooth"
            });


    } catch (error) {

        console.error(
            "Room loading error:",
            error
        );

        roomList.innerHTML =
            "<p>Unable to connect to the server.</p>";
    }
}


// =====================================================
// SELECT ROOM FOR BOOKING
// =====================================================

function bookRoom(
    roomId,
    pricePerNight
) {

    const userId =
        localStorage.getItem(
            "loggedInUserId"
        );


    const userName =
        localStorage.getItem(
            "loggedInUserName"
        );


    if (!userId) {

        alert(
            "Please login before booking a room."
        );

        window.location.href =
            "login.html";

        return;
    }


    document
        .getElementById("selected-room-id")
        .value = roomId;


    document
        .getElementById("selected-room")
        .value =
        "Room selected - ₹" +
        pricePerNight +
        " per night";


    document
        .getElementById("booking-user-id")
        .value = userId;


    document
        .getElementById("booking-user-name")
        .value = userName;


    document
        .getElementById("booking")
        .scrollIntoView({
            behavior: "smooth"
        });


    setMinimumBookingDate();
}


// =====================================================
// CALCULATE BOOKING PRICE
// =====================================================

async function calculateBookingPrice() {

    const roomId =
        document.getElementById(
            "selected-room-id"
        ).value;


    const checkIn =
        document.getElementById(
            "booking-check-in"
        ).value;


    const checkOut =
        document.getElementById(
            "booking-check-out"
        ).value;


    const priceElement =
        document.getElementById(
            "booking-price"
        );


    if (
        !roomId ||
        !checkIn ||
        !checkOut
    ) {

        priceElement.innerText = "";

        return;
    }


    const start =
        new Date(checkIn);


    const end =
        new Date(checkOut);


    if (end <= start) {

        priceElement.innerText =
            "Check-out date must be after check-in date.";

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/rooms/${roomId}`
            );


        const room =
            await response.json();


        if (!response.ok) {

            priceElement.innerText =
                "Unable to calculate price.";

            return;
        }


        const millisecondsPerDay =
            1000 * 60 * 60 * 24;


        const nights =
            Math.round(
                (end - start) /
                millisecondsPerDay
            );


        const total =
            nights *
            room.pricePerNight;


        priceElement.innerText =
            `${nights} night(s) × ₹${room.pricePerNight} = ₹${total}`;


    } catch (error) {

        console.error(
            "Price calculation error:",
            error
        );


        priceElement.innerText =
            "Unable to calculate price.";
    }
}


// =====================================================
// CREATE BOOKING
// =====================================================

async function createBooking() {

    const roomId =
        document.getElementById(
            "selected-room-id"
        ).value;


    const userId =
        document.getElementById(
            "booking-user-id"
        ).value;


    const checkIn =
        document.getElementById(
            "booking-check-in"
        ).value;


    const checkOut =
        document.getElementById(
            "booking-check-out"
        ).value;


    const message =
        document.getElementById(
            "booking-message"
        );


    const confirmation =
        document.getElementById(
            "booking-confirmation"
        );


    message.innerText = "";

    confirmation.style.display =
        "none";


    if (!roomId) {

        message.innerText =
            "Please select a room.";

        return;
    }


    if (!userId) {

        message.innerText =
            "Please login before booking.";

        return;
    }


    if (!checkIn || !checkOut) {

        message.innerText =
            "Please select check-in and check-out dates.";

        return;
    }


    const start =
        new Date(checkIn);


    const end =
        new Date(checkOut);


    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    if (start < today) {

        message.innerText =
            "Check-in date cannot be in the past.";

        return;
    }


    if (end <= start) {

        message.innerText =
            "Check-out date must be after check-in date.";

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/bookings`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        checkInDate:
                        checkIn,

                        checkOutDate:
                        checkOut,

                        user: {
                            id:
                                Number(userId)
                        },

                        room: {
                            id:
                                Number(roomId)
                        }

                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            message.innerText =
                data.message ||
                "Booking failed.";

            return;
        }


        message.innerText = "";


        confirmation.innerHTML = `

            <h3>
                Booking Confirmed!
            </h3>

            <p>
                <strong>Booking ID:</strong>
                ${data.id}
            </p>

            <p>
                <strong>Room:</strong>
                ${data.room.roomNumber}
            </p>

            <p>
                <strong>Check-in:</strong>
                ${data.checkInDate}
            </p>

            <p>
                <strong>Check-out:</strong>
                ${data.checkOutDate}
            </p>

            <p>
                <strong>Total Amount:</strong>
                ₹${data.totalAmount}
            </p>

            <p>
                <strong>Status:</strong>
                ${data.status}
            </p>

        `;


        confirmation.style.display =
            "block";


        loadBookings();


    } catch (error) {

        console.error(
            "Booking error:",
            error
        );


        message.innerText =
            "Unable to connect to the server.";
    }
}


// =====================================================
// LOAD MY BOOKINGS
// =====================================================

async function loadBookings() {

    const bookingList =
        document.getElementById(
            "booking-list"
        );


    const loggedInUserId =
        localStorage.getItem(
            "loggedInUserId"
        );


    if (!loggedInUserId) {

        bookingList.innerHTML =
            `<p>Please login to view your bookings.</p>`;

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/bookings`
            );


        const bookings =
            await response.json();


        if (!response.ok) {

            bookingList.innerHTML =
                "<p>Unable to load bookings.</p>";

            return;
        }


        const myBookings =
            bookings.filter(
                booking =>
                    booking.user &&
                    booking.user.id ===
                    Number(loggedInUserId)
            );


        if (myBookings.length === 0) {

            bookingList.innerHTML =
                `<p>You don't have any bookings yet.</p>`;

            return;
        }


        bookingList.innerHTML = "";


        for (const booking of myBookings) {

            const card =
                document.createElement("div");


            card.className =
                "booking-card";


            let actionButton = "";


            if (
                booking.status ===
                "CONFIRMED"
            ) {

                try {

                    const paymentResponse =
                        await fetch(
                            `${API_URL}/payments/booking/${booking.id}/paid`
                        );


                    const isPaid =
                        await paymentResponse.json();


                    if (isPaid) {

                        actionButton = `

                            <p class="payment-paid">

                                Payment:
                                <strong>
                                    Paid ✓
                                </strong>

                            </p>

                        `;

                    } else {

                        actionButton = `

                            <button
                                class="payment-button"
                                onclick="payForBooking(${booking.id})">

                                Pay Now

                            </button>


                            <button
                                class="cancel-button"
                                onclick="cancelBooking(${booking.id})">

                                Cancel Booking

                            </button>

                        `;
                    }


                } catch (paymentError) {

                    console.error(
                        "Payment status error:",
                        paymentError
                    );


                    actionButton = `

                        <button
                            class="payment-button"
                            onclick="payForBooking(${booking.id})">

                            Pay Now

                        </button>


                        <button
                            class="cancel-button"
                            onclick="cancelBooking(${booking.id})">

                            Cancel Booking

                        </button>

                    `;
                }
            }


            card.innerHTML = `

                <h3>
                    Booking #${booking.id}
                </h3>

                <p>
                    Room:
                    ${booking.room.roomNumber}
                </p>

                <p>
                    Check-in:
                    ${booking.checkInDate}
                </p>

                <p>
                    Check-out:
                    ${booking.checkOutDate}
                </p>

                <p>
                    Total Amount:
                    ₹${booking.totalAmount}
                </p>

                <p class="booking-status">
                    Status:
                    ${booking.status}
                </p>

                ${actionButton}

            `;


            bookingList.appendChild(card);
        }


    } catch (error) {

        console.error(
            "Booking loading error:",
            error
        );


        bookingList.innerHTML =
            "<p>Unable to connect to the server.</p>";
    }
}


// =====================================================
// PAY FOR BOOKING
// =====================================================

async function payForBooking(bookingId) {

    const bookingIdInput =
        document.getElementById(
            "payment-booking-id"
        );


    const amountInput =
        document.getElementById(
            "payment-amount"
        );


    bookingIdInput.value =
        bookingId;


    amountInput.value =
        "Loading...";


    try {

        const response =
            await fetch(
                `${API_URL}/bookings/${bookingId}`
            );


        const booking =
            await response.json();


        if (!response.ok) {

            amountInput.value =
                "Unable to load amount.";

            return;
        }


        amountInput.value =
            `₹${booking.totalAmount}`;


        document
            .getElementById("payment")
            .scrollIntoView({
                behavior: "smooth"
            });


        document
            .getElementById("payment-method")
            .focus();


    } catch (error) {

        console.error(
            "Payment booking error:",
            error
        );


        amountInput.value =
            "Unable to load amount.";
    }
}


// =====================================================
// CANCEL BOOKING
// =====================================================

async function cancelBooking(bookingId) {

    const confirmCancel =
        confirm(
            `Are you sure you want to cancel Booking #${bookingId}?`
        );


    if (!confirmCancel) {

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/bookings/${bookingId}/cancel`,
                {
                    method: "PUT"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Unable to cancel booking."
            );

            return;
        }


        alert(
            "Booking cancelled successfully!"
        );


        loadBookings();


    } catch (error) {

        console.error(
            "Cancel booking error:",
            error
        );


        alert(
            "Unable to connect to the server."
        );
    }
}


// =====================================================
// MAKE PAYMENT
// =====================================================

async function makePayment() {

    const bookingId =
        document.getElementById(
            "payment-booking-id"
        ).value;


    const paymentMethod =
        document.getElementById(
            "payment-method"
        ).value;


    const message =
        document.getElementById(
            "payment-message"
        );


    message.innerText = "";


    if (
        !bookingId ||
        !paymentMethod
    ) {

        message.innerText =
            "Please enter Booking ID and select a payment method.";

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/payments`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        paymentMethod:
                        paymentMethod,

                        booking: {
                            id:
                                Number(bookingId)
                        }

                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            message.innerText =
                data.message ||
                "Payment failed.";

            return;
        }


        message.innerHTML = `

            Payment successful!

            <br><br>

            Payment ID:
            ${data.id}

            <br>

            Booking ID:
            ${data.booking.id}

            <br>

            Amount:
            ₹${data.amount}

            <br>

            Method:
            ${data.paymentMethod}

            <br>

            Status:
            ${data.paymentStatus}

        `;


        loadBookings();


    } catch (error) {

        console.error(
            "Payment error:",
            error
        );


        message.innerText =
            "Unable to connect to the server.";
    }
}


// =====================================================
// SEARCH HOTELS
// LOCATION + CHECK-IN + CHECK-OUT
// =====================================================

async function searchHotels() {

    const location =
        document
            .getElementById("location")
            .value
            .trim()
            .toLowerCase();


    const checkIn =
        document
            .getElementById("check-in")
            .value;


    const checkOut =
        document
            .getElementById("check-out")
            .value;


    const hotelList =
        document.getElementById(
            "hotel-list"
        );


    if (checkIn && checkOut) {

        const start =
            new Date(checkIn);

        const end =
            new Date(checkOut);


        if (end <= start) {

            hotelList.innerHTML =
                "<p>Check-out date must be after check-in date.</p>";

            return;
        }
    }


    try {

        const hotelResponse =
            await fetch(
                `${API_URL}/hotels`
            );


        const hotels =
            await hotelResponse.json();


        if (!hotelResponse.ok) {

            hotelList.innerHTML =
                "<p>Unable to load hotels.</p>";

            return;
        }


        let filteredHotels =
            location
                ? hotels.filter(
                    hotel =>
                        hotel.location
                            .toLowerCase()
                            .includes(location)
                )
                : hotels;


        if (!checkIn || !checkOut) {

            displaySearchHotels(
                filteredHotels
            );

            return;
        }


        const roomResponse =
            await fetch(
                `${API_URL}/rooms`
            );


        const rooms =
            await roomResponse.json();


        if (!roomResponse.ok) {

            hotelList.innerHTML =
                "<p>Unable to load rooms.</p>";

            return;
        }


        const bookingResponse =
            await fetch(
                `${API_URL}/bookings`
            );


        const bookings =
            await bookingResponse.json();


        if (!bookingResponse.ok) {

            hotelList.innerHTML =
                "<p>Unable to load bookings.</p>";

            return;
        }


        filteredHotels =
            filteredHotels.filter(
                hotel => {

                    const hotelRooms =
                        rooms.filter(
                            room =>
                                room.hotel &&
                                room.hotel.id ===
                                hotel.id
                        );


                    return hotelRooms.some(
                        room => {

                            const overlappingBooking =
                                bookings.some(
                                    booking => {

                                        if (
                                            !booking.room ||
                                            booking.room.id !== room.id ||
                                            booking.status !== "CONFIRMED"
                                        ) {

                                            return false;
                                        }


                                        const existingCheckIn =
                                            new Date(
                                                booking.checkInDate
                                            );


                                        const existingCheckOut =
                                            new Date(
                                                booking.checkOutDate
                                            );


                                        const requestedCheckIn =
                                            new Date(
                                                checkIn
                                            );


                                        const requestedCheckOut =
                                            new Date(
                                                checkOut
                                            );


                                        return (

                                            existingCheckIn <
                                            requestedCheckOut

                                            &&

                                            existingCheckOut >
                                            requestedCheckIn

                                        );

                                    }
                                );


                            return !overlappingBooking;

                        }
                    );

                }
            );


        displaySearchHotels(
            filteredHotels
        );


    } catch (error) {

        console.error(
            "Search error:",
            error
        );


        hotelList.innerHTML =
            "<p>Unable to connect to the server.</p>";
    }
}


// =====================================================
// DISPLAY SEARCH RESULTS
// =====================================================

function displaySearchHotels(hotels) {

    const hotelList =
        document.getElementById(
            "hotel-list"
        );


    if (hotels.length === 0) {

        hotelList.innerHTML =
            "<p>No hotels available for the selected location and dates.</p>";

        return;
    }


    hotelList.innerHTML = "";


    hotels.forEach(hotel => {

        const card =
            document.createElement("div");


        card.className =
            "hotel-card";


        card.innerHTML = `

            <h3>
                ${hotel.name}
            </h3>

            <p>
                Location:
                ${hotel.location}
            </p>

            <p>
                ${hotel.description}
            </p>

            <p>
                Contact:
                ${hotel.contactNumber}
            </p>

            <button
                onclick="viewHotel(${hotel.id})">

                View Rooms

            </button>

        `;


        hotelList.appendChild(card);

    });


    document
        .getElementById("hotels")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// =====================================================
// CHECK LOGIN STATUS
// =====================================================

function checkLoginStatus() {

    const userId =
        localStorage.getItem(
            "loggedInUserId"
        );


    const userName =
        localStorage.getItem(
            "loggedInUserName"
        );


    const userNameElement =
        document.getElementById(
            "user-name"
        );


    const loginLink =
        document.getElementById(
            "login-link"
        );


    const logoutLink =
        document.getElementById(
            "logout-link"
        );


    if (
        !userNameElement ||
        !loginLink ||
        !logoutLink
    ) {

        return;
    }


    if (userId && userName) {

        userNameElement.textContent =
            "Welcome, " + userName;


        loginLink.style.display =
            "none";


        logoutLink.style.display =
            "inline";

    } else {

        userNameElement.textContent =
            "";


        loginLink.style.display =
            "inline";


        logoutLink.style.display =
            "none";
    }
}


// =====================================================
// LOGOUT
// =====================================================

function logoutUser() {

    localStorage.removeItem(
        "loggedInUserId"
    );


    localStorage.removeItem(
        "loggedInUserName"
    );


    localStorage.removeItem(
        "loggedInUserEmail"
    );


    window.location.href =
        "index.html";
}


// =====================================================
// LOAD LOGGED-IN USER
// =====================================================

function loadLoggedInUser() {

    const userId =
        localStorage.getItem(
            "loggedInUserId"
        );


    const userName =
        localStorage.getItem(
            "loggedInUserName"
        );


    const userNameInput =
        document.getElementById(
            "booking-user-name"
        );


    const userIdInput =
        document.getElementById(
            "booking-user-id"
        );


    if (
        !userNameInput ||
        !userIdInput
    ) {

        return;
    }


    if (userId && userName) {

        userNameInput.value =
            userName;

        userIdInput.value =
            userId;

    } else {

        userNameInput.value =
            "";

        userNameInput.placeholder =
            "Please login first";

        userIdInput.value =
            "";
    }
}


// =====================================================
// SET MINIMUM BOOKING DATE
// =====================================================

function setMinimumBookingDate() {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const bookingCheckIn =
        document.getElementById(
            "booking-check-in"
        );


    const bookingCheckOut =
        document.getElementById(
            "booking-check-out"
        );


    if (bookingCheckIn) {

        bookingCheckIn.min =
            today;
    }


    if (bookingCheckOut) {

        bookingCheckOut.min =
            today;
    }
}


// =====================================================
// BOOKING DATE EVENTS
// =====================================================

const checkInInput =
    document.getElementById(
        "booking-check-in"
    );


const checkOutInput =
    document.getElementById(
        "booking-check-out"
    );


if (checkInInput) {

    checkInInput.addEventListener(
        "change",
        function () {

            if (checkOutInput) {

                checkOutInput.min =
                    checkInInput.value;
            }


            calculateBookingPrice();
        }
    );
}


if (checkOutInput) {

    checkOutInput.addEventListener(
        "change",
        calculateBookingPrice
    );
}


// =====================================================
// INITIAL LOAD
// =====================================================

loadHotels();

loadBookings();

checkLoginStatus();

loadLoggedInUser();

setMinimumBookingDate();

