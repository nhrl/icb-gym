'use client'; // Enables client-side rendering
import React from 'react';
import useSWR from 'swr';  // SWR for client-side data fetching
import { Program, columns } from "./columns"
import { DataTable } from "./datatable"
import { SideBar } from '@/components/sideBar';


const api = process.env.NEXT_PUBLIC_API_URL;
const fetcher = (url: string) => fetch(url).then((res) => res.json());


export default function Page() {
   // Fetch data using SWR
   const { data, error, isLoading, mutate } = useSWR(`${api}/api/manager/plans/workout`, fetcher, {
    revalidateOnFocus: true, // Auto revalidate when window refocuses
  });

  if (error) return <div>Error loading programs</div>;
  if (isLoading) return <div>Loading...</div>; // Show loading while fetching data

  return (
    <div className="flex flex-col w-full p-[16px] justify-center sm:p-[32px] h-fit">
      {/* Main content */}
      <div className="flex flex-grow w-full h-full items-center">
          <div className="container p-8 border bg-card rounded-xl h-fit w-full ">
          <DataTable columns={columns} data={data.program} mutate={mutate}/>
        </div>
      </div>
    </div>
  );
}




