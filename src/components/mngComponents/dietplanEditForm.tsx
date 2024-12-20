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
import { ArrowLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast"; // Import useToast for notifications
import { Toaster } from "@/components/ui/toaster"; // Import Toaster for displaying notifications
import { Dietplans } from "@/app/(managementSide)/management/dietplans/columns";
import { mutate } from "swr";

// Define the form schema, including photo
const dietplanSchema = zod.object({
  id: zod.string().optional(), // Assuming the ID is auto-generated or optional
  name: zod.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  description: zod.string().min(1, "Description is required").max(100, "Description must be less than 100 characters"),
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
  dietplanData: Dietplans // Pre-filled data for editing
  onClose: () => void; // Close modal function
  mutate: () => void;
}

export default function DietplanEditForm({ dietplanData, onClose }: DietplanEditFormProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null); // Store the selected photo
  const { toast } = useToast(); // Use toast for notifications

  const dietplanForm = useForm<zod.infer<typeof dietplanSchema>>({
    resolver: zodResolver(dietplanSchema),
    defaultValues: {
      id: dietplanData?.dietplan_id ? String(dietplanData.dietplan_id) : "", // Pre-filled data for editing
      name: dietplanData?.name || "",
      description: dietplanData?.description || "",
      fitness_goal: dietplanData?.fitness_goal || "Weight Loss",
      photo: undefined, // Assume the existing photo is not re-uploaded unless changed
    },
  });

  const api = process.env.NEXT_PUBLIC_API_URL;
  const handleDietplanSubmit = async (data: zod.infer<typeof dietplanSchema>) => {
    console.log(data); // Handle updated dietplan data here
    const formData = new FormData();
    if(data.id) {
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('fitness_goal', data.fitness_goal);
      formData.append('program_id', data.id.toString());
    }
   
    if (selectedPhoto) {
      formData.append('photo', selectedPhoto);
    }

    const response = await fetch(`${api}/api/manager/plans/diet`, {
      method: 'PUT',
      body:formData
    })

    const message = await response.json()
    if(message.success) {
       // Show success toast notification
      toast({
        title: "Dietplan Updated",
        description: "Your diet plan has been successfully updated.",
        duration: 3000,
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      mutate(`${api}/api/manager/plans/diet`);
    } else {
      //Display error message here
      toast({
        title: "Dietplan Error",
        description: "Failed to update diet plan.",
        duration: 3000,
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    onClose();
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="border p-2 w-full rounded" />
                  </FormControl>
                  <FormMessage>{dietplanForm.formState.errors.description?.message}</FormMessage>
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

      {/* Toaster component to display toast notifications */}
      <Toaster />
    </div>
  );
}
