"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { InformationCircleIcon, ArrowUpLeftIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../assets/logos/logodark.png';
import dynamic from 'next/dynamic';
import SignupModal from './signupModal'; // Import SignupModal

export interface footProps extends React.HTMLAttributes<HTMLDivElement> {}

const Footer: React.FC<footProps> = ({ className }) => {
  const [isMounted, setIsMounted] = useState(false); // Add state to check if the component has mounted
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false); // State to control SignupModal visibility

  // Run useEffect only once to set the isMounted flag after component mounts
  useEffect(() => {
    setIsMounted(true); // Component is mounted on the client
  }, []);

  //Footer Links
  const [links] = useState([
    { name: 'Facebook', href: 'https://www.facebook.com/search/top?q=incredoball%20sports%20and%20development' },
    { name: 'Instagram', href: '/about' },
  ]);

  if (!isMounted) {
    return null;
  }

  const handleGetStartedClick = () => {
    setIsSignupModalOpen(true); 
  };

  const handleCloseSignup = () => {
    setIsSignupModalOpen(false); 
  };

  return (
    <div className={`flex flex-col md:flex-row items-start w-full h-full bg-[#09090b] text-white justify-between p-12 px-16 border-t border-border ${className}`}>
      
      {/* Left Column - Heading and Logo */}
      <div className='text-xl font-extrabold items-start flex flex-col gap-8'>
        {/* Heading */}
        <h1 className='text-3xl text-wrap w-full md:w-[340px]'>Start your Fitness Journey Today</h1>
        <Button 
          className='rounded-3xl gap-2 flex' 
          variant='secondary' 
          onClick={handleGetStartedClick} // Open SignupModal on button click
        >
          <ArrowUpLeftIcon className="h-4 w-4" />
          Get Started Now
        </Button>
      </div>

      {/* Middle Column - Links */}
      <div className='text-xl items-start flex flex-col gap-4 mt-8 md:mt-0'>
        {/* Links Heading */}
        <h1 className='text-lg font-semibold'>Social Media </h1>
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
      <div className='flex flex-col gap-4'>
      <div className="flex flex-col md:flex-row gap-2 mt-8 md:mt-0">
        <Button className='rounded-3xl gap-2 flex bg-transparent' variant='outline'>
          <Link href="/">
            Home
          </Link>
        </Button>

        <Button className='rounded-3xl gap-2 flex bg-transparent' variant='outline'>
          <InformationCircleIcon className="h-4 w-4" />
          <Link href="/privacy-policy">
            Privacy Policy
          </Link>
        </Button>
      </div>

      <div className='text-sm  flex flex-col gap-1 ml-4'>
        <h3 className='text-foreground'>Contact Us</h3>
        <p className='text-muted-foreground'>+63 917 722 1523</p>
      </div>


      <Link href="https://www.google.com/maps/place/Incredoball+Sports+and+Development+Center/@9.3197064,123.2933125,15z/data=!4m6!3m5!1s0x33ab6febb3194d2f:0x3132e37cfcf92748!8m2!3d9.3197064!4d123.2933125!16s%2Fg%2F11fll2bjx1?entry=ttu&g_ep=EgoyMDI0MTAyOS4wIKXMDSoASAFQAw%3D%3D" className='text-sm text-muted-foreground ml-2 flex flex-row align-top hover:text-foreground'><MapPinIcon className='w-3 h-3 mr-1'/>E.J. Blanco Extension 6200 <br /> Daro, Philippines</Link>

    
      </div>

      {/* Signup Modal */}
      {isSignupModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[300] bg-black/50">
          <SignupModal onClose={handleCloseSignup} /> {/* Pass the close function to modal */}
        </div>
      )}
    </div>
  );
};

export { Footer };
export default dynamic(() => Promise.resolve(Footer), { ssr: false });
