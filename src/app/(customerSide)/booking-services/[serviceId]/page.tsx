"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useParams } from "next/navigation"; 
import {
  Card,
  CardFooter,
  CardHeader, 
  CardDescription
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MagnifyingGlassIcon, SparklesIcon, HeartIcon, UserGroupIcon, ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { RiAsterisk } from "react-icons/ri";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";

// Mock Data for Services, Trainer Assignments, and Trainers
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
  {
    serviceId: 3,
    name: "Cardio",
    desc: "Boost your stamina with cardio training.",
    photo: "",
  },
  {
    serviceId: 4,
    name: "Pilates",
    desc: "Increase your flexibility and core strength.",
    photo: "/images/invalid-path.jpg",
  },
];

const trainerAssigns = [
  {
    assign_id: 1,
    service_id: 1,
    trainer_id: 1,
    time_availability: "9 AM - 12 PM",
    schedule: "Mon, Wed, Fri",
    max_capacity: 10,
    current_capacity: 6,
    rate: 50,
  },
  {
    assign_id: 1,
    service_id: 1,
    trainer_id: 3,
    time_availability: "9 AM - 12 PM",
    schedule: "Mon, Wed, Fri",
    max_capacity: 20,
    current_capacity: 13,
    rate: 50,
  },
  {
    assign_id: 2,
    service_id: 2,
    trainer_id: 2,
    time_availability: "8 AM - 10 AM",
    schedule: "Tue, Thu",
    max_capacity: 15,
    current_capacity: 10,
    rate: 60,
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
    photo: "https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },

  { 
    trainer_id: 2,
    firstName: "Jane",
    lastName: "Doe",
    specialty: "Yoga",
    email_address: "jane@example.com",
    availability: "Full",
    photo: "https://images.unsplash.com/photo-1627627256672-027a4613d028?q=80&w=1774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },

  { 
    trainer_id: 3,
    firstName: "John",
    lastName: "Dane",
    specialty: "Basketball",
    email_address: "john@example.com",
    photo: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },

];

export default function Page() {
  const { serviceId } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [assignments, setAssignments] = useState<typeof trainerAssigns>([]);
  const [service, setService] = useState<typeof services[0] | null>(null);

  const router = useRouter();
  const handleCardClick = (trainerID:any) => {
    router.push(`/booking-services/${serviceId}/${trainerID}`);
  };

  const [tags] = useState([
    "Book Trainers on Preferred Time",
    "Progress Tracking",
    "Digital Membership Card",
    "Diet Plans",
    "Workout Programs",
    "User Preference Recommendation",
  ]);

  useEffect(() => {
    // Filter assignments by service ID
    const filteredAssignments = trainerAssigns.filter(
      (assign) => assign.service_id.toString() === serviceId
    );
    setAssignments(filteredAssignments);

    // Find the relevant service
    const foundService = services.find(
      (service) => service.serviceId.toString() === serviceId
    );
    setService(foundService || null);
  }, [serviceId]);

  const fallbackImage = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"; 
  const getBackgroundImage = (photo:any) => {
    // Return the photo if it exists, otherwise use the fallback image
    return photo && photo.trim() !== "" ? photo : fallbackImage;
  };

  if (!assignments.length) return <p className="min-w-screen min-h-screen text-center items-center">Loading assignments...</p>;
  if (!service) return <p>Service not found.</p>;


  return (
    <>
      <div className="w-full flex flex-col rounded-2xl">
        {/* Features Section */}
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
        
        {/* Breadcrumb and Title */}
        <div className="flex flex-col w-full gap-6 p-12">
          <div className="w-full h-fit">
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
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex flex-col sm:flex-row w-full justify-between items-center">
            <h1 className="text-[36px] font-black">{service.name}</h1>

            <div className="flex flex-col sm:flex-row gap-2">
              <Input placeholder="Search for trainers..." className="max-w-sm" />
              <Button className="flex flex-row items-center">
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                Search Trainers
              </Button>
              <Button className="flex flex-row items-center" variant="outline">
                <SparklesIcon className="h-4 w-4 mr-2" />
                Show Recommendations
              </Button>
            </div>
          </div>

          {/* Grid Layout for Trainer Assignments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assign) => {
              const trainer = trainers.find(
                (t) => t.trainer_id === assign.trainer_id
              );

              return (
                <Card
                  key={trainer?.trainer_id}
                  className="h-fit border-none rounded-3xl flex flex-col justify-between overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:z-10 cursor-pointer"
                  onClick={() => handleCardClick(trainer?.trainer_id)}
                >
                  <CardHeader className="w-full h-[275px] border-border rounded-3xl rounded-b-none border flex flex-col justify-between p-2"
                    style={{
                    backgroundImage: `url(${getBackgroundImage(trainer?.photo)})`,
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


                      <div className="p-2 px-4 w-fit rounded-full bg-black/90 backdrop-filter backdrop-blur-lg flex items-center justify-center cursor-pointer hover:bg-black/20">
                        <UserGroupIcon className="h-4 w-4 mr-2 text-white" />
                        <div className="flex flex-row gap-2 text-xs text-white">
                          <p>{assign?.current_capacity}</p>
                          <p>of</p>
                          <p>{assign?.max_capacity}</p>
                        </div>
                      </div>
                  </CardHeader>

                  <CardFooter
                    className="text-foreground h-fit flex flex-col justify-between bg-background border-border border 
                    rounded-3xl rounded-t-none p-4 px-6 items-end gap-4"
                  >
                    <div className="font-thin flex flex-row w-full justify-between">
                      <div className="flex flex-col">
                        <span className="font-thin">{trainer?.firstName} {trainer?.lastName}</span>
                        <span className="text-sm text-muted-foreground">{trainer?.email_address}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <p className="">${assign.rate}/Month</p>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="rounded-full">
                      Book Now
                      <ArrowRightCircleIcon className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
}
