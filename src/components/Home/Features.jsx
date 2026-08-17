import { Shield, Map, Compass, Users } from "lucide-react";
import Card from "../UI/Card";

const features = [
  {
    icon: <Shield className="w-8 h-8 text-white" />,
    title: "Safe & Secure",
    desc: "Your safety is our priority with certified guides and premium equipment.",
    chip: "bg-gradient-to-br from-primary to-[#0e7490] shadow-glow-primary",
  },
  {
    icon: <Map className="w-8 h-8 text-white" />,
    title: "Expert Guides",
    desc: "Local experts who know every hidden gem and secret trail.",
    chip: "bg-gradient-to-br from-secondary to-[#ca8a04] shadow-glow-gold",
  },
  {
    icon: <Compass className="w-8 h-8 text-white" />,
    title: "Customized Trips",
    desc: "Tailor-made itineraries designed specifically for your interests.",
    chip: "bg-gradient-to-br from-accent to-[#c2410c] shadow-glow-accent",
  },
  {
    icon: <Users className="w-8 h-8 text-white" />,
    title: "Small Groups",
    desc: "Intimate travel experiences with a focus on personal connection.",
    chip: "bg-gradient-to-br from-primary to-[#0e7490] shadow-glow-primary",
  },
];

const Features = () => {
  return (
    <div className="py-24 section-wash-light">
      <div className="container">
        <div className="text-center mb-16">
          <p className="text-primary font-bold uppercase tracking-widest mb-3 text-sm">
            Why Choose Us
          </p>
          <h2 className="text-4xl md:text-5xl font-black font-heading text-slate-900">
            The Makolo Difference
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <Card
              key={i}
              delay={i * 0.1}
              variant="light"
              glow="primary"
              className="p-8 text-center flex flex-col items-center border border-white/40"
            >
              <div className={`mb-6 p-5 rounded-2xl text-white ${f.chip}`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-black mb-3 text-slate-900 tracking-tight">
                {f.title}
              </h3>
              <p className="text-slate-600 font-medium leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
