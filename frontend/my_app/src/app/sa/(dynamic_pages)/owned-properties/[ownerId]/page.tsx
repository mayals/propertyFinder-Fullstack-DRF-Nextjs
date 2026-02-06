// src/app/sa/(dynamic_pages)/owned-properities/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "../../../lib/axios";
import axios from "axios";
import PropertyCard from "../../(properties_pages)/components/PropertyCard";
import Loading from "../../../components/loading/Loading";
import Footer from "../../../components/footer/Footer";




export default function OwnerPropertiesPage() {
  const params = useParams();
  const ownerId = params.ownerId as string;
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
        async function fetchOwnerProperties() {
          try {
            const res = await axios.get(
              // http://localhost:8000/GET              
              `${process.env.NEXT_PUBLIC_API_URL}/property/sa/owner-properties/${ownerId}/`,
              { withCredentials:false }, 
            );
            setProperties(res.data.results || []);
          } catch (err) {
            console.error("Error fetching owner properties:", err);
          } finally  {
            setLoading(false);
          }
        }
        fetchOwnerProperties();
  }, [ownerId]);



  if (loading) {
    return (
      <div className="mt-20 text-center">
        <Loading />
      </div>
    );
  }




  return (
    <section >
      <main className="container mx-auto mt-15 px-10 py-10">
        <h1 className="text-xl mb-6">
          Owner has ({properties.length}) properties
        </h1>

        {properties.length === 0 ? (
          <p>No properties found for this owner.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </section>
  );
}
