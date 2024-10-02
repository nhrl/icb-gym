"use client";

import { useState } from "react";
import React from "react";
import * as zod from "zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PlusCircleIcon,
  TrashIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast"; // Import useToast

// Define the form schema including photo
const dietplanSchema = zod.object({
  id: zod.string().optional(), // Assuming the ID is auto-generated or optional
  name: zod.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  desc: zod.string().min(1, "Description is required").max(100, "Description must be less than 100 characters"),
  fitness_goal: zod.enum(["Weight Loss", "Muscle Gain", "General Health", "Endurance"], {
    required_error: "Fitness goal is required",
  }),
  photo: zod.instanceof(File).optional(), // Add photo as an optional file
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

interface DietplanFormProps {
  onClose: () => void; // Close modal function
}

export default function DietplanForm({ onClose }: DietplanFormProps) {
  const [step, setStep] = useState(1); // Step to track which form to show
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null); // Store the selected photo
  const [formKey, setFormKey] = useState(Date.now()); // Unique key for each step

  const { toast } = useToast(); // Use the toast hook from shadcn

  const dietplanForm = useForm<zod.infer<typeof dietplanSchema>>({
    resolver: zodResolver(dietplanSchema),
    defaultValues: {
      id: "",
      name: "",
      desc: "",
      fitness_goal: "Weight Loss",
      photo: undefined, // Initialize with no photo
    },
  });

  const mealForm = useForm<{
    meals: zod.infer<typeof mealSchema>[];
  }>({
    resolver: zodResolver(zod.object({ meals: zod.array(mealSchema) })),
    defaultValues: {
      meals: [
        {
          mealid: "",
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
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: mealForm.control,
    name: "meals",
  });

  const handleDietplanSubmit = (data: zod.infer<typeof dietplanSchema>) => {
    console.log(data); // Handle dietplan data here
    if (selectedPhoto) {
      console.log("Uploaded Photo:", selectedPhoto); // Handle photo upload
    }
    toast({
      title: "Diet plan saved!",
      description: "Your diet plan details have been saved successfully.",
      duration: 3000,
    });
    setStep(2); // Move to the next form step
  };

  const handleMealSubmit = (data: { meals: zod.infer<typeof mealSchema>[] }) => {
    console.log(data); // Handle meal data here
    toast({
      title: "Meals submitted!",
      description: "Your meals have been submitted successfully.",
      duration: 3000,
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setSelectedPhoto(file);
      dietplanForm.setValue("photo", file); // Set the file in the form data
    }
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
                onClick={onClose} // Trigger the onClose callback to close the modal
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

              {/* Photo Upload */}
              <FormField
                control={dietplanForm.control}
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
                    <FormMessage>{dietplanForm.formState.errors.photo?.message}</FormMessage>
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

            <div className="overflow-auto max-h-[400px]">
              {fields.map((field, index) => (
                <div key={field.id} className="flex flex-col gap-2 border p-4 rounded-md mb-2">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">Meal {index + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      className="p-2"
                      onClick={() => remove(index)}
                    >
                    <TrashIcon className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                  {/* Meal Name */}
                  <FormField
                    control={mealForm.control}
                    name={`meals.${index}.meal`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meal Name</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" className="border p-2 w-full rounded" />
                        </FormControl>
                        <FormMessage>{mealForm.formState.errors.meals?.[index]?.meal?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  
                  {/* Recipe */}
                  <FormField
                    control={mealForm.control}
                    name={`meals.${index}.recipe`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipe</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="border p-2 w-full rounded" placeholder="Enter the recipe..." />
                        </FormControl>
                        <FormMessage>{mealForm.formState.errors.meals?.[index]?.recipe?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  {/* Preparation */}
                  <FormField
                    control={mealForm.control}
                    name={`meals.${index}.food_prep`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preparation</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="border p-2 w-full rounded" placeholder="Enter the preparation steps..." />
                        </FormControl>
                        <FormMessage>{mealForm.formState.errors.meals?.[index]?.food_prep?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  {/* Other fields */}
                  <div className="flex flex-row gap-2">
                    <FormField
                      control={mealForm.control}
                      name={`meals.${index}.food`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Food</FormLabel>
                          <FormControl>
                            <Input {...field} type="text" className="border p-2 w-full rounded" />
                          </FormControl>
                          <FormMessage>{mealForm.formState.errors.meals?.[index]?.food?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={mealForm.control}
                      name={`meals.${index}.protein`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Protein (g)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" className="border p-2 w-full rounded" />
                          </FormControl>
                          <FormMessage>{mealForm.formState.errors.meals?.[index]?.protein?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={mealForm.control}
                      name={`meals.${index}.carbs`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Carbs (g)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" className="border p-2 w-full rounded" />
                          </FormControl>
                          <FormMessage>{mealForm.formState.errors.meals?.[index]?.carbs?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-row gap-2">
                    <FormField
                      control={mealForm.control}
                      name={`meals.${index}.fats`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Fats (g)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" className="border p-2 w-full rounded" />
                          </FormControl>
                          <FormMessage>{mealForm.formState.errors.meals?.[index]?.fats?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={mealForm.control}
                      name={`meals.${index}.calories`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Calories (kcal)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" className="border p-2 w-full rounded" />
                          </FormControl>
                          <FormMessage>{mealForm.formState.errors.meals?.[index]?.calories?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add Another Meal Button */}
            <Button
              type="button"
              variant="outline"
              className="mt-2"
              onClick={() => append({
                mealid: "",
                meal: "",
                food: "",
                food_desc: "",
                recipe: "",
                food_prep: "",
                protein: 0,
                carbs: 0,
                fats: 0,
                calories: 0,
              })}
            >
              <PlusCircleIcon className="h-4 w-4 mr-2" />
              Add Another Meal
            </Button>

            {/* Submit Button */}
            <div className="items-center gap-4 flex flex-col mt-4">
              <Button 
                variant="secondary"
                type="submit"
                className="py-2 px-4 rounded w-full flex flex-row gap-2"
              >
                <CheckCircleIcon className="h-4 w-4" />
                Submit Diet Plan
              </Button>
            </div>
          </form>
        </Form>
      )}

      {/* Toaster component to display toast notifications */}
      <Toaster />
    </div>
  );
}
