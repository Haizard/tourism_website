import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../UI/Button";

const Hero = () => {
  const [priceValue, setPriceValue] = React.useState(1000);
  const [destination, setDestination] = React.useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/packages?search=${destination}&maxPrice=${priceValue}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Cinematic Background (Placeholder for actual video/image) */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      <div className="container relative z-20 text-center text-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-primary font-black uppercase tracking-[0.3em] mb-4 text-sm sm:text-base">
            Discover the Unseen
          </p>
          <h1 className="text-5xl sm:text-7xl font-black mb-8 tracking-tighter leading-tight font-heading">
            Your Next <span className="text-primary">Great Adventure</span>{" "}
            <br /> Starts Here
          </h1>
        </motion.div>

        {/* Search Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl mx-auto mt-12 glass-card p-6 md:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="text-left">
              <label className="text-xs font-black uppercase tracking-widest text-primary mb-2 block">
                Destination
              </label>
              <input
                type="text"
                placeholder="Where to?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-white/5 border-b border-white/20 py-2 focus:outline-none focus:border-primary transition-all text-lg"
              />
            </div>
            <div className="text-left">
              <label className="text-xs font-black uppercase tracking-widest text-primary mb-2 block">
                Budget Limit
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="150"
                  max="5000"
                  step="50"
                  value={priceValue}
                  onChange={(e) => setPriceValue(e.target.value)}
                  className="flex-1 accent-primary"
                />
                <span className="font-bold text-xl min-w-[80px]">
                  ${priceValue}
                </span>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <Button
                onClick={handleSearch}
                className="w-full md:w-auto h-full py-4 px-10"
              >
                Explore Now
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
