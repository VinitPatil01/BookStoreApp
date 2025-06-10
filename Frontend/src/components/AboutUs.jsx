import React from 'react';

// Import images from local folder
import vinitImg from './img/vinit.jpg';
import gauravImg from './img/gaurav.jpg';
import shreyash from './img/shreyash.jpg'

const AboutUs = () => {
  const members = [
    {
      name: "SHREYASH AGHARKAR",
      role: "SOFTWARE DEVELOPER",
      img: shreyash,  
      bio: "Passionate about building responsive React apps with clean UI. Loves working with modern JavaScript frameworks and creating seamless user experiences.",
    },
    {
      name: "VINIT PATIL",
      role: "SOFTWARE DEVELOPER",
      img: vinitImg,  
      bio: "Spring Boot expert focused on scalable REST APIs. Experienced in microservices architecture and database optimization for high-performance applications.",
    },
    {
      name: "GAURAV",
      role: "SOFTWARE DEVELOPER",
      img: gauravImg,  
      bio: "Designing user-friendly and accessible interfaces with Figma. Strong emphasis on usability and aesthetics to enhance user engagement.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-10">Meet Our Team</h1>

      {members.map((member, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row items-center md:items-start mb-12 space-y-4 md:space-y-0 md:space-x-8"
        >
          {/* Info Left Side */}
          <div className="md:flex-1 text-center md:text-left">
            <h3 className="text-xl font-semibold">{member.name}</h3>
            <p className="text-purple-600 mb-2">{member.role}</p>
            <p className="text-gray-600 max-w-md mx-auto md:mx-0">{member.bio}</p>
          </div>

          {/* Image Right Side */}
          <div>
            <img
              src={member.img}
              alt={member.name}
              className="w-36 h-36 rounded-full object-cover shadow-md"
            />
          </div>
        </div>
      ))}

      <hr className="my-10" />

      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">About the Project</h2>
        <p className="text-gray-700 leading-relaxed text-justify">
          This Book Store Management System is a comprehensive web application designed to provide users with a smooth and intuitive experience for browsing and purchasing books. Built with <strong>React</strong> on the frontend, it ensures a dynamic and responsive interface, while the backend powered by <strong>Spring Boot</strong> guarantees efficient data handling and secure operations. Features include user authentication, cart management, and an admin panel for book management. The project aims to deliver a full-stack solution that emphasizes usability, scalability, and maintainability.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
