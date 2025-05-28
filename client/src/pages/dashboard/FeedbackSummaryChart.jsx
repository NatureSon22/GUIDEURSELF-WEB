import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import PropTypes from "prop-types";
import useToggleTheme from "@/context/useToggleTheme";

const chartConfig = {
  // Add default configuration if necessary
};

// FeedbackSummaryChart component
const FeedbackSummaryChart = ({ data }) => {
  const { total = {} } = data;
  const { isDarkMode } = useToggleTheme((state) => state);

  // Ensure data is formatted correctly
  const chartData =
    Object.keys(total).length > 0
      ? Object.keys(total).map((key) => ({
          rate: key,
          total: total[key], // Ensure the correct key is used
        }))
      : [];

  return (
    <Card
      className={`flex-1 border-none shadow-none ${isDarkMode ? "bg-dark-base-bg" : "bg-white"} transition-colors duration-150`}
    >
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px]">
          <BarChart
            accessibilityLayer
            data={chartData}
            barSize={35}
            defaultShowTooltip={false}
            barGap={0}
            layout="vertical"
            margin={{ left: -20 }}
          >
            <XAxis
              type="number"
              dataKey="total"
              className="text-red-600"
              color="rgba(217, 217, 217, 0.75)"
              allowDecimals={false} // Prevent decimal values
            />
            <YAxis
              dataKey="rate"
              type="category"
              tickLine={false}
              color="rgba(217, 217, 217, 0.75)"
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="total"
              fill="rgba(18, 165, 188, 1)"
              radius={[0, 50, 50, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

FeedbackSummaryChart.propTypes = {
  data: PropTypes.shape({
    total: PropTypes.objectOf(PropTypes.number),
  }),
};

export default FeedbackSummaryChart;
