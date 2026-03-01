import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Card from "../UI/Card";
import Badge from "../UI/Badge";
import Button from "../UI/Button";
import { fetchTours } from "../../services/api";

const Trending = () => {
  const [tours, setTours] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTours = async () => {
      try {
        const res = await fetchTours();
        // Get the first 6 latest tours for trending
        setTours(res.data.slice(0, 6));
      } catch (error) {
        console.error("Error loading trending tours:", error);
      }
    };
    loadTours();
  }, []);

  useEffect(() => {
    if (tours.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tours.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [tours]);

  const handleNavigate = (item) => {
    navigate(`/packages/${item.title}`, { state: item });
    window.scrollTo(0, 0);
  };

  // Determine which cards to show based on screen size
  // For simplicity and "sliding" feel, we'll show a window of 3 cards
  const getVisibleTours = () => {
    if (tours.length === 0) return [];
    const items = [];
    for (let i = 0; i < 3; i++) {
      items.push(tours[(currentIndex + i) % tours.length]);
    }
    return items;
  };

  const visibleTours = getVisibleTours();

  return (
    <div className="py-24 bg-slate-900 overflow-hidden">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-secondary font-bold uppercase tracking-widest mb-3 text-sm">
              Our Top Picks
            </p>
            <h2 className="text-4xl md:text-5xl font-black font-heading text-white">
              Trending Destinations
            </h2>
          </motion.div>
          <Button
            variant="outline"
            className="border-slate-700 text-white hover:bg-slate-800"
            onClick={() => navigate("/packages")}
          >
            Explore All Deals
          </Button>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {visibleTours.map((item, i) => (
                <motion.div
                  key={`${item._id}-${currentIndex}-${i}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -50 }}
                  transition={{ duration: 0.8, ease: "circOut" }}
                >
                  <Card
                    className="group relative h-[420px] rounded-[40px] overflow-hidden border-none shadow-2xl cursor-pointer"
                    onClick={() => handleNavigate(item)}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-90" />

                    <div className="absolute top-6 left-6 flex gap-2">
                      <Badge variant="luxury" className="backdrop-blur-md bg-white/10">
                        {item.tourType || "Trending"}
                      </Badge>
                      {item.isGroupTour && (
                        <Badge variant="secondary" className="backdrop-blur-md">
                          Group
                        </Badge>
                      )}
                    </div>

                    <div className="absolute bottom-8 left-8 right-8">
                      <p className="text-secondary font-black text-xs uppercase tracking-widest mb-2">
                        {item.location}
                      </p>
                      <h3 className="text-3xl font-black text-white mb-4 font-heading uppercase tracking-tighter leading-none">
                        {item.title}
                      </h3>
                      <div className="flex justify-between items-center pt-4 border-t border-white/10">
                        <p className="text-slate-300 font-bold text-sm">
                          From{" "}
                          <span className="text-white text-2xl font-black">
                            ${item.price}
                          </span>
                        </p>
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-secondary shadow-lg shadow-primary/20"
                        >
                          →
                        </motion.div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-12">
            {tours.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 transition-all duration-500 rounded-full ${currentIndex === i ? "w-8 bg-primary" : "w-2 bg-slate-700 hover:bg-slate-600"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trending;
