"use client";

import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HeartIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

// Mock data
const workouts = [
  {
    workout_id: 1,
    title: "Chest Workout for Beginners",
    description:
      "Strengthen your upper body with fundamental chest exercises designed for beginners. Focus on form and endurance to build a solid foundation.",
    fitness_level: "Intermediate",
    fitness_goal: "Endurance",
    photo:
      "https://images.unsplash.com/photo-1584952811368-02328c3e7eb3?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    exercises: [
      {
        exercise_id: 101,
        exercise_name: "Chest Press",
        exercise_description:
          "The chest press targets the pectoralis major, triceps, and anterior deltoids, improving strength and pushing power.",
        sets: 3,
        reps: 10,
        photo:
          "https://www.shutterstock.com/image-illustration/closegrip-barbell-bench-press-3d-600nw-430936051.jpg",
      },
    ],
  },
  {
    workout_id: 2,
    title: "HIIT Cardio Blast",
    description: "High-intensity interval training to boost cardiovascular health.",
    fitness_level: "Advanced",
    fitness_goal: "Weight Loss",
    photo:
      "https://media.istockphoto.com/id/1305548877/photo/active-woman-exercising-in-a-high-intensity-interval-training.jpg?s=1024x1024&w=is&k=20&c=fvHHuPLuc-IGneNBKHIVUx0FsIVkMoa4CvOCTgF93Tc=",
    exercises: [], // No exercises for this workout
  },
];

export default function WorkoutDetailPage() {
  const { workoutId } = useParams(); // Extract workout ID from the URL
  const [isFavorite, setIsFavorite] = useState(false);
  const [workout, setWorkout] = useState<any>(null);

  useEffect(() => {
    const id = Number(workoutId);
    if (isNaN(id)) {
      console.error("Invalid workout ID");
      return;
    }

    const selectedWorkout = workouts.find(
      (workout) => workout.workout_id === id
    );
    setWorkout(selectedWorkout);
  }, [workoutId]);

  if (!workout)
    return (
      <div className="h-screen w-screen text-center">
        <p>No workout found</p>
      </div>
    );

  return (
    <div className="w-full p-12 px-8 sm:px-[180px]">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/programs">Workouts</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/programs/${workout.workout_id}`}>
              {workout.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-8 border-none shadow-none">
        <CardHeader
          className="h-64 bg-cover bg-center border rounded-lg"
          style={{ backgroundImage: `url(${workout.photo})` }}
        ></CardHeader>

        <CardContent className="p-6 px-0">
          <div className="flex justify-between gap-4">
            <h2 className="text-2xl font-bold">{workout.title}</h2>
            <Toggle
              variant="outline"
              className="w-fit rounded-full"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <HeartIcon
                className={`h-4 w-4 ${
                  isFavorite ? "fill-red-500 text-transparent" : "text-foreground"
                }`}
              />
            </Toggle>
          </div>
          <p className="text-lg text-muted-foreground">{workout.description}</p>

          <div className="flex gap-2 mt-6">
            <div className="p-2 px-4 rounded-full bg-background border">
              <p className="text-xs text-foreground">
                {workout.fitness_level}
              </p>
            </div>
            <div className="p-2 px-4 rounded-full bg-foreground text-background border">
              <p className="text-xs">{workout.fitness_goal}</p>
            </div>
          </div>
        </CardContent>

        {/* Exercises */}
        <CardContent className="px-0 flex flex-col gap-4">
          <h1 className="font-bold text-lg">Exercises</h1>
          {workout.exercises.length > 0 ? (
            workout.exercises.map((exercise: any) => (
              <Dialog key={exercise.exercise_id}>
                <DialogTrigger>
                  <Button variant="outline" className="rounded-md w-full flex flex-row justify-between">
                    <div className="flex flex-row items-center">
                      <EyeIcon className="h-4 w-4 mr-2" />
                      {exercise.exercise_name}
                    </div>
                    <div className="flex gap-4">
                      <p className="text-xs text-muted-foreground">
                        Sets: {exercise.sets}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Reps: {exercise.reps}
                      </p>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="gap-4 flex flex-col">
                  <DialogHeader
                    className="h-48 bg-cover bg-center border rounded-lg mt-6"
                    style={{ backgroundImage: `url(${exercise.photo})` }}
                  />
                  <DialogTitle className="text-2xl font-semibold">
                    {exercise.exercise_name}
                  </DialogTitle>
                  <DialogDescription>
                    {exercise.exercise_description}
                  </DialogDescription>

                  <DialogFooter className="flex justify-between gap-4 mt-6">
                    <div className="w-full rounded-lg px-4 py-2 border flex justify-between shadow-lg">
                      <h2>Sets</h2>
                      <p className="text-secondary">{exercise.sets}</p>
                    </div>
                    <div className="w-full rounded-lg px-4 py-2 border flex justify-between shadow-lg">
                      <h2>Reps</h2>
                      <p className="text-secondary">{exercise.reps}</p>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              No exercises added yet
            </p>
          )}

        </CardContent>
        <CardFooter className="p-6"></CardFooter>
      </Card>
    </div>
  );
}
