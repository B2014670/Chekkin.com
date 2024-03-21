import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import ManagerHotelFrom from "../components/forms/ManagerHotelFrom";

const EditHotel = () => {
  const { hotelId } = useParams();
  const { showToast } = useAppContext();

  const { data: hotelData } = useQuery(
    "fetchMyHotelById", //key
    () => apiClient.fetchMyHotelById(hotelId || ""), // Pass a function reference
    {
      enabled: !!hotelId, //Enable the query if hotelId is truthy
    }
  )

  const { mutate, isLoading } = useMutation(apiClient.UpdateMyHotelById, {
    onSuccess: () => {
      showToast({ message: "Change Hotel Saved!", type: "SUCCESS" });

    },
    onError: () => {
      showToast({ message: "Error Edit Hotel", type: "ERROR" });
    },
  });

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData);
    // console.log(hotelFormData);
  };


  return (
    <div className="py-5">
      <ManagerHotelFrom actionForm="Edit" hotel={hotelData} onSave={handleSave} isLoading={isLoading} />;
    </div>
  )
};


export default EditHotel;