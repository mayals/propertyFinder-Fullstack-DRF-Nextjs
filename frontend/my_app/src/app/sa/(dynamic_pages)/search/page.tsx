"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";



export default function SearchPage() {
  const countrySlug = process.env.NEXT_PUBLIC_COUNTRY_SLUG;
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
 

  useEffect(() => {
    // Convert query params into URL string
    const queryString = searchParams.toString();
    console.log('queryString=',queryString)

    
    const fetchfilteringProperty = async () => {
        try {
              const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/property/${countrySlug}/search/?${queryString}`,
                {
                  withCredentials: true,
                }
              );
              console.log("✅fetchfilteringProperty-response.data =", response.data);
              setProperties(response.data || []); // ✅ Fix here
              console.log("properties =", properties); 
        
            } catch (error) {
              console.error("❌ Error fetchfilteringProperty:", error);
            
            } finally {
                setLoading(false);
            };
    };
    fetchfilteringProperty ();


    // const fetchData = async () => {
    //   try {
    //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search/?${queryString}`, {
    //       credentials: "include",
    //     });
    //     if (!res.ok) throw new Error("Failed to fetch properties");
    //     const data = await res.json();
    //     setProperties(data);
    //   } catch (error) {
    //     console.error(error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchData();
  
 }, [searchParams]);




  if (loading) {
    return <p className="text-center py-10">Loading properties...</p>;
  }

  if (properties.length === 0) {
    return <p className="text-center py-10">No properties found.</p>;
  }

  return (
    <section className="px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <div
          key={property.id}
          className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
        >
          {/* Image */}
          {/* {property.cover_image ? (
            <Image
              src={property.cover_image}
              alt={property.title}
              width={400}
              height={250}
              className="w-full h-56 object-cover rounded-t-2xl"
            />
          ) : (
            <div className="w-full h-56 bg-gray-200 rounded-t-2xl flex items-center justify-center text-gray-500">
              No Image
            </div>
          )} */}

          {/* Info */}
          <div className="p-4">
            <h3 className="text-lg font-semibold truncate">{property.title}</h3>
            <p className="text-sm text-gray-500">{property.city?.name}</p>
            <p className="mt-2 text-gray-700">
              <span className="font-medium">{property.price} {property.currency}</span>
            </p>
            <p className="text-sm text-gray-500">
              {property.bedrooms} Beds • {property.bathrooms} Baths
            </p>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 px-4 py-3 rounded-b-2xl flex justify-around items-center">
            <button className="text-gray-600 hover:text-blue-600 transition">❤️</button>
            <button className="text-gray-600 hover:text-blue-600 transition">📞</button>
            <button className="text-gray-600 hover:text-blue-600 transition">📍</button>
          </div>
        </div>
      ))}
    </section>
  );
}
