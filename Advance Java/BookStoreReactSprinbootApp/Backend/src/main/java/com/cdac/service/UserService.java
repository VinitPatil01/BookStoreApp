package com.cdac.service;

import java.util.List;

import com.cdac.dto.UserResp;
import com.cdac.dto.UserSignInRequest;
import com.cdac.dto.UserSignupRequest;
import com.cdac.dto.UserUpdateReq;
public interface UserService {
 UserResp getUserByEmail(String email);
 UserResp getUserById(Long id);
 UserResp registerNewUser(UserSignupRequest dto);
 UserResp updateUser(String email, UserUpdateReq request);
 void deleteUser(Long id);
 List<UserResp> getAllUsers();
List<UserResp> getAdminUsers();
}
