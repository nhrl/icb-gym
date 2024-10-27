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

interface DietPlan {
  dietplan_id: number;
  name: string;
  description: string;
  fitness_goal: string;
  photo: string;
}

const fallbackImage = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

export default function DietPlansPage() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tags] = useState([
    "Custom Meal Plans",
    "Calorie Tracking",
    "User Preferences",
    "Balanced Diet Options",
    "Personalized Nutrition",
    "Diet Progress Monitoring",
  ]);

  const mockData = [
    {
      dietplan_id: 1,
      name: "Keto Diet Plan",
      description: "A low-carb, high-fat diet designed to promote weight loss and improve energy levels.",
      fitness_goal: "Weight Loss",
      photo: "https://m.media-amazon.com/images/S/assets.wholefoodsmarket.com//content/af/db/c83977574b62ad4db1696035f438/article-keto-mealplan.jpg",
    },
    {
      dietplan_id: 2,
      name: "High-Protein Diet",
      description: "Ideal for muscle gain and repair, focusing on foods rich in protein.",
      fitness_goal: "Muscle Gain",
      photo: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      dietplan_id: 3,
      name: "Mediterranean Diet",
      description: "A balanced diet based on fruits, vegetables, olive oil, and lean proteins.",
      fitness_goal: "General Health",
      photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSP-z1yP7OeX7UDQLly912k-TnfTj3HFkciNg&s",
    },
    {
      dietplan_id: 4,
      name: "Vegan Diet Plan",
      description: "A plant-based diet avoiding all animal products, ideal for ethical and health-conscious individuals.",
      fitness_goal: "General Health",
      photo: "https://images.unsplash.com/photo-1444952483853-7c36e902e722?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      dietplan_id: 5,
      name: "Paleo Diet Plan",
      description: "Focused on consuming whole foods and avoiding processed items to maintain optimal health.",
      fitness_goal: "General Health",
      photo: "https://images.greenchef.com/w_3840,q_auto,f_auto,c_limit,fl_lossy/hellofresh_website/us/greenchef/user-guides/paleo/paleo-101/Paleo-foods.jpg",
    },
    {
      dietplan_id: 6,
      name: "Gluten-Free Diet Plan",
      description: "A diet excluding gluten to support individuals with gluten sensitivity or celiac disease.",
      fitness_goal: "General Health",
      photo: "https://images.everydayhealth.com/images/diet-nutrition/what-is-a-gluten-free-diet-alt-1440x810.jpg",
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setDietPlans(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const router = useRouter();

  const handleCardClick = (dietplanId: number) => {
    router.push(`/diet-plan/${dietplanId}`);
  };

  const getBackgroundImage = (photo: string) => {
    return photo && photo.trim() !== "" ? photo : fallbackImage;
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

        <div className="flex flex-col w-full gap-6 p-12">
          <div className="flex flex-col sm:flex-row w-full justify-between">
            <h1 className="text-[36px] font-black">Diet Plans</h1>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input placeholder="Search for diet plans..." className="max-w-sm" />
              <Button className="flex flex-row items-center">
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                Search Diet Plans
              </Button>
              <Button className="flex flex-row items-center" variant="outline">
                <SparklesIcon className="h-4 w-4 mr-2" />
                Show Recommendations
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
                      backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1)), url(${getBackgroundImage(dietPlan.photo)})`,
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
