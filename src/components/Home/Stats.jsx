import React from "react";
import CountUp from "react-countup";
import { Users, MapPin, Award, Globe } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    icon: <Users className="w-8 h-8" />,
    count: 10000,
    suffix: "+",
    label: "Happy Travelers",
    color: "text-primary",
  },
  {
    icon: <Award className="w-8 h-8" />,
    count: 500,
    suffix: "+",
    label: "Tours Completed",
    color: "text-secondary",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    count: 15,
    suffix: "+",
    label: "Years Experience",
    color: "text-accent",
  },
  {
    icon: <MapPin className="w-8 h-8" />,
    count: 25,
    suffix: "+",
    label: "Destinations",
    color: "text-primary",
  },
];

const Stats = () => {
  return (
    <div className="py-20 bg-slate-900 border-y border-white/5">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className={`flex justify-center mb-6 ${stat.color} transition-transform duration-500 group-hover:scale-110`}>
                {stat.icon}
              </div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2 font-heading tracking-tighter">
                <CountUp end={stat.count} duration={3} enableScrollSpy scrollSpyOnce />
                {stat.suffix}
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
