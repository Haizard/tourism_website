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
    <div className="bg-slate-100 py-24">
      <section className="container">
        <div className="mb-16">
          <p className="text-primary font-bold uppercase tracking-widest text-sm mb-3">
            Travel Journal
          </p>
          <h2 className="text-4xl md:text-5xl font-black font-heading uppercase tracking-tighter text-slate-900">
            Recent Stories
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {blogsData.length > 0 ? (
            blogsData.map((item) => <BlogCard key={item._id} {...item} />)
          ) : (
            <p className="text-center col-span-full py-20 text-slate-500 font-bold italic font-heading text-xl">
              Our writers are busy crafting stories. Check back soon!
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogsComp;
