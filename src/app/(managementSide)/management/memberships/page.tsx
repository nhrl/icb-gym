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
import { MembershipRegistration, columns } from './columns';
import { DataTable } from './datatable';

const api = process.env.NEXT_PUBLIC_API_URL;

// Sample chart data
const chartData = [
  { month: "January", memberships: 20 },
  { month: "February", memberships: 50 },
  { month: "March", memberships: 35 },
  { month: "April", memberships: 60 },
  { month: "May", memberships: 40 },
  { month: "June", memberships: 70 },
  { month: "August", memberships: 20 },
  { month: "September", memberships: 90 },
  { month: "October", memberships: 80 },
  { month: "November", memberships: 100 },
  { month: "December", memberships: 120 },
];

// Chart configuration
const chartConfig = {
  memberships: {
    label: "memberships",
    color: "hsl(var(--chart-1))",
  },
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Page() {
  const { data, error, isLoading, mutate } = useSWR(`${api}/api/manager/service`, fetcher, { //Lihug lang ko update kel
    revalidateOnFocus: true,
  });

  if (error) return <div>Error loading memberships</div>;
  if (isLoading) return <div>Loading...</div>;

  const totalMemberships = data?.data.length || 0;

  // Get the last two months of data
  const lastMonthData = chartData[chartData.length - 2]?.memberships || 0;
  const currentMonthData = chartData[chartData.length - 1]?.memberships || 0;

  // Calculate the trending percentage
  const trendingPercentage = lastMonthData
    ? ((currentMonthData - lastMonthData) / lastMonthData) * 100
    : 0;

  // Determine the color for the percentage based on the trend direction
  const trendingPercentageColor = trendingPercentage >= 0 ? 'text-green-400' : 'text-destructive';

  // Format the trending message with only the percentage colored
  const trendingText = (
    <>
      Trending {trendingPercentage >= 0 ? 'up' : 'down'} by{" "}
      <span className={trendingPercentageColor}>
        {Math.abs(trendingPercentage).toFixed(2)}%
      </span>
    </>
  );

  // Get the current year dynamically
  const currentYear = new Date().getFullYear();

  // Dynamic date range with the current year
  const dateRange = `${chartData[0].month} - ${chartData[chartData.length - 1].month} ${currentYear}`;

  return (
    <div className="flex flex-col w-full p-[16px] justify-center sm:p-[32px] h-fit">
      <div className="flex flex-col w-full h-full items-center gap-4">

        {/* Data summaries */}
        <div className='flex flex-col sm:flex-row gap-4 w-full'>

          {/* Total memberships Card */}
          <Card className='w-full p-4 rounded-xl'>
            <CardHeader>
              <CardTitle>Total Memberships</CardTitle>
              <CardDescription>
                Showing membership trends for the last 6 months
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
                    <linearGradient id="fillmemberships" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-memberships)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-memberships)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="memberships"
                    type="natural"
                    fill="url(#fillmemberships)"
                    fillOpacity={0.4}
                    stroke="var(--color-memberships)"
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

          {/* Unconfirmed memberships Card */}
          <Card className='w-full p-4 rounded-xl justify-center items-center flex flex-col'>
            <CardHeader>
              <CardTitle className='text-center'>Unconfirmed memberships</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[50px] font-black text-primary">
                {data?.data.filter((item: any) => item.status === 'unconfirmed').length || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="container p-8 border bg-card rounded-xl h-fit w-full">
          <DataTable columns={columns} data={data.data} mutate={mutate} />
        </div>
      </div>
    </div>
  );
}
