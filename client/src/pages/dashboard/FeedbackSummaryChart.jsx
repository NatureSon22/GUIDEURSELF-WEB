import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { month: "5", desktop: 1000 },
  { month: "4", desktop: 550 },
  { month: "3", desktop: 320 },
  { month: "2", desktop: 120 },
  { month: "1", desktop: 50 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
};

const FeedbackSummaryChart = () => {
  return (
    <Card className="flex-1 border-none shadow-none">
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px]">
          <BarChart
            accessibilityLayer
            data={chartData}
            barSize={35}
            barGap={0}
            layout="vertical"
            margin={{
              left: -20,
            }}
          >
            <XAxis type="number" dataKey="desktop" />
            <YAxis
              dataKey="month"
              type="category"
              color="black"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="desktop"
              fill="rgba(18, 165, 188, 1)"
              radius={[0, 50, 50, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default FeedbackSummaryChart;
