import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { User } from "../Components"; // Assuming the User component is located here
import axios from 'axios';
import toast from 'react-hot-toast';

import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';

import { rank0Active, rank1Active, rank2Active, rank3Active, rank4Active, rank5Active, rank6Active } from "../Assets"; // Import active images
import { rank0, rank1, rank2, rank3, rank4, rank5, rank6, chevron, podium } from "../Assets";


const Profile = () => {

  const apiUrl = import.meta.env.VITE_API_URL;
  // const webUrl = process.env.VITE_WEB_URL;
  const getUserCookies = localStorage.getItem('authUserLoggedInUser');
  const getUserCookiesParsed = JSON.parse(getUserCookies);
  const [wallet, setWallet] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.wallet : '');
  const [referralLength, setReferralLength] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.referCounter : 0);

  const { address, isConnected } = useAccount();

  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const hasPostedRef = useRef(false); // Prevents re-renders when updated


  const [provider, setProvider] = useState('');
  const [profile, setProfile] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.twitterUsername : '');
  // const REDIRECT_URI = 'http://localhost:3000/profile'
  const REDIRECT_URI = 'https://monadscore.xyz/profile'

  const onLoginStart = useCallback(() => {
    // alert('login start');

    setIsLoading(true)
  }, []);

  const onLogoutSuccess = useCallback(() => {
    setProfile(null);
    setProvider('');
    alert('logout success');
  }, []);

  const onLogout = useCallback(() => { }, []);
  // const [claimed, setClaimed] = useState({});



  const handleXProfileUpdate = async (address, data) => {
    console.log('address', address)
    console.log('datatwitter', data)



    setIsLoading(true)

    try {

      if (!address) {
        alert('enter wallet or twitter')
      } else {

        let getUserData

        getUserData = await axios.put(`${apiUrl}/user/update-twitter-profile`, { wallet: address, twitterUsername: data?.username })


        console.log(getUserData?.data)

        if (getUserData?.data?.success) {

          sessionStorage.setItem('authUserLoggedIn', JSON.stringify(getUserData))
          toast.success(<span className="text-xs">X connected successfully</span>);
          navigate(0)
          setIsLoading(false)

        } else {
          if(getUserData?.data?.error){
            toast.error(<span className="text-xs">{getUserData?.data?.message}</span>);
      
            }
          // toast.error(<span className="text-xs">Twitter Error</span>);
          setIsLoading(false)

        }

      }


    } catch (error) {
      console.error("Axios Error:", error.response ? error.response.data : error.message);
 
      toast.error(<span className="text-xs">Twitter Error</span>);

      setIsLoading(false)
    }
  }


  //rank starts here

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

  const progressPercentage = currentRank == 0
    ? (referralLength / referralMilestones[currentRank + 1]?.minRefs) * 100
    : ((referralLength - referralMilestones[currentRank]?.minRefs) / (referralMilestones[currentRank + 1]?.minRefs - referralMilestones[currentRank]?.minRefs)) * 100;


  console.log('profiel', profile)


  return (
    <div className="lg:ml-64 px-6 sm:px-4 lg:w-[calc(100%-16rem)] min-h-screen sm:ml-0">
      {/* Greeting Section */}
      <User />

      {/* Daily Task Section */}
      <div className='md:px-10'>


        {/* <p className="text-white text-lg">Profile</p> */}
        <div className="w-full rounded-lg bg-white bg-opacity-10 border-b-4 border-black p-6 md:p-8 text-white flex flex-col md:flex-row items-center">
          <img
            src={referralMilestones[currentRank].rank <= currentRank ? referralMilestones[currentRank].activeImage : referralMilestones[currentRank].image}
            alt="Rank"
            className="w-20 h-20 sm:w-16 sm:h-16 mb-4 md:mb-0 md:mr-4"
          />
          <div className=" w-full text-center md:text-left">
            <p className='text-sm opacity-60'>Current Rank</p>
            <p className="text-lg font-bold mb-2"> {referralMilestones[currentRank].name}</p>
            <p className='text-xs opacity-50'>
              {referralLength * (referralMilestones[currentRank].pointsPerRef)}&nbsp;/&nbsp;
              {(referralMilestones[currentRank].maxRefs) * (referralMilestones[currentRank].pointsPerRef)}
            </p>
            <div className="md:w-3/4 rounded-full h-1 bg-[#B47800] mt-2 mb-5">
              <div className="bg-[#FFE2A7] h-1 w-full rounded-full" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <p className="mt-2 opacity-30 text-sm">Rank Multiplier </p>
            <span className="font-bold text-sm">{referralMilestones[currentRank + 1]?.multiplier}x Earning per Referral</span>
          </div>
        </div>

        <div className='text-white mt-10'>
          <h2 className='opacity-80'>SOCIALS</h2>
          <div className='flex mt-5 flex-col md:flex-row md:space-x-4 '>
            <div className='w-full md:w-1/2 lg:w-1/2 xl:w-1/3 flex p-3 pl-0 pb-0 justify-between items-end rounded-lg mr-1  bg-white bg-opacity-20'>
              <div className=' opacity-40  flex items-center'>

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill='white' width='50px'><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" /></svg>


              </div>
              <div className='flex flex-col ml-2'>
                <div className='text-xs py-2 mb-3'>


                  {(profile && profile !== '') ?
                    <div className='text-white flex flex-col items-end justify-end'>
                      <span>{profile}</span>

                      <span className='opacity-30'>Twitter Username</span>
                    </div> : <div> Connect Your X account <br /> <span className='opacity-40'>Earn additional rewards for linking X account</span></div>
                  }
                </div>
                <div>


                  {(!profile || profile === '') ?

                    <>{isLoading ?
                      <button className=" mb-2 bg-red-200 bg-opacity-50 text-white p-2 flex rounded-lg w-full justify-center  items-center "

                      >

                        Linking... &nbsp;  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill='white' width='20px'><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" /></svg>

                      </button> :
                      <></>
                      // <LoginSocialTwitter
                      //   client_id={process.env.VITE_TWITTER_V2_APP_ID || ''}
                      //   client_secret={process.env.VITE_TWITTER_V2_APP_SECRET || ''}
                      //   redirect_uri={REDIRECT_URI}
                      //   onLoginStart={onLoginStart}
                      //   onLogoutSuccess={onLogoutSuccess}
                      //   onResolve={({ provider, data }) => {
                      //     setProvider(provider);
                      //     handleXProfileUpdate(address, data);
                      //   }}
                      //   onReject={(err) => {
                      //     console.log(err);
                      //     setIsLoading(false)
                      //     toast.error(<span className="text-xs">Too many request, Try again</span>);
                      //   }}
                      // >
                      //   <button className=" mb-2 bg-red-200 bg-opacity-50 text-white p-2 flex rounded-lg w-full justify-center  items-center "

                      //   >

                      //     Link &nbsp;  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill='white' width='20px'><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" /></svg>

                      //   </button>
                      // </LoginSocialTwitter>

                    }

                    </>
                    : <div className=' flex items-center pb-2 '>
                      <span className='text-sm opacity-60'>
                        Connected &nbsp;

                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width='5px' stroke-width="1.5" stroke="green" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>

                    </div>
                  }


                </div>
              </div>


            </div>

          </div>
        </div>




      </div>
    </div>
  );
};

export default Profile;