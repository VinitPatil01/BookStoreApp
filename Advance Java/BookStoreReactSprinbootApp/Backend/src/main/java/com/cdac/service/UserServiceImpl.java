package com.cdac.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.cdac.custom_exceptions.ApiException;
import com.cdac.custom_exceptions.NotFoundException;
import com.cdac.custom_exceptions.UserAlreadyExistsException;
import com.cdac.dao.UserDao;
import com.cdac.dto.UserResp;
import com.cdac.dto.UserSignupRequest;
import com.cdac.dto.UserUpdateReq;
import com.cdac.entities.User;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import com.cdac.entities.Role;

@Service
@Transactional
@AllArgsConstructor
public class UserServiceImpl implements UserService{
	
	private final UserDao userDao;
	private final ModelMapper modelMapper;
	private final PasswordEncoder passwordEncoder;
	
	@Override
	public UserResp registerNewUser(UserSignupRequest dto) {
		// check user exists or not
		if(userDao.existsByEmail(dto.getEmail())) {
			throw new ApiException("Duplicate Email Found");
		}
		
		// do the mapping 
		// incomming dto to entityy
		User userEntity = modelMapper.map(dto, User.class);
		// encrypt password
		userEntity.setPassword(passwordEncoder.encode(userEntity.getPassword()));
		// send to thee user
		return modelMapper.map(userDao.save(userEntity), UserResp.class);
	}

	@Override
	public UserResp getUserByEmail(String email) {
		User user = userDao.findByEmail(email)
				.orElseThrow(() -> new NotFoundException("User not found with email: " + email));
		return modelMapper.map(user, UserResp.class);
		
	}

	@Override
	public UserResp getUserById(Long id) {
        
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("User ID must be a positive number");
        }
        
        User user = userDao.findById(id)
            .orElseThrow(() -> new NotFoundException("User not found with id: " + id));
        
        return modelMapper.map(user, UserResp.class);
	}

	@Override
	public UserResp updateUser(String email, UserUpdateReq request) {
        
        User existingUser = userDao.findByEmail(email)
            .orElseThrow(() -> new NotFoundException("User not found with id: " + email));
        
        // Check if email is being changed and if new email already exists
        if (request.getEmail() != null && 
            !request.getEmail().equalsIgnoreCase(existingUser.getEmail()) &&
            userDao.existsByEmail(request.getEmail().toLowerCase())) {
            throw new UserAlreadyExistsException("User already exists with email: " + request.getEmail());
        }
        
        modelMapper.map(existingUser, request);
        
        User updatedUser = userDao.save(existingUser);
		return modelMapper.map(updatedUser, UserResp.class);
	}

	@Override
	public void deleteUser(Long id) {
		if (id == null || id <= 0) {
            throw new IllegalArgumentException("User ID must be a positive number");
        }
        
        if (!userDao.existsById(id)) {
            throw new NotFoundException("User not found with id: " + id);
        }
        
        userDao.deleteById(id);
		
	}

	@Override
	public List<UserResp> getAllUsers() {
		List<User> users = userDao.findAll();
		System.out.println(users);
		List<UserResp> respUsers = users.stream()
            .map(user -> modelMapper.map(user, UserResp.class))
            .collect(Collectors.toList());
		System.out.println(respUsers);
		
		return respUsers;
	}

	@Override
	public List<UserResp> getAdminUsers() {
		String role = "ROLE_ADMIN";
		Role AdminRole = Role.valueOf(role);
		
		List<User> adminUsers = userDao.findByRole(AdminRole);
		System.out.println(adminUsers);
		return adminUsers.stream().map(user -> modelMapper.map(user, UserResp.class)).collect(Collectors.toList());
	}

	

}
