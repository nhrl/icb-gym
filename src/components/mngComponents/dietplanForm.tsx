"use client";

import { useEffect, useState } from "react";
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
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { mutate } from "swr";

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


interface DietplanFormProps {
  onClose: () => void; // Close modal function
  mutate:() => void;
}

export default function DietplanForm({ onClose }: DietplanFormProps) {
  const [step, setStep] = useState(1); // Step to track which form to show
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null); // Store the selected photo
  const [formKey, setFormKey] = useState(Date.now()); // Unique key for each step
  const [dietplanId, setDietPlanId] = useState<number | null>(null);
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


  const api = process.env.NEXT_PUBLIC_API_URL;

  const handleDietplanSubmit = async (data: zod.infer<typeof dietplanSchema>) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('desc', data.desc);
    formData.append('fitness_goal', data.fitness_goal);
    if (selectedPhoto) {
      console.log("Uploaded Photo:", selectedPhoto); // Handle photo upload
      formData.append('photo', selectedPhoto);
    }

    const response = await fetch(`${api}/api/manager/plans/diet`, {
      method: 'POST',
      body:formData
    })
    
    const message = await response.json();
    if(message.success) {
      const data = message.data;
      setDietPlanId(data.dietplan_id);
      mutate(`${api}/api/manager/plans/diet`);
      toast({
        title: "Diet plan Added",
        description: "New Diet plan successfully added.",
        duration: 3000,
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } else {
      //error message here
      toast({
        title: "Diet plan Error!",
        description: "Failed to add diet plan.",
        duration: 3000,
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    onClose(); // Close modal
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setSelectedPhoto(file);
      dietplanForm.setValue("photo", file); // Set the file in the form data
    }
  };

  useEffect(() => {
    if (dietplanId !== null) {
      console.log("Dietplan ID is set to:", dietplanId); // Log the updated programId
    }
  }, [dietplanId]);

  const metadata = {
    title: step === 1 ? "Add New Dietplan" : "Add Meals",
    description: step === 1 ? "Please enter the dietplan details below" : "Please enter the meals below",
  };

  return (
    <div className="bg-background text-foreground text-sm rounded-lg shadow-lg w-full h-[fit] sm:h-full p-[64px] border border-border">
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
                            {fitnessGoals.map((goal, index) => (
                              <SelectItem key={index} value={goal.value}>
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
                variant="secondary"
              >
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Submit Dietplan
              </Button>
            </div>
          </form>
        </Form>
      {/* Toaster component to display toast notifications */}
      <Toaster />
    </div>
  );
}
