import React from "react";

const operators = [
  {
    id: 1,
    name: "Haitham Salehe Misape",
    duty: "Founder & CEO",
    image: "https://picsum.photos/100/100", // Replace with actual image URL
  },
  {
    id: 2,
    name: "Zainabu Suleimani Saidi",
    duty: "Head of Marketing",
    image: "https://picsum.photos/101/101", // Replace with actual image URL
  },
  {
    id: 3,
    name: "Samuel",
    duty: "Customer Support",
    image: "https://picsum.photos/102/102", // Replace with actual image URL
  },
];

const About = () => {
  return (
    <>
      <div className="container pt-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Column: About Us */}
          <div className="py-10">
            <h1 className="my-8 border-l-8 border-primary/50 py-2 pl-2 text-3xl font-bold">
              About Us
            </h1>
            <p>
            At Makolo Safari pineaple builders, we're dedicated to crafting unforgettable African adventures. Founded in [Year], our goal is to connect you with the continent's stunning landscapes, diverse wildlife, and rich cultures.<br></br><br></br>

Our Mission
<br></br>
We offer bespoke safari experiences and cultural tours that are tailored to your interests. From witnessing the Great Migration to exploring the Ngorongoro Crater, our expert team ensures every journey is exceptional.
<br></br><br></br>
Our Values
<br></br>
    Authenticity: Genuine experiences that immerse you in Africa’s beauty.
    Sustainability: Responsible travel practices that protect the environment.
    Personalization: Tailored trips designed to match your unique preferences.

Join us at [Your Company Name] and discover why we’re your gateway to the wonders of Africa
            </p>
          </div>

          {/* Right Column: Operators */}
          <div className="py-10">
            <h1 className="my-8 border-l-8 border-primary/50 py-2 pl-2 text-3xl font-bold">
              Meet Our Team
            </h1>
            <div className="space-y-6">
              {operators.map((operator) => (
                <div key={operator.id} className="flex items-center space-x-4">
                  <img
                    src={operator.image}
                    alt={operator.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-semibold">{operator.name}</h2>
                    <p className="text-gray-600">{operator.duty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Location Section */}
        <section data-aos="fade-up" className="my-10">
          <div className="container my-4">
            <h1 className="inline-block border-l-8 border-primary/50 py-2 pl-2 mb-4 text-xl font-bold sm:text-3xl">
             OUR LOCATION
            </h1>
            <div className="w-full rounded-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15932.024505825386!2d37.33322514384081!3d-3.348623974828584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1839d9b443856385%3A0x1584d50c63d8bccf!2sMoshi%2C%20Tanzania!5e0!3m2!1ssw!2sus!4v1722434954048!5m2!1ssw!2sus"
                width="100%" // Make the iframe full width
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
