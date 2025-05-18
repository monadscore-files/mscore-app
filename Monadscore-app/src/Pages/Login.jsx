import React, { useEffect, useRef, useState } from "react";
import { heroImage, logo } from "../Assets"; // Import logo for the login page
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons"; // Importing icons for email and password
import { Link, useNavigate } from "react-router-dom"; // Import Link for routing
import StyledConnectButton from "../Components/StyledButton";
import { useAccount, useChainId, useDisconnect, useSignMessage, useSwitchChain } from "wagmi";
import { toast } from "react-hot-toast";
import axios from "axios";

import { jwtDecode } from "jwt-decode";
import { useSwitchToMonad } from "../Hooks/useSwitchToMonad";



const Login = () => {
  const apiUrl = import.meta.env.VITE_API_URL;



  const getUserCookies = localStorage.getItem('authUserLoggedInUser');
  const getUserCookiesParsed = JSON.parse(getUserCookies);
  const [stateToken, setStateToken] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.token : '');

  const getUserTokenCookies = sessionStorage.getItem('token');
  const [token, setToken] = useState(getUserTokenCookies ? getUserTokenCookies : '');

  const [wallet, setWallet] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.user?.wallet : '');


  console.log('getUserTokenCookies', getUserTokenCookies, token)
  const { address, isConnected } = useAccount();
  const [invite, setInvite] = useState('')
  const [isLoading, setIsLoading] = useState()
  const [isUserLoading, setIsUserLoading] = useState()
  const [code, setCode] = useState(Array(8).fill(""));
  const inputRefs = useRef([]);
  const storedCode = localStorage.getItem('storedInviteCode');
  const placeholderText = "REFERRAL".split("");
  const navigate = useNavigate()
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const hasPostedRef = useRef(false); // Prevents re-renders when updated
  const hasGetUserRef = useRef(false); // Prevents re-renders when updated
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const [signature, setSignature] = useState(null);
  const [error, setError] = useState(null);
  const isNewTokenFetched = JSON.parse(sessionStorage.getItem('newTokenIsFetched'));
  const [newTokenIsFetched, setNewTokenIsFetched] = useState(isNewTokenFetched ? isNewTokenFetched : false);
  const deletedWalletParsed = JSON.parse(sessionStorage.getItem('deletedWallet'));
  const [deletedWallet, setDeletedWallet] = useState(deletedWalletParsed ? deletedWalletParsed : false);
  const [activeWallet, setActiveWallet] = useState(sessionStorage.getItem('activeWallet') || '');
  const { switchToMonad, getCurrentChainId } = useSwitchToMonad();
  const { switchChain } = useSwitchChain();
  const MONAD_CHAIN_ID = 10143;
  const chainId = getCurrentChainId();

  // // Confirmed to be working perfectly states
  const [startTime, setStartTime] = useState(() => {
    const storedTime = localStorage.getItem("startTime");
    return storedTime
      ? parseInt(storedTime, 10)
      : getUserCookiesParsed?.data?.user?.startTime || 0;
  });


  const handleCaptcha = (token) => {
    setCaptchaToken(token);
    setCaptchaVerified(true);
    console.log("reCAPTCHA token:", token);

  };

  //getNextMidnightFromTimestamp from timestamp
  const getNextMidnightFromTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    // // Set the time to midnight (00:00) of the current day
    // date.setHours(0, 0, 0, 0);
    // Add one day to get the next day's midnight
    //  date.setDate(date.getDate() + 1);


    // Set the time to midnight UTC (00:00 UTC) of the next day
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() + 1);


    // Return the timestamp of next day's midnight
    return date.getTime();
  };


  const postUserData = async (address, invite) => {
    // console.log('address', address)
    console.log("clicked after connect61", 61);

    if(deletedWallet){
      sessionStorage.removeItem('deletedWallet')
      setDeletedWallet('')
      return

    }


    setIsLoading(true)

    try {

      if (!address ) {
        alert('enter wallet or twitter')
      } else {
        console.log("clicked after connect62", 62);

        let getUserData
 
          console.log("clicked after connect6", 6);

          getUserData = await axios.post(`${apiUrl}/api/user`, { wallet: address, invite: invite })
          console.log("captchaverified3")
          console.log("localhost:3000 response", getUserData?.data)
        


        if (getUserData?.data?.success) {
          console.log("getUserDatatoken", getUserData)
          console.log("captchaverified4", getUserData?.data?.token, "stateToken", stateToken)
          sessionStorage.setItem('token', JSON.stringify(getUserData?.data?.token))
          localStorage.setItem('refreshToken', JSON.stringify(getUserData?.data?.refreshToken))
          sessionStorage.setItem('activeWallet', address)
          setActiveWallet(address)
          sessionStorage.setItem('newTokenIsFetched', JSON.stringify(true))
          setNewTokenIsFetched(true)
          // sessionStorage.setItem('refreshToken', JSON.stringify(getUserData?.data?.refreshToken))
          setToken(getUserData?.data?.token)
          // setToken(getUserData?.data?.refreshToken)
          setIsLoading(false)
          // navigate('/dashboard')


        } else {

          // console.log("error", getUserData?.data)
          // // toast.error(<span className="text-xs">Server error!</span>);
          setIsLoading(false)
          // setError(false)


        }

      }


    } catch (error) {
      console.log("error", error)
      let isFetched = false;

      try {
        isFetched = newTokenIsFetched || JSON.parse(sessionStorage.getItem('newTokenIsFetched'));
      } catch (e) {
        console.error("Invalid sessionStorage value for newTokenIsFetched");
      }

      if (isFetched) {
        setIsLoading(false);
        return;
      } else {
        toast.error(<span className="text-xs">Server busy!</span>);
      }
      setIsLoading(false)
      // setError(false)


    }
  }
  const getUserData = async (address, token) => {
    console.log('preparing dashboard!', address)
    setIsUserLoading(true)

    try {

      if (!address) {
        alert('enter wallet or twitter')
      } else {

        console.log("token", token)
        const jwtToken = token
        let response = await axios.post(`${apiUrl}/api/user/login`, { wallet: address }, {
          headers: { Authorization: `Bearer ${jwtToken}` }
        });
        console.log("localhost:3000 response", response?.data)

        if (response?.data?.success) {
          localStorage.setItem('authUserLoggedInUser', JSON.stringify(response))
          sessionStorage.setItem('token', JSON.stringify(response?.data.token))
          localStorage.setItem("startTime", response?.data?.user?.startTime);
          toast.success(<span className="text-xs">User retrieved successfully</span>);
          setIsUserLoading(false)
          sessionStorage.removeItem('newTokenIsFetched')
          navigate("/dashboard", { state: { from: "/" } });

        } else {

          // console.log("error", response?.data)
          // toast.error(<span className="text-xs">Server error!</span>);
          setIsUserLoading(false)

        }

      }


    } catch (error) {
      toast.error(<span className="text-xs">Server busy!</span>);
      console.log("error", error)
      setIsUserLoading(false)
    }
  }


  // useEffect(() => {


  //   console.log('useEffectAddress', address, wallet, hasPostedRef.current);


  //   const handleUserData = () => {
  //     console.log("once there is getuserdata2")


  //     if (!hasPostedRef.current) {
  //       hasPostedRef.current = true;
  //       console.log("Calling postUserData...");
  //       console.log("switch account", address, wallet)
  //       console.log("once there is getuserdata3")

  //       const storedInviteCode = localStorage.getItem('storedInviteCode');
  //       const localInvite = invite || storedInviteCode;
  //       if (address !== wallet) {
  //         console.log("switch account now", address, wallet)
  //         console.log("captchaverified2")

  //         const activeWallet = sessionStorage.getItem('activeWallet')
  //         if ((address !== activeWallet) || !token) {
  //           postUserData(address, localInvite);

  //         }



  //       } else {

  //         let decoded
  //         const now = Date.now() ; // Convert to seconds
  //         const tokenExpInMs = decoded ? decoded.exp * 1000 : 0;


  //         // Decode token to check expiry
  //         if (stateToken) {
  //           decoded = jwtDecode(stateToken);
  //         }

  //         const timeLeftTillExpired = decoded ? tokenExpInMs - now : 0;


  //         console.log("decoded", decoded)

  //         if (decoded && timeLeftTillExpired > 0) {
  //           const now = Date.now()
  //           const getNextMidnightFromStartTime = getNextMidnightFromTimestamp(startTime)
  //           if (now > getNextMidnightFromStartTime) {
  //             if (startTime !== 0) {
  //               getUserData(address, stateToken)
  //             } else {
  //               navigate("/dashboard", { replace: true }); //
  //               window.location.reload();
  //             }

  //           } else {

  //             navigate("/dashboard", { replace: true }); //
  //             window.location.reload();
  //           }

  //         } else {
  //           postUserData(address, localInvite)
  //         }

  //       }

  //     }
  //   };


  //   if (address && isConnected) {

  //     if (address !== wallet) {
  //       sessionStorage.removeItem('authUserLoggedInUser');
  //       localStorage.removeItem('nftsHeld')
  //       hasPostedRef.current = false;


  //     }

  //     hasPostedRef.current = false;

  //     setToken('')
  //     handleUserData();


  //   } else if (!isConnected) {
  //     navigate('/');
  //     toast.success(<span className="text-xs">Wallet disconnected</span>);
  //   }



  // }, [address, isConnected]);

  useEffect(() => {
    const storedInviteCode = localStorage.getItem('storedInviteCode');
    const localInvite = invite || storedInviteCode;
    const now = Date.now(); // Current time in milliseconds

    // Function to check and post user data
    const handleUserData = async () => {
      console.log("clicked after connect2", 2);



      if (!hasPostedRef.current) {
        hasPostedRef.current = true;
        console.log("clicked after connect3", 3);

        if (address !== wallet) {
          console.log("switch account now", address, wallet);
          console.log("clicked after connect4", 4);

          const activeWallet = sessionStorage.getItem('activeWallet');
          await postUserData(address, localInvite);

          if (!token) {
            console.log("clicked after connect5", 5);

            await postUserData(address, localInvite);
          }
        } else {

          console.log("clicked after connect51", 51);

          let decoded;
          if (stateToken) {
            decoded = jwtDecode(stateToken);
          }

          const tokenExpInMs = decoded ? decoded.exp * 1000 : 0;
          const timeLeftTillExpired = decoded ? tokenExpInMs - now : 0;

          console.log("decoded", decoded);

          if (decoded && timeLeftTillExpired > 0) {
            console.log("Token is valid, navigating to dashboard...");
            navigate("/dashboard", { replace: true });
            window.location.reload(); // Optional: Reload the page after navigating
          } else {
            console.log("Token has expired, posting user data...");
            await postUserData(address, localInvite);
          }
        }
      }
    };

    // If connected address and wallet from localStorage are not the same
    if (address && address !== wallet) {
      console.log("clicked after connect", 0);

      // sessionStorage.removeItem('authUserLoggedInUser');
      if (!wallet) {
        console.log("clicked after connect1", 1);
   
        hasPostedRef.current = false;
        setToken('');
        handleUserData(); // Call function to handle user data
      } else {
        // toast.error(<span className="text-xs">Wallet {wallet} is already active</span>);
        return

        // disconnect()

      }




    } else if (address && isConnected) {
      // If connected address matches localStorage wallet, handle user data
      handleUserData();
    } else if (!isConnected) {
      // If not connected, navigate to the home page
      navigate('/');
      toast.success(<span className="text-xs">Wallet disconnected</span>);
    }

  }, [address, isConnected, wallet]);



  const switchToMonadAlt = async () => {
    try {
      switchChain({ chainId: 10143 });
      console.log("Switched to Monad Testnet!");
    } catch (err) {
      console.error("Error switching chain:", err);
    }
  };


  const handleSignMessage = async () => {
    if (!isConnected || !address) return;

    try {


      if (!isConnected || !address) {
        console.error("No wallet connected!", isConnected, address);

        toast.error(<span className="text-xs">No wallet connected!!</span>)

        return;
      }
      let signedMessage

      const message = `Sign this message to verify ownership and continue to dashboard!\n\n${address} `;
      signedMessage = await signMessageAsync({ message }); // Ensure `message` is a string

      if (signedMessage) {
        setSignature(signedMessage);
        console.log("signedMessage", signedMessage)

        // if (address === wallet) {
        //   sessionStorage.setItem('token', stateToken)
        // }
        await getUserData(address, token);

        console.log('signature', signature)
      } else {
        console.log("signature error")

        throw new Error("Signing failed: No response from wallet.");

      }
    } catch (error) {
      console.error("Signing failed:", error);
      console.log("signature error", error)
      setSignature(null);
    }
  };



  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[a-zA-Z0-9]?$/.test(value)) return; // Allow only alphanumeric

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    const str = newCode.join('');
    console.log("newCode", str)

    localStorage.setItem("storedInviteCode", str);



    // Move to the next input field
    if (value && index < code.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 8);
    const newCode = pastedData.split("").filter((char) => /^[a-zA-Z0-9]$/.test(char));

    setCode([...newCode, ...Array(8 - newCode.length).fill("")]);
    // const str = newCode.join('');
    console.log("newCode", pastedData)

    localStorage.setItem("storedInviteCode", pastedData);

    // Focus the last filled input
    const nextIndex = newCode.length < 8 ? newCode.length : 7;
    inputRefs.current[nextIndex]?.focus();
  };




  useEffect(() => {



    sessionStorage.removeItem("token")
    sessionStorage.removeItem("activeWallet")
    setToken("")


  }, [disconnect])

  // Function to format address (first 4 + last 6 characters)
  const formatAddress = (addr) => {
    return addr ? <div>{`${addr.slice(0, 4)}...${addr.slice(-6)}`}</div> : "";
  };

  // useEffect(()=>{

  //   if(wallet && address && address === wallet){
  //     navigate("/dashboard")
  //   }
  
  // }, [])


  return (
    <div className="min-h-screen flex flex-col  lg:flex-row">
      {/* Left Section with Background Image */}
      <div
        className="flex-1 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover' }} // Add your desired background image here
      />

      {/* Right Section with Gradient Background and Form */}
      <div className="w-full lg:w-1/3 bg-gradient-to-b from-black to-[#2F0032] flex items-center justify-center p-4">
        <div className="text-white w-full max-w-md p-6 lg:p-8">
          {/* Logo */}
          <div className="flex justify-center  mb-8" >
            <img src={logo} alt="Logo" className="h-auto w-auto" />
          </div>

          {/* Form Container */}
          <div className="w-full p-6 lg:p-8 rounded-lg shadow-lg bg-opacity-50">
            {/* Input Fields with Icons */}

            <div className="flex gap-2 mb-6 justify-center mt-10" onPaste={handlePaste}>
              {code.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={placeholderText[index] || ""}
                  value={value}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  maxLength={1}
                  className="w-7 h-7 text-center text-black border bg-white border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-xl"
                />
              ))}
            </div>
            {(wallet && address && isConnected && (address !== wallet)) ?
              <div className="flex flex-col items-center">
                <button

                  className="w-full px-4 text-sm py-1 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all"
                >
                  <p>
                    Already signed in with
                  </p>
                  {formatAddress(wallet)}

                </button>
                {/* <span className="bg-gray-200 px-3 py-1 rounded-md text-sm">{chain?.name}</span> */}
              </div> : <StyledConnectButton />
            }


            {/* {(wallet && isConnected &&  (address !== wallet)) ?
                 <> <button className="bg-[#2B002E] mt-2 text-white p-2 rounded-lg w-full mb-5"
              
               >
                 <>Switch Wallet </>
 
 
               </button> </>:         <StyledConnectButton />
            }
     */}

            <div>{address && token && (address === activeWallet) && address !== '' && activeWallet !== ""  &&
              <> <button className="bg-[#2B002E] mt-2 text-white p-2 rounded-lg w-full mb-5"
                onClick={handleSignMessage}
              >
                <>Sign Wallet & Continue </>


              </button>


              </>

            }
            </div>
            <div>{ wallet && address && isConnected  && (address !== wallet) &&
              <> <button className="bg-[#2B002E] mt-2 text-white p-2 rounded-lg w-full mb-5">
                <p>Switch Wallet to continue </p>
              </button>
              </>

            }
            </div>
            {isLoading &&
              <div className="flex flex-col items-center justify-center mt-2">
                <span class="loaderLogin"></span>
                <span class="opacity-50">fetching user data...</span>
              </div>}
            {isUserLoading &&
              <div className="flex flex-col items-center justify-center mt-2">

                <span class="loaderLogin"></span>
                <span class="opacity-50">Getting dashboard ready...</span>
              </div>}


            {/* {

              address && isConnected &&
              <div class="flex items-center">
                <input id="link-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  onChange={handleCheckbox}
                />
                <label for="link-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">I agree with the <a href="#" class="text-blue-600 dark:text-blue-500 hover:underline">terms and conditions</a>.</label>
              </div>
            } */}

            {/* <div className="text-white">
              {captchaVerified ? "true" : "false"}

            </div> */}
            {/* {

              address && isConnected &&
              <div className="flex justify-center mt-2">
                <ReCAPTCHA
                  sitekey={process.env.VITE_RECAPTCHA_SITE_KEY} // Replace with your real site key
                  onChange={handleCaptcha}
                />
              </div>} */}


            {/* Register Link */}
            <div className="text-center mt-4">
              <span className="text-white text-sm">
                Connect Wallet to continue to dashboard{" "}

              </span>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;