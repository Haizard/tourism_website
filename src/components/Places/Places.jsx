import React from "react";
import PlaceCard from "./PlaceCard";
import Img1 from "../../assets/places/Ngorongoro.jpg";
import Img2 from "../../assets/places/Great migration Wildebeests and zebras.jpg";
// ... other imports

const PlacesData = [
  {
    img: Img1,
    location: "Tanzania"
  },
  {
    img: Img2,
    location: "Tanzania"
  },
  {
    img: Img2,
    location: "Tanzania"
  },
  {
    img: Img2,
    location: "Tanzania"
  },
  {
    img: Img2,
    location: "Tanzania"
  },
];

const Places = ({ handleOrderPopup }) => {
  return (
    <div className="dark:bg-gray-900 dark:text-white bg-gray-50 py-10">
      <section data-aos="fade-up" className="container">
        <h1 className="my-8 border-l-8 border-primary/50 py-2 pl-2 text-3xl font-bold">
          Orur Best Latest Photos
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {PlacesData.map((item, index) => (
            <PlaceCard
              handleOrderPopup={handleOrderPopup}
              key={index}
              img={item.img}
              location={item.location}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Places;
