"use client";

import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HeartIcon, EyeIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface DietPlan {
  dietplan_id: number;
  name: string;
  description: string;
  fitness_goal: string;
  dietplan_img: string;
}

interface Meal {
  meal_id: number;
  dietplan_id: number;
  meal_name: "Breakfast" | "Lunch" | "Dinner";
  dish: string;
  food_desc: string;
  ingredients: string;
  food_prep: string;
  protein: number;
  carbohydrates: number;
  fats: number;
  calories: number;
  meal_img: string;
}

const fallbackImage = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

export default function DietPlanDetailPage() {
  const { dietplanId } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [dietPlan, setDietPlan] = useState<DietPlan | undefined>();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [breadcrumbLink, setBreadcrumbLink] = useState("/diet-plan");

  const api = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    const id = Number(dietplanId);
    if (isNaN(id)) {
      console.error("Invalid dietplan ID");
      return;
    }

    const fetchWorkout = async () => {
      try {
        const response = await fetch(`${api}/api/manager/plans/diet`);
        const data = await response.json();
        const diet = Array.isArray(data.dietplan) ? data.dietplan : [];

        // Safely find the workout with the matching dietplan_id
        const selectedDietplan = diet.find(
          (dietplan: DietPlan) => dietplan.dietplan_id === id
        );

        if (!selectedDietplan) {
          console.warn("Dietplan not found");
        } else {
          setDietPlan(selectedDietplan);
        }
      } catch (error) {
        console.error("Error fetching program:", error);
      }
    };

    const fetchExercise = async () => {
      try {
        const response = await fetch(`${api}/api/manager/plans/diet/meal?id=${id}`)
        const data = await response.json();
        setMeals(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    }

    const showRecommendations = sessionStorage.getItem("showDietplanRecommendations") === "true";
    if (showRecommendations) {
      setBreadcrumbLink("/diet-plan?recommended=true");
    }
    fetchWorkout();
    fetchExercise();
  }, [dietplanId, api]);

  if (!dietPlan)
    return (
      <div className="h-screen w-screen text-center">
        <p>No diet plan found</p>
      </div>
    );

  return (
    <div className="w-full p-12 px-8 sm:px-[254px]">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={breadcrumbLink}>Diet Plans</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/diet-plan/${dietPlan.dietplan_id}`}>
              {dietPlan.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-8 border-none shadow-none">
        <CardHeader
          className="h-64 bg-cover bg-center border rounded-lg"
          style={{ backgroundImage: `url(${dietPlan.dietplan_img || fallbackImage})` }}
        ></CardHeader>

        <CardContent className="p-6 px-0">
          <div className="flex justify-between gap-4">
            <h2 className="text-2xl font-bold">{dietPlan.name}</h2>
               <Toggle 
                  variant="outline" 
                  className="w-fit items-center gap-2 rounded-full px-4"  
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <BookmarkIcon className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-transparent' : 'text-foreground'}`} />
                  Save to Favorites
                </Toggle>
          </div>
          <p className="text-lg text-muted-foreground">{dietPlan.description}</p>

          <div className="flex gap-2 mt-6">
            <div className="p-2 px-4 rounded-full bg-background border">
              <p className="text-xs text-foreground">
                {dietPlan.fitness_goal}
              </p>
            </div>
          </div>
        </CardContent>

        {/* Meals */}
        <CardContent className="px-0 flex flex-col gap-4">
          <h1 className="font-bold text-lg">Meals</h1>
          {meals.length > 0 ? (
            meals.map((meal) => (
              <Dialog key={meal.meal_id}>
                <DialogTrigger>
                  <Button
                    variant="outline"
                    className="rounded-md w-full flex flex-row justify-between"
                  >
                    <div className="flex flex-row items-center">
                      <EyeIcon className="h-4 w-4 mr-2" />
                      {meal.dish}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {meal.meal_name}
                    </p>
                  </Button>
                </DialogTrigger>
                <DialogContent className="gap-4 flex flex-col overflow-y-auto max-h-[80vh] scrollbar-hide">
                  <div className="flex-shrink-0">
                    <DialogHeader
                      className="h-48 bg-cover bg-center border rounded-lg mt-6"
                      style={{
                        backgroundImage: `url(${meal.meal_img || fallbackImage})`,
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <DialogTitle className="text-2xl font-semibold">
                      {meal.dish}
                    </DialogTitle>
                    <DialogDescription>{meal.food_desc}</DialogDescription>

                    <DialogDescription className="flex flex-col gap-4 mt-3">
                      <div className="flex flex-col justify-between">
                        <h2 className="font-bold text-md text-foreground">Ingredients</h2>
                        <p>{meal.ingredients}</p>
                      </div>
                      <div className="flex flex-col justify-between">
                        <h2 className="font-bold text-md text-foreground">Food Prep</h2>
                        <p>{meal.food_prep}</p>
                      </div>

                      {/* Macros */}
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="rounded-lg px-4 py-2 border flex justify-between shadow-sm">
                          <h2 className="text-foreground">Protein</h2>
                          <p>{meal.protein}g</p>
                        </div>
                        <div className="rounded-lg px-4 py-2 border flex justify-between shadow-sm">
                          <h2 className="text-foreground">Carbohydrates</h2>
                          <p>{meal.carbohydrates}g</p>
                        </div>
                        <div className="rounded-lg px-4 py-2 border flex justify-between shadow-sm">
                          <h2 className="text-foreground">Fats</h2>
                          <p>{meal.fats}g</p>
                        </div>
                        <div className="rounded-lg px-4 py-2 border flex justify-between shadow-sm">
                          <h2 className="text-foreground">Calories</h2>
                          <p>{meal.calories}</p>
                        </div>
                      </div>
                    </DialogDescription>
                  </div>
                </DialogContent>
              </Dialog>
            ))
          ) : (
            <p className="text-center text-muted-foreground">No meals added yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
