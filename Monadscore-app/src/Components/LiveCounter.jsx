

import { useEffect, useState } from "react";
import { motion, animate } from "framer-motion";

export default function Counter() {
  const [startTime, setStartTime] = useState(() => {
    const storedTime = localStorage.getItem("startTime");
    return storedTime ? parseInt(storedTime, 10) : null;
  });

  const [count, setCount] = useState(0);
  const [animatedCount, setAnimatedCount] = useState(0);

  useEffect(() => {
    if (startTime) {
      const updateCounter = () => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        setCount(elapsedSeconds);
      };

      updateCounter(); // Update immediately
      const interval = setInterval(updateCounter, 1000); // Update every second

      return () => clearInterval(interval);
    }
  }, [startTime]);

  useEffect(() => {
    // Animate count changes
    const controls = animate(animatedCount, count, {
      duration: 0.5, // Smooth animation duration
      onUpdate: (latest) => setAnimatedCount(latest),
    });

    return () => controls.stop();
  }, [count]);

  const startEarning = () => {
    const now = Date.now();
    localStorage.setItem("startTime", now);
    setStartTime(now);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.h1
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          padding: "1rem",
        }}
      >
        {Math.round(animatedCount)}
      </motion.h1>
      Points
      <button
        onClick={startEarning}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all"
      >
        Start Earning
      </button>
    </div>
  );
}
