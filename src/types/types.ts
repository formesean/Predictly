export type HistoricalData = {
    year: number;
    revenue: number;
};

export type ProjectionResult = {
    projectionYear: number;
    projectedRevenue: number;
    method: string;
};

export type ChartDataPoint = {
    year: number;
    historical?: number;
    projection?: number;
    label?: string;
};

export type ChartConfig = {
    historical: {
        label: string;
        color: string;
    };
    projection: {
        label: string;
        color: string;
    };
};

export type ErrorState = {
    error: string | null;
    hasError: boolean;
};
