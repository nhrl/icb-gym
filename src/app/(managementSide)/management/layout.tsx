import { SideBar } from "@/components/sideBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="">
      <body>
        <div className="flex h-screen">
          <SideBar/>
          <div className=" w-full overflow-auto">
            {children} 
          </div>
        </div>
      </body>
    </html>
  );
}
