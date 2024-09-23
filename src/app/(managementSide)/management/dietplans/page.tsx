import React from 'react';
import { Dietplans, columns } from "./columns"
import { DataTable } from "./datatable"
import { SideBar } from '@/components/sideBar';


async function getData(): Promise<Dietplans[]> {
  // Fetch data from your API here.
  return [
    {
      id: 1,
      name: 'Weight Loss Plan',
      desc: 'A balanced meal plan focused on reducing calorie intake',
      fitness_goal: 'Weight Loss',
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




