import { useState, useEffect } from "react";
import Slider from "react-slick";
import { fetchTestimonials } from "../../services/api";

const fallback = [
  { _id: "1", name: "Christopher Reid", role: "Adventure Traveler", rating: 5, text: "My safari experience with Makolo was truly unforgettable. From the stunning landscapes to the incredible wildlife, everything was perfectly organized and exceeded my expectations." },
  { _id: "2", name: "Maria William", role: "Nature Enthusiast", rating: 5, text: "An absolutely amazing adventure! The guides were knowledgeable, the accommodations were top-notch, and the wildlife encounters were spectacular." },
  { _id: "3", name: "Winston Clarke", role: "Repeat Client", rating: 5, text: "The attention to detail and personalized service made our trip unforgettable." },
];

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetchTestimonials()
      .then((res) => setTestimonials(res.data.length ? res.data : fallback))
      .catch(() => setTestimonials(fallback));
  }, []);

  const settings = {
    dots: true, arrows: false, infinite: true, speed: 600,
    slidesToShow: 2, slidesToScroll: 1, autoplay: true, autoplaySpeed: 3000, pauseOnHover: true,
    responsive: [{ breakpoint: 640, settings: { slidesToShow: 1 } }],
  };

  return (
    <div className="py-24 section-wash-light">
      <div className="container">
        <div className="text-center mb-16">
          <p className="text-primary font-bold uppercase tracking-widest text-sm mb-3">Guest Reviews</p>
          <h2 className="text-4xl md:text-5xl font-black font-heading text-slate-900">What Our Adventurers Say</h2>
        </div>
        <div className="max-w-5xl mx-auto">
          <Slider {...settings}>
            {testimonials.map(({ _id, name, role, text, rating, image }) => (
              <div key={_id} className="px-4 py-3">
                <div className="glass-light rounded-3xl p-8 h-full relative card-lift hover:shadow-glow-gold transition-shadow duration-300">
                  <span className="absolute top-6 right-8 text-7xl text-primary/10 font-serif leading-none select-none">&quot;</span>
                  <span className="absolute top-0 left-8 right-8 h-1 rounded-b-full bg-gradient-to-r from-primary via-secondary to-primary" />
                  <div className="flex gap-1 text-secondary mb-4">
                    {Array.from({ length: rating || 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed font-medium mb-8 relative z-10">{text}</p>
                  <div className="flex items-center gap-4">
                    {image ? (
                      <img src={image} alt={name} loading="lazy" className="w-12 h-12 rounded-full object-cover ring-2 ring-secondary/40" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-black ring-2 ring-secondary/40">{name?.[0]}</div>
                    )}
                    <div>
                      <p className="font-black text-slate-900 text-sm">{name}</p>
                      <p className="text-primary font-bold text-xs uppercase tracking-wider">{role}</p>
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
