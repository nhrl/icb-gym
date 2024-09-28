"use client";

import { useState } from "react";
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
import { PlusCircleIcon, ArrowLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { mutate } from "swr";

// Define the form schema for Maintenance
const maintenanceSchema = zod.object({
  equipment_id: zod.string().optional(), // Equipment ID is optional but assumed to be passed in
  maintenance_date: zod.string().min(1, "Maintenance Date is required"), // Using string to capture date input
});

interface EquipEditFormProps {
  equipment_id: string;
  onClose: () => void; // Function to handle back or close action
  mutate: () => void;
}


const api = process.env.NEXT_PUBLIC_API_URL;
export default function EquipEditForm({ equipment_id, onClose }: EquipEditFormProps) {
  // Initialize the form with validation schema
  const maintenanceForm = useForm<zod.infer<typeof maintenanceSchema>>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      equipment_id, // Pre-fill the equipment ID if available
      maintenance_date: "",
    },
  });

  const handleMaintenanceSubmit = async (data: zod.infer<typeof maintenanceSchema>) => {
    // Handle the submitted maintenance data here
    // Add logic to send data to the server or handle it in your application
    const response = await fetch(`${api}/api/manager/equipment/maintenance`, { // Replace with your API endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Sending data as JSON
      },
      body: JSON.stringify(data), // Convert the form data to JSON
    });
    const message = await response.json();
    if(message.success) {
      mutate(`${api}/api/manager/equipment`);
    } else {
      //display error here
    }
    onClose();
  };

  return (
    <div className="bg-background text-foreground text-sm rounded-lg shadow-lg w-full h-fit sm:h-full p-[32px] border border-border">
      {/* Maintenance Form */}
      <Form {...maintenanceForm}>
        <form onSubmit={maintenanceForm.handleSubmit(handleMaintenanceSubmit)} className="gap-4 flex flex-col">
          
          {/* Back Button */}
          <div className="flex w-full items-center">
            <Button
              variant="ghost"
              onClick={onClose} // Use the onClose function to handle back or close
              className="p-0"
            >
              <ArrowLeftIcon className="h-6 w-6 mr-2" />
              Back
            </Button>
          </div>

          <div>
            <FormLabel className="font-bold text-xl">Set Maintenance Date</FormLabel>
            <p className="text-muted-foreground text-[12px]">Please set the maintenance date for this equipment.</p>
          </div>

          {/* Maintenance Form Fields */}
          <div className="flex flex-col gap-2">
            <FormField
              control={maintenanceForm.control}
              name="maintenance_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maintenance Date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" className="border p-2 w-full rounded" />
                  </FormControl>
                  <FormMessage>{maintenanceForm.formState.errors.maintenance_date?.message}</FormMessage>
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
              Set Maintenance
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
