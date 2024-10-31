"use client";

import { useState, useEffect } from "react";
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
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { mutate } from "swr";

// Define the form schema for adding a new progress entry
const progressSchema = zod.object({
  week: zod
    .preprocess((val) => Number(val), zod.number().min(1, "Week number is required")),
  desc: zod.string().min(1, "Description is required").max(150, "Description must be less than 150 characters"),
  workout_count: zod
    .preprocess((val) => Number(val), zod.number().min(0, "Workout count is required")),
  weight: zod
    .preprocess((val) => Number(val), zod.number().min(1, "Weight is required")),
  bodyfat_percentage: zod
    .preprocess((val) => Number(val), zod.number().min(0, "Bodyfat percentage is required")),
  date_added: zod.string().optional(),
  photo: zod.instanceof(File).optional(),
});

interface ProgressAddFormProps {
  onClose: () => void;
  onAdd: (data: zod.infer<typeof progressSchema>) => void;
  previousWeek?: number; // Pass the last week's number if available
}

export default function ProgressAddForm({ onClose, onAdd, previousWeek = 0 }: ProgressAddFormProps) {
  const { toast } = useToast();

  const form = useForm<zod.infer<typeof progressSchema>>({
    resolver: zodResolver(progressSchema),
    defaultValues: {
      week: previousWeek + 1, // Automatically set to next week
      desc: "",
      workout_count: undefined,
      weight: undefined,
      bodyfat_percentage: undefined,
    },
  });

  const api = process.env.NEXT_PUBLIC_API_URL;

  const handleFormSubmit = async (data: zod.infer<typeof progressSchema>) => {
    const formData = new FormData();
    formData.append("week", data.week.toString());
    formData.append("desc", data.desc);
    formData.append("workout_count", data.workout_count.toString());
    formData.append("weight", data.weight.toString());
    formData.append("bodyfat_percentage", data.bodyfat_percentage.toString());
    formData.append("date_added", new Date().toISOString());

    if (data.photo) {
      formData.append("photo", data.photo);
    }

    try {
      const response = await fetch(`${api}/api/manager/progress`, {
        method: "POST",
        body: formData,
      });

      const message = await response.json();

      if (message.success) {
        toastSuccess();
        onAdd(data);
        mutate(`${api}/api/manager/progress`);
      } else {
        toastError(message.message || "Something went wrong.");
      }
    } catch (error) {
      toastError("An error occurred while adding the progress entry.");
    }
    onClose();
  };

  const toastSuccess = () => {
    toast({
      title: "Progress Added",
      description: "Your progress entry has been successfully added.",
      duration: 3000,
    });
  };

  const toastError = (description: string) => {
    toast({
      title: "Error",
      description,
      variant: "destructive",
      duration: 3000,
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      form.setValue("photo", file);
    }
  };

  const metadata = {
    title: "Add New Progress Entry",
    description: "Please enter the progress details below",
  };

  return (
    <div className="bg-background text-foreground text-sm rounded-lg w-full h-[fit] sm:h-full max-h-[90vh] overflow-y-auto p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="gap-4 flex flex-col">
          <div>
            <FormLabel className="font-bold text-xl font-md">{metadata.title}</FormLabel>
            <p className="text-muted-foreground text-[12px]">{metadata.description}</p>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-2">
            {/* Week Number (Auto-generated, Readonly) */}
            <FormField
              control={form.control}
              name="week"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Week Number</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" className="border p-2 w-fit rounded" readOnly />
                  </FormControl>
                  <FormMessage>{form.formState.errors.week?.message}</FormMessage>
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

            {/* Workout Count */}
            <FormField
              control={form.control}
              name="workout_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workout Count</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" className="border p-2 w-full rounded" />
                  </FormControl>
                  <FormMessage>{form.formState.errors.workout_count?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Weight and Bodyfat Percentage in One Row */}
            <div className="flex flex-row gap-4">
              {/* Weight */}
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage>{form.formState.errors.weight?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Bodyfat Percentage */}
              <FormField
                control={form.control}
                name="bodyfat_percentage"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Bodyfat Percentage %</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage>{form.formState.errors.bodyfat_percentage?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            {/* Photo Upload */}
            <FormField
              control={form.control}
              name="photo"
              render={() => (
                <FormItem>
                  <FormLabel>Progress Photo</FormLabel>
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
              Submit Progress
            </Button>
          </div>
        </form>
      </Form>

      {/* Toaster component to display toast notifications */}
      <Toaster />
    </div>
  );
}
