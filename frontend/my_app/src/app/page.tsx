// home page
// src/app/page.tsx

"use client";
import { Elsie } from "next/font/google";
import React, { useState, useEffect, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function HomePage() {
  const [activeRadioButton, setActiveRadioButton] = useState<string | null>(null);
  // const [buyrentAction, setBuyrentAction] = useState<string | null>(null);
  // const [commercialAction, setCommercialAction] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);



  // buy button - rent button - comercial button
  const handleactiveRadioButton = (buttonName: string) =>{
    setActiveRadioButton(buttonName)
  }
  
  // useEffect(() => {
  //   if (activeRadioButton === "buy" || activeRadioButton === "rent"){
  //       setBuyrentAction("buyRent_action");
  //   }else if(activeRadioButton === "commercial"){
  //       setCommercialAction("commercial_action");
  //   }
  // }, [activeRadioButton]);



  //  property type menue - beds&bath menue 
  const toggleMenu = (menu: string) => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };



  // close on click outside
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);



  // close on Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveMenu(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);






  return (
    <section className="relative min-h-[450px] bg-cover bg-center bg-[url('https://static-assets.propertyfinder.com/images/homepage/hero/sa-desktop.jpg')]">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />

      {/* Title */}
      <h1 className="relative z-10 text-center text-white text-5xl pt-20 pb-12">
        Find every home here
      </h1>

      {/* Search container */}
      <div
        ref={containerRef}
        className="relative z-10 bg-black/20 backdrop-blur-sm px-2 py-5 rounded-[24px] mx-4 md:mx-10 lg:mx-[170px]"
      >
        {/* Toggle buttons group */}
        <div className="flex items-center justify-center max-w-xl mx-auto mb-4">
          
          {/* buy */}
          <input
            type="radio"
            name="options"
            id="buy" 
            onChange={() => handleactiveRadioButton("buy")}
            checked={activeRadioButton === "buy"}
          />
          <label 
            className="w-full border-l border-t border-b text-base font-medium rounded-l-2xl text-black bg-white hover:bg-gray-100 px-4 py-1"
            htmlFor="rent">
            Buy
          </label>
            
          {/* rent */}
          <input
            type="radio"
            name="options"
            id="rent"
            onChange={() => handleactiveRadioButton("rent")}
            checked={activeRadioButton === "rent"}
          />
          <label 
              className="w-full border text-base font-medium text-black bg-white hover:bg-gray-100 px-4 py-1"
              htmlFor="rent">
              Rent
          </label>
          
          {/* commercial */}
          <input
            type="radio"
            name="options"
            id="commercial"
            onChange={() => handleactiveRadioButton("commercial")}
            checked={activeRadioButton === "commercial"}
          />
          <label 
              className="w-full border-t border-b border-r text-base font-medium rounded-r-2xl text-black bg-white hover:bg-gray-100 px-4 py-1"
              htmlFor="commercial">
              Commercial
          </label>
        </div>

        {/* Search input + dropdowns */}
        <div className="flex items-center w-full max-w-4xl mx-auto bg-white rounded-[24px] shadow-md overflow-visible">
          {/* Input field */}
          <input
            type="text"
            placeholder="City, community or building"
            className="flex-1 px-4 py-3 text-gray-700 focus:outline-none"
          />

          {/* Property type dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("property_type")}
              aria-expanded={activeMenu === "property_type"}
              className="flex items-center px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none"
            >
              Property type
              <FiChevronDown
                className={`ml-1 transition-transform duration-300 ${
                  activeMenu === "property_type" ? "rotate-180" : ""
                }`}
              />
            </button>

            {activeMenu === "property_type" && activeRadioButton !== "commercial" && (
              <ul className="absolute left-0 top-full mt-1 w-52 bg-white border rounded-lg shadow-lg z-50">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Apartment</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Villa</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Farm</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Rest House</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Compound</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Duplex</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Whole Building</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Hotel / Hotel Apartment
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Full Floor</li>
              </ul>
            )}

            {activeMenu === "property_type" && activeRadioButton === "commercial" && (
              <ul className="absolute left-0 top-full mt-1 w-52 bg-white border rounded-lg shadow-lg z-50">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Office Space</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Retail</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Warehouse</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Villa</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Show Room</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Bulk Units</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Factory</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Hotel / Hotel Apartment
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Labor Camp</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Staff Acomodation</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Shop</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Land</li>
              </ul>
            )}

          </div>

          {/* Beds & Baths dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("bed_bath")}
              aria-expanded={activeMenu === "bed_bath"}
              className="flex items-center px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none"
            >
              Beds & Baths
              <FiChevronDown
                className={`ml-1 transition-transform duration-300 ${
                  activeMenu === "bed_bath" ? "rotate-180" : ""
                }`}
              />
            </button>

            {activeMenu === "bed_bath" && activeRadioButton !== "commercial" &&  (
              <ul className="absolute left-0 top-full mt-1 w-56 bg-white border rounded-lg shadow-lg z-50">
                <li className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Bedrooms
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Studio</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">1</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">2</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">3</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">4</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">5+</li>

                <li className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-t">
                  Bathrooms
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">1</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">2</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">3</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">4</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">5+</li>
              </ul>
            )}
          </div>

          
          
          
          
          
          
          {/* Search button */}
          <button className="px-6 py-3 rounded-r-3xl bg-[#ea3934] text-white font-semibold hover:bg-[#97211e] transition">
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
