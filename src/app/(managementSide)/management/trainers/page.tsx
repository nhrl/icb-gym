import React from 'react';
import { Trainers, columns } from "./columns"
import { DataTable } from "./datatable"
import { SideBar } from '@/components/sideBar';

async function getData(): Promise<Trainers[]> {
  return [
    {
      trainer_id: 1,
      firstName: 'John',
      lastName: 'Mayer',
      email: 'johnmayer@su.edu.ph',
      speciality: 'Weight Loss',
      availability: "Available"
    },
    {
      trainer_id: 2,
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@su.edu.ph',
      speciality: 'Taekwondo',
      availability: "Full"
    },
    {
      trainer_id: 3,
      firstName: 'Nhoriel',
      lastName: 'Balenzua',
      email: 'nhorielbalenzua@su.edu.ph',
      speciality: 'Yoga',
      availability: "Available"
    },
    {
      trainer_id: 4,
      firstName: 'Aris',
      lastName: 'Co',
      email: 'arisaco@su.edu.ph',
      speciality: 'Yoga',
      availability: "Full"
    },
    {
      trainer_id: 5,
      firstName: 'Anthony',
      lastName: 'Virtucio',
      email: 'anthonyvirtucio@su.edu.ph',
      speciality: 'Weight Lifting',
      availability: "Available"
    },
    {
      trainer_id: 6,
      firstName: 'John',
      lastName: 'Mayer',
      email: 'johnmayer@su.edu.ph',
      speciality: 'Weight Loss',
      availability: "Available"
    },
    {
      trainer_id: 8,
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@su.edu.ph',
      speciality: 'Taekwondo',
      availability: "Full"
    },
    {
      trainer_id: 9,
      firstName: 'Nhoriel',
      lastName: 'Balenzua',
      email: 'nhorielbalenzua@su.edu.ph',
      speciality: 'Yoga',
      availability: "Available"
    },
    {
      trainer_id: 10,
      firstName: 'Nhoriel',
      lastName: 'Balenzua',
      email: 'nhorielbalenzua@su.edu.ph',
      speciality: 'Yoga',
      availability: "Available"
    },
    {
      trainer_id: 11,
      firstName: 'Nhoriel',
      lastName: 'Balenzua',
      email: 'nhorielbalenzua@su.edu.ph',
      speciality: 'Yoga',
      availability: "Available"
    },
    {
      trainer_id: 12,
      firstName: 'Nhoriel',
      lastName: 'Balenzua',
      email: 'nhorielbalenzua@su.edu.ph',
      speciality: 'Yoga',
      availability: "Available"
    }
  ];
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




