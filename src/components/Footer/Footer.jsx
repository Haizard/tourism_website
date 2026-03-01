import React from "react";
import FooterLogo from "../../assets/logo.jpg";
import {
  FaInstagram,
  FaTripadvisor,
  FaLinkedin,
  FaEnvelope,
  FaMobileAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const FooterLinks = [
  { title: "Home", link: "/" },
  { title: "About", link: "/about" },
  { title: "Best Places", link: "/best-places" },
  { title: "Packages", link: "/packages" },
  { title: "Blogs", link: "/blogs" },
];

const Footer = () => {
  return (
    <footer className="bg-background text-white">
      <div className="container py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img
                src={FooterLogo}
                alt="Makolo Logo"
                className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/30"
              />
              <div>
                <p className="font-black text-xl font-heading uppercase tracking-tight">
                  Makolo
                </p>
                <p className="text-primary text-xs font-black uppercase tracking-widest">
                  Adventure Tours
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              We craft unforgettable travel experiences with a focus on stunning
              destinations and exceptional service. Explore the world's most
              breathtaking landscapes with us.
            </p>
            <div className="space-y-3">
              <a
                href="mailto:makoloadventuresafaris@gmail.com"
                className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors text-sm font-bold"
              >
                <FaEnvelope className="text-primary" />
                makoloadventuresafaris@gmail.com
              </a>
              <a
                href="tel:+255710887798"
                className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors text-sm font-bold"
              >
                <FaMobileAlt className="text-primary" />
                +255 710 887 798
              </a>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://www.instagram.com/makoloafrika"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/40 transition-all"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.linkedin.com/in/makoloadventure-safaris-666a13322"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/40 transition-all"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://www.tripadvisor.co.uk/Profile/makolosafari"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/40 transition-all"
              >
                <FaTripadvisor />
              </a>
            </div>
          </div>

          {/* Links Column */}
          <div className="space-y-6">
            <h3 className="font-black uppercase tracking-widest text-xs text-gray-500">
              Navigate
            </h3>
            <ul className="space-y-4">
              {FooterLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    to={link.link}
                    onClick={() => window.scrollTo(0, 0)}
                    className="text-gray-400 hover:text-primary transition-colors font-bold text-sm flex items-center gap-2 group"
                  >
                    <span className="w-4 h-px bg-gray-600 group-hover:w-6 group-hover:bg-primary transition-all" />
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Column */}
          <div className="space-y-6">
            <h3 className="font-black uppercase tracking-widest text-xs text-gray-500">
              Plan Your Adventure
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              Ready to experience the wild? Let us craft the perfect Tanzanian
              safari for you.
            </p>
            <Link
              to="/tailor-made"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-block bg-gradient-to-r from-primary to-[#00aeaf] text-white font-black px-8 py-4 rounded-full uppercase tracking-widest text-xs hover:opacity-90 transition shadow-xl shadow-primary/20"
            >
              Start Planning →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs font-bold">
            © 2024 Makolo Adventure Tours. All rights reserved.
          </p>
          <Link
            to="/login"
            className="opacity-10 hover:opacity-40 transition-opacity"
          >
            <FaShieldAlt size={12} className="text-gray-400" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
