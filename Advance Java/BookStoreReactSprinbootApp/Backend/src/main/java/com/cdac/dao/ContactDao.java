package com.cdac.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cdac.entities.Contact;

@Repository

public interface ContactDao extends JpaRepository<Contact, Integer>{
	
}
