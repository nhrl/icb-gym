"use client";

import { useForm } from "react-hook-form";
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
import { ArrowLeftIcon, PlusCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Textarea } from "@/components/ui/textarea";
import { Program } from "./../../app/(managementSide)/management/workouts/columns"; // Import the Program type directly from columns.tsx

// Fitness levels and goals
const fitnessLevels = [
  { label: "Beginner", value: "Beginner" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Advanced", value: "Advanced" },
];

const fitnessGoals = [
  { label: "Weight Loss", value: "Weight Loss" },
  { label: "Muscle Gain", value: "Muscle Gain" },
  { label: "General Health", value: "General Health" },
  { label: "Endurance", value: "Endurance" },
];

interface ProgramEditFormProps {
  onClose: () => void; // Close modal function
  programData: Program; // Use the Program type directly
}

export default function ProgramEditForm({ onClose, programData }: ProgramEditFormProps) {
  const programForm = useForm({
    defaultValues: {
      program_id: programData.program_id, // Pre-filled data
      title: programData.title,
      description: programData.description,
      fitness_level: programData.fitness_level,
      fitness_goal: programData.fitness_goal,
    },
  });

  const handleProgramSubmit = (data: Program) => {
    console.log(data); // Handle updated program data here
    onClose(); // Close the form after submission
  };

  return (
    <div className="text-foreground text-sm rounded-lg w-full h-[fit] sm:h-full p-[64px]">
      <Form {...programForm}>
        <form onSubmit={programForm.handleSubmit(handleProgramSubmit)} className="gap-4 flex flex-col">
          {/* Close Button */}
          <div className="flex w-full items-center">
            <ArrowLeftIcon
              className="h-6 w-6 ml-auto cursor-pointer"
              onClick={onClose} // Trigger the onClose callback to close the modal
            />
          </div>

          <div>
            <FormLabel className="font-bold text-xl font-md">Edit Program</FormLabel>
            <p className="text-muted-foreground text-[12px]">Please edit the program details below</p>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-2">
            {/* Title */}
            <FormField
              control={programForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" className="border p-2 w-full rounded" />
                  </FormControl>
                  <FormMessage>{programForm.formState.errors.title?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={programForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="border p-2 w-full rounded" />
                  </FormControl>
                  <FormMessage>{programForm.formState.errors.description?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Fitness Level */}
            <FormField
              control={programForm.control}
              name="fitness_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fitness Level</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Fitness Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Fitness Levels</SelectLabel>
                          {fitnessLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{programForm.formState.errors.fitness_level?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Fitness Goal */}
            <FormField
              control={programForm.control}
              name="fitness_goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fitness Goal</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Fitness Goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Fitness Goals</SelectLabel>
                          {fitnessGoals.map((goal) => (
                            <SelectItem key={goal.value} value={goal.value}>
                              {goal.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage>{programForm.formState.errors.fitness_goal?.message}</FormMessage>
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
