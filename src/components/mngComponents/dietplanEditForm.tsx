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
import { ArrowLeftIcon, PlusCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Textarea } from "@/components/ui/textarea";

// Define the form schema, including photo
const dietplanSchema = zod.object({
  id: zod.string().optional(), // Assuming the ID is auto-generated or optional
  name: zod.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  desc: zod.string().min(1, "Description is required").max(100, "Description must be less than 100 characters"),
  fitness_goal: zod.enum(["Weight Loss", "Muscle Gain", "General Health", "Endurance"], {
    required_error: "Fitness goal is required",
  }),
  photo: zod.instanceof(File).optional(), // Add photo as an optional field
});

// Fitness goals
const fitnessGoals = [
  { label: "Weight Loss", value: "Weight Loss" },
  { label: "Muscle Gain", value: "Muscle Gain" },
  { label: "General Health", value: "General Health" },
  { label: "Endurance", value: "Endurance" },
];

interface DietplanEditFormProps {
  dietplanData: zod.infer<typeof dietplanSchema>; // Pre-filled data for editing
  onClose: () => void; // Close modal function
}

export default function DietplanEditForm({ dietplanData, onClose }: DietplanEditFormProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null); // Store the selected photo

  const dietplanForm = useForm<zod.infer<typeof dietplanSchema>>({
    resolver: zodResolver(dietplanSchema),
    defaultValues: {
      id: dietplanData?.id || "", // Pre-filled data for editing
      name: dietplanData?.name || "",
      desc: dietplanData?.desc || "",
      fitness_goal: dietplanData?.fitness_goal || "Weight Loss",
      photo: undefined, // Assume the existing photo is not re-uploaded unless changed
    },
  });

  const handleDietplanSubmit = (data: zod.infer<typeof dietplanSchema>) => {
    console.log(data); // Handle updated dietplan data here
    if (selectedPhoto) {
      console.log("Uploaded Photo:", selectedPhoto); // Handle updated photo
    }
    // Add the logic to update the diet plan and close the form
    onClose(); // Close the modal after submission
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setSelectedPhoto(file);
      dietplanForm.setValue("photo", file); // Set the new file in the form data
    }
  };

  const metadata = {
    title: "Edit Dietplan",
    description: "Please edit the dietplan details below",
  };

  return (
    <div className="bg-background text-foreground text-sm rounded-lg shadow-lg w-full h-[fit] sm:h-full p-[64px] border border-border">
      {/* Dietplan Form */}
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

          {/* Submit Button */}
          <div className="items-center gap-4 flex flex-col">
            <Button 
              variant="secondary"
              type="submit"
              className="py-2 px-4 rounded w-full flex flex-row gap-2"
            >
              <CheckCircleIcon className="h-4 w-4" />
              Submit Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
