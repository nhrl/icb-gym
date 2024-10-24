"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Correct import from 'next/navigation'
import {
  Card,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MagnifyingGlassIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline';
import { RiAsterisk } from 'react-icons/ri';

// Mock service data based on the schema
const services = [
  {
    serviceId: 1,
    name: "Basketball",
    desc: "Improve your strength with guided weight lifting programs.",
    photo: "https://images.unsplash.com/photo-1627627256672-027a4613d028?q=80&w=1774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Example valid photo path
  },
  {
    serviceId: 2,
    name: "Yoga",
    desc: "Find your balance with expert-led yoga sessions.",
    photo: "https://images.unsplash.com/photo-1552196527-bffef41ef674?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHlvZ2F8ZW58MHx8MHx8fDI%3D", // Example valid photo path
  },
  {
    serviceId: 3,
    name: "Weight Lifting",
    desc: "Boost your stregth and endurance with our weight lifting programs.",
    photo: "https://images.unsplash.com/photo-1675154457129-ba4aca25e586?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Missing photo, should show fallback
  },
  {
    serviceId: 4,
    name: "Pilates",
    desc: "Increase your flexibility and core strength.",
    photo: "https://images.unsplash.com/photo-1717500251716-27057c48ace4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBpbGF0ZXN8ZW58MHx8MHx8fDI%3D", // Invalid path, should show fallback
  },
];

const fallbackImage = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"; // Fallback image path

export default function Page() {
  const [tags] = useState([
    "Book Trainers on Preferred Time",
    "Progress Tracking",
    "Digital Membership Card",
    "Diet Plans",
    "Workout Programs",
    "User Preference Recommendation",
  ]);

  const router = useRouter();

  const handleCardClick = (serviceId:any) => {
    router.push(`/booking-services/${serviceId}`);
  };

  const getBackgroundImage = (photo:any) => {
    // Return the photo if it exists, otherwise use the fallback image
    return photo && photo.trim() !== "" ? photo : fallbackImage;
  };

  return (
    <>
      <div className="w-full flex flex-col rounded-2xl">

        {/* Features Section */}
        <div className="p-2 bg-[#CCFF00] h-fit w-full flex flex-col gap-6 py-6">
          <div className="relative overflow-hidden w-full">
            <div className="flex gap-14 animate-slide">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="text-[#131605] font-medium md:text-sm whitespace-nowrap items-center"
                >
                  <RiAsterisk className="h-4 w-4 inline-block mr-2" />
                  {tag}
                </div>
              ))}
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="text-[#131605] font-medium md:text-sm whitespace-nowrap items-center"
                >
                  <RiAsterisk className="h-4 w-4 inline-block mr-2" />
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Container for Services */}
        <div className="flex flex-col w-full gap-6 p-12">
          <div className="flex flex-col sm:flex-row w-full justify-between">
            <h1 className="text-[36px] font-black">Services</h1>

            <div className="flex flex-col sm:flex-row gap-2">
              <Input placeholder="Search for services..." className="max-w-sm" />
              <Button className="flex flex-row items-center">
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                Search Services
              </Button>
            </div>
          </div>

          {/* Grid Layout for Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service:any) => (
              <Card
              key={service.serviceId}
              className="h-[275px] rounded-3xl flex flex-col justify-between cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-lg"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1)), url(${getBackgroundImage(service.photo)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() => handleCardClick(service.serviceId)}
            >
              <CardHeader className="w-full flex flex-row justify-end">
                <div className="h-10 w-10 rounded-full bg-white/10 backdrop-filter backdrop-blur-lg flex items-center justify-center cursor-pointer hover:bg-white/20">
                  <ArrowUpRightIcon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardFooter>
                <span className="text-2xl text-white">{service.name}</span>
              </CardFooter>
            </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
