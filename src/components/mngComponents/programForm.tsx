"use client";

import { useState } from "react";
import React from "react";
import * as zod from "zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { ArrowLeftIcon, ArrowRightIcon, PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/outline";
import { Textarea } from "@/components/ui/textarea";

// Define the form schema for Program
const programSchema = zod.object({
  program_id: zod.string().optional(), // Assuming the ID is auto-generated or optional
  title: zod.string().min(1, "Title is required").max(50, "Title must be less than 50 characters"),
  desc: zod.string().min(1, "Description is required").max(100, "Description must be less than 100 characters"),
  fitness_level: zod.enum(["Beginner", "Intermediate", "Advanced"], {
    required_error: "Fitness level is required",
  }),
  fitness_goal: zod.enum(["Weight Loss", "Muscle Gain", "General Health", "Endurance"], {
    required_error: "Fitness goal is required",
  }),
});

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

// Exercise form schema
const exerciseSchema = zod.object({
  exercise_id: zod.string().optional(),
  program_id: zod.string(),
  name: zod.string().min(1, "Exercise name is required").max(50, "Exercise name must be less than 50 characters"),
  desc: zod.string().min(1, "Description is required"),
  sets: zod.number().min(1, "Sets are required"),
  reps: zod.number().min(1, "Reps are required"),
});

export default function ProgramForm() {
  const [step, setStep] = useState(1); // Step to track which form to show
  const [programData, setProgramData] = useState<zod.infer<typeof programSchema> | null>(null); // Store program data

  const programForm = useForm<zod.infer<typeof programSchema>>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      program_id: "",
      title: "",
      desc: "",
      fitness_level: "Beginner",
      fitness_goal: "Weight Loss",
    },
  });

  const exercisesForm = useForm<{
    exercises: zod.infer<typeof exerciseSchema>[];
  }>({
    resolver: zodResolver(zod.object({
      exercises: zod.array(exerciseSchema),
    })),
    defaultValues: {
      exercises: [{ exercise_id: "", program_id: "", name: "", desc: "", sets: 1, reps: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: exercisesForm.control,
    name: "exercises",
  });

  const handleProgramSubmit = (data: zod.infer<typeof programSchema>) => {
    console.log(data); // Handle program data here
    setProgramData(data); // Store program data
    setStep(2); // Move to the next form step
  };

  const handleExerciseSubmit = (data: { exercises: zod.infer<typeof exerciseSchema>[] }) => {
    console.log({ programData, exercises: data.exercises }); // Submit both program and exercises
  };

  const metadata = {
    title: step === 1 ? "Add New Program" : "Add Exercises",
    description: step === 1 ? "Please enter the program details below" : "Please enter the exercises below",
  };

  return (
    <div className="bg-background text-foreground text-sm rounded-lg shadow-lg w-full h-[fit] sm:h-full p-[64px] border border-border">
      {step === 1 ? (
        // Program Form
        <Form {...programForm}>
          <form onSubmit={programForm.handleSubmit(handleProgramSubmit)} className="gap-4 flex flex-col">
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
                name="desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage>{programForm.formState.errors.desc?.message}</FormMessage>
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
        // Exercises Form
        <Form {...exercisesForm}>
          <form onSubmit={exercisesForm.handleSubmit(handleExerciseSubmit)} className="gap-4 flex flex-col">
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

            {/* Exercise Form Fields */}
            <div>
              <FormLabel className="font-bold text-xl font-md">{metadata.title}</FormLabel>
              <p className="text-muted-foreground text-[12px]">{metadata.description}</p>
            </div>

            {/* Scrollable Container for Exercises */}
            <div className="max-h-[400px] overflow-y-auto space-y-4">
              {/* Render dynamic exercise forms */}
              {fields.map((field, index) => (
                <div key={field.id} className="flex flex-col gap-2 border p-2 rounded-md">
                  <FormField
                    control={exercisesForm.control}
                    name={`exercises.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exercise Name</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" className="border p-2 w-full rounded" />
                        </FormControl>
                        <FormMessage>{exercisesForm.formState.errors.exercises?.[index]?.name?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={exercisesForm.control}
                    name={`exercises.${index}.desc`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="border p-2 w-full rounded" />
                        </FormControl>
                        <FormMessage>{exercisesForm.formState.errors.exercises?.[index]?.desc?.message}</FormMessage>
                      </FormItem>
                    )}
                  />

                  {/* Sets and Reps */}
                  <div className="flex flex-row gap-2">
                    <FormField
                      control={exercisesForm.control}
                      name={`exercises.${index}.sets`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Sets</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" className="border p-2 w-full rounded" />
                          </FormControl>
                          <FormMessage>{exercisesForm.formState.errors.exercises?.[index]?.sets?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={exercisesForm.control}
                      name={`exercises.${index}.reps`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Reps</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" className="border p-2 w-full rounded" />
                          </FormControl>
                          <FormMessage>{exercisesForm.formState.errors.exercises?.[index]?.reps?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Remove Button */}
                  <Button variant="destructive" onClick={() => remove(index)} className="mt-2">
                    <MinusCircleIcon className="h-4 w-4 mr-2" />
                    Remove Exercise
                  </Button>
                </div>
              ))}
            </div>

            {/* Add More Exercises Button */}
            <Button 
              variant="outline"
              onClick={() => append({ exercise_id: "", program_id: programData?.program_id || "", name: "", desc: "", sets: 1, reps: 1 })}
              className="mt-4"
            >
              <PlusCircleIcon className="h-4 w-4 mr-2" />
              Add Another Exercise
            </Button>

            {/* Submit All Exercises Button */}
            <div className="items-center gap-4 flex flex-col mt-4">
              <Button 
                type="submit"
                className="py-2 px-4 rounded w-full flex flex-row gap-2"
              >
                <PlusCircleIcon className="h-4 w-4" />
                Submit All Exercises
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
