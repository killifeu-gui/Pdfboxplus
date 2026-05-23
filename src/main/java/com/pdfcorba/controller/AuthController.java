package com.pdfcorba.controller;

import com.pdfcorba.dto.JwtAuthenticationResponse;
import com.pdfcorba.dto.LoginRequest;
import com.pdfcorba.dto.ResponseDto;
import com.pdfcorba.dto.SignUpRequest;
import com.pdfcorba.model.User;
import com.pdfcorba.repository.UserRepository;
import com.pdfcorba.security.JwtTokenProvider;
import com.pdfcorba.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        String token = tokenProvider.generateToken(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        // Update last login
        User user = userRepository.findById(userPrincipal.getId()).orElse(null);
        if (user != null) {
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
        }
        
        return ResponseEntity.ok(new JwtAuthenticationResponse(
                token,
                userPrincipal.getId(),
                userPrincipal.getName(),
                userPrincipal.getEmail(),
                userPrincipal.getInitials()
        ));
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new ResponseDto(false, "Email address already in use!", null));
        }
        
        // Creating user's account
        User user = new User(
                signUpRequest.getEmail(),
                passwordEncoder.encode(signUpRequest.getPassword()),
                signUpRequest.getName()
        );
        
        User result = userRepository.save(user);
        
        return ResponseEntity.ok(new ResponseDto(true, "User registered successfully!", result.getId()));
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            return ResponseEntity.ok(new ResponseDto(true, "User retrieved successfully", userPrincipal));
        }
        return ResponseEntity.badRequest().body(new ResponseDto(false, "User not authenticated", null));
    }
}
