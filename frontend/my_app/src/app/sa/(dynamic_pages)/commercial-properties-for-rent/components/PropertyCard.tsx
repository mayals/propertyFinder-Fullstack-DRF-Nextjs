"use client";
import Image from "next/image";
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PropertyCard({ property }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = property.images?.map((img: any) => img.images) || ["/placeholder.jpg"];

  // Swipe states
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const deltaX = touchStartX.current - touchEndX.current;
      if (deltaX > 50) {
        // Swiped left → next image
        nextImage();
      } else if (deltaX < -50) {
        // Swiped right → previous image
        prevImage();
      }
    }
    // Reset values
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300">
      {/* Image Slider */}
      <div
        className="relative w-full h-56 rounded-t-xl overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={images[currentIndex]}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500"
          sizes="100vw"
        />

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
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

      {/* Property Info */}
      <div className="p-4 space-y-2">
        <h2 className="text-lg font-semibold">{property.title}</h2>
        <p className="text-sm text-gray-500">{property.city?.city_name || "Unknown city"}</p>
        <p className="text-lg font-bold text-primary-600">
          {property.price} {property.currency || "SAR"}
        </p>
      </div>
    </div>
  );
}



//  simple way -- using Horizontal scroll (slice) of images
// "use client";
// import Image from "next/image";

// export default function PropertyCard({ property }: any) {
//   const images = property.images || [];

//   return (
//     <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden">
//       {/* Image Carousel */}
//       <div className="overflow-x-auto whitespace-nowrap scroll-smooth">
//         {images.length > 0 ? (
//           images.map((img: any, idx: number) => (
//             <div
//               key={idx}
//               className="inline-block w-full sm:w-64 h-56 relative mr-2 rounded-xl"
//             >
//               <Image
//                 src={img.images}
//                 alt={property.title}
//                 fill
//                 className="object-cover rounded-xl"
//                 sizes="(max-width: 640px) 100vw, 16rem" // Fixes warning
//               />
//             </div>
//           ))
//         ) : (
//           <div className="w-full h-56 relative">
//             <Image
//               src="/placeholder.jpg"
//               alt={property.title}
//               fill
//               className="object-cover rounded-xl"
//               sizes="100vw"
//             />
//           </div>
//         )}
//       </div>

//       {/* Property Info */}
//       <div className="p-4 space-y-2">
//         <h2 className="text-lg font-semibold">{property.title}</h2>
//         <p className="text-sm text-gray-500">{property.city}</p>
//         <p className="text-lg font-bold text-primary-600">{property.price} SAR</p>
//       </div>
//     </div>
//   );
// }


