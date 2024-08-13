import React from "react";
import PlaceCard from "./PlaceCard";
import Img1 from "../../assets/places/Serengeti2.jpg";
import Img2 from "../../assets/places/Manyara.jpg";
import Img3 from "../../assets/places/NatronLake.jpg";
import Img4 from "../../assets/places/kilimanjarotour.jpg";
import Img5 from "../../assets/places/birdwatching1.jpg";
import Img6 from "../../assets/places/birdwatching2.jpg";
import Img7 from "../../assets/places/birdwatching3.jpg";
import Img8 from "../../assets/places/birdwatching4.jpg";
import Img9 from "../../assets/places/beastMigration.jpg";
import Img10 from "../../assets/places/nicemoment3.jpg";
import Img11 from "../../assets/places/camp1.jpg";
import Img12 from "../../assets/places/chief camp.jpg";
import Img13 from "../../assets/places/camp3.jpg";
import Img14 from "../../assets/places/camp4.jpg";
import Img15 from "../../assets/places/Lewa Safari Camp _ Kenya.jpg";

// Data array
const PlacesData = [
  { img: Img1, location: "Tanzania, Serengeti" },
  { img: Img2, location: "Tanzania, Manyara" },
  { img: Img3, location: "Tanzania, Natron Lake" },
  { img: Img4, location: "Tanzania, Mount Kilimanjaro" },
  { img: Img5, location: "Tanzania, Bird Watching" },
  { img: Img6, location: "Tanzania, Bird Watching" },
  { img: Img7, location: "Tanzania, Bird Watching" },
  { img: Img8, location: "Tanzania, Bird Watching" },
  { img: Img9, location: "Tanzania, Beast Migration" },
  { img: Img10, location: "Tanzania, Nice Timing" },
  { img: Img11, location: "Tanzania, Karibu Camp" },
  { img: Img12, location: "Tanzania, Karibu Camp" },
  { img: Img13, location: "Tanzania, Karibu Camp" },
  { img: Img14, location: "Tanzania, Karibu Camp" },
  { img: Img15, location: "Tanzania, Karibu Camp" },
];

const Places = ({ handleOrderPopup }) => {
  return (
    <div className="dark:bg-gray-900 dark:text-white bg-gray-50 py-10">
      <section data-aos="fade-up" className="container">
        <h1 className="my-8 border-l-8 border-primary/50 py-2 pl-2 text-3xl font-bold">
          Our Best Latest Photos
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
