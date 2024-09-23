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
import { ArrowLeftIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { Textarea } from "@/components/ui/textarea";

// Define the form schema for Service
const serviceSchema = zod.object({
  id: zod.string().optional(), // ID is optional if it's auto-generated
  name: zod.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  desc: zod.string().min(1, "Description is required").max(150, "Description must be less than 150 characters"),
});

export default function ServiceEditForm({ serviceId }: { serviceId: string }) {
  const form = useForm<zod.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      id: serviceId || "", // Use passed service ID if available
      name: "",
      desc: "",
    },
  });

  const handleFormSubmit = (data: zod.infer<typeof serviceSchema>) => {
    console.log(data); // Handle service data here
    // Add logic to submit or update the service details in the database
  };

  const metadata = {
    title: "Edit Service",
    description: "Please update the service details below",
  };

  return (
    <div className="bg-background text-foreground text-sm rounded-lg shadow-lg w-full h-[fit] sm:h-full p-[32px] border border-border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="gap-4 flex flex-col">
          {/* Close Button */}
          <div className="flex w-full items-center">
            <ArrowLeftIcon
              className="h-6 w-6 ml-auto cursor-pointer"
              onClick={() => window.location.reload()} // Reloads the current page
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
          </div>

          {/* Submit Button */}
          <div className="items-center gap-4 flex flex-col">
            <Button type="submit" className="py-2 px-4 rounded w-full flex flex-row gap-2">
              <PlusCircleIcon className="h-4 w-4" />
              Update Service
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
