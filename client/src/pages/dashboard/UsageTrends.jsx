import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ComboBox from "@/components/ComboBox";
import { Button } from "@/components/ui/button";
import { GrPowerReset } from "react-icons/gr";

const usage_summary = [
  { value: "this-week", label: "This week" },
  { value: "this-month", label: "This month" },
  { value: "this-year", label: "This year" },
];

//so for this Week, it should be monday - sunday
//for this month the days from that mongth for example if now is febuary deb 1 - feb 28
// when this year, the months fromjan - dec

const chartData = [
  { date: "2024-04-01", usage: 222 },
  { date: "2024-04-02", usage: 97 },
  { date: "2024-04-03", usage: 167 },
  { date: "2024-04-04", usage: 242 },
  { date: "2024-04-05", usage: 373 },
  { date: "2024-04-06", usage: 301 },
  { date: "2024-04-07", usage: 245 },
  { date: "2024-04-08", usage: 409 },
  { date: "2024-04-09", usage: 59 },
  { date: "2024-04-10", usage: 261 },
  { date: "2024-04-11", usage: 327 },
  { date: "2024-04-12", usage: 292 },
  { date: "2024-04-13", usage: 342 },
  { date: "2024-04-14", usage: 137 },
  { date: "2024-04-15", usage: 120 },
  { date: "2024-04-16", usage: 138 },
  { date: "2024-04-17", usage: 446 },
  { date: "2024-04-18", usage: 364 },
  { date: "2024-04-19", usage: 243 },
  { date: "2024-04-20", usage: 89 },
  { date: "2024-04-21", usage: 137 },
  { date: "2024-04-22", usage: 224 },
  { date: "2024-04-23", usage: 138 },
  { date: "2024-04-24", usage: 387 },
  { date: "2024-04-25", usage: 215 },
  { date: "2024-04-26", usage: 75 },
  { date: "2024-04-27", usage: 383 },
  { date: "2024-04-28", usage: 122 },
  { date: "2024-04-29", usage: 315 },
  { date: "2024-04-30", usage: 454 },
  { date: "2024-05-01", usage: 165 },
  { date: "2024-05-02", usage: 293 },
  { date: "2024-05-03", usage: 247 },
  { date: "2024-05-04", usage: 385 },
  { date: "2024-05-05", usage: 481 },
  { date: "2024-05-06", usage: 498 },
  { date: "2024-05-07", usage: 388 },
  { date: "2024-05-08", usage: 149 },
  { date: "2024-05-09", usage: 227 },
  { date: "2024-05-10", usage: 293 },
  { date: "2024-05-11", usage: 335 },
  { date: "2024-05-12", usage: 197 },
  { date: "2024-05-13", usage: 197 },
  { date: "2024-05-14", usage: 448 },
  { date: "2024-05-15", usage: 473 },
  { date: "2024-05-16", usage: 338 },
  { date: "2024-05-17", usage: 499 },
  { date: "2024-05-18", usage: 315 },
  { date: "2024-05-19", usage: 235 },
  { date: "2024-05-20", usage: 177 },
  { date: "2024-05-21", usage: 82 },
  { date: "2024-05-22", usage: 81 },
  { date: "2024-05-23", usage: 252 },
  { date: "2024-05-24", usage: 294 },
  { date: "2024-05-25", usage: 201 },
  { date: "2024-05-26", usage: 213 },
  { date: "2024-05-27", usage: 420 },
  { date: "2024-05-28", usage: 233 },
  { date: "2024-05-29", usage: 78 },
  { date: "2024-05-30", usage: 340 },
  { date: "2024-05-31", usage: 178 },
  { date: "2024-06-01", usage: 178 },
  { date: "2024-06-02", usage: 470 },
  { date: "2024-06-03", usage: 103 },
  { date: "2024-06-04", usage: 439 },
  { date: "2024-06-05", usage: 88 },
  { date: "2024-06-06", usage: 294 },
  { date: "2024-06-07", usage: 323 },
  { date: "2024-06-08", usage: 385 },
  { date: "2024-06-09", usage: 438 },
  { date: "2024-06-10", usage: 155 },
  { date: "2024-06-11", usage: 92 },
  { date: "2024-06-12", usage: 492 },
  { date: "2024-06-13", usage: 81 },
  { date: "2024-06-14", usage: 426 },
  { date: "2024-06-15", usage: 307 },
  { date: "2024-06-16", usage: 371 },
  { date: "2024-06-17", usage: 475 },
  { date: "2024-06-18", usage: 107 },
  { date: "2024-06-19", usage: 341 },
  { date: "2024-06-20", usage: 408 },
  { date: "2024-06-21", usage: 169 },
  { date: "2024-06-22", usage: 317 },
  { date: "2024-06-23", usage: 480 },
  { date: "2024-06-24", usage: 132 },
  { date: "2024-06-25", usage: 141 },
  { date: "2024-06-26", usage: 434 },
  { date: "2024-06-27", usage: 448 },
  { date: "2024-06-28", usage: 149 },
  { date: "2024-06-29", usage: 103 },
  { date: "2024-06-30", usage: 446 },
];

// y axiz should be based on usage.
// start from lowest value and go up to highest value.

const chartConfig = {
  views: {
    label: "Page Views",
  },
  usage: {
    label: "usage",
    color: "rgba(18, 165, 188, 1)",
  },
};

const UsageTrends = () => {
  const [filter, setFilter] = useState([]);
  const [reset, setReset] = useState(false);

  return (
    <Card className="flex flex-col px-7 py-7 shadow-none">
      <div className="flex justify-between">
        <p className="font-medium">Usage Trends</p>
        <div className="flex items-center gap-3">
          <ComboBox
            options={usage_summary}
            placeholder="Select date"
            filter="date"
            setFilters={setFilter}
            reset={reset}
          />

          <Button
            className="ml-auto text-secondary-100-75"
            variant="outline"
            onClick={() => {
              setFilter([]);
              setReset((prev) => !prev);
            }}
          >
            <GrPowerReset />
          </Button>
        </div>
      </div>

      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
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
    </Card>
  );
};

export default UsageTrends;
