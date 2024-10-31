"use client";

import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HandThumbUpIcon, ScaleIcon, ArrowUpIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { FireIcon } from "@heroicons/react/16/solid";
import Barchart from "./chart";
import ProgressTable from "./progresstable";
import TargetWeightForm from "@/components/customerComponents/targetWeightForm";


const mockProgressData = [
  {
    progress_id: 1,
    customer_id: 101,
    week: 1,
    desc: "Started the journey strong with consistent workouts and mindful eating.",
    workout_count: 4,
    current_weight: 72,
    bodyfat_percentage: 18,
    date_added: "2024-08-29",
  },
  {
    progress_id: 2,
    customer_id: 101,
    week: 2,
    desc: "Pushed hard this week, focusing on strength training and cardio.",
    workout_count: 5,
    current_weight: 71.5,
    bodyfat_percentage: 17.8,
    date_added: "2024-09-05",
  },
  {
    progress_id: 3,
    customer_id: 101,
    week: 3,
    desc: "Took it easy mid-week but made up with a strong weekend workout.",
    workout_count: 3,
    current_weight: 71,
    bodyfat_percentage: 17.5,
    date_added: "2024-09-12",
  },
  {
    progress_id: 4,
    customer_id: 101,
    week: 4,
    desc: "Focused on core exercises and flexibility this week.",
    workout_count: 4,
    current_weight: 70.8,
    bodyfat_percentage: 17.3,
    date_added: "2024-09-19",
  },
  {
    progress_id: 5,
    customer_id: 101,
    week: 5,
    desc: "Hit a new personal best in strength and improved cardio endurance.",
    workout_count: 5,
    current_weight: 70.5,
    bodyfat_percentage: 17,
    date_added: "2024-09-26",
  },
  {
    progress_id: 6,
    customer_id: 101,
    week: 6,
    desc: "Focused on high-intensity interval training and endurance workouts.",
    workout_count: 4,
    current_weight: 70.2,
    bodyfat_percentage: 16.9,
    date_added: "2024-10-03",
  },
  {
    progress_id: 7,
    customer_id: 101,
    week: 7,
    desc: "Improved overall stamina and maintained workout consistency.",
    workout_count: 5,
    current_weight: 70,
    bodyfat_percentage: 16.8,
    date_added: "2024-10-10",
  },
  {
    progress_id: 8,
    customer_id: 101,
    week: 8,
    desc: "Included more flexibility exercises and cooldown routines.",
    workout_count: 3,
    current_weight: 69.8,
    bodyfat_percentage: 16.7,
    date_added: "2024-10-17",
  },
  {
    progress_id: 9,
    customer_id: 101,
    week: 9,
    desc: "Incorporated more varied cardio activities for endurance.",
    workout_count: 5,
    current_weight: 69.5,
    bodyfat_percentage: 16.5,
    date_added: "2024-10-24",
  },
  {
    progress_id: 10,
    customer_id: 101,
    week: 10,
    desc: "Final week: Strong focus on overall fitness and flexibility.",
    workout_count: 4,
    current_weight: 69.3,
    bodyfat_percentage: 16.3,
    date_added: "2024-10-31",
  },
];


