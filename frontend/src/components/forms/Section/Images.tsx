import { useFormContext } from "react-hook-form";
import { HotelFormData } from "../ManagerHotelFrom";
import { useEffect, useState } from "react";

type ChildComponentProps = {
    isLoading: boolean;
}

const ImagesSection = ({ isLoading }: ChildComponentProps) => {
    const {
        register,
        formState: { errors },
        watch,
        setValue,
    } = useFormContext<HotelFormData>();

    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        setPreviews([]);
    }, [isLoading]);

    const existingImageUrls = watch("imageUrls");
    const existingUrlsDelete = watch("imageUrlsDelete") || [];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const fileReaders: FileReader[] = Array.from(files).map((file: File) => {
                const reader = new FileReader();
                reader.onload = () => {
                    setPreviews(fileReaders.map((reader) => reader.result as string));
                };
                reader.readAsDataURL(file);
                return reader;
            });
        }
    }

    const handleDelete = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        imageUrl: string
    ) => {
        event.preventDefault();
        setValue(
            "imageUrls",
            existingImageUrls.filter((url) => url !== imageUrl)
        );
        const updatedUrlsDelete = [...existingUrlsDelete, imageUrl];
        setValue("imageUrlsDelete", updatedUrlsDelete);
        console.log('existingUrlsDelete',existingUrlsDelete)
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-3">Images</h2>
            <div className="border rounded p-4 flex flex-col gap-4">
                {existingImageUrls &&
                    (
                        <div className="grid grid-cols-2 lg:grid-cols-6 md:grid-cols-3 gap-4">
                            {existingImageUrls.map((url) => (
                                <div key={url} className="relative group">
                                    <img src={url} className="h-auto max-w-full rounded-lg" />
                                    <button
                                        onClick={(event) => handleDelete(event, url)}
                                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )
                }
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="w-full text-gray-700 font-normal"
                    {...register("imageFiles", {
                        validate: (imageFiles) => {
                            const totalLength = imageFiles.length + (existingImageUrls?.length || 0);

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

            {(previews.length > 0) && (
                <div>
                    <h2 className="text-2xl font-bold mb-3 gap-0">Preview Addition Image </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-6 md:grid-cols-3 gap-4">

                        {previews.map((preview, index) => (
                            <img
                                key={index}
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="h-auto max-w-full rounded-lg"
                            />
                        ))}
                    </div>
                </div>
            )
            }
        </div>
    );
};

export default ImagesSection;