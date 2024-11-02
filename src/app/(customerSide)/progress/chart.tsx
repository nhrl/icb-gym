"use client"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"
import useSWR from 'swr';
import CryptoJS from 'crypto-js';

const chartConfig = {
  workouts: {
    label: "Workouts",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function Barchart() {
  const [chartData, setChartData] = useState<{ month: string; workouts: number }[]>([]);

  const api = process.env.NEXT_PUBLIC_API_URL;
  const fetchUserFromCookie = () => {
    if (typeof window === "undefined") return null;
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || "lhS7aOXRUPGPDId6mmHJdA00p39HAfU4";
    const cookies = document.cookie.split("; ").reduce((acc: { [key: string]: string }, cookie) => {
      const [name, value] = cookie.split("=");
      acc[name] = value;
      return acc;
    }, {});
  
    const userCookie = cookies["user"];
    if (!userCookie) return null;
  
    try {
      const decryptedUserBytes = CryptoJS.AES.decrypt(userCookie, secretKey);
      const decryptedUser = JSON.parse(decryptedUserBytes.toString(CryptoJS.enc.Utf8));
      return decryptedUser.id;
    } catch (error) {
      console.error("Error decrypting user cookie:", error);
      return null;
    }
  };

  const userId = fetchUserFromCookie();
  const { data, error } = useSWR(`${api}/api/customer/progress/workoutCount?id=${userId}`, fetcher);

  // Update chart data when fetched data changes
  useEffect(() => {
    if (data?.data) {
      setChartData(data.data);
    }
  }, [data]);

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle>Workouts per Month</CardTitle>
        <CardDescription>January - December 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} style={{ height: '100%', width: '100%' }}>
          <BarChart data={chartData} width={500} height={300}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="workouts" fill="var(--color-workouts)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total workouts for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}

export default Barchart;
