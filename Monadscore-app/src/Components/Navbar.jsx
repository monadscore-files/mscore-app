import React, { useState, useEffect } from "react";
import { logo } from "../Assets";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt, faTasks, faBars, faSignOutAlt, faUserPlus, faUser, faCircleQuestion, faDeleteLeft } from "@fortawesome/free-solid-svg-icons"; // Updated icon for Logout
import { Link, useNavigate } from "react-router-dom"; // Import Link from React Router
import { useAccount, useDisconnect } from "wagmi";
import { toast } from "react-hot-toast";
import axios from "axios";




export const menuItems = [
  { title: "Dashboard", link: "/dashboard", icon: faTachometerAlt },  // Internal link
  { title: "Tasks", link: "/tasks", icon: faTasks },                  // Internal link
  { title: "Referrals", link: "/referral", icon: faUserPlus }, // External link

];

const Navbar = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [activeLink, setActiveLink] = useState(""); // To track active link
  const navigate = useNavigate();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false)
  const getUserCookies = localStorage.getItem('authUserLoggedInUser');
  const getUserCookiesParsed = JSON.parse(getUserCookies);
  const [token, setToken] = useState(getUserCookiesParsed ? getUserCookiesParsed?.data?.token : '');


  const deleteAccount = async (address) => {

    setIsLoading(true)
    try {

      if (!address) {
        alert('enter wallet or twitter')
      } else {



        const jwtToken = token
        let response = await axios.post(`${apiUrl}/user/delete-account`, { wallet: address }, {
          headers: { Authorization: `Bearer ${jwtToken}` }
        });


        if (response?.data?.success) {
          localStorage.removeItem('startTime');
          localStorage.removeItem("authUserLoggedInUser");
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("activeWallet");
          sessionStorage.setItem('deletedWallet', JSON.stringify(true))
          toast.success(<span className="text-xs">deleted successfully!</span>);
          setIsLoading(false)
          navigate("/")
          disconnect()
          return true;


        }

      }


    } catch (error) {

      return false;
    }
  }


  // Check active link on page load
  useEffect(() => {
    setActiveLink(window.location.pathname); // Set active link based on the current path
  }, []);


  useEffect(() => {
    if (!address) {
      navigate("/");
  
    }

  }, [address])

  const handleConfirmDelete = () => {
    setModal(true)
  }
  const handleDeleteAccount = async () => {
   
    const accountDeleted = await deleteAccount(address);

  }



  const handleClose = () => {
    setModal(false)
  }

  return (
    <div className="flex z-50">
      {/* Sidebar */}
      {isSidebarOpen && <div className="fixed top-0 h-screen w-full bg-transparent z-auto"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >

      </div>}
      <nav
        className={`fixed z-50 left-0 top-0 h-full w-64 bg-gradient-to-b from-black to-[#2F0032] text-white shadow-lg p-5 pr-0 flex flex-col transition-transform duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
      >
        <div className="flex items-center space-x-3  mb-10">
          <a href="../">
            <img src={logo} alt="Logo" className="h-auto w-auto" />
          </a>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col space-y-6">
          {menuItems.map((item, index) => (
            item.link.startsWith("http") ? (
              <a
                key={index}
                href={item.link}
                target="_blank" // External link will open in new tab
                rel="noopener noreferrer"
                className={`flex items-center space-x-3 text-white/30 cursor-pointer p-3 
                  ${activeLink === item.link ? "text-white bg-[#45004A] border-r-2" : "hover:text-white hover:bg-[#45004A] hover:border-r-2"}`}
                onClick={() => setActiveLink(item.link)}
              >
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.title}</span>
              </a>
            ) : (
              <Link
                key={index}
                to={item.link}
                className={`flex items-center space-x-3 text-white/30 cursor-pointer p-3 
                  ${activeLink === item.link ? "text-white bg-[#45004A] border-r-2" : "hover:text-white hover:bg-[#45004A] hover:border-r-2"}`}
                onClick={() => setActiveLink(item.link)}
              >
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.title}</span>
              </Link>
            )
          ))}
        </div>

        {/* Logout Button */}
        <div className="mt-auto"
        >
          <hr className="mb-5 opacity-10" />
          <div className="my-3">
            <Link

              to='/faq'
              rel="noopener noreferrer"
              className={`flex items-center space-x-3 text-white/30 cursor-pointer p-3 
                  ${activeLink === "/faq" ? "text-white bg-[#45004A] border-r-2" : "hover:text-white hover:bg-[#45004A] hover:border-r-2"}`}
              onClick={() => setActiveLink("/faq")}
            >
              <FontAwesomeIcon icon={faCircleQuestion} />
              <span>FAQ</span>
            </Link>
          </div>
          <button
            onClick={handleConfirmDelete} // Attach the logout function
            className="flex items-center space-x-2 cursor-pointer text-red-500 focus:outline-none w-full p-3 rounded-md hover:bg-[#45004A]"

          >
            <FontAwesomeIcon icon={faDeleteLeft} size="lg" /> {/* Logout Icon */}

            <span>Delete Account</span>
          </button>
          <button
            onClick={disconnect} // Attach the logout function
            className="flex items-center cursor-pointer space-x-2 text-[#FEC95E] focus:outline-none w-full p-3 rounded-md hover:bg-[#45004A]"
          >
            <FontAwesomeIcon icon={faSignOutAlt} size="lg" /> {/* Logout Icon */}
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Hamburger Button for Mobile */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        // className={`fixed top-4 left-4 z-50 p-3 text-white lg:hidden transition-all duration-300 ${isSidebarOpen ? " rounded-full" : "bg-[#45004A] hover:bg-[#45004A] rounded-full"}`}
        className={`fixed top-4 ${isSidebarOpen ? 'right-4' : 'left-4'}  z-50 p-3 text-white lg:hidden transition-all duration-300 ${isSidebarOpen ? " rounded-full bg-[#45004A] " : "bg-[#45004A] hover:bg-[#45004A] rounded-full"}`}
      >
        <FontAwesomeIcon icon={faBars} size="lg" color={`${isSidebarOpen ? "#fff" : "#fff"}`} />
      </button>

      {/* Main Content */}
      <div
        className={`flex-1 p-8 ${isSidebarOpen ? "ml-64" : ""} transition-all duration-300`}
      >
        {/* Your main content here */}
      </div>


      {modal &&
        <div id="toast-interactive" class="w-full z-1000 max-w-xs p-4 fixed right-[0%] bottom-[0%] text-gray-500 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:text-gray-400" role="alert">
          <div class="flex">
            <div class="inline-flex items-center justify-center shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:text-blue-300 dark:bg-blue-900">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>

              <span class="sr-only">delete icon</span>
            </div>
            <div class="ms-3 text-sm font-normal">
              <span class="mb-1 text-sm font-semibold text-gray-900 dark:text-white">Delete Account</span>
              <div class="mb-2 text-sm font-normal whitespace-nowrap ">Data will be deleted permanently!</div>

              <div class="mb-2 text-sm font-normal">Are you sure you want to delete this account?.</div>
              <div class="grid grid-cols-2 gap-2">
                <div
                  className="cursor-pointer"
                >
                  <button onClick={handleDeleteAccount} class="inline-flex cursor-pointer justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-white bg-red-600 rounded-lg  focus:ring-4 focus:outline-none focus:ring-blue-300 ">Delete</button>
                </div>
                <div

                  className="cursor-pointer"

                >
                  <button onClick={handleClose} class="inline-flex cursor-pointer justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-600 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">Close</button>
                </div>
              </div>
            </div>
            <button type="button" class="ms-auto -mx-1.5 -my-1.5 bg-white items-center justify-center shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-interactive" aria-label="Close"
              onClick={handleClose}

            >
              <span class="sr-only">Close</span>
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
            </button>
          </div>
        </div>
      }


    </div>
  );
};

export default Navbar;