import React from "react";
import BlogCard from "./BlogCard";
import { fetchBlogs } from "../../services/api";

const BlogsComp = () => {
  const [blogsData, setBlogsData] = React.useState([]);

  React.useEffect(() => {
    const getBlogs = async () => {
      try {
        const response = await fetchBlogs();
        setBlogsData(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    getBlogs();
  }, []);

  return (
    <div className="bg-white py-12">
      <section data-aos="fade-up" className="container">
        <h1 className="my-8 border-l-8 border-secondary py-2 pl-4 text-4xl font-black uppercase tracking-tighter">
          Our Travel Stories
        </h1>
        <p className="text-gray-500 mb-10 max-w-2xl">Discover tips, stories, and cultural insights from our expert guides to help you plan your perfect Tanzanian adventure.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {blogsData.length > 0 ? (
            blogsData.map((item) => (
              <BlogCard key={item._id} {...item} />
            ))
          ) : (
            <p className="text-center col-span-full py-20 text-gray-400 font-bold italic">Our writers are busy creating stories. Check back soon!</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogsComp;
