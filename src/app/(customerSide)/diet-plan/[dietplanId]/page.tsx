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
import { HeartIcon, EyeIcon } from "@heroicons/react/24/outline";
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
  photo: string;
}

interface Meal {
  meal_id: number;
  meal_type: "Breakfast" | "Lunch" | "Dinner";
  dietplan_id: number;
  food: string;
  food_desc: string;
  recipe: string;
  food_prep: string;
  protein: number;
  carbohydrates: number;
  fats: number;
  calories: number;
  food_img: string;
}

const fallbackImage = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

const mockDietPlans: DietPlan[] = [
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
];

const mockMeals: Meal[] = [
  {
    meal_id: 1,
    meal_type: "Breakfast",
    dietplan_id: 1,
    food: "Scrambled Eggs with Avocado",
    food_desc: "A protein-packed breakfast with healthy fats.",
    recipe: "Scramble eggs, add avocado slices, and serve.",
    food_prep: "5 minutes",
    protein: 15,
    carbohydrates: 2,
    fats: 20,
    calories: 250,
    food_img: "",
  },
  {
    meal_id: 2,
    meal_type: "Lunch",
    dietplan_id: 1,
    food: "Grilled Chicken Salad",
    food_desc: "A light salad with grilled chicken and greens.",
    recipe: "Grill chicken, toss with greens, and serve with vinaigrette.",
    food_prep: "15 minutes",
    protein: 30,
    carbohydrates: 10,
    fats: 5,
    calories: 300,
    food_img: "",
  },
  {
    meal_id: 3,
    meal_type: "Dinner",
    dietplan_id: 2,
    food: "Vegan Stir-fry",
    food_desc: "A stir-fry with tofu and mixed vegetables.",
    recipe: "Stir-fry tofu with vegetables and soy sauce.",
    food_prep: "20 minutes",
    protein: 20,
    carbohydrates: 40,
    fats: 10,
    calories: 350,
    food_img: "",
  },
];

export default function DietPlanDetailPage() {
  const { dietplanId } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [dietPlan, setDietPlan] = useState<DietPlan | undefined>();
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    const id = Number(dietplanId);
    if (isNaN(id)) {
      console.error("Invalid diet plan ID");
      return;
    }

    const selectedDietPlan = mockDietPlans.find(
      (plan) => plan.dietplan_id === id
    );

    if (!selectedDietPlan) {
      console.warn("Diet plan not found");
    } else {
      setDietPlan(selectedDietPlan);
      setMeals(mockMeals.filter((meal) => meal.dietplan_id === id));
    }
  }, [dietplanId]);

  if (!dietPlan)
    return (
      <div className="h-screen w-screen text-center">
        <p>No diet plan found</p>
      </div>
    );

  return (
    <div className="w-full p-12 px-8 sm:px-[180px]">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/diet-plan">Diet Plans</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/dietplans/${dietPlan.dietplan_id}`}>
              {dietPlan.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-8 border-none shadow-none">
        <CardHeader
          className="h-64 bg-cover bg-center border rounded-lg"
          style={{ backgroundImage: `url(${dietPlan.photo || fallbackImage})` }}
        ></CardHeader>

        <CardContent className="p-6 px-0">
          <div className="flex justify-between gap-4">
            <h2 className="text-2xl font-bold">{dietPlan.name}</h2>
            <Toggle
              variant="outline"
              className="w-fit rounded-full"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <HeartIcon
                className={`h-4 w-4 ${
                  isFavorite ? "fill-red-500 text-transparent" : "text-foreground"
                }`}
              />
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
                      {meal.food}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {meal.meal_type}
                    </p>
                  </Button>
                </DialogTrigger>
                <DialogContent className="gap-4 flex flex-col">
                  <DialogHeader
                    className="h-48 bg-cover bg-center border rounded-lg mt-6"
                    style={{
                      backgroundImage: `url(${meal.food_img || fallbackImage})`,
                    }}
                  />
                  <DialogTitle className="text-2xl font-semibold">
                    {meal.food}
                  </DialogTitle>
                  <DialogDescription>{meal.food_desc}</DialogDescription>

                  <DialogDescription className="flex flex-col gap-4 mt-3">
                    <div className="flex flex-col justify-between">
                      <h2 className="font-bold text-md text-foreground">Recipe</h2>
                      <p>{meal.recipe}</p>
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
                          <h2 className="text-foreground" >Carbohydrates</h2>
                          <p>{meal.carbohydrates}g</p>
                        </div>
                        <div className="rounded-lg px-4 py-2 border flex justify-between shadow-sm">
                          <h2 className="text-foreground" >Fats</h2>
                          <p>{meal.fats}g</p>
                        </div>
                        <div className="rounded-lg px-4 py-2 border flex justify-between shadow-sm">
                          <h2 className="text-foreground">Calories</h2>
                          <p>{meal.calories}</p>
                        </div>
                    </div>
                  </DialogDescription>
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
