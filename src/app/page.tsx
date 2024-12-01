"use client";

import { useState } from "react";
import { FileUploadProjection } from "../components/FileUploadProjection";
import { HistoricalDataTable } from "../components/HistoricalDataTable";
import { ProjectionChart } from "../components/ProjectionChart";
import Papa from "papaparse";
import { financialProjection } from "../lib/lagrange";
import { HistoricalData, ProjectionResult } from "@/types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FadeText } from "@/components/ui/fade-text";
import { Separator } from "@/components/ui/separator";

export default function Home() {
    const [projectionYear, setProjectionYear] = useState<number>(2024);
    const [error, setError] = useState<string | null>(null);
    const [historicalData, setHistoricalData] = useState<
        HistoricalData[] | null
    >(null);
    const [projectionResult, setProjectionResult] =
        useState<ProjectionResult | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return setError("No file selected.");

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const data: HistoricalData[] = results.data
                    .map((row: any) => {
                        const year = parseInt(row.Year);
                        const revenue = parseFloat(
                            row.Revenue.replace(/,/g, "")
                        );
                        if (isNaN(year) || isNaN(revenue)) return null;
                        return { year, revenue };
                    })
                    .filter((data): data is HistoricalData => data !== null);

                if (data.length === 0)
                    return setError("No valid data found in CSV file.");
                setHistoricalData(data);
            },
            error: (error) => setError(error.message),
        });
    };

    const handleProjection = () => {
        if (!historicalData) return setError("No historical data available.");
        const result = financialProjection(historicalData, projectionYear);
        setProjectionResult(result);
    };

    const chartConfig = {
        historical: { label: "Historical", color: "#2563eb" },
        projection: { label: "Projected", color: "#60a5fa" },
    };

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

        if (field === "year") {
            updatedData[index].year = value === "" ? 0 : Number(value);
        }

        if (field === "revenue") {
            const cleanValue = value.replace(/[₱,]/g, "");
            updatedData[index].revenue =
                cleanValue === "" ? 0 : Number(cleanValue);
        }

        setHistoricalData(updatedData);
    };

    const handleAddRow = () => {
        setHistoricalData((prev) => [...(prev || []), { year: 0, revenue: 0 }]);
    };

    const handleDeleteRow = (index: number) => {
        setHistoricalData(
            (prev) => prev?.filter((_, i) => i !== index) || null
        );
    };

    const formatRevenue = (value: number) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <main className="mx-auto flex flex-col items-center gap-6 p-4 md:p-6 max-w-7xl w-full">
            <section className="flex flex-col pt-6 gap-4">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <FadeText
                        className="text-3xl lg:text-4xl font-bold"
                        direction="left"
                        framerProps={{
                            show: { transition: { delay: 0.8 } },
                        }}
                        text="Predictly:"
                    />
                    <FadeText
                        className="text-3xl lg:text-4xl font-bold"
                        direction="down"
                        framerProps={{
                            show: { transition: { delay: 1.2 } },
                        }}
                        text="Smarter Financial Projections"
                    />
                </div>
                <div className="text-justify mx-auto max-w-[940px]">
                    <FadeText
                        className="text-base lg:text-lg text-muted-foreground"
                        direction="right"
                        framerProps={{
                            show: { transition: { delay: 1.6 } },
                        }}
                        text="Your go-to financial projection tool, leveraging the
                    Lagrange Method and historical data to deliver accurate
                    revenue and performance forecasts. Designed for business
                    owners, project managers, and financial analysts, Predictly
                    empowers you to make smarter, data-driven decisions with
                    confidence and ease."
                    />
                </div>
            </section>

            <Separator />

            <section className="pt-4 flex flex-col lg:flex-row items-start justify-center w-full gap-6">
                <div className="flex flex-col lg:flex-row justify-center gap-4 lg:gap-6 w-full">
                    <FileUploadProjection
                        onFileUpload={handleFileUpload}
                        projectionYear={projectionYear}
                        setProjectionYear={setProjectionYear}
                        handleProjection={handleProjection}
                        error={error}
                    />
                </div>

                <div className="flex flex-col lg:flex-row justify-center gap-4 lg:gap-6 w-full">
                    <Tabs defaultValue="chart" className="w-auto">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="table">Table</TabsTrigger>
                            <TabsTrigger value="chart">Chart</TabsTrigger>
                        </TabsList>
                        <TabsContent value="table">
                            <HistoricalDataTable
                                historicalData={historicalData}
                                handleDataUpdate={handleDataUpdate}
                                handleAddRow={handleAddRow}
                                handleDeleteRow={handleDeleteRow}
                                formatRevenue={formatRevenue}
                            />
                        </TabsContent>
                        <TabsContent value="chart">
                            <ProjectionChart
                                chartData={chartData}
                                chartConfig={chartConfig}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </section>
        </main>
    );
}
