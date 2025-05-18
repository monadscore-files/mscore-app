import React from "react";
import { logo, heroImage } from "../Assets"; // Import logo and background image from your assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons"; // Importing icons for username, email, and password
import { Link } from "react-router-dom"; // Import Link for routing

const Join = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section with Background Image */}
      <div
        className="flex-1 bg-cover bg-center bg-no-repeat "
        style={{ backgroundImage: `url(${heroImage})` }} // Using the imported heroImage
      />
      
      {/* Right Section with Gradient Background and Form */}
      <div className="w-full lg:w-1/3 bg-gradient-to-b from-black to-[#2F0032] flex items-center justify-center p-4">
        <div className="text-white w-full max-w-md p-6 lg:p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Logo" className="h-124 lg:h-36" />
          </div>

          {/* Form Container */}
          <div className="w-full p-6 lg:p-8 rounded-lg shadow-lg bg-opacity-50">
            {/* Input Fields with Icons */}
            <div className="relative mb-4">
              <FontAwesomeIcon
                icon={faUser}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white"
              />
              <input
                type="text"
                placeholder="Choose a username"
                className="w-full p-4 pl-12 bg-[#45004A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#770080]"
              />
            </div>

            <div className="relative mb-4">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white"
              />
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full p-4 pl-12 bg-[#45004A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#770080]"
              />
            </div>

            <div className="relative mb-4">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white"
              />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-4 pl-12 bg-[#45004A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#770080]"
              />
            </div>

            {/* Register Button */}
            <button className="w-full p-4 bg-[#770080] text-white font-bold rounded-lg hover:bg-[#9a019d]">
              Register
            </button>

            {/* Login Link */}
            <div className="text-center mt-4">
              <span className="text-white text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-[#770080] hover:underline">
                  Login here
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Join;