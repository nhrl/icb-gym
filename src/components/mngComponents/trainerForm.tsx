"use client";
import React, { useState } from "react";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormMessage, 
  FormLabel, 
  FormControl 
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
import { useToast } from "@/hooks/use-toast"; // Import useToast for notifications
import { Toaster } from "@/components/ui/toaster"; // Import Toaster for displaying notifications
import { mutate } from "swr";

// Define the form schema for Trainers
const formSchema = zod.object({
  firstName: zod.string().max(25, "First name must be less than 25 characters"),
  lastName: zod.string().max(25, "Last name must be less than 25 characters"),
  email: zod.string().email("Invalid email address"),
  speciality: zod.string().min(1, "Speciality is required"),
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

interface TrainerFormProps {
  onClose: () => void; // Close modal function
  mutate: () => void;
}

export default function TrainerForm({ onClose }: TrainerFormProps) {
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const { toast } = useToast(); // Use toast for notifications

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      speciality: "",
      availability: "Available",
    },
  });

  const api = process.env.NEXT_PUBLIC_API_URL;
  const handleSubmit = async (data: zod.infer<typeof formSchema>) => {
    console.log(data);
    const formData = new FormData();

    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('speciality', data.speciality);
    formData.append('availability', data.availability);
    if (profilePicture) {
      formData.append('photo',profilePicture);
    }

    const response = await fetch(`${api}/api/manager/trainer`, {
      method: 'POST',
      body:formData
    })

    const message = await response.json();
    if(message.success) {
      console.log(message.message);
      // Show success toast notification
      toast({
        title: "Trainer Added",
        description: "The new trainer has been successfully added.",
        duration: 3000,
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      mutate(`${api}/api/manager/trainer`);
    } else {
      toast({
        title: "Trainer Add Error",
        description: "Failed to add new trainer.",
        duration: 3000,
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    onClose();
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const metadata = {
    title: "Add New Trainer",
    description: "Please enter the trainer's details below",
  };

  return (
    <div className="bg-background text-foreground text-sm rounded-lg shadow-lg w-fit h-[fit] sm:h-full p-[64px] border border-border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="gap-4 flex flex-col">
          
          {/* Close Button */}
          <div className="flex w-full items-center">
            <ArrowLeftIcon 
              className="h-6 w-6 ml-auto cursor-pointer"
              onClick={onClose} // Trigger the onClose callback when clicked
            />
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
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage>{form.formState.errors.firstName?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage>{form.formState.errors.lastName?.message}</FormMessage>
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

            {/* Speciality */}
            <FormField
              control={form.control}
              name="speciality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Speciality</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Speciality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Specialities</SelectLabel>
                          {specialities.map((speciality) => (
                            <SelectItem key={speciality.value} value={speciality.value}>
                              {speciality.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{form.formState.errors.speciality?.message}</FormMessage>
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
            <Button 
              variant="secondary"
              type="submit" 
              className="py-2 px-4 rounded w-full flex flex-row gap-2"
            >
              <CheckCircleIcon className="h-4 w-4" />
              Submit New Trainer
            </Button>
          </div>
        </form>
      </Form>

      {/* Toaster component to display toast notifications */}
      <Toaster />
    </div>
  );
}
