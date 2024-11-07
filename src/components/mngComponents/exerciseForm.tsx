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
import { TrashIcon, CheckCircleIcon, ArrowLeftIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast"; // Import useToast for notifications
import { Toaster } from "@/components/ui/toaster";

// Define the exercise schema
const exerciseSchema = zod.object({
  exercise_id: zod.string().optional(),
  program_id: zod.number(), // Change program_id to number
  name: zod.string().min(1, "Exercise name is required").max(50, "Exercise name must be less than 50 characters"),
  desc: zod.string().min(1, "Description is required"),
  sets: zod.number().min(1, "Sets are required"),
  reps: zod.number().min(1, "Reps are required"),
  photo: zod.instanceof(File).optional(),
});

interface ExerciseFormProps {
  programId: number; // Program ID is now a number
  onClose: () => void; // Close modal function
}

export default function ExerciseForm({ programId, onClose }: ExerciseFormProps) {
  const { toast } = useToast(); // Use toast for notifications
  const [selectedExercisePhotos, setSelectedExercisePhotos] = useState<string[]>([]);

  // Use form hook for exercises
  const exercisesForm = useForm<zod.infer<typeof exerciseSchema>>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      exercise_id: "",
      program_id: programId,
      name: "",
      desc: "",
      sets: 1,
      reps: 1,
    },
  });

  const api = process.env.NEXT_PUBLIC_API_URL;

  const handleExerciseSubmit = async (data: zod.infer<typeof exerciseSchema>) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("desc", data.desc);
    formData.append("sets", data.sets.toString());
    formData.append("reps", data.reps.toString());
    formData.append("program_id", data.program_id.toString());

    // Append image if exists
    if (data.photo) {
      formData.append("photo", data.photo);
    }

    try {
      const response = await fetch(`${api}/api/manager/plans/workout/exercise`, {
        method: "POST",
        body: formData, // Send as FormData
      });
      const message = await response.json();
      if (message.success) {
        toast({
          title: "Exercise saved!",
          description: "Your exercise has been added successfully.",
          duration: 3000,
        });
        await new Promise((resolve) => setTimeout(resolve, 2000));
        onClose(); // Close modal
      } else {
        console.error("Failed to add exercise", message.error);
      }
    } catch (error) {
      console.error("An error occurred while adding exercise", error);
    }
  };

  const handleExercisePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      exercisesForm.setValue("photo", file);

      // Update the displayed file name for this input
      setSelectedExercisePhotos([file.name]);
    }
  };

  return (
    <div className="bg-background text-foreground text-sm rounded-lg shadow-lg w-full h-[fit] sm:h-full ">
      <Form {...exercisesForm}>
        <form onSubmit={exercisesForm.handleSubmit(handleExerciseSubmit)} className="gap-4 flex flex-col">
          {/* Close Button */}
          <div className="flex w-full items-center">

            <div className="flex flex-col">
              <h2 className="text-xl font-semibold">Add Exercise for Workout Program</h2>
              <p className="text-muted-foreground text-[12px]">Please enter the exercise details below</p>
            </div>
            <ArrowLeftIcon 
              className="h-6 w-6 ml-auto cursor-pointer"
              onClick={onClose} // Trigger the onClose callback to close the modal
            />
          </div>
          {/* Exercise Form Fields */}
          <div className="space-y-4">
            {/* Exercise Photo */}
            <FormField
              control={exercisesForm.control}
              name="photo"
              render={() => (
                <FormItem>
                  <FormLabel>Upload Photo</FormLabel>
                  <FormControl>
                    <div className="relative">
                      {/* Hidden file input */}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleExercisePhotoChange}
                        className="hidden"
                        id="file-input"
                      />
                      {/* Upload Button */}
                      <Button
                        type="button"
                        onClick={() => document.getElementById("file-input")?.click()}
                        className="border p-2 w-full rounded cursor-pointer flex justify-center items-center"
                        variant="outline"
                      >
                        <ArrowUpTrayIcon className="h-3 w-3"/>
                        Upload Photo
                      </Button>
                      {/* Display selected photo name */}
                      {selectedExercisePhotos.length > 0 && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {selectedExercisePhotos[0]}
                        </p>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage>{exercisesForm.formState.errors.photo?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Exercise Name */}
            <FormField
              control={exercisesForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exercise Name</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" className="border p-2 w-full rounded" />
                  </FormControl>
                  <FormMessage>{exercisesForm.formState.errors.name?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={exercisesForm.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="border p-2 w-full rounded" />
                  </FormControl>
                  <FormMessage>{exercisesForm.formState.errors.desc?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Sets and Reps */}
            <div className="flex flex-row gap-2">
              <FormField
                control={exercisesForm.control}
                name="sets"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Sets</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage>{exercisesForm.formState.errors.sets?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={exercisesForm.control}
                name="reps"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Reps</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" className="border p-2 w-full rounded" />
                    </FormControl>
                    <FormMessage>{exercisesForm.formState.errors.reps?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" variant="secondary" className="w-full mt-4">
            <CheckCircleIcon className="h-3 w-3"/>
            Submit Exercise
          </Button>
        </form>
      </Form>
      <Toaster />
    </div>
  );
}
