import React from "react";
import FooterLogo from "../../assets/logo.jpg";
import {
  FaInstagram,
  FaTripadvisor,
  FaLinkedin,
  FaEnvelope,
  FaMobileAlt,
} from "react-icons/fa";
import NatureVid from "../../assets/video/main.mp4";
import { Link } from "react-router-dom";

const FooterLinks = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "About",
    link: "/about",
  },
  {
    title: "Best Places",
    link: "/best-places",
  },
  {
    title: "Blogs",
    link: "/blogs",
  },
];

const Footer = () => {
  return (
    <>
      <div className=" dark:bg-brown-950 py-10 relative overflow-hidden">
        <video
          autoPlay
          loop
          muted
          className="absolute right-0 top-0 h-full overflow-hidden w-full object-cover z-[-1]"
        >
            <source src={NatureVid} type="video/mp4" />
            </video>
        <div className="container">
          <div className="grid md:grid-cols-3 py-5 bg-white/80 backdrop-blur-sm rounded-t-xl">
            <div className="py-8 px-4">
              <h1 className="flex items-center gap-3 text-xl sm:text-3xl font-bold text-justify sm:text-left">
                <img src={FooterLogo} alt="" className="h-16 rounded-full" />
                {/* TravelloGo */}
              </h1>
              <p className="text-sm">
              At  Makolo Adventure Tours, we craft unforgettable travel experiences with a focus on stunning destinations and exceptional service. Join us to explore the world's most breathtaking landscapes and make lasting memories.
              </p>
              <br />
              <div className="flex items-center gap-3">
  <FaEnvelope className="text-2xl" />
  <a 
    href="mailto:makoloadventuresafaris@gmail.com" 
    className="text-blue-600 hover:text-blue-800 transition-colors duration-300 hover:text-red-700 transition-colors duration-500"
  >
    makoloadventuresafaris@gmail.com
  </a>
</div>

              <div className="flex items-center gap-3 mt-3">
  <FaMobileAlt className="text-2xl" />
  <a 
    href="tel:+255710887798" 
    className="text-blue-600 hover:text-blue-800 transition-colors duration-300 hover:text-red-700 transition-colors duration-500"
  >
    +255 710887798
  </a>
</div>

              {/* social handles */}
              <div>
              <div className="flex items-center gap-3 mt-6">
  <a 
    href="https://www.instagram.com/makoloafrika?igsh=aXV3NXF5OTN1Z3oz//https://www.tripadvisor.co.uk/Profile/makolosafari" 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-red-600 hover:text-gray-800 transition-colors duration-300"
  >
    <FaInstagram className="text-3xl" />
  </a>

  <a 
    href="https://www.linkedin.com/in/makoloadventure-safaris-666a13322?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
    target="_blank" 
    rel="noopener noreferrer"
    className="text-red-600 hover:text-gray-800 transition-colors duration-300"
  >
    <FaLinkedin className="text-3xl" />
  </a>
  
  <a 
  href="https://www.tripadvisor.co.uk/Profile/makolosafari" 
  target="_blank" 
  rel="noopener noreferrer"
  className="text-red-600 hover:text-gray-800 transition-colors duration-300"
>
  <FaTripadvisor className="text-3xl" />
</a>
</div>

              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 col-span-2 md:pl-10">
              <div>
                <div className="py-8 px-4">
                  <h1 className="text-xl font-bold text-justify sm:text-left mb-3">
                    Important Links
                  </h1>
                  <ul className="flex flex-col gap-3">
                    {FooterLinks.map((link) => (
                      <li className="cursor-pointer hover:translate-x-1 duration-300 hover:!text-primary space-x-1 text-gray-700 dark:text-gray-200">
                        <Link
                          to={link.link}
                          onClick={() => window.scrollTo(0, 0)}
                        >
                          <span>&#11162;</span>
                          <span>{link.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <div className="py-8 px-4">
                  <h1 className="text-xl font-bold text-justify sm:text-left mb-3">
                    Important Links
                  </h1>
                  <ul className="flex flex-col gap-3">
                    {FooterLinks.map((link) => (
                      <li className="cursor-pointer hover:translate-x-1 duration-300 hover:!text-primary space-x-1 text-gray-700 dark:text-gray-200">
                        <Link
                          to={link.link}
                          onClick={() => window.scrollTo(0, 0)}
                        >
                          <span>&#11162;</span>
                          <span>{link.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <div className="py-8 px-4">
                  <h1 className="text-xl font-bold text-justify sm:text-left mb-3">
                    Important Links
                  </h1>
                  <ul className="flex flex-col gap-3">
                    {FooterLinks.map((link) => (
                      <li className="cursor-pointer hover:translate-x-1 duration-300 hover:!text-primary space-x-1 text-gray-700 dark:text-gray-200">
                        <Link
                          to={link.link}
                          onClick={() => window.scrollTo(0, 0)}
                        >
                          <span>&#11162;</span>
                          <span>{link.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-center py-5 border-t-2 border-blue-300/50 bg-primary text-white">
              @copyright 2024 All rights reserved || Made with ❤️ by haizard misape | +255 693671032
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
