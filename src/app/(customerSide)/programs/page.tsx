"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MagnifyingGlassIcon, HeartIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { RiAsterisk } from 'react-icons/ri';
import { Toggle } from '@/components/ui/toggle';
import CryptoJS from 'crypto-js';

interface Workout {
  program_id: number;
  title: string;
  description: string;
  fitness_level: string;
  fitness_goal: string;
  program_img: string;
}

const fallbackImage = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

export default function Page() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]); // Initialize as an empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
   // Function to fetch and decrypt user cookie from document.cookie
   const fetchUserFromCookie = () => {
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
      return decryptedUser.id; // Assuming user ID is part of the decrypted data
    } catch (error) {
      console.error("Error decrypting the user cookie", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${api}/api/manager/plans/workout`);
        const data = await response.json();
        setWorkouts(data.program || []); // Set workouts to an empty array if no data
      } catch (error) {
        console.error("Error fetching services:", error);
      }
      setLoading(false);
    };
    fetchServices();
  }, [api]);

  const router = useRouter();

  const handleCardClick = (workoutId: number) => {
    router.push(`/programs/${workoutId}`);
  };
  
  const getBackgroundImage = (photo: any) => {
    return photo && photo.trim() !== "" ? photo : fallbackImage;
  };

  const showProgramRecommendations = async () => {
    const id = fetchUserFromCookie();
    console.log(id);
    try {
      setLoading(true);
      const response = await fetch(`${api}/api/customer/recommendation/program?userId=${id}`);
      const result = await response.json();
      if(result.success){
        setWorkouts(result.programs);
      } else {
        setError(result.message || "Failed to fetch programs.");
      }
    } catch (error) {
      setError("An error occurred while fetching data.");
    }
    setLoading(false);
  }

  if (loading) return <p>Loading programs...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <>
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
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full gap-6 p-12">
          <div className="flex flex-col sm:flex-row w-full justify-between">
            <h1 className="text-[36px] font-black">Workouts</h1>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input placeholder="Search for workouts..." className="max-w-sm" />
              <Button className="flex flex-row items-center">
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                Search Workouts
              </Button>
              <Button className="flex flex-row items-center" variant="outline" onClick={showProgramRecommendations}>
                <SparklesIcon className="h-4 w-4 mr-2" />
                Show Recommendations
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.length === 0 ? (
              <p>No workouts available.</p>
            ) : (
              workouts.map((workout) => (
                <Card
                  key={workout.program_id}
                  className="border-none flex flex-col rounded-3xl justify-between cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-lg shadow-none gap-4"
                  onClick={() => handleCardClick(workout.program_id)}
                >
                  <CardHeader
                    className="w-full h-[275px] border border-border rounded-3xl flex flex-row justify-end"
                    style={{
                      backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1)), url(${getBackgroundImage(workout.program_img)})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="w-full text-right">
                      <Toggle
                        variant="outline"
                        className="w-fit rounded-full bg-black/30 border-white"
                        onClick={() => setIsFavorite(!isFavorite)}
                      >
                        <HeartIcon
                          className={`h-4 w-4 ${
                            isFavorite ? "fill-red-500 text-transparent" : "text-white"
                          }`}
                        />
                      </Toggle>
                    </div>
                  </CardHeader>
                  <CardContent className="px-2 gap-2 flex flex-col">
                    <span className="text-2xl font-bold text-foreground">{workout.title}</span>
                    <span className="text-md text-muted-foreground">{workout.description}</span>
                  </CardContent>
                  <CardFooter className="flex flex-row w-full items-left p-0 gap-2">
                    <div className="p-2 px-4 w-fit rounded-full bg-background/90 flex items-center justify-center cursor-pointer hover:bg-black/20 border-border border">
                      <p className="text-xs text-foreground">{workout.fitness_level}</p>
                    </div>
                    <div className="p-2 px-4 w-fit rounded-full bg-foreground/90 flex items-center justify-center cursor-pointer hover:bg-foreground/20 border-border border">
                      <p className="text-xs text-background">{workout.fitness_goal}</p>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
