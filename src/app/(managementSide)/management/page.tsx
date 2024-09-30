"use client";  // Ensure the page is rendered on the client side

import React from 'react';

export default function Page() {
  return (
    <div className="flex flex-col w-full p-4">
      {/* Main content */}
      <div className="flex-1">
        <h1 className="font-black text-2xl text-foreground">Dashboard Page</h1>
        <p className="mt-4">
          This is the main content area. When the sidebar is collapsed, this section will expand to fill the available space.
        </p>
        {/* Add more content for the management page here */}
      </div>
    </div>
  );
}
