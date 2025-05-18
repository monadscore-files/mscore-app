import React, { useEffect, useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { User } from "../Components";
import { rank0, rank1, rank2, rank3, rank4, rank5, rank6, chevron, podium } from "../Assets";
import { rank0Active, rank1Active, rank2Active, rank3Active, rank4Active, rank5Active, rank6Active } from "../Assets"; // Import active images
import { useAccount } from "wagmi";
import toast from 'react-hot-toast';
import axios from "axios";
import { Tooltip } from "react-tooltip";


const Referral = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const webUrl = import.meta.env.VITE_WEB_URL;
  const getUserCookies = localStorage.getItem('authUserLoggedInUser');
  const getLeaderboardCookies = sessionStorage.getItem('leaderboard');
  const getUserCookiesParsed = JSON.parse(getUserCookies);
  const getLeaderboardCookiesParsed = JSON.parse(getLeaderboardCookies);
  const [leaderboard, setLeaderboard] = useState(getLeaderboardCookiesParsed ? getLeaderboardCookiesParsed?.data?.topWallets : []);
  const [referralLength, setReferralLength] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.referCounter : 0);
  const [pendingReferralLength, setPendingReferralLength] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.pendingReferCounter : 0);
  const [totalPoints, setTotalPoints] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.totalPoints : 0);

  const { address, isConnected } = useAccount();
  const [ref, setRef] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.referralCode : '');
  const [lastCall, setLastCall] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.lastRequestAt : '');

  const webLink = `${webUrl}/signup/r/${ref}`
  const [earnedPoints, setEarnedPoints] = useState()



  const referralMilestones = [

    { rank: 0, name: "Rookie", minRefs: 0, maxRefs: 1, pointsPerRef: 0, multiplier: 1, image: rank0, activeImage: rank0Active },
    { rank: 1, name: "Beginner", minRefs: 2, maxRefs: 12, pointsPerRef: 540, multiplier: 1, image: rank1, activeImage: rank1Active },
    { rank: 2, name: "Explorer", minRefs: 13, maxRefs: 24, pointsPerRef: 648, multiplier: 1.2, image: rank2, activeImage: rank2Active },
    { rank: 3, name: "Achiever", minRefs: 25, maxRefs: 49, pointsPerRef: 810, multiplier: 1.5, image: rank3, activeImage: rank3Active },
    { rank: 4, name: "Challenger", minRefs: 50, maxRefs: 94, pointsPerRef: 945, multiplier: 1.75, image: rank4, activeImage: rank4Active },
    { rank: 5, name: "Elite", minRefs: 95, maxRefs: 199, pointsPerRef: 1080, multiplier: 2, image: rank5, activeImage: rank5Active },
    { rank: 6, name: "Master", minRefs: 200, maxRefs: 499, pointsPerRef: 1350, multiplier: 2.5, image: "rank6", activeImage: "rank6Active" },
    { rank: 7, name: "Grandmaster", minRefs: 500, maxRefs: 1249, pointsPerRef: 1620, multiplier: 3, image: "rank7", activeImage: "rank7Active" },
    { rank: 8, name: "Legend", minRefs: 1250, maxRefs: 2499, pointsPerRef: 1890, multiplier: 3.5, image: "rank8", activeImage: "rank8Active" },
    { rank: 9, name: "Mythic", minRefs: 2500, maxRefs: 4999, pointsPerRef: 2160, multiplier: 4, image: "rank9", activeImage: "rank9Active" },
    { rank: 10, name: "Immortal", minRefs: 5000, maxRefs: 9999, pointsPerRef: 2430, multiplier: 4.5, image: "rank10", activeImage: "rank10Active" },
    { rank: 11, name: "Titan", minRefs: 10000, maxRefs: 19999, pointsPerRef: 2700, multiplier: 5, image: "rank11", activeImage: "rank11Active" },
    { rank: 12, name: "Godlike", minRefs: 20000, maxRefs: "∞", pointsPerRef: 2970, multiplier: 5.5, image: rank6, activeImage: rank6Active }


  ];

  const getUserRank = (referralLength) => {
    const currentRank = referralMilestones.find(rank => referralLength >= rank.minRefs && referralLength <= rank.maxRefs);
    return currentRank?.rank || referralMilestones[0]?.rank; // Default to the highest rank if over maxRefs
  };


  const currentRank = getUserRank(referralLength);
  // Find the user's current rank and the next rank
  // const currentRank = referralMilestones.reduce((rank, r) => (referralLength > r.minRefs ? r.rank : rank), 0);

  // Calculate the next rank's referral threshold
  const nextRankReferrals = referralMilestones[currentRank + 1] ? referralMilestones[currentRank + 1].referrals : 0;

  // Calculate progress bar width (percentage of current rank's referral range completed)
  // const progressPercentage = 20
  const progressPercentage = currentRank == 0
    ? (referralLength / referralMilestones[currentRank + 1]?.minRefs) * 100
    : ((referralLength - referralMilestones[currentRank]?.minRefs) / (referralMilestones[currentRank + 1]?.minRefs - referralMilestones[currentRank]?.minRefs)) * 100;




  const calculateTotalReferralEarnings = (totalRefs) => {
    if (totalRefs < 2) return 0; // No rewards for 0-1 refs

    let totalPoints = 0;
    let remainingRefs = totalRefs;

    for (const milestone of referralMilestones) {
      if (remainingRefs >= milestone.minRefs) {
        const refsInRange = Math.min(remainingRefs, milestone.maxRefs) - milestone.minRefs + 1;
        totalPoints += refsInRange * milestone.pointsPerRef;
      }
    }

    return totalPoints;
  };




  // Function to handle the copy action
  const handleCopy = () => {
    navigator.clipboard.writeText(webLink).then(() => {
      // Show a toast notification when the referral code is copied
      toast.success(<span className="text-xs">Copied to clipboard!</span>);

    });
  };

  useEffect(() => {


    const earnedPoints = calculateTotalReferralEarnings(referralLength);
    setEarnedPoints(earnedPoints)

  }, [referralLength])

  console.log('currentRank', currentRank)



  const fetchLeaderboard = async () => {
    console.log('address', address)



    try {



      let getUserData = await axios.get(`${apiUrl}/api/user/top-wallets`)




      console.log(getUserData?.data)

      if (getUserData?.data?.success) {

        sessionStorage.setItem('leaderboard', JSON.stringify(getUserData))
        setLeaderboard(getUserData?.data?.topWallets)



      } else {
        // toast('Not found', { theme: 'error-toast' });


      }




    } catch (error) {
      console.error("Axios Error:", error.response ? error.response.data : error.message);
      // toast.error(<span className="text-xs">Retrieving User Error</span>)

    }
  }

  useEffect(() => {
    if (!address && !isConnected) {

      toast.success(<span className="text-xs">Wallet disconnected</span>);
    }

  }, [address])


  return (
    <div className="lg:ml-64 px-6 sm:px-4 lg:w-[calc(100%-16rem)] min-h-screen sm:ml-0">
      <User />
      <p className="text-white font-bold">Referral</p>



      {/* Referral Section */}
      {address && <div className=" mt-6 w-full flex justify-between items-center  min-[360px]:w-fit rounded-lg bg-[#45004A] border-b-4 border-black py-2 px-4 text-white  "
        onClick={handleCopy}
      >
        <span className="text-xs cursor-pointer overflow-hidden"> {webLink}</span>&nbsp;&nbsp;
        <button
          onClick={handleCopy}
          className="bg-white/30 text-white p-2 rounded-full"
        >
          <FontAwesomeIcon icon={faCopy} />
        </button>
      </div>}
      <div className="mt-6 flex flex-col md:flex-row md:space-x-4 w-full">
        <div className="w-full md:w-1/3 rounded-lg bg-[#45004A] border-b-4 border-black p-4 md:p-6 text-white">
          <div className="flex ">
            <div className="flex items-center">
              <p className="text-lg ">Referral Earnings : </p>&nbsp;
              {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg> */}
            </div>
            <span className="text-2xl font-bold">{earnedPoints > 0 ? earnedPoints + 540 : 0}</span>


          </div>
          <div className="flex justify-between pt-8">
            <div className="flex flex-col">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="green" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg> &nbsp;

                <p className="flex whitespace-nowrap text-xs opacity-60">Active Refs&nbsp;



                </p>
                <div
                  data-tooltip-id="my-tooltip"
                  data-tooltip-content="Your referrals that have done > 50 hours uptime"
                  className=" cursor-pointer"

                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                  </svg>
                </div>
                <Tooltip id="my-tooltip"
                  style={{ backgroundColor: "#2B002E", color: "#fff", fontSize: '10px' }}
                  place='bottom-start'
                />
              </div>
              <div className="flex">
                <div className="opacity-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  &nbsp;
                  &nbsp;
                  &nbsp;
                </div>
                <span className="text-xl pt-2">{referralLength || 0}</span>

              </div>
            </div>

            <div className="flex flex-col pl-5 ">
              <div className="flex items-center relative overflow-hidden">

                <svg xmlns="http://www.w3.org/2000/svg" fill="#FEC95E" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>&nbsp;


                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="size-3 absolute bottom-[0px] left-[15px]">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>




                <p className=" text-xs whitespace-nowrap opacity-60">Pending Refs</p>&nbsp;
                <div
                  data-tooltip-id="pend-tooltip"
                  data-tooltip-content="Your referrrals are on their way to 50 hours uptime"
                  className=" cursor-pointer"

                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                  </svg>
                </div>
                <Tooltip id="pend-tooltip"
                  style={{ backgroundColor: "#2B002E", color: "#fff", fontSize: '10px' }}
                  place='bottom-start'

                />
              </div>

              <div className="flex">
                <div className="opacity-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  &nbsp;
                  &nbsp;
                  &nbsp;
                </div>
                <span className="text-xl pt-2">{pendingReferralLength || 0}</span>

              </div>

            </div>
          </div>



        </div>
        <div className="w-full md:w-2/3 rounded-lg bg-[#45004A] border-b-4 border-black p-6 md:p-8 text-white flex flex-col md:flex-row items-center">
          <img
            src={referralMilestones[currentRank].rank <= currentRank ? referralMilestones[currentRank].activeImage : referralMilestones[currentRank].image}
            alt="Rank"
            className="w-20 h-20 sm:w-16 sm:h-16 mb-4 md:mb-0 md:mr-4"
          />
          <div className="text-center md:text-left">
            <p className="text-xl font-bold">Rank {currentRank}: {referralMilestones[currentRank].name}</p>
            <div className="w-full rounded-full h-2.5 bg-[#B47800] mt-2">
              <div className="bg-[#FFE2A7] h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <p className="mt-2">Next Rank Multiplier: <span className="font-bold">{referralMilestones[currentRank + 1]?.multiplier}x Earning per Referral</span></p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="bg-[#45004A]/0 w-full rounded-lg p-6 mt-4 border border-[#E300F3]">
          <p className="text-white flex pb-5 items-center">

            <img
              src={chevron}
              alt='chevron'
              className="w-5 h-5 "
            />&nbsp;

            Rank Category</p>

          <div className="flex items-center flex-nowrap justify-between gap-4 mt-4 overflow-x-auto md:flex-wrap sm:flex-nowrap text-center" style={{ flexWrap: 'nowrap' }}>
            {referralMilestones
              .filter((_, index) => index < 6 || index === referralMilestones.length - 1)
              .map((rank, index, array) => {
                const nextRank = array[index + 1]; // Get the next rank for progress calculation
                const isLast = index === array.length - 1; // Check if it's the last rank

                // Calculate progress percentage
                let progress = 0;
                if (nextRank) {
                  const range = nextRank.minRefs - rank.minRefs; // Total range between two ranks
                  const progressInRange = referralLength - rank.minRefs; // Progress within this range
                  progress = Math.min(100, Math.max(0, (progressInRange / range) * 100)); // Clamp to [0,100]
                }

                return (
                  <>
                    {/* <div key={rank.rank} className="relative flex flex-col items-center w-1/4 sm:w-1/6 md:w-auto space-y-4 z-10">
               
                    <p className="text-white text-xs"><span className=" whitespace-nowrap text-xs">Rank {rank.rank} -</span> {rank.name}</p>

                    <img
                      src={rank.minRefs <= referralLength ? rank.activeImage : rank.image}
                      alt={`Rank ${rank.rank}`}
                      className="w-18 h-18 sm:w-14 sm:h-14 z-50"
                    />

                 
                    <p className="text-white text-xs">
                      {rank.minRefs} Referral{rank.maxRefs !== 1 ? "s" : ""}
                    </p>

                 
                    {!isLast && (
                      <div className="absolute top-1/2  left-full w-20 sm:w-24 h-1 bg-white rounded-full overflow-hidden transform hidden md:block">
                        <div
                          className="h-full bg-[#FFE2A7] transition-all duration-300"
                          style={{ width: `${progress}%` }} 
                        ></div>
                      </div>

                    )}
                  </div> */}

                    <div key={rank?.rank} className="relative flex flex-col items-center w-1/4 sm:w-1/6 md:w-auto space-y-4 z-10">
                      {/* Rank Name */}
                      <p className="text-white text-xs">
                        <span className="whitespace-nowrap text-xs">Rank {rank?.rank} -</span> {rank?.name}
                      </p>

                      {/* Rank Image */}
                      <img
                        src={rank?.minRefs <= referralLength ? rank?.activeImage : rank?.image}
                        alt={`Rank ${rank.rank}`}
                        className="w-18 h-18 sm:w-14 sm:h-14 z-50"
                      />

                      {/* Referral Count */}
                      <p className="text-white text-xs">
                        {rank.minRefs} Referral{rank.maxRefs !== 1 ? "s" : ""}
                      </p>

                      {/* Progress Bar (only if it's not the last rank) */}
                      {!isLast && (
                        <div className="absolute top-1/2 left-full transform -translate-x-[15px] -translate-y-1/2 w-[100px] sm:w-[120px] h-1 bg-white rounded-full overflow-hidden hidden md:block">
                          <div
                            className="h-full bg-[#FFE2A7] transition-all duration-300"
                            style={{ width: `${progress}%` }} // Dynamically set width
                          ></div>
                        </div>
                      )}
                    </div>

                  </>

                );
              })}
          </div>



        </div>
      </div>

      {/* <div className="mt-6">
        <div className="bg-[#45004A]/0 w-full rounded-lg p-6 mt-4 border border-[#E300F3]">
          <p className="text-white flex pb-5 items-center">

            <img
              src={podium}
              alt='podium'
              className="w-5 h-5"
            />&nbsp;

            Leaderboard</p>
          {leaderboard?.length > 0 ?
            <div className="flex flex-col items-center flex-nowrap justify-between gap-4 mt-4 overflow-x-auto md:flex-wrap sm:flex-nowrap text-center" style={{ flexWrap: 'nowrap' }}>
              <div className="w-full border-[1px] mb-1 border-opacity-40 rounded-lg py-2 relative flex items-center text-white  z-10">

                <div className="w-1/6 sm:w-1/12 text-xs opacity-60">
                  Rank
                </div>
                <div className="w-4/6 sm:w-10/12 text-xs text-left">

                  Address
                </div>
                <div className="w-1/6 text-xs sm:w-1/12">
                  Total Points
                </div>

              </div>
              <div className="w-full border-[1px] mb-1 bg-[#45004A] border-[#E300F3] border-opacity-40 rounded-lg py-2 relative flex items-center text-white  z-10">

                <div className="w-1/6 sm:w-1/12 opacity-60">
                  You
                </div>
                <div className="w-4/6 sm:w-10/12 text-left">

                  {address?.slice(0, 4)}...{address?.slice(-6)}
                </div>
                <div className="w-1/6 sm:w-1/12">
                  {totalPoints}
                </div>

              </div>

              {leaderboard
                .map((item, index) => {

                  return (


                    <div key={index} className="w-full border-[1px] mb-1 border-[#E300F3] border-opacity-40 rounded-lg py-2 relative flex items-center text-white  z-10">

                      <div className="w-1/6 sm:w-1/12 opacity-60">
                        {index + 1}
                      </div>
                      <div className="w-4/6 sm:w-10/12 text-left">
                        {item.wallet}
                      </div>
                      <div className="w-1/6 sm:w-1/12">
                        {item.totalPoints}
                      </div>

                    </div>

                  );
                })}
            </div> :
            <div className="flex flex-col items-center flex-nowrap justify-between gap-4 mt-4 overflow-x-auto md:flex-wrap sm:flex-nowrap text-center" style={{ flexWrap: 'nowrap' }}>



              <div className="w-full min-h-36  relative flex items-center justify-center opacity-40 text-white  z-10">

                No Users Found

              </div>



            </div>
          }



        </div>
      </div> */}

    </div>
  );
};

export default Referral;