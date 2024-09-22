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
import { PlusCircleIcon } from "@heroicons/react/24/outline";

// Define the form schema for Maintenance
const maintenanceSchema = zod.object({
  equipment_id: zod.string().optional(), // Equipment ID is optional but assumed to be passed in
  maintenance_date: zod.string().min(1, "Maintenance Date is required"), // Using string to capture date input
});

export default function EquipEditForm({ equipment_id }: { equipment_id: string }) {
  // Initialize the form with validation schema
  const maintenanceForm = useForm<zod.infer<typeof maintenanceSchema>>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      equipment_id, // Pre-fill the equipment ID if available
      maintenance_date: "",
    },
  });

  const handleMaintenanceSubmit = (data: zod.infer<typeof maintenanceSchema>) => {
    console.log(data); // Handle the submitted maintenance data here
    // Add logic to send data to the server or handle it in your application
  };

  return (
    <div className="bg-background text-foreground text-sm rounded-lg shadow-lg w-full h-fit sm:h-full p-[32px] border border-border">
      {/* Maintenance Form */}
      <Form {...maintenanceForm}>
        <form onSubmit={maintenanceForm.handleSubmit(handleMaintenanceSubmit)} className="gap-4 flex flex-col">
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
              type="submit"
              className="py-2 px-4 rounded w-full flex flex-row gap-2"
            >
              <PlusCircleIcon className="h-4 w-4" />
              Set Maintenance
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
