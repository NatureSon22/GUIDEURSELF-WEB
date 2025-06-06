import { Card, CardContent } from "@/components/ui/card";
import useToggleTheme from "@/context/useToggleTheme";
import { LabelList, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { useQuery } from "@tanstack/react-query";
import { getMessagesClassification } from "@/api/message";
import { Skeleton } from "@/components/ui/skeleton";

const chartConfig = {
  count: { label: "Count" },
  factual: {
    label: "Factual",
    color: "rgba(14, 70, 163, 1)",
  },
  procedural: {
    label: "Procedural",
    color: "rgba(128, 202, 238, 1)",
  },
  trivial: {
    label: "Trivial",
    color: "rgba(60, 80, 224, 1)",
  },
  uncategorized: {
    label: "Uncategorized",
    color: "rgba(18, 165, 188, 1)",
  },
};

const ClassificationSummary = () => {
  const { isDarkMode } = useToggleTheme((state) => state);
  const { data: chartData, isLoading } = useQuery({
    queryKey: ["message-classification"],
    queryFn: getMessagesClassification,
  });

  return (
    <Card
      className={`flex flex-1 flex-col px-7 py-7 shadow-none ${
        isDarkMode
          ? "border-dark-text-base-300-75/50 bg-dark-base-bg"
          : "bg-white"
      } transition-colors duration-150`}
    >
      <p
        className={`font-medium ${isDarkMode ? "text-dark-text-base-300" : ""}`}
      >
        Query Type
      </p>

      {isLoading ? (
        <div className="flex flex-1 justify-center">
          <Skeleton className="mt-5 size-[350px] rounded-full" />
        </div>
      ) : (
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[420px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
          >
            <PieChart>
              <ChartTooltip
                nameKey="count"
                content={<ChartTooltipContent />}
                hideLabel
              />
              <Pie
                data={chartData?.map((d) => ({
                  ...d,
                  fill: chartConfig[d.category]?.color,
                }))}
                dataKey="count"
                nameKey="category"
                labelLine={false}
                label={({ cx, cy, midAngle, outerRadius, payload }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius + 40; // increase this for more distance
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={`${isDarkMode ? "rgba(230, 246, 249, 1)" : "hsla(var(--foreground))"}`}
                      fontSize={16}
                    >
                      {payload.count}
                    </text>
                  );
                }}
              >
                <LabelList
                  dataKey="category"
                  className="fill-background"
                  stroke="none"
                  fontSize={12}
                  position={"middle"}
                  formatter={(value) => chartConfig[value]?.label}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      )}
    </Card>
  );
};

export default ClassificationSummary;
