"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"; // Assuming you have a button component
import Papa from "papaparse";
import { useState } from "react";
import { financialProjection } from "./lagrange";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type HistoricalData = {
  year: number;
  revenue: number;
};

type ProjectionResult = {
  projectionYear: number;
  projectedRevenue: number;
  method: string;
};

type ChartDataPoint = {
  year: number;
  historical: number;
  projection?: number;
};

export default function Home() {
  const [projectionResult, setProjectionResult] =
    useState<ProjectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startYear, setStartYear] = useState<number | "">(2019);
  const [endYear, setEndYear] = useState<number | "">(2022);
  const [projectionYear, setProjectionYear] = useState<number>(2023);
  const [historicalData, setHistoricalData] = useState<HistoricalData[] | null>(
    null
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log("Parsed CSV Results:", results.data);

          const data: HistoricalData[] = results.data
            .map((row: any) => {
              const year = parseInt(row.Year);
              const revenue = parseFloat(row.Revenue.replace(/,/g, ""));

              if (isNaN(year) || isNaN(revenue)) {
                setError("Invalid data in CSV file.");
                return null;
              }

              return { year, revenue };
            })
            .filter((data): data is HistoricalData => data !== null);

          if (data.length === 0) {
            setError("No valid data found in CSV file.");
            return;
          }

          console.log("Valid Historical Data:", data);
          setHistoricalData(data); // Store the valid data in state
        },
        error: (error: any) => {
          setError(error.message);
          console.error(error);
        },
      });
    } else {
      setError("No file selected.");
    }
  };

  const handleProjection = () => {
    if (!historicalData) {
      setError("No historical data available.");
      return;
    }

    // Filter historical data based on user-defined range
    const filteredData = historicalData.filter(
      (data) =>
        (startYear === "" || data.year >= startYear) &&
        (endYear === "" || data.year <= endYear)
    );

    if (filteredData.length === 0) {
      setError("No data in the selected range.");
      return;
    }

    const result = financialProjection(filteredData, projectionYear);
    setProjectionResult(result);
  };

  const chartConfig = {
    historical: {
      label: "Historical Revenue",
      color: "#2563eb",
    },
    projection: {
      label: "Projected Revenue",
      color: "#60a5fa",
    },
  };

  // Transform data for the chart
  const chartData =
    historicalData?.map((data) => ({
      year: data.year,
      historical: data.revenue,
      projection: 0,
    })) || [];

  if (projectionResult) {
    chartData.push({
      year: projectionResult.projectionYear,
      historical: 0,
      projection: projectionResult.projectedRevenue,
    });
  }

  return (
    <main className="flex flex-col items-center justify-items-center min-h-screen gap-20 p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* <ModeToggle /> */}

      <section className="flex flex-col justify-end items-center gap-10">
        <div className="flex justify-center items-center gap-10">
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="csv-file">Upload CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="projection-year">Projection Year:</Label>
            <Input
              id="projection-year"
              type="number"
              value={projectionYear}
              onChange={(e) => setProjectionYear(Number(e.target.value))}
              placeholder="Enter projection year"
            />
          </div>
        </div>

        {/* Button to trigger the projection calculation */}
        <div className="flex flex-col gap-2">
          <Button onClick={handleProjection}>Calculate Projection</Button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </section>

      <section>
        {/* {projectionResult && (
          <div className="overflow-auto mt-4">
            <h2 className="text-xl font-semibold">Projection Result:</h2>
            <pre className="bg-gray-100 text-black p-4 rounded text-left">
              {JSON.stringify(projectionResult, null, 2)}
            </pre>
          </div>
        )} */}

        {/* Chart Section */}
        <ChartContainer config={chartConfig} className="w-full h-64">
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
        </ChartContainer>
      </section>
    </main>
  );
}
