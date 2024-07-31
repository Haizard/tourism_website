import React from "react";
import BlogCard from "./BlogCard";
import Img1 from "../../assets/places/Great migration Wildebeests and zebras.jpg";
import Img2 from "../../assets/places/Ngorongoro.jpg";
import Img3 from "../../assets/places/tanganyika.jpg";

const BlogsData = [
  {
    id: 1,
    image: Img1,
    title: "Wildebeest Migration",
    description:
      "One of nature’s most breathtaking phenomena is the wildebeest migration, an awe-inspiring journey that unfolds across the Serengeti-Masai Mara ecosystem in East Africa. Each year, over a million wildebeest, along with hundreds of thousands of zebras and gazelles, embark on a perilous trek in search of fresh grazing grounds and water.\n\nThis epic migration is driven by the seasonal rains, which dictate the movement of these herds. The journey typically begins in the southern Serengeti, where calving takes place during the rainy season, and continues northward into the Masai Mara in Kenya. Along the way, the herds face numerous challenges, including river crossings teeming with crocodiles and encounters with predators like lions and hyenas.\n\nWitnessing the wildebeest migration is a spectacular experience, offering unparalleled opportunities for wildlife observation and photography. The sheer scale of the migration, coupled with the dramatic landscapes of the African savanna, makes it one of the world’s greatest wildlife events.",
    author: "Haitham Misape",
    date: "April 22, 2022",
  },
  
  {
    id: 1,
    image: Img2,
    title: "Ngorongoro",
    description:
      "Nestled in the heart of northern Tanzania lies the Ngorongoro Crater, a breathtaking natural wonder that beckons travelers from all corners of the globe. This UNESCO World Heritage Site, often referred to as the 'Garden of Eden,' is a colossal caldera formed by the collapse of a massive volcano.\n\nAs you descend into the crater, you’re greeted by a mesmerizing panorama of lush grasslands, verdant forests, and shimmering lakes. The landscape is not just visually stunning but also teeming with life. The crater’s unique ecosystem supports a dense concentration of wildlife, making it one of Africa’s premier safari destinations.\n\nImagine spotting majestic lions lounging under acacia trees, herds of elephants moving gracefully across the plains, and the elusive black rhino grazing in the distance. The Ngorongoro Crater is also a haven for bird watchers, with over 500 species gracing its skies. Each visit offers a new adventure, whether you're watching wildebeest migrations, witnessing flamingos in the soda lakes, or simply taking in the grandeur of the landscape.\n\nThe Ngorongoro Crater isn’t just a place; it’s an experience a journey into one of the world’s most extraordinary natural habitats. If you’re seeking an unforgettable safari adventure, this iconic crater promises a blend of breathtaking beauty and unparalleled wildlife encounters.",
    author: "Haitham Misape",
    date: "April 22, 2022",
  },
  
  {
    id: 1,
    image: Img3,
    title: "Tanganyika",
    description:
      "Explore the Untamed Beauty of Mahale Mountains 🏞️ Embark on a journey to the remote Mahale Mountains, where pristine forests meet the shores of Lake Tanganyika. Encounter wild chimpanzees in their natural habitat, hike through lush, mountainous terrain, and relax on sandy beaches. This secluded paradise offers a unique blend of wildlife encounters and stunning landscapes, providing a tranquil retreat for adventurers and nature lovers alike. 🌳🐒 Join Easy Travel for an unforgettable expeditio..",
    author: "Haitham Misape",
    date: "April 22, 2022",
  },
];

const BlogsComp = () => {
  return (
    <>
      <div className="dark:bg-gray-900 dark:text-white py-10">
        <section data-aos="fade-up" className="container ">
          <h1 className=" my-8 border-l-8 border-primary/50 py-2 pl-2 text-3xl font-bold">
            Our Latest Blogs
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {BlogsData.map((item) => (
              <BlogCard key={item.id} {...item} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogsComp;
