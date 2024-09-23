"use client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { ArrowLeftIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { Checkbox } from "@/components/ui/checkbox";

// Define the form schema for Assignment
const assignmentSchema = zod.object({
  service_id: zod.string().nonempty("Service is required"),
  time_start: zod.string().nonempty("Start time is required"),
  time_end: zod.string().nonempty("End time is required"),
  schedule: zod.array(zod.string()).nonempty("At least one day must be selected"),
  max_capacity: zod.number().min(1, "Max capacity must be at least 1"),
  rate: zod.number().min(0, "Rate must be a positive number"),
});

// Mock Services Data
const services = [
  { label: "Yoga", value: "1" },
  { label: "Strength Training", value: "2" },
  { label: "Cardio", value: "3" },
  { label: "Pilates", value: "4" },
];

// Days of the Week
const daysOfWeek = [
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
  { label: "Sunday", value: "Sunday" },
];

interface TrainerAssignFormProps {
  trainerId: number;
  onClose: () => void;
}

export default function TrainerAssignForm({ trainerId, onClose }: TrainerAssignFormProps) {
  const form = useForm<zod.infer<typeof assignmentSchema>>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      service_id: "",
      time_start: "",
      time_end: "",
      schedule: [],
      max_capacity: 1,
      rate: 0,
    },
  });

  const handleSubmit = (data: zod.infer<typeof assignmentSchema>) => {
    console.log({ ...data, trainer_id: trainerId }); // Submit with trainerId
    onClose(); // Close modal after submission
  };

  const metadata = {
    title: "Assign Trainer to Service",
    description: "Please assign the trainer to a service by providing the details below",
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
            {/* Service Selection */}
            <FormField
              control={form.control}
              name="service_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Services</SelectLabel>
                          {services.map((service) => (
                            <SelectItem key={service.value} value={service.value}>
                              {service.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{form.formState.errors.service_id?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Time Availability (Start and End) */}
            <div className="flex flex-row gap-2">
              <FormField
                control={form.control}
                name="time_start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input {...field} type="time" className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage>{form.formState.errors.time_start?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time_end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input {...field} type="time" className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage>{form.formState.errors.time_end?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            {/* Schedule (Days of the Week) */}
            <FormField
              control={form.control}
              name="schedule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule (Days)</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {daysOfWeek.map((day) => (
                        <div key={day.value} className="flex items-center gap-2">
                          <Checkbox
                            checked={field.value.includes(day.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, day.value]);
                              } else {
                                field.onChange(field.value.filter((v) => v !== day.value));
                              }
                            }}
                          />
                          <FormLabel className="text-sm">{day.label}</FormLabel>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage>{form.formState.errors.schedule?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Max Capacity */}
            <FormField
              control={form.control}
              name="max_capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Capacity</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" className="border p-2 w-full rounded" />
                  </FormControl>
                  <FormMessage>{form.formState.errors.max_capacity?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Rate */}
            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate ($)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" className="border p-2 w-full rounded" />
                  </FormControl>
                  <FormMessage>{form.formState.errors.rate?.message}</FormMessage>
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="items-center gap-4 flex flex-col">
            <Button type="submit" className="py-2 px-4 rounded w-full flex flex-row gap-2">
              <PlusCircleIcon className="h-4 w-4" />
              Assign Trainer
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
