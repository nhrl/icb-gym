"use client";

import React, { useState } from "react";
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
  photo: zod.instanceof(File).optional(), // Add photo as an optional file
});

interface DietPlanMealFormProps {
  dietplanId: number;
  onClose: () => void;
}

export default function DietPlanMealForm({ dietplanId, onClose }: DietPlanMealFormProps) {
  const { toast } = useToast();
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null); // Store the selected photo
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
      photo: undefined, // Initialize with no photo
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setSelectedPhoto(file);
      form.setValue("photo", file); // Set the file in the form data
    }
  };

  const handleMealSubmit = async (data: zod.infer<typeof mealSchema>) => {
    const api = process.env.NEXT_PUBLIC_API_URL;
    const formattedData = { ...data, dietplanId };
    const formData = new FormData();
    // Log the form data
    console.log("Form Data:", formattedData);
    // Append each field to the FormData instance
    formData.append("meal", formattedData.meal);
    formData.append("food", formattedData.food);
    formData.append("food_desc", formattedData.food_desc);
    formData.append("ingredients", formattedData.ingredients);
    formData.append("preparation", formattedData.preparation);
    formData.append("protein", formattedData.protein.toString()); 
    formData.append("carbs", formattedData.carbs.toString()); 
    formData.append("fats", formattedData.fats.toString()); 
    formData.append("calories", formattedData.calories.toString()); 
    formData.append("dietplanId", formattedData.dietplanId.toString()); 

    if (selectedPhoto) {
      console.log("Uploaded Photo:", selectedPhoto); // Handle photo upload
      formData.append('photo', selectedPhoto);
    }

    try {
      const response = await fetch(`${api}/api/manager/plans/diet/meal`, {
        method: 'POST',
        body:formData
      });

      const result = await response.json();
      if (result.success) {
        toast({ title: "Success", description: "Meal added successfully." });
        onClose(); // Close the form after submission
      } else {
        toast({ title: "Error", description: "Failed to add meal.", variant: "destructive" });
        console.log(result.error);
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
                  <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="carbs" render={({ field }) => (
              <FormItem>
                <FormLabel>Carbs (g)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="fats" render={({ field }) => (
              <FormItem>
                <FormLabel>Fats (g)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="calories" render={({ field }) => (
              <FormItem>
                <FormLabel>Calories</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value, 10))}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>
            {/* Photo Upload */}
            <FormField
                control={form.control}
                name="photo"
                render={() => (
                  <FormItem>
                    <FormLabel>Photo</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="border p-2 w-full rounded cursor-pointer file:rounded-md file:text-sm file:font-regular file:border-0 file:bg-muted file:mr-2 file:text-muted-foreground"
                      />
                    </FormControl>
                    {selectedPhoto && (
                      <p className="text-muted-foreground text-[12px]">
                        Selected photo: {selectedPhoto.name}
                      </p>
                    )}
                    <FormMessage>{form.formState.errors.photo?.message}</FormMessage>
                  </FormItem>
                )}
            />

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