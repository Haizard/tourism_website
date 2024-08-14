import React from "react";
import BlogCard from "./BlogCard";
import Img1 from "../../assets/places/beastmigration1.jpg";
import Img2 from "../../assets/places/camp2.jpg";
import Img3 from "../../assets/places/Magical of Tanzania Adventure Camping Safari - 4 days.jpg";
import Img4 from "../../assets/places/Ngorongoro.jpg";
import Img5 from "../../assets/places/Great migration Wildebeests and zebras.jpg";
import Img6 from "../../assets/places/Serengeti2.jpg";
import img7 from "../../assets/places/Kilimanjaro.jpg";
import img8 from "../../assets/places/Maasai Cultural Experience _ Best Kenya Safari Experiences _ Art Of Safari.jpg";
import Img9 from "../../assets/places/camp2.jpg";
import OrderPopup from "../OrderPopup/OrderPopup";

const BlogsData = [
  {
    id: 1,
    image: Img1,
    title: "4 DAYS TZ MID RANGE SAFARI",
    description:
      "🌟 Experience the magic of Tanzania with our 4-day Mid-Range Safari! 🦁 Explore the lush Ngorongoro Crater, a UNESCO World Heritage Site, known for its breathtaking landscapes and diverse wildlife. Over these four days, you'll witness the majestic beauty of one of Africa’s most iconic safari destinations. Perfect for those seeking a blend of adventure and relaxation in a pristine natural setting.                                       \n\n**Inclusions:**\n- Park entry fees.\n- Transportation during the tour.\n- Guided tour.\n- Lunch at the park.\n\n**Exclusions:**\n- International flights.\n- Travel insurance.\n- Optional activities and personal expenses.",
    author: "Haitham Misape",
    date: "$1659 $ per 1 - $16496$ per 10",
    itinerary: [
      {
        day: 1,
        events: [
          "🚗 **Journey from Arusha to Tarangire National Park** - Kick off your safari adventure with a scenic drive.",
          "🌙 **Overnight stay at Karibu Camps** - elephant spring by karibu camps."
        ]
      },
      {
        day: 2,
        events: [
          "🌅 **Morning game drive in Tarangire** - Spot elephants, lions, and more in their natural habitat.",
          "🍴 **Lunch at the camp** - Relish a delicious meal amidst nature.",
          "🌞 **Afternoon game drive** - Continue your exploration and discover more wildlife."
        ]
      },
      {
        day: 3,
        events: [
          "🌍 **Full day game drive in Tarangire** - A full day to explore the park’s wonders.",
          "🥪 **Lunch at a picnic spot** - Enjoy lunch in a picturesque setting.",
          "🛌 **Evening relaxation at the lodge** - Unwind and reflect on the day's adventures."
        ]
      },
      {
        day: 4,
        events: [
          "🚗 **Travel to Ngorongoro Crater** - Journey to one of the world’s most remarkable natural landmarks.",
          "🌌 **Evening game drive in Ngorongoro** - Experience a stunning safari in the crater’s unique landscape."
        ]
      }
    ]
  },

  
  
  {
    id: 4,
    image: Img2,
    title: "4 DAYS CAMPING SAFARI (North CIRCUIT)",
    description:
      "🏕️ Embrace the rugged beauty of Tanzania’s northern circuit with our 4-day camping safari! 🌍 Traverse through iconic parks like Serengeti and Ngorongoro, and enjoy the adventure of camping under the stars. This tour offers an immersive experience in Tanzania’s diverse wildlife and stunning landscapes.                    \n\n**Inclusions:**\n- Park entry fees.\n- Transportation during the tour.\n- Guided tour.\n- Lunch at the park.\n\n**Exclusions:**\n- International flights.\n- Travel insurance.\n- Optional activities and personal expenses.",

    author: "Haitham Misape",
    date: "$1369 $ per person",
    itinerary: [
     
      {
        day: 1,
        events: [
          "🚗 **Depart from Arusha to Tarangire National Park** - Begin your safari with a drive to Tarangire.",
          "🏕️ **Overnight Karibu camping** - (elephant spring)by karibu camps."
        ]
      },
      {
        day: 2,
        events: [
          "🚙 **Travel to Serengeti National Park** - Continue your journey to Serengeti.",
          "🏕️ **Overnight camping** - Experience the serenity of the Serengeti campsite."
        ]
      },
      {
        day: 3,
        events: [
          "🌄 **Full day game drive in Serengeti** - Explore the park’s diverse wildlife.",
          "🏕️ **Return to camp** - Enjoy another night camping under the stars."
        ]
      },
      {
        day: 4,
        events: [
          "🚗 **Travel to Ngorongoro Crater** - Head to Ngorongoro for more wildlife encounters.",
          "🏕️ **Overnight camping** - Camp at Manyara Jua Kali Camp and enjoy the natural surroundings."
        ]
      }
    ]
  },

  {
    id: 5,
    image: Img3,
    title: "ARUSHA N.P DAY TOUR",
    description:
      "🌳 Discover the highlights of Arusha National Park with our engaging day tour! 🦒 Explore diverse landscapes, from lush rainforests to savannahs, and experience the park’s rich wildlife and cultural heritage. Ideal for a quick yet immersive safari experience in Tanzania’s vibrant Arusha region.                           \n\n**Inclusions:**\n- Park entry fees.\n- Transportation during the tour.\n- Guided tour.\n- Lunch at the park.\n\n**Exclusions:**\n- International flights.\n- Travel insurance.\n- Optional activities and personal expenses.",
    author: "Haitham Misape",
    date: "$299 $ per 1 - $2896 $ per pax",
    itinerary: [
      {
        day: 1,
        events: [
          "🚗 **Pickup and transfer to Arusha National Park** - Begin your exploration of this unique park.",
          "🍴 **Lunch at the park** - Enjoy a meal in the midst of nature.",
          "🏕️ **Overnight stay** - Camp in a scenic location and soak in the natural beauty."
        ]
      }
    ]
  },

  {
    id: 6,
    image: Img4,
    title: "NGORONGORO CONSERVATION AREA AUTHORITY",
    description:
      "🌋 Explore the Ngorongoro Crater, a UNESCO World Heritage Site, with our 2-day tour! 🐘 This experience includes a visit to the world’s largest inactive volcanic caldera, offering incredible wildlife viewing and stunning scenery. Ideal for a quick yet immersive safari experience in one of Tanzania’s most remarkable locations.                           \n\n**Inclusions:**\n- Park entry fees.\n- Transportation during the tour.\n- Guided tour.\n- Lunch at the park.\n\n**Exclusions:**\n- International flights.\n- Travel insurance.\n- Optional activities and personal expenses.",
    author: "Haitham Misape",
    date: "$1169 $ per person",
    itinerary: [
      {
        day: 1,
        events: [
          "🚗 **Travel from Arusha to Ngorongoro Crater** - Journey to the heart of the crater.",
          "🏨 **Check-in at Marera Valley Lodge** - Enjoy a comfortable stay with scenic views.",
          "🌌 **Evening at leisure** - Relax and prepare for the exciting day ahead."
        ]
      },
      {
        day: 2,
        events: [
          "🌅 **Morning game drive in Ngorongoro Crater** - Witness diverse wildlife in this spectacular setting.",
          "🚗 **Return to Arusha** - Travel back for departure or further plans."
        ]
      }
    ]
  },

  {
    id: 3,
    image: Img5,
    title: "5 DAYS SAFARI",
    description:
      "🌟 Embark on a thrilling 5-day safari across Tanzania's most stunning landscapes! 🐘 From the expansive Serengeti to the dramatic Ngorongoro Crater, this tour offers unforgettable wildlife encounters and scenic beauty. Perfect for nature lovers and adventure seekers looking to explore Tanzania’s diverse ecosystems in depth.                                                       \n\n**Inclusions:**\n- Park entry fees.\n- Transportation during the tour.\n- Guided tour.\n- Lunch at the park.\n\n**Exclusions:**\n- International flights.\n- Travel insurance.\n- Optional activities and personal expenses.",
    author: "Haitham Misape",
    date: "$1799 $ per 1 - $17896 $ per pax",
    itinerary: [
      {
        day: 1,
        events: [
          "🚗 **Depart from Arusha to Tarangire National Park** - Begin your adventure with a scenic drive.",
          "🏕️ **Overnight stay at Planet Lodge** - Enjoy a comfortable stay amidst nature."
        ]
      },
      {
        day: 2,
        events: [
          "🚙 **Travel to Serengeti** - Head towards the famous Serengeti plains.",
          "🏕️ **Check-in at Karibu Camp** - Settle in and prepare for the day's safari.",
          "🌅 **Evening game drive** - Explore the Serengeti’s wildlife at dusk."
        ]
      },
      {
        day: 3,
        events: [
          "🌄 **Full day game drive in Serengeti** - Discover the rich wildlife and landscapes.",
          "🏕️ **Return to Karibu Camp** - Relax and enjoy another night in the Serengeti."
        ]
      },
      {
        day: 4,
        events: [
          "🚗 **Travel to Ngorongoro Crater** - Journey to the majestic Ngorongoro.",
          "🏨 **Check-in at Planet Lodge** - Enjoy your stay with stunning crater views."
        ]
      },
      {
        day: 5,
        events: [
          "🌅 **Morning game drive in Ngorongoro Crater** - Experience the crater’s unique wildlife and scenery.",
          "🚗 **Return to Arusha** - Travel back for your departure or further exploration."
        ]
      }
    ]
  },


{
  id: 2,
  image: Img6,
  title: "SERENGETI MARA WILDEBEEST MIGRATION",
  description:
    "🌍 Dive into the world-famous Serengeti-Mara Wildebeest Migration with our 6-day safari! 🐾 Witness the incredible movement of millions of wildebeest across the Serengeti and Mara regions. This tour offers an unparalleled opportunity to experience one of nature’s greatest spectacles. From vast savannahs to thrilling game drives, every moment is designed to captivate and inspire.                                                        \n\n**Inclusions:**\n- Park entry fees.\n- Transportation during the tour.\n- Guided tour.\n- Lunch at the park.\n\n**Exclusions:**\n- International flights.\n- Travel insurance.\n- Optional activities and personal expenses.",
  author: "Haitham Misape",
  date: "$2199 $ per 1 - $1999 $ per 9",
  itinerary: [
    {
      day: 1,
      events: [
        "✈️ **Arrival at JRO Airport** - Meet your guide and transfer to Hotel Planet.",
        "🏨 **Check-in and overnight stay** - Relax and prepare for the adventure ahead."
      ]
    },
    {
      day: 2,
      events: [
        "🚙 **Transfer to Tarangire National Park** - Embark on your safari journey.",
        "🏕️ **Check-in at Elephant Spring Camp** - Settle into your tented camp in Tarangire."
      ]
    },
    {
      day: 3,
      events: [
        "🌄 **Travel to Serengeti Center** - Continue your safari through Tanzania’s iconic Serengeti.",
        "🏕️ **Check-in at Karibuni Camp** - Enjoy a comfortable night in the heart of Serengeti."
      ]
    },
    {
      day: 4,
      events: [
        "🌿 **Explore Serengeti Center** - Discover diverse wildlife and breathtaking landscapes.",
        "🚗 **Travel to Northern Serengeti** - Move towards the dramatic northern region."
      ]
    },
    {
      day: 5,
      events: [
        "🌅 **Explore Northern Serengeti** - Witness the great migration and other wildlife.",
        "🏕️ **Check-in at Karibuni Camp** - Return to your camp for another night."
      ]
    },
    {
      day: 6,
      events: [
        "🚗 **Return to Ngorongoro Crater** - Travel back to the crater for a final exploration.",
        "🏨 **Check-in at Planet Lodge or similar** - Rest and prepare for departure."
      ]
    }
  ]
},

{
  id: 7,
  image: img7,
  title: "KILI TREKKINS",
  description:
    "🏔️ Experience the adventure of a lifetime with our Kili Trekkins tour! 🌍 Trekking Mount Kilimanjaro over 6 to 8 days, you will explore various climate zones and reach the summit of Africa's highest peak. Enjoy comfortable lodgings and stunning views along the way. \n\n**Inclusions:**\n- Park entry fees.\n- Transportation during the tour.\n- Guided tour.\n- Lunch at the park.\n\n**Exclusions:**\n- International flights.\n- Travel insurance.\n- Optional activities and personal expenses.",
  author: "Haitham Misape",
  date: "$2199 $ per person",
  itinerary: [
    {
      day: 1,
      events: [
        "✈️ **Arrival at Kilimanjaro International Airport** - Meet your guide and transfer to Planet Lodge for overnight accommodation.",
        "🏨 **Check-in at Planet Lodge** - Relax and prepare for your trek."
      ]
    },
    {
      day: 2,
      events: [
        "🚶 **Begin Trekking** - Start your hike through the lush rainforest and moorland.",
        "🏕️ **Camping** - Stay in tented camps or huts depending on the route."
      ]
    },
    {
      day: 3,
      events: [
        "🌄 **Continue Trekking** - Ascend through different climate zones, from alpine desert to high altitude.",
        "🏕️ **Camping** - Overnight stay in tented camps or huts."
      ]
    },
    {
      day: 4,
      events: [
        "🏔️ **Summit Attempt** - Begin your summit push early in the morning to reach the peak of Mount Kilimanjaro.",
        "🌌 **Descend** - Return to your camp for rest after the summit attempt."
      ]
    },
    {
      day: 5,
      events: [
        "🌄 **Continue Descent** - Trek back through the various climate zones.",
        "🏕️ **Camping** - Overnight stay in tented camps or huts."
      ]
    },
    {
      day: 6,
      events: [
        "🚶 **Complete Descent** - Finish your trek and return to the base.",
        "🚗 **Transfer to Kilimanjaro International Airport** - Depart or continue with further travel plans."
      ]
    }
  ]
},

{
  id: 8,
  image: img8,
  title: "MASAI TOUR VISIT",
  description:
    "🌍 Immerse yourself in the rich culture and traditions of the Maasai people with our Masai Tour Visit! 🏞️ This tour offers an authentic experience of the Maasai lifestyle, including visits to traditional villages and interactions with the local community. Explore the unique culture and natural beauty of Tanzania. \n\n**Inclusions:**\n- Park entry fees.\n- Transportation during the tour.\n- Guided tour.\n- Lunch at the park.\n\n**Exclusions:**\n- International flights.\n- Travel insurance.\n- Optional activities and personal expenses.",
  author: "Haitham Misape",
  date: "$899 $ per person",
  itinerary: [
    {
      day: 1,
      events: [
        "🚗 **Pickup from your accommodation** - Transfer to a Maasai village.",
        "🏡 **Village Visit** - Explore a traditional Maasai village, meet local elders, and learn about their customs and way of life.",
        "🍴 **Lunch with the Maasai** - Enjoy a traditional Maasai meal and experience their hospitality.",
        "🌄 **Cultural Activities** - Participate in traditional Maasai dances, crafts, and ceremonies."
      ]
    },
    {
      day: 2,
      events: [
        "🌅 **Morning Nature Walk** - Experience the natural beauty of the Maasai land with a guided nature walk.",
        "🏞️ **Visit to a Maasai Market** - Explore a local market and shop for Maasai crafts and souvenirs.",
        "🍴 **Lunch** - Enjoy a meal at a local restaurant or picnic in a scenic spot.",
        "🚗 **Return Transfer** - Travel back to your accommodation or continue with further travel plans."
      ]
    }
  ]
}
  
];


const BlogsComp = () => {
  return (
    <>
      <div className="dark:bg-gray-900 dark:text-white py-10">
        <section data-aos="fade-up" className="container">
          <h1 className="my-8 border-l-8 border-primary/50 py-2 pl-2 text-3xl font-bold">
            Our Latest Packages
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {BlogsData.map((item) => (
              <BlogCard key={item.id} {...item} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogsComp;
