package com.cdac.dto;

import com.cdac.entities.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserSignupRequest{
	
	@NotBlank(message = "name is required")
	private String name;

	@Email(message = "Invalid email format")
	private String email;
	
	@Pattern(regexp = "((?=.*[a-z])(?=.*[A-Z])(?=.*[#@$*]).{5,20})", message = "invalid password format!!!!") 
	private String password;
	
	private Role role;
}
