import React from "react";
import Hero from "../components/Hero/Hero";
import NatureVid from "../assets/video/main.mp4";
import BlogsComp from "../components/Blogs/BlogsComp";
import Places from "../components/Places/Places";
import Testimonial from "../components/Testimonial/Testimonial";
import Banner from "../components/Banner/Banner";
import Features from "../components/Home/Features";
import Trending from "../components/Home/Trending";

const Home = () => {
  const [orderPopup, setOrderPopup] = React.useState(false);

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  return (
    <>
      <div className="bg-white">
        <div className="h-screen relative overflow-hidden">
          <video
            autoPlay
            loop
            muted
            className="absolute right-0 top-0 h-full w-full object-cover z-0"
          >
            <source src={NatureVid} type="video/mp4" />
          </video>
          <Hero />
        </div>

        <Features />

        <Trending />

        <div className="bg-gray-50">
          <BlogsComp />
        </div>

        <Places handleOrderPopup={handleOrderPopup} />

        <Banner />

        <Testimonial />
      </div>
    </>
  );
};

export default Home;
