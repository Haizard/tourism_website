import React from "react";
import { Link } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";

const PackageCard = ({
  image,
  title,
  location,
  price,
  description,
  tourType,
  category,
  isGroupTour,
  maxCapacity,
  currentBookings,
  launchDate,
}) => {
  const spotsLeft = maxCapacity - currentBookings;
  const progress = (currentBookings / maxCapacity) * 100;

  return (
    <Link
      to={`/packages/${title}`}
      onClick={() => window.scrollTo(0, 0)}
      state={{
        image,
        title,
        location,
        price,
        description,
        tourType,
        category,
        isGroupTour,
        maxCapacity,
        currentBookings,
        launchDate,
      }}
      className="group block"
    >
      <div className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100">
        <div className="relative h-64 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-primary/90 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
              {tourType || "Safari"}
            </span>
            <span className="bg-secondary/90 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
              {category || "Luxury"}
            </span>
          </div>
          <div className="absolute bottom-0 right-0 bg-white px-6 py-2 rounded-tl-3xl">
            <p className="text-primary font-black text-xl">
              ${price}
              <span className="text-[10px] text-gray-400 ml-1">PP</span>
            </p>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-1 text-gray-400 mb-2">
            <IoLocationSharp className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest">
              {location}
            </span>
          </div>
          <h3 className="text-xl font-black text-gray-900 group-hover:text-primary transition-colors mb-2 uppercase tracking-tight line-clamp-1">
            {title}
          </h3>

          {isGroupTour && (
            <div className="mb-4 bg-primary/5 p-3 rounded-2xl border border-primary/10">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black uppercase text-primary">
                  Confirmed Group
                </span>
                <span className="text-[10px] font-black uppercase text-gray-400">
                  {spotsLeft} Spots Left
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              {launchDate && (
                <p className="text-[10px] font-bold text-secondary mt-2 uppercase tracking-tighter">
                  🚀 Launching: {new Date(launchDate).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PackageCard;
