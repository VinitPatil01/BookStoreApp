package com.cdac.dto;

import com.cdac.entities.Role;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserResp{
	
	@JsonProperty(access = Access.READ_ONLY)
	private Long userId;
	private String name;

	private String email;
	
	private Role role;
}
