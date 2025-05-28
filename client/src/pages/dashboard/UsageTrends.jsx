import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
// import { startOfToday, addDays, format } from "date-fns";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ComboBox from "@/components/ComboBox";
import { Button } from "@/components/ui/button";
import { GrPowerReset } from "react-icons/gr";
import { useQuery } from "@tanstack/react-query";
import { getTrends } from "@/api/trend";
import { Skeleton } from "@/components/ui/skeleton";
import useToggleTheme from "@/context/useToggleTheme";

const usage_summary = [
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "year", label: "This year" },
];

const chartConfig = {
  views: {
    label: "Page Visits",
  },
  usage: {
    label: "usage",
    color: "rgba(18, 165, 188, 1)",
  },
};

const UsageTrends = () => {
  const [filter, setFilter] = useState([{ id: "date", value: "This week" }]);
  const [reset, setReset] = useState(false);
  const { data: dataTrend, isLoading } = useQuery({
    queryKey: ["usage", filter[0].value],
    queryFn: () => getTrends(filter),
  });
  const { isDarkMode } = useToggleTheme((state) => state);

  // const normalizedTrend =
  //   filter[0].value === "This week" && Array.isArray(dataTrend)
  //     ? Array.from({ length: 7 }, (_, i) => {
  //         const date = format(addDays(startOfToday(), i), "yyyy-MM-dd");
  //         const existing = dataTrend.find((d) => d.date === date);
  //         return {
  //           date,
  //           usage: existing ? existing.usage : 0,
  //         };
  //       })
  //     : dataTrend;

  return (
    <Card
      className={`flex flex-col px-7 py-7 shadow-none ${isDarkMode ? "border-dark-text-base-300-75/50 bg-dark-base-bg" : "bg-white"} transition-colors duration-150`}
    >
      <div className="flex justify-between">
        <p
          className={`font-medium ${isDarkMode ? "text-dark-text-base-300" : ""}`}
        >
          Usage Trends
        </p>
        <div className="flex items-center gap-3">
          <ComboBox
            options={usage_summary}
            placeholder="Select date filter"
            filter="date"
            setFilters={setFilter}
            reset={reset}
          />

          <Button
            className={`ml-auto text-secondary-100-75 ${isDarkMode ? "border-dark-text-base-300-75/60 bg-dark-base-bg text-dark-text-base-300-75 hover:bg-dark-base-bg hover:text-dark-text-base-300-75" : ""}`}
            variant="outline"
            onClick={() => {
              setFilter([{ id: "date", value: "This week" }]);
              setReset((prev) => !prev);
            }}
          >
            <GrPowerReset />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="mt-5 h-[290px] w-full"></Skeleton>
      ) : (
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={dataTrend}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                dataKey="usage"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="views"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Bar
                dataKey={"usage"}
                fill={`var(--color-${"usage"})`}
                radius={10}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      )}
    </Card>
  );
};

export default UsageTrends;
