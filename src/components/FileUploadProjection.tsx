import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import RippleButton from "./ui/ripple-button";

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
    <div className="flex flex-col gap-4 md:gap-6 h-full justify-center">
        <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center gap-4 sm:gap-10 w-full">
            <div className="flex flex-col gap-2 w-full">
                <Label htmlFor="csv-file">Upload CSV File</Label>
                <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={onFileUpload}
                />
            </div>

            <div className="flex flex-col gap-2 w-full">
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

        <div className="flex flex-col gap-2 w-full">
            <RippleButton
                onClick={handleProjection}
                className="flex-grow"
                rippleColor="#ADD8E6"
            >
                Calculate Projection
            </RippleButton>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    </div>
);
