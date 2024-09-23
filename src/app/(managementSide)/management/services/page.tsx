import React from 'react';
import { Service, columns } from "./columns";
import { DataTable } from "./datatable";

async function getData(): Promise<Service[]> {
  // Mock data for services
  return [
    {
      id: '1',
      name: 'Personal Training',
      desc: 'One-on-one training sessions with a certified personal trainer.',
    },
    {
      id: '2',
      name: 'Yoga Classes',
      desc: 'Group yoga sessions focusing on flexibility, balance, and relaxation.',
    },
    {
      id: '3',
      name: 'Weight Loss Program',
      desc: 'Comprehensive program including diet plans, workout routines, and personal coaching for weight loss.',
    },
    {
      id: '4',
      name: 'Crossfit Training',
      desc: 'Intensive high-intensity interval training (HIIT) and functional exercises for strength and endurance.',
    },
    {
      id: '5',
      name: 'Zumba Dance Classes',
      desc: 'Fun, energetic dance classes for cardio fitness and coordination improvement.',
    },
    {
      id: '6',
      name: 'Nutritional Counseling',
      desc: 'Guidance on healthy eating habits and personalized meal plans.',
    },
    {
      id: '7',
      name: 'Massage Therapy',
      desc: 'Therapeutic massage services to help relieve muscle tension and improve circulation.',
    },
    {
      id: '8',
      name: 'Bootcamp Training',
      desc: 'Outdoor group fitness training designed to challenge and push physical limits.',
    },
    {
      id: '9',
      name: 'Swimming Lessons',
      desc: 'Beginner and advanced swimming lessons for all ages.',
    },
    {
      id: '10',
      name: 'Pilates Classes',
      desc: 'Low-impact exercises focused on strengthening muscles, improving posture, and increasing flexibility.',
    },
  ];
}

export default async function Page() {

  const data = await getData();

  return (
    <div className="flex flex-col w-full p-[16px] justify-center sm:p-[32px] h-fit">
      {/* Main content */}
      <div className="flex flex-grow w-full h-full items-center">
          <div className="container p-8 border bg-card rounded-xl h-fit w-full ">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
}
