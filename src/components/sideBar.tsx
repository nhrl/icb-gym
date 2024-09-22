"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Import Link for navigation
import logo from '../assets/logos/logodark.png';
import { Button } from '@/components/ui/button';
import { 
  ArrowRightEndOnRectangleIcon, 
  ArrowUpLeftIcon,
  UserIcon,
  UserGroupIcon,
  IdentificationIcon,
  BoltIcon,
  WrenchIcon,
  ClipboardDocumentIcon,
  CubeTransparentIcon,
  CalendarIcon,
  Bars3BottomLeftIcon
} from '@heroicons/react/24/outline';

export interface SideProps extends React.HTMLAttributes<HTMLDivElement> {}

const SideBar: React.FC<SideProps> = ({ className }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false); // Added for mobile

  // Function to toggle sidebar collapse/expand
  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  // Function to handle button clicks and set the active button
  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  // Icon mappings
  const iconMapping: { [key: string]: JSX.Element } = {
    'Account': <UserIcon className="h-4 w-4" />,
    'Services': <WrenchIcon className="h-4 w-4" />,
    'Trainers': <UserGroupIcon className="h-4 w-4" />,
    'Diet Plans': <ClipboardDocumentIcon className="h-4 w-4" />,
    'Workouts': <BoltIcon className="h-4 w-4" />,
    'Equipment': <CubeTransparentIcon className="h-4 w-4" />,
    'Bookings': <CalendarIcon className="h-4 w-4" />,
    'Memberships': <IdentificationIcon className="h-4 w-4" />
  };

  // Function to render account sidebar buttons
  const accountModule = () => {
    const buttons = [{ name: 'Account', path: '/account' }];

    return buttons.map((button) => (
      <Link href={button.path} key={button.name}>
        <Button
          className={`w-full text-xs justify-start gap-2 ${activeButton === button.name ? 'bg-muted' : ''}`}
          onClick={() => handleButtonClick(button.name)}
          variant='ghost'
        >
          {iconMapping[button.name]} {/* Render the icon */}
          {button.name}
        </Button>
      </Link>
    ));
  };

  // Function to render maintenance sidebar buttons
  const maintenanceModules = () => {
    const buttons = [
      { name: 'Services', path: '/management/services' },
      { name: 'Trainers', path: '/management/trainers' },
      { name: 'Diet Plans', path: '/management/dietplans' },
      { name: 'Workouts', path: '/management/workouts' },
      { name: 'Equipment', path: '/management/equipment' },
    ];

    return buttons.map((button) => (
      <Link href={button.path} key={button.name}>
        <Button
          className={`w-full text-xs gap-2 justify-start ${activeButton === button.name ? 'bg-muted' : ''}`}
          onClick={() => handleButtonClick(button.name)}
          variant='ghost'
        >
          {iconMapping[button.name]} {/* Render the icon */}
          {button.name}
        </Button>
      </Link>
    ));
  };

  // Function to render transaction sidebar buttons
  const transactionModules = () => {
    const buttons = [
      { name: 'Bookings', path: '/bookings' },
      { name: 'Memberships', path: '/memberships' },
    ];

    return buttons.map((button) => (
      <Link href={button.path} key={button.name}>
        <Button
          className={`w-full text-xs gap-2 justify-start ${activeButton === button.name ? 'bg-muted' : ''}`}
          onClick={() => handleButtonClick(button.name)}
          variant='ghost'
        >
          {iconMapping[button.name]} {/* Render the icon */}
          {button.name}
        </Button>
      </Link>
    ));
  };

  // Mobile Toggle Functionality
  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="sm:hidden flex items-center justify-center p-3 z-50 absolute bg-background/60 border border-border rounded-lg backdrop-filter backdrop-blur">
        <button onClick={toggleMobileSidebar} className="text-foreground focus:outline-none">
            <Bars3BottomLeftIcon className="h-4 w-4" />
        </button>
      </div>

      <aside
        className={`dark h-full border p-4 border-border1 bg-card text-foreground ${
          isCollapsed ? 'w-16' : 'w-64'
        } transition-all duration-300 ${className} ${
          isMobileOpen ? 'block' : 'hidden'
        } sm:block`} // Hide/show sidebar on mobile
      >
        {/* Toggle Button */}
        <div className='flex flex-col justify-between h-full'>
          <div className="flex justify-end p-2">
            <button onClick={toggleSidebar} className="text-foreground focus:outline-none">
              {isCollapsed ? (
                <ArrowUpLeftIcon className="h-4 w-4 hidden md:block" />
              ) : (
                <ArrowUpLeftIcon className="h-4 w-4 rotate-45 hidden md:block" />
              )}
            </button>
          </div>

          {/* Sidebar Content */}
          <div className={`h-full text-xs flex flex-col justify-between w-full transition-opacity duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>
            <div className="pl-4">
              <Image src={logo} alt="icblogo" className='inline h-8 w-8' />
            </div>

            {/* Render Sidebar Buttons */}
            <div className='flex flex-col gap-6'>
              {/* Maintenance Section */}
              <div className="flex flex-col gap-[8px]">
                {accountModule()}
              </div>

              <div className="flex flex-col gap-[8px]">
                <h3 className="text-muted-foreground text-md pl-4">Maintenance</h3>
                {maintenanceModules()}
              </div>

              {/* Transactions Section */}
              <div className="flex flex-col gap-[8px]">
                <h3 className="text-muted-foreground text-md pl-4">Transactions</h3>
                {transactionModules()}
              </div>
            </div>

            <Button variant='outline' className='gap-2 items-center flex flex-row'>
              <ArrowRightEndOnRectangleIcon className="h-4 w-4" />
              Signout
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export { SideBar };
