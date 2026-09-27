
        package com.example.hotelbooking.controller;

import com.example.hotelbooking.entity.Hotel;
import com.example.hotelbooking.service.HotelService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {

    private final HotelService hotelService;

    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    @PostMapping
    public Hotel createHotel(@Valid @RequestBody Hotel hotel) {
        return hotelService.createHotel(hotel);
    }

    @GetMapping
    public List<Hotel> getAllHotels() {
        return hotelService.getAllHotels();
    }

    @GetMapping("/{id}")
    public Hotel getHotelById(@PathVariable Long id) {
        return hotelService.getHotelById(id);
    }

    @PutMapping("/{id}")
    public Hotel updateHotel(
            @PathVariable Long id,
            @Valid @RequestBody Hotel hotel) {
        return hotelService.updateHotel(id, hotel);
    }

    @DeleteMapping("/{id}")
    public String deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
        return "Hotel deleted successfully";
    }
}

