"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import logo from "../assets/logos/logodark.png";
import SignupModal from "./signupModal";
import LoginModal from "./loginModal";
import { ChevronDownIcon, SunIcon, MoonIcon, Bars3Icon} from "@heroicons/react/24/outline"; // Import MoonIcon
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useSWR from "swr";
import CryptoJS from "crypto-js";
import { deleteCookie } from "cookies-next";

export const NavBar: React.FC = () => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>("light"); // Track theme state
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // Initialize the theme based on localStorage or system preference
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

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
  }, []);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

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

  const handleCloseSignup = () => {
    setIsSignupModalOpen(false);
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };



  const handleSignupClick = () => setIsSignupModalOpen(true);
  const handleLoginClick = () => setIsLoginModalOpen(true);
  const handleLogout = () => {
    setUser(null);
    deleteCookie("access_token");
    deleteCookie("user");
    window.location.replace("/");
  };
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  return (
    <>
      <div className="top-0 z-50 sticky bg-background flex items-center w-full justify-between p-4 ">
        <Link href="/" passHref>
          <div className="text-2xl font-black items-center flex gap-2 cursor-pointer">
            <Image src={logo} alt="icblogo" className="inline h-8 w-8" priority />
            <span className="hidden sm:block">Incredoball</span>
          </div>
        </Link>

        <div className=" flex gap-2 flex-row items-center w-full justify-end">
          {user?.isLoggedIn ? (
            <>
            {/*  links */}
            <div className="hidden sm:block md:block w-full" >
              <div className="flex flex-row text-xs gap-8 w-full justify-center">
              <Link href="/booking-services" passHref>
                  <span>Booking</span>
              </Link>

              <Link href="/programs" passHref>
                  <span>Workouts</span>
              </Link>

              <Link href="/diet-plans" passHref>
                  <span>Dietplans</span>
              </Link>
              </div>
            </div>

            
            <div className="block sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full p-[4px] px-2 h-fit">
                    <Bars3Icon className="h-6 w-6 text-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem > 
                    <Link href="/booking-services" passHref>
                    <span>Booking</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/programs" passHref>
                    <span>Workouts</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <DropdownMenu onOpenChange={toggleDropdown}>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2 cursor-pointer p-2 rounded-full" variant="outline">
                  <Avatar className="w-6 h-6">
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
                  <span className="font-medium hidden sm:block">Hello, {user.name}</span>
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 mt-2 z-[300]">
                <Link href="/user-profile" passHref>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
              <div onClick={toggleTheme} className="cursor-pointer">
                {theme === "light" ? (
                  <Button className="rounded-full bg-purple-600">
                    <MoonIcon className="h-4 w-4 text-background" />
                  </Button>
                ) : (
                  <Button className="rounded-full bg-[#CCFF00]">
                    <SunIcon className="h-4 w-4 text-background" />
                  </Button>
                )}
              </div>
            </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                className="font-medium w-fit gap-2 rounded-full hidden sm:block"
                variant="ghost"
                onClick={handleLoginClick}
              >
                Login
              </Button>
              <Button
                className="font-medium rounded-full hidden sm:block"
                variant="secondary"
                onClick={handleSignupClick}
              >
                Register an Account
              </Button>

              <div className="block sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger className="rounded-full p-[4px] px-2 h-fit">
                      <Bars3Icon className="h-6 w-6 text-foreground" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleLoginClick}>Login</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignupClick}>Register an Account</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div onClick={toggleTheme} className="cursor-pointer ">
                {theme === "light" ? (
                  <Button className="rounded-full bg-purple-600">
                    <MoonIcon className="h-4 w-4 text-background" />
                  </Button>
                ) : (
                  <Button className="rounded-full bg-[#CCFF00]">
                    <SunIcon className="h-4 w-4 text-background" />
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {isSignupModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[300] bg-black/50">
          <SignupModal onClose={handleCloseSignup}/>
        </div>
      )}

      {isLoginModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[300] bg-black/50">
          <LoginModal onClose={handleCloseLogin}/>
        </div>
      )}
    </>
  );
};
