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

interface Workout {
  program_id: number
  title: string
  description: string
  fitness_level: string
  fitness_goal: string
  program_img: string
}

interface Exercise {
  exercise_id: number;
  exercise_name: string;
  exercise_description: string;
  sets: number;
  reps: number;
  exercise_img: string;
}

const fallbackImage = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"; // Fallback image path

export default function WorkoutDetailPage() {
  const { workoutId } = useParams(); // Extract workout ID from the URL
  const [isFavorite, setIsFavorite] = useState(false);
  const [workout, setWorkout] = useState<Workout>();
  const [exercises, setExercises] = useState<Exercise[]>([]); // Exercises state

  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const id = Number(workoutId);
    if (isNaN(id)) {
      console.error("Invalid workout ID");
      return;
    }

    const fetchWorkout = async () => {
      try {
        const response = await fetch(`${api}/api/manager/plans/workout`);
        const data = await response.json();
        const program = Array.isArray(data.program) ? data.program : [];

        // Safely find the workout with the matching program_id
        const selectedWorkout = program.find(
          (workout: Workout) => workout.program_id === id
        );

        if (!selectedWorkout) {
          console.warn("Workout not found");
        } else {
          setWorkout(selectedWorkout);
        }
      } catch (error) {
        console.error("Error fetching program:", error);
      }
    };

    const fetchExercise = async () => {
      try {
        const response = await fetch(`${api}/api/manager/plans/workout/exercise?id=${id}`)
        const data = await response.json();
        setExercises(Array.isArray(data.exercise) ? data.exercise : []);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    }
    fetchWorkout();
    fetchExercise();
  }, [workoutId, api]);

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
            <BreadcrumbLink href={`/programs/${workout.program_id}`}>
              {workout.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-8 border-none shadow-none">
        <CardHeader
          className="h-64 bg-cover bg-center border rounded-lg"
          style={{ backgroundImage: `url(${workout.program_img})` }}
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
          {exercises.length > 0 ? (
            exercises.map((exercise: any) => (
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
                    style={{
                      backgroundImage: `url(${
                        exercise.exercise_img || fallbackImage
                      })`,
                    }}
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