export default function Page() {
  const [gymStreakData, setGymStreakData] = useState({
    current: 0,
    best: 0,
  });

  // Set initial targetWeightData with latest weight
  const getLatestWeight = () => {
    const latestProgress = mockProgressData.reduce((latest, entry) =>
      new Date(entry.date_added) > new Date(latest.date_added) ? entry : latest
    );
    return latestProgress.current_weight;
  };

  const [targetWeightData, setTargetWeightData] = useState({
    currentWeight: getLatestWeight(), // Set the latest weight directly
    targetWeight: 69.3,
  });

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  
  const handleCloseForm = () => {
    setIsAddFormOpen(false);
  };

  useEffect(() => {
    async function fetchGymStreakData() {
      try {
        const response = await fetch("/api/gymstreak?customer_id=your_customer_id");
        const data = await response.json();
        setGymStreakData({
          current: data.current_gymstreak,
          best: data.best_gymstreak,
        });
      } catch (error) {
        console.error("Error fetching gym streak data:", error);
      }
    }

    async function fetchTargetWeightData() {
      try {
        const response = await fetch("/api/targetweight?customer_id=your_customer_id");
        const data = await response.json();
        setTargetWeightData((prevState) => ({
          ...prevState,
          targetWeight: data.target_weight,
        }));
      } catch (error) {
        console.error("Error fetching target weight data:", error);
      }
    }

    fetchGymStreakData();
    fetchTargetWeightData();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4 md:px-[128px] min-h-screen">
      {/* Breadcrumb */}
      <div className="w-full h-fit">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/progress">Progress</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row w-full gap-4">
        {/* Chart */}
        <div className="flex-1">
          <Barchart />
        </div>

        {/* Cards */}
        <div className="flex flex-col flex-1 gap-4">

          {/* Gym Streak Card */}
          <Card className="flex-1 flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="rounded-full border p-1 bg-red-500 mr-2">
                  <FireIcon className="h-3 w-3 text-white" />
                </div>
                Gym Streak
              </CardTitle>
              <CardDescription>Don't break your streak!</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription>
                <span className="text-[32px] md:text-[48px] font-black text-foreground">
                  {gymStreakData.current}
                </span>
              </CardDescription>
            </CardContent>
            <CardFooter className="flex flex-col md:flex-row justify-between gap-2 md:gap-0">
              <div className="p-2 px-4 border rounded-full flex gap-2 text-xs items-center">
                <HandThumbUpIcon className="h-3 w-3" />
                <p>Personal Best</p>
                <p className="text-green-400">{gymStreakData.best}</p>
              </div>
              {gymStreakData.current >= gymStreakData.best && (
                <div className="text-sm text-green-400 text-center md:text-left">
                  <p>You have hit your personal best!</p>
                </div>
              )}
            </CardFooter>
          </Card>

          {/* Target Weight Card with Dialog Trigger */}
          <Card className="flex-1 flex flex-col justify-between">
            <CardHeader className="flex flex-col md:flex-row justify-between items-center align-top">
              <div className="flex flex-col gap-2">
                <CardTitle className="flex items-center">
                  <ScaleIcon className="h-4 w-4 mr-2" />
                  Target Body Weight
                </CardTitle>
                <CardDescription>This is your target body weight</CardDescription>
              </div>

              {/* Dialog Trigger for Set Target Weight */}
              <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
                <DialogTrigger asChild>
                  <Button className="p-2 px-4 border rounded-full flex gap-2 text-xs items-center mt-2 md:mt-0">
                    <PencilSquareIcon className="h-3 w-3" />
                    <p>Set Target Weight</p>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Set Target Weight</DialogTitle>
                  </DialogHeader>
                  <TargetWeightForm
                    onSubmit={(data) => {
                      setTargetWeightData({
                        ...targetWeightData,
                        targetWeight: data.target_weight,
                      });
                      handleCloseForm();
                    }}
                    
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="flex justify-center items-center">
              <CardDescription>
                <span className="flex gap-2 items-center">
                  <span className="text-[32px] md:text-[48px] font-black text-foreground">
                    {targetWeightData.targetWeight}
                  </span>
                  <span className="text-[20px] md:text-[28px] font-semibold text-foreground-muted">Kg</span>
                </span>
              </CardDescription>
            </CardContent>
            <CardFooter className="flex flex-col md:flex-row justify-between gap-2 md:gap-0">
              <div className="p-2 px-4 border rounded-full flex gap-2 text-xs items-center">
                <p>Current Body Weight</p>
                <p className="text-green-400">{targetWeightData.currentWeight} Kg</p>
              </div>
              
              {targetWeightData.currentWeight <= targetWeightData.targetWeight ? (
                // Display this message if target weight is reached
                <div className="text-sm text-green-500 text-center md:text-left">
                  <p>You have reached your target weight!</p>
                </div>
              ) : (
                // Display the progress percentage if target weight is not reached
                <div className="flex items-center gap-2 text-sm">
                  <ArrowUpIcon className="h-4 w-4" />
                  <p>{((targetWeightData.targetWeight / targetWeightData.currentWeight) * 100).toFixed(2)} %</p>
                  <p>from target</p>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Progress Table */}
      <div className="w-full rounded-lg p-4 border border-border overflow-x-auto">
        <ProgressTable />
      </div>
    </div>
  );
}
