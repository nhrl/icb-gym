import React from 'react';
import { Equipment, Maintenance, columns } from "./columns"; // Import Equipment and updated columns
import { DataTable } from "./datatable"; // Assuming DataTable is set up for the equipment data

// Mock data for Equipment and Maintenance
async function getData(): Promise<Equipment[]> {
  return [
    {
      equipment_id: 1,
      name: 'Treadmill',
      quantity: 5,
      purchase_date: new Date("2020-07-10"),
    },
    {
      equipment_id: 2,
      name: 'Dumbbells',
      quantity: 50,
      purchase_date: new Date("2019-06-15"),
    },
    {
      equipment_id: 3,
      name: 'Stationary Bike',
      quantity: 8,
      purchase_date: new Date("2021-09-20"),
    },
    {
      equipment_id: 4,
      name: 'Rowing Machine',
      quantity: 3,
      purchase_date: new Date("2018-04-10"),
    },
    {
      equipment_id: 5,
      name: 'Leg Press',
      quantity: 2,
      purchase_date: new Date("2021-11-25"),
    },
    {
      equipment_id: 6,
      name: 'Yoga Mats',
      quantity: 100,
      purchase_date: new Date("2022-01-05"),
    },
    {
      equipment_id: 7,
      name: 'Elliptical Trainer',
      quantity: 4,
      purchase_date: new Date("2020-03-14"),
    },
    {
      equipment_id: 8,
      name: 'Kettlebells',
      quantity: 40,
      purchase_date: new Date("2022-02-11"),
    },
  ];
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
