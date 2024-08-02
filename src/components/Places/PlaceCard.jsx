import React from "react";
import { IoLocationSharp } from "react-icons/io5";

const PlaceCard = ({
  img,
  title,
  location,
  description,
  price,
  type,
  handleOrderPopup,
  additionalInfo1,
  additionalInfo2,
  additionalInfo3,
  additionalInfo4,
  additionalInfo5,
  additionalInfo6,
  additionalInfo7,
  additionalInfo8
}) => {
  return (
    <div
      className="shadow-lg transition-all duration-500 hover:shadow-xl dark:text-white cursor-pointer"
      onClick={handleOrderPopup}
      style={{ backgroundColor: '#f0f4f8' }} // Cool background color
    >
      <div className="overflow-hidden">
        <img
          src={img}
          alt="No image"
          className="mx-auto h-[220px] w-full object-cover transition duration-700 hover:skew-x-2 hover:scale-110"
        />
      </div>

      <div className="space-y-2 p-3" >
        <h1 className="line-clamp-1 font-bold text-xl">{title}</h1>
        <div className="flex items-center gap-2 opacity-70">
          <IoLocationSharp />
          <span>{location}</span>
        </div>
        <p className="line-clamp-2">{description}</p>
        <div className="flex items-center justify-between border-t-2 py-3 !mt-3 bg-green-300">
          <div className="opacity-70">
            <p>{type}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-800">${price}</p> {/* Gold color for price */}
          </div>
        </div>
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              additionalInfo1,
              additionalInfo2,
              additionalInfo3,
              additionalInfo4,
              additionalInfo5,
              additionalInfo6,
              additionalInfo7,
              additionalInfo8,
            ].map((info, index) => (
              <div
                key={index}
                className={`flex items-center justify-between py-2 ${
                  index !== 0 ? 'border-t border-gray-300' : ''
                }`}
              >
                <p className="font-semibold text-red-600">{info?.day}</p> {/* Red and bold */}
                <p className="text-blue-600 ml-4">{info?.info}</p> {/* Green with space */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
