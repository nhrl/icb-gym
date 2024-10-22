'use client';

import React from 'react';
import useSWR from 'swr';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Booking, columns } from './columns'; // Adjust import paths if needed
import { DataTable } from './datatable';

const api = process.env.NEXT_PUBLIC_API_URL;

// Chart configuration
const chartConfig = {
  bookings: {
    label: "bookings",
    color: "hsl(var(--chart-1))",
  },
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Helper function to group data by month
const getMonthlyBookingData = (data: Booking[]) => {
  const monthlyData: { [key: string]: number } = {};

  // Group data by month
  data.forEach((item) => {
    if (!item.created_at) return; // Skip if date is null or undefined

    const date = new Date(item.created_at);
    if (isNaN(date.getTime())) return; // Skip invalid dates

    const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
    monthlyData[month] = (monthlyData[month] || 0) + 1;
  });

  // Define month order
  const monthOrder = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  // Convert the object into an array and sort it by month order
  const sortedData = Object.entries(monthlyData)
    .map(([month, bookings]) => ({ month, bookings }))
    .sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

  return sortedData;
};

export default function Page() {
  const { data, error, isLoading, mutate } = useSWR(`${api}/api/manager/service`, fetcher, { // Lihug lang ko usab Nhor
    revalidateOnFocus: true,
  });

  if (error) return <div>Error loading bookings</div>;
  if (isLoading) return <div>Loading...</div>;

  // Format data to include relevant fields for Booking
  const formattedData: Booking[] = data.data.map((item: any) => ({
    booking_id: item.booking_id,
    customer_id: item.customer_id,
    trainer_id: item.trainer_id,
    payment_status: item.payment_status,
    confirmation_status: item.confirmation_status,
    created_at: item.created_at,
  }));

  const chartData = getMonthlyBookingData(formattedData);
  const totalBookings = data?.data.length || 0;
  const lastMonthData = chartData[chartData.length - 2]?.bookings || 0;
  const currentMonthData = chartData[chartData.length - 1]?.bookings || 0;

  // Calculate the trending percentage
  const trendingPercentage = lastMonthData
    ? ((currentMonthData - lastMonthData) / lastMonthData) * 100
    : 0;

  const trendingPercentageColor = trendingPercentage >= 0 ? 'text-green-400' : 'text-destructive';

  const trendingText = (
    <>
      Trending {trendingPercentage >= 0 ? 'up' : 'down'} by{" "}
      <span className={trendingPercentageColor}>
        {Math.abs(trendingPercentage).toFixed(2)}%
      </span>
    </>
  );

  const currentYear = new Date().getFullYear();
  const dateRange = chartData.length === 1
    ? `${chartData[0].month} ${currentYear}`
    : chartData.length > 1
    ? `${chartData[0].month} - ${chartData[chartData.length - 1].month} ${currentYear}`
    : `No Data Available for ${currentYear}`;

  return (
    <div className="flex flex-col w-full p-[16px] justify-center sm:p-[32px] h-fit">
      <div className="flex flex-col w-full h-full items-center gap-4">

        {/* Data summaries */}
        <div className='flex flex-col sm:flex-row gap-4 w-full'>

          {/* Total Bookings Card */}
          <Card className='w-full p-4 rounded-xl'>
            <CardHeader>
              <CardTitle>Total Bookings</CardTitle>
              <CardDescription>
                Showing booking trends for the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} style={{ height: '100px', width: '100%' }}>
                <AreaChart
                  data={chartData}
                  width={300}
                  height={150}
                  margin={{ top: 10, left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <defs>
                    <linearGradient id="fillbookings" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-bookings)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-bookings)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="bookings"
                    type="natural"
                    fill="url(#fillbookings)"
                    fillOpacity={0.4}
                    stroke="var(--color-bookings)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-start gap-2 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 font-medium leading-none">
                    {trendingText} <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2 leading-none text-muted-foreground">
                    {dateRange}
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>

          {/* Unconfirmed Bookings Card */}
          <Card className='w-full p-4 rounded-xl justify-center items-center flex flex-col'>
            <CardHeader>
              <CardTitle className='text-center'>Unconfirmed Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[50px] font-black text-primary">
                {data?.data.filter((item: any) => item.confirmation_status === 'Pending').length || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="container p-8 border bg-card rounded-xl h-fit w-full">
          <DataTable columns={columns} data={formattedData} mutate={mutate} />
        </div>
      </div>
    </div>
  );
}
