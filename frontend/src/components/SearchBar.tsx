import { FormEvent, useState } from "react";
import { useSearchContext } from "../contexts/SearchContext"
import { useNavigate } from "react-router-dom";
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";

const SearchBar = () => {
    const navigate = useNavigate();
    const search = useSearchContext();

    const [destination, setDestination] = useState<string>(search.destination);
    const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
    const [checkOut, setCheckOut] = useState<Date>(addDays(search.checkIn, 1));
    const [adultCount, setAdultCount] = useState<number>(search.adultCount);
    const [childCount, setChildCount] = useState<number>(search.childCount);

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        search.saveSearchValues({
            destination,
            checkIn,
            checkOut,
            adultCount,
            childCount
        });
        navigate("/search");
    }
    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    const handleDateChange = (dates: [Date, Date]) => {
        if (dates) {
            const [start, end] = dates;
            setCheckIn(start);
            setCheckOut(end);
        }
    };

    const handleBlur = () => {
        if (!checkOut)
            setCheckOut(addDays(checkIn, 1));
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="-mt-8 p-2 bg-orange-200 rounded shadow-md grid xl:grid-cols-5  2xl:grid-cols-9 items-center gap-2"
        >
            <div className="flex flex-row items-center flex-1 bg-white p-2 rounded 2xl:col-span-3 xl:col-span-3">
                <MdTravelExplore size={25} className="mr-2" />
                <input
                    placeholder="Where are you going?"
                    className="destination text-lg w-full focus:outline-none"
                    value={destination}
                    onChange={(event) => setDestination(event.target.value)}
                />

            </div>

            <div className="flex gap-1 cols 2xl:col-span-2 xl:col-span-2">
                <DatePicker
                    selected={checkIn}
                    onChange={handleDateChange}
                    onBlur={handleBlur}
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={minDate}
                    maxDate={maxDate}
                    monthsShown={2}
                    selectsRange
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Check-in Check-out Date"
                    className="min-w-full text-lg bg-white p-2 focus:outline-none rounded "
                    wrapperClassName="min-w-full"
                />
            </div>

            <div className="flex text-lg bg-white px-2 py-1 gap-2 rounded 2xl:col-span-3 xl:col-span-3">
                <label className="items-center flex">
                    Adults:
                    <input
                        className="w-full p-1 focus:outline-none font-bold"
                        type="number"
                        min={1}
                        max={20}
                        value={adultCount}
                        onChange={(event) => setAdultCount(parseInt(event.target.value))}
                    />
                </label>
                <label className="items-center flex">
                    Children:
                    <input
                        className="w-full p-1 focus:outline-none font-bold"
                        type="number"
                        min={0}
                        max={20}
                        value={childCount}
                        onChange={(event) => setChildCount(parseInt(event.target.value))}
                    />
                </label>
                <label className="items-center flex">
                    Rooms:
                    {/* <input
                        className="w-full p-1 focus:outline-none font-bold"
                        type="number"
                        min={1}
                        max={20}
                        value={adultCount}
                        onChange={(event) => setAdultCount(parseInt(event.target.value))}
                    /> */}
                </label>
            </div>

            <div className="flex gap-1 cols 2xl:col-span-1 xl:col-span-2">
                <button className="w-full bg-blue-600 text-white h-full p-2 font-bold text-xl hover:bg-blue-500 rounded">
                    Search
                </button>
            </div>
        </form>
    );
}

export default SearchBar
