"use client";

import { useState } from "react";
import { FileUploadProjection } from "../components/FileUploadProjection";
import { HistoricalDataTable } from "../components/HistoricalDataTable";
import { ProjectionChart } from "../components/ProjectionChart";
import Papa from "papaparse";
import { financialProjection } from "../lib/lagrange";
import { HistoricalData, ProjectionResult } from "@/types/types";

export default function Home() {
    const [projectionYear, setProjectionYear] = useState<number>(2023);
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
        if (field === "year") updatedData[index].year = Number(value);
        if (field === "revenue")
            updatedData[index].revenue = Number(value.replace(/,/g, ""));
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

    const formatRevenue = (value: number) =>
        value.toLocaleString(undefined, { style: "currency", currency: "USD" });

    return (
        <main className="flex flex-col items-center gap-10 p-6">
            <FileUploadProjection
                onFileUpload={handleFileUpload}
                projectionYear={projectionYear}
                setProjectionYear={setProjectionYear}
                handleProjection={handleProjection}
                error={error}
            />

            <section className="flex justify-center gap-40">
                <HistoricalDataTable
                    historicalData={historicalData}
                    handleDataUpdate={handleDataUpdate}
                    handleAddRow={handleAddRow}
                    handleDeleteRow={handleDeleteRow}
                    formatRevenue={formatRevenue}
                />
                <ProjectionChart
                    chartData={chartData}
                    chartConfig={chartConfig}
                />
            </section>
        </main>
    );
}
