"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { InformationCircleIcon, ArrowUpLeftIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import logo from '../assets/logos/logodark.png';


export interface footProps extends React.HTMLAttributes<HTMLDivElement> {}

// Fixing the function declaration
const Footer: React.FC<footProps> = ({ className }) => {


  // This function handles closing the modal when clicked outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  
  };

  return (
    <main className={`flex flex-col md:flex-row items-start w-full justify-between p-12 border border-zinc-800 rounded-2xl  ${className}`}>
      
      <div className='text-xl font-extrabold items-start flex flex-col gap-8'>
        {/*Heading */}
        <h1 className='text-3xl text-wrap w-[340px]'>Start your Fitness Journey Today</h1>
        {/*Logo */}
        <div className='flex flex-row gap-2'>
          <Image src={logo} alt="icblogo" className='inline h-8 w-8' />
          <div>Incredoball</div>
        </div>
      </div>

      <div className='text-xl items-left flex flex-col gap-4'>
        {/*Heading */}
        <h1 className='text-xl font-semibold text-wrap w-[340px]'>Links</h1>
        {/*links */}
        <div className='flex flex-col gap-2 text-sm font text-zinc-600'>
          <div>Home</div>
          <div>Services</div>
          <div>Blog</div>
          <div>About Us</div>
          <div>Contact Us</div>
        </div>
      </div>

      <div className="flex md:flex-row gap-4 mt-4 md:mt-0">
          <Button className='rounded-3xl gap-2 flex' variant='outline'><InformationCircleIcon className="h-4 w-4" />About Us</Button>
          <Button className='rounded-3xl gap-2 flex' variant='secondary'><ArrowUpLeftIcon className="h-4 w-4" /> Get Started Now</Button>
        </div>
    </main>
  );
};

// Export the NavBar component properly
export { Footer };
