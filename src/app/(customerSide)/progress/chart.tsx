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

export const description = "A bar chart"

const chartData = [
  { month: "January", workouts: 186 },
  { month: "February", workouts: 305 },
  { month: "March", workouts: 237 },
  { month: "April", workouts: 73 },
  { month: "May", workouts: 209 },
  { month: "June", workouts: 15 },
]

const chartConfig = {
  workouts: {
    label: "Workouts",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

function Barchart() {
  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle>Workouts per Month</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}  style={{ height: '100%', width: '100%' }}>
          <BarChart accessibilityLayer data={chartData}>
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
            <Bar dataKey="workouts" fill="var(--color-workouts)" radius={8} />
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

export default Barchart