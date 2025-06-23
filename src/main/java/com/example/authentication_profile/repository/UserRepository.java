package com.example.authentication_profile.repository;

import com.example.authentication_profile.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
}
