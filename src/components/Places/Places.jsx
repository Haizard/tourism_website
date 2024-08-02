import React from "react";
import PlaceCard from "./PlaceCard";
import Img1 from "../../assets/places/Ngorongoro.jpg";
import Img2 from "../../assets/places/Great migration Wildebeests and zebras.jpg";
// ... other imports

const PlacesData = [
  {
    img: Img1,
    title: "4 DAYS TZ MID RANGE SAFARI",
    location: "Tanzania",
    description: "ITS a 4 DAYS 3 NIGHT :Discover the stunning Ngorongoro Crater, a UNESCO World Heritage Site in Tanzania, where lush landscapes and abundant wildlife create an awe-inspiring safari experience. Marvel at the breathtaking scenery and encounter a vibrant array of animals in this natural wonder.",
    price: "1659 per1 - 16496 per 10 ",
    type: "4 DAYS",
    additionalInfo1: { day: "Day 1", info: "ARUSHA => TARA | PLANET LODGE | OVER NIGHT : ELEPHANT SPRING.| karibu camps" },
    additionalInfo2: { day: "Day 2", info: "TARA => NCAA (NGORONGOR CONSERVATIONO)| OVERNIGHT : LIONS PAN" },
    additionalInfo3: { day: "Day 3", info: "NCAA => PEYASI LAKE (HADZABE) | OVERNIGHT: MANYARA JUA KALI CAMP." },
    additionalInfo4: { day: "Day 4", info: "CAMP => MANYARA N.P -P ARUSHA. | OVERNIGHT : PLANET LODGE" },
  },
  {
    img: Img2,
    title: "SERENGETI MARA WildBEAST MIGRATION 6DAYS/5NIGHT",
    location: "Tanzania",
    description: "Immerse yourself in the grandeur of Lake Tanganyika, Africa's deepest and second-largest freshwater lake. Its crystal-clear waters and rich biodiversity make it a hidden gem for adventure seekers and nature enthusiasts alike.",
    price: "2199 per1 - 1999 per 9",
    type: "7 DAYS",
    additionalInfo1: { day: "Day 1", info: "Jpro Airport => HOTEL PLANET" },
    additionalInfo2: { day: "Day 2", info: "Hotel => TARA | Elephant spring" },
    additionalInfo3: { day: "Day 3", info: "TARA => SERENGETI CENTER, karibu camps" },
    additionalInfo4: { day: "Day 4", info: "SERENGETI CENTER => NORTHERN SERE" },
    additionalInfo5: { day: "Day 5", info: "SERE => NCAA | CENTAL SERE | karibuni camp.center" },
    additionalInfo6: { day: "Day 6", info: "NCAA => ARUSHA | PLANET LODGE" },
    additionalInfo7: { day: "Day 7", info: "DEPARTURE" },
  },
  {
    img: Img2,
    title: "5 DAYS SAFARI",
    location: "Tanzania",
    description: "Embark on an unforgettable Tanzanian safari, where iconic wildlife roams the vast savannas and stunning landscapes of Serengeti and Ngorongoro. Experience thrilling encounters with Africa’s Big Five in a world-renowned adventure paradise.",
    price: "1799 - 17896 pax",
    type: "5 DAYS",
    additionalInfo1: { day: "Day 1", info: "ARUSHA => TARA | PLANET LODGE =>  ELEPHANT SPKING" },
    additionalInfo2: { day: "Day 2", info: "TARA => SERENGETI | KARIBU CAMP | OVERNIGHT : CENTER SERENGETI CAMP" },
    additionalInfo3: { day: "Day 3", info: "SERENGETI GAME DRIVING | OVERNIGHT KARIBUNI CAMP CENTER SERE" },
    additionalInfo4: { day: "Day 4", info: "NCAA => ARUSHA | OVERNIGHT : PLANET LODGE" },
    additionalInfo6: { day: "Day 6", info: "DEPARTURE" },
  },
  {
    img: Img2,
    title: "4 DAYS CAMPING SAFARI (North CIRCUIT) ",
    location: "Tanzania",
    description: "Discover Arusha, Tanzania’s vibrant gateway to stunning national parks and the majestic Mount Kilimanjaro. This bustling city offers a unique blend of culture, adventure, and breathtaking landscapes.",
    price: 1369,
    type: "4 DAYS",
    additionalInfo1: { day: "Day 1", info: "ARUSHA => TARA | OVERNIGHT : CAMPSITE" },
    additionalInfo2: { day: "Day 2", info: "TARA => SERENGETI | OVERNIGHT => CAMPSITE" },
    additionalInfo3: { day: "Day 3", info: "SERENGETI GAME DRIVE | OVERNIGHT : CAMPSITE" },
    additionalInfo4: { day: "Day 4", info: "SERENGETI => NCAA | OVERNIGHT : MANYARA JUA KALI CAMPLODGE" },
    additionalInfo5: { day: "OR", info: "SERENGETI => NCAA | OVERNIGHT : KARIBUNI CAMPS LIONS PAN" },
  },
  {
    img: Img2,
    title: "ARUSHA N.P DAJ TOUR",
    location: "Tanzania",
    description: "Enjoy a rugged camping safari with breathtaking views from the northern cliffs. Perfect for adventure enthusiasts seeking a closer connection with nature.",
    price: "299 per 1 - 2896 per x",
    type: "4 DAYS",
    additionalInfo1: { day: "PICKUP / DROPOF", info: "" },
    additionalInfo2: { day: "LUNCH", info: "" },
    additionalInfo3: { day: "SOFT DRINKS and  SNACKS", info: "" },
    additionalInfo4: { day: "FREE PHOTOGRAPHING", info: "" },
    additionalInfo5: { day: "CAMPEING ON THE LIVER", info: "" },
    additionalInfo6: { day: "MOMELA", info: "" },
    additionalInfo7: { day: "SPORT and FISHING", info: "" },
    additionalInfo8: { day: "COFFEE TOUR", info: "" },
  },
 
  {
    img: Img2,
    title: "NGORONGORO CONSERVATION AREA AUTHORITY ",
    location: "Tanzania",
    description: "Discover Arusha, Tanzania’s vibrant gateway to stunning national parks and the majestic Mount Kilimanjaro. This bustling city offers a unique blend of culture, adventure, and breathtaking landscapes.",
    price: 1169,
    type: "2 DAYS and 1 NIGHT",
    additionalInfo1: { day: "Day 1", info: "ARUSHA => MANYARA N.P | OVERNIGHT : MARERA VALLEY" },
    additionalInfo2: { day: "Day 2", info: "LODGE => NCAA => ARUSHA | OVERNIGHT : PLANET LODGE Or GIVEN HOTEL " },
  } 
  
  
 
 
];


const Places = ({ handleOrderPopup }) => {
  return (
    <div className="dark:bg-gray-900 dark:text-white bg-gray-50 py-10">
      <section data-aos="fade-up" className="container">
        <h1 className="my-8 border-l-8 border-primary/50 py-2 pl-2 text-3xl font-bold">
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
  );
};

export default Places;
