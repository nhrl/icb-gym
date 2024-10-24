"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MagnifyingGlassIcon, HeartIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { RiAsterisk } from 'react-icons/ri';
import { Toggle } from '@/components/ui/toggle';

// Mock workout data based on the schema
const workouts = [
  {
    workout_id: 1,
    title: "Chest Workout for Beginners",
    description: "Strengthen your upper body with fundamental chest exercises designed for beginners. Focus on form and endurance to build a solid foundation.",
    fitness_level: "Intermediate",
    fitness_goal: "Endurance",
    photo: "https://images.unsplash.com/photo-1584952811368-02328c3e7eb3?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    workout_id: 2,
    title: "HIIT Cardio Blast",
    description: "High-intensity interval training to boost your cardiovascular health and burn calories fast. Perfect for weight loss and improving stamina.",
    fitness_level: "Advanced",
    fitness_goal: "Weight Loss",
    photo: "https://media.istockphoto.com/id/1305548877/photo/active-woman-exercising-in-a-high-intensity-interval-training.jpg?s=1024x1024&w=is&k=20&c=fvHHuPLuc-IGneNBKHIVUx0FsIVkMoa4CvOCTgF93Tc=",
  },
  {
    workout_id: 3,
    title: "Yoga for Relaxation",
    description: "Improve flexibility and reduce stress through guided yoga sessions focusing on breathing and light movement.",
    fitness_level: "Beginner",
    fitness_goal: "General Health",
    photo: "https://plus.unsplash.com/premium_photo-1661777196224-bfda51e61cfd?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    workout_id: 4,
    title: "Full Body Strength Training",
    description: "A well-rounded strength program focusing on all major muscle groups to build muscle mass and increase endurance.",
    fitness_level: "Intermediate",
    fitness_goal: "Muscle Gain",
    photo: "https://images.unsplash.com/photo-1579758629930-df7c9d918f30?q=80&w=1774&auto=format&fit=crop",
  },
  {
    workout_id: 5,
    title: "Pilates Core Strength",
    description: "Enhance your core strength with Pilates. This session focuses on controlled movements to improve posture and stability.",
    fitness_level: "Beginner",
    fitness_goal: "General Health",
    photo: "https://images.unsplash.com/photo-1617646235486-aab1f3672ad9?q=80&w=1774&auto=format&fit=crop",
  },
  {
    workout_id: 6,
    title: "Leg Day Power Workout",
    description: "Target your legs with squats, lunges, and deadlifts to build strength and muscle mass in your lower body.",
    fitness_level: "Advanced",
    fitness_goal: "Muscle Gain",
    photo: "https://images.unsplash.com/photo-1605296477215-7993f4c62a16?q=80&w=1774&auto=format&fit=crop",
  },
  {
    workout_id: 7,
    title: "Morning Stretch Routine",
    description: "Kick-start your day with this quick and gentle stretching routine to enhance flexibility and improve circulation.",
    fitness_level: "Beginner",
    fitness_goal: "General Health",
    photo: "https://images.unsplash.com/photo-1599058917217-f9d86c8937ed?q=80&w=1774&auto=format&fit=crop",
  },
  {
    workout_id: 8,
    title: "Boxing Basics",
    description: "Learn basic boxing techniques and build stamina with this beginner-friendly workout. Perfect for cardio lovers.",
    fitness_level: "Intermediate",
    fitness_goal: "Endurance",
    photo: "https://images.unsplash.com/photo-1613748641490-d1d4e66e9283?q=80&w=1774&auto=format&fit=crop",
  },
  {
    workout_id: 9,
    title: "Weight Lifting Fundamentals",
    description: "Master the basics of weight lifting with this beginner program focusing on form, technique, and muscle engagement.",
    fitness_level: "Beginner",
    fitness_goal: "Muscle Gain",
    photo: "https://images.unsplash.com/photo-1599058917217-f9d86c8937ed?q=80&w=1774&auto=format&fit=crop",
  },
  {
    workout_id: 10,
    title: "CrossFit Challenge",
    description: "A high-intensity CrossFit workout combining strength and cardio exercises to push your limits.",
    fitness_level: "Advanced",
    fitness_goal: "Weight Loss",
    photo: "https://images.unsplash.com/photo-1547744135-5f1f7b03e21c?q=80&w=1774&auto=format&fit=crop",
  },
];

