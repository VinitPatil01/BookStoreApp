package com.cdac.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.cdac.dao.ContactDao;
import com.cdac.dto.ContactRequestDto;
import com.cdac.entities.Contact;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@Transactional
@AllArgsConstructor
public class ContactService {
	
	private ModelMapper modelMapper;
	private ContactDao contactDao;
	public String addEnquiry(ContactRequestDto reqData) {
		
		Contact cnt = modelMapper.map(reqData,Contact.class);
		System.out.println(cnt);
		contactDao.save(cnt);
		return "We have recieved your enquiry... We will contact you soon";
	}
	
	
	

}
