"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import logo from '../assets/logos/logodark.png';
import SignupModal from './signupModal'; // Import the signup modal component
import LoginModal from './loginModal'; // Import the login modal component

// Define the navProps interface correctly
export interface navProps extends React.HTMLAttributes<HTMLDivElement> {}

const NavBar: React.FC<navProps> = ({ className }) => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false); // Signup modal state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // Login modal state
  const [isMounted, setIsMounted] = useState(false); // State to ensure component is mounted

  useEffect(() => {
    setIsMounted(true); // Set to true after the component mounts
  }, []);

  const handleSignupClick = () => {
    setIsSignupModalOpen(true); // Open signup modal
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true); // Open login modal
  };

  const handleCloseModal = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(false);
  };

  if (!isMounted) {
    // Return null or a loading state until the component is mounted
    return null;
  }

  return (
    <>
      {/* Navbar Section */}
      <div className={`top-0 sticky bg-background/80 backdrop-filter backdrop-blur z-[100] flex items-center w-full justify-between p-4 border border-border rounded-2xl ${className}`}>
        <div className='text-xl font-extrabold items-center flex gap-2'>
          <Image src={logo} alt="icblogo" className='inline h-8 w-8'  priority />
          <div>Incredoball</div>
        </div>

        <div className='gap-2 flex'>
          <Button className='font-medium w-fit flex gap-2 rounded-xl' variant='ghost' onClick={handleLoginClick}>Login</Button>
          <Button className='font-medium rounded-xl' variant='ghost' onClick={handleSignupClick}>Signup</Button>
        </div>
      </div>

      {/* Signup Modal */}
      {isSignupModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-background/50">
          <div className="relative">
            <SignupModal />  {/* Render the signup modal */}
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-background/50">
          <div className="relative">
            <LoginModal />  {/* Render the login modal */}
          </div>
        </div>
      )}
    </>
  );
};

export { NavBar };
