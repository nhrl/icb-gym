"use client";

import Image from "next/image";
import { RiAsterisk } from "react-icons/ri";
import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";

import { 
  InformationCircleIcon, 
  ArrowRightCircleIcon, 
} from "@heroicons/react/24/outline";
import SignupModal from "../components/signupModal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"



export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openSignupModal = () => setIsSignupModalOpen(true);
  const closeSignupModal = () => setIsSignupModalOpen(false);

  
  const [tags] = useState([
    "Book Trainers on Preferred Time",
    "Progress Tracking",
    "Digital Membership Card",
    "Diet Plans",
    "Workout Programs",
    "User Preference Recommendation",
  ]);

  const [herosection] = useState([
    {
      title: "Incredoball Gym and Fitness",
      description: "Incredoball is your ultimate fitness companion. We offer a comprehensive platform that caters to all your fitness needs",
    },
  ]);

  if (!isMounted) {
    return null;
  }
  
  return (
    <> 
      {/* Hero Section */}
      <div className="w-full h-fit text-center flex flex-col gap-6 py-12 px-16">
        <div className="font-black text-[36px] sm:text-[132px] text-left w-full leading-none h-fit">
          <div className="flex items-center w-full">
            {herosection[0].title.split(" ").slice(0, 2).join(" ")}<br />
            {herosection[0].title.split(" ").slice(2).join(" ")}
          </div>
        </div>

          {/* Button Container */}
          <div className="flex flex-wrap sm:flex-row gap-4 mt-4 sm:mt-6">
            <Button className="rounded-3xl gap-2 flex" variant="outline">
              <InformationCircleIcon className="h-4 w-4" />
              About Us
            </Button>
            <Button className="rounded-3xl gap-2 flex" variant="secondary" onClick={openSignupModal}>
              Join Incredoball Now
              <ArrowRightCircleIcon className="h-4 w-4" />
            </Button>

          </div>
      </div>


    
      {/* Section1 */}
      <div className="w-full section-bg border-t border-border rounded-t-2xl h-[720px] text-background text-center flex flex-col gap-6 py-12 pb-6 px-16">
        <div className="font-light text-[16px] sm:text-[48px] text-white md:text-md text-right w-full leading-none h-fit">
          <div className="flex items-top w-full ">
            <RiAsterisk className="h-16 w-16  mr-2" />{herosection[0].description}
          </div>
        </div>
      </div>

        {/* Features Section */}
        <div className="p-4 bg-[#CCFF00] h-fit w-full flex flex-col gap-6 py-6">
        {/* Sliding Container */}
        <div className="relative overflow-hidden w-full">
          <div className="flex gap-14  animate-slide">
            {tags.map((tag, index) => (
              <div key={index} className="text-[#131605] font-medium md:text-lg whitespace-nowrap items-center">
                <RiAsterisk className="h-4 w-4 inline-block mr-2" />
                {tag}
              </div>
            ))}
            {tags.map((tag, index) => (
              <div key={index + tags.length} className="text-[#131605]  font-medium md:text-lg whitespace-nowrap items-center">
                <RiAsterisk className="h-4 w-4 inline-block mr-2" />
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>


      <div className="w-full h-fit text-center flex flex-col gap-6 p-[64px]">
        <div className="font-black text-[36px] sm:text-[84px] text-left w-full leading-none h-fit">
          <div className="flex items-center w-full">
            Frequently <br /> Asked Questions
          </div>
          </div>

          <div>
            <Accordion type="single" collapsible className="w-full text-left">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">How can I pay my Memberships and Bookings?</AccordionTrigger>
                <AccordionContent>
                  You can pay your memberships and booking through our frontdesk.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" >
                <AccordionTrigger className="text-left">How do I get recommeded with Trainers, Workouts and Dietplans?</AccordionTrigger>
                <AccordionContent>
                  You can get recommended with Trainers, Workouts and Dietplans by setting up the User Preference tags.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" >
                <AccordionTrigger className="text-left" >Can I Cancel my Bookings and Memberships anytime?</AccordionTrigger>
                <AccordionContent>
                  Yes. You can cancel your bookings and memberships anytime.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Button Container */}
          <div className="flex flex-wrap sm:flex-row gap-4 mt-4 sm:mt-6">
            <Button className="rounded-3xl gap-2 flex" variant="outline" onClick={openSignupModal}>
              Register and Book Now
              <ArrowRightCircleIcon className="h-4 w-4" />
            </Button>
          </div>
      </div>

      {isSignupModalOpen && (       
        <div className="fixed inset-0 flex items-center justify-center z-[300] bg-black/50">
          <SignupModal onClose={closeSignupModal}/>
        </div>)}
    </>
  );
}
