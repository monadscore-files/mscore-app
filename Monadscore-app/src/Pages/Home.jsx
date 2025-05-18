import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Progressbar, User } from "../Components";
import { icon, node } from "../Assets";
import { useAccount, useChainId, useDisconnect, useSignMessage } from "wagmi";
import StyledConnectButton from "../Components/StyledButton";
import axios from "axios";
import { motion, animate } from "framer-motion";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from 'react-hot-toast';
import { Tooltip } from "react-tooltip";
import { jwtDecode } from "jwt-decode";
import { useSwitchToMonad } from "../Hooks/useSwitchToMonad";
import useAutoSwitchToMonad from "../Components/SwitchToMonad";


const Home = () => {
  const referralCode = "123456";
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const [signature, setSignature] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const apiUrl = import.meta.env.VITE_API_URL;
  const webUrl = import.meta.env.VITE_WEB_URL;
  const getUserCookies = localStorage.getItem('authUserLoggedInUser');
  const getUserCookiesParsed = JSON.parse(getUserCookies);

  const [isLoading, setIsLoading] = useState()
  const [wallet, setWallet] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.wallet : '');
  const [totalPoints, setTotalPoints] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.totalPoints : 0);
  const [referralPoints, setReferralPoints] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.referralPoints : 0);
  const [referralPointsMain, setReferralPointsMain] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.referralPointsMain : 0);
  const [nextTotalPoints, setNextTotalPoints] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.nextTotalPoints : 0);
  const [referralLength, setReferralLength] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.refer?.length : 0);
  const [nodeActive, setNodeActive] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.nodeActive : false);
  const [nodeUptime, setNodeUptime] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.nodeUptime : 0);
  const [earnings, setEarnings] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.earnings : []);
  const [ref, setRef] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.referralCode : '');
  const [token, setToken] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.token : '');
  const webLink = `${webUrl}/r/${ref}`
  const [invite, setInvite] = useState('')
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const location = useLocation();
  const prevPage = location.state?.from || "Direct visit";
  const navigate = useNavigate()
  const { refCode } = useParams();
  const hasPostedRef = useRef(false); // Prevents re-renders when updated
  const [newTokenActive, setNewTokenActive] = useState(false);
  const { switchToMonad } = useSwitchToMonad();
  const [currentChainId, setCurrentChainId] = useState(null);

  // // Confirmed to be working perfectly states
  const [startTime, setStartTime] = useState(() => {
    const storedTime = localStorage.getItem("startTime");
    return storedTime
      ? parseInt(storedTime, 10)
      : getUserCookiesParsed?.data?.user?.startTime || 0;
  });
  const [count, setCount] = useState(() => {
    const storedCount = localStorage.getItem("count");
    return storedCount ? parseInt(storedCount, 10) : 0;

  });
  const [animatedCount, setAnimatedCount] = useState(0);
  // Function to format address (first 4 + last 6 characters)
  const formatAddress = (addr) => {
    return addr ? <div style={{ lineHeight: '0' }}>{`${addr.slice(0, 4)}...${addr.slice(-6)}`}</div> : "";
  };
  const [progress, setProgress] = useState({});





  const getUserData = async (address) => {
  
    setIsLoading(true)
    try {

      if (!address) {
        alert('enter wallet or twitter')
      } else {
        const jwtToken = token
        let response = await axios.post(`${apiUrl}/api/user/login`, { wallet: address }, {
          headers: { Authorization: `Bearer ${jwtToken}` }
        });
        console.log("localhost:3000 response", response?.data)

        if (response?.data?.success) {
          localStorage.setItem('authUserLoggedInUser', JSON.stringify(response))
          sessionStorage.setItem('token', JSON.stringify(response?.data.token))
          setIsLoading(false)
          return true;
        } else {
          return false;

        }

      }


    } catch (error) {

      console.log("error", error)
      localStorage.clear()
      sessionStorage.clear()
      disconnect()
      navigate("/")
      return false;
    }
  }

  const updateUserNodeStatus = async (address, time) => {
    console.log('address', address)
    setIsLoading(true)

    try {

      if (!address) {
        alert('enter wallet or twitter')
      } else {
        const jwtToken = token
        let response = await axios.put(`${apiUrl}/api/user/run-node`, { wallet: address, startTime: time }, {
          headers: { Authorization: `Bearer ${jwtToken}` }
        })

        if (response?.data?.success) {

          localStorage.setItem('authUserLoggedInUser', JSON.stringify(response))
          setRef(response?.data?.user?.referralCode)
          setWallet(response?.data?.user?.wallet)
          setTotalPoints(response?.data?.user?.totalPoints)
          setReferralPoints(response?.data?.user?.referralPoints)
          setReferralPointsMain(response?.data?.user?.referralPointsMain)
          setNextTotalPoints(response?.data?.user?.nextTotalPoints)
          setReferralLength(response?.data?.user?.refer?.length)
          setStartTime(response?.data?.user?.startTime)
          setNodeUptime(response?.data?.user?.nodeUptime)
          setEarnings(response?.data?.user?.earnings)
          sessionStorage.setItem('token', response?.data?.token)
          localStorage.setItem("startTime", time);
          setStartTime(time);
          setNodeActive(true)
          setIsLoading(false)
          toast.success(<span className="text-xs">Mining Activated</span>);
        } else {
          toast.error(<span className="text-xs">Miner Error  <br /> Restart in 10s</span>);
          setIsLoading(false)

        }

      }


    } catch (error) {
      console.error("Axios Error:", error.response ? error.response.data : error.message);
      toast.error(<span className="text-xs">Auth error</span>);
     localStorage.clear()
     sessionStorage.clear()
      navigate("/")
      setIsLoading(false)
    }
  }



  // Sign a message
  const handleSignMessage = async () => {

    if (!isConnected || !address) return;
    if (startTime !== 0 ) {
      const userDataFetched = await getUserData(address);
      if (!userDataFetched) {
        console.error("getUserData failed — aborting sign");
        toast.error(<span className="text-xs">Miner Error!</span>);
        return;
      }
    }

    // Ensure to switch to Monad Testnet before signing
    const didSwitch = await switchToMonad();
    if (!didSwitch) {
      console.error("Failed to switch to Monad network.");
      return;
    }

    try {
      if (!isConnected || !address) {
        console.error("No wallet connected!");
        return;
      }

      const message = `Sign this message to verify ownership and start mining on monad score!\n\n${address} `;
      const signedMessage = await signMessageAsync({ message }); // Ensure `message` is a string

      if (signedMessage) {
        setSignature(signedMessage);
        // set start time
        const now = Date.now();
        await updateUserNodeStatus(address, now)
        console.log('signature', signature)
      } else {
        throw new Error("Signing failed: No response from wallet.");
      }
    } catch (error) {
      console.error("Signing failed:", error);
      setSignature(null);
    }
  };



  const getTotalPointFromTimestamp = (timestamp, pointsPerSecond = 1) => {
    // Convert timestamp to Date object
    const now = new Date(timestamp);

    // Get the next midnight (00:00 UTC)
    const nextMidnight = new Date(now);
    nextMidnight.setUTCHours(0, 0, 0, 0);
    nextMidnight.setUTCDate(nextMidnight.getUTCDate() + 1); // Move to the next day

    // Calculate the time left in seconds
    const timeLeftInSeconds = Math.floor((nextMidnight - now) / 1000);

    // Calculate total points
    const totalPoints = timeLeftInSeconds * pointsPerSecond;

    return totalPoints;
  };

  const getHoursLeftFromTimestamp = (timestamp) => {
    // Get current UTC time
    const now = new Date();
    const nowUTC = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds())
    );

    // Get next midnight in UTC
    const nextMidnightUTC = new Date(nowUTC);
    nextMidnightUTC.setUTCHours(0, 0, 0, 0);
    nextMidnightUTC.setUTCDate(nextMidnightUTC.getUTCDate() + 1); // Move to next day's midnight UTC

    // Calculate the difference in milliseconds
    const timeLeft = nextMidnightUTC - nowUTC;

    if (timeLeft <= 0) {
      return "";
    }

    // Convert milliseconds to hours, minutes, and seconds
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return <div className='text-bold text-green-100'>{`${hours} h : ${minutes} m : ${seconds} s`}</div>;
  };




  //getNextMidnightFromTimestamp from timestamp
  const getNextMidnightFromTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    // Set the time to midnight UTC (00:00 UTC) of the next day
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() + 1);

    // Return the timestamp of next day's midnight
    return date.getTime();
  };



  // Function to calculate the hours left from the provided timestamp until midnight
  const getHoursLeftUntilMidnight = (timestamp) => {
    const now = new Date(timestamp);
    const nextMidnight = new Date((timestamp));

    // Calculate the time left in hours
    const timeLeftInMs = nextMidnight - now;
    const timeLeftInHours = timeLeftInMs / (1000 * 60 * 60); // Convert to hours

    return timeLeftInHours;
  };


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



  useEffect(() => {
    const newProgress = {};

    earnings.forEach((day, index) => {
      const hoursLeft = getHoursLeftUntilMidnight(day.timestamp);
      const percentage = Math.max(0, Math.min(100, (hoursLeft / 24) * 100)).toFixed(2); // Ensure the value is between 0 and 100
      newProgress[`day${index + 1}`] = percentage;
    });

    setProgress(newProgress);
  }, [earnings]);

  // Calculate progress for each day
  useEffect(() => {
    if (nodeUptime) {
      // Convert to days and remaining hours
      const days = Math.floor(nodeUptime / 24);
      const hours = nodeUptime % 24;

      setDays(days)
      setHours(hours)
    }

  }, [nodeUptime]);






  useEffect(() => {
    if (refCode && refCode !== undefined) {
      localStorage.setItem("storedInviteCode", refCode);

    }
  }, [refCode]);



  // runs on page load
  useEffect(() => {


    // Step 1: Token Check
    const activeToken = token || getUserCookiesParsed?.data?.token;
    let decoded;
    if (activeToken) {
      decoded = jwtDecode(activeToken);
    }
    const now = Date.now(); // Convert to seconds
 
    const tokenExpInMs = decoded ? decoded.exp * 1000 : 0;
    const timeLeftTillExpired = decoded ? tokenExpInMs - now : 0;


    const storedInviteCode = localStorage.getItem('storedInviteCode')
    if (storedInviteCode) {
      setInvite(storedInviteCode);
      console.log("Stored Invite Code:", storedInviteCode);
    }

    if (address && startTime && startTime !== 0) {
      const pointsTotal = getTotalPointFromTimestamp(startTime)
      const getNextMidnightFromStartTime = getNextMidnightFromTimestamp(startTime)
      console.log('getNextMidnightFromStartTime', getNextMidnightFromStartTime, startTime, getNextMidnightFromStartTime - startTime)
      const hoursLeft = getHoursLeftFromTimestamp()
      const now = Date.now()
      console.log('getHoursLeft', hoursLeft, pointsTotal)


      if (now < getNextMidnightFromStartTime ) {
        setNodeActive(true)
      } else {
        setNodeActive(false)
      

      }

    }



  }, []);






  useEffect(() => {


    if (!token && getUserCookiesParsed) {
      setToken(getUserCookiesParsed?.data?.token)
    }
  }, [getUserCookiesParsed]);





  return (
    <div className="lg:ml-64 px-6 sm:px-4 lg:w-[calc(100%-16rem)] min-h-screen sm:ml-0">
      {/* Greeting Section */}
      <User />



      {/* Earnings Section */}
      <div key={refresh} className="mt-6 flex flex-col sm:flex-row sm:space-x-6 sm:w-full">
        {/* Total Earnings Section */}
        <div className="w-full sm:w-2/3 rounded-lg bg-[#45004A] border-b-4 border-black p-6 sm:p-8 text-white">
          <h2 className="text-lg mb-2 font-bold">Earnings</h2>

          <div className="bg-[#2B002E] py-8 px-6 rounded-xl flex flex-col justify-around xl:flex-row gap-8 sm:gap-16">
            <div className="flex items-center justify-between gap-8 sm:gap-8  border-r-[#45004A]">
              <p className="text-xs md:text-sm opacity-50">
                Total   <br /> Earning:
              </p>
              <div className="flex gap-2 items-center">
                <img src={icon} alt="icon" className="w-6 h-6" />

                <p className="text-xl md:text-3xl">
                  <strong>{address ? <>{isLoading ? <>
                    <span class="data-loader"></span></> : <>{!nodeActive
                      ? Math.max(nextTotalPoints, totalPoints + (referralPoints || 0) + (referralPointsMain || 0))
                      : <>{<>{totalPoints + (referralPoints || 0) + (referralPointsMain || 0)}</>}</>}</>}</> : <div >0</div>}</strong>
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-8 sm:gap-8">
              <p className="text-xs  md:text-sm opacity-50">
                Today's   <br /> Earning:
              </p>
              <div className="flex gap-2 items-center">
                <img src={icon} alt="icon" className="w-6 h-6" />

                <div className="text-xl md:text-3xl">

                  {(!address || !nodeActive) ? <>{address ? <>{isLoading ? <>
                    <span class="data-loader"></span></> : 0}</> : <>{isLoading ? <>
                      <span class="data-loader"></span></> : 0}</>}</> :
                    <motion.h1
                      style={{

                        fontWeight: "bold",

                      }}
                    >
                      {Math.round(animatedCount / 2)}
                    </motion.h1>
                  }

                </div>
              </div>
            </div>
          </div>
          {nodeActive && <div className="flex justify-center text-xs flex-col  items-center py-5">
            <div className="border-[1px] flex items-center justify-center bg-[#2B002E] py-2 w-full sm:w-2/3 lg:w-1/2 sm:px-10 border-[#8EFF65] rounded-lg">
              <img src={node} height='10px' width='14px' />
              &nbsp;&nbsp;
              &nbsp;&nbsp;
              Node&nbsp;
              <span className=" text-[#8EFF65] text-xs">
                Connected

              </span>
            </div>
            <span className="text-xs pt-3 text-[#a9a9a9]">
              You are currently connected, keep your connection on to keep earning
            </span>

          </div>}
        </div>

        {/* Connect Section */}


        <div key={refresh} className="w-full sm:w-1/3 flex justify-center flex-col rounded-lg bg-[#45004A] border-b-4 border-black p-6 sm:p-8 text-white text-center mt-6 sm:mt-0">
          <>

            {isConnected ?
              <>{nodeActive ?
                <div className="bg-[#2B002E] text-white p-2  text-center justify-center rounded-lg w-full mb-5">
                  <span class="loader"></span>
                  <hr className=" border-white opacity-10" />
                  <div className="w-full flex justify-center  md:justify-between items-stretch flex-wrap pt-3">
                    <div className="text-sm flex flex-col w-full  md-w-1/2 lg:w-full  xl:w-1/2 items-center text-center " ><span className="opacity-50 flex items-center">Next Epoch&nbsp;

                      <div
                        data-tooltip-id="pend-tooltip"
                        data-tooltip-content="Time remaining to restart node to keep accumalating Node points"
                        className=" cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
                      </div>
                      <Tooltip id="pend-tooltip"
                        style={{
                          //  backgroundColor: "#2B002E",
                          backgroundColor: "#fff",
                          color: "#000",
                          fontSize: '10px'
                        }}
                      // place='bottom-start'

                      />

                    </span> <span> {getHoursLeftFromTimestamp()}  </span></div>
                    <p className="text-sm flex w-full  xl:w-1/2 flex-col" ><span className=" opacity-50">Node Total Uptime&nbsp;</span>  <span>   {days > 0 ? <span>{days} d &nbsp; </span> : ""}{hours || 0} h</span></p>
                  </div>
                  {/* {getTotalPointFromTimestamp(startTime)} */}
                </div> :
                <>{isLoading ?
                  <div className="mb-5 p-2 flex flex-col-reverse items-center ">
                    <p className="text-xs">
                      Getting miner ready...

                    </p>

                    <span class="miner-loader"></span>
                  </div>

                  :

                  <button className="bg-[#2B002E] text-white p-2 rounded-lg w-full mb-5"
                    onClick={handleSignMessage}
                  >
                    <>Run Node </>

                  </button>
                }

                </>
              }

                <button className=" bg-red-200 text-black p-2 rounded-lg w-full mb-2"
                  onClick={disconnect}
                >
                  Disconnect
                </button>

              </>
              :
              <>
                <StyledConnectButton />
                {/* <LiveCounter /> */}
              </>
            }
            <div style={{ lineHeight: '0' }} >

              {isConnected ? <>
                <div className="text-blue-100 font-bold py-5" style={{ lineHeight: "0px" }}>
                  {formatAddress(address)}</div>
                <br />
              </> : <p className="pt-3" style={{ lineHeight: "20px" }}> Click on the connect wallet button to
                continue earning.</p>}
            </div>
          </>
        </div>
      </div>

      {/* Connection Statistics */}
      <div className="mt-6">
        <p className="text-white">Your connection statistics</p>

        {/* Dashboard Card */}
        <div className="bg-[#45004A] w-full rounded-lg p-6 mt-4">
          <h3 className="text-white text-xl mb-4">
            <span className="text-white/50">7 Days Streak:</span> Keep your
            connection for more points
          </h3>
          <div className="space-y-4">
            <Progressbar earnings={earnings} startTime={startTime} nodeActive={nodeActive} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
