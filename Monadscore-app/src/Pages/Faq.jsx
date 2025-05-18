import React, { useEffect, useState } from "react";
import { User } from "../Components";

const Faq = () => {

  return (
    <div className="lg:ml-64 px-6 sm:px-4 text-white lg:w-[calc(100%-16rem)] min-h-screen sm:ml-0">
      <User />

      <h1 className="text-3xl font-bold mt-10 pl-10">FREQUENTLY ASKED QUESTIONS</h1>

      <div class="sm:w-[80%] w-full  p-2 mx-auto mt-20">

        <details class="border-b border-gray-400 border-opacity-30 my-4">
          <summary class="px-4 py-2 cursor-pointer">
            <span class="font-semibold opacity-90">What is Monad Score?</span>
          </summary>
          <div class="px-4 py-2 opacity-70 pb-4">
            <p>MonadScore is a decentralized compute reputation layer powered by AI built on @monad_xyz. It analyzes blockchain and smart contract data to provide real-time and accurate reputation scoring for both individuals and projects. This scoring system can be used for airdrops, snapshots, and other activities requiring an assessment of user engagement and contributions.  </p>
          </div>
        </details>
        <details class="border-b border-gray-400 border-opacity-30 my-4">
          <summary class="px-4 py-2 cursor-pointer">
            <span class="font-semibold opacity-90">How to get started on MonadScore?</span>
          </summary>
          <div class="px-4 py-2 opacity-70 pb-4">
            <p className=" italic">
              Three Easy steps to get started on MonadScore:  <br />
            </p>
            <p className="pb-2 pt-2" >

              ■ Visit the official MonadScore website <br />
            </p>
            <p className="pb-2 " >

              ■ Connect your wallet (ensure it's set to the Monad Testnet network).  <br />
            </p>

            <p className="pb-2 " >

              ■ Run node daily and participate in activities on the Monad blockchain to accumulate points and improve your score.
            </p>


          </div>
        </details>
        <details class="border-b border-gray-400 border-opacity-30 my-4">
          <summary class="px-4 py-2 cursor-pointer">
            <span class="font-semibold opacity-90">How are points mined on the platform?</span>
          </summary>
          <div class="px-4 py-2 opacity-70 pb-4">
            <p>
              Active nodes mine at a rate of 0.5 points per second. If you keep your node active throughout the day, you steadily accumulate points.
            </p>
          </div>
        </details>
        <details class="border-b border-gray-400 border-opacity-30 my-4">
          <summary class="px-4 py-2 cursor-pointer">
            <span class="font-semibold opacity-90">When does active node reset?</span>
          </summary>
          <div class="px-4 py-2 opacity-70 pb-4">
            <p>
              Node activity resets daily at 00:00 UTC. Make sure to promptly check in daily to keep your node running and accumulate those rare points daily.
            </p>
          </div>
        </details>
        <details class="border-b border-gray-400 border-opacity-30 my-4">
          <summary class="px-4 py-2 cursor-pointer">
            <span class="font-semibold opacity-90">What is the connection streak and why is it important?</span>
          </summary>
          <div class="px-4 py-2 opacity-70 pb-4">
            <p>
              The connection streak monitors your mining activity over the past 7 days. A longer streak shows consistent engagement and can be a key indicator of your active participation on the platform.

            </p>
          </div>
        </details>
        <details class="border-b border-gray-400 border-opacity-30 my-4">
          <summary class="px-4 py-2 cursor-pointer">
            <span class="font-semibold opacity-90">Can i earn extra points besides those mined by active nodes?</span>
          </summary>
          <div class="px-4 py-2 opacity-70 pb-4">
            <p>
              Yes, in addition to the base mining rewards, you can accrue extra points by completing daily tasks, on-chain activities, and other platform-specific challenges designed to reward your engagement.

            </p>
          </div>
        </details>
        <details class="border-b border-gray-400 border-opacity-30 my-4">
          <summary class="px-4 py-2 cursor-pointer">
            <span class="font-semibold opacity-90"> How does the referral program work?</span>
          </summary>
          <div class="px-4 py-2 opacity-70 pb-4">
            <p>
              The referral program is set up to reward you for inviting new users to monadscore. as you refer more people, you progress through different tiers, each offering a bonus in points. This incentivizes you for contributing to the growth of the community while staying active on the platform.


            </p>
          </div>
        </details>
        <details class="border-b border-gray-400 border-opacity-30 my-4">
          <summary class="px-4 py-2 cursor-pointer">
            <span class="font-semibold opacity-90">     Do I have to leave the Page Open for my point to read?</span>
          </summary>
          <div class="px-4 py-2 opacity-70 pb-4">
            <p>


              You don’t need to keep the page open, your points will continue accumulating. Just remember to return at 12 AM UTC daily to restart your node.

            </p>
          </div>
        </details>
        <details class="border-b border-gray-400 border-opacity-30 my-4">
          <summary class="px-4 py-2 cursor-pointer">
            <span class="font-semibold opacity-90"> How can i maximize my rewards on monadscore?</span>
          </summary>
          <div class="px-4 py-2 opacity-70 pb-4">
            <p className="italic">
              To maximize your rewards:<br />
            </p>
            <p className="pb-2 pt-2" >
              ■ Keep your node active consistently<br />

            </p>
            <p className="pb-2 " >
              ■ Complete daily and on-chain tasks<br />
            </p>
            <p className="pb-2 " >
              ■ Maintain your connection streak by staying engaged for at least 7 consecutive. <br />
            </p>
            <p className="pb-2 " >
              ■ Refer others to earn additional bonus points through the referral program.<br />
            </p>



          </div>
        </details>
        <details class="border-b border-gray-400 border-opacity-30 my-4">
          <summary class="px-4 py-2 cursor-pointer">
            <span class="font-semibold opacity-90"> Can I run multiple account on a device ?</span>
          </summary>
          <div class="px-4 py-2 opacity-70 pb-4">
            <p className="italic">
              No, You can only run one account per device; to be able to run another account you need to delete your old account to run a new one or you get a new device
            </p>
          </div>
        </details>
        <details class="border-b border-gray-400 border-opacity-30 my-4">
          <summary class="px-4 py-2 cursor-pointer">
            <span class="font-semibold opacity-90"> Getting server busy error?? </span>
          </summary>
          <div class="px-4 py-2 opacity-70 pb-4">
            <p className="italic pb-2 text-white opacity-100">
              Possible Causes:<br />
            </p>
            <p className="pb-2 pt-2" >
              ■ You are trying to run multiple accounts on your device<br />

            </p>
            <p className="pb-2 " >
              ■ Old data is caching<br />

            </p>
            <p className="pb-2 " >
              ■ Malformed token  <br />
            </p>
            <p className="pb-2 " >
              ■ IP rate limited due to many request from the smae device <br />
            </p>
            <p className="italic pt-5 pb-2">
              Try this possible fix:<br />
            </p>
            <p className="pb-2 pt-2" >
              ■ Ensure you running only ONE account per device<br />
            </p>
            <p className="pb-2" >
              ■ Disconnect and recooonect your wallet  <br />
            </p>
            <p className="pb-2" >
              ■ Clear your cache and try reconnecting your wallet<br />
            </p>
            <p className="pb-2 " >
              ■ If error doesnt clear,,Wait for 5 minutes and retry connecting    <br />
            </p>
          </div>
        </details>
        <details class="border-b border-gray-400 border-opacity-30 my-4">
          <summary class="px-4 py-2 cursor-pointer">
            <span class="font-semibold opacity-90"> But I want to run another account on the same device </span>
          </summary>
          <div class="px-4 py-2 opacity-70 pb-4">
            <p className="italic">
              Delete the already connected account before running a new account to avoid connection issues
            </p>
          </div>
        </details>
        <p className="mt-10 text-center font-bold italic ">Follow our socials to stay updated </p>
        <div className="w-full flex items-center justify-center py-2">
          <a href="https://x.com/monadscores_xyz" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="white" height='30px' width='30px'><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm297.1 84L257.3 234.6 379.4 396H283.8L209 298.1 123.3 396H75.8l111-126.9L69.7 116h98l67.7 89.5L313.6 116h47.5zM323.3 367.6L153.4 142.9H125.1L296.9 367.6h26.3z" /></svg>
          </a>
        </div>


      </div>

    </div>
  );
};

export default Faq;



