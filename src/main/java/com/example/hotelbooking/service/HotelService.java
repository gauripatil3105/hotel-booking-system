package com.example.hotelbooking.service;

import com.example.hotelbooking.entity.Hotel;
import com.example.hotelbooking.exception.ResourceNotFoundException;
import com.example.hotelbooking.repository.HotelRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HotelService {


    private final HotelRepository hotelRepository;

    public HotelService(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    public Hotel createHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    public Hotel getHotelById(Long id) {
        return hotelRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Hotel not found with id: " + id));
    }

    public Hotel updateHotel(Long id, Hotel hotel) {

        Hotel existingHotel = hotelRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Hotel not found with id: " + id));

        existingHotel.setName(hotel.getName());
        existingHotel.setLocation(hotel.getLocation());
        existingHotel.setDescription(hotel.getDescription());
        existingHotel.setContactNumber(hotel.getContactNumber());

        return hotelRepository.save(existingHotel);
    }

    public void deleteHotel(Long id) {

        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Hotel not found with id: " + id));

        hotelRepository.delete(hotel);
    }


}