const fallbackImage = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

export default function Page() {
  const [isFavorite, setIsFavorite] = useState(false);

  const [tags] = useState([
    "Book Trainers on Preferred Time",
    "Progress Tracking",
    "Digital Membership Card",
    "Diet Plans",
    "Workout Programs",
    "User Preference Recommendation",
  ]);

  const router = useRouter();

  const handleCardClick = (workoutId: number) => {
    router.push(`/programs/${workoutId}`);
  };
  
  const getBackgroundImage = (photo: any) => {
    return photo && photo.trim() !== "" ? photo : fallbackImage;
  };

  return (
    <>
      <div className="w-full flex flex-col rounded-2xl">
        <div className="p-2 bg-[#CCFF00] h-fit w-full flex flex-col gap-6 py-6">
          <div className="relative overflow-hidden w-full">
            <div className="flex gap-14 animate-slide">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="text-[#131605] font-medium md:text-sm whitespace-nowrap items-center"
                >
                  <RiAsterisk className="h-4 w-4 inline-block mr-2" />
                  {tag}
                </div>
              ))}
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="text-[#131605] font-medium md:text-sm whitespace-nowrap items-center"
                >
                  <RiAsterisk className="h-4 w-4 inline-block mr-2" />
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full gap-6 p-12">
          
          <div className="flex flex-col sm:flex-row w-full justify-between">
            <h1 className="text-[36px] font-black">Workouts</h1>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input placeholder="Search for workouts..." className="max-w-sm" />
              <Button className="flex flex-row items-center">
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                Search Workouts
              </Button>
              <Button className="flex flex-row items-center" variant="outline">
                <SparklesIcon className="h-4 w-4 mr-2" />
                Show Recommendations
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout: any) => (
              <Card
                key={workout.workout_id}
                className="border-none flex flex-col  rounded-3xl justify-between cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-lg  shadow-none gap-4"
                onClick={() => handleCardClick(workout.workout_id)}
              >
                <CardHeader className="w-full h-[275px] border border-border rounded-3xl flex flex-row justify-end"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1)), url(${getBackgroundImage(workout.photo)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}>
                  <div className="w-full text-right">
                      <Toggle 
                        variant="outline" 
                        className="w-fit rounded-full bg-black/30 border-white " 
                        onClick={() => setIsFavorite(!isFavorite)}
                      >
                        <HeartIcon className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-transparent' : 'text-white'}`} />
                      </Toggle>
                    </div>
                </CardHeader>
                <CardContent className='px-2 gap-2 flex flex-col'>
                  <span className="text-2xl font-bold text-foreground">{workout.title}</span>
                  <span className="text-md text-muted-foreground">{workout.description}</span>
                </CardContent>
                <CardFooter className='flex flex-row w-full items-left p-0 gap-2'>
                  {/* Fitness Level */}
                  <div className="p-2 px-4 w-fit rounded-full bg-background/90 backdrop-filter backdrop-blur-lg flex items-center justify-center cursor-pointer hover:bg-black/20 border-border border">
                    <div className="flex flex-row gap-2 text-xs text-foreground">
                      <p>{workout.fitness_level}</p>
                    </div>
                  </div>
                  
                  {/* Fitness Goal */}
                  <div className="p-2 px-4 w-fit rounded-full bg-foreground/90 backdrop-filter backdrop-blur-lg flex items-center justify-center cursor-pointer hover:bg-foreground/20 border-border border">
                    <div className="flex flex-row gap-2 text-xs text-background">
                      <p>{workout.fitness_goal}</p>
                    </div>
                  </div>


                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
