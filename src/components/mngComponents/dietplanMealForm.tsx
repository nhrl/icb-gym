"use client";

import React from "react";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";

// Define the Zod schema for a single meal
const mealSchema = zod.object({
  meal: zod.enum(["Breakfast", "Lunch", "Dinner"], {
    required_error: "Meal name is required",
  }),
  food: zod.string().nonempty("Dish name is required"),
  food_desc: zod.string().nonempty("Description is required"),
  ingredients: zod.string().nonempty("Ingredients are required"),
  preparation: zod.string().nonempty("Preparation steps are required"),
  protein: zod.number().min(0, "Protein must be at least 0"),
  carbs: zod.number().min(0, "Carbs must be at least 0"),
  fats: zod.number().min(0, "Fats must be at least 0"),
  calories: zod.number().min(0, "Calories must be at least 0"),
});

interface DietPlanMealFormProps {
  dietplanId: number;
  onClose: () => void;
}

export default function DietPlanMealForm({ dietplanId, onClose }: DietPlanMealFormProps) {
  const { toast } = useToast();
  const form = useForm<zod.infer<typeof mealSchema>>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      meal: "Breakfast",
      food: "",
      food_desc: "",
      ingredients: "",
      preparation: "",
      protein: 0,
      carbs: 0,
      fats: 0,
      calories: 0,
    },
  });

  const handleMealSubmit = async (data: zod.infer<typeof mealSchema>) => {
    const api = process.env.NEXT_PUBLIC_API_URL;
    const formattedData = { ...data, dietplanId };

    // Log the form data
    console.log("Form Data:", formattedData);

    try {
      const response = await fetch(`${api}/api/manager/plans/diet/meal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      // Log the response
      console.log("API Response:", response);

      const result = await response.json();
      // Log the result
      console.log("API Result:", result);

      if (result.success) {
        toast({ title: "Success", description: "Meal added successfully." });
        onClose(); // Close the form after submission
      } else {
        toast({ title: "Error", description: "Failed to add meal.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error submitting meal:", error);
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    }
  };

  return (
    <div className="bg-background p-12 border-border border rounded-md shadow-md max-w-lg w-full max-h-[600px] overflow-y-auto">
      <div className="flex flex-col text-sm pb-4">
        <div className="bg-background flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add Meal to Diet Plan</h2>
          <ArrowLeftIcon className="h-6 w-6 cursor-pointer" onClick={onClose} />
        </div>
        <p className=" text-muted-foreground ">Please enter meal details below</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleMealSubmit)} className="flex flex-col gap-4">
          {/* Meal Selection */}
          <FormField control={form.control} name="meal" render={({ field }) => (
            <FormItem>
              <FormLabel>Meal Name</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Meal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Breakfast">Breakfast</SelectItem>
                      <SelectItem value="Lunch">Lunch</SelectItem>
                      <SelectItem value="Dinner">Dinner</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="food" render={({ field }) => (
            <FormItem>
              <FormLabel>Dish</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter name of dish..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="food_desc" render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter description of dish" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="ingredients" render={({ field }) => (
            <FormItem>
              <FormLabel>Ingredients</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter ingredients used..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="preparation" render={({ field }) => (
            <FormItem>
              <FormLabel>Preparation Steps</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter preparation steps..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="flex gap-2">
            <FormField control={form.control} name="protein" render={({ field }) => (
              <FormItem>
                <FormLabel>Protein (g)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="carbs" render={({ field }) => (
              <FormItem>
                <FormLabel>Carbs (g)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="fats" render={({ field }) => (
              <FormItem>
                <FormLabel>Fats (g)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="calories" render={({ field }) => (
              <FormItem>
                <FormLabel>Calories</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <Button type="submit" variant="secondary" className="w-full mt-4">
            <CheckCircleIcon className="h-4 w-4 mr-2" />
            Submit Meal
          </Button>
        </form>
      </Form>

      <Toaster />
    </div>
  );
}
