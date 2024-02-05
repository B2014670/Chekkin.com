import { useFormContext } from "react-hook-form";
import { HotelFormData } from "../ManagerHotelFrom";

type ChildComponentProps = {
    onFileChange: (files: FileList | null, previews: string[]) => void;
}

const ImagesSection = ({ onFileChange }: ChildComponentProps) => {
    const {
        register,
        formState: { errors },
    } = useFormContext<HotelFormData>();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const fileReaders: FileReader[] = Array.from(files).map((file: File) => {
                const reader = new FileReader();

                reader.onload = () => {
                    // Send the selected files and the data URL to the parent
                    onFileChange(files, fileReaders.map((reader) => reader.result as string));
                };

                reader.readAsDataURL(file);

                return reader;
            });
        } else {
            // No files selected, send null to the parent
            onFileChange(null, []);
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-3">Images</h2>
            <div className="border rounded p-4 flex flex-col gap-4">
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="w-full text-gray-700 font-normal"
                    {...register("imageFiles", {
                        validate: (imageFiles) => {
                            const totalLength = imageFiles.length;

                            if (totalLength === 0) {
                                return "At least one image should be added";
                            }

                            if (totalLength > 6) {
                                return "Total number of images cannot be more than 6";
                            }

                            return true;
                        },
                    })}
                    onChange={handleFileChange}
                />
            </div>
            {errors.imageFiles && (
                <span className="text-red-500 text-sm font-bold">
                    {errors.imageFiles.message}
                </span>
            )}
        </div>
    );
};

export default ImagesSection;