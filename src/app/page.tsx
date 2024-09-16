"use client"; 

import Image from "next/image";
import { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tag } from "@/components/ui/tag"
import { AlertDialog } from "../components/ui/alert-dialog";
import {NavBar} from "../components/navBar";
import { 
  InformationCircleIcon, 
  ArrowUpLeftIcon, 
  SparklesIcon,
  BoltIcon} from "@heroicons/react/24/outline";
import { Footer } from "../components/footer";




export default function Home() {

  const [subscriptions] = useState([
    {
      title: "Standard",
      description: "Boost your stamina and heart health with this targeted program. Designed to gradually increase endurance, it combines steady-state cardio with interval training.",
      price: "₱1000",
    },
    {
      title: "Premium",
      description: "Get access to advanced workout plans, personal coaching, and nutritional guides to fast-track your fitness journey.",
      price: "₱1500",
    },
    {
      title: "Elite",
      description: "The ultimate fitness package including 1-on-1 personal training sessions, detailed diet plans, and performance tracking with elite coaching.",
      price: "₱2000",
    },
  ]);

  return (
    <main>

      <NavBar className="top-0 sticky bg-[#0a0a0a] z-[100] "/>   

      {/* Hero Section */}
      <section className="p-4 border w-full border-zinc-800 rounded-2xl h-auto overflow-hidden text-center">

      <h1 className="font-black text-[350px] whitespace-nowrap flex items-center animate-scroll">
          <div className="flex items-center ">
            <BoltIcon className="h-[300px]  fill-yellow-400 stroke-yellow-400"/>
            INCREDOBALL
            <BoltIcon className="h-[300px] fill-yellow-400 stroke-yellow-400"/>
          </div>
        </h1>


        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="w-full md:w-[1000px] h-auto mt-4 text-sm text-left">
            Incredoball is your ultimate fitness companion. We offer a comprehensive platform that caters to all 
            your fitness needs. Join our vibrant community and discover personalized workout plans, delicious nutrition 
            advice, and the motivation to reach your goals
          </p>

          {/* Button Container */}
          <div className="flex md:flex-row gap-4 mt-4 md:mt-0">
            <Button className='rounded-3xl gap-2 flex' variant='outline'><InformationCircleIcon className="h-4 w-4" />About Us</Button>
            <Button className='rounded-3xl gap-2 flex' variant='secondary'><ArrowUpLeftIcon className="h-4 w-4" /> Get Started Now</Button>
          </div>
        </div>

      </section>

     {/* Features Section */}
      <section className="p-4 h-fit border w-full border-zinc-800 rounded-2xl flex flex-col gap-6 py-6">

        <div>
          <h1 className="font-black text-3xl flex flex-row items-center gap-2">
            <SparklesIcon className="h-6 w-6 fill-yellow-400 stroke-yellow-400"/>Features</h1>
        </div>
    
       {/* Tags */}
        <div className="gap-4 flex flex-wrap w-full">
          <Tag>Community Forums</Tag>
          <Tag>Book Trainers on Preferred Time</Tag>
          <Tag>Progress Tracking</Tag>
          <Tag>Digital Membership Card</Tag>
          <Tag>Diet Plans</Tag>
          <Tag>Workout Programs</Tag>
          <Tag>User Preference Recommendation</Tag>
        </div>
        
      </section>

       {/* Membership Section */}
      <section className="p-4 h-fit border w-full border-zinc-800 rounded-2xl flex flex-col gap-4 items-center py-8">

        <div className="pb-2">
          <h1 className="font-black text-3xl">Membership Subscriptions</h1>
        </div>
    
        <div className="gap-4 flex flex-col w-full items-center justify-center md:flex-row ">
            {/* Map through the subscription data */}
            {subscriptions.map((subscription, index) => (
            <Card key={index}   className="h-[565px] w-[380px] rounded-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out hover:scale-105 hover:border-1 hover:border-yellow-400 hover:z-10">
              <CardHeader>
                <CardTitle className="text-[50px]">{subscription.title}</CardTitle>
                <CardDescription>{subscription.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-[50px] font-bold">
                <p>{subscription.price}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full rounded-md flex gap-2" variant="outline">
                <ArrowUpLeftIcon className="h-4 w-4" />
                  Register Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
  
      <Footer/>
    </main>
  );
}
