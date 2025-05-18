import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { User } from "../Components"; // Assuming the User component is located here
import { icon } from "../Assets"; // Import the icon image
import axios from 'axios';
import toast from 'react-hot-toast';

import { useAccount, useReadContracts, useTransactionCount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import CountdownTimer from '../Components/Countdown';
import { Tooltip } from 'react-tooltip';



const fetchAllNFTs = async (walletAddress) => {
  let allNFTs = [];
  let page = 1;
  const pageSize = 10; // Adjust if needed

  try {
    while (true) {
      const response = await axios.get("https://api.blockvision.org/v2/monad/account/nfts", {
        params: { address: walletAddress, pageIndex: page, page_size: pageSize },
        headers: {
          accept: "application/json",
          "x-api-key": import.meta.env.VITE_BLOCKVISION_KEY,
        },
      });

      console.log("API Response:", response.data); // Debugging step

      if (!Array.isArray(response.data.result.data)) {
        console.warn("Unexpected API response format:", response.data);
        break; // Stop if response is not an array
      }

      const nfts = response.data.result.data; // Extract NFTs list

      if (nfts.length === 0) break; // Stop if no more NFTs

      allNFTs = [...allNFTs, ...nfts]; // Append new NFTs
      page++; // Go to next page
    }

    return allNFTs;
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return [];
  }
};





const Task = () => {

  const API_KEY = import.meta.env.VITE_BLOCKVISION_KEY;


  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState(null);
  const [isNftLoading, setIsNftLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  // const webUrl = import.meta.env.VITE_WEB_URL;
  const getUserCookies = localStorage.getItem('authUserLoggedInUser');
  const getUserCookiesParsed = JSON.parse(getUserCookies);
  const [wallet, setWallet] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.wallet : '');
  const { data: transactionCount } = useTransactionCount({
    address,
    chainId: 10143, // Ensure monadTestnet.id is defined as 10143
  });

  const [streak, setStreak] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.checkInStreak : 0);
  const [points, setPoints] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.points : 0);
  const [txnCounts, setTxnCounts] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.txnCounts : 0);
  const [lastCheckIn, setLastCheckIn] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.lastCheckInDate : '');
  const [profile, setProfile] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.twitterUsername : '');
  const [token, setToken] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.token : '');
  const [checkInStreak, setCheckInStreak] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.checkInStreak : 0);

  const [isLoading, setIsLoading] = useState(false)
  const [startAnim, setStartAnim] = useState(false)
  const [checkInNextDay, setCheckInNextDay] = useState()
  const [newDay, setNewDay] = useState()
  const [invite, setInvite] = useState('')
  const navigate = useNavigate()
  const hasPostedRef = useRef(false); // Prevents re-renders when updated
  const [provider, setProvider] = useState('')
  const [transactions, setTransactions] = useState(0)
  const allNftsHeld = localStorage.getItem("allNftsHeldMax")
  const allNftsHeldParsed = JSON.parse(allNftsHeld)
  const [nftsHeld, setNftsHeld] = useState(allNftsHeldParsed ? allNftsHeldParsed : '')

  const rewards = [2500, 3000, 3500, 4000, 4500, 5000, 20000];

  // Set the fixed target time (3 PM UTC today + 48 hours)
  const targetTime = new Date();
  targetTime.setUTCHours(17, 0, 0, 0); // 3 PM UTC today
  const countdownTarget = targetTime.getTime() + 48 * 60 * 60 * 1000; // Add 48 hours

  const [timeLeft, setTimeLeft] = useState(countdownTarget - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(countdownTarget - Date.now());
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [countdownTarget]);



  const getClaimedTasksFromLocalStorage = () => {
    const storedData = localStorage.getItem("authUserLoggedInUser");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      return new Set(parsedData?.data?.user?.claimedTasks || []);
    }
    return new Set();
  };

  const [claimed, setClaimed] = useState(getClaimedTasksFromLocalStorage);

  const [loading, setLoading] = useState({});
  const [opened, setOpened] = useState({});
  const [txnIsLoading, setTxnIsLoading] = useState(false);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];
  const today = new Date();
  today.setDate(today.getDate());
  const todayStr = today.toISOString().split("T")[0];


  let lastCheckInDateInActive

  let lastCheckInDateInActiveStr
  //lastCheckIn not active again
  if (lastCheckIn) {
    lastCheckInDateInActive = new Date(lastCheckIn);
    lastCheckInDateInActive?.setDate(lastCheckInDateInActive?.getDate() + 2);
    lastCheckInDateInActiveStr = lastCheckInDateInActive?.toISOString().split("T")[0];
  }


  console.log("lastCheckIn", lastCheckIn, yesterdayStr, todayStr, lastCheckInDateInActiveStr)
  // if (lastCheckIn === yesterdayStr) {

  // }
  // // Confirmed to be working perfectly states
  const [startTime, setStartTime] = useState(() => {
    const storedTime = localStorage.getItem("startTime");
    return storedTime
      ? parseInt(storedTime, 10)
      : getUserCookiesParsed?.data?.user?.startTime || 0;
  });



  // Data for Other Tasks
  const otherTasks = [
    { amount: 2000, description: 'Follow Our Founder on X', _id: "task009", Link: 'https://twitter.com/minisam_sam', cta: 'Do task', tag: 'New' },
    { amount: 2000, description: 'Follow Molundra on X', _id: "task008", Link: 'https://twitter.com/Molundra', cta: 'Do task', },
    { amount: 2000, description: 'Join our discord', _id: "task004", Link: 'https://discord.com/invite/rYGaM87RZV', cta: 'Do task', },
    { amount: 2000, description: 'Follow MonadScore on X', _id: "task005", Link: 'https://twitter.com/intent/follow?screen_name=monadscores_xyz', cta: 'Do task' },
    { amount: 2000, description: 'Like this post', _id: "task006", Link: 'https://twitter.com/intent/like?tweet_id=1904836262176944465', cta: 'Do task' },
    { amount: 2000, description: 'Retweet this post', _id: "task007", Link: 'https://twitter.com/intent/retweet?tweet_id=1904836262176944465', cta: 'Do task' },

  ];
  // Data for Partnership Tasks
  //starting from 300
  const partnerTasks = [
    // { amount: 2000, title: "BeanX", description: 'Follow BeanX on X', _id: "task300", Link: 'https://twitter.com/minisam_sam', cta: 'Do task', },

  ];

  // Data for bonus Tasks
  const scorerTasks = [
    { amount: 20000, description: 'Collect ', subText: '', _id: "task101", Link: 'https://twitter.com/intent/follow?screen_name=monadscores_xyz', cta: 'Do task' },

  ];

  // Data for bonus Tasks
  const bonusTasks = [
    { amount: 20000, description: 'Collect Bonus points', subText: 'Celebrating 50k+ followers on X', _id: "task101", Link: 'https://twitter.com/intent/follow?screen_name=monadscores_xyz', cta: 'Do task' },

  ];
  // Data for onchain Tasks
  const onchainTasks = [
    // { description: 'Transactions  ', contractAddress: '0x922dA3512e2BEBBe32bccE59adf7E6759fB8CEA2', subText: 'Collect points based on your transactions count', _id: "task203", Link: 'https://twitter.com/intent/follow?screen_name=monadscores_xyz', cta: 'Do task', tag: 'New', active: true },

    { amount: 20000, description: '1 Million Nads NFT', contractAddress: '0x922dA3512e2BEBBe32bccE59adf7E6759fB8CEA2', subText: 'wallet must hold >= 1 NFT to qualify', _id: "task202", Link: 'https://twitter.com/intent/follow?screen_name=monadscores_xyz', cta: 'Do task', active: false },
    // { amount: 20000, description: 'Chog star', contractAddress: '0xb33D7138c53e516871977094B249C8f2ab89a4F4', subText: 'wallet must hold >= 1 NFT to qualify', _id: "task201", Link: 'https://twitter.com/intent/follow?screen_name=monadscores_xyz', cta: 'Do task' },


  ];







  const handleClaim = async (taskId, twitterLink) => {
    if (claimed[taskId] || loading[taskId]) return; // Prevent re-clicking

    if (!opened[taskId]) {
      // Open Twitter link in a new tab
      window.open(twitterLink, "_blank");
      setOpened((prev) => ({ ...prev, [taskId]: true })); // Mark as opened
      return; // Exit so user has to click again
    }

    // If already opened, proceed to claim
    setLoading((prev) => ({ ...prev, [taskId]: true }));
    setTimeout(async () => {
      try {

        if (!address) {
          toast.success(<span className="text-xs">Connect wallet to continue! </span>);
        } else {
          let response = await axios.post(`${apiUrl}/api/user/claim-task`, { wallet: address, taskId: taskId }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log(response?.data)

          if (response?.data?.success) {

            localStorage.setItem('authUserLoggedInUser', JSON.stringify(response))
            setClaimed(new Set(response.data?.user?.claimedTasks));
            sessionStorage.setItem('token', response?.data?.token)
            toast.success(<span className="text-xs">Task claimed successfully! </span>);
          } else {

            toast.error(<span className="text-xs">Task error</span>);

          }


        }

      } catch (error) {
        toast.error(<span className="text-xs">Auth error</span>);
        localStorage.clear()
        sessionStorage.clear()
        navigate("/")

        console.error("Error claiming task:", error);



      }
      finally {
        setLoading((prev) => ({ ...prev, [taskId]: false }));
      }
    }, 3000);


  };

  const handleOnchainClaim = async (taskId, twitterLink, transactions) => {
    if (claimed[taskId] || loading[taskId]) return; // Prevent re-clicking
    if (!opened[taskId]) {
      // Open Twitter link in a new tab
      window.open(twitterLink, "_blank");
      setOpened((prev) => ({ ...prev, [taskId]: true })); // Mark as opened
      return; // Exit so user has to click again
    }

    // If already opened, proceed to claim
    setLoading((prev) => ({ ...prev, [taskId]: true }));


    // If already opened, proceed to claim
    setLoading((prev) => ({ ...prev, [taskId]: true }));
    setTimeout(async () => {
      try {

        if (!address) {
          toast.success(<span className="text-xs">Connect wallet to continue! </span>);

        } else {
          if (transactions <= 0) {
            toast.info(<span className="text-xs">wallet must have 0 txns! </span>);
            return
          }


          // const jwtToken = token;
          let response = await axios.post(`${apiUrl}/api/user/claim-task/onchain`, { wallet: address, taskId: taskId, transactionCount: transactions }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log(response?.data)

          if (response?.data?.success) {
            localStorage.setItem('authUserLoggedInUser', JSON.stringify(response))
            setClaimed(new Set(response.data?.user?.claimedTasks));
            sessionStorage.setItem('token', response?.data?.token)
            setStartAnim(true)
            toast.success(<span className="text-xs">Task claimed successfully! </span>);

          } else {

            toast.error(<span className="text-xs">Task error</span>);


          }


        }

      } catch (error) {

        console.error("Error claiming task:", error);
        toast.error(<span className="text-xs">Task error</span>);


      }
      finally {
        setLoading((prev) => ({ ...prev, [taskId]: false }));
      }
    }, 3000);


  };




  const handleCheckIn = async () => {
    if (!wallet) {
      // setError("No wallet connected!");
      return;
    }

    setIsLoading(true);

    try {

      const getUserData = await axios.post(`${apiUrl}/api/user/check-in`, { wallet: address },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )


      if (getUserData?.data?.success) {
        localStorage.setItem('authUserLoggedInUser', JSON.stringify(getUserData))
        setStreak(getUserData?.data?.user?.checkInStreak)
        setLastCheckIn(getUserData?.data?.user?.lastCheckInDate)
        setCheckInStreak(getUserData?.data?.user?.checkInStreak)
        toast.success(<span className="text-xs bg-[#4E0153]">Check-in Complete</span>);
        setIsLoading(false)

      } else {



        toast.error(<span className="text-xs">Check-in error</span>);

        setIsLoading(false)

      }


    } catch (error) {
      console.log('error', error?.response?.data?.error)
      toast.error(<span className="text-xs">Auth error</span>);
      localStorage.clear()
      sessionStorage.clear()
      navigate("/")

      setIsLoading(false)

    }

    setIsLoading(false);
  };



  useEffect(() => {


    if (lastCheckIn && lastCheckIn != null) {

      const lastCheckInDate = new Date(lastCheckIn);
      lastCheckInDate.setDate(lastCheckInDate.getDate() + 1);
      const checkInNextDay = lastCheckInDate.toISOString().split("T")[0];


      const todayDate = new Date()
      todayDate.setDate(todayDate.getDate());
      const newDay = todayDate.toISOString().split("T")[0];

      setCheckInNextDay(checkInNextDay)
      setNewDay(newDay)


    }

  }, [lastCheckIn])






  const handleSocials = () => {
    navigate("/profile")
    navigate(0)
  }

  useEffect(() => {
    if (hasPostedRef.current) return; // Prevents re-execution

    if (!token && getUserCookiesParsed) {
      setToken(getUserCookiesParsed?.data?.token)
    }
  }, [getUserCookiesParsed]);




  const BASE_URL = 'https://api.blockvision.org/v2/monad';

  //withRetries
  const withRetries = async (fn, retries = 3, delay = 1000, signal) => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await fn(); // ✅ Success — exit and return result
      } catch (error) {
        if (signal?.aborted) {
          throw new Error("Request aborted");
        }

        const isLastAttempt = attempt === retries - 1;
        if (isLastAttempt) {
          throw error; // ❌ All retries failed — throw final error
        }

        // Optional: log retry info
        console.warn(`Retrying (${attempt + 1}/${retries}) after error:`, error.message);

        // Wait before next retry
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  };

  const fetchPaginatedData = async (endpoint, wallet, limit = 1) => {
    let allResults = [];
    let cursor = null;
    let prevCursor = null;

    try {
      setTxnIsLoading(true)
      const response = await withRetries(() =>
        axios.get(`${BASE_URL}${endpoint}`, {
          params: {
            address: wallet,
            limit,
            ...(cursor && { cursor }),
          },
          headers: {
            'X-API-Key': API_KEY,
            accept: 'application/json',
          }
        }),
        3,
        1000
      );



      if (response?.data?.message === "OK") {
        console.log("response", wallet, response)
        if (response?.data?.result?.data?.length <= 0) {
          setTransactions(0)
          setTxnIsLoading(false)

          return
        } else {
          setTransactions(response?.data?.result?.total)
          setTxnIsLoading(false)

        }


      }



      return;
    } catch (error) {
      setTxnIsLoading(false)

      throw error;
      return [];

    }
  };


  useEffect(() => {
    if (address && isConnected) {
      if ((claimed.has('task203'))) {
        return
      }
      const transactions = fetchPaginatedData('/account/transactions', address)

      //  console.log("transactions", address, transactions)

    }


  }, [address, isConnected]);




  function isContractInList(contractAddress, data) {
    if (!data || !Array.isArray(data)) {
      return false; // Return false if data is not in expected format
    }

    return data.some(
      (item) => item.contractAddress?.toLowerCase() === contractAddress.toLowerCase()
    );
  }
  const [count, setCount] = useState(0);


  //test animation


  useEffect(() => {
    if (transactions && startAnim) {

      const calculatedPoint = transactions * 100
      const target = Math.min(calculatedPoint, 50000);
      const duration = 1000; // 2 seconds
      const delayBeforeStart = 500;
      const frameInterval = 16; // ~60 FPS

      const totalFrames = Math.floor(duration / frameInterval);
      const increment = target / totalFrames;

      const startTimeout = setTimeout(() => {
        let current = 0;
        let frame = 0;

        const timer = setInterval(() => {
          frame++;
          current += increment;
          if (frame >= totalFrames) {
            setCount(Math.round(target)); // ensure final value is exact
            clearInterval(timer);
          } else {
            setCount(Math.round(current));
          }
        }, frameInterval);
      }, delayBeforeStart);

      return () => clearTimeout(startTimeout);
    }
  }, [transactions, startAnim]);
  // useEffect(() => {

  //   const target =  500; // cap or use actual logic
  //   const duration = 1000; // 2 seconds
  //   const delayBeforeStart = 500;
  //   const frameInterval = 16; // ~60 FPS

  //   const totalFrames = Math.floor(duration / frameInterval);
  //   const increment = target / totalFrames;

  //   const startTimeout = setTimeout(() => {
  //     let current = 0;
  //     let frame = 0;

  //     const timer = setInterval(() => {
  //       frame++;
  //       current += increment;
  //       if (frame >= totalFrames) {
  //         setCount(Math.round(target)); // ensure final value is exact
  //         clearInterval(timer);
  //       } else {
  //         setCount(Math.round(current));
  //       }
  //     }, frameInterval);
  //   }, delayBeforeStart);

  //   return () => clearTimeout(startTimeout);
  // }, []);


  console.log('allNftsHeldParsed', allNftsHeldParsed, nftsHeld)

  return (
    <div className="lg:ml-64 px-6 sm:px-4 lg:w-[calc(100%-16rem)] min-h-screen sm:ml-0">
      {/* Greeting Section */}
      <User />

      {/* Daily Task Section */}
      <div className='flex items-start'>
        <p className="text-white text-lg pr-2 font-bold">Daily Check-in</p><span className='text-green-400 opacity-60 text-[10px]'>NEW</span>
      </div>

      <div className="mt-6 relative rounded-lg bg-[#45004A] border-b-4 border-black p-4 text-white flex items-end justify-between md:w-3/12">
        <div className='top-0 left-0 absolute w-full h-1'>
          <StreakBar streak={checkInStreak} lastCheckInDateInActiveStr={lastCheckInDateInActiveStr} todayStr={todayStr} />

        </div>

        <div>
          <p className='pb-2 text-nowrap flex'>Day
            &nbsp;



            {streak == 0 ? <>1</> :
              <>{newDay == lastCheckIn ?
                <>{streak}<svg xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>

                </>
                :
                <>{streak == 7 ? <>1</> : <>{newDay > checkInNextDay ? <>1</> : <>{streak + 1}</>}</>}</>
              }</>
            }



          </p>


          <div className="flex items-center space-x-4">
            <img src={icon} alt="icon" className="w-6 h-6" />


            <span className="text-xl">
              {
                streak === 0 ? (

                  rewards[0]
                ) : (
                  newDay === lastCheckIn ? (
                    todayStr >= lastCheckInDateInActiveStr ? rewards[0] :
                      rewards[Math.min(streak - 1, rewards.length - 1)]
                  ) : (
                    streak === 7 ? (
                      rewards[0]
                    ) : (
                      newDay > checkInNextDay ? (
                        todayStr >= lastCheckInDateInActiveStr ? rewards[0] :
                          rewards[Math.min(streak, rewards.length - 1)]
                      ) : (
                        todayStr >= lastCheckInDateInActiveStr ? rewards[0] :
                          rewards[Math.min(streak, rewards.length - 1)]
                      )
                    )
                  )
                )
              }
            </span>
          </div>
        </div>

        <button className={`bg-[#2B002E] text-white p-2 rounded-lg ${((newDay == lastCheckIn) && newDay != null) ? ' text-gray-500' : ''}`}
          onClick={handleCheckIn}
          disabled={((newDay == lastCheckIn) && newDay != null) || isLoading}
        >
          {isLoading ? <>Loading...</> : <>{((newDay == lastCheckIn) && newDay != null) ?
            <>
              <div
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Come back tmao"
                className='cursor-pointer'
              >
                Done
              </div>


              <Tooltip id="my-tooltip"
                style={{ backgroundColor: "#2B002E", color: "#fff" }}
              />
            </> : <div className='cursor-pointer'>Check In</div>}</>}
        </button>
      </div>


      <div className='relative'>
        {/* Other Tasks Section */}
        <div className="mt-6">
          <p className="text-white text-lg font-bold">Daily Tasks</p>

          {/* Grid for Other Tasks */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-6">





            {otherTasks.map((task) => (
              <div key={task._id} className="bg-[#45004A] rounded-lg p-4 border-b-4 border-black">
                <div className="flex items-center space-x-4">
                  <div className='flex items-center'>
                    <img src={icon} alt="icon" className="w-6 h-6" />&nbsp;
                    <span className="text-white text-xl">{task.amount}</span>
                    {task.tag &&
                      <span className='text-green-400 opacity-60 text-[10px] translate-y-[-2px] '>&nbsp;&nbsp;NEW</span>

                    }
                  </div>
                </div>
                <p className="text-white text-sm mt-4">{task.description}</p>

                <button
                  className={`mt-4 w-full p-2 text-white rounded-lg ${claimed.has[task._id] ? "bg-[#4E0153] cursor-not-allowed" : "bg-[#2B002E] cursor-pointer hover:bg-[#3D0040]"
                    }`}
                  onClick={() => handleClaim(task._id, task.Link)}
                  // disabled={claimed[task._id]}
                  disabled={claimed.has(task._id)}
                >
                  {claimed.has(task._id) ? <>Claimed</> :
                    <>{loading[task._id]
                      ? "Claiming..."
                      : claimed[task._id]
                        ? "Claimed"
                        : opened[task._id]
                          ? "Claim"
                          : "Do Task"
                    }</>}
                </button>
              </div>
            ))}





          </div>
        </div>



        <div className="mt-6">
          <div className='flex items-start'>
            <p className="text-white text-lg pr-2 font-bold">On-chain Tasks </p>

          </div>




          <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-6">

            {onchainTasks.map((task) => (
              <div key={task._id} className="bg-[#45004A]  rounded-lg p-4 border-b-4 border-black">
                <div className="flex  min-[330px]:flex-wrap items-center justify-between space-x-4">
                  <div className='flex items-center'>
                    <img src={icon} alt="icon" className="w-6 h-6" /> &nbsp;
                    <span className="text-white text-xl">{task.amount}</span>
                    {task.tag &&
                      <span className='text-green-400 opacity-60 text-[10px] translate-y-[-2px] '>&nbsp;&nbsp;NEW</span>

                    }
                  </div>
                  <div className='flex items-end justify-end  '>
                    <div className='flex flex-col'>
                      <div className='text-sm flex items-center justify-center  text-green-400 bg-black bg-opacity-35 px-2 py-1'>
                        {/* {(nftsHeld && isContractInList(task.contractAddress, nftsHeld) || claimed.has(task._id)) ? <>Eligible</> : <div className='text-gray-200 opacity-25'>Not Eligible</div>} */}
                        {(task.active) ? <div className='flex flex-col items-center'><div>txns count <span className='text-white text-sm font-bold'>{txnIsLoading ? <span class="txnsLoader"></span> : <>{(claimed.has(task._id)) ? <>{transactionCount}</> : <>{transactions}</>}</>}</span></div></div> : <div className='text-gray-200 opacity-25'>Ended</div>}

                      </div>


                    </div>
                  </div>
                </div>
                <p className="text-white text-sm mt-4">{task.description}</p>
                <p className="text-white text-xs opacity-40 mt-[0.5px]">{task.subText}</p>
                {/* <div className='text-white opacity-50'>{count}</div> */}
                <div className='flex items-end justify-end w-full mt-4'>
                  <CountdownTimer />
                </div>

                <button
                  className={`mt-2 w-full p-2 text-white rounded-lg ${(claimed.has[task._id] || !task.active) ? "bg-[#4E0153] cursor-not-allowed" : "bg-[#2B002E] cursor-pointer hover:bg-[#3D0040]"
                    }`}
                  onClick={() => handleOnchainClaim(task._id, task.Link, transactions)}

                  disabled={claimed.has(task._id) || !transactions}
                >

                  {((task.active)) ?

                    <> {(claimed.has(task._id)) ? <div className='flex items-center justify-center'>Claimed &nbsp; {startAnim ? <>{count}</> : <>{Math.min(txnCounts * 100, 50000)}</>} &nbsp; <img src={icon} alt="icon" className="w-6 h-6" /></div> :
                      <>{loading[task._id]
                        ? "Claiming..."
                        : claimed[task._id]
                          ? <div className='text-white '> Claimed {count}  <img src={icon} alt="icon" className="w-6 h-6" /></div>
                          : opened[task._id]
                            ? "Claim"
                            : <>{txnIsLoading ? <div > <span class="txnsLoader"></span>&nbsp;<span className=' opacity-40'>fetching txns</span></div> : 'Do task'}</>
                      }</>}</> : <div className='text-gray-200 opacity-25'>Ended</div>}



                </button>

              </div>
            ))}




          </div>


        </div>
        {/* <hr className='bg-white my-5 h-[2px] bg-opacity-20 opacity-10' /> */}
        <div className="mt-10">

          <div className='flex items-start'>
            {/* <p className="text-white text-lg pr-2 font-bold">Partnership Tasks </p><span className='text-green-400 opacity-60 text-[10px]'>NEW</span> */}
          </div>

          {/* Grid for Partnership Tasks */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-6">





            {partnerTasks.map((task) => (
              <div key={task._id} className="bg-[#45004A] rounded-lg p-4 border-b-4 border-black">
                <div className="flex items-center space-x-4">
                  <div className='flex items-center'>
                    <img src={icon} alt="icon" className="w-6 h-6" />&nbsp;
                    <span className="text-white text-xl">{task.amount}</span>
                    <>{task.tag &&
                      <span className='text-green-400 opacity-60 text-[10px] translate-y-[-2px] '>&nbsp;&nbsp;NEW</span>

                    }</>
                  </div>
                </div>
                <p className="text-white text-sm mt-4">{task.description}</p>

                <button
                  className={`mt-4 w-full p-2 text-white rounded-lg ${claimed.has[task._id] ? "bg-[#4E0153] cursor-not-allowed" : "bg-[#2B002E] cursor-pointer hover:bg-[#3D0040]"
                    }`}
                  onClick={() => handleClaim(task._id, task.Link)}
              
                  disabled={claimed.has(task._id)}
                >
                  {claimed.has(task._id) ? <>Claimed</> :
                    <>{loading[task._id]
                      ? "Claiming..."
                      : claimed[task._id]
                        ? "Claimed"
                        : opened[task._id]
                          ? "Claim"
                          : "Do Task"
                    }</>}
                </button>
              </div>
            ))}





          </div>
        </div>

      </div>

    </div>
  );
};

export default Task;

const StreakBar = ({ streak, lastCheckInDateInActiveStr, todayStr }) => {

  console.log("streakBar", lastCheckInDateInActiveStr, todayStr)
  return (
    <div className="grid grid-cols-7 gap-1 h-[2px] rounded overflow-hidden">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className={`transition-colors rounded ${i < streak ? todayStr >= lastCheckInDateInActiveStr ? 'bg-gray-300' : 'bg-green-500' : 'bg-gray-300'
            }`}
        />
      ))}
    </div>
  );
};