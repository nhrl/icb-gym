'use client'; // Enables client-side rendering
import React from 'react';
import useSWR from 'swr';  // SWR for client-side data fetching
import { Equipment, Maintenance, columns } from "./columns"; // Import Equipment and updated columns
import { DataTable } from "./datatable"; // Assuming DataTable is set up for the equipment data

// Mock data for Equipment and Maintenance
const api = process.env.NEXT_PUBLIC_API_URL;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Page() {
  const { data, error, isLoading, mutate } = useSWR(`${api}/api/manager/equipment`, fetcher, {
    revalidateOnFocus: true, // Auto revalidate when window refocuses
  });

  if (error) return <div>Error loading services</div>;
  if (isLoading) return <div>Loading...</div>; // Show loading while fetching data

  return (
    <div className="flex flex-col w-full p-[16px] justify-center sm:p-[32px] h-fit">
      {/* Main content */}
      <div className="flex flex-grow w-full h-full items-center">
        <div className="container p-8 border bg-card rounded-xl h-fit w-full">
          <DataTable columns={columns} data={data.data} mutate={mutate}/> {/* Pass the updated data and columns */}
        </div>
      </div>
    </div>
  );
}