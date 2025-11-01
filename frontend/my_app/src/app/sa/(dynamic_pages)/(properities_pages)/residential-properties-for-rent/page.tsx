// src/app/sa/(dynamic_pages)/residential-properties-for-rent/page.js

"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import PropertyCard from "../components/PropertyCard";
import Findsection from "../components/Findsection";
import Breadcrumb from "../components/Breadcrumb";
import SubTypesCard from "../components/SubTypesCard";
import Loading from "../../../components/loading/Loading";


export default function ResidentialRent() {
  const countrySlug = process.env.NEXT_PUBLIC_COUNTRY_SLUG;
  const CountryName = process.env.NEXT_PUBLIC_COUNTRY_NAME
  
  const maintypeSlug = "residential"
  const purposeSlug = "rent"

  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<any[]>([]);
  const [subtypes,setSubtypes] = useState<any[]>([]);

  


  useEffect(() => {
    const fetchProperties = async () => {
        try {
              const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/property/${countrySlug}/${maintypeSlug}-for-${purposeSlug}/`,
                {
                  withCredentials: true,
                }
              );
              console.log("✅fetchProperties - response.data =", response.data);
              setProperties(response.data.results || []); 
        } catch (error) {
              console.error("❌ Error fetching properties:", error);
        } finally {
              setLoading(false);
        };
    };
    fetchProperties();

  

    const fetchSubTypes = async () => {
        try {
              const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/property/${countrySlug}/${maintypeSlug}-${purposeSlug}/subtypes/`,
                {
                  withCredentials: true,
                }
              );
              console.log("✅fetchSubTypes-response.data =", response.data);
              setSubtypes(response.data || []);
              console.log("subtypes =", subtypes); 
        
            } catch (error) {
              console.error("❌ Error fetching Subtypes:", error);
        }
    };
    fetchSubTypes();
  
  
  }, [countrySlug, maintypeSlug, purposeSlug]);


  if (loading) {
        return (
          <div className="text-center mt-20">
              <Loading />
          </div>
        );
  }


  if (properties.length === 0) {
          return (
            <p className="text-center py-10">
              No properties found.
            </p>
          );
  }

  




  return (
    <main className="min-h-screen bg-gray-50">
          <section className="max-w-6xl mx-auto px-4">
              
              {/* Findsection component  */}
              <Findsection  mainType = {maintypeSlug}
                            purpose  = {purposeSlug}
              /> 
             

              {/* Breadcrumb component  */}
              <Breadcrumb 
                    maintypeSlug={maintypeSlug}
                    purposeSlug={purposeSlug}
                    CountryName={CountryName}            
              />


              <h1 className="text-xl font-semibold mb-6">
                <span className="capitalize">{maintypeSlug}</span> properties for {purposeSlug} in {CountryName}
              </h1>

              <div className="text-sm text-gray-500">
                { properties.length } Properties
              </div>
              

              {/* SubTypesCard component  */}
              <SubTypesCard
                  subtypes ={subtypes}
              />
              
              
              {/* properties */}
              <div className="flex flex-col gap-10 mt-8">
                  {properties.map((property) => ( 
                        <PropertyCard 
                            key={property.id} 
                            property={property} 
                        />
                  ))}
              </div>
                            
            
          </section>
    </main>
  );
}
