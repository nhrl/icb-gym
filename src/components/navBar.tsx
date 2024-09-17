"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import logo from '../assets/logos/logodark.png';
import SignupModal from './signupModal'; // Import the signup modal component
import LoginModal from './loginModal'; // Import the login modal component

// Define the navProps interface correctly
export interface navProps extends React.HTMLAttributes<HTMLDivElement> {}

// Fixing the function declaration
const NavBar: React.FC<navProps> = ({ className }) => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false); // Signup modal state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // Login modal state

  const handleSignupClick = () => {
    setIsSignupModalOpen(true); // Open signup modal
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true); // Open login modal
  };


  return (
    <main className={`flex items-center w-full justify-between p-4 border border-zinc-800 rounded-2xl ${className}`}>
      
      <div className='text-xl font-extrabold items-center flex gap-2'>
        <Image src={logo} alt="icblogo" className='inline h-8 w-8' />
        <div>Incredoball</div>
      </div>

      <div className='gap-2 flex'>
        <Button className='font-medium w-fit flex gap-2 rounded-xl' variant='ghost' onClick={handleLoginClick}>Login</Button>
        <Button className='font-medium rounded-xl' variant='ghost' onClick={handleSignupClick}>Signup</Button>
      </div>

      {isSignupModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
        >
          <div className="relative">
            <SignupModal />  {/* Render the signup modal */}
          </div>
        </div>
      )}

      {isLoginModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
        >
          <div className="relative">
            <LoginModal />  {/* Render the login modal */}
          </div>
        </div>
      )}
    </main>
  );
};

// Export the NavBar component properly
export { NavBar };
