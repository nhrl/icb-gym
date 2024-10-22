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
import { BookOpenIcon, QuestionMarkCircleIcon, UserGroupIcon, HeartIcon } from "@heroicons/react/24/outline";
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



// Mock Data
const services = [
  {
    serviceId: 1,
    name: "Basketball",
    desc: "Improve your strength with guided weight lifting programs.",
    photo: "https://images.unsplash.com/photo-1627627256672-027a4613d028?q=80&w=1774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    serviceId: 2,
    name: "Yoga",
    desc: "Find your balance with expert-led yoga sessions.",
    photo: "/images/yoga.jpg",
  },
];

const trainers = [
  {
    trainer_id: 1,
    firstName: "John",
    lastName: "Doe",
    specialty: "Basketball",
    email_address: "john@example.com",
    availability: "Full",
    photo: "https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=1887&auto=format&fit=crop",
  },
  {
    trainer_id: 2,
    firstName: "Jane",
    lastName: "Doe",
    specialty: "Yoga",
    email_address: "jane@example.com",
    availability: "Full",
    photo: "https://images.unsplash.com/photo-1627627256672-027a4613d028?q=80&w=1774&auto=format&fit=crop",
  },

  { 
    trainer_id: 3,
    firstName: "John",
    lastName: "Dane",
    specialty: "Basketball",
    email_address: "john@example.com",
    availability: "Available",
    photo: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
];

const trainerAssigns = [
  {
    assign_id: 1,
    service_id: 1,
    trainer_id: 1,
    desc: "Improve your strength with guided weight lifting programs.",
    time_availability: "9 AM - 12 PM",
    schedule: ["Monday", "Wednesday", "Friday"],
    max_capacity: 10,
    current_capacity: 6,
    rate: 50,
  },
  {
    assign_id: 2,
    service_id: 2,
    trainer_id: 2,
    desc: "Yoga sessions to find balance, peace, and inner strength. Our yoga classes are designed to help you connect with your body and mind, providing a holistic approach to wellness. Whether you are a beginner or an experienced practitioner, our sessions cater to all levels. Join us to improve your flexibility, reduce stress, and enhance your overall well-being. Our experienced instructors will guide you through various poses and breathing techniques, ensuring a safe and supportive environment. Embrace the journey of self-discovery and transformation with our yoga sessions. Find your balance, rejuvenate your spirit, and cultivate a sense of tranquility.",
    time_availability: "8 AM - 10 AM",
    schedule: ["Tue", "Thu"],
    max_capacity: 15,
    current_capacity: 10,
    rate: 60,
  },
  {
    assign_id: 3,
    service_id: 1,
    trainer_id: 3,
    desc: "Yoga sessions to find balance, peace, and inner strength. Our yoga classes are designed to help you connect with your body and mind, providing a holistic approach to wellness. Whether you are a beginner or an experienced practitioner, our sessions cater to all levels. Join us to improve your flexibility, reduce stress, and enhance your overall well-being. Our experienced instructors will guide you through various poses and breathing techniques, ensuring a safe and supportive environment. Embrace the journey of self-discovery and transformation with our yoga sessions. Find your balance, rejuvenate your spirit, and cultivate a sense of tranquility.",
    time_availability: "8 AM - 10 AM",
    schedule: ["Tuesday", "Thursday"],
    max_capacity: 20,
    current_capacity: 13,
    rate: 60,
  },
];

export default function TrainerDetailPage() {
  const { trainerId, serviceId } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [trainer, setTrainer] = useState<typeof trainers[0] | null>(null);
  const [service, setService] = useState<typeof services[0] | null>(null);
  const [assignment, setAssignment] = useState<typeof trainerAssigns[0] | null>(null);

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

  useEffect(() => {
    const foundTrainer = trainers.find((t) => t.trainer_id.toString() === trainerId);
    setTrainer(foundTrainer || null);

    const foundService = services.find((s) => s.serviceId.toString() === serviceId);
    setService(foundService || null);

    const foundAssignment = trainerAssigns.find(
      (a) => a.trainer_id.toString() === trainerId && a.service_id.toString() === serviceId
    );
    setAssignment(foundAssignment || null);
  }, [trainerId, serviceId]);

  if (!trainer || !service) return <p>Trainer or Service not found.</p>;

  return (
    <div className="w-full p-12 px-8 sm:px-[180px]">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/booking-services">Services</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/booking-services/${serviceId}`}>
              {service.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">{trainer.firstName} {trainer.lastName}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-8 border-none">
        <CardHeader
          className="h-64 bg-cover bg-center border border-border rounded-lg"
          style={{ backgroundImage: `url(${trainer.photo})` }}
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
                      {trainer.firstName} {trainer.lastName}
                      </h2>
                      <Badge 
                        className="rounded-full text-white" 
                        variant={trainer.availability === "Full" ? "destructive" : "success"}
                      >
                        {trainer.availability}
                      </Badge>
                    </div>
                    <p className="text-md">{trainer.email_address}</p>
                    </div>

                    <Toggle 
                      variant="outline" 
                      className="w-fit rounded-full" 
                      onClick={() => setIsFavorite(!isFavorite)}
                    >
                      <HeartIcon className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-transparent' : 'text-foreground'}`} />
                    </Toggle>


                  </div>
                  <p className="text-lg text-muted-foreground">{assignment.desc}</p>
              </div>

              <Card className=" w-full sm:w-[375px] shadow-lg">
                <CardHeader>
                  <div className="flex flex-row gap-2">
                  <p className="text-2xl font-semibold text-start">${assignment.rate}</p>
                  <p className="font-thin">/Month</p>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-6">

                  <Card className="flex flex-row items-center justify-between">
                    <CardHeader>
                      <div className="text-lg font-semibold flex-col flex gap-2 items-left text-left">
                        <UserGroupIcon className="w-4 h-4"/>
                          <p>Capacity</p>
                      </div>
                    </CardHeader>

                    <CardContent className="flex flex-row items-center justify-center p-0 h-full">
                      <div className="h-full px-4 border-border border">
                      <p className="text-[48px] font-bold">{assignment.current_capacity}</p>
                      </div>
                      <div className="h-full px-4 border-border border border-x-0">
                      <p className="text-[48px] font-bold">{assignment.max_capacity}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/*Schedule*/}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-regular">Schedule</h3>
                      <div className="flex flex-wrap sm:flex-row gap-2">
                        {assignment.schedule.map((day, index) => (
                          <div key={index} className="text-xs w-fit h-fit p-2 px-4 border-border border  rounded-full text-muted-foreground">
                            {day}
                          </div>
                        ))}
                      </div>

                      <h3 className="text-sm font-regular">Time</h3>
                      <div className="flex flex-col sm:flex-row gap-2">
                          <div className="text-xs w-fit h-fit p-2 px-4 border-border border  rounded-full text-muted-foreground">
                            {assignment.time_availability}
                          </div>
                      </div>
                    </div>

                  {/*Button*/}    
                  <div className="gap-2 flex flex-col">

                    <Dialog>
                      <DialogTrigger> 
                        <Button variant="default" className="rounded-full w-full bg-secondary text-primary-foreground">
                          <BookOpenIcon className="h-4 w-4 mr-2" />
                          Book this Trainer
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
                          <Button variant="secondary" className="bg-primary text-primary-foreground">Yes, Book this Trainer</Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger> 
                        <Button variant="outline" className="rounded-full w-full">
                        How to Pay
                        <QuestionMarkCircleIcon className="h-4 w-4 ml-2" />
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
          ) : (
            <p className="text-md text-muted-foreground mt-6">No assignment available for this trainer.</p>
          )}
        </CardContent>
        <CardFooter className="p-6">
        </CardFooter>
      </Card>
    </div>
  );
}
