import React from "react";
import { useState, useEffect } from "react";

import { Tooltip } from 'react-tooltip';
//getNextMidnightFromTimestamp from timestamp
const getNextMidnightFromTimestamp = (timestamp) => {
  const date = new Date(timestamp);

  // Set the time to midnight (00:00) of the current day
  date.setHours(0, 0, 0, 0);

  // Add one day to get the next day's midnight
  date.setDate(date.getDate() + 1);

  // Return the timestamp of next day's midnight
  return date.getTime();
};




// Function to calculate the hours left from the provided timestamp until midnight
const getHoursLeftUntilMidnight = (timestamp) => {
  const now = new Date(timestamp);
  const nextMidnight = new Date(getNextMidnightFromTimestamp(timestamp));

  // Calculate the time left in hours
  const timeLeftInMs = nextMidnight - now;
  const timeLeftInHours = timeLeftInMs / (1000 * 60 * 60); // Convert to hours

  return timeLeftInHours;
};


const generateWeekDates = (startDate) => {
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    weekDates.push({
      date: date.toISOString().split("T")[0], // Format: "YYYY-MM-DD"
      timestamp: date.getTime(),
    });
  }
  return weekDates;
};

const ProgressBar = ({ earnings, startTime, nodeActive }) => {
  const [progress, setProgress] = useState([]);
  const [hoursLeft, setHoursLeft] = useState()
  const [progressPercentage, setProgressPercentage] = useState()
  const [activeDay, setActiveDay] = useState()




  useEffect(() => {
    let startDate;

    if (earnings.length >= 7) {
      // Set startDate to 8 days back from today
      const today = new Date();
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);

    }
    else if (earnings.length > 0) {
      const earningsDate = new Date(earnings[0].date);
      const today = new Date();

      // Calculate the difference in time (milliseconds)
      const timeDifference = today - earningsDate;
      // Convert time difference from milliseconds to days
      const dayDifference = timeDifference / (1000 * 60 * 60 * 24);


      if (dayDifference >= 6) {
        // Set startDate to 8 days back from today
        const today = new Date();
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);



      } else {

        startDate = new Date(earnings[0].date);
      }



    } else if (activeDay) {
      // Convert activeDay back to Date object (ensuring correct format)

      startDate = new Date(activeDay);

    } else {
      startDate = new Date();
    }

    const weekDates = generateWeekDates(startDate);


    const progressData = weekDates.map((day, index) => {
      const existingEntry = earnings.find((entry) => entry.date === day.date);
      const hoursLeft = existingEntry ? getHoursLeftUntilMidnight(existingEntry.timestamp) : 0;
      const progressPercentage = ((hoursLeft / 24) * 100).toFixed(2);

      return {
        dayLabel: new Date(day.date).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" }),
        progressPercentage,
        hoursLeft
      };
    });

    // Ensure activeDay is displayed even if not in earnings
    if (!nodeActive && activeDay) {
      const existingIndex = progressData.findIndex((d) => d.dayLabel === new Date(activeDay).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" }));

      if (existingIndex !== -1 && progressData[existingIndex].progressPercentage === "0.00") {
        // Update the existing entry where progressPercentage is 0
        progressData[existingIndex] = {
          dayLabel: new Date(activeDay).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" }),
          progressPercentage: progressPercentage,
          hoursLeft: hoursLeft,
        };
      } else if (existingIndex === -1) {
        // If activeDay is not found in earnings, add it
        progressData.push({
          dayLabel: new Date(activeDay).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" }),
          progressPercentage: progressPercentage,
          hoursLeft: hoursLeft,
        });
      }
    }

    setProgress(progressData);
  }, [earnings, activeDay, progressPercentage, hoursLeft]);



  //updated to 1/2 point per seconds
  const getTotalPointFromTimestamp = async (timestamp, pointsPerSecond = 1) => {
    // Convert timestamp to Date object
    const now = new Date(timestamp);

    // Get the next midnight (00:00 UTC)
    const nextMidnight = new Date(now);
    nextMidnight.setUTCHours(0, 0, 0, 0);
    nextMidnight.setUTCDate(nextMidnight.getUTCDate() + 1); // Move to the next day

    // Calculate the time left in seconds
    const timeLeftInSeconds = Math.floor((nextMidnight - now) / 1000);

    // Calculate total points
    // Earning 1/2 points per seconds
    const totalPoints = timeLeftInSeconds * pointsPerSecond / 2;

    return totalPoints;
  };



  useEffect(() => {
    if (startTime && startTime !== 0) {

      const dateFromTimestamp = new Date(startTime).toISOString().split("T")[0];
      const hoursLeft = getHoursLeftUntilMidnight(startTime)
      const progressPercentage = ((hoursLeft / 24) * 100).toFixed(2);
      const activeDay = new Date(dateFromTimestamp).toISOString().split("T")[0]
      setActiveDay(activeDay)
      setProgressPercentage(progressPercentage)
      setHoursLeft(hoursLeft)

    }

  }, [startTime])



  return (
    <div className="space-y-4">
      {progress.map((day, index) => (
        <div key={index} className="flex items-center space-x-4 sm:space-x-6">
          <span className="text-white text-nowrap text-sm opacity-50">{day.dayLabel}</span>
          <div className="w-full bg-[#5C0063] rounded-full h-2 sm:h-4">
            <div
              data-tooltip-id="my-tooltip"
              data-tooltip-content={`${(day.hoursLeft).toFixed(2)} hours`}
              className="bg-[#2B002E]  h-2 sm:h-4 rounded-full"
              style={{ width: `${day.progressPercentage}%  ` }}
            ></div>
          </div>
          <span className="text-white">{day.progressPercentage}%</span>
          <Tooltip id="my-tooltip"
            style={{ backgroundColor: "#2B002E", color: "#fff" }}
          />
        </div>
      ))}
    </div>
  );
};




export default ProgressBar


