import type { Metadata } from "next";
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
  return (
    <html lang="en" className="dark">
      <body  className={geistSans.variable}>
        <div>
          <NavBar/>
          {children}
          <Footer/>
        </div>
      </body>
    </html>
  );
}
