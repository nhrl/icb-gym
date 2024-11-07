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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast"; // Import useToast for notifications
import { Toaster } from "@/components/ui/toaster";
import { mutate } from "swr";

// Define the form schema for Program with required photo
const programSchema = zod.object({
  program_id: zod.string().optional(), // Assuming the ID is auto-generated or optional
  title: zod.string().min(1, "Title is required").max(50, "Title must be less than 50 characters"),
  desc: zod.string().min(1, "Description is required").max(100, "Description must be less than 100 characters"),
  fitness_level: zod.enum(["Beginner", "Intermediate", "Advanced"], {
    required_error: "Fitness level is required",
  }),
  fitness_goal: zod.enum(["Weight Loss", "Muscle Gain", "General Health", "Endurance"], {
    required_error: "Fitness goal is required",
  }),
  photo: zod.instanceof(File, { message: "Photo is required" }), // Required photo field
});

interface ProgramFormProps {
  onClose: () => void; // Close modal function
  mutate: () => void;
}

export default function ProgramForm({ onClose }: ProgramFormProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null); // Store the selected photo
  const { toast } = useToast(); // Use toast for notifications
  const api = process.env.NEXT_PUBLIC_API_URL;

  const programForm = useForm<zod.infer<typeof programSchema>>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      program_id: "",
      title: "",
      desc: "",
      fitness_level: "Beginner",
      fitness_goal: "Weight Loss",
      photo: undefined,
    },
  });

  const handleProgramSubmit = async (data: zod.infer<typeof programSchema>) => {
    console.log(data); // Handle program data here
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('desc', data.desc);
    formData.append('fitness_goal', data.fitness_goal);
    formData.append('fitness_level', data.fitness_level);

    if (data.photo) {
      formData.append('photo', data.photo);
    }

    const response = await fetch(`${api}/api/manager/plans/workout`, {
      method: 'POST',
      body: formData
    });

    const message = await response.json();
    if (message.success) {
      mutate(`${api}/api/manager/plans/workout`);
      toast({
        title: "Program Saved!",
        description: "Your workout program has been saved successfully.",
        duration: 3000,
      });
      onClose(); // Close modal after success
    } else {
      toast({
        title: "Program Error!",
        description: "Failed to save program.",
        duration: 3000,
      });
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setSelectedPhoto(file);
      programForm.setValue("photo", file); // Set the file in the form data
    }
  };

  return (
    <div className="bg-background text-foreground text-sm rounded-lg shadow-lg w-full h-[fit] sm:h-full p-[64px] border border-border">
      {/* Program Form */}
      <Form {...programForm}>
        <form onSubmit={programForm.handleSubmit(handleProgramSubmit)} className="gap-4 flex flex-col">
          {/* Close Button */}
          <div className="flex w-full items-center">
            <ArrowLeftIcon 
              className="h-6 w-6 ml-auto cursor-pointer"
              onClick={onClose} // Trigger the onClose callback to close the modal
            />
          </div>

          <div>
            <FormLabel className="font-bold text-xl font-md">Add New Program</FormLabel>
            <p className="text-muted-foreground text-[12px]">Please enter the program details below</p>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-2">
            {/* Title */}
            <FormField
              control={programForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" className="border p-2 w-full rounded" />
                  </FormControl>
                  <FormMessage>{programForm.formState.errors.title?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={programForm.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="border p-2 w-full rounded" />
                  </FormControl>
                  <FormMessage>{programForm.formState.errors.desc?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Fitness Level */}
            <FormField
              control={programForm.control}
              name="fitness_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fitness Level</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Fitness Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {["Beginner", "Intermediate", "Advanced"].map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{programForm.formState.errors.fitness_level?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Fitness Goal */}
            <FormField
              control={programForm.control}
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
                          {["Weight Loss", "Muscle Gain", "General Health", "Endurance"].map((goal) => (
                            <SelectItem key={goal} value={goal}>
                              {goal}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{programForm.formState.errors.fitness_goal?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Photo Upload */}
            <FormField
              control={programForm.control}
              name="photo"
              render={() => (
                <FormItem>
                  <FormLabel>Upload Photo</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="border p-2 w-full rounded cursor-pointer file:rounded-md file:text-sm file:font-regular file:border-0 file:bg-muted file:mr-2 file:text-muted-foreground"
                    />
                  </FormControl>
                  {selectedPhoto && (
                    <p className="text-muted-foreground text-[12px]">Selected photo: {selectedPhoto.name}</p>
                  )}
                  <FormMessage>{programForm.formState.errors.photo?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="items-center gap-4 flex flex-col">
            <Button 
              type="submit"
              className="py-2 px-4 rounded w-full flex flex-row gap-2"
              variant="secondary"
            >
              <CheckCircleIcon className="h-4 w-4" />
              Submit Workout Program
            </Button>
          </div>
        </form>
      </Form>

      {/* Toaster component to display toast notifications */}
      <Toaster />
    </div>
  );
}
