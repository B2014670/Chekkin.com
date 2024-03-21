import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./Section/Details";
import TypeSection from "./Section/Type";
import FacilitiesSection from "./Section/Facilities";
import GuestsSection from "./Section/Guests";
import ImagesSection from "./Section/Images";
import { useEffect } from "react";
import { HotelType } from "../../../../backend/src/shared/types";

type Props = {
    actionForm: string;
    hotel?: HotelType;
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
    imageUrls: string[];
    imageUrlsDelete?: string[] ;
    facilities: string[];
};

const ManagerHotelFrom = ({ hotel, onSave, isLoading, actionForm }: Props) => {
    const formMethods = useForm<HotelFormData>();
    const { handleSubmit, reset } = formMethods;
    
    useEffect(() => {
        reset(hotel);
    }, [hotel, reset]);

    const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
        // create new object && call API 
        const formData = new FormData();
        if (hotel) {
            formData.append("hotelId", hotel._id);
        }
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

        if (formDataJson.imageUrls) {
            formDataJson.imageUrls.forEach((url, index) => {
                formData.append(`imageUrls[${index}]`, url);
            });
        }

        if (formDataJson.imageUrlsDelete) {
            formDataJson.imageUrlsDelete.forEach((url, index) => {
                formData.append(`imageUrlsDelete[${index}]`, url);
            });
        }       

        Array.from(formDataJson.imageFiles).forEach((imageFile) => {
            formData.append(`imageFiles`, imageFile);
        });

        onSave(formData);
        console.log('formDataJson',formDataJson)

    });

    return (
        //form context for child components to access form methods(register,..) 
        //without pass through props
        <form className=" flex flex-col gap-10" onSubmit={onSubmit} >
            <FormProvider {...formMethods}>
                <DetailsSection action={actionForm} />
                <TypeSection />
                <FacilitiesSection />
                <GuestsSection />
                <ImagesSection  isLoading={isLoading}/>              

                <span className="flex justify-end">
                    <button
                        disabled={isLoading}
                        type="submit"
                        className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500"
                    >
                        {(actionForm === 'Edit') &&
                            (isLoading ? "Updating..." : "Update")
                        }
                        {(actionForm === 'Add') &&
                            (isLoading ? "Saving..." : "Save")
                        }
                    </button>
                </span>
            </FormProvider>
        </form>
    )
}

export default ManagerHotelFrom;