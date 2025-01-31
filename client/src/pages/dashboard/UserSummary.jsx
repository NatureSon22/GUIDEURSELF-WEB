import { Label, Pie, PieChart } from "recharts";
import { useMemo } from "react";
import { GoDotFill } from "react-icons/go";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ComboBox from "@/components/ComboBox";

const chartData = [
  { browser: "student", visitors: 650, fill: "rgba(14, 70, 163, 1)" },
  { browser: "staff", visitors: 450, fill: "rgba(128, 202, 238, 1)" },
  { browser: "faculty", visitors: 340, fill: "rgba(60, 80, 224, 1)" },
  { browser: "administrators", visitors: 120, fill: "rgba(18, 165, 188, 1)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
};

const UserSummary = () => {
  const totalVisitors = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <Card className="flex flex-col px-7 py-5 shadow-none">
      <div className="flex items-center justify-between">
        <p className="font-medium">User Summary</p>
        <ComboBox />
      </div>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[420px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={100}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-5xl font-semibold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 40}
                          className="fill-muted-foreground text-sm"
                        >
                          Total Users
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <div className="grid grid-cols-2 gap-5">
        <div className="mx-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GoDotFill className="text-chart-100 text-2xl" />
            <div>Student</div>
          </div>

          <p>65%</p>
        </div>

        <div className="mx-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GoDotFill className="text-chart-200 text-2xl" />
            <div>Staff</div>
          </div>

          <p>34%</p>
        </div>

        <div className="mx-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GoDotFill className="text-chart-300 text-2xl" />
            <div>Faculty</div>
          </div>

          <p>45%</p>
        </div>

        <div className="mx-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GoDotFill className="text-chart-400 rgba(18, 165, 188, 1) text-2xl" />
            <div>Administrator</div>
          </div>

          <p>12%</p>
        </div>
      </div>
    </Card>
  );
};

// { browser: "student", visitors: 650, fill: "rgba(14, 70, 163, 1)" },
// { browser: "staff", visitors: 450, fill: "rgba(128, 202, 238, 1)" },
// { browser: "faculty", visitors: 340, fill: "rgba(60, 80, 224, 1)" },
// { browser: "administrators", visitors: 120, fill: "rgba(18, 165, 188, 1)" },

export default UserSummary;
