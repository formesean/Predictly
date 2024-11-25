import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

type HistoricalData = { year: number; revenue: number };

type HistoricalDataTableProps = {
    historicalData: HistoricalData[] | null;
    handleDataUpdate: (
        index: number,
        field: "year" | "revenue",
        value: string
    ) => void;
    handleAddRow: () => void;
    handleDeleteRow: (index: number) => void;
    formatRevenue: (value: number) => string;
};

export const HistoricalDataTable = ({
    historicalData,
    handleDataUpdate,
    handleAddRow,
    handleDeleteRow,
    formatRevenue,
}: HistoricalDataTableProps) => (
    <Card className="w-full max-w-2xl p-6">
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Historical Data</h2>
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
                        <TableHead className="w-40">Revenue</TableHead>
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
                                        value={formatRevenue(data.revenue)}
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
                                        onClick={() => handleDeleteRow(index)}
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
);
