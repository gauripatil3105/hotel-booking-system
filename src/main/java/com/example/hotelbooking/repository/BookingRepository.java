
        package com.example.hotelbooking.repository;

import com.example.hotelbooking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByRoomIdAndStatusAndCheckInDateLessThanAndCheckOutDateGreaterThan(
            Long roomId,
            String status,
            LocalDate checkOutDate,
            LocalDate checkInDate
    );
}

