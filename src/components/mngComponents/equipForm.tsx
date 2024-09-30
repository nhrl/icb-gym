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
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast"; // Import useToast

// Define the form schema for Equipment
const equipmentSchema = zod.object({
  equipment_id: zod.string().optional(), // Assuming the ID is auto-generated or optional
  name: zod.string().min(1, "Equipment Name is required").max(50, "Name must be less than 50 characters"),
  quantity: zod.preprocess((val) => Number(val), zod.number().min(1, "Quantity must be at least 1")), // Convert input to number
  purchase_date: zod.string().min(1, "Purchase Date is required"), // For simplicity, using string
});

// Define the form schema for Maintenance
const maintenanceSchema = zod.object({
  maint_id: zod.string().optional(),
  equipment_id: zod.string(),
  maintenance_date: zod.string().min(1, "Maintenance Date is required"), // Using string for simplicity
});

interface EquipmentFormProps {
  onClose: () => void; // Function to close the form modal
}

export default function EquipmentForm({ onClose }: EquipmentFormProps) {
  const [step, setStep] = useState(1); // Step to track which form to show
  const [formKey, setFormKey] = useState(Date.now()); // Unique key for each step

  const { toast } = useToast(); // Use the toast hook from Shadcn

  const equipmentForm = useForm<zod.infer<typeof equipmentSchema>>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      equipment_id: "",
      name: "",
      quantity: 1,
      purchase_date: "",
    },
  });

  const maintenanceForm = useForm<zod.infer<typeof maintenanceSchema>>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      maint_id: "",
      equipment_id: "",
      maintenance_date: "",
    },
  });

  const handleEquipmentSubmit = (data: zod.infer<typeof equipmentSchema>) => {
    console.log(data); // Handle equipment data here

    // Show success toast for equipment submission
    toast({
      title: "Equipment saved!",
      description: "Your equipment details have been saved successfully.",
      duration: 3000,
    });

    // Reset the maintenance form with only the equipment_id passed and a unique key
    maintenanceForm.reset({
      maint_id: "",
      equipment_id: data.equipment_id || "", // Carry the equipment_id into the maintenance form
      maintenance_date: "",
    });

    setFormKey(Date.now()); // Update the form key to force a re-render
    setStep(2); // Move to the next form step
  };

  const handleMaintenanceSubmit = (data: zod.infer<typeof maintenanceSchema>) => {
    console.log(data); // Handle maintenance data here

    // Show success toast for maintenance submission
    toast({
      title: "Maintenance recorded!",
      description: "Your maintenance details have been saved successfully.",
      duration: 3000,
    });
  };

  const metadata = {
    title: step === 1 ? "Add New Equipment" : "Add Maintenance",
    description: step === 1 ? "Please enter the equipment details below" : "Please enter the maintenance details below",
  };

  return (
    <div className="bg-background text-foreground text-sm rounded-lg shadow-lg w-full h-[fit] sm:h-full p-[64px] border border-border">
      {step === 1 ? (
        // Equipment Form
        <Form {...equipmentForm}>
          <form onSubmit={equipmentForm.handleSubmit(handleEquipmentSubmit)} className="gap-4 flex flex-col">
            {/* Close Button */}
            <div className="flex w-full items-center">
              <ArrowLeftIcon 
                className="h-6 w-6 ml-auto cursor-pointer"
                onClick={onClose} // Close modal without page reload
              />
            </div>

            <div>
              <FormLabel className="font-bold text-xl font-md">{metadata.title}</FormLabel>
              <p className="text-muted-foreground text-[12px]">{metadata.description}</p>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-2">
              {/* Equipment Name */}
              <FormField
                control={equipmentForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipment Name</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage>{equipmentForm.formState.errors.name?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Quantity */}
              <FormField
                control={equipmentForm.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage>{equipmentForm.formState.errors.quantity?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Purchase Date */}
              <FormField
                control={equipmentForm.control}
                name="purchase_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage>{equipmentForm.formState.errors.purchase_date?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            {/* Next Button */}
            <div className="items-center gap-4 flex flex-col">
              <Button 
                type="submit"
                className="py-2 px-4 rounded w-full flex flex-row gap-2"
              >
                Next
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        // Maintenance Form
        <Form {...maintenanceForm} key={formKey}> {/* Use a unique key to force re-render */}
          <form onSubmit={maintenanceForm.handleSubmit(handleMaintenanceSubmit)} className="gap-4 flex flex-col">
            {/* Back Button */}
            <div className="flex w-full items-center justify-between">
              <Button 
                variant="ghost"
                onClick={() => setStep(1)}
                className="p-0"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>

            {/* Maintenance Form Fields */}
            <div>
              <FormLabel className="font-bold text-xl font-md">{metadata.title}</FormLabel>
              <p className="text-muted-foreground text-[12px]">{metadata.description}</p>
            </div>

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
                Submit Maintenance
              </Button>
            </div>
          </form>
        </Form>
      )}

      {/* Toaster component to display toast notifications */}
      <Toaster />
    </div>
  );
}
