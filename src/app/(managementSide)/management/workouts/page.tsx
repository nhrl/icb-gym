import React from 'react';
import { Program, columns } from "./columns"
import { DataTable } from "./datatable"
import { SideBar } from '@/components/sideBar';


async function getData(): Promise<Program[]> {
  // Fetch data from your API here.
  return [
    {
      program_id: 1,
      title: 'Weight Loss Plan',
      desc: 'A balanced meal plan focused on reducing calorie intake and burning fat.',
      fitness_level: 'Beginner',
      fitness_goal: 'Weight Loss',
    },
    {
      program_id: 2,
      title: 'Muscle Gain Plan',
      desc: 'A high-protein plan designed to help build muscle mass.',
      fitness_level: 'Intermediate',
      fitness_goal: 'Muscle Gain',
    },
    {
      program_id: 3,
      title: 'General Health Plan',
      desc: 'A comprehensive workout program to improve overall health and fitness.',
      fitness_level: 'Advanced',
      fitness_goal: 'General Health',
    },
    {
      program_id: 4,
      title: 'Endurance Training',
      desc: 'A cardio-intensive plan for boosting stamina and endurance.',
      fitness_level: 'Advanced',
      fitness_goal: 'Endurance',
    },
  ]
}

export default async function Page() {

  const data = await getData()

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




