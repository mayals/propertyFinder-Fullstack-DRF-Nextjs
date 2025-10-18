"use client";

import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function Findsection() {
  const countrySlug = process.env.NEXT_PUBLIC_COUNTRY_SLUG;
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // buy- resident -- main type button 
  const [maintypePurpose, setMaintypePurpose] = useState("Buy residential");
  const [activeRadioButton, setActiveRadioButton] = useState<string | null>("Buy residential");
  
  // Handle radio button change -- for MaintypePurpose
  const handleActiveRadioButton = (buttonName: string) => {
    setActiveRadioButton(buttonName);
    setMaintypePurpose(buttonName);
    setActiveMenu(null);
  };
  



  // Beds & Baths
  const handleBedsBathsButton = (buttonName: string) => {
    setBeds(buttonName);
  };
  
  // Beds & Baths
  const [beds,setBeds]= useState("");
  const [baths,setBaths]= useState("");
  const [activeBedsBathsButton, setActiveBedsBathsButton] = useState<string | null>("Beds & Baths");
  
  



  // price 
  const handlePriceButton = (buttonName: string) => {
    setPrice(buttonName);
  };
  const [price,setPrice]= useState("Price");
  const [activePriceButton, setActivePriceButton] = useState<string | null>("Price");





// more 
  const handleMoreButton = (buttonName: string) => {
    setMore(buttonName);
  };
  const [more,setMore]= useState("");
  const [activeMoreButton, setActiveMoreButton] = useState<string | null>("More");



  // Toggle menu open/close
  const toggleMenu = (menu: string) => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  
  



  //  subtypes based on selected purpose (residential/commercial)-- using select and options way 
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







const containerRef = useRef<HTMLDivElement>(null);

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




 

//  search 
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
        className="flex items-center w-full mx-auto bg-white shadow-md justify-between"
      >
        {/* Search input */}
        <div className="">
          <input
            type="text"
            placeholder="City, community or building"
            className="w-52 px-2 py-3 mx-1 bg-gray-500 text-gray-700 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1">




          {/*Main type Purpose Menu */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("maintypePurposeMenu")}
              aria-expanded={activeMenu === "maintypePurposeMenu"}
              className={`cursor-pointer flex items-center px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none ${activeRadioButton === "Buy residential"?" border border-indigo-600 text-indigo-600":""}`}
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




          
          {/* Beds & Baths */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("bedsBathsMenu")}
              aria-expanded={activeMenu === "bedsBathsMenu"}
              className="cursor-pointer flex items-center px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none"
            >
              {beds}Beds, {baths}Baths
              <FiChevronDown
                className={`ml-1 transition-transform duration-300 ${
                  activeMenu === "bedsBathsMenu" ? "rotate-180" : ""
                }`}
              />
            </button>

            {activeMenu === "bedsBathsMenu" && (
              <div className="absolute z-50 left-0 top-full bg-gray-100 border rounded-lg shadow-md w-[450px] h-[250px] p-2">
                Bedrooms
                <div className="flex p-2 mb-6">
                {["studio","1", "2", "3", "4", "5", "6", "7" ,"+7"].map(
                  (option) => (
                    <label
                        key={option}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-indigo-100 ${
                          activeRadioButton === option ? "bg-indigo-200" : ""
                        }`}
                        onClick={() => handleBedsBathsButton(option)}
                    >
                        <input
                          type="radio"
                          name="beds"
                          checked={activeRadioButton === option}
                          onChange={() => handleBedsBathsButton(option)}
                          className="hidden"
                        />
                        <span className="flex bg-red-300 rounded rounded-full p-1">{option}</span>
                    </label>
                  )
                )}
                </div>
                Bathrooms
                <div className="flex p-2 ">
                {["studio","1", "2", "3", "4", "5", "6", "7" ,"+7"].map(
                  (option) => (
                    <label
                        key={option}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-indigo-100 ${
                          activeRadioButton === option ? "bg-indigo-200" : ""
                        }`}
                        onClick={() => handleBedsBathsButton(option)}
                    >
                        <input
                          type="radio"
                          name="beds"
                          checked={activeRadioButton === option}
                          onChange={() => handleBedsBathsButton(option)}
                          className="hidden"
                        />
                        <span className="flex bg-red-300 rounded rounded-full p-1">{option}</span>
                    </label>
                  )
                )}

                </div>
              </div>
            )}
            
          </div>




          {/* price */}
          <div className="relative">
            <button
              onClick={() => toggleMenu("priceMenu")}
              aria-expanded={activeMenu === "priceMenu"}
              className="cursor-pointer flex items-center px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none"
            >
              { price }
              <FiChevronDown
                className={`ml-1 transition-transform duration-300 ${
                  activeMenu === "priceMenu" ? "rotate-180" : ""
                }`}
              />
            </button>

            {activeMenu === "priceMenu" && (
              <div className="flex absolute z-50 left-[-100px] top-full bg-gray-100 border rounded-lg shadow-md w-[200px] p-2">
                Price
                {["200","300"].map(
                  (option) => (
                    <label
                        key={option}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-indigo-100 ${
                          activePriceButton === option ? "bg-indigo-200" : ""
                        }`}
                        onClick={() => handleBedsBathsButton(option)}
                    >
                        <input
                          type="radio"
                          name="price"
                          checked={activePriceButton === option}
                          onChange={() => handlePriceButton(option)}
                          className="hidden"
                        />
                        <span className="flex bg-red-300 rounded rounded-full p-1">{option}</span>
                    </label>
                  )
                )}
              </div>
            )}
          </div>



            {/* more*/}
          <div className="relative">
            <button
              onClick={() => toggleMenu("moreMenu")}
              aria-expanded={activeMenu === "moreMenu"}
              className="cursor-pointer flex items-center px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none"
            >
              more
              <FiChevronDown
                className={`ml-1 transition-transform duration-300 ${
                  activeMenu === "moreMenu" ? "rotate-180" : ""
                }`}
              />
            </button>

            {activeMenu === "moreMenu" && (
              <div className="flex absolute z-50 left-[-100px] top-full bg-gray-100 border rounded-lg shadow-md w-[200px] p-2">
                more
                {["more","1", "2", "3", "4", "5", "6", "7" ,"+7"].map(
                  (option) => (
                    <label
                        key={option}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-indigo-100 ${
                          activeMoreButton === option ? "bg-indigo-200" : ""
                        }`}
                        onClick={() => handleMoreButton(option)}
                    >
                        <input
                          type="radio"
                          name="more"
                          checked={activeMoreButton === option}
                          onChange={() => handleMoreButton(option)}
                          className="hidden"
                        />
                        <span className="flex bg-red-300 rounded rounded-full p-1">{option}</span>
                    </label>
                  )
                )}
              </div>
            )}
          </div>



          {/* Find button */}
          <button
            onClick={handleSearch}
            className="cursor-pointer px-4 py-3  bg-[#ea3934] text-white font-semibold hover:bg-[#97211e] transition"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
