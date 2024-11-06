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
import { ArrowRightCircleIcon, HeartIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/badge';
import { Toggle } from '@/components/ui/toggle';
import CryptoJS from 'crypto-js';
import { useCallback } from 'react';
import { Arrow } from '@radix-ui/react-select';

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
  const [searchTerm, setSearchTerm] = useState("");
  const [isRecommended, setIsRecommended] = useState(false); // Track if recommendations are shown

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

  const fetchDietPlans = useCallback(async (recommended: boolean = false) => {
    try {
      setLoading(true);
      const url = recommended
        ? `${api}/api/customer/recommendation/dietplan?userId=${fetchUserFromCookie()}`
        : `${api}/api/manager/plans/diet`;

      const response = await fetch(url);
      const data = await response.json();
      setDietPlans(data.dietplan || data.data || []);
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
    fetchDietPlans(recommended);

    setButtonText(recommended ? "Show All Diet Plans" : "Show Recommendations");
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
          setIsRecommended(true);
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

  const filteredDietplans = dietPlans.filter((dietplan) =>
    dietplan.name.toLocaleLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="w-full flex flex-col rounded-2xl">

        <div className="flex flex-col w-full gap-6 p-12 sm:px-[128px] ">
          <div className="flex flex-col sm:flex-row w-full justify-between items-center">
            <h1 className="text-[36px] font-black">Diet Plans</h1>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input 
                placeholder="Search for diet plans..." 
                className="max-w-sm bg-foreground/5 border-border" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button className="flex flex-row items-center" size="sm" variant="default" onClick={showDietplanRecommendations}>
                <SparklesIcon className="h-4 w-4 mr-1" />
                {buttonText}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDietplans.length === 0 ? (
              <p>No diet plans available.</p>
            ) : (
              filteredDietplans.map((dietPlan) => (
                <Card
                  key={dietPlan.dietplan_id}
                  className="border-none flex flex-col justify-between transform transition-transform duration-300 gap-4 shadow-none cursor-pointer"
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
                    {/* Show recommended badge */}
                    {isRecommended && (
                        <Badge className="text-xs w-fit flex flex-row" variant="recommended"><SparklesIcon className='h-3 w-3 mr-2'/>Recommended</Badge>
                      )}

                    {/* Diet Plan Name */}
                    <span className="text-2xl font-bold text-foreground">{dietPlan.name}</span>
                    <span className="text-md text-muted-foreground">{dietPlan.description}</span>
                  </CardContent>

                  <CardFooter className="flex flex-row w-full items-center justify-between p-0 gap-2">
                    <div className="p-2 px-4 w-fit rounded-full bg-foreground/90 flex items-center justify-center border-border border">
                      <p className="text-xs text-background">{dietPlan.fitness_goal}</p>
                    </div>
                    <Button className='rounded-full hover:scale-105 hover:z-10 hover:shadow-lg' variant="outline" size="sm"  onClick={() => handleCardClick(dietPlan.dietplan_id)}>
                      <ArrowRightCircleIcon className="h-4 w-4 ml-1" />
                      View Plan
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
