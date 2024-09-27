import React from 'react';
import { Trainers, columns } from "./columns"
import { DataTable } from "./datatable"
import { SideBar } from '@/components/sideBar';

const api = process.env.NEXT_PUBLIC_API_URL;
async function getData(): Promise<Trainers[]> {
  const res = await fetch(`${api}/api/manager/trainer?timestamp=${new Date().getTime()}`);
  const data = await res.json();
  return data.trainers;
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




