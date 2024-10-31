"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import {
  Card,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon, SparklesIcon, HeartIcon, UserGroupIcon, ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { RiAsterisk } from "react-icons/ri";
import { Toggle } from "@/components/ui/toggle";
import CryptoJS from 'crypto-js';
import { useCallback } from 'react';

interface Trainer {
  trainer_id: number;
  firstname: string;
  lastname: string;
  specialty: string;
  email: string;
  trainer_img: string;
}

interface Service {
  service_name: string;
}

interface Assignment {
  assign_id: number;
  service_id: number;
  trainer_id: number;
  time_availability: string;
  schedule: string[];
  max_capacity: number;
  current_capacity: number;
  rate: number;
  trainer: Trainer;
  service: Service;
}

export default function Page() {
  const { serviceId } = useParams(); // Get service_id from the URL
  const router = useRouter();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buttonText, setButtonText] = useState("Show Recommendations");
  const [searchTerm, setSearchTerm] = useState("");

  const [tags] = useState([
    "Book Trainers on Preferred Time",
    "Progress Tracking",
    "Digital Membership Card",
    "Diet Plans",
    "Workout Programs",
    "User Preference Recommendation",
  ]);

  const api = process.env.NEXT_PUBLIC_API_URL;
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || 'lhS7aOXRUPGPDId6mmHJdA00p39HAfU4';

  const handleCardClick = (assignID: number) => {
    router.push(`/booking-services/${serviceId}/${assignID}`);
  };

  // Function to fetch and decrypt user cookie from document.cookie
  const fetchUserFromCookie = useCallback(() => {
    const cookies = document.cookie.split("; ").reduce((acc: { [key: string]: string }, cookie) => {
      const [name, value] = cookie.split("=");
      acc[name] = value;
      return acc;
    }, {});
  
    const userCookie = cookies['user'];
  
    if (!userCookie) {
      console.error("User cookie not found");
      return null;
    }
  
    try {
      const decryptedUserBytes = CryptoJS.AES.decrypt(userCookie, secretKey);
      const decryptedUser = JSON.parse(decryptedUserBytes.toString(CryptoJS.enc.Utf8));
      return decryptedUser.id;
    } catch (error) {
      console.error("Error decrypting the user cookie", error);
      return null;
    }
  }, [secretKey]);

  const fetchAssignments = useCallback(async (recommended: boolean = false) => {
    try {
      setLoading(true);
      const url = recommended
        ? `${api}/api/customer/recommendation/trainer?serviceId=${serviceId}&userId=${fetchUserFromCookie()}`
        : `${api}/api/customer/service?id=${serviceId}`;
  
      const response = await fetch(url);
      const data = await response.json();
      setAssignments(data.trainer || data.data || []);
    } catch (error) {
      console.error("Error fetching diet plans:", error);
      setError("Failed to fetch diet plans.");
    } finally {
      setLoading(false);
    }
  }, [api, fetchUserFromCookie, serviceId]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const recommended = searchParams.get('recommended') === 'true';
    fetchAssignments(recommended);
  
    if (recommended) {
      setButtonText("Show All Trainers");
    } else {
      setButtonText("Show Recommendations");
    }
  }, [fetchAssignments]);

  const getRecommendation = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const recommended = searchParams.get('recommended') === 'true';
    if(recommended) {
      sessionStorage.setItem("showTrainerRecommendations", "false");
      setButtonText("Show Recommendations");
      await fetchAssignments(false); // Fetch all diet plans
      router.push(`/booking-services/${serviceId}`);
    } else {
      const id = fetchUserFromCookie();
      try {
        setLoading(true);
        const response = await fetch(`${api}/api/customer/recommendation/trainer?serviceId=${serviceId}&userId=${id}`);
        const result = await response.json();

        if(result.success){
          setAssignments(result.trainer);
          sessionStorage.setItem("showTrainerRecommendations", "true");
          setButtonText("Show All Trainer");
          router.push(`/booking-services/${serviceId}?recommended=true`)
        } else {
          setError(result.message || "Failed to fetch assignments.");
        }
      } catch (error) {
          setError("An error occurred while fetching data.");
      }
    }
    setLoading(false);
  }

  const fallbackImage = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"; 

  const getBackgroundImage = (photo: string) => {
    return photo && photo.trim() !== "" ? photo : fallbackImage;
  };

 
  if (loading) return <p>Loading assignments...</p>;
  if (error) return <p>Error: {error}</p>;

  const filteredTrainer = assignments.filter((assign) =>
    `${assign.trainer.firstname} ${assign.trainer.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const serviceName = assignments.length > 0 ? assignments[0].service.service_name : "Service";
  return (
    <div className="w-full flex flex-col rounded-2xl">
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

      <div className="flex flex-col w-full gap-6 p-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/booking-services">Services</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/booking-services/${serviceId}`}>{serviceName}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col sm:flex-row w-full justify-between items-center">
          <h1 className="text-[36px] font-black">{serviceName}</h1>

          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Search for trainers..."
              className="max-w-sm"
              value={searchTerm} // Bind input to searchTerm
              onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm state
            />
            <Button className="flex flex-row items-center">
              <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
              Search Trainers
            </Button>
            <Button className="flex flex-row items-center" variant="outline" onClick={getRecommendation}>
              <SparklesIcon className="h-4 w-4 mr-2" />
              {buttonText}
            </Button>
          </div>
        </div>

        {/* Grid Layout for Trainer Assignments */}
        {assignments.length === 0 ? (
          <p className="text-center text-xl mt-8">No recommended trainers available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrainer.map((assign) => (
              <Card
                key={assign.assign_id}
                className="h-fit border-border border rounded-3xl flex flex-col justify-between overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:z-10 cursor-pointer"
                onClick={() => handleCardClick(assign.assign_id)}
              >
                <CardHeader
                  className="w-full h-[275px] border-border rounded-3xl rounded-b-none border flex flex-col justify-between p-2"
                  style={{
                    backgroundImage: `url(${getBackgroundImage(assign.trainer.trainer_img)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <Toggle
                    variant="outline"
                    className="w-fit rounded-full bg-black/30 border-white"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <HeartIcon className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-transparent' : 'text-white'}`} />
                  </Toggle>
                </CardHeader>

                <CardFooter className="p-4 flex flex-col gap-4 items-end">
                  <div className="flex flex-row justify-between w-full">
                    <div className="flex flex-col">
                      <span>{assign.trainer.firstname} {assign.trainer.lastname}</span>
                      <span className="text-sm">{assign.trainer.email}</span>
                    </div>
                    <div>
                      <p>${assign.rate}/Month</p>
                    </div>
                  </div>
                  <Button variant="outline" className="rounded-full">
                    Book Now <ArrowRightCircleIcon className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
