"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"; // Assuming you have a button component
import Papa from "papaparse";
import { useState } from "react";
import { financialProjection } from "./lagrange";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

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
    const [historicalData, setHistoricalData] = useState<
        HistoricalData[] | null
    >(null);

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
                            const revenue = parseFloat(
                                row.Revenue.replace(/,/g, "")
                            );

                            if (isNaN(year) || isNaN(revenue)) {
                                setError("Invalid data in CSV file.");
                                return null;
                            }

                            return { year, revenue };
                        })
                        .filter(
                            (data): data is HistoricalData => data !== null
                        );

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
            label: "Historical",
            color: "#2563eb",
        },
        projection: {
            label: "Projected",
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

    const handleDataUpdate = (
        index: number,
        field: "year" | "revenue",
        value: string
    ) => {
        if (!historicalData) return;

        const updatedData = [...historicalData];
        let parsedValue: number;

        if (field === "year") {
            parsedValue = parseInt(value);
        } else {
            const cleanValue = value.replace(/[$,]/g, "");
            parsedValue = parseFloat(cleanValue);
        }

        if (!isNaN(parsedValue)) {
            updatedData[index] = {
                ...updatedData[index],
                [field]: parsedValue,
            };
            setHistoricalData(updatedData);
        }
    };

    const formatRevenue = (value: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const handleAddRow = () => {
        if (!historicalData) {
            setHistoricalData([{ year: new Date().getFullYear(), revenue: 0 }]);
            return;
        }

        const newYear = Math.max(...historicalData.map((d) => d.year)) + 1;
        setHistoricalData([...historicalData, { year: newYear, revenue: 0 }]);
    };

    const handleDeleteRow = (index: number) => {
        if (!historicalData) return;
        const updatedData = historicalData.filter((_, i) => i !== index);
        setHistoricalData(updatedData);
    };

    return (
        <main className="flex flex-col items-center justify-items-center min-h-screen gap-20 p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            {/* <ModeToggle /> */}

            {/* Data and Projecton Year Input and Calculations */}
            <section className="flex flex-col gap-6">
                <h2 className="text-2xl font-semibol">Data Input</h2>
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
                        <Label htmlFor="projection-year">
                            Projection Year:
                        </Label>
                        <Input
                            id="projection-year"
                            type="number"
                            value={projectionYear}
                            onChange={(e) =>
                                setProjectionYear(Number(e.target.value))
                            }
                            placeholder="Enter projection year"
                        />
                    </div>
                </div>

                {/* Button to trigger the projection calculation */}
                <div className="flex flex-col gap-2">
                    <Button onClick={handleProjection}>
                        Calculate Projection
                    </Button>
                    {error && <p className="text-red-500">{error}</p>}
                </div>
            </section>

            {/* Data Table and Chart */}
            <section className="flex justify-center items-center gap-40">
                {/* Historical Data Edit */}
                <Card className="w-full max-w-2xl p-6">
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">
                                Historical Data
                            </h2>
                            <Button
                                onClick={handleAddRow}
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" /> Add Row
                            </Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-24">Year</TableHead>
                                    <TableHead className="w-40">
                                        Revenue
                                    </TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            {historicalData && (
                                <TableBody>
                                    {historicalData.map((data, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">
                                                <Input
                                                    type="number"
                                                    value={data.year}
                                                    onChange={(e) =>
                                                        handleDataUpdate(
                                                            index,
                                                            "year",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-24"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="text"
                                                    value={formatRevenue(
                                                        data.revenue
                                                    )}
                                                    onChange={(e) =>
                                                        handleDataUpdate(
                                                            index,
                                                            "revenue",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-40"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDeleteRow(index)
                                                    }
                                                    className="h-8 w-full p-0"
                                                >
                                                    ×
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            )}
                        </Table>
                    </div>
                </Card>

                {/* Chart Section */}
                <ChartContainer
                    config={chartConfig}
                    className="relative w-full h-64"
                >
                    {chartData.length > 0 ? (
                        <BarChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="year"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) =>
                                    value.toString().slice(0, 4)
                                }
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
            </section>
        </main>
    );
}
