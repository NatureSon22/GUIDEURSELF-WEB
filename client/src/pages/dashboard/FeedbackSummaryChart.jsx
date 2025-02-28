import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import PropTypes from "prop-types";

const chartConfig = {
  desktop: {
    label: "all",
    color: "hsl(var(--chart-1))",
  },
};

// FeedbackSummaryChart component
const FeedbackSummaryChart = ({ data }) => {
  const { total = {} } = data;

  const chartData = Object.keys(total).map((key) => ({
    rate: key,
    desktop: total[key],
  }));

  return (
    <Card className="flex-1 border-none shadow-none">
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px]">
          <BarChart
          
            accessibilityLayer
            data={chartData}
            barSize={35}
            defaultShowTooltip={false}
            barGap={0}
            layout="vertical"
            margin={{
              left: -20,
            }}
          >
            <XAxis type="number" dataKey="desktop" />
            <YAxis
              dataKey="rate"
              type="category"
              color="black"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              domain={["auto", "auto"]}
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

FeedbackSummaryChart.propTypes = {
  data: PropTypes.shape({
    total: PropTypes.objectOf(PropTypes.number).isRequired,
  }).isRequired,
};

export default FeedbackSummaryChart;
