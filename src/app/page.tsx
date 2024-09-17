"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { NavBar } from "../components/navBar";
import { 
  InformationCircleIcon, 
  ArrowUpLeftIcon, 
  SparklesIcon,
  BoltIcon 
} from "@heroicons/react/24/outline";
import { Footer } from "../components/footer";

export default function Home() {
  const [tags] = useState([
    "Community Forums",
    "Book Trainers on Preferred Time",
    "Progress Tracking",
    "Digital Membership Card",
    "Diet Plans",
    "Workout Programs",
    "User Preference Recommendation",
  ]);

  const [herosection] = useState([
    {
      title: "INCREDOBALL",
      description: "Incredoball is your ultimate fitness companion. We offer a comprehensive platform that caters to all your fitness needs. Join our vibrant community and discover personalized workout plans, delicious nutrition advice, and the motivation to reach your goals.",
    },
  ]);

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
      <NavBar className="top-0 sticky bg-[#0a0a0a] z-[100]" />   

      {/* Hero Section */}
      <section className="p-4 border w-full border-zinc-800 rounded-2xl h-auto overflow-hidden text-center">
        <h1 className="font-black text-[64px] md:text-[350px] whitespace-nowrap flex items-center animate-scroll">
          <div className="flex items-center">
            <BoltIcon className="h-[64px] md:h-[300px] fill-yellow-400 stroke-yellow-400" />
            {herosection[0].title}
            <BoltIcon className="h-[64px] md:h-[300px] fill-yellow-400 stroke-yellow-400" />
          </div>
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="w-full md:w-[1000px] h-auto mt-4 text-sm text-left">
            {herosection[0].description}
          </p>

          {/* Button Container */}
          <div className="flex md:flex-row gap-4 mt-4 md:mt-0">
            <Button className="rounded-3xl gap-2 flex" variant="outline">
              <InformationCircleIcon className="h-4 w-4" />
              About Us
            </Button>
            <Button className="rounded-3xl gap-2 flex" variant="secondary">
              <ArrowUpLeftIcon className="h-4 w-4" />
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="p-4 h-fit border w-full border-zinc-800 rounded-2xl flex flex-col gap-6 py-6">
        <div>
          <h1 className="font-black text-2xl md:text-3xl flex flex-row items-center gap-2">
            <SparklesIcon className="h-6 w-6 fill-yellow-400 stroke-yellow-400" />
            Features
          </h1>
        </div>

        {/* Tags */}
        <div className="gap-4 flex flex-wrap w-full">
          {tags.map((tag, index) => (
            <Tag key={index} className="text-base font-medium md:text-lg">
              {tag}
            </Tag>
          ))}
        </div>
      </section>

      {/* Membership Section */}
      <section className="p-4 h-fit border w-full border-zinc-800 rounded-2xl flex flex-col gap-4 items-center py-8">
        <div className="pb-2">
          <h1 className="font-black text-2xl md:text-3xl">Membership Subscriptions</h1>
        </div>

        <div className="gap-4 flex flex-col w-full items-center justify-center md:flex-row">
          {/* Map through the subscription data */}
          {subscriptions.map((subscription, index) => (
            <Card 
              key={index}
              className="h-[400px] md:h-[565px] w-full md:w-[380px] rounded-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out hover:scale-105 hover:border-1 hover:border-yellow-400 hover:z-10"
            >
              <CardHeader>
                <CardTitle className="text-[32px] md:text-[50px]">{subscription.title}</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  {subscription.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-[32px] md:text-[50px] font-bold">
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

      {/* Footer Section */}
      <Footer />
    </main>
  );
}
