import React from "react";
import Slider from "react-slick";

const testimonialData = [
  {
    id: 1,
    name: "Christopher Reid",
    role: "Adventure Traveler",
    text: "My safari experience with Makolo was truly unforgettable. From the stunning landscapes to the incredible wildlife, everything was perfectly organized and exceeded my expectations.",
    img: "https://picsum.photos/101/101",
  },
  {
    id: 2,
    name: "Maria William",
    role: "Nature Enthusiast",
    text: "An absolutely amazing adventure! The guides were knowledgeable, the accommodations were top-notch, and the wildlife encounters were spectacular. Highly recommend!",
    img: "https://picsum.photos/102/102",
  },
  {
    id: 3,
    name: "Winston Clarke",
    role: "Repeat Client",
    text: "The attention to detail and personalized service made our trip unforgettable. Every aspect of the safari was thoughtfully planned, ensuring a seamless and thrilling experience.",
    img: "https://picsum.photos/103/103",
  },
];

const Testimonial = () => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 600,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [{ breakpoint: 640, settings: { slidesToShow: 1 } }],
  };

  return (
    <div className="py-24 bg-slate-200">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-primary font-bold uppercase tracking-widest text-sm mb-3">
            Guest Reviews
          </p>
          <h2 className="text-4xl md:text-5xl font-black font-heading text-slate-900">
            What Our Adventurers Say
          </h2>
        </div>

        {/* Slider */}
        <div className="max-w-5xl mx-auto">
          <Slider {...settings}>
            {testimonialData.map(({ id, name, role, text, img }) => (
              <div key={id} className="px-4 py-3">
                <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-100 h-full relative">
                  {/* Quote mark */}
                  <span className="absolute top-6 right-8 text-7xl text-primary/10 font-serif leading-none select-none">
                    "
                  </span>
                  <p className="text-slate-700 text-sm leading-relaxed font-medium mb-8 relative z-10">
                    {text}
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      src={img}
                      alt={name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/30"
                    />
                    <div>
                      <p className="font-black text-slate-900 text-sm">{name}</p>
                      <p className="text-primary font-bold text-xs uppercase tracking-wider">
                        {role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
