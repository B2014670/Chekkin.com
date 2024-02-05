import { useMutation } from "react-query";
import ManagerHotelFrom from "../components/forms/ManagerHotelFrom"
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";

const AddHotel = () => {
  const { showToast } = useAppContext();

  const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
    onSuccess: () => {
      showToast({ message: "Hotel Saved!", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Error Saving Hotel", type: "ERROR" });
    },
  });

  const handleSave = (hotelFormData: FormData) => {
    console.log(hotelFormData)
    mutate(hotelFormData);
  };

  return <ManagerHotelFrom onSave={handleSave} isLoading={isLoading} />;
};

export default AddHotel;
