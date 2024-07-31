import React from "react";
import PlaceCard from "./PlaceCard";
import Img1 from "../../assets/places/Ngorongoro.jpg";
import Img2 from "../../assets/places/Great migration Wildebeests and zebras.jpg";
import Img3 from "../../assets/places/Magical of Tanzania Adventure Camping Safari - 4 days.jpg";
import Img4 from "../../assets/places/Arusha, Tanzania - Mount Meru.jpg";
import Img5 from "../../assets/places/Lewa Safari Camp _ Kenya.jpg";
import Img6 from "../../assets/places/My African Safari.jpg";
import Img9 from "../../assets/places/Maasai Cultural Experience _ Best Kenya Safari Experiences _ Art Of Safari.jpg";

const PlacesData = [
  {
    img: Img1,
    title: "Ngorongoro",
    location: "Tanzania",
    description: " Discover the stunning Ngorongoro Crater, a UNESCO World Heritage Site in Tanzania, where lush landscapes and abundant wildlife create an awe-inspiring safari experience. Marvel at the breathtaking scenery and encounter a vibrant array of animals in this natural wonder.",
    price: 1500,
    type: "4 DAYS",
  },
  {
    img: Img2,
    title: "Wild forest migration",
    location: "Tanzania",
    description:
      " Immerse yourself in the grandeur of Lake Tanganyika, Africa's deepest and second-largest freshwater lake. Its crystal-clear waters and rich biodiversity make it a hidden gem for adventure seekers and nature enthusiasts alike.",
    price: 1500,
    type: "4 DAYS",
  },
  {
    img: Img3,
    title: "Tanganyire",
    location: "Tanzania",
    description:
      "Embark on an unforgettable Tanzanian safari, where iconic wildlife roams the vast savannas and stunning landscapes of Serengeti and Ngorongoro. Experience thrilling encounters with Africa’s Big Five in a world-renowned adventure paradise.",
    price: 1500,
    type: "4 DAYS",
  },
  {
    img: Img4,
    title: "Arusha day tour",
    location: "Tanzania",
    description: "Discover Arusha, Tanzania’s vibrant gateway to stunning national parks and the majestic Mount Kilimanjaro. This bustling city offers a unique blend of culture, adventure, and breathtaking landscapes.",
    price: 1299,
    type: "Cultural Relax",
  },
  {
    img: Img9,
    title: "NICAA SAFARI",
    location: "Tanzania",
    description:
      " Embark on a NICAA Safari, offering an exclusive adventure through Tanzania’s most breathtaking landscapes. From pristine wildlife encounters to luxurious accommodations, NICAA delivers an unparalleled safari experience with personalized service and unforgettable memories.",
    price: 1399,
    type: "3 DAYS",
  }, {
    img: Img5,
    title: "CAMPING SAFARI  (Northen cliff)",
    location: "Tanzania",
    description:
      "lorem ipsum dolor sit amet consectetur adipisicing elit.",
    price: 1399,
    type: "4 DAYS",
  },
  {
    img: Img6,
    title: "Tara, Sere, NCAA",
    location: "Tanzania",
    description:
      " : Discover Sere, a hidden gem known for its stunning vistas and vibrant wildlife. Ideal for adventurers and nature lovers, Sere offers a unique blend of rugged beauty and immersive outdoor experiences.",
    price: 1299,
    type: "4 DAYS",
  },
];

const Places = ({ handleOrderPopup }) => {
  return (
    <>
      <div className="dark:bg-gray-900 dark:text-white bg-gray-50 py-10">
        <section data-aos="fade-up" className="container ">
          <h1 className=" my-8 border-l-8 border-primary/50 py-2 pl-2 text-3xl font-bold">
            Best Places to Visit
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {PlacesData.map((item, index) => (
              <PlaceCard
                handleOrderPopup={handleOrderPopup}
                key={index}
                {...item}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Places;
