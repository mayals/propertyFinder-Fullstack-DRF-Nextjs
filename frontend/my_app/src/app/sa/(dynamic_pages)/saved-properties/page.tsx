// src/app/sa/(dynamic_pages)/savedProperties.tsx
"use client";


import { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
import Loading from "../../components/loading/Loading";
import PropertyCard from "../(properities_pages)/components/PropertyCard";

interface Property {
  id: string;
  title: string;
  price: number;
  city?: string;
}

export default function SavedPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        const res = await axiosInstance.get(
        "/property/properties-liked",
        { withCredentials:true }, 
        )
        setProperties(res.data.results); // ✅ IMPORTANT
      } catch (err) {
        setError("Failed to load saved properties");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProperties();
  }, []);

  if (loading) return <Loading />;

  return (
    <section className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">
        Saved Properties ({properties.length})
      </h1>

      {properties.length === 0 ? (
        <p className="text-gray-500">No saved properties yet.</p>
      ) : (
        <div className="space-y-6 my-8">
                {properties.map((property) => (
                        <PropertyCard 
                            key={property.id} 
                            property={property}
                            className="space-y-6 my-8" 
                        />
                ))}
        </div>
      )}
    </section>
  );
}