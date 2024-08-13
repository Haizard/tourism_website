import React from "react";
import { IoLocationSharp } from "react-icons/io5";

const PlaceCard = ({ img, location }) => {
  return (
    <div
      className="shadow-lg transition-all duration-500 hover:shadow-xl dark:text-white cursor-pointer bg-[#f0f4f8] rounded-lg overflow-hidden"
    >
      <div className="relative w-full h-60">
        <img
          src={img}
          alt="Place"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-110"
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
