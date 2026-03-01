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
      className="group block h-full"
    >
      <Card className="relative flex flex-col h-full border-none shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-500 rounded-[40px] bg-white group">
        <div className="relative h-48 md:h-72 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="absolute top-6 left-6">
            <Badge
              variant="secondary"
              className="backdrop-blur-md bg-white/20 text-white border-white/20 px-4 py-1.5 text-[10px] uppercase font-black tracking-widest"
            >
              {category}
            </Badge>
          </div>

          <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
            <span className="text-white font-black text-[10px] uppercase tracking-[0.3em]">
              Read Story
            </span>
          </div>
        </div>

        <div className="p-4 md:p-10 flex-1 flex flex-col relative bg-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
              {author?.[0] || 'A'}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none mb-1">
                {author}
              </span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>

          <h3 className="text-sm md:text-2xl font-black text-gray-900 group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-tighter font-heading leading-tight mb-2 md:mb-6">
            {title}
          </h3>

          <p className="hidden md:line-clamp-3 text-gray-500 text-sm font-medium leading-relaxed mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
            {content?.replace(/[#*]/g, '').slice(0, 150)}...
          </p>

          <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-[0.2em]">
              Explore <span>→</span>
            </div>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-100 group-hover:bg-primary transition-colors delay-75" />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-100 group-hover:bg-primary transition-colors delay-100" />
              <div className="w-1.5 h-1.5 rounded-full bg-gray-100 group-hover:bg-primary transition-colors delay-150" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default BlogCard;
