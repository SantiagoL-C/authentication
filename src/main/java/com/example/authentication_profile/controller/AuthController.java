package com.example.authentication_profile.controller;

import com.example.authentication_profile.model.User;
import com.example.authentication_profile.model.UserSession;
import com.example.authentication_profile.repository.UserRepository;
import com.example.authentication_profile.repository.UserSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserSessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token no proporcionado");
        }

        String token = authorization.substring(7);
        Optional<UserSession> sessionOpt = sessionRepository.findByToken(token);
        if (sessionOpt.isEmpty() || sessionOpt.get().getExpiredAt() != null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sesión no válida o expirada");
        }

        Integer userId = sessionOpt.get().getUserId();
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }

        return ResponseEntity.ok(userOpt.get());
    }
}