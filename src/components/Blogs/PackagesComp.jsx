import React from "react";
import PackageCard from "./PackageCard";
import { fetchTours } from "../../services/api";
import { useSearchParams } from "react-router-dom";

const PackagesComp = () => {
    const [toursData, setToursData] = React.useState([]);
    const [searchParams] = useSearchParams();
    const search = searchParams.get("search") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const type = searchParams.get("type") || "";

    React.useEffect(() => {
        const getTours = async () => {
            try {
                let query = `?search=${search}&maxPrice=${maxPrice}`;
                if (type) query += `&type=${type}`;
                const response = await fetchTours(query);
                setToursData(response.data);
            } catch (error) {
                console.error("Error fetching tours:", error);
            }
        };
        getTours();
    }, [search, maxPrice, type]);

    return (
        <div className="bg-gray-50 py-10">
            <section data-aos="fade-up" className="container">
                <h1 className="my-8 border-l-8 border-primary py-2 pl-2 text-3xl font-black uppercase tracking-tighter">
                    {type ? `${type} Adventures` : "Discover Our Packages"}
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {toursData.length > 0 ? (
                        toursData.map((item) => (
                            <PackageCard key={item._id} {...item} />
                        ))
                    ) : (
                        <p className="text-center col-span-full py-20 text-gray-400 font-bold italic">No packages found for your search.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default PackagesComp;
