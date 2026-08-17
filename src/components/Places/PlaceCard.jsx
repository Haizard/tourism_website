import { IoLocationSharp } from "react-icons/io5";
import PropTypes from "prop-types";
import Card from "../UI/Card";
import Badge from "../UI/Badge";

const PlaceCard = ({ img, location, title }) => {
  return (
    <Card
      variant="image"
      glow="primary"
      className="h-[250px] md:h-[400px] group relative overflow-hidden rounded-[40px] cursor-pointer"
    >
      <img
        src={img}
        alt={location}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute top-4 left-4">
        <Badge
          variant="primary"
          className="bg-white/20 backdrop-blur-md text-white border-white/30"
        >
          Featured
        </Badge>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex items-center gap-2 text-primary mb-2">
          <IoLocationSharp className="text-lg" />
          <span className="text-xs font-black uppercase tracking-widest">
            {location}
          </span>
        </div>
        <h3 className="text-2xl font-black text-white leading-tight group-hover:text-primary transition-colors relative w-fit">
          {title || "Explore Destination"}
          <span className="absolute -bottom-1 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 origin-left bg-gradient-to-r from-primary to-secondary transition-transform duration-500" />
        </h3>
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
        <span className="inline-flex items-center justify-center gap-2 w-full bg-white/15 backdrop-blur-md border border-white/30 text-white font-black uppercase tracking-widest text-[10px] py-3 rounded-full">
          View Journey →
        </span>
      </div>
    </Card>
  );
};

PlaceCard.propTypes = {
  img: PropTypes.string,
  location: PropTypes.string,
  title: PropTypes.string,
};

export default PlaceCard;
