"use client";

import { Edit3, Trash2, MapPin, Building2, Calendar, Tally5, Wallet, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MediaItem, NewProject } from "../types/property";
import { useState } from "react";

interface Props {
  project: NewProject;
  user: any; // auth user object
  onDelete: (projectId: string) => void;
}

export default function ProjectCard({ project, user, onDelete }: Props) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const canEditProject = () => {
    if (!project) return false;
    return user && (user.role === "admin" || user.id === project.user.id);
  };

  // Build a default media item for fallback
  const DEFAULT_MEDIA = {
    image: "/media/default_images/default_image.jpg",
    video: "/media/default_images/default_video.jpg"
  };

  // Combine all media into a single array for the carousel
  const buildMediaArray = (): MediaItem[] => {
    const media: MediaItem[] = [];

    // Add all images
    if (project.images && project.images.length) {
      project.images.forEach((img: any) => {
        media.push({ type: "image" as const, url: img.images });
      });
    } else {
      // Add default image if no images exist
      media.push({ type: "image" as const, url: DEFAULT_MEDIA.image });
    }

    // Add all videos
    const videos = (project as any).videos;
    if (videos && videos.length) {
      videos.forEach((v: any) => {
        media.push({ type: "video" as const, url: v.url, name: v.name });
      });
    } else {
      // Add default video if no videos exist
      media.push({ type: "video" as const, url: DEFAULT_MEDIA.video });
    }

    // Optionally add first document (keep if needed)
    const docs = (project as any).documents;
    if (docs && docs.length) {
      media.push({ type: "document" as const, url: docs[0].url, name: docs[0].name });
    }

    return media;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Handed Over":
        return "bg-orange-500";
      case "Off Plan":
        return "bg-red-500";
      case "Launching Soon":
        return "bg-yellow-500";
      case "Completed":
      case "Ready to Move":
        return "bg-green-500";
      case "Under Construction":
        return "bg-amber-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100">
      {/* Media Carousel with navigation */}
      <div className="relative h-48 md:h-64">
        {/* Build media array */}
        {(() => {
          const mediaItems = buildMediaArray();
          if (mediaItems.length === 0) {
            return <div className="flex items-center justify-center h-full text-gray-500">No media</div>;
          }
          // Use top‑level state for index (declared below)
          const currentItem = mediaItems[currentIndex];

          return (
            <>
              <div className="flex-shrink-0 w-full max-w-full snap-center p-2">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-50 shadow">
                  {currentItem?.type === "image" && (
                    <img src={currentItem.url} alt={currentItem.name ?? `image-${currentIndex}`} className="object-cover w-full h-full" />
                  )}
                  {currentItem?.type === "video" && (
                    <video src={currentItem.url} controls className="w-full h-full object-cover" />
                  )}
                  {currentItem?.type === "document" && (
                    <a href={currentItem.url} download className="flex flex-col items-center justify-center w-full h-full bg-gray-100 hover:bg-gray-200 transition">
                      <FileText className="w-12 h-12 text-indigo-600 mb-2" />
                      <span className="text-sm text-gray-700 break-all text-center">{currentItem.name ?? "Document"}</span>
                    </a>
                  )}
                </div>
              </div>

              {mediaItems.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length); }}
                    className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full z-10"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % mediaItems.length); }}
                    className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full z-10"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </>
          );
        })()}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(project.status_detail)}`}>
            {project.status_detail}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-slate-700">
            {project.nproj_main_type}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-2 hover:text-indigo-600 transition-colors">
          {project.nproj_name}
        </h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{project.city?.city_name || "N/A"}{project.district ? `, ${project.district}` : ""}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Building2 className="w-4 h-4" />
            <span className="text-sm">
              {project.user.profile?.developer_name || `${project.user?.first_name} ${project.user?.last_name}` || "N/A"}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center mb-4">
          <div className="bg-slate-50 rounded-lg p-2">
            <Calendar className="w-3 h-3 mx-auto text-slate-400" />
            <p className="text-xs text-slate-500 mt-1">Completion</p>
            <p className="text-sm font-medium text-slate-700">{project.hand_over_year ? `${project.hand_over_year}` : "N/A"}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2">
            <Tally5 className="w-3 h-3 mx-auto text-slate-400" />
            <p className="text-xs text-slate-500 mt-1">Units</p>
            <p className="text-sm font-medium text-slate-700">{project.units}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2">
            <Wallet className="w-3 h-3 mx-auto text-slate-400" />
            <p className="text-xs text-slate-500 mt-1">Price</p>
            <p className="text-sm font-medium text-slate-700">
              {project.lunch_price?.toLocaleString()}{project.currency ? ` ${project.currency}` : ""}
            </p>
          </div>
        </div>
        {canEditProject() && (
          <div className="flex gap-3">
            <button
              className="flex-1 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1"
              onClick={() => router.push(`/sa/projects/edit/${project.id}`)}
            >
              <Edit3 className="w-4 h-4" /> Edit
            </button>
            <button
              className="flex-1 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
              onClick={() => onDelete(project.id)}
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
