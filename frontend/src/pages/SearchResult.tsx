import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext"
import * as apiClient from "../api-client";
import { ChangeEvent, useState } from "react";
import SearchResultsCard from "../components/SearchResultsCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/filter/StarRatingFilter";
import FacilitiesFilter from "../components/filter/FacilitiesFilter";
import HotelTypesFilter from "../components/filter/HotelTypesFilter";
import PriceFilter from "../components/filter/PriceFilter";


const SearchResult = () => {
    const search = useSearchContext();

    const [hideFilter, setHideFilter] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [selectedStars, setSelectedStars] = useState<string[]>([]);
    const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
    const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
    const [sortOption, setSortOption] = useState<string>("");

    const searchParams = {
        destination: search.destination,
        checkIn: search.checkIn.toISOString(),
        checkOut: search.checkOut.toISOString(),
        adultCount: search.adultCount.toString(),
        childCount: search.childCount.toString(),
        page: page.toString(),
        stars: selectedStars,
        types: selectedHotelTypes,
        facilities: selectedFacilities,
        maxPrice: selectedPrice?.toString(),
        sortOption,
    };

    const { data: hotelData } = useQuery(
        ["searchHotels", searchParams], //key
        () => apiClient.searchHotels(searchParams),
        {
            onError: (error) => {
                console.log('Error fetching hotels fe:', error);
            },
        }
    );

    // if (!hotelData) {
    //     return <span>No Hotels found</span>;
    // };

    // console.log(search);

    const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const starRating = event.target.value;

        setSelectedStars((prevStars) =>
            event.target.checked
                ? [...prevStars, starRating]
                : prevStars.filter((star) => star !== starRating)
        );
    }

    const handleHotelTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const hotelType = event.target.value;

        setSelectedHotelTypes((prevHotelTypes) =>
            event.target.checked
                ? [...prevHotelTypes, hotelType]
                : prevHotelTypes.filter((hotel) => hotel !== hotelType)
        );
    };

    const handleFacilitiesChange = (event: ChangeEvent<HTMLInputElement>) => {
        const facility = event.target.value;

        setSelectedFacilities((prevFacilities) =>
            event.target.checked
                ? [...prevFacilities, facility]
                : prevFacilities.filter((star) => star !== facility)
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr]  gap-5 py-5">
            <div className="rounded-lg border border-slate-300 p-5 h-fit lg:sticky top-5">
                <div className={`space-y-2  ${hideFilter ? 'hidden' : ''}`}>
                    <h3 className="text-lg font-semibold border-b border-slate-300 pb-2">
                        Filter by:
                    </h3>
                    <PriceFilter
                        selectedPrice={selectedPrice}
                        onChange={(value?: number) => setSelectedPrice(value)}
                    />
                    <StarRatingFilter
                        selectedStars={selectedStars}
                        onChange={handleStarsChange}
                    />
                    <FacilitiesFilter
                        selectedFacilities={selectedFacilities}
                        onChange={handleFacilitiesChange}
                    />

                    <HotelTypesFilter
                        selectedHotelTypes={selectedHotelTypes}
                        onChange={handleHotelTypeChange}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">
                        {search.destination ? `  ${search.destination}: ` : ""}{hotelData?.pagination.total}
                        Hotels found
                    </span>
                    <button
                        className="p-2 border rounded-md md:hidden"
                        onClick={() => setHideFilter(!hideFilter)}
                    >
                        Filter
                    </button>
                    <select
                        value={sortOption}
                        onChange={(event) => setSortOption(event.target.value)}
                        className="p-2 border rounded-md"
                    >
                        <option value="">Sort By</option>
                        <option value="starRating">Star Rating</option>
                        <option value="pricePerNightAsc">
                            Price Per Night (low to high)
                        </option>
                        <option value="pricePerNightDesc">
                            Price Per Night (high to low)
                        </option>
                    </select>
                </div>
                {hotelData?.data.map((hotel, index) => (
                    <span key={index}>
                        <SearchResultsCard hotel={hotel} />
                    </span>
                ))}
                <div>
                    <Pagination
                        page={hotelData?.pagination.page || 1}
                        pages={hotelData?.pagination.pages || 0}
                        onPageChange={(page) => setPage(page)}
                    />
                </div>

            </div>
        </div>
    )
}

export default SearchResult