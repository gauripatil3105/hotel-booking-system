
        package com.example.hotelbooking.service;

import com.example.hotelbooking.entity.Booking;
import com.example.hotelbooking.entity.Room;
import com.example.hotelbooking.entity.User;
import com.example.hotelbooking.exception.ResourceNotFoundException;
import com.example.hotelbooking.repository.BookingRepository;
import com.example.hotelbooking.repository.RoomRepository;
import com.example.hotelbooking.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    public BookingService(
            BookingRepository bookingRepository,
            UserRepository userRepository,
            RoomRepository roomRepository) {

        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
    }

    @Transactional
    public Booking createBooking(Booking booking) {

        User user = userRepository.findById(booking.getUser().getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: "
                                        + booking.getUser().getId()));

        Room room = roomRepository.findById(booking.getRoom().getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Room not found with id: "
                                        + booking.getRoom().getId()));

        if (booking.getCheckInDate() == null ||
                booking.getCheckOutDate() == null) {

            throw new RuntimeException(
                    "Check-in and check-out dates are required");
        }

        if (!booking.getCheckOutDate().isAfter(
                booking.getCheckInDate())) {

            throw new RuntimeException(
                    "Check-out date must be after check-in date");
        }

        List<Booking> overlappingBookings =
                bookingRepository
                        .findByRoomIdAndStatusAndCheckInDateLessThanAndCheckOutDateGreaterThan(
                                room.getId(),
                                "CONFIRMED",
                                booking.getCheckOutDate(),
                                booking.getCheckInDate()
                        );

        if (!overlappingBookings.isEmpty()) {
            throw new RuntimeException(
                    "Room is already booked for the selected dates");
        }

        long nights = ChronoUnit.DAYS.between(
                booking.getCheckInDate(),
                booking.getCheckOutDate()
        );

        double totalAmount =
                nights * room.getPricePerNight();

        booking.setUser(user);
        booking.setRoom(room);
        booking.setTotalAmount(totalAmount);
        booking.setStatus("CONFIRMED");

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found with id: " + id));
    }

    @Transactional
    public Booking cancelBooking(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found with id: " + id));

        booking.setStatus("CANCELLED");

        return bookingRepository.save(booking);
    }
}

