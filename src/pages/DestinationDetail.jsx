import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Badge from "../components/UI/Badge";
import { fetchDestination, fetchTours } from "../services/api";

const DestinationDetail = () => {
  const { slug } = useParams();
  const [dest, setDest] = useState(null);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchDestination(slug), fetchTours()])
      .then(([dRes, tRes]) => {
        setDest(dRes.data);
        const related = tRes.data.filter((t) => (t.location || "").toLowerCase().includes((dRes.data.name || "").toLowerCase()));
        setTours(related);
      })
      .catch(() => setDest(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-screen pt-32 text-center text-gray-400 font-bold">Loading destination...</div>;
  if (!dest) return <div className="min-h-screen pt-32 text-center text-gray-500 font-bold">Destination not found.</div>;

  return (
    <div className="min-h-screen section-wash-light">
      <div className="relative h-[55vh] flex items-end overflow-hidden">
        <img src={dest.heroImage} alt={dest.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="container relative z-10 pb-12">
          <Badge variant="secondary" className="mb-4">{dest.location || "Tanzania"}</Badge>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter font-heading">{dest.name}</h1>
        </div>
      </div>

      <div className="container py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4 underline decoration-primary decoration-4 underline-offset-8">Overview</h2>
            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">{dest.description}</p>
          </div>
          {dest.highlights?.length > 0 && (
            <div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4 underline decoration-primary decoration-4 underline-offset-8">Highlights</h2>
              <ul className="space-y-3">
                {dest.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 font-medium"><span className="text-primary font-black">✦</span> {h}</li>
                ))}
              </ul>
            </div>
          )}
          {dest.gallery?.length > 0 && (
            <div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-6 underline decoration-primary decoration-4 underline-offset-8">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {dest.gallery.map((img, i) => (
                  <img key={i} src={img} alt={`${dest.name} gallery ${i + 1}`} loading="lazy" decoding="async" className="w-full h-48 object-cover rounded-3xl transition-transform duration-500 hover:scale-105 hover:shadow-glow-primary cursor-zoom-in" />
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-8">
          <div className="bg-background text-white p-8 rounded-[32px] shadow-xl card-lift hover:shadow-glow-gold transition-shadow duration-300 border border-white/10">
            <h3 className="font-black uppercase tracking-tight text-secondary mb-2">Best Time to Visit</h3>
            <p className="text-gray-300 font-medium leading-relaxed">{dest.bestTimeToVisit}</p>
          </div>
          {dest.wildlifeCalendar?.length > 0 && (
            <div className="glass-light p-8 rounded-[32px] card-lift hover:shadow-glow-primary transition-shadow duration-300">
              <h3 className="font-black uppercase tracking-tight text-gray-900 mb-6">Wildlife Calendar</h3>
              <div className="space-y-4">
                {dest.wildlifeCalendar.map((c, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black uppercase shrink-0">{c.month}</span>
                    <p className="text-sm text-gray-600 font-medium">{c.event}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tours.length > 0 && (
            <div className="glass-light p-8 rounded-[32px] card-lift hover:shadow-glow-primary transition-shadow duration-300">
              <h3 className="font-black uppercase tracking-tight text-gray-900 mb-6">Tours Here</h3>
              <div className="space-y-4">
                {tours.map((t) => (
                  <Link key={t._id} to={`/packages/${t.title}`} state={t} className="block group">
                    <div className="flex items-center gap-3 p-3 bg-white/60 rounded-2xl hover:bg-primary/10 transition">
                      <img src={t.image} alt={t.title} loading="lazy" className="w-14 h-14 rounded-xl object-cover" />
                      <div>
                        <p className="text-xs font-black uppercase text-gray-900 group-hover:text-primary">{t.title}</p>
                        <p className="text-[10px] font-bold text-gray-400">From ${t.price}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default DestinationDetail;
