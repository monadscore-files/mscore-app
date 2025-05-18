import React from "react";
import { mscore } from "../Assets";
import { useAccount } from "wagmi";

const User = () => {
  const name = "GhostRyder";
  const avatarUrl = mscore; // Replace with your image URL
  const { address } = useAccount();

  return (
    <div className="flex justify-end"> {/* Align content to the right */}
      <div className="rounded-lg p-6 text-white flex items-center space-x-4">
        <h1 className="text-xl">Hello, <span className=" font-extrabold text-2xl">{address ?<><span className="text-4xl">0</span><span className=" lowercase font-light">{address.slice(1,7)}</span> </>: <><span className="text-4xl">0</span><span className=" lowercase font-light">x111111</span> </> }</span></h1>
        {address ?
          <div className="w-16 h-16 rounded-full overflow-hidden border-r-red-100 bg-white bg-opacity-50 flex items-center">
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          </div> :
          <div className="rounded-full h-[50px] w-[50px] ">
            <svg xmlns="http://www.w3.org/2000/svg" height='200' width='200' fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-14">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>

          </div>
        }
      </div>
    </div>
  );
};

export default User;