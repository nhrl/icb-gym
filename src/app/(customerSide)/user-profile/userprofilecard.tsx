"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { CameraIcon, CheckIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { useToast } from "@/hooks/use-toast"; // ShadCN toast hook

// Zod schema for form validation
const formSchema = zod.object({
  email: zod.string().email({ message: "Invalid email address" }),
  username: zod.string().min(3, "Username must be at least 3 characters"),
  newPassword: zod.string().optional(),
  profile_img: zod.string().optional(),
});

// Mock API function to simulate user profile fetch
const fetchUserProfile = async () => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        customer_id: "101",
        firstname: "Aris Antonio",
        lastname: "Co",
        gender: "Male",
        email: "arisantonioco@gmail.com",
        username: "aris_co",
        profile_img: "",
        fitnessGoals: ["Weight loss", "Muscle gain", "General health", "Endurance"],
        selectedGoals: [],
        timePreference: "Morning",
        fitnessLevel: "Advanced",
      });
    }, 1000)
  );
};

interface UserProfileProps {
  onProfileUpdate: (data: any) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onProfileUpdate }) => {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast(); // Toast handler

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchUserProfile();
        setProfileData(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]); // Added 'toast' to the dependency array

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: profileData?.email || "",
      username: profileData?.username || "",
      newPassword: "",
      profile_img: profileData?.profile_img || "",
    },
  });

  const onSubmit = (data: any) => {
    onProfileUpdate({ ...profileData, ...data });

    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileData((prev: any) => ({ ...prev, profile_img: imageUrl }));

      toast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been updated successfully.",
      });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleGoalToggle = (goal: string) => {
    setProfileData((prev: any) => ({
      ...prev,
      selectedGoals: prev.selectedGoals.includes(goal)
        ? prev.selectedGoals.filter((g: string) => g !== goal)
        : [...prev.selectedGoals, goal],
    }));
  };

  if (loading) return <p className="text-center">Loading profile...</p>;

  return (
    <div className="w-full h-full">
      <Card>
        <CardHeader className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 relative overflow-hidden rounded-full bg-gray-300">
                {profileData.profile_img ? (
                  <Image
                    src={profileData.profile_img}
                    alt="Profile"
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <AvatarFallback>
                    {profileData.firstname[0]}
                    {profileData.lastname[0]}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-semibold">
                  {profileData.firstname} {profileData.lastname}
                </CardTitle>
                <p className="text-muted-foreground">
                  Customer ID: {profileData.customer_id}
                </p>
                <p className="text-muted-foreground">{profileData.gender}</p>
              </div>
            </div>
            <div>
              <Button variant="outline" className="gap-2" onClick={handleUploadClick}>
                <CameraIcon className="h-4 w-4" />
                Upload Profile Picture
              </Button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="font-regular text-sm">Fitness Goals</p>
            <ToggleGroup
              variant="outline"
              type="multiple"
              value={profileData.selectedGoals}
              onValueChange={(value) =>
                setProfileData((prev: any) => ({ ...prev, selectedGoals: value }))
              }
              className="flex flex-wrap justify-start gap-2"
            >
              {profileData.fitnessGoals.map((goal: string) => (
                <ToggleGroupItem
                  key={goal}
                  value={goal}
                  onClick={() => handleGoalToggle(goal)}
                  className="flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-muted-foreground cursor-pointer"
                >
                  {profileData.selectedGoals.includes(goal) && (
                    <CheckIcon className="h-4 w-4 text-primary-foreground" />
                  )}
                  <span className="whitespace-nowrap">{goal}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="space-y-2">
            <p className="font-regular text-sm">Time Preference</p>
            <ToggleGroup
              variant="outline"
              type="single"
              value={profileData.timePreference}
              onValueChange={(value) =>
                setProfileData((prev: any) => ({ ...prev, timePreference: value }))
              }
              className="flex gap-2 justify-start"
            >
              {["Morning", "Afternoon", "Evening"].map((time) => (
                <ToggleGroupItem
                  key={time}
                  value={time}
                  className="w-auto flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-muted-foreground cursor-pointer"
                >
                  {profileData.timePreference === time && (
                    <CheckIcon className="h-4 w-4 text-primary-foreground" />
                  )}
                  <span className="whitespace-nowrap">{time}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="space-y-2">
            <p className="font-regular text-sm">Fitness Level</p>
            <ToggleGroup
              variant="outline"
              type="single"
              value={profileData.fitnessLevel}
              onValueChange={(value) =>
                setProfileData((prev: any) => ({ ...prev, fitnessLevel: value }))
              }
              className="flex gap-2 justify-start"
            >
              {["Beginner", "Intermediate", "Advanced"].map((level) => (
                <ToggleGroupItem
                  key={level}
                  value={level}
                  className="w-auto flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-muted-foreground cursor-pointer"
                >
                  {profileData.fitnessLevel === level && (
                    <CheckIcon className="h-4 w-4 text-primary-foreground" />
                  )}
                  <span className="whitespace-nowrap">{level}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-row w-full gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full flex justify-end">
                <Button type="submit" variant="default" className="w-fit">
                  <ArrowPathIcon className="h-6 w-6 pr-2" />
                  Update Profile
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
