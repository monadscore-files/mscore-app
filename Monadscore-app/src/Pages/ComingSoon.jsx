import React from "react";
import { heroImage, logo } from "../Assets"; // Import logo for the login page
import Countdown from "react-countdown";


const ComingSoon = () => {


  const targetDate = new Date('2025-03-26T10:00:00Z');

  // Custom renderer function
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <span>The event has started!</span>;
    } else {
      // Render the countdown
      return (
        <span>
          {days} D : {hours} H : {minutes} M : {seconds} S
        </span>
      );
    }
  };



  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
   
      <div
        className="flex-1 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover' }} // Add your desired background image here
      />
      <div className="w-full min-h-80 lg:w-1/3 bg-gradient-to-b from-black to-[#2F0032] flex items-center justify-center p-4">
        <div className="text-white w-full max-w-md p-6 lg:p-2">
          {/* Logo */}
          <div className="flex justify-center ">
            <img src={logo} alt="Logo" className="h-auto w-auto" />
          </div>
          <div className="w-full mt-4 uppercase font-bold  text-lg lg:p-8 flex flex-col items-center justify-center rounded-lg shadow-lg bg-opacity-50">
            <span className=" opacity-60 text-sm sm:text-2xl italic">
              Site Under Maintenance...
            </span>

            <span className=" font-light text-sm capitalize text-md">
              Run Node
              Earn Points
            </span>
            <p className="mt-5 text-center font-bold italic text-xs ">Follow our socials to stay updated </p>
            <div className="w-full flex items-center justify-center py-1">
              <a href="https://x.com/monadscores_xyz" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="white" height='30px' width='30px'><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm297.1 84L257.3 234.6 379.4 396H283.8L209 298.1 123.3 396H75.8l111-126.9L69.7 116h98l67.7 89.5L313.6 116h47.5zM323.3 367.6L153.4 142.9H125.1L296.9 367.6h26.3z" /></svg>
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;