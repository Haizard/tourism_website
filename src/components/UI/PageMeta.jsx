import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const defaultMeta = {
  title: "Makolo Adventure Tours — Tanzania Safaris & Adventures",
  description: "Premium Tanzanian safaris, Kilimanjaro trekking, and Zanzibar beaches. Licensed tour operator.",
};

const routeMeta = {
  "/": { title: "Makolo Adventure Tours — Tanzania Safaris & Adventures", description: defaultMeta.description },
  "/about": { title: "About Us | Makolo Adventure Tours", description: "Meet Makolo Adventure Tours, a licensed Tanzanian safari and trekking operator." },
  "/packages": { title: "Tour Packages | Makolo Adventure Tours", description: "Browse curated Tanzanian safari, trekking, and beach packages." },
  "/blogs": { title: "Travel Blog | Makolo Adventure Tours", description: "Expert travel guides, safari tips, and Tanzania destination insights." },
  "/best-places": { title: "Best Places | Makolo Adventure Tours", description: "Discover Tanzania's top destinations: Serengeti, Ngorongoro, Kilimanjaro, Zanzibar." },
  "/tailor-made": { title: "Tailor-Made Tours | Makolo Adventure Tours", description: "Design your own custom Tanzanian adventure." },
  "/faq": { title: "FAQ | Makolo Adventure Tours", description: "Answers to common questions about Tanzanian safaris." },
  "/privacy": { title: "Privacy Policy | Makolo Adventure Tours", description: "How we handle your personal data." },
  "/terms": { title: "Terms & Conditions | Makolo Adventure Tours", description: "Booking terms for Makolo Adventure Tours." },
  "/cancellation-policy": { title: "Cancellation Policy | Makolo Adventure Tours", description: "Cancellation and refund policy." },
};

const PageMeta = ({ title, description }) => {
  const location = useLocation();
  const meta = title && description
    ? { title, description }
    : routeMeta[location.pathname] || defaultMeta;

  useEffect(() => {
    document.title = meta.title;
    let el = document.querySelector('meta[name="description"]');
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("name", "description");
      document.head.appendChild(el);
    }
    el.setAttribute("content", meta.description);
  }, [meta.title, meta.description]);

  return null;
};

export default PageMeta;
