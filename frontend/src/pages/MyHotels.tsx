import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { Bed, Hotel, Map, Star, Wallet } from 'lucide-react';
import Description from "../components/Description"
import { useState } from "react";
import { HotelType } from "../../../backend/src/shared/types";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const MyHotels = () => {
    const [myHotels, setMyHotels] = useState<HotelType[] | null>(null);

    const notify = (message: string, type: string) => toast(message, {
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: type === 'success' ? 'toast-message-success' : 'toast-message-error'
    });

    const { data: hotelData } = useQuery(
        "fetchMyHotels", //key
        apiClient.fetchMyHotels,
        {
            onSuccess: (data) => {
                setMyHotels(data);
            }
            ,
            onError: (error) => {
                console.log('Error fetching hotels fe:', error);
            }
        }
    );

    if (!hotelData || hotelData.length === 0) {
        return (
            <div className="space-y-5 py-5">
                <span className="flex justify-between">
                    <h1 className="text-3xl font-bold">My Hotels</h1>
                    <Link
                        to="/add-hotel"
                        className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
                    >
                        Add Hotel
                    </Link>
                </span>
                <div className="text-center">No Hotels found</div>;
            </div>
        );
    }

    const handleDelete = async (hotelId: string) => {
        try {
            await apiClient.deleteMyHotelById(hotelId);
            notify('Hotel deleted successfully!', 'success');
            const hotels = await apiClient.fetchMyHotels(); // Fetch hotels after deletion
            if (hotels) {
                setMyHotels(hotels); // Update state with fetched hotels
            }
        } catch (error) {
            notify('Error delete hotels fe', 'error');
            console.log('Error delete hotels fe:', error);
        }
    };




    return (
        <div className="space-y-5 py-5">
            <span className="flex justify-between">
                <h1 className="text-3xl font-bold">My Hotels</h1>
                <Link
                    to="/add-hotel"
                    className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
                >
                    Add Hotel
                </Link>
            </span>
            <div className="grid grid-cols-1 gap-8">
                {myHotels && myHotels.map((hotel) => (

                    <div
                        key={hotel._id}
                        data-testid="hotel-card"
                        className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5"
                    >
                        <h2 className="text-2xl font-bold">{hotel.name}</h2>
                        <div className="whitespace-pre-line">
                            <Description longText={hotel.description} />
                        </div>

                        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                <Map className="mr-1" />
                                {hotel.city}, {hotel.country}
                            </div>
                            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                <Hotel className="mr-1" />
                                {hotel.type}
                            </div>
                            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                <Wallet className="mr-1" />{hotel.pricePerNight} /night
                            </div>
                            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                <Bed className="mr-1" />
                                {hotel.adultCount} adults, {hotel.childCount} children
                            </div>
                            <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                <Star className="mr-1" />
                                {hotel.starRating} Star Rating
                            </div>

                        </div>
                        <div className="flex space-x-2 justify-end">
                            <Link
                                to={`/detail/${hotel._id}`}
                                className="bg-blue-600 text-white h-full p-2 font-bold text-xl max-w-fit hover:bg-blue-500"
                            >
                                View More
                            </Link>
                            <Link
                                to={`/edit-hotel/${hotel._id}`}
                                className="flex bg-yellow-600 text-white text-xl font-bold p-2 hover:bg-yellow-400"
                            >
                                Edit
                            </Link>
                            <button
                                className="flex bg-red-600 text-white text-xl font-bold p-2 hover:bg-red-500"
                                onClick={() => handleDelete(hotel._id)}
                            >
                                Delete
                            </button>
                        </div>


                    </div>
                ))}
            </div>
            <ToastContainer icon={false} />
        </div>
    );
};

export default MyHotels;