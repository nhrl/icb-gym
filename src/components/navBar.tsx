"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import logo from "../assets/logos/logodark.png";
import SignupModal from "./signupModal";
import LoginModal from "./loginModal";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock user data (replace with actual authentication logic in production)
const mockUser = {
  isLoggedIn: true,
  name: "Aris Antonio",
  avatar: "", // Empty means no uploaded avatar yet
};

export interface navProps extends React.HTMLAttributes<HTMLDivElement> {}

const NavBar: React.FC<navProps> = ({ className }) => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Track dropdown open state

  useEffect(() => {
    setIsMounted(true);
    setUser(mockUser); // Simulate fetching user data (replace with real login logic)
  }, []);

  const handleSignupClick = () => setIsSignupModalOpen(true);
  const handleLoginClick = () => setIsLoginModalOpen(true);
  const handleCloseModal = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null); // Clear user state
  };

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev); // Toggle dropdown state

  if (!isMounted) return null; // Prevent SSR issues

  return (
    <>
      {/* Navbar Section */}
      <div
        className={`top-0 sticky bg-background/80 backdrop-filter backdrop-blur z-[200] flex items-center w-full justify-between p-4 border border-border rounded-2xl ${className}`}
      >
        {/* Logo - Link to Home Page */}
        <Link href="/" passHref>
          <div className="text-xl font-extrabold items-center flex gap-2 cursor-pointer">
            <Image src={logo} alt="icblogo" className="inline h-8 w-8" priority />
            <span>Incredoball</span>
          </div>
        </Link>

        <div className="gap-2 flex items-center">
          {user?.isLoggedIn ? (
            <DropdownMenu onOpenChange={toggleDropdown}>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <span className="font-medium">Hello, {user.name}</span>
                  <Avatar className="w-10 h-10">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt="User Avatar"
                        layout="fill"
                        objectFit="cover"
                      />
                    ) : (
                      <AvatarFallback>
                        {user.name[0]}
                        {user.name.split(" ")[1][0]}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 mt-2 z-[300]">
                <Link href="/user-profile" passHref>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                className="font-medium w-fit flex gap-2 rounded-xl"
                variant="ghost"
                onClick={handleLoginClick}
              >
                Login
              </Button>
              <Button
                className="font-medium rounded-xl"
                variant="ghost"
                onClick={handleSignupClick}
              >
                Signup
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Signup Modal */}
      {isSignupModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[300] bg-background/50">
          <div className="relative">
            <SignupModal />
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[300] bg-background/50">
          <div className="relative">
            <LoginModal />
          </div>
        </div>
      )}
    </>
  );
};

export { NavBar };
