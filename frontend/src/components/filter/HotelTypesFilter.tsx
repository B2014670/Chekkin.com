import { useState } from "react";
import { hotelTypes } from "../../config/hotel-option-config";

type Props = {
  selectedHotelTypes: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const HotelTypesFilter = ({ selectedHotelTypes, onChange }: Props) => {
  const initialDisplayCount = 5;
  const [showAll, setShowAll] = useState(false);

  const displayedHotelTypes = showAll ? hotelTypes : hotelTypes.slice(0, initialDisplayCount);

  const handleShowMoreToggle = () => {
    setShowAll(!showAll);
  };

  return (
    <div className=" pb-2">
      <h4 className="text-md font-semibold mb-2">Hotel Type</h4>
      {displayedHotelTypes.map((hotelType, index) => (
        <label key={index} className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="rounded w-4 h-4"
            value={hotelType}
            checked={selectedHotelTypes.includes(hotelType)}
            onChange={onChange}
          />
          <span>{hotelType}</span>
        </label>
      ))}
      {hotelTypes.length > initialDisplayCount && (
        <div className="underline mt-2 text-blue-600 cursor-pointer" onClick={handleShowMoreToggle}>
          {showAll ? 'Show Less' : `Show All ${hotelTypes.length}`}
        </div>
      )}
    </div>
  );
};

export default HotelTypesFilter;