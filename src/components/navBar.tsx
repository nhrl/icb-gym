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
import useSWR from "swr";
import CryptoJS from "crypto-js";
import { deleteCookie } from 'cookies-next';
// Navbar component
export interface navProps extends React.HTMLAttributes<HTMLDivElement> {}

const NavBar: React.FC<navProps> = ({ className }) => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const api = process.env.NEXT_PUBLIC_API_URL;

  // Fetch the user ID from the cookie only after the component is mounted
  useEffect(() => {
    const fetchUserFromCookie = () => {
      const secretKey =
        process.env.NEXT_PUBLIC_SECRET_KEY || "lhS7aOXRUPGPDId6mmHJdA00p39HAfU4";
      const cookies = document.cookie
        .split("; ")
        .reduce((acc: { [key: string]: string }, cookie) => {
          const [name, value] = cookie.split("=");
          acc[name] = value;
          return acc;
        }, {});

      const userCookie = cookies["user"];
      if (!userCookie) return null;

      try {
        const decryptedUserBytes = CryptoJS.AES.decrypt(userCookie, secretKey);
        const decryptedUser = JSON.parse(
          decryptedUserBytes.toString(CryptoJS.enc.Utf8)
        );
        return decryptedUser.id;
      } catch (error) {
        console.error("Error decrypting the user cookie", error);
        return null;
      }
    };

    const id = fetchUserFromCookie();
    setUserId(id);
  }, []); // Run only once on mount

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  // Use SWR to fetch user data, but only when the user ID is available
  const { data } = useSWR(
    userId ? `${api}/api/register/customer?id=${userId}` : null,
    fetcher,
    { revalidateOnFocus: true }
  );

  useEffect(() => {
    if (data && data.customer && data.customer.length > 0) {
      const customer = data.customer[0];
      const formattedUser = {
        isLoggedIn: true,
        name: customer.firstname,
        avatar: customer.profile_img,
      };
      setUser(formattedUser);
    }
  }, [data]);

  const handleSignupClick = () => setIsSignupModalOpen(true);
  const handleLoginClick = () => setIsLoginModalOpen(true);
  const handleLogout = () => {
    setUser(null);
    deleteCookie('access_token');  
    deleteCookie('user');
    window.location.replace('/');
  }
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  return (
    <>
      <div
        className={`top-0 sticky bg-background/80 backdrop-filter backdrop-blur z-[200] flex items-center w-full justify-between p-4 border border-border rounded-2xl ${className}`}
      >
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

      {isSignupModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[300] bg-background/50">
          <SignupModal />
        </div>
      )}

      {isLoginModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[300] bg-background/50">
          <LoginModal />
        </div>
      )}
    </>
  );
};

export { NavBar };
