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
import { ArrowLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast"; // Import useToast for notifications
import { Toaster } from "@/components/ui/toaster"; // Import Toaster for displaying notifications
import { Textarea } from "@/components/ui/textarea";
import { mutate } from "swr";

// Define the form schema for Trainers
const formSchema = zod.object({
  trainer_id: zod.number().optional(),
  firstname: zod.string().max(25, "First name must be less than 25 characters"),
  lastname: zod.string().max(25, "Last name must be less than 25 characters"),
  email: zod.string().email("Invalid email address"),
  specialty: zod.string().min(1, "specialty is required"),
  availability: zod.enum(["Available", "Full"]),
  profilePicture: zod.instanceof(File).optional(),
});

// Specialities
const specialities = [
  { label: "Yoga", value: "yoga" },
  { label: "Pilates", value: "pilates" },
  { label: "Strength Training", value: "strength_training" },
  { label: "Cardio", value: "cardio" },
];

const availabilities = [
  { label: "Available", value: "Available" },
  { label: "Full", value: "Full" },
];

interface Trainer {
  trainer_id: number;
  firstname: string;
  lastname: string;
  email: string;
  specialty: string;
  availability: "Available" | "Full";
  profilePicture?: string; // Assuming this could be a URL or file path
}

interface TrainerEditFormProps {
  trainerData: Trainer;
  onClose: () => void; // Close modal function
  mutate: () => void;
}

export default function TrainerEditForm({ trainerData, onClose }: TrainerEditFormProps) {
  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trainer_id: trainerData.trainer_id,
      firstname: trainerData.firstname,
      lastname: trainerData.lastname,
      email: trainerData.email,
      specialty: trainerData.specialty,
      availability: trainerData.availability,
    },
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const { toast } = useToast(); // Use toast for notifications

  const api = process.env.NEXT_PUBLIC_API_URL;
  const handleSubmit = async (data: zod.infer<typeof formSchema>) => {
    // Handle form data here
    const formData = new FormData();
    if (data.trainer_id != null) {
      formData.append('id', data.trainer_id.toString());
    }
    formData.append('firstName', data.firstname);
    formData.append('lastName', data.lastname);
    formData.append('email', data.email);
    formData.append('speciality', data.specialty);
    formData.append('availability', data.availability);
    
    if (profilePicture) {
      formData.append('photo',profilePicture);
    }
    const response = await fetch(`${api}/api/manager/trainer`, {
      method: 'PUT',
      body:formData
    })

    const message = await response.json()
    if(message.success) {
      toast({
        title: "Trainer Updated",
        description: "The trainer details have been successfully updated.",
        duration: 3000,
      });
      mutate(`${api}/api/manager/trainer`);
      onClose(); // Close the modal after submission
    } else {
      console.log(message.error);
    }
    
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePicture(e.target.files[0]);
      form.setValue("profilePicture", e.target.files[0]);
    }
  };

  const metadata = {
    title: "Edit Trainer",
    description: "Please edit the trainer's details below",
  };

  return (
    <div className="bg-background text-foreground text-sm rounded-lg shadow-lg w-fit h-[fit] sm:h-full p-[64px] border border-border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="gap-4 flex flex-col">
          {/* Close Button */}
          <div className="flex w-full items-center">
            <ArrowLeftIcon className="h-6 w-6 ml-auto cursor-pointer" onClick={onClose} />
          </div>

          <div>
            <FormLabel className="font-bold text-xl font-md">{metadata.title}</FormLabel>
            <p className="text-muted-foreground text-[12px]">{metadata.description}</p>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              {/* First Name */}
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage>{form.formState.errors.firstname?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage>{form.formState.errors.lastname?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" className="border p-2 w-full rounded" />
                  </FormControl>
                  <FormMessage>{form.formState.errors.email?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* specialty */}
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>specialty</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Specialities</SelectLabel>
                          {specialities.map((specialty) => (
                            <SelectItem key={specialty.value} value={specialty.value}>
                              {specialty.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{form.formState.errors.specialty?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Availability */}
            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Availability</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {availabilities.map((availability) => (
                            <SelectItem key={availability.value} value={availability.value}>
                              {availability.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{form.formState.errors.availability?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Profile Picture Upload */}
            <FormField
              control={form.control}
              name="profilePicture"
              render={() => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="border p-2 w-full rounded cursor-pointer file:rounded-md file:text-sm file:font-regular file:border-0 file:bg-muted file:mr-2 file:text-muted-foreground"
                    />
                  </FormControl>
                  <FormMessage>{form.formState.errors.profilePicture?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="items-center gap-4 flex flex-col">
            <Button variant="secondary" type="submit" className="py-2 px-4 rounded w-full flex flex-row gap-2">
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
