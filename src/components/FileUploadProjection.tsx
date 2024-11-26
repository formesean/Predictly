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
    <section className="flex flex-col gap-4 md:gap-6 w-full mx-auto">
        <div className="flex flex-col gap-4 md:gap-6">
            <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center gap-4 sm:gap-10 w-full pt-6">
                <div className="flex flex-col gap-2 w-full sm:w-auto">
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
                        onChange={(e) =>
                            setProjectionYear(Number(e.target.value))
                        }
                        placeholder="Enter projection year"
                    />
                </div>
            </div>

            <div className="flex w-full">
                <Button onClick={handleProjection} className="flex-grow">
                    Calculate Projection
                </Button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
        </div>
    </section>
);
