import { useEffect } from "react";

const useMidnightRefresh = () => {
  useEffect(() => {
    const now = new Date();
    const midnightUTC = new Date(now);

    midnightUTC.setUTCHours(24, 0, 0, 0); // Set to next midnight UTC

    const timeUntilMidnight = midnightUTC - now; // Time remaining in ms

    console.log("Next refresh in:", timeUntilMidnight / 1000 / 60, "minutes");

    // Set a timeout to refresh at exactly 00:00 UTC
    const timeout = setTimeout(() => {
      window.location.reload();
    }, timeUntilMidnight);

    return () => clearTimeout(timeout); // Cleanup on unmount

  }, []);
};

export default useMidnightRefresh;


