"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { InformationCircleIcon, ArrowUpLeftIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import logo from '../assets/logos/logodark.png';

export interface footProps extends React.HTMLAttributes<HTMLDivElement> {}

const Footer: React.FC<footProps> = ({ className }) => {
  
  //Footer Links
  const [links] = useState([
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ]);

  return (
    <main className={`flex flex-col md:flex-row items-start w-full justify-between p-12 border border-zinc-800 rounded-2xl ${className}`}>
      
      {/* Left Column - Heading and Logo */}
      <div className='text-xl font-extrabold items-start flex flex-col gap-8'>
        {/* Heading */}
        <h1 className='text-3xl text-wrap w-full md:w-[340px]'>Start your Fitness Journey Today</h1>
        {/* Logo */}
        <div className='flex flex-row gap-2'>
          <Image src={logo} alt="icblogo" className='inline h-8 w-8' />
          <div>Incredoball</div>
        </div>
      </div>

      {/* Middle Column - Links */}
      <div className='text-xl items-start flex flex-col gap-4 mt-8 md:mt-0'>
        {/* Links Heading */}
        <h1 className='text-xl font-semibold'>Links</h1>
        {/* Dynamic Links */}
        <div className='flex flex-col gap-2 text-sm font text-zinc-600'>
          {links.map((link, index) => (
            <a key={index} href={link.href} className='hover:text-white'>
              {link.name}
            </a>
          ))}
        </div>
      </div>

      {/* Right Column - Buttons */}
      <div className="flex flex-col md:flex-row gap-4 mt-8 md:mt-0">
        <Button className='rounded-3xl gap-2 flex' variant='outline'>
          Privacy Policy
        </Button>
        <Button className='rounded-3xl gap-2 flex' variant='outline'>
          <InformationCircleIcon className="h-4 w-4" />
          About Us
        </Button>
        <Button className='rounded-3xl gap-2 flex' variant='secondary'>
          <ArrowUpLeftIcon className="h-4 w-4" />
          Get Started Now
        </Button>
      </div>
    </main>
  );
};

export { Footer };
