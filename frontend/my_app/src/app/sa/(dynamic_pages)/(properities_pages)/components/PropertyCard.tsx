"use client";
import Image from "next/image";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CiLocationOn } from "react-icons/ci";
import { LiaBedSolid } from "react-icons/lia";
import { PiBathtub } from "react-icons/pi";
import { RxDimensions } from "react-icons/rx";
import { FiPhone, FiMail, FiHeart, FiShare2, FiMoreVertical, FiFlag, FiMessageCircle } from "react-icons/fi";





export default function PropertyCard({ property }: any) {
  
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  console.log('apiURL=',apiURL)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  // const images = property.images?.map((img: any) => img.images) || ["/placeholder.jpg"];

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % property.images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + property.images.length) % property.images.length);

  const handleTouchStart = (e: React.TouchEvent) => (touchStartX.current = e.changedTouches[0].screenX);
  const handleTouchMove = (e: React.TouchEvent) => (touchEndX.current = e.changedTouches[0].screenX);
  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const deltaX = touchStartX.current - touchEndX.current;
      if (deltaX > 50) nextImage();
      else if (deltaX < -50) prevImage();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };


  console.log('property.owner.profile.profile_picture=',property.owner.profile.profile_picture)
  console.log('my image bakend url=',apiURL+property.owner.profile.profile_picture)


  return (
    <>
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="rounded-lg"
    >
    
      <div className="flex flex-col sm:flex-row bg-white shadow-md hover:shadow-xl transition-all overflow-hidden">
          {/* Left Side: Image */}
          <div
            className="relative w-full sm:w-2/5 h-60 sm:h-64 overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={property.images[currentIndex].images}
              alt={property.title}
              fill
              sizes="(max-width: 640px) 100vw, 40vw"
              className="object-cover rounded-tl-lg"
            />

            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
            
            {/* Dots indicator */}
            {property.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                {property.images.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i === currentIndex ? "bg-white" : "bg-gray-400/60"
                    }`}
                  />
                ))}
              </div>
            )}


          </div>

          {/* Right Side: Info */}
          <div className="flex-1 p-5 flex flex-col justify-between">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{property.title}</h2>
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <CiLocationOn /> {property?.district}, {property?.city?.city_name}
                </p>
              </div>

              {/* Owner info */}
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium text-gray-700">
                  {property.owner.first_name|| "Property Owner"}
                </span>
                
                  {property.owner.profile.profile_picture && (
                    <Image
                      src={`${apiURL}${property.owner.profile.profile_picture}`}
                      alt="Owner logo"
                      width={32}
                      height={32}
                      className="rounded-full mt-1"
                    />
                  )} 
              </div>
            </div>

            {/* Property details */}
            <div className="flex flex-wrap gap-3 text-gray-600 mt-3">
              <div className="flex items-center gap-1"><LiaBedSolid /> {property.bedrooms}</div>
              <div className="flex items-center gap-1"><PiBathtub /> {property.bathrooms}</div>
              <div className="flex items-center gap-1"><RxDimensions /> {property.property_size} sqm</div>
            </div>

            {/* Price */}
            <div className="mt-3">
              <p className="text-2xl font-bold text-black">
                {property.price} {property.currency || "SAR"}
              </p>
              <p className="text-sm text-gray-500">{property.psub_type.subtype_name}</p>
            </div>
          

          

          </div>
      </div>    
      
      {/* Footer under image  */}
      <div className="rounded-b-lg bottom-0 left-0 right-0 bg-[#ea3934] text-white text-xs px-3 py-1 flex justify-between items-center">
          <span>Listed {property?.created_at|| "3 months ago"}</span>
          <div className="flex gap-2 text-lg">
            <button><FiPhone /></button>
            <button><FiMail /></button>
            <button><FiMessageCircle /></button>
            <button><FiHeart /></button>
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)}>
                <FiMoreVertical />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-6 bg-white shadow-lg rounded-md border text-gray-700 text-sm w-32">
                  <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full">
                    <FiShare2 /> Share
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full">
                    <FiFlag /> Report
                  </button>
                </div>
              )}
            </div>
          </div>
      </div>
        
    </motion.div>
    
    </>
  );
}
