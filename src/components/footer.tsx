"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { InformationCircleIcon, ArrowUpLeftIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import logo from '../assets/logos/logodark.png';
import dynamic from 'next/dynamic';

export interface footProps extends React.HTMLAttributes<HTMLDivElement> {}

const Footer: React.FC<footProps> = ({ className }) => {
  const [isMounted, setIsMounted] = useState(false); // Add state to check if the component has mounted

  // Run useEffect only once to set the isMounted flag after component mounts
  useEffect(() => {
    setIsMounted(true); // Component is mounted on the client
  }, []);

  //Footer Links
  const [links] = useState([
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ]);

  // Ensure that the content renders only on the client side
  if (!isMounted) {
    return null; // Do not render anything until mounted on the client
  }

  return (
    <div className={`flex flex-col md:flex-row items-start w-full h-full bg-black text-white justify-between p-12 border border-border ${className}`}>
      
      {/* Left Column - Heading and Logo */}
      <div className='text-xl font-extrabold items-start flex flex-col gap-8'>
        {/* Heading */}
        <h1 className='text-3xl text-wrap w-full md:w-[340px]'>Start your Fitness Journey Today</h1>
      </div>

      {/* Middle Column - Links */}
      <div className='text-xl items-start flex flex-col gap-4 mt-8 md:mt-0'>
        {/* Links Heading */}
        <h1 className='text-xl font-semibold'>Links</h1>
        {/* Dynamic Links */}
        <div className='flex flex-col gap-2 text-sm font text-muted-foreground'>
          {links.map((link, index) => (
            <a key={index} href={link.href} className='hover:text-foreground'>
              {link.name}
            </a>
          ))}
        </div>
      </div>

      {/* Right Column - Buttons */}
      <div className="flex flex-col md:flex-row gap-4 mt-8 md:mt-0">
        <Button className='rounded-3xl gap-2 flex bg-transparent' variant='outline'>
          Privacy Policy
        </Button>
        <Button className='rounded-3xl gap-2 flex bg-transparent' variant='outline'>
          <InformationCircleIcon className="h-4 w-4" />
          About Us
        </Button>
        <Button className='rounded-3xl gap-2 flex ' variant='secondary'>
          <ArrowUpLeftIcon className="h-4 w-4" />
          Get Started Now
        </Button>
      </div>
    </div>
  );
};

export { Footer };
export default dynamic(() => Promise.resolve(Footer), { ssr: false });
