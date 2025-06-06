import useToggleTheme from "@/context/useToggleTheme";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { botUsage } from "@/api/message";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
};

const BotUsage = () => {
  const { isDarkMode } = useToggleTheme((state) => state);
  const { data: chartData, isLoading } = useQuery({
    queryKey: ["bot-usage"],
    queryFn: botUsage,
  });

  return (
    <Card
      className={`flex flex-[1.7] flex-col px-7 py-7 shadow-none ${isDarkMode ? "border-dark-text-base-300-75/50 bg-dark-base-bg" : "bg-white"} transition-colors duration-150`}
    >
      <p
        className={`font-medium ${isDarkMode ? "text-dark-text-base-300" : ""}`}
      >
        Bot Usage
      </p>

      {isLoading ? (
        <Skeleton className={"mt-5 flex-1"} />
      ) : (
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
              style={{
                height: 380,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="step"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="count"
                type="natural"
                stroke="rgba(18, 165, 188, 1)"
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      )}
    </Card>
  );
};

export default BotUsage;
