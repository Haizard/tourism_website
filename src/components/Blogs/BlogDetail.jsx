import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { fetchBlogs, fetchTours } from "../../services/api";
import PackageCard from "./PackageCard";

const BlogDetail = () => {
  const location = useLocation();
  const { image, date, title, content, author, category } =
    location.state || {};
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [featuredTours, setFeaturedTours] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadSidebarData();
  }, [title]);

  const loadSidebarData = async () => {
    try {
      const blogsRes = await fetchBlogs();
      const toursRes = await fetchTours();

      setLatestBlogs(blogsRes.data.slice(0, 5));
      setFeaturedTours(toursRes.data.slice(0, 3));

      // Calculate category counts
      const counts = {};
      blogsRes.data.forEach((b) => {
        counts[b.category] = (counts[b.category] || 0) + 1;
      });
      setCategories(Object.entries(counts));
    } catch (error) {
      console.error("Sidebar data load fail:", error);
    }
  };

  if (!location.state)
    return <div className="text-center py-20">No blog data found</div>;

  const slugify = (text) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  return (
    <div className="pb-20 pt-24 bg-gray-50/30 min-h-screen">
      <div className="container mx-auto px-4 lg:px-12">
        {/* Header Section */}
        <div className="mb-12 text-center max-w-4xl mx-auto">
          <span className="bg-primary/10 text-primary px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block">
            {category}
          </span>
          <h1 className="text-4xl md:text-7xl font-black text-gray-900 uppercase tracking-tighter mb-6 leading-[0.9]">
            {title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
            <span>{new Date(date).toLocaleDateString()}</span>
            <span className="w-1.5 h-1.5 bg-primary/20 rounded-full"></span>
            <span>By {author}</span>
          </div>
        </div>

        {/* Main Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Blog Content */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl mb-12 border border-gray-100">
              <img
                src={image}
                alt={title}
                className="w-full h-[500px] object-cover"
              />
              <div className="p-8 md:p-12">
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h4: ({ node, ...props }) => (
                        <h4
                          className="text-2xl font-black text-gray-900 uppercase tracking-tight mt-10 mb-6 border-l-4 border-primary pl-4"
                          {...props}
                        />
                      ),
                      p: ({ node, ...props }) => (
                        <p
                          className="mb-8 leading-8 text-lg font-medium"
                          {...props}
                        />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong
                          className="font-black text-gray-900"
                          {...props}
                        />
                      ),
                      li: ({ node, ...props }) => (
                        <li
                          className="mb-3 list-disc list-outside ml-4 font-medium"
                          {...props}
                        />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="mb-8 space-y-2" {...props} />
                      ),
                      em: ({ node, ...props }) => (
                        <em
                          className="text-primary font-bold not-italic decoration-primary/20 underline underline-offset-4"
                          {...props}
                        />
                      ),
                      a: ({ node, ...props }) => (
                        <Link
                          to={props.href}
                          className="text-primary font-black hover:underline decoration-2"
                          {...props}
                        >
                          {props.children}
                        </Link>
                      ),
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sidebar */}
          <aside className="lg:col-span-4 space-y-10">
            {/* Categories */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-6 border-b pb-4">
                Categories
              </h3>
              <div className="space-y-4">
                {categories.map(([cat, count]) => (
                  <Link
                    key={cat}
                    to="/blogs"
                    className="flex justify-between items-center group"
                  >
                    <span className="font-bold text-gray-500 group-hover:text-primary transition-colors">
                      {cat}
                    </span>
                    <span className="bg-gray-100 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary px-3 py-1 rounded-full text-xs font-black transition-all">
                      {count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Articles */}
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-6 border-b pb-4">
                Read Next
              </h3>
              <div className="space-y-6">
                {latestBlogs
                  .filter((b) => b.title !== title)
                  .map((b) => (
                    <Link
                      key={b._id}
                      to={`/blogs/${slugify(b.title)}`}
                      state={b}
                      className="flex gap-4 group"
                    >
                      <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                        <img
                          src={b.image}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-gray-900 leading-tight group-hover:text-primary transition-colors line-clamp-2 uppercase">
                          {b.title}
                        </h4>
                        <span className="text-[10px] font-black text-gray-400 uppercase mt-2 block">
                          {b.category}
                        </span>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Footer Section: Featured Tours */}
        <div className="mt-24 border-t pt-16">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-primary font-black uppercase text-xs tracking-widest mb-2 block">
                Take Action
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter">
                Ready for an Adventure?
              </h2>
            </div>
            <Link
              to="/packages"
              className="mb-2 text-gray-400 font-bold hover:text-primary uppercase text-xs tracking-widest"
            >
              View All Packages →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTours.map((tour) => (
              <PackageCard key={tour._id} {...tour} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
