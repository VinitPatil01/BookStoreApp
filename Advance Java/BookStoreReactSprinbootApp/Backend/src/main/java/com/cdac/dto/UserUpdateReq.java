package com.cdac.dto;
import jakarta.validation.constraints.Email;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@NoArgsConstructor
public class UserUpdateReq {
    @Email(message = "Invalid email format")
    private String email;
    private String firstName;
    private String lastName;
    
   
}