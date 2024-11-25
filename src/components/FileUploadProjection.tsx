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
    <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold">Data Input</h2>
        <div className="flex justify-center items-center gap-10">
            <div className="grid w-full max-w-sm items-center gap-2">
                <Label htmlFor="csv-file">Upload CSV File</Label>
                <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={onFileUpload}
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
        <div className="flex flex-col gap-2">
            <Button onClick={handleProjection}>Calculate Projection</Button>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    </section>
);
