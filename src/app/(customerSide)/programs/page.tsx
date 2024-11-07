"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation'; 
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRightCircleIcon, BookmarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Toggle } from '@/components/ui/toggle';
import { Badge } from '@/components/ui/badge';
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
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buttonText, setButtonText] = useState("Show Recommendations");
  const [searchTerm, setSearchTerm] = useState("");
  const [isRecommended, setIsRecommended] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");


  const api = process.env.NEXT_PUBLIC_API_URL;
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || 'lhS7aOXRUPGPDId6mmHJdA00p39HAfU4';

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

  const fetchProgram = useCallback(async (recommended: boolean = false) => {
    try {
      setLoading(true);
      const url = recommended
        ? `${api}/api/customer/recommendation/program?userId=${fetchUserFromCookie()}`
        : `${api}/api/manager/plans/workout`;

      const response = await fetch(url);
      const data = await response.json();
      setWorkouts(data.programs || data.program || []);
      setIsRecommended(recommended);
    } catch (error) {
      console.error("Error fetching diet plans:", error);
      setError("Failed to fetch diet plans.");
    } finally {
      setLoading(false);
    }
  }, [api, fetchUserFromCookie]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const recommended = searchParams.get('recommended') === 'true';
    fetchProgram(recommended);

    if (recommended) {
      setButtonText("Show All Programs");
    } else {
      setButtonText("Show Recommendations");
    }
  }, [fetchProgram]);

  const router = useRouter();

  const handleCardClick = (workoutId: number) => {
    router.push(`/programs/${workoutId}`);
  };

  const getBackgroundImage = (photo: any) => {
    return photo && photo.trim() !== "" ? photo : fallbackImage;
  };

  const showProgramRecommendations = async () => {
    const recommended = isRecommended;

    if (recommended) {
      setButtonText("Show Recommendations");
      await fetchProgram(false);
      router.push('/programs');
    } else {
      try {
        setLoading(true);
        await fetchProgram(true);
        setButtonText("Show All Programs");
        router.push('/programs?recommended=true');
      } catch (error) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const filteredProgram = workouts
    .filter((workout) =>
      workout.title.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
    )
    .sort((a, b) => 
      sortOrder === "asc" 
        ? a.title.localeCompare(b.title) 
        : b.title.localeCompare(a.title)
    );

  if (loading) return <p>Loading programs...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="w-full flex flex-col rounded-2xl">
        <div className="flex flex-col w-full gap-6 p-12 sm:px-[128px]">
          <div className="flex flex-col sm:flex-row w-full justify-between items-center">
            <h1 className="text-[36px] font-black">Workouts</h1>
            <div className="flex flex-col gap-2">

            <div className='flex flex-row gap-2 items-end'>
              <Input 
                placeholder="Search for workouts..." 
                className="max-w-sm bg-foreground/5 border-border" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button className="flex flex-row items-center" size="sm" variant="default" onClick={showProgramRecommendations}>
                <SparklesIcon className="h-4 w-4 mr-1" />
                {buttonText}
              </Button>
              <Toggle size="sm" variant="outline"><BookmarkIcon className='h-4 w-4'/></Toggle>
            </div>
              
            {/* <div className='w-full flex flex-row items-end justify-end'>
              <Toggle onClick={toggleSortOrder} className='flex flex-row gap-2 w-fit' variant="outline" size="sm">
                  <ArrowsUpDownIcon className='h-3 w-3 '/>
                  <p>Order:</p>
                  <p>{sortOrder === "asc" ? "A - Z" : "Z - A"}</p>
              </Toggle>
            </div> */}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProgram.length === 0 ? (
              <p>No workouts available.</p>
            ) : (
              filteredProgram.map((workout) => (
                <Card
                  key={workout.program_id}
                  className="flex flex-col border-none justify-between cursor-pointer transform transition-transform duration-300 shadow-none gap-4"
                  onClick={() => handleCardClick(workout.program_id)}
                >
                  <CardHeader
                    className="w-full h-[275px] border border-border rounded-xl flex flex-row justify-end"
                    style={{
                      backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1)), url(${getBackgroundImage(workout.program_img)})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {/* <div className="w-full text-right">
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
                    </div> */}
                  </CardHeader>
                  <CardContent className="px-2 gap-2 flex flex-col">
                  {isRecommended && (
                      <Badge className="text-xs w-fit flex flex-row" variant="recommended"><SparklesIcon className='h-3 w-3 mr-2'/>Recommended</Badge>
                    )}
                    <span className="text-2xl font-bold text-foreground">{workout.title}</span>
                    <span className="text-md text-muted-foreground">{workout.description}</span>
                  </CardContent>
                  <CardFooter className="flex flex-row w-full items-left justify-between p-0 gap-2">
                    <div className='flex flex-row gap-2'>
                      <div className="p-2 px-4 w-fit rounded-full bg-background/90 flex items-center justify-center order-border border">
                        <p className="text-xs text-foreground">{workout.fitness_level}</p>
                      </div>
                      <div className="p-2 px-4 w-fit rounded-full bg-foreground/90 flex items-center justify-center border-border border">
                        <p className="text-xs text-background">{workout.fitness_goal}</p>
                      </div>
                    </div>

                    <Button className='rounded-full hover:scale-105 hover:z-10 hover:shadow-lg' variant="outline" size="sm"   onClick={() => handleCardClick(workout.program_id)}>
                      <ArrowRightCircleIcon className="h-4 w-4 ml-1" />
                      View Workout
                    </Button>
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
