"use client";

import { useState } from "react";
import React from "react";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { ArrowLeftIcon, ArrowRightIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { Textarea } from "@/components/ui/textarea";

// Define the form schema based on the new Trainers type
const dietplanSchema = zod.object({
  id: zod.string().optional(), // Assuming the ID is auto-generated or optional
  name: zod.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  desc: zod.string().min(1, "Description is required").max(100, "Description must be less than 100 characters"),
  fitness_goal: zod.enum(["Weight Loss", "Muscle Gain", "General Health", "Endurance"], {
    required_error: "Fitness goal is required",
  }),
});

// Fitness goals
const fitnessGoals = [
  { label: "Weight Loss", value: "Weight Loss" },
  { label: "Muscle Gain", value: "Muscle Gain" },
  { label: "General Health", value: "General Health" },
  { label: "Endurance", value: "Endurance" },
];

// Meal form schema
const mealSchema = zod.object({
  mealid: zod.string(),
  dietplan_id: zod.string(),
  meal: zod.string().min(1, "Meal name is required").max(50, "Meal name must be less than 50 characters"),
  food: zod.string().min(1, "Food is required").max(100, "Food must be less than 100 characters"),
  food_desc: zod.string().min(1, "Food description is required"),
  recipe: zod.string().min(1, "Recipe is required"),
  food_prep: zod.string().min(1, "Food preparation is required"),
  protein: zod.number().min(0, "Protein is required"),
  carbs: zod.number().min(0, "Carbs are required"),
  fats: zod.number().min(0, "Fats are required"),
  calories: zod.number().min(0, "Calories are required"),
});

export default function DietplanForm() {
  const [step, setStep] = useState(1); // Step to track which form to show
  const [formKey, setFormKey] = useState(Date.now()); // Unique key for each step

  const dietplanForm = useForm<zod.infer<typeof dietplanSchema>>({
    resolver: zodResolver(dietplanSchema),
    defaultValues: {
      id: "",
      name: "",
      desc: "",
      fitness_goal: "Weight Loss",
    },
  });

  const mealForm = useForm<zod.infer<typeof mealSchema>>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      mealid: "",
      dietplan_id: "",
      meal: "",
      food: "",
      food_desc: "",
      recipe: "",
      food_prep: "",
      protein: 0,
      carbs: 0,
      fats: 0,
      calories: 0,
    },
  });

  const handleDietplanSubmit = (data: zod.infer<typeof dietplanSchema>) => {
    console.log(data); // Handle dietplan data here

    // Reset the meal form with only the dietplan_id passed and a unique key
    mealForm.reset({
      mealid: "",
      dietplan_id: data.id || "", // Carry the dietplan_id into the meal form
      meal: "",
      food: "",
      food_desc: "",
      recipe: "",
      food_prep: "",
      protein: 0,
      carbs: 0,
      fats: 0,
      calories: 0,
    });

    setFormKey(Date.now()); // Update the form key to force a re-render
    setStep(2); // Move to the next form step
  };

  const handleMealSubmit = (data: zod.infer<typeof mealSchema>) => {
    console.log(data); // Handle meal data here
    // You can add logic to submit or store the meal data
  };

  const metadata = {
    title: step === 1 ? "Add New Dietplan" : "Add Meals",
    description: step === 1 ? "Please enter the dietplan details below" : "Please enter the meals below",
  };

  return (
    <div className="bg-background text-foreground text-sm rounded-lg shadow-lg w-full h-[fit] sm:h-full p-[64px] border border-border">
      {step === 1 ? (
        // Dietplan Form
        <Form {...dietplanForm}>
          <form onSubmit={dietplanForm.handleSubmit(handleDietplanSubmit)} className="gap-4 flex flex-col">
            {/* Close Button */}
            <div className="flex w-full items-center">
              <ArrowLeftIcon 
                className="h-6 w-6 ml-auto cursor-pointer"
                onClick={() => window.location.reload()} // Reloads the current page
              />
            </div>

            <div>
              <FormLabel className="font-bold text-xl font-md">{metadata.title}</FormLabel>
              <p className="text-muted-foreground text-[12px]">{metadata.description}</p>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-2">
              {/* Name */}
              <FormField
                control={dietplanForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage>{dietplanForm.formState.errors.name?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={dietplanForm.control}
                name="desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage>{dietplanForm.formState.errors.desc?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Fitness Goal */}
              <FormField
                control={dietplanForm.control}
                name="fitness_goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fitness Goal</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Fitness Goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Fitness Goals</SelectLabel>
                            {fitnessGoals.map((goal) => (
                              <SelectItem key={goal.value} value={goal.value}>
                                {goal.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage>{dietplanForm.formState.errors.fitness_goal?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            {/* Next Button */}
            <div className="items-center gap-4 flex flex-col">
              <Button 
                type="submit"
                className="py-2 px-4 rounded w-full flex flex-row gap-2"
              >
                Next
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        // Meal Form
        <Form {...mealForm} key={formKey}> {/* Use a unique key to force re-render */}
          <form onSubmit={mealForm.handleSubmit(handleMealSubmit)} className="gap-4 flex flex-col">
            {/* Back Button */}
            <div className="flex w-full items-center justify-between">
              <Button 
                variant="ghost"
                onClick={() => setStep(1)}
                className="p-0"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>

            {/* Meal Form Fields */}
            <div>
              <FormLabel className="font-bold text-xl font-md">{metadata.title}</FormLabel>
              <p className="text-muted-foreground text-[12px]">{metadata.description}</p>
            </div>

            <div className="flex flex-col gap-2">
              <FormField
                control={mealForm.control}
                name="meal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meal Name</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage>{mealForm.formState.errors.meal?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={mealForm.control}
                name="food"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Food</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage>{mealForm.formState.errors.food?.message}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={mealForm.control}
                name="food_desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Food Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage>{mealForm.formState.errors.food_desc?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Macronutrients: Two Rows */}
              <div className="flex flex-row gap-2">
                <FormField
                  control={mealForm.control}
                  name="protein"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Protein (g)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" className="border p-2 w-full rounded" />
                      </FormControl>
                      <FormMessage>{mealForm.formState.errors.protein?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={mealForm.control}
                  name="carbs"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Carbs (g)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" className="border p-2 w-full rounded" />
                      </FormControl>
                      <FormMessage>{mealForm.formState.errors.carbs?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-row gap-2">
                <FormField
                  control={mealForm.control}
                  name="fats"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Fats (g)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" className="border p-2 w-full rounded" />
                      </FormControl>
                      <FormMessage>{mealForm.formState.errors.fats?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={mealForm.control}
                  name="calories"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Calories (kcal)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" className="border p-2 w-full rounded" />
                      </FormControl>
                      <FormMessage>{mealForm.formState.errors.calories?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="items-center gap-4 flex flex-col">
              <Button 
                type="submit"
                className="py-2 px-4 rounded w-full flex flex-row gap-2"
              >
                <PlusCircleIcon className="h-4 w-4" />
                Submit Meal
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
