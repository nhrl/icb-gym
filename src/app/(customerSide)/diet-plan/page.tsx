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
import { useCallback } from 'react';

interface DietPlan {
  dietplan_id: number;
  name: string;
  description: string;
  fitness_goal: string;
  dietplan_img: string;
}

const fallbackImage = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

export default function DietPlansPage() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buttonText, setButtonText] = useState("Show Recommendations");
  const [tags] = useState([
    "Custom Meal Plans",
    "Calorie Tracking",
    "User Preferences",
    "Balanced Diet Options",
    "Personalized Nutrition",
    "Diet Progress Monitoring",
  ]);

  const api = process.env.NEXT_PUBLIC_API_URL;
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || 'lhS7aOXRUPGPDId6mmHJdA00p39HAfU4';
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

  const fetchDietPlans = useCallback(async (recommended: boolean = false) => {
    try {
      setLoading(true);
      const url = recommended
        ? `${api}/api/customer/recommendation/dietplan?userId=${fetchUserFromCookie()}`
        : `${api}/api/manager/plans/diet`;
  
      const response = await fetch(url);
      const data = await response.json();
      setDietPlans(data.dietplan || data.data || []);
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
    fetchDietPlans(recommended);
  
    if (recommended) {
      setButtonText("Show All Diet Plans");
    } else {
      setButtonText("Show Recommendations");
    }
  }, [fetchDietPlans]);

  const router = useRouter();

  const handleCardClick = (dietplanId: number) => {
    router.push(`/diet-plan/${dietplanId}`);
  };

  const getBackgroundImage = (photo: string) => {
    return photo && photo.trim() !== "" ? photo : fallbackImage;
  };

  const showDietplanRecommendations = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const recommended = searchParams.get('recommended') === 'true';

    if (recommended) {
      sessionStorage.setItem("showDietplanRecommendations", "false");
      setButtonText("Show Recommendations");
      await fetchDietPlans(false); // Fetch all diet plans
      router.push('/diet-plan');
    } else {
      const id = fetchUserFromCookie();
      try {
        setLoading(true);
        const response = await fetch(`${api}/api/customer/recommendation/dietplan?userId=${id}`);
        const result = await response.json();
        if (result.success) {
          setDietPlans(result.data);
          sessionStorage.setItem("showDietplanRecommendations", "true");
          setButtonText("Show All Diet Plans");
          router.push('/diet-plan?recommended=true');
        } else {
          setError(result.message || "Failed to fetch recommendations.");
        }
      } catch (error) {
        setError("An error occurred while fetching recommendations.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <p>Loading diet plans...</p>;
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

        <div className="flex flex-col w-full gap-6 p-12 sm:px-[128px]">
          <div className="flex flex-col sm:flex-row w-full justify-between">
            <h1 className="text-[36px] font-black">Diet Plans</h1>
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Search bar */}
              <Input placeholder="Search for diet plans..." className="max-w-sm" />
              <Button className="flex flex-row items-center">
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                Search Diet Plans
              </Button>
              {/* Show Recommendations button */}
              <Button className="flex flex-row items-center" variant="outline" onClick={showDietplanRecommendations}>
                <SparklesIcon className="h-4 w-4 mr-2" />
                {buttonText}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dietPlans.length === 0 ? (
              <p>No diet plans available.</p>
            ) : (
              dietPlans.map((dietPlan) => (
                <Card
                  key={dietPlan.dietplan_id}
                  className="border-border border p-4  flex flex-col rounded-3xl justify-between cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-lg shadow-lg gap-4"
                  onClick={() => handleCardClick(dietPlan.dietplan_id)}
                >
                  <CardHeader
                    className="w-full h-[275px] border border-border rounded-xl flex flex-row justify-end"
                    style={{
                      backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1)), url(${getBackgroundImage(dietPlan.dietplan_img)})`,
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
                    <span className="text-2xl font-bold text-foreground">{dietPlan.name}</span>
                    <span className="text-md text-muted-foreground">{dietPlan.description}</span>
                  </CardContent>

                  <CardFooter className="flex flex-row w-full items-left p-0 gap-2">
                    <div className="p-2 px-4 w-fit rounded-full bg-foreground/90 flex items-center justify-center cursor-pointer hover:bg-foreground/20 border-border border">
                      <p className="text-xs text-background">{dietPlan.fitness_goal}</p>
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
