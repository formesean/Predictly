import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type FileUploadProjectionProps = {
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    projectionYear: number;
    setProjectionYear: React.Dispatch<React.SetStateAction<number>>;
    handleProjection: () => void;
    error: string | null;
};

export const FileUploadProjection = ({
    onFileUpload,
    projectionYear,
    setProjectionYear,
    handleProjection,
    error,
}: FileUploadProjectionProps) => (
    <section className="flex flex-col gap-4 md:gap-6 w-full">
        <h2 className="text-xl md:text-2xl font-semibold">
            Please ensure your CSV file contains the correct format. You can
            upload your file below and set the projection year.
        </h2>
        <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center gap-4 sm:gap-10 w-full">
            <div className="grid w-full max-w-sm items-center gap-2">
                <Label htmlFor="csv-file">Upload CSV File</Label>
                <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={onFileUpload}
                />
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto">
                <Label htmlFor="projection-year">Projection Year:</Label>
                <Input
                    id="projection-year"
                    type="number"
                    value={projectionYear || ""}
                    onChange={(e) => setProjectionYear(Number(e.target.value))}
                    placeholder="Enter projection year"
                />
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <Button onClick={handleProjection} className="w-full sm:w-auto">
                Calculate Projection
            </Button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    </section>
);
