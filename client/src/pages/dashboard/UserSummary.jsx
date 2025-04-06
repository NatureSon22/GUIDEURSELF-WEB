import { Label, Pie, PieChart } from "recharts";
import { useMemo, useState } from "react";
import { GoDotFill } from "react-icons/go";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import ComboBox from "@/components/ComboBox";
import { user_summary } from "@/data/dashboard";
import { useQuery } from "@tanstack/react-query";
import { getAllAccounts } from "@/api/accounts";
import { Button } from "@/components/ui/button";
import { GrPowerReset } from "react-icons/gr";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = [
  "rgba(14, 70, 163, 1)",
  "rgba(128, 202, 238, 1)",
  "rgba(60, 80, 224, 1)",
  "rgba(18, 165, 188, 1)",
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
};

const UserSummary = () => {
  const [filter, setFilter] = useState([]);
  const [reset, setReset] = useState(false);
  const { data: allAccounts = [], isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAllAccounts,
  });

  const chartData = useMemo(() => {
    const startDate = new Date();
    const endDate = new Date();

    const filterValue = filter.length > 0 ? filter[0].value.toLowerCase() : "";

    if (filterValue === "today") {
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    } else if (filterValue === "this week") {
      const dayOfWeek = startDate.getDay();
      const difference = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to last Monday
      startDate.setDate(startDate.getDate() + difference);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(startDate.getDate() + 6); // End of the week (Sunday)
      endDate.setHours(23, 59, 59, 999);
    } else if (filterValue === "this month") {
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setMonth(startDate.getMonth() + 1, 0); // Last day of the month
      endDate.setHours(23, 59, 59, 999);
    } else if (filterValue === "this year") {
      startDate.setMonth(0, 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setMonth(11, 31); // Last day of December
      endDate.setHours(23, 59, 59, 999);
    }

    // Map role types to visitor counts
    const roleVisitorMap = allAccounts.reduce((acc, account) => {
      const { role_type } = account;
      const dateCreated = new Date(account.date_created);

      if (
        !filterValue ||
        (dateCreated >= startDate && dateCreated <= endDate)
      ) {
        acc[role_type] = (acc[role_type] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(roleVisitorMap).map(([role, visitors], index) => ({
      usertype: role,
      visitors,
      fill: COLORS[index % COLORS.length],
    }));
  }, [allAccounts, filter]);

  const totalVisitors = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, [chartData]);

  return (
    <Card className="flex h-full flex-col px-7 py-5 shadow-none">
      <div className="mt-2 flex items-center justify-between">
        <p className="font-medium">User Summary</p>

        <div className="flex items-center gap-3">
          <ComboBox
            options={user_summary}
            placeholder="Select date filter"
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

      {isLoading ? (
        <div className="grid place-items-center py-14">
          <Skeleton className="h-[320px] w-full max-w-[320px] rounded-full"></Skeleton>
        </div>
      ) : (
        <CardContent className="flex-1 pb-0">
          {chartData.length > 0 ? (
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
                  nameKey="usertype"
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
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-lg text-muted-foreground">No Data Found</p>
            </div>
          )}
        </CardContent>
      )}

      {isLoading ? (
        <div className="mb-5 grid w-full grid-cols-2 place-items-center gap-5">
          <Skeleton className="w-full py-5"></Skeleton>
          <Skeleton className="w-full py-5"></Skeleton>
          <Skeleton className="w-full py-5"></Skeleton>
          <Skeleton className="w-full py-5"></Skeleton>
        </div>
      ) : (
        chartData.length > 0 && (
          <div className="mb-10 mt-auto grid grid-cols-2 gap-5">
            {chartData.map((data, index) => {
              const { usertype, visitors, fill } = data;
              const label = usertype[0].toUpperCase() + usertype.slice(1);

              return (
                <div
                  className="mx-5 flex items-center justify-between"
                  key={index}
                >
                  <div className="flex items-center gap-3">
                    <GoDotFill style={{ color: fill }} className="text-2xl" />
                    <div>{label}</div>
                  </div>

                  <p>{visitors}</p>
                </div>
              );
            })}
          </div>
        )
      )}
    </Card>
  );
};

// { browser: "student", visitors: 650, fill: "rgba(14, 70, 163, 1)" },
// { browser: "staff", visitors: 450, fill: "rgba(128, 202, 238, 1)" },
// { browser: "faculty", visitors: 340, fill: "rgba(60, 80, 224, 1)" },
// { browser: "administrators", visitors: 120, fill: "rgba(18, 165, 188, 1)" },

export default UserSummary;
