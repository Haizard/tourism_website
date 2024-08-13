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
      className="block"
    >
      <div className="p-4 shadow-lg transition-all duration-500 hover:shadow-xl dark:bg-slate-950 dark:text-white bg-white rounded-lg">
        <div className="overflow-hidden rounded-lg">
          <img
            src={image}
            alt={title}
            className="mx-auto h-[250px] w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
        <div className="flex justify-between pt-2 text-slate-600">
          <p className="text-red-500 text-sm">{date}</p>
          <p className="line-clamp-1 text-green-500 text-sm">By {author}</p>
        </div>
        <div className="space-y-2 py-3">
          <h1 className="line-clamp-1 font-bold text-green-600 text-lg">{title}</h1>
          <p className="line-clamp-2 text-gray-700 text-sm">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
