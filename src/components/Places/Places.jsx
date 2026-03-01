import React from "react";
import PlaceCard from "./PlaceCard";
import { fetchGallery } from "../../services/api";

const Places = ({ handleOrderPopup }) => {
  const [galleryData, setGalleryData] = React.useState([]);

  React.useEffect(() => {
    const getPlaces = async () => {
      try {
        const response = await fetchGallery();
        setGalleryData(response.data);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      }
    };
    getPlaces();
  }, []);

  return (
    <div className="dark:bg-gray-900 dark:text-white bg-gray-50 py-10">
      <section data-aos="fade-up" className="container">
        <h1 className="my-8 border-l-8 border-primary/50 py-2 pl-2 text-3xl font-bold">
          Our Best Latest Photos
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {galleryData.length > 0 ? (
            galleryData.map((item, index) => (
              <PlaceCard
                handleOrderPopup={handleOrderPopup}
                key={index}
                img={item.img}
                location={item.location}
              />
            ))
          ) : (
            <p className="text-center col-span-full py-10">No photos found or loading...</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Places;
