import { useQuery } from "react-query";
import * as apiClient from "../api-client";
// import BookingForm from "../forms/BookingForm/BookingForm";
// import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import { useSearchContext } from "../contexts/SearchContext";
import BookingForm from "../components/forms/BookingForm";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";

const Booking = () => {
    const search = useSearchContext();
    const { stripePromise } = useAppContext();
    const { hotelId } = useParams();
    const milliseconds1day = (1000 * 60 * 60 * 24);

    const [numberOfNights, setNumberOfNights] = useState<number>(0);

    const { data: currentUser } = useQuery(
        "fetchCurrentUser",
        apiClient.fetchCurrentUser
    );

    const { data: paymentIntentData } = useQuery(
        "createPaymentIntent",
        () =>
            apiClient.createPaymentIntent(
                hotelId as string,
                numberOfNights.toString()
            ),
        {
            enabled: !!hotelId && numberOfNights > 0,
        }
    );    

    const { data: hotel } = useQuery(
        "fetchHotelByID",
        () => apiClient.fetchHotelById(hotelId as string),
        {
            enabled: !!hotelId,
        }
    );

    useEffect(() => {
        if (search.checkIn && search.checkOut) {
            const nights =
                Math.abs(search.checkOut.getTime() - search.checkIn.getTime())
                / milliseconds1day;

            setNumberOfNights(Math.ceil(nights));
        }
    }, [search.checkIn, search.checkOut]);

    if (!hotel) {
        return <></>
    }


    return (
        <div className="grid md:grid-cols-[1fr] lg:grid-cols-[1fr_2fr] sm:space-y-2 md:space-y-2 lg:space-x-2 lg:space-y-0  py-5">
            <BookingDetailsSummary
                checkIn={search.checkIn}
                checkOut={search.checkOut}
                adultCount={search.adultCount}
                childCount={search.childCount}
                numberOfNights={numberOfNights}
                hotel={hotel}
            />
            {currentUser && paymentIntentData && (
                <Elements
                    stripe={stripePromise}
                    options={{
                        clientSecret: paymentIntentData.clientSecret,
                    }}
                >
                    <BookingForm
                        currentUser={currentUser}
                        paymentIntent={paymentIntentData}
                    />
                </Elements>
            )}
        </div>
    );
};

export default Booking;