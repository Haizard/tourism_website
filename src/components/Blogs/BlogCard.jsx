import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ image, date, title, content, author, category }) => {
  return (
    <Link
      to={`/blogs/${title}`}
      onClick={() => window.scrollTo(0, 0)}
      state={{ image, date, title, content, author, category }}
      className="group"
    >
      <div className="bg-white rounded-2xl overflow-hidden group-hover:shadow-xl transition-all duration-300">
        <div className="relative h-56 overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute top-4 left-4 underline-offset-4 decoration-primary decoration-4 underline font-black text-white uppercase text-xs">
            {category}
          </div>
        </div>
        <div className="py-6">
          <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            <span>{date}</span>
            <span>By {author}</span>
          </div>
          <h3 className="text-xl font-black text-gray-900 group-hover:text-secondary transition-colors line-clamp-2 uppercase tracking-tight">{title}</h3>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
