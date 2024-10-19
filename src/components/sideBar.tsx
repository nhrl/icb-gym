'use client'
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../assets/logos/logodark.png";
import { Button } from "@/components/ui/button";
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
  Bars3BottomLeftIcon,
  MoonIcon,
  SunIcon
} from "@heroicons/react/24/outline";
import { useRouter } from 'next/router';
import { deleteCookie } from 'cookies-next';

export interface SideProps extends React.HTMLAttributes<HTMLDivElement> {}

const SideBar: React.FC<SideProps> = ({ className }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [theme, setTheme] = useState('light'); // Track theme state

  useEffect(() => {
    setIsMounted(true); // Ensure sidebar only renders after mount to avoid hydration issues
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Only render the sidebar after the component has mounted to avoid hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

 const signOut = () => {
    deleteCookie('access_token');  
    deleteCookie('user');
    window.location.replace('/');
  };

  // Icon mappings for sidebar buttons
  const iconMapping: { [key: string]: JSX.Element } = {
    Account: <UserIcon className="h-4 w-4" />,
    Services: <WrenchIcon className="h-4 w-4" />,
    Trainers: <UserGroupIcon className="h-4 w-4" />,
    "Diet Plans": <ClipboardDocumentIcon className="h-4 w-4" />,
    Workouts: <BoltIcon className="h-4 w-4" />,
    Equipment: <CubeTransparentIcon className="h-4 w-4" />,
    Bookings: <CalendarIcon className="h-4 w-4" />,
    Memberships: <IdentificationIcon className="h-4 w-4" />,
  };

  // Account Module
  const accountModule = () => {
    const buttons = [{ name: "Account", path: "/management/account" }];
    return buttons.map((button) => (
      <Link href={button.path} key={button.name}>
        <Button
          className={`w-full text-xs justify-start gap-2 ${
            activeButton === button.name ? "bg-muted" : ""
          }`}
          onClick={() => handleButtonClick(button.name)}
          variant="ghost"
        >
          {iconMapping[button.name]}
          {button.name}
        </Button>
      </Link>
    ));
  };

  // Maintenance Module
  const maintenanceModules = () => {
    const buttons = [
      { name: "Services", path: "/management/services" },
      { name: "Trainers", path: "/management/trainers" },
      { name: "Diet Plans", path: "/management/dietplans" },
      { name: "Workouts", path: "/management/workouts" },
      { name: "Equipment", path: "/management/equipment" },
    ];

    return buttons.map((button) => (
      <Link href={button.path} key={button.name}>
        <Button
          className={`w-full text-xs justify-start gap-2 ${
            activeButton === button.name ? "bg-muted" : ""
          }`}
          onClick={() => handleButtonClick(button.name)}
          variant="ghost"
        >
          {iconMapping[button.name]}
          {button.name}
        </Button>
      </Link>
    ));
  };

  // Transaction Module
  const transactionModules = () => {
    const buttons = [
      { name: "Bookings", path: "/bookings" },
      { name: "Memberships", path: "/management/memberships" },
    ];

    return buttons.map((button) => (
      <Link href={button.path} key={button.name}>
        <Button
          className={`w-full text-xs justify-start gap-2 ${
            activeButton === button.name ? "bg-muted" : ""
          }`}
          onClick={() => handleButtonClick(button.name)}
          variant="ghost"
        >
          {iconMapping[button.name]}
          {button.name}
        </Button>
      </Link>
    ));
  };

  // Mobile Toggle Functionality
  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Avoid rendering until mounted to prevent hydration issues
  if (!isMounted) {
    return null;
  }

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
          isCollapsed ? "w-16" : "w-64"
        } transition-all duration-300 ${className} ${
          isMobileOpen ? "block" : "hidden"
        } sm:block`} // Hide/show sidebar on mobile
      >
        {/* Toggle Button */}
        <div className="flex flex-col justify-between h-full">
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
          <div
            className={`h-full text-xs flex flex-col justify-between w-full transition-opacity duration-300 ${
              isCollapsed ? "hidden" : "block"
            }`}
          >
            <div className="pl-4">
              <Image src={logo} alt="icblogo" className="inline h-8 w-8" />
            </div>

            <Button onClick={toggleTheme} variant="outline" className="cursor-pointer">
              {theme === 'light' ? <div className="flex flex-row items-center text-xs"><SunIcon className="h-3 w-3 mr-2" />Light</div>:  <div className="flex flex-row items-center text-xs"><MoonIcon className="h-3 w-3 mr-2" />Dark</div>}
            </Button>

            {/* Render Sidebar Buttons */}
            <div className="flex flex-col gap-6">
              {/* Maintenance Section */}
              <div className="flex flex-col gap-[8px]">{accountModule()}</div>

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

          

            <Button variant="outline" className="gap-2 items-center flex flex-row" onClick={signOut}>
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
