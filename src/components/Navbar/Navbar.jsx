import React, { useState } from "react";
import Logo from "../../assets/logo.jpg";
import { NavLink, Link } from "react-router-dom";
import { FaCaretDown } from "react-icons/fa";
import ResponsiveMenu from "./ResponsiveMenu";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";

export const NavbarLinks = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "About",
    link: "/about",
  },
  {
    name: "Blogs",
    link: "/blogs",
  },
  {
    name: "Packages",
    link: "/packages",
  },
  {
    name: "Best Places",
    link: "/best-places",
  },
  {
    name: "Tailor-Made",
    link: "/tailor-made",
  },
];

const DropdownLinks = [
  {
    name: "Safari Adventures",
    link: "/packages?type=Safari",
  },
  {
    name: "Mountain Trekking",
    link: "/packages?type=Trekking",
  },
  {
    name: "Beach Holidays",
    link: "/packages?type=Beach",
  },
  {
    name: "Cultural Tours",
    link: "/packages?type=Cultural",
  },
  {
    name: "Day Trips",
    link: "/packages?type=Day Trip",
  },
];

const Navbar = ({ handleOrderPopup }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      <nav
        className={`fixed top-0 right-0 w-full z-50 transition-all duration-500 ${isScrolled
            ? "bg-white/80 backdrop-blur-lg shadow-lg py-2"
            : "bg-transparent py-4"
          }`}
      >
        <div className="container">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link to={"/"} onClick={() => window.scrollTo(0, 0)}>
                <img
                  src={Logo}
                  alt="Logo"
                  className={`transition-all duration-500 ${isScrolled ? "h-12" : "h-16"
                    } rounded-full`}
                />
              </Link>
            </div>

            <div className="hidden md:block">
              <ul className={`flex items-center gap-8 font-bold transition-colors duration-500 ${isScrolled ? "text-gray-900" : "text-white"
                }`}>
                {NavbarLinks.map((link) => (
                  <li key={link.name} className="relative group overflow-hidden py-2">
                    <NavLink
                      to={link.link}
                      className={({ isActive }) =>
                        `transition-all duration-300 ${isActive ? "text-primary" : "hover:text-primary"
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-4">
              <button
                className="bg-primary text-white px-6 py-2 rounded-full font-bold cinematic-shadow transition-all duration-300 hover:scale-105 active:scale-95"
                onClick={handleOrderPopup}
              >
                Book Now
              </button>
              <div className="md:hidden block">
                <button
                  onClick={toggleMenu}
                  className={isScrolled ? "text-gray-900" : "text-white"}
                >
                  {showMenu ? <HiMenuAlt1 size={30} /> : <HiMenuAlt3 size={30} />}
                </button>
              </div>
            </div>
          </div>
        </div>
        <ResponsiveMenu setShowMenu={setShowMenu} showMenu={showMenu} />
      </nav>
    </>
  );
};

export default Navbar;
