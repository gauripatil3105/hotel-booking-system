package com.example.hotelbooking.service;

import com.example.hotelbooking.entity.Room;
import com.example.hotelbooking.exception.ResourceNotFoundException;
import com.example.hotelbooking.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {


    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Room not found with id: " + id));
    }

    public Room updateRoom(Long id, Room room) {

        Room existingRoom = roomRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Room not found with id: " + id));

        existingRoom.setRoomNumber(room.getRoomNumber());
        existingRoom.setRoomType(room.getRoomType());
        existingRoom.setPricePerNight(room.getPricePerNight());
        existingRoom.setAvailable(room.getAvailable());
        existingRoom.setHotel(room.getHotel());

        return roomRepository.save(existingRoom);
    }

    public void deleteRoom(Long id) {

        Room room = roomRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Room not found with id: " + id));

        roomRepository.delete(room);
    }


}
