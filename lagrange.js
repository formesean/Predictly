// Lagrange Interpolation/Extrapolation function
function lagrangeInterpolation(x, xData, yData) {
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
function financialProjection(historicalData, projectionYear) {
  // Extract x (time) and y (financial data like revenue, profit)
  const xData = historicalData.map((data) => data.year);
  const yData = historicalData.map((data) => data.revenue);

  // Use the Lagrange interpolation/extrapolation method
  const projectedRevenue = lagrangeInterpolation(projectionYear, xData, yData);

  // Determine if the projection is interpolation or extrapolation
  const method =
    projectionYear >= Math.min(...xData) && projectionYear <= Math.max(...xData)
      ? "Interpolation"
      : "Extrapolation";

  return {
    projectionYear,
    projectedRevenue,
    method,
  };
}

const historicalData = [
  { year: 2017, revenue: 5000 },
  { year: 2018, revenue: 10000 },
  { year: 2019, revenue: 15000 },
  { year: 2020, revenue: 20000 },
  { year: 2022, revenue: 30000 },
  { year: 2023, revenue: 35000 },
  { year: 2024, revenue: 40000 },
];

const projectionYear = 2025;
const result = financialProjection(historicalData, projectionYear);
console.log("Projection Result:", result);
