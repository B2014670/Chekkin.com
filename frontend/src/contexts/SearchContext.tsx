import React, { useContext, useState } from "react";

type SearchType = {
    destination: string;
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
    hotelId?: string;
}
// Define the type for your SearchContext
type SearchContext = {
    destination: string;
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
    hotelId: string;
    saveSearchValues: (
        searchMessage: SearchType
    ) => void;
}
//Create the SearchContext with an initial value
const SearchContext = React.createContext<SearchContext | undefined>(undefined);
// Create a component that will provide the SearchContext value
export const SearchContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [destination, setDestination] = useState<string>(() =>
        sessionStorage.getItem("destination") || ""
    );
    const [checkIn, setCheckIn] = useState<Date>(() =>
        new Date(sessionStorage.getItem("checkIn") || new Date().toISOString())
    );
    const [checkOut, setCheckOut] = useState<Date>(() =>
        new Date(sessionStorage.getItem("checkOut") || new Date().toISOString())
    );
    const [adultCount, setAdultCount] = useState<number>(() =>
        parseInt(sessionStorage.getItem("adultCount") || "1")
    );
    const [childCount, setChildCount] = useState<number>(() =>
        parseInt(sessionStorage.getItem("childCount") || "1")
    );
    const [hotelId, setHotelId] = useState<string>(
        () => sessionStorage.getItem("hotelID") || ""
    );

    const saveSearchValues = (
        searchMessage : SearchType 
    ) => {
        setDestination(searchMessage.destination);
        setCheckIn(searchMessage.checkIn);
        setCheckOut(searchMessage.checkOut);
        setAdultCount(searchMessage.adultCount);
        setChildCount(searchMessage.childCount);
        if (searchMessage.hotelId) {
            setHotelId(searchMessage.hotelId);
        }

        //store key search values
        sessionStorage.setItem("destination", searchMessage.destination);
        sessionStorage.setItem("checkIn", searchMessage.checkIn.toISOString());
        sessionStorage.setItem("checkOut", searchMessage.checkOut.toISOString());
        sessionStorage.setItem("adultCount", searchMessage.adultCount.toString());
        sessionStorage.setItem("childCount", searchMessage.childCount.toString());
        if (searchMessage.hotelId) {
            sessionStorage.setItem("hotelId", searchMessage.hotelId);
        }
    };



    return (
        <SearchContext.Provider
            value={{
                destination,
                checkIn,
                checkOut,
                adultCount,
                childCount,
                hotelId,
                saveSearchValues,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    return context as SearchContext;
}