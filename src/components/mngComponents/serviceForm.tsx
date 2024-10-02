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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast"; // Import useToast for notifications
import { Toaster } from "@/components/ui/toaster";
import { mutate } from "swr";

// Define the form schema for adding a new service
const serviceSchema = zod.object({
  name: zod.string().min(1, "Service Name is required").max(50, "Name must be less than 50 characters"),
  desc: zod.string().min(1, "Description is required").max(150, "Description must be less than 150 characters"),
  photo: zod.instanceof(File).optional(), // Optional file input for photo
});

interface ServiceAddFormProps {
  onClose: () => void; // Close modal function
  mutate: () => void;  // Function to refresh data
}

export default function ServiceAddForm({ onClose }: ServiceAddFormProps) {
  const { toast } = useToast(); // Use toast for notifications

  const form = useForm<zod.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      desc: "",
    },
  });

  const api = process.env.NEXT_PUBLIC_API_URL;
  const handleFormSubmit = async (data: zod.infer<typeof serviceSchema>) => {
    // Prepare form data to send to the server
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('desc', data.desc);

    // Only append the photo if it exists
    if (data.photo) {
      formData.append('photo', data.photo); 
    }

    try {
      const response = await fetch(`${api}/api/manager/service`, {
        method: 'POST',
        body: formData,
      });

      const message = await response.json();
      
      if (response.ok) {
        // Show success toast notification
        toast({
          title: "Service Added",
          description: "Your service has been successfully added.",
          duration: 3000,
        });
        // Mutate the service list data to reflect the new changes
        mutate(`${api}/api/manager/service`);
        // Close the form modal
        onClose();
      } else {
        // Display error toast notification
        toast({
          title: "Error Adding Service",
          description: message.message || "Something went wrong.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      // Handle fetch errors
      toast({
        title: "Error",
        description: "An error occurred while adding the service.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      form.setValue("photo", file);
    }
  };

  const metadata = {
    title: "Add New Service",
    description: "Please enter the service details below",
  };

  return (
    <div className="bg-background text-foreground text-sm rounded-lg shadow-lg w-full h-[fit] sm:h-full p-[32px] border border-border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="gap-4 flex flex-col">
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
            {/* Service Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" className="border p-2 w-full rounded" />
                  </FormControl>
                  <FormMessage>{form.formState.errors.name?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="border p-2 w-full rounded" />
                  </FormControl>
                  <FormMessage>{form.formState.errors.desc?.message}</FormMessage>
                </FormItem>
              )}
            />

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
                  <FormMessage>{form.formState.errors.photo?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="items-center gap-4 flex flex-col">
            <Button variant="secondary" type="submit" className="py-2 px-4 rounded w-full flex flex-row gap-2">
              <CheckCircleIcon className="h-4 w-4" />
              Submit Service
            </Button>
          </div>
        </form>
      </Form>

      {/* Toaster component to display toast notifications */}
      <Toaster />
    </div>
  );
}
