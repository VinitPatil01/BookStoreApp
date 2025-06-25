package com.cdac.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.dto.AuthResponse;
import com.cdac.dto.UserResp;
import com.cdac.dto.UserSignInRequest;
import com.cdac.dto.UserSignupRequest;
import com.cdac.dto.UserUpdateReq;
import com.cdac.security.JwtUtils;
import com.cdac.service.UserService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserController {
    
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtils jwtUtils;
    
    // PUBLIC ENDPOINTS
    
    /**
     * User Registration - Public
     */
    @PostMapping("/signup")
    public ResponseEntity<?> userSignUp(@RequestBody @Valid UserSignupRequest dto) {
        System.out.println("in user sign up " + dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.registerNewUser(dto));
    }
    
    /**
     * User Login - Public
     */
    @PostMapping("/signin")
    public ResponseEntity<?> userSignIn(@RequestBody @Valid UserSignInRequest dto) {
        try {
        	UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(dto.getEmail(),
    				dto.getPassword());
        
        	System.out.println("is authenticated " + authToken.isAuthenticated());
        	Authentication successfulAuth = authenticationManager.authenticate(authToken);
        	System.out.println("is authenticated " + successfulAuth.isAuthenticated());
        	System.out.println("principal " + successfulAuth.getPrincipal());
        	System.out.println("principal class" + successfulAuth.getPrincipal().getClass());
        	System.out.println(successfulAuth.getAuthorities());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse("Successful Authentication...", 
                        jwtUtils.generateJwtToken(successfulAuth)));
        
    }
        catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
    
    // AUTHENTICATED USER ENDPOINTS
    
    /**
     * Get current user profile
     */
    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('BUYER', 'SELLER', 'ADMIN')")
    public ResponseEntity<UserResp> getCurrentUserProfile(Authentication authentication) {
    	String email = authentication.getName();
        System.out.println(email);
        UserResp user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }
    
    /**
     * Update current user profile
     */
    @PutMapping("/profile")
    @PreAuthorize("hasAnyRole('BUYER', 'SELLER', 'ADMIN')")
    public ResponseEntity<UserResp> updateProfile(@Valid @RequestBody UserUpdateReq request,
    		Authentication authentication) {
    	String email = authentication.getName();
        UserResp updatedUser = userService.updateUser(email, request);
        return ResponseEntity.ok(updatedUser);
    }
    
    // ADMIN ENDPOINTS
    
    /**
     * Get all users - Admin only
     */
    @GetMapping("/admin/all_admins")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResp>> getAdminUsers() {
    	List<UserResp> users = userService.getAdminUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/admin/allusers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResp>> getAllUsers() {
    	List<UserResp> users = userService.getAllUsers();
    	System.out.println(users);
        return ResponseEntity.ok(users);
    }
    
    /**
     * Get user by ID - Admin only
     */
    @GetMapping("/admin/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResp> getUserById(@PathVariable Long userId) {
    	UserResp user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }
    
    /**
     * Delete user - Admin only
     */
    @DeleteMapping("/admin/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}