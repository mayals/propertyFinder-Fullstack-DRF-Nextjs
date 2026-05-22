"use client";
import Image from "next/image";
import { FileText } from "lucide-react";

// Media item type (same as in types/property.ts)
interface MediaItem {
  type: "image" | "video" | "document";
  url: string;
  name?: string;
}

interface Props {
  media: MediaItem[];
}

export default function MediaCarousel({ media }: Props) {
  if (!media || media.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-500">No media available</div>
    );
  }

  // Simple horizontal scroll carousel (responsive, Tailwind)
  return (
    <div className="relative">
      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {media.map((item, idx) => (
          <div key={idx} className="flex-shrink-0 w-full max-w-full snap-center p-2">
            <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden bg-gray-50 shadow">
              {item.type === "image" && (
                <Image src={item.url} alt={item.name ?? `image-${idx}`} fill className="object-cover" />
              )}
              {item.type === "video" && (
                <video src={item.url} controls className="w-full h-full object-cover" />
              )}
              {item.type === "document" && (
                <a href={item.url} download className="flex flex-col items-center justify-center w-full h-full bg-gray-100 hover:bg-gray-200 transition">
                  <FileText className="w-12 h-12 text-indigo-600 mb-2" />
                  <span className="text-sm text-gray-700 break-all text-center">{item.name ?? "Document"}</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
