import React from "react";
import BlogsComp from "../components/Blogs/BlogsComp";
import Badge from "../components/UI/Badge";

const Blogs = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Cinematic Header */}
      <div className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1528543606781-2f6e6857f318?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="container relative z-20 text-center text-white">
          <Badge variant="primary" className="mb-4">
            Stories & Insights
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter font-heading">
            Our Travel <span className="text-primary italic">Stories</span>
          </h1>
        </div>
      </div>
      <BlogsComp />
    </div>
  );
};

export default Blogs;
