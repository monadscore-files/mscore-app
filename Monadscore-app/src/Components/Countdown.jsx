import React, { useState, useEffect } from "react";


const CountdownTimer = () => {
  // Set the countdown target to April 11, 10 AM UTC
  const countdownTarget = new Date(Date.UTC(2025, 3, 11, 10, 0, 0)).getTime();
  
  const [timeLeft, setTimeLeft] = useState(countdownTarget - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(Math.max(0, countdownTarget - Date.now()));
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [countdownTarget]);

  // Convert milliseconds to days, hours, minutes, and seconds
  const getFormattedTime = (ms) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return (
      <div className="flex items-center text-xs">
        <div className="bg-black  p-1">{days}&nbsp;<span className="opacity-60">D</span></div> &nbsp;:&nbsp;
        <div className="bg-black p-1">{hours}&nbsp;<span className="opacity-60">H</span></div> &nbsp;:&nbsp;
        <div className="bg-black p-1">{minutes}&nbsp;<span className="opacity-60">M</span></div> &nbsp;:&nbsp;
        <div className="bg-black p-1">{seconds}&nbsp;<span className="opacity-60">S</span></div>
      </div>
    );
  };

  return <div className="text-white opacity-60 flex items-center">⏳ {getFormattedTime(timeLeft)}</div>;
};

export default CountdownTimer;
