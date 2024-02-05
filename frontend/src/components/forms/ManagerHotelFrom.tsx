import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./Section/Details";
import TypeSection from "./Section/Type";
import FacilitiesSection from "./Section/Facilities";
import GuestsSection from "./Section/Guests";
import ImagesSection from "./Section/Images";
import { useState } from "react";

type Props = {
    onSave: (hotelFormData: FormData) => void;
    isLoading: boolean;
};

export type HotelFormData = {
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    pricePerNight: number;
    starRating: number;
    adultCount: number;
    childCount: number;
    imageFiles: FileList;
    facilities: string[];
};

const ManagerHotelFrom = ({ onSave, isLoading }: Props) => {
    const formMethods = useForm<HotelFormData>();
    const { handleSubmit } = formMethods;
    const [previews, setPreviews] = useState<string[]>([]);

    const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
        // create new object && call API 
        const formData = new FormData();
        formData.append("name", formDataJson.name);
        formData.append("city", formDataJson.city);
        formData.append("country", formDataJson.country);
        formData.append("description", formDataJson.description);
        formData.append("type", formDataJson.type);
        formData.append("pricePerNight", formDataJson.pricePerNight.toString());
        formData.append("starRating", formDataJson.starRating.toString());
        formData.append("adultCount", formDataJson.adultCount.toString());
        formData.append("childCount", formDataJson.childCount.toString());


        formDataJson.facilities.forEach((facility, index) => {
            formData.append(`facilities[${index}]`, facility);
        });

        Array.from(formDataJson.imageFiles).forEach((imageFile) => {
            formData.append(`imageFiles`, imageFile);
        });
        
        onSave(formData);
        // if (formDataJson.imageUrls) {
        //     formDataJson.imageUrls.forEach((url, index) => {
        //         formData.append(`imageUrls[${index}]`, url);
        //     });
        // }
        
    });

    const handleFileChange = (files: FileList | null, previews: string[]) => {
        // console.log('File changed in parent:', files);
        setPreviews(previews);
    };

    return (
        //form context for child components to access form methods(register,..) 
        //without pass through props
        <form className=" flex flex-col gap-10" onSubmit={onSubmit} >
            <FormProvider {...formMethods}>
                <DetailsSection />
                <TypeSection />
                <FacilitiesSection />
                <GuestsSection />
                <ImagesSection onFileChange={handleFileChange} />
                {/* preview Image  */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {previews.map((preview, index) => (
                        <img
                            key={index}
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="h-auto max-w-full rounded-lg"
                        />
                    ))}
                </div>


                <span className="flex justify-end">
                    <button
                        disabled={isLoading}
                        type="submit"
                        className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500"
                    >
                        {isLoading ? "Saving..." : "Save"}
                    </button>
                </span>
            </FormProvider>


        </form>
    )
}

export default ManagerHotelFrom;