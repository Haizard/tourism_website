import React from 'react';
import { motion } from 'framer-motion';
import Card from '../UI/Card';
import Badge from '../UI/Badge';
import Button from '../UI/Button';

const trending = [
    {
        id: 1,
        title: "Serengeti Safari",
        img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
        price: 1200,
        tag: "Most Popular"
    },
    {
        id: 2,
        title: "Zanzibar Beaches",
        img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
        price: 850,
        tag: "Luxury"
    },
    {
        id: 3,
        title: "Mount Kilimanjaro",
        img: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80",
        price: 2100,
        tag: "Adventure"
    }
];

const Trending = () => {
    return (
        <div className="py-20">
            <div className="container">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <p className="text-primary font-black uppercase tracking-widest mb-2">Our Top Picks</p>
                        <h2 className="text-4xl font-black font-heading">Trending Destinations</h2>
                    </div>
                    <Button variant="outline">View All Packages</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {trending.map((item, i) => (
                        <Card key={item.id} delay={i * 0.1} className="group relative h-[400px]">
                            <img src={item.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute top-4 left-4">
                                <Badge variant={item.tag === "Luxury" ? "luxury" : "primary"}>{item.tag}</Badge>
                            </div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <h3 className="text-2xl font-black text-white mb-2">{item.title}</h3>
                                <div className="flex justify-between items-center">
                                    <p className="text-white/80 font-bold">Starting from <span className="text-primary text-xl">${item.price}</span></p>
                                    <motion.button
                                        whileHover={{ x: 5 }}
                                        className="text-white font-black uppercase text-xs tracking-widest"
                                    >
                                        Details →
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
