"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { BookOpenIcon, QuestionMarkCircleIcon, ClockIcon, CalendarDaysIcon, UserGroupIcon, HeartIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "lucide-react";
import CryptoJS from 'crypto-js';
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { Toaster } from "@/components/ui/toaster";

interface Trainer {
  trainer_id: number;
  firstname: string;
  lastname: string;
  specialty: string;
  email: string;
  trainer_img: string;
  availability: string;
}

interface Service {
  service_name: string;
}

interface Assignment {
  assign_id: number;
  service_id: number;
  trainer_id: number;
  description: string;
  start_time: string;
  end_time: string;
  schedule: string[];
  max_capacity: number;
  current_capacity: number;
  rate: number;
  trainer: Trainer;
  service: Service;
}

const formatTime = (time: string) => {
  const [hour, minute] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hour, 10));
  date.setMinutes(parseInt(minute, 10));

  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };

  return date.toLocaleTimeString('en-US', options);
};


export default function TrainerDetailPage() {
  const {trainerId, serviceId } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast(); // Use the toast hook from Shadcn
  const [breadcrumbLink, setBreadcrumbLink] = useState(`/booking-services/${serviceId}`);

  const [howtopay] = useState([
    {
      title: "How to Pay",
      description: (
        <div className="flex flex-col">
          <p>1. Book a trainer first.</p>
          <p>2. Go to the gym and pay cash at the front desk.</p>
          <p>3. When your status is paid, your booking will be confirmed.</p>
          <p>4. After the payment is made, your booking status will be updated to 'Paid' and the booking will be confirmed. This ensures that your session with the selected trainer is reserved and confirmed upon payment.</p>
        </div>
      ),
    },
  ]);

  const api = process.env.NEXT_PUBLIC_API_URL;
  const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || 'lhS7aOXRUPGPDId6mmHJdA00p39HAfU4';

  // Function to fetch and decrypt user cookie from document.cookie
  const fetchUserFromCookie = () => {
    const cookies = document.cookie.split("; ").reduce((acc: { [key: string]: string }, cookie) => {
      const [name, value] = cookie.split("=");
      acc[name] = value;
      return acc;
    }, {});

    const userCookie = cookies['user']; 

    if (!userCookie) {
      console.error("User cookie not found");
      return null;
    }

    try {
      const decryptedUserBytes = CryptoJS.AES.decrypt(userCookie, secretKey);
      const decryptedUser = JSON.parse(decryptedUserBytes.toString(CryptoJS.enc.Utf8));
      return decryptedUser.id; // Assuming user ID is part of the decrypted data
    } catch (error) {
      console.error("Error decrypting the user cookie", error);
      return null;
    }
  };

  const userId = fetchUserFromCookie();
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch(`${api}/api/customer/service?id=${serviceId}`);
        const result = await response.json();

        if (result.success) {
          setAssignments(result.data);
        } else {
          setError(result.message || "Failed to fetch assignments.");
        }

        const showRecommendations = sessionStorage.getItem("showTrainerRecommendations") === "true";
        if (showRecommendations) {
          setBreadcrumbLink(`/booking-services/${serviceId}?recommended=true`);
        }

        const favoriteShow = sessionStorage.getItem("showFavoritesTrainer") === "true";
        if(favoriteShow) {
          setBreadcrumbLink(`/booking-services/${serviceId}?favorites=true`);
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorite = async () => {
      try {
        console.log(userId);
        const response = await fetch(`${api}/api/customer/favorites/trainer?customerId=${userId}&trainerId=${trainerId}`)
        const message = await response.json();
        const exists = message.exists;
        if(exists) {
          console.log(exists);
          setIsFavorite(true);
        } else {
          setIsFavorite(false);
          console.log(exists);
        }
        
      } catch (error) {
        console.error("Error fetching favorite:", error);
      }
    }
    fetchFavorite();
    fetchAssignments();
  }, [serviceId, api,trainerId,userId]);


  const favorites = async () => {
    const id = fetchUserFromCookie();
    if(isFavorite) {
      //Remove from favorites
      console.log("Remove");
      setIsFavorite(false);
      try {
        const response = await fetch(`${api}/api/customer/favorites/trainer`,{
          method:"DELETE",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({userId: id, assignId: trainerId,service_id: serviceId}),
        })

        const message = await response.json();
        console.log(message.message);
      } catch (error) {
        console.error("Error adding to favorites:", error);
      }
    } else {
      //Add from favorites
      console.log("Add");
      console.log(trainerId);
      setIsFavorite(true);
      try {
        const response = await fetch(`${api}/api/customer/favorites/trainer`,{
          method:"POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({userId: id, assignId: trainerId, service_id: serviceId}),
        });
        const message = await response.json();
        console.log(message.message);
        console.log(message.error);
      } catch (error) {
        console.error("Error adding to favorites:", error);
      }
    }
  }

  if (loading) return <p>Loading assignments...</p>;
  if (error) return <p>Error: {error}</p>;

  const assignment = assignments.find((assign) => assign.assign_id === parseInt(trainerId as string, 10));

  if (!assignment) return <p>No assignment available for this trainer.</p>;

  const trainer = assignment.trainer;
  const service = assignment.service;

  const addBooking = async () => {
    const customerId = fetchUserFromCookie();
    const bookingData= {
      customer_id: customerId,
      assign_id: assignment.assign_id,
      trainer_id: trainer.trainer_id,
    }

    console.log(bookingData);
    const response = await fetch(`${api}/api/customer/booking`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });

    const message = await response.json();
    if(message.success) {
      console.log(message.message);
      toast({
        title: "Booking Added",
        description: message.message,
        duration: 3000,
      });
    } else {
      console.log(message.error);
      toast({
        title: "Booking Failed",
        description: message.message,
        duration: 3000,
      });
    }
  }

  return (
    <div className="w-full p-12 px-8 sm:px-[254px]">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/booking-services">Services</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={breadcrumbLink}>
              {service.service_name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">{trainer.firstname} {trainer.lastname}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-8 border-none shadow-none">
        <CardHeader
          className="h-64 bg-cover bg-center border border-border rounded-lg"
          style={{ backgroundImage: `url(${trainer.trainer_img})` }}
        >
          <div className="p-2 px-4 w-fit rounded-full bg-black/90 backdrop-filter backdrop-blur-lg flex items-center justify-center cursor-pointer hover:bg-black/20">
            <UserGroupIcon className="h-4 w-4 mr-2 text-white" />
            <div className="flex flex-row gap-2 text-xs text-white">
              <p>{assignment?.current_capacity}</p>
              <p>of</p>
              <p>{assignment?.max_capacity}</p>
            </div>
          </div>
        </CardHeader>


        
        <CardContent className="p-6 px-0 ">
          
          {assignment ? (
            <div className="gap-4 flex flex-col sm:flex-row justify-between">

              {/*Heading*/}
              <div className="flex flex-col gap-4 w-full">

                <div className="flex flex-row w-full justify-between">

                  <div className="flex flex-col w-fit justify-between">
                    <div className="flex flex-row w-fit items-center gap-2">
                      <h2 className="text-2xl font-bold">
                      {trainer.firstname} {trainer.lastname}
                      </h2>
                      <Badge 
                        variant={
                          assignment.current_capacity < assignment.max_capacity
                            ? "success"
                            : "destructive"
                        }
                        className="rounded-full"
                      >
                        {assignment.current_capacity < assignment.max_capacity
                          ? "Available"
                          : "Full"}
                      </Badge>
                    </div>
                    <p className="text-md">{trainer.email}</p>
                    </div>

                    <Toggle 
                      variant="outline" 
                      className={`w-fit items-center gap-2 rounded-full px-4 ${isFavorite ? 'bg-blue-500 text-white' : 'bg-transparent text-foreground'}`}  
                      onClick={favorites}
                    >
                      <BookmarkIcon className={`h-4 w-4 ${isFavorite ? 'text-white' : 'text-foreground'}`} />
                      {isFavorite ? "Saved to Favorites" : "Save to Favorites"}
                    </Toggle>
                  </div>
                  <p className="text-lg text-muted-foreground">{assignment.description}</p>
              </div>

              <div className="flex flex-col gap-4">
              <Card className="flex flex-col justify-between text-center shadow-lg">
                <CardHeader className="font-medium items-center text-xl">
                  <div className="flex flex-col gap-2 items-center">
                    <div className="rounded-full w-fit bg-secondary p-2">
                      <UserGroupIcon className="w-4 h-4 text-white"/>
                    </div>
                    <p>Client Capacity</p>
                    </div>
                </CardHeader>

                <CardContent className="flex flex-col items-center gap-3">
                  <div className="text-center font-black text-[50px]">
                    <p>{assignment.current_capacity}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>of {assignment.max_capacity} users</p>
                    <p>have booked this trainer</p>
                  </div>
                </CardContent>
              </Card>

              <Card className=" w-full sm:w-[375px] shadow-lg">
                <CardHeader>
                  <div className="flex flex-row gap-2">
                  <p className="text-2xl font-semibold text-start">₱{assignment.rate}</p>
                  <p className="font-thin">/Month</p>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-6">

                  {/*Schedule*/}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-regular flex flex-row items-center">
                      <CalendarDaysIcon className="w-3 h-3 mr-1"/>
                      Schedule
                      </h3>
                      <div className="flex flex-wrap sm:flex-row gap-2">
                      {(() => {
                        let parsedSchedule: string[] = [];
                        try {
                          parsedSchedule = Array.isArray(assignment.schedule)
                            ? assignment.schedule
                            : JSON.parse(assignment.schedule);
                        } catch (error) {
                          console.error("Failed to parse schedule:", error);
                        }

                        return parsedSchedule.map((day, index) => (
                          <Badge key={index} className="text-xs w-fit h-fit p-2 px-4 border-border border  rounded-full text-muted-foreground" variant="outline">{day}</Badge>
                        ));
                      })()}
                      </div>
                      <h3 className="text-sm font-regular flex flex-row items-center">
                        <ClockIcon className="w-3 h-3 mr-1"/>
                        Time
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-2">
                          <div className="text-xs w-fit h-fit p-2 px-4 border-border border  rounded-full text-muted-foreground">
                            {formatTime(assignment.start_time)} - {formatTime(assignment.end_time)}
                          </div>
                      </div>
                    </div>

                  {/*Button*/}    
                  <div className="gap-2 flex flex-col">

                  <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="secondary"
                          className="rounded-full w-full"
                          disabled={assignment.current_capacity >= assignment.max_capacity}
                        >
                          <BookOpenIcon className="h-4 w-4" />
                          {assignment.current_capacity >= assignment.max_capacity
                            ? "Fully Booked"
                            : "Book this Trainer"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="font-medium">Book this Trainer?</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to book this trainer? This action will reserve a session with the selected trainer.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button variant="outline">Cancel</Button>
                          <Button
                            variant="secondary"
                            className="bg-primary text-primary-foreground"
                            onClick={addBooking}
                          >
                            Yes, Book this Trainer
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger> 
                        <Button variant="outline" className="rounded-full w-full">
                        How to Pay
                        <QuestionMarkCircleIcon className="h-4 w-4" />
                        </Button> 
                      </DialogTrigger>
                      <DialogContent className="gap-10 flex flex-col">
                        <DialogHeader>
                          <DialogTitle className="font-medium flex flex-row items-center"> 
                            <QuestionMarkCircleIcon className="h-4 w-4 mr-2" />
                            {howtopay[0].title}
                          </DialogTitle>
                          <DialogDescription>
                              {howtopay[0].description}
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                      </Dialog>
                    </div>
                </CardContent>
              </Card>
            </div>
            </div>
          ) : (
            <p className="text-md text-muted-foreground mt-6">No assignment available for this trainer.</p>
          )}
        </CardContent>
        <CardFooter className="p-6">
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  );
}
