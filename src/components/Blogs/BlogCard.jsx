import React from "react";
import { Link } from "react-router-dom";
import Card from "../UI/Card";
import Badge from "../UI/Badge";

const BlogCard = ({ image, date, title, content, author, category }) => {
  return (
    <Link
      to={`/blogs/${title}`}
      onClick={() => window.scrollTo(0, 0)}
      state={{ image, date, title, content, author, category }}
      className="group block"
    >
      <Card className="flex flex-col h-full border-none shadow-lg hover:shadow-2xl overflow-hidden group">
        <div className="relative h-64 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="backdrop-blur-md bg-secondary/80 text-white border-none">
              {category}
            </Badge>
          </div>
        </div>
        <div className="p-8 flex-1 flex flex-col">
          <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
            <span>{new Date(date).toLocaleDateString()}</span>
            <span className="w-1 h-1 bg-primary rounded-full" />
            <span>By {author}</span>
          </div>
          <h3 className="text-xl font-black text-gray-900 group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-tight font-heading leading-tight mb-4">
            {title}
          </h3>
          <div className="mt-auto pt-6 border-t border-gray-50 flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest group-hover:gap-4 transition-all">
            Read Full Story <span>→</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default BlogCard;
