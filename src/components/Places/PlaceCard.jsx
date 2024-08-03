import React from "react";
import { IoLocationSharp } from "react-icons/io5";

const PlaceCard = ({ img, location }) => {
  return (
    <div
      className="shadow-lg transition-all duration-500 hover:shadow-xl dark:text-white cursor-pointer"
      style={{ backgroundColor: '#f0f4f8' }} // Cool background color
    >
      <div className="overflow-hidden">
        <img
          src={img}
          alt="Place"
          className="mx-auto h-[220px] w-full object-cover transition duration-700 hover:skew-x-2 hover:scale-110"
        />
      </div>

      <div className="p-3">
        <div className="flex items-center gap-2 opacity-70">
          <IoLocationSharp />
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
