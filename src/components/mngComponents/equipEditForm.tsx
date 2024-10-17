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
import { useToast } from "@/hooks/use-toast"; // Import useToast for notifications
import { Toaster } from "@/components/ui/toaster"; // Import Toaster for displaying notifications
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
  const { toast } = useToast(); // Use toast for notifications

  // Initialize the form with validation schema
  const maintenanceForm = useForm<zod.infer<typeof maintenanceSchema>>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      equipment_id, // Pre-fill the equipment ID if available
      maintenance_date: "",
    },
  });
  
   // Handle maintenance form submission
   const handleMaintenanceSubmit = async (data: zod.infer<typeof maintenanceSchema>) => {
    try {
      const response = await fetch(`${api}/api/manager/equipment/maintenance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const message = await response.json();

      if (message.success) {
        // Show success toast
        toast({
          title: "Maintenance Set",
          description: "The maintenance date has been successfully set.",
          duration: 3000,
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        mutate(`${api}/api/manager/equipment`);
      } else {
        // Show error toast
        toast({
          title: "Error",
          description: "Failed to set the maintenance date. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } catch (error) {
      // Show error toast
      toast({
        title: "Error",
        description: "An error occurred while setting the maintenance date.",
        variant: "destructive",
        duration: 3000,
      });
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    onClose(); // Close the modal or form
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

      {/* Toaster component to display toast notifications */}
      <Toaster />
    </div>
  );
}
