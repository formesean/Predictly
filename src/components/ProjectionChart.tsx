import { BarChart, Bar, CartesianGrid, XAxis } from "recharts";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

type ChartDataPoint = {
    year: number;
    historical: number;
    projection?: number;
};

type ChartConfig = {
    historical: { label: string; color: string };
    projection: { label: string; color: string };
};

type ProjectionChartProps = {
    chartData: ChartDataPoint[];
    chartConfig: ChartConfig;
};

export const ProjectionChart = ({
    chartData,
    chartConfig,
}: ProjectionChartProps) => (
    <ChartContainer config={chartConfig} className="relative w-full h-72">
        {chartData.length > 0 ? (
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="year"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.toString().slice(0, 4)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                    dataKey="historical"
                    fill={chartConfig.historical.color}
                    radius={4}
                />
                <Bar
                    dataKey="projection"
                    fill={chartConfig.projection.color}
                    radius={4}
                />
            </BarChart>
        ) : (
            <div className="absolute inset-0 flex justify-center items-center bg-white/5 z-10 rounded-md">
                <p className="text-gray-500 text-lg font-medium">
                    No available data
                </p>
            </div>
        )}
    </ChartContainer>
);
