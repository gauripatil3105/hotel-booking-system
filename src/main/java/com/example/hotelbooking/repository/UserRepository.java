package com.example.hotelbooking.repository;

import com.example.hotelbooking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
