package com.example.hotelbooking.service;

import com.example.hotelbooking.entity.Booking;
import com.example.hotelbooking.entity.Payment;
import com.example.hotelbooking.exception.ResourceNotFoundException;
import com.example.hotelbooking.repository.BookingRepository;
import com.example.hotelbooking.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public PaymentService(
            PaymentRepository paymentRepository,
            BookingRepository bookingRepository) {

        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
    }


    public Payment createPayment(Payment payment) {

        Booking booking =
                bookingRepository.findById(
                        payment.getBooking().getId()
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found with id: "
                                        + payment.getBooking().getId()
                        )
                );


        if (paymentRepository
                .findByBookingId(booking.getId())
                .isPresent()) {

            throw new RuntimeException(
                    "Payment already exists for this booking"
            );
        }


        if (!"CONFIRMED".equals(booking.getStatus())) {

            throw new RuntimeException(
                    "Payment is allowed only for confirmed bookings"
            );
        }


        payment.setBooking(booking);

        payment.setAmount(
                booking.getTotalAmount()
        );

        payment.setPaymentStatus(
                "SUCCESS"
        );

        payment.setPaymentDate(
                LocalDateTime.now()
        );


        return paymentRepository.save(payment);
    }


    public List<Payment> getAllPayments() {

        return paymentRepository.findAll();
    }


    public Payment getPaymentById(Long id) {

        return paymentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment not found with id: " + id
                        )
                );
    }


    public boolean isBookingPaid(Long bookingId) {

        return paymentRepository
                .findByBookingId(bookingId)
                .isPresent();
    }
}

