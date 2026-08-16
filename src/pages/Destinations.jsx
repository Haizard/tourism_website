import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Badge from "../components/UI/Badge";
import { fetchDestinations } from "../services/api";

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDestinations()
      .then((res) => setDestinations(res.data))
      .catch(() => setDestinations([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="container relative z-20 text-center text-white">
          <Badge variant="secondary" className="mb-4">Iconic Tanzania</Badge>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter font-heading">Our <span className="text-primary italic">Destinations</span></h1>
        </div>
      </div>
      <div className="container py-16 px-4">
        {loading ? (
          <p className="text-center text-gray-400 font-bold">Loading destinations...</p>
        ) : destinations.length === 0 ? (
          <p className="text-center text-gray-400 font-bold">No destinations yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((d) => (
              <Link key={d._id} to={`/destinations/${d.slug}`} className="group block">
                <div className="relative h-80 overflow-hidden rounded-[40px] shadow-xl">
                  <img src={d.heroImage} alt={d.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 group-hover:text-primary transition-colors">{d.name}</h3>
                    <p className="text-gray-300 text-sm font-medium line-clamp-2">{d.shortIntro}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations;
