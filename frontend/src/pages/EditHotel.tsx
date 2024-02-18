import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import ManagerHotelFrom from "../components/forms/ManagerHotelFrom";

const EditHotel = () => {
    const { hotelId } = useParams();
    const { showToast } = useAppContext();

    const { data: hotelData } = useQuery(
        "fetchHotelById", //key
        () => apiClient.fetchHotelById(hotelId || ""), // Pass a function reference
        {
            enabled: !!hotelId, //Enable the query if hotelId is truthy
        }
    )

    const { mutate, isLoading } = useMutation(apiClient.UpdateMyHotelById, {
        onSuccess: () => {
          showToast({ message: "Hotel Saved!", type: "SUCCESS" });

        },
        onError: () => {
          showToast({ message: "Error Saving Hotel", type: "ERROR" });
        },
      });
    
      const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData);
        // console.log(hotelFormData);
      };


    return <ManagerHotelFrom actionForm="Edit" hotel={hotelData} onSave={handleSave} isLoading={isLoading} />;
};


export default EditHotel;