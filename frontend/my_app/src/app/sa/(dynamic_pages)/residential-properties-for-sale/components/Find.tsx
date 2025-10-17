"use client";

import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function Findsection() {
  const countrySlug = process.env.NEXT_PUBLIC_COUNTRY_SLUG;

  // buy- resident -- main type button 
  const [maintypePurpose, setMaintypePurpose] = useState("Buy residential");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeRadioButton, setActiveRadioButton] = useState<string | null>("Buy residential");
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Toggle menu open/close
  const toggleMenu = (menu: string) => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  // Handle radio button change
  const handleActiveRadioButton = (buttonName: string) => {
    setActiveRadioButton(buttonName);
    setMaintypePurpose(buttonName);
    setActiveMenu(null);
  };
  
  
  // buy- resident -- filtering buttons
  const [subtypesList, setSubtypesList] = useState([]);
  const [selectedSubtype, setSelectedSubtype] = useState({
                                                          id: "",
                                                          subtype_name: "Property type",
                                                        });
  console.log("selectedSubtype=",selectedSubtype);
  
  
  

  // Fetch subtypes based on selected purpose (residential/commercial)
  useEffect(() => {
  const fetchSubTypesList = async () => {
    try {
      const purposeSlug = maintypePurpose.toLowerCase().includes("buy") ? "sale" : "rent";
      const maintypeSlug = maintypePurpose.toLowerCase().includes("residential")
        ? "residential"
        : "commercial";

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/property/${countrySlug}/${maintypeSlug}-for-${purposeSlug}/subtypes/`,
        { withCredentials: true }
      );

      setSubtypesList(response.data || []);

      // ✅ Reset subtype each time user switches main type/purpose
      setSelectedSubtype({ id: "", subtype_name: "Property type" });
    } catch (error) {
      console.error("❌ Error fetching subtypes:", error);
    }
  };

  fetchSubTypesList();
}, [maintypePurpose, countrySlug]);



  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveMenu(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);




 const handleSelectSubtype = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedValue = e.target.value;
  const selected = subtypesList.find((sub: any) => String(sub.id) === String(selectedValue));

  setSelectedSubtype(
    selected
      ? { id: selected.id, subtype_name: selected.subtype_name }
      : { id: "", subtype_name: "Property type" }
  );

  console.log("✅ Selected subtype updated:", selected);
};




  // Handle search click — builds query like PropertyFinder
  const handleSearch = () => {
    const queryParams = new URLSearchParams();

    queryParams.append("purpose", maintypePurpose.includes("Buy") ? "buy" : "rent");
    queryParams.append("type", maintypePurpose.includes("residential") ? "residential" : "commercial");

    if (selectedSubtype.id) queryParams.append("subtype", selectedSubtype.id);

    // Example of how it would look:
    // /search?purpose=buy&type=residential&subtype=apartment
    window.location.href = `/search?${queryParams.toString()}`;
  };

  return (
    <section className="bg-red-300 p-2">
      {/* Main container */}
      <div
        ref={containerRef}
        className="flex items-center w-full max-w-5xl mx-auto bg-white rounded-[24px] shadow-md overflow-visible"
      >
        {/* Search input */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="City, community or building"
            className="w-full px-4 py-3 text-gray-700 focus:outline-none rounded-l-[24px]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1 px-2">

          {/* Purpose Menu */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("maintypePurposeMenu")}
              aria-expanded={activeMenu === "maintypePurposeMenu"}
              className="cursor-pointer flex items-center px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none"
            >
              {maintypePurpose}
              <FiChevronDown
                className={`ml-1 transition-transform duration-300 ${
                  activeMenu === "maintypePurposeMenu" ? "rotate-180" : ""
                }`}
              />
            </button>

            {activeMenu === "maintypePurposeMenu" && (
              <div className="absolute z-50 left-0 top-full bg-gray-100 border rounded-lg shadow-md w-52 p-2">
                {["Buy residential", "Rent residential", "Buy commercial", "Rent commercial"].map(
                  (option) => (
                    <label
                      key={option}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-indigo-100 ${
                        activeRadioButton === option ? "bg-indigo-200" : ""
                      }`}
                      onClick={() => handleActiveRadioButton(option)}
                    >
                      <input
                        type="radio"
                        name="maintypePurpose"
                        checked={activeRadioButton === option}
                        onChange={() => handleActiveRadioButton(option)}
                        className="hidden"
                      />
                      <span>{option}</span>
                    </label>
                  )
                )}
              </div>
            )}
          </div>

          {/* Subtype Dropdown */}
          <div className="relative">
            <select
              value={selectedSubtype.id}
              onChange={handleSelectSubtype}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg focus:outline-none hover:bg-gray-200"
            >
            {/* Show placeholder only when nothing is selected */}
                  {!selectedSubtype.id && (
                    <option value="">{selectedSubtype.subtype_name}</option>
                  )}
                  
                  {subtypesList.map((sub: any) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.subtype_name}
                    </option>
                  ))}
            </select>
          </div>


          {/* Find button */}
          <button
            onClick={handleSearch}
            className="cursor-pointer px-6 py-3 rounded-r-3xl bg-[#ea3934] text-white font-semibold hover:bg-[#97211e] transition"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
