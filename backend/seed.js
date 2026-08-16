import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TourPackage from './models/TourPackage.js';
import Destination from './models/Destination.js';
import Blog from './models/Blog.js';
import Visionary from './models/Visionary.js';
import Taxonomy from './models/Taxonomy.js';
import Testimonial from './models/Testimonial.js';
import Gallery from './models/Gallery.js';

dotenv.config();

const tours = [
  { title: "Serengeti Big Five Safari", description: "Four days of game drives across the Serengeti in search of the Big Five, staying in luxury mobile camps.", price: 1850, image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1200&auto=format&fit=crop", location: "Serengeti", tourType: "Safari", category: "Luxury", duration: "4 Days", maxGroupSize: 6, childDiscountPercent: 50, itinerary: [{ day: 1, events: ["Arrive Arusha, transfer to Serengeti", "Afternoon game drive"] }, { day: 2, events: ["Full-day game drive — big cats", "Sundowner at camp"] }, { day: 3, events: ["Early morning balloon safari (optional)", "Game drive to Ngorongoro rim"] }, { day: 4, events: ["Ngorongoro crater descent", "Return to Arusha"] }], inclusions: ["Park fees", "4x4 Land Cruiser", "Professional guide", "Luxury tented camp", "All meals"], exclusions: ["Flights", "Visa", "Travel insurance", "Tips"], featured: true },
  { title: "Kilimanjaro Machame Trek", description: "Conquer Africa's highest peak on the scenic 7-day Machame route with expert mountain guides.", price: 2400, image: "https://images.unsplash.com/photo-1516357231954-91487b459002?q=80&w=1200&auto=format&fit=crop", location: "Kilimanjaro", tourType: "Trekking", category: "Adventure", duration: "7 Days", maxGroupSize: 12, childDiscountPercent: 0, itinerary: [{ day: 1, events: ["Machame Gate to Machame Camp"] }, { day: 2, events: ["Machame Camp to Shira Camp"] }, { day: 3, events: ["Shira to Barranco via Lava Tower"] }, { day: 4, events: ["Barranco to Barafu Camp"] }, { day: 5, events: ["Summit night: Uhuru Peak", "Descend to Mweka Camp"] }, { day: 6, events: ["Descend to Mweka Gate"] }], inclusions: ["Mountain guide", "Porter support", "Park fees", "Sleeping tents & mattresses", "All meals on the mountain"], exclusions: ["International flights", "Gear rental", "Summit bonus for guides", "Travel insurance"] },
  { title: "Zanzibar Beach Escape", description: "Five days of pristine beaches, spice tours, and Stone Town history on the Spice Islands.", price: 950, image: "https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?q=80&w=1200&auto=format&fit=crop", location: "Zanzibar", tourType: "Beach", category: "Relaxation", duration: "5 Days", maxGroupSize: 8, childDiscountPercent: 50, itinerary: [{ day: 1, events: ["Fly to Zanzibar, transfer to Nungwi"] }, { day: 2, events: ["Beach day at Nungwi"] }, { day: 3, events: ["Spice tour + Stone Town walking tour"] }, { day: 4, events: ["Snorkeling at Mnemba Atoll"] }, { day: 5, events: ["Departure"] }], inclusions: ["Lodge accommodation", "Boat transfer", "Spice tour guide", "Breakfast daily"], exclusions: ["Flights to Zanzibar", "Lunches & dinners", "Visas"] },
  { title: "Ngorongoro Crater Day Trip", description: "Descend into the world's largest intact volcanic caldera for a day of phenomenal wildlife density.", price: 450, image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1200&auto=format&fit=crop", location: "Ngorongoro", tourType: "Day Trip", category: "Budget", duration: "1 Day", maxGroupSize: 6, childDiscountPercent: 50, itinerary: [{ day: 1, events: ["Pickup Arusha", "Crater descent game drive", "Picnic lunch at Hippo Pool", "Return to Arusha"] }], inclusions: ["Crater fees", "4x4 with pop-up roof", "Lunch box", "Professional guide"], exclusions: ["Tips", "Extras"] },
  { title: "Tarangire Elephants & Baobabs", description: "A full-day exploration of Tarangire's massive elephant herds and ancient baobab forests.", price: 390, image: "https://images.unsplash.com/photo-1567958451986-2de427a4a0be?q=80&w=1200&auto=format&fit=crop", location: "Tarangire", tourType: "Safari", category: "Budget", duration: "1 Day", maxGroupSize: 6, childDiscountPercent: 50, itinerary: [{ day: 1, events: ["Pickup Arusha", "Tarangire game drive", "Lunch at Tarangire", "Return to Arusha"] }], inclusions: ["Park fees", "Transport", "Guide", "Lunch"], exclusions: ["Tips"] },
  { title: "Cultural Village Experience", description: "Meet the Maasai and Hadzabe communities and experience authentic Tanzanian culture.", price: 320, image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1200&auto=format&fit=crop", location: "Arusha", tourType: "Cultural", category: "Budget", duration: "1 Day", maxGroupSize: 10, childDiscountPercent: 50, itinerary: [{ day: 1, events: ["Visit Maasai boma", "Cultural performances", "Hadzabe hunting demonstration", "Return Arusha"] }], inclusions: ["Transport", "Village fees", "Local guide"], exclusions: ["Tips", "Lunch"] },
];

const destinations = [
  { name: "Serengeti National Park", slug: "serengeti", heroImage: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1920&auto=format&fit=crop", shortIntro: "The endless plains — home of the Great Migration.", description: "Serengeti National Park is Tanzania's most famous wildlife reserve, hosting the annual Great Migration of over 1.5 million wildebeest. The vast open savannah offers the best big-cat viewing in Africa, especially in the central Seronera region which is excellent year-round.", bestTimeToVisit: "June to October for the Great Migration river crossings; January to March for calving season in the southern plains.", wildlifeCalendar: [{ month: "Jan-Mar", event: "Calving season in Ndutu & southern Serengeti" }, { month: "Jun-Jul", event: "River crossings at Grumeti" }, { month: "Aug-Oct", event: "Grumeti & Mara river crossings" }, { month: "Nov-Dec", event: "Migration returns south" }], highlights: ["Great Migration", "Big Five sightings", "Hot air balloon safaris", "Night game drives in select areas"], gallery: [], location: "Serengeti" },
  { name: "Ngorongoro Crater", slug: "ngorongoro", heroImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1920&auto=format&fit=crop", shortIntro: "A natural wonder — the world's largest intact caldera.", description: "The Ngorongoro Crater is a UNESCO World Heritage Site and the world's largest intact volcanic caldera. Its unique geography creates an enclosed ecosystem with the highest density of wildlife in Africa, making the Big Five visible in a single day.", bestTimeToVisit: "Year-round. June to September for dry-season concentration of animals.", wildlifeCalendar: [{ month: "Year-round", event: "Big Five sightings daily" }, { month: "Jan-Feb", event: "Flamingo concentrations in Lake Magadi" }], highlights: ["Big Five in one day", "Maasai culture on the rim", "Lake Magadi flamingos"], gallery: [], location: "Ngorongoro" },
  { name: "Mount Kilimanjaro", slug: "kilimanjaro", heroImage: "https://images.unsplash.com/photo-1516357231954-91487b459002?q=80&w=1920&auto=format&fit=crop", shortIntro: "Africa's highest peak at 5,895m — the rooftop of the continent.", description: "Mount Kilimanjaro is the highest free-standing mountain in the world. Trekking its slopes crosses five distinct climate zones, from rainforest to alpine desert to arctic ice cap, ending at the legendary Uhuru Peak.", bestTimeToVisit: "January to March and June to October offer the clearest summit conditions.", wildlifeCalendar: [], highlights: ["Uhuru Peak summit (5,895m)", "Five climate zones", "Expert mountain guides"], gallery: [], location: "Kilimanjaro" },
  { name: "Zanzibar Archipelago", slug: "zanzibar", heroImage: "https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?q=80&w=1920&auto=format&fit=crop", shortIntro: "The Spice Islands — powder-white beaches and rich Swahili heritage.", description: "Zanzibar blends pristine Indian Ocean beaches with the UNESCO-listed Stone Town. Spice tours, turquoise waters, and the perfect post-safari relaxation escape.", bestTimeToVisit: "June to October and December to February for the best weather.", wildlifeCalendar: [{ month: "Jun-Sep", event: "Best diving & snorkeling visibility" }], highlights: ["Stone Town heritage", "Spice farm tours", "Mnemba Atoll snorkeling", "Dhow sunset cruises"], gallery: [], location: "Zanzibar" },
  { name: "Tarangire National Park", slug: "tarangire", heroImage: "https://images.unsplash.com/photo-1567958451986-2de427a4a0be?q=80&w=1920&auto=format&fit=crop", shortIntro: "Elephants, baobabs, and breathtaking dry-season concentration.", description: "Tarangire is famous for its massive elephant herds and iconic baobab trees. In the dry season, the Tarangire River attracts wildlife from across the park, making it a photographer's paradise.", bestTimeToVisit: "June to October, when wildlife concentrates along the river.", wildlifeCalendar: [{ month: "Jun-Oct", event: "Highest wildlife concentration" }], highlights: ["Large elephant herds", "Ancient baobab trees", "Birdwatching (500+ species)"], gallery: [], location: "Tarangire" },
];

const blogs = [
  { title: "The Ultimate Serengeti Safari Guide", content: "# The Ultimate Serengeti Safari Guide\n\nDiscover when to go, where to stay, and how to see the Great Migration. The Serengeti rewards the prepared traveler.\n\n#### Wildlife Encounters\nThe central Seronera region is a big-cat hotspot year-round. Book a full day, not a half day, for the best sighting odds.\n\n#### Pro Tip\nCarry a pair of 8x42 binoculars and a 70-200mm lens. [Book our Serengeti Safari](/packages/Serengeti-Big-Five-Safari) today!", image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1200&auto=format&fit=crop", author: "Makolo AI Expert", category: "Safari News" },
  { title: "Climbing Kilimanjaro: What You Need to Know", content: "# Climbing Kilimanjaro\n\nPole, pole! (Slowly, slowly). Acclimatization beats fitness on Kilimanjaro.\n\n#### Route Choice\nThe Machame route offers the best scenery-acclimatization balance. Budget at least 7 days.\n\n#### Expert Tip\nTrain with long, weighted hikes on stairs. The summit night is a mental battle as much as a physical one. Ready? [Explore the Machame Trek](/packages/Kilimanjaro-Machame-Trek).", image: "https://images.unsplash.com/photo-1516357231954-91487b459002?q=80&w=1200&auto=format&fit=crop", author: "Makolo AI Expert", category: "Trekking Tips" },
  { title: "Zanzibar: A Post-Safari Paradise", content: "# Zanzibar: A Post-Safari Paradise\n\nAfter the dust of the savannah, Zanzibar is pure reset.\n\n#### Where to Stay\nNungwi and Kendwa offer the finest beaches in the north; Stone Town is the cultural heartbeat.\n\n#### Don't Miss\nA spice tour followed by a sunset dhow cruise. Unwind after your safari — [view our Zanzibar package](/packages/Zanzibar-Beach-Escape).", image: "https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?q=80&w=1200&auto=format&fit=crop", author: "Makolo AI Expert", category: "Cultural Insights" },
];

const visionaries = [
  { name: "Juma Kileo", duty: "Head Guide & Founder", image: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Neema Mahenge", duty: "Adventure Coordinator", image: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "David Mushi", duty: "Operations Manager", image: "https://randomuser.me/api/portraits/men/75.jpg" },
];

const testimonials = [
  { name: "Sarah Thompson", role: "Wildlife Photographer", rating: 5, text: "The Serengeti safari was flawless. Our guide Juma knew exactly where the big cats would be. Best trip of my life.", verified: true },
  { name: "Daniel Okafor", role: "Adventure Traveler", rating: 5, text: "Summited Kilimanjaro thanks to an incredible team that paced us perfectly. Safety and care were world-class.", verified: true },
  { name: "Emma Lindqvist", role: "Honeymooner", rating: 5, text: "From the crater to the beaches of Zanzibar, every detail was handled. The tailor-made process was so easy.", verified: true },
  { name: "Marcus Chen", role: "Family Traveler", rating: 4, text: "Our kids (7 and 10) were looked after wonderfully. The child pricing made the whole trip very reasonable.", verified: true },
];

const galleries = [
  { img: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=800&auto=format&fit=crop", location: "Serengeti", caption: "Lioness at golden hour" },
  { img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800&auto=format&fit=crop", location: "Ngorongoro", caption: "Crater at dawn" },
  { img: "https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?q=80&w=800&auto=format&fit=crop", location: "Zanzibar", caption: "Nungwi beach" },
  { img: "https://images.unsplash.com/photo-1516357231954-91487b459002?q=80&w=800&auto=format&fit=crop", location: "Kilimanjaro", caption: "Kibo summit" },
];

const seed = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('MONGODB_URI not set'); process.exit(1); }
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const taxonomyTypes = [
      { type: 'tourCategory', name: 'Luxury' },
      { type: 'tourCategory', name: 'Adventure' },
      { type: 'tourCategory', name: 'Relaxation' },
      { type: 'tourCategory', name: 'Budget' },
      { type: 'tourType', name: 'Safari' },
      { type: 'tourType', name: 'Trekking' },
      { type: 'tourType', name: 'Beach' },
      { type: 'tourType', name: 'Cultural' },
      { type: 'tourType', name: 'Day Trip' },
      { type: 'blogCategory', name: 'Safari News' },
      { type: 'blogCategory', name: 'Trekking Tips' },
      { type: 'blogCategory', name: 'Cultural Insights' },
    ];
    for (const t of taxonomyTypes) {
      const slug = `${t.type}-${t.name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const exists = await Taxonomy.findOne({ slug });
      if (!exists) await Taxonomy.create(t);
    }

    for (const tour of tours) {
      const exists = await TourPackage.findOne({ title: tour.title });
      if (!exists) await TourPackage.create(tour);
    }
    for (const d of destinations) {
      const exists = await Destination.findOne({ slug: d.slug });
      if (!exists) await Destination.create(d);
    }
    for (const b of blogs) {
      const exists = await Blog.findOne({ title: b.title });
      if (!exists) await Blog.create(b);
    }
    for (const v of visionaries) {
      const exists = await Visionary.findOne({ name: v.name });
      if (!exists) await Visionary.create(v);
    }
    for (const t of testimonials) {
      const exists = await Testimonial.findOne({ name: t.name });
      if (!exists) await Testimonial.create(t);
    }
    for (const g of galleries) {
      const exists = await Gallery.findOne({ caption: g.caption });
      if (!exists) await Gallery.create(g);
    }

    console.log('Seed complete');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
