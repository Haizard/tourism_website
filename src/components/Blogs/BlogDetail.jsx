import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BlogDetail = () => {
    const location = useLocation();
    const { image, date, title, content, author, category } = location.state || {};

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!location.state) return <div className="text-center py-20">No blog data found</div>;

    return (
        <div className="pb-20 pt-24 px-4 lg:px-24 bg-white min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="mb-10 text-center">
                    <span className="bg-secondary/10 text-secondary px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block">{category}</span>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter mb-6 leading-tight">{title}</h1>
                    <div className="flex items-center justify-center gap-4 text-gray-400 font-bold uppercase text-xs tracking-widest">
                        <span>{date}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>By {author}</span>
                    </div>
                </div>

                <div className="rounded-[40px] overflow-hidden shadow-2xl mb-16 h-[500px]">
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                </div>

                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line italic font-medium text-lg">
                    {content}
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
