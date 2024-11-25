// Define the structure of historical data
interface HistoricalData {
    year: number;
    revenue: number;
}

// Lagrange Interpolation/Extrapolation function
export function lagrangeInterpolation(
    x: number,
    xData: number[],
    yData: number[]
): number {
    let result = 0;
    const n = xData.length;

    for (let i = 0; i < n; i++) {
        let term = yData[i];
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                term *= (x - xData[j]) / (xData[i] - xData[j]);
            }
        }
        result += term;
    }
    return result;
}

// Financial Projection using Historical Data
export function financialProjection(
    historicalData: HistoricalData[],
    projectionYear: number
) {
    // Extract x (time) and y (financial data like revenue, profit)
    const xData = historicalData.map((data) => data.year);
    const yData = historicalData.map((data) => data.revenue);

    // Use the Lagrange interpolation/extrapolation method
    const projectedRevenue = lagrangeInterpolation(
        projectionYear,
        xData,
        yData
    );

    // Determine if the projection is interpolation or extrapolation
    const method: "Interpolation" | "Extrapolation" =
        projectionYear >= Math.min(...xData) &&
        projectionYear <= Math.max(...xData)
            ? "Interpolation"
            : "Extrapolation";

    return {
        projectionYear,
        projectedRevenue,
        method,
    };
}

// const historicalData: HistoricalData[] = [
//   { year: 2018, revenue: 10000 },
//   { year: 2019, revenue: 15000 },
//   { year: 2020, revenue: 20000 },
//   { year: 2021, revenue: 25000 },
// ];

// const projectionYear = 2023;
// const result = financialProjection(historicalData, projectionYear);
// console.log("Projection Result:", result);
