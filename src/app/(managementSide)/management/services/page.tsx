import React from 'react';
import { Service, columns } from "./columns";
import { DataTable } from "./datatable";

// API URL
const api = process.env.NEXT_PUBLIC_API_URL;

// Async function to fetch the data with caching
async function getData(): Promise<Service[]> {
  // Fetch the data and enable server-side caching using 'next' object
  const res = await fetch(`${api}/api/manager/service`, {
    next: { revalidate: 1 }, // Revalidate cache every 60 seconds
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await res.json();
  return data.data;
}

export default async function Page() {
  const data = await getData();

  return (
    <div className="flex flex-col w-full p-[16px] justify-center sm:p-[32px] h-fit">
      {/* Main content */}
      <div className="flex flex-grow w-full h-full items-center">
        <div className="container p-8 border bg-card rounded-xl h-fit w-full">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
}
