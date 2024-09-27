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

// Update the Zod schema for Service
const serviceSchema = zod.object({
  id: zod.string().optional(),
  name: zod.string().min(1, "Name is required").max(50, "Name must be less than 50 characters"),
  desc: zod.string().min(1, "Description is required").max(150, "Description must be less than 150 characters"),
  photo: zod.any().optional(), // Allow any type for photo since File is hard to validate with Zod
});

interface ServiceEditFormProps {
  serviceId: number | null;
  serviceData: {
    service_id: string;
    service_name: string;
    desc: string;
    photo?: string; // Assuming photo can be a URL or path
  };
  onClose: () => void;
}

export default function ServiceEditForm({ serviceData, serviceId, onClose }: ServiceEditFormProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);

  const serviceform = useForm<zod.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: serviceData.service_name,
      desc: serviceData.desc,
      photo: undefined,
    },
  });

  // Handle form submission
  const api = process.env.NEXT_PUBLIC_API_URL;
  const handleFormSubmit = async (data: zod.infer<typeof serviceSchema>) => {
    const formData = new FormData();
    if (serviceId !== null) {
      formData.append('id', serviceId.toString());
    }
    formData.append('name', data.name);
    formData.append('desc', data.desc);
    formData.append('photo',data.photo);

    const message = await fetch(`${api}/api/manager/service`, {
      method: 'PUT',
      body:formData
    })
    console.log(message);
    onClose(); 
  };

  // Handle photo selection
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setSelectedPhoto(file);
      serviceform.setValue("photo", file); // Update form's "photo" field
    }
  };

  return (
    <div className="bg-background text-foreground text-sm rounded-lg shadow-lg w-full h-[fit] sm:h-full p-[32px] border border-border">
      <Form {...serviceform}>
        <form onSubmit={serviceform.handleSubmit(handleFormSubmit)} className="gap-4 flex flex-col">
          {/* Close Button */}
          <div className="flex w-full items-center">
            <ArrowLeftIcon
              className="h-6 w-6 ml-auto cursor-pointer"
              onClick={onClose} // Close the modal
            />
          </div>

          <div>
            <FormLabel className="font-bold text-xl font-md">Edit Service</FormLabel>
            <p className="text-muted-foreground text-[12px]">Please update the service details below.</p>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-2">
            <FormField
              control={serviceform.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" className="border p-2 w-full rounded" />
                  </FormControl>
                  <FormMessage>{serviceform.formState.errors.name?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={serviceform.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="border p-2 w-full rounded" />
                  </FormControl>
                  <FormMessage>{serviceform.formState.errors.desc?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={serviceform.control}
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
    </div>
  );
}
