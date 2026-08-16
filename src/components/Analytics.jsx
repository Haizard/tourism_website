import { useEffect } from "react";

const Analytics = () => {
  useEffect(() => {
    const gaId = import.meta.env.VITE_GA_ID;
    if (!gaId) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", gaId);
  }, []);
  return null;
};

export default Analytics;
