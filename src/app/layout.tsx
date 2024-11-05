"use client";

import { usePathname } from "next/navigation";
import localFont from "next/font/local";
import { Footer } from "../components/footer";
import { NavBar } from "../components/navBar";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff", // Ensure the correct path
  variable: "--font-geist-sans",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Check if the current path is in the management section
  const isManagementLayout = pathname.startsWith("/management");

  return (
    <html lang="en" className={isManagementLayout ? "" : "dark"}>
      <body  className={geistSans.variable}
        style={{ letterSpacing: "0.1px" }} suppressHydrationWarning>
        {!isManagementLayout && <NavBar />}
        <main>{children}</main>
        {!isManagementLayout && <Footer />}
      </body>
    </html>
  );
}