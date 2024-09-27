import React from 'react';
import { Equipment, Maintenance, columns } from "./columns"; // Import Equipment and updated columns
import { DataTable } from "./datatable"; // Assuming DataTable is set up for the equipment data

// Mock data for Equipment and Maintenance
const api = process.env.NEXT_PUBLIC_API_URL;
async function getData(): Promise<Equipment[]> {
  // Fetch data from your API here.
  const res = await fetch(`${api}/api/manager/equipment?timestamp=${new Date().getTime()}`);
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
          <DataTable columns={columns} data={data} /> {/* Pass the updated data and columns */}
        </div>
      </div>
    </div>
  );
}