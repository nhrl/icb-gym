"use client";

import React, { useState , useEffect} from 'react';
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


const fallbackImage = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"; // Fallback image path

interface Service {
  service_id: number;
  service_name: string;
  service_img: string;
  desc: string
}

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
  const [services, setServices] = useState<Service[]>([]);

  const api = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${api}/api/manager/service`);
        const data = await response.json();
        setServices(data.data); // Assuming data.services contains an array of service objects
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, [api]);

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
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes slide {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-100%);
            }
          }
          .animate-slide {
            display: flex;
            animation: slide 10s linear infinite;
          }
        `}</style>

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
              key={service.service_id}
              className="h-[275px] rounded-3xl flex flex-col justify-between cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-lg"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1)), url(${getBackgroundImage(service.service_img)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() => handleCardClick(service.service_id)}
            >
              <CardHeader className="w-full flex flex-row justify-end">
                <div className="h-10 w-10 rounded-full bg-white/10 backdrop-filter backdrop-blur-lg flex items-center justify-center cursor-pointer hover:bg-white/20">
                  <ArrowUpRightIcon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardFooter>
                <span className="text-2xl text-white">{service.service_name}</span>
              </CardFooter>
            </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
