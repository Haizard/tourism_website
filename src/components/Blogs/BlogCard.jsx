import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ image, date, title, description, author, itinerary }) => {
  return (
    <Link
      to={`/blogs/${title}`}
      onClick={() => {
        window.scrollTo(0, 0);
      }}
      state={{ image, date, title, description, author, itinerary }} // Pass itinerary data
    >
      <div className="p-4 shadow-lg transition-all duration-500 hover:shadow-xl dark:bg-slate-950 dark:text-white">
        <div className="overflow-hidden">
          <img
            src={image}
            alt={title}
            className="mx-auto h-[250px] w-full object-cover transition duration-700 hover:skew-x-2 hover:scale-110"
          />
        </div>
        <div className="flex justify-between pt-2 text-slate-600">
          <p className="text-red">{date}</p>
          <p className="line-clamp-1 text-green">By {author}</p>
        </div>
        <div className="space-y-2 py-3">
          <h1 className="line-clamp-1 font-bold text-green">{title}</h1>
          <p className="line-clamp-2">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
