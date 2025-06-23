package com.example.authentication_profile.repository;

import com.example.authentication_profile.model.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserSessionRepository extends JpaRepository<UserSession, Integer> {
    Optional<UserSession> findByToken(String token);
}
