// src/app/sa/(dynamic_pages)/buy/page.js
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import PropertyCard from "./components/PropertyCard";
import Find from "./components/Find";
import Link from "next/link";



export default function CommercialSale() {
  const countrySlug = process.env.NEXT_PUBLIC_COUNTRY_SLUG;
  const CountryName = process.env.NEXT_PUBLIC_COUNTRY_NAME
  const [properties, setProperties] = useState<any[]>([]);
  const [filters, setFilters] = useState({
                                          city: "",
                                          order: "latest",
                                          purpose: "sale",
                                        });



  useEffect(() => {
    const fetchProperties = async () => {
        try {
              const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/property/list-property/${countrySlug}/`,
                {
                  params: filters,
                  withCredentials: true,
                }
              );
              console.log("✅fetchProperties - response.data =", response.data);
              setProperties(response.data.results || []); // ✅ Fix here
        } catch (error) {
              console.error("❌ Error fetching properties:", error);
        }
    };

    fetchProperties();

  }, [countrySlug, filters]);





  return (
    <main className="min-h-screen bg-gray-50">
          <section className="max-w-7xl mx-auto px-4 py-8">
              
              <Find  /> 
             

              {/* Breadcrumb nav  */}
              <nav className="flex pb-1 my-8" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <li className="inline-flex items-center">
                        <Link href="/sa/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                            <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                            </svg>
                            Home
                        </Link>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                            </svg>
                            <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                                Commercial Properties for sale in {CountryName}
                            </span>
                        </div>
                    </li>
                </ol>
            </nav> 

              <h1 className="text-xl font-semibold mb-6">
                Commercial Properties for sale in {CountryName}
              </h1>

              <div className="text-sm text-gray-500">
                { properties.length } Properties
              </div>
              
              <div className="bg-gray-200 h-30 rounded grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              
              </div>
              
              
              {properties.length === 0 ? (
                                  <p className="text-gray-500 mt-8">
                                        No properties found.
                                  </p>
                              ) : (
                                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                                      {properties.map((property) => (
                                          <PropertyCard 
                                              key={property.id} 
                                              property={property} 
                                          />
                                      ))}
                                  </div>
                              )
              }
          </section>
    </main>
  );
}
