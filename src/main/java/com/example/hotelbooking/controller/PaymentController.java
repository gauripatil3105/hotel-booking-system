
        package com.example.hotelbooking.controller;

import com.example.hotelbooking.entity.Payment;
import com.example.hotelbooking.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }


    @PostMapping
    public Payment createPayment(
            @Valid @RequestBody Payment payment) {

        return paymentService.createPayment(payment);
    }


    @GetMapping
    public List<Payment> getAllPayments() {

        return paymentService.getAllPayments();
    }


    @GetMapping("/{id}")
    public Payment getPaymentById(
            @PathVariable Long id) {

        return paymentService.getPaymentById(id);
    }


    @GetMapping("/booking/{bookingId}/paid")
    public boolean isBookingPaid(
            @PathVariable Long bookingId) {

        return paymentService.isBookingPaid(bookingId);
    }
}

