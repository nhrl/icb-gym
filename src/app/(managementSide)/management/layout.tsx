"use client";
import { SideBar } from "@/components/sideBar";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);

  // Ensures the component is mounted before rendering to avoid hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Return null to avoid rendering until the component is mounted
    return null;
  }

  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="w-full overflow-auto">{children}</div>
    </div>
  );
}
