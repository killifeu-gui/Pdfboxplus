package com.pdfcorba.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String name;
    
    @Column
    private String avatar;
    
    @Column
    private String initials;
    
    @Column(nullable = false)
    private Boolean enabled = true;
    
    @Column
    private Long filesProcessed = 0L;
    
    @Column
    private LocalDateTime createdAt;
    
    @Column
    private LocalDateTime lastLogin;
    
    // Constructors
    public User() {
        this.createdAt = LocalDateTime.now();
    }
    
    public User(String email, String password, String name) {
        this();
        this.email = email;
        this.password = password;
        this.name = name;
        this.initials = generateInitials(name);
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
        this.initials = generateInitials(name);
    }
    
    public String getAvatar() {
        return avatar;
    }
    
    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }
    
    public String getInitials() {
        return initials;
    }
    
    public void setInitials(String initials) {
        this.initials = initials;
    }
    
    public Boolean getEnabled() {
        return enabled;
    }
    
    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }
    
    public Long getFilesProcessed() {
        return filesProcessed;
    }
    
    public void setFilesProcessed(Long filesProcessed) {
        this.filesProcessed = filesProcessed;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getLastLogin() {
        return lastLogin;
    }
    
    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }
    
    // Helper method to generate initials
    private String generateInitials(String name) {
        if (name == null || name.isEmpty()) {
            return "U";
        }
        String[] parts = name.trim().split("\\s+");
        if (parts.length == 1) {
            return parts[0].substring(0, 1).toUpperCase();
        }
        return (parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase();
    }
    
    public void incrementFilesProcessed() {
        this.filesProcessed = (this.filesProcessed != null ? this.filesProcessed : 0) + 1;
    }
}
