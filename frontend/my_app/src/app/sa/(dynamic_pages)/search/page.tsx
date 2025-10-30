"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";
// components
import PropertyCard from "../residential-properties-for-sale/components/PropertyCard";
import Find from "../residential-properties-for-sale/components/Find";
import SubTypes from "../residential-properties-for-sale/components/SubTypes";
import Loading from "../../components/loading/Loading";



export default function SearchPage() {
  const CountryName = process.env.NEXT_PUBLIC_COUNTRY_NAME
  const countrySlug = process.env.NEXT_PUBLIC_COUNTRY_SLUG;
  const [loading, setLoading] = useState(true);
  const [subtypes,setSubtypes] = useState<any[]>([]);
  const [properties, setProperties] = useState([]);
  
  const searchParams = useSearchParams();
  console.log("searchParams=",searchParams)


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
              setProperties(response.data.results || []); // ✅ Fix here
              console.log("properties =", properties); 
        
            } catch (error) {
              console.error("❌ Error fetchfilteringProperty:", error);
            
            } finally {
                setLoading(false);
            };
    };
    fetchfilteringProperty ();
 
 

   
  
   const fetchSubTypes = async (queryString) => {
        try {
              const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/property/${countrySlug}/subtypes/search/?${queryString}`,
                {
                  withCredentials: true,
                }
              );
              console.log("✅fetchSubTypes-response.data =", response.data);
              setSubtypes(response.data.results || []); // ✅ Fix here
              console.log("subtypes =", subtypes); 
        
            } catch (error) {
              console.error("❌ Error fetching Subtypes:", error);
        }
    };
    fetchSubTypes(queryString);
  
 
  }, [countrySlug,searchParams]);



 

  
  





  if (loading) {
        return (
          <div className="text-center mt-20">
              <Loading />
          </div>
        );
  }


  if (properties.length === 0) {
        return (
          <main className="min-h-screen bg-gray-50">
              <section className="max-w-6xl mx-auto px-4">
                
                <Find  /> 
                
                <div className="flex items-center justify-center mt-5 bg-cover bg-center bg-no-repeat">
                  <div className="max-w-md mx-auto text-center bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
                    

                    <p className="text-lg text-gray-600 mb-8">
                      We currently have no properties matching your search.
                      You could try the following, Change the location.
                    </p>
                    
                  </div>
                </div>

              </section>
          </main> 
        );
  }







  return (
    <main className="min-h-screen bg-gray-50">
          <section className="max-w-6xl mx-auto px-4">
              
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
                                Residential Properties for sale in {CountryName}
                            </span>
                        </div>
                    </li>
                </ol>
            </nav> 

              <h1 className="text-xl font-semibold mb-6">
                Residential Properties for sale in {CountryName}
              </h1>

              <div className="text-sm text-gray-500">
                { properties.length } Properties
              </div>
              
              <div className="bg-gray-200 p-3">
                  {subtypes.length === 0 ? (
                                  <p className="text-gray-500 mt-8">
                                        No subtypes found.
                                  </p>
                              ) : (
                                  <div className="gap-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                                    {subtypes.map((sub) => (
                                                        <SubTypes key={sub.id} 
                                                                  sub={sub}
                                                        />
                                    ))}
                                  </div>
                              )
                  }
              </div>
              
              
              {properties.length === 0 ? (
                                  <p className="text-gray-500 mt-8">
                                        No properties found.
                                  </p>
                              ) : (
                                  <div className="flex flex-col gap-10 mt-8">
                                    {properties.map((property) => (
                                      <PropertyCard key={property.id} property={property} />
                                    ))}
                                  </div>
                              )
              }
          </section>
    </main>
    
    // <section className="px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    //   {properties.map((property) => (
    //     <div
    //       key={property.id}
    //       className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
    //     >
    //       {/* Image */}
    //       {/* {property.cover_image ? (
    //         <Image
    //           src={property.cover_image}
    //           alt={property.title}
    //           width={400}
    //           height={250}
    //           className="w-full h-56 object-cover rounded-t-2xl"
    //         />
    //       ) : (
    //         <div className="w-full h-56 bg-gray-200 rounded-t-2xl flex items-center justify-center text-gray-500">
    //           No Image
    //         </div>
    //       )} */}

    //       {/* Info */}
    //       <div className="p-4">
    //         <h3 className="text-lg font-semibold truncate">{property.title}</h3>
    //         <p className="text-sm text-gray-500">{property.city?.name}</p>
    //         <p className="mt-2 text-gray-700">
    //           <span className="font-medium">{property.price} {property.currency}</span>
    //         </p>
    //         <p className="text-sm text-gray-500">
    //           {property.bedrooms} Beds • {property.bathrooms} Baths
    //         </p>
    //       </div>

    //       {/* Footer */}
    //       <div className="bg-gray-100 px-4 py-3 rounded-b-2xl flex justify-around items-center">
    //         <button className="text-gray-600 hover:text-blue-600 transition">❤️</button>
    //         <button className="text-gray-600 hover:text-blue-600 transition">📞</button>
    //         <button className="text-gray-600 hover:text-blue-600 transition">📍</button>
    //       </div>
    //     </div>
    //   ))}
    // </section>
  );
}
