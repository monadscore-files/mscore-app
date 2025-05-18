import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import { FloatButton } from "antd";
import { Footer, Navbar, WalletWatcher } from "./Components"; // Import Navbar
import { ComingSoon, Faq, Home, Join, Login, NoPage, Profile, Reset, Task } from "./Pages"; // Import Join and Reset
import { Providers } from "./Components/WagmiConfig";
import { Toaster, toast } from 'react-hot-toast';
import Referral from "./Pages/Referral";
import useMidnightRefresh from "./Components/MidnightRefresh";
import useAutoSwitchToMonad from "./Components/SwitchToMonad";
import { useAccount, useDisconnect } from "wagmi";
import { jwtDecode } from "jwt-decode";

function App() {
  // useAutoSwitchToMonad();
  useMidnightRefresh()
  const apiUrl = import.meta.env.VITE_API_URL;
  const location = useLocation(); // Get the current location
  const { address, isConnected } = useAccount();
  const getUserCookies = localStorage.getItem('authUserLoggedInUser');
  const getUserCookiesParsed = JSON.parse(getUserCookies);
  const [wallet, setWallet] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.wallet : '');
  const Navigate = useNavigate()
  const hasPostedRef = useRef(false); // Prevents re-renders when updated
  const [newTokenActive, setNewTokenActive] = useState(false);
  const { disconnect } = useDisconnect();
  const [token, setToken] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.token : '');

  // // Confirmed to be working perfectly states
  const [startTime, setStartTime] = useState(() => {
    const storedTime = localStorage.getItem("startTime");
    return storedTime
      ? parseInt(storedTime, 10)
      : getUserCookiesParsed?.data?.user?.startTime || 0;
  });


  const getUserData = async (address) => {

    try {

      if (!address) {
        disconnect()
        Navigate("/")

      } else {
        const jwtToken = token

        let response = await axios.post(`${apiUrl}/api/user/login`, { wallet: address }, {
          headers: { Authorization: `Bearer ${jwtToken}` }
        });
        if (response?.data?.success) {
          localStorage.setItem('authUserLoggedInUser', JSON.stringify(response))
          sessionStorage.setItem('token', JSON.stringify(response?.data.token))

        } else {
          throw new Error("Login failed");    

        }

      }


    } catch (error) {
  
      console.log("error", error)
      disconnect()
      sessionStorage.clear()
      localStorage.clear()
      Navigate("/")

    }
  }






  //getNextMidnightFromTimestamp from timestamp
  const getNextMidnightFromTimestamp = (timestamp) => {
    const date = new Date(timestamp);



    // Set the time to midnight UTC (00:00 UTC) of the next day
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() + 1);


    // Return the timestamp of next day's midnight
    return date.getTime();
  };

  const getNextSundayMidnightFromTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    // Move to the next Sunday
    const currentDay = date.getUTCDay(); // Sunday = 0, Saturday = 6
    const daysUntilSunday = (7 - currentDay) % 7 || 7; // at least one day ahead
    date.setUTCDate(date.getUTCDate() + daysUntilSunday);

    // Set to midnight UTC
    date.setUTCHours(0, 0, 0, 0);

    return date.getTime();
  };



  useEffect(() => {

    if (address && isConnected) {
      if (wallet && address !== wallet) {    
        localStorage.removeItem('startTime');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('activeWallet');
        console.log("wallet Changed!", address)
        Navigate("/")

      } 

      }


  }, [address, isConnected && wallet]);

  useEffect(() => {
    const activeToken = token || getUserCookiesParsed?.data?.token;



    //not the issue
    if (!activeToken || !address || !wallet || address !== wallet) {
      disconnect();
      localStorage.removeItem('startTime');
      Navigate("/");
      return;
    }
  
    const decoded = jwtDecode(activeToken);
    const now = Date.now();
    const tokenExpInMs = decoded.exp * 1000;
    const timeLeft = tokenExpInMs - now;
  

    // Token expired
    if (timeLeft <= 0) {
      console.log("Token expired");
      sessionStorage.clear();
      localStorage.clear()
      Navigate("/");
      return;
    }


    // Sunday Midnight Reset
    //not the issue

    const nextSundayMidnight = getNextSundayMidnightFromTimestamp(startTime);
    if (now > nextSundayMidnight && startTime !== 0) {
      console.log("Sunday midnight reset - redirecting");
      localStorage.clear()
      sessionStorage.clear()
      Navigate("/");
      return;
    }
  
    // Daily Reset Check
    const nextMidnight = getNextMidnightFromTimestamp(startTime);
    if (now > nextMidnight && startTime !== 0) {
      console.log("Daily reset - getting fresh user data");
      getUserData(address);
      return;
    }
  

  
    // Token expiring in 20 minutes
    const refreshBeforeExpiration = 1000 * 60 * 20;
    if (timeLeft <= refreshBeforeExpiration) {
      console.log("Token near expiration - refreshing...");
      getUserData(address);
    } else {
      const refreshInterval = setTimeout(() => {
        console.log("Scheduled token refresh triggered");
        getUserData(address);
      }, timeLeft - refreshBeforeExpiration);
  
      return () => clearTimeout(refreshInterval);
    }
  }, []);
  


  return (

    <div className="App scroll-smooth bg-gradient-to-b from-[#2F0032] to-black ">

      {/* Conditionally render Navbar only if the current route is not /login, /join, or /reset */}
      {location.pathname !== "/login" && location.pathname !== "/join" && location.pathname !== "/reset" && location.pathname !== "/" && location.pathname !== "/r/:ref" && <Navbar />}


      <Routes>
        <Route path="/dashboard" element={<Home />} />
        <Route path="/tasks" element={<Task />} />
        <Route path="/join" element={<Join />} />
        <Route path="/" element={<Login />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/r/:refCode" element={<Home />} />
        <Route path="/signup/r/:refCode" element={<Home />} />
        <Route path="/*" element={<NoPage />} />
      </Routes>
      {/* <Routes>
    
        <Route path="/" element={<ComingSoon />} />
        <Route path="/*" element={<ComingSoon />} />
      </Routes> */}

      <Footer />
      <Toaster
        toastOptions={{
          // duration: 5000,
          style: {
            background: "#333",
            color: "#fff",
            fontSize: "16px",
            borderRadius: "8px",
            padding: "12px",
          },
          success: {
            style: {
              background: "rgba(78, 1, 83, 0.4)",
              color: "#fff",
            },
            icon: "✅",
          },
          info: {
            style: {
              background: "rgba(78, 1, 83, 0.4)",
              color: "#000000",
            },
            icon: "",
          },
          error: {
            style: {
              background: "rgba(78, 1, 83, 0.4)",
              color: "#FF3B30",
            },
            icon: "❌",
          },
        }}

      />
      <FloatButton.BackTop />
    </div>
  );
}

// Wrap App with BrowserRouter to provide location context
function AppWithRouter() {
  return (
    <Providers>
      <BrowserRouter>
        <App />
      </BrowserRouter>
   </Providers>

  );
}

export default AppWithRouter;