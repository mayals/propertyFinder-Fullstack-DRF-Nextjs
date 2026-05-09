// src/app/sa/(dynamic_pages)/my-properities/page.tsx
"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import MyPropertyCard from "../../components/MyPropertyCard";

interface Property {
  id: string;
  title: string;
  price: number;
  city?: string;
}

export default function MyPropertiesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



  useEffect(() => {
    if (!loading && !user) {
      router.push("/sa/login");
    }
  }, [user, loading, router]);




  useEffect(() => {
    const fetchMyProperties = async () => {
      try {
        const res = await axiosInstance.get(
        "/property/my-properties",
        { withCredentials:true }, 
        )
        setProperties(res.data.results); // ✅ IMPORTANT
      } catch (err) {
        setError("Failed to load my properties");
      } finally {
        // setLoading(false);
      }
    };

    fetchMyProperties();
  }, []);



 

  if (loading) {
    return (
      <div className="text-center mt-20">
        <Loading />
      </div>
    );
  }



  return (
    <>
    <section className="min-h-screen p-6">
      <h1 className="text-2xl  mb-6">
        Your owned properties ({properties.length})
      </h1>

      {properties.length === 0 ? (
        <div className="text-center mt-10 p-8 bg-white rounded-lg shadow mx-5">
            <p className="text-gray-600">
                You not have owned properties yet.
            </p>
        </div>
       
      ) : (
        <div className="space-y-6 my-8">
                {properties.map((property) => (
                        <MyPropertyCard 
                            key={property.id} 
                            property={property}
                            className="space-y-6 my-8" 
                        />
                ))}
        </div>
      )}
    </section>
    <Footer />
    </>
  );
}


