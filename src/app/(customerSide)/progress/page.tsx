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
import { HandThumbUpIcon, ScaleIcon, ArrowUpIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FireIcon } from "@heroicons/react/16/solid";
import Barchart from "./chart";
import ProgressTable from "./progresstable";
import TargetWeightForm from "@/components/customerComponents/targetWeightForm";
import useSWR, { mutate } from 'swr';
import CryptoJS from 'crypto-js';

interface Progress {
  progress_id: number;
  customer_id: number;
  week_number: number;
  desc: string;
  workout_count: number;
  weight: number;
  bodyfat_percentage: number;
  date_added: string;
  photo: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Page() {
  const [gymStreakData, setGymStreakData] = useState({
    current: 0,
    best: 0,
  });
  const [progressData, setProgressData] = useState<Progress[]>([]);
  const [targetWeightData, setTargetWeightData] = useState({
    currentWeight: 0,
    targetWeight: 0,
  });
  
  const api = process.env.NEXT_PUBLIC_API_URL;
  const fetchUserFromCookie = () => {
    if (typeof window === "undefined") return null;
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || "lhS7aOXRUPGPDId6mmHJdA00p39HAfU4";
    const cookies = document.cookie.split("; ").reduce((acc: { [key: string]: string }, cookie) => {
      const [name, value] = cookie.split("=");
      acc[name] = value;
      return acc;
    }, {});
  
    const userCookie = cookies["user"];
    if (!userCookie) return null;
  
    try {
      const decryptedUserBytes = CryptoJS.AES.decrypt(userCookie, secretKey);
      const decryptedUser = JSON.parse(decryptedUserBytes.toString(CryptoJS.enc.Utf8));
      return decryptedUser.id;
    } catch (error) {
      console.error("Error decrypting user cookie:", error);
      return null;
    }
  };

  const userId = fetchUserFromCookie();
  const { data, error } = useSWR(`${api}/api/customer/progress?id=${userId}`, fetcher);

  useEffect(() => {
    if (data?.data) {
      setProgressData(data.data || []);
    }
  }, [data]);

  useEffect(() => {
    if (progressData.length > 0) {
        // Define getLatestWeight function within useEffect
        const getLatestWeight = () => {
            const latestProgress = progressData.reduce((latest, entry) =>
                new Date(entry.date_added) > new Date(latest.date_added) ? entry : latest
            );
            return latestProgress.weight;
        };

        const latestWeight = getLatestWeight();
        setTargetWeightData((prev) => ({ ...prev, currentWeight: latestWeight }));
    }
  }, [progressData]);

  const getLatestWeight = () => {
    const latestProgress = progressData.reduce((latest, entry) =>
      new Date(entry.date_added) > new Date(latest.date_added) ? entry : latest
    );
    return latestProgress.weight;
  };

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const handleCloseForm = () => {
    setIsAddFormOpen(false);
  };

  const handleRemoveTargetWeight = async () => {
    try {
      // Call your API endpoint to remove target weight
      await fetch(`${api}/api/customer/progress/targetWeight?id=${userId}`, {
        method: "DELETE",
      });

      // Update the local state after removing target weight
      setTargetWeightData((prev) => ({ ...prev, targetWeight: 0 }));
    } catch (error) {
      console.error("Error removing target weight:", error);
    }
  };

  useEffect(() => {
    async function fetchGymStreakData() {
      try {
        const response = await fetch(`${api}/api/customer/progress/streak?id=${userId}`);
        const data = await response.json();
        setGymStreakData({
          current: data?.data?.current_gymstreak ?? 0,
          best: data?.data?.best_gymstreak ?? 0,
        });
      } catch (error) {
        console.error("Error fetching gym streak data:", error);
      }
    }

    async function fetchTargetWeightData() {
      try {
        const response = await fetch(`${api}/api/customer/progress/targetWeight?id=${userId}`);
        const data = await response.json();
        setTargetWeightData((prevState) => ({
          ...prevState,
          targetWeight: data?.data?.target_weight ?? 0,
        }));
      } catch (error) {
        console.error("Error fetching target weight data:", error);
      }
    }
    fetchGymStreakData();
    fetchTargetWeightData();
  }, [api, userId, data]);

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

              {/* Conditionally render Set/Remove Target Weight buttons */}
              {targetWeightData.targetWeight === 0 ? (
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
              ) : (
                <Button
                  className="p-2 px-4 border rounded-full flex gap-2 text-xs items-center mt-2 md:mt-0"
                  onClick={handleRemoveTargetWeight}
                >
                  <TrashIcon className="h-3 w-3" />
                  <p>Remove Target Weight</p>
                </Button>
              )}
            </CardHeader>
            <CardContent className="flex justify-center items-center">
              <CardDescription>
                <span className="flex gap-2 items-center">
                  <span className="text-[32px] md:text-[48px] font-black text-foreground">
                    {targetWeightData.targetWeight || 0}
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
                <div className="text-sm text-green-500 text-center md:text-left">
                  <p>You have reached your target weight!</p>
                </div>
              ) : (
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
