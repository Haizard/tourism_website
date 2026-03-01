import React from "react";
import { motion } from "framer-motion";
import Card from "../UI/Card";
import Badge from "../UI/Badge";
import Button from "../UI/Button";

const trending = [
  {
    id: 1,
    title: "Serengeti Safari",
    img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
    price: 1200,
    tag: "Most Popular",
  },
  {
    id: 2,
    title: "Zanzibar Beaches",
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
    price: 850,
    tag: "Luxury",
  },
  {
    id: 3,
    title: "Mount Kilimanjaro",
    img: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80",
    price: 2100,
    tag: "Adventure",
  },
];

const Trending = () => {
  return (
    <div className="py-24 bg-slate-900">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <p className="text-secondary font-bold uppercase tracking-widest mb-3 text-sm">
              Our Top Picks
            </p>
            <h2 className="text-4xl md:text-5xl font-black font-heading text-white">
              Trending Destinations
            </h2>
          </div>
          <Button
            variant="outline"
            className="border-slate-700 text-white hover:bg-slate-800"
          >
            View All Packages
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trending.map((item, i) => (
            <Card
              key={item.id}
              delay={i * 0.1}
              className="group relative h-[420px] rounded-3xl overflow-hidden border-none shadow-2xl"
            >
              <img
                src={item.img}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90" />
              <div className="absolute top-4 left-4">
                <Badge variant={item.tag === "Luxury" ? "luxury" : "secondary"}>
                  {item.tag}
                </Badge>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-2xl font-black text-white mb-2 font-heading">
                  {item.title}
                </h3>
                <div className="flex justify-between items-center">
                  <p className="text-slate-300 font-bold text-sm">
                    From{" "}
                    <span className="text-secondary text-xl font-black">
                      ${item.price}
                    </span>
                  </p>
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="text-primary font-black uppercase text-sm tracking-widest"
                  >
                    Explore →
                  </motion.button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trending;
