import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NewProject } from "../types/property";
import { amenityIcons } from "../common/amenityIcons";
import { LiaBedSolid } from "react-icons/lia";
import { PiBathtub } from "react-icons/pi";
import { RxDimensions } from "react-icons/rx";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { BsBuildings } from "react-icons/bs";
import { SlGrid } from "react-icons/sl";
import { SlLocationPin } from "react-icons/sl";
import { HiOutlineDocumentText } from "react-icons/hi";
import { BsBuildingGear } from "react-icons/bs";
import { GiMultiDirections } from "react-icons/gi";
import { AiOutlineColumnWidth } from "react-icons/ai";
import { MdOutlineEventAvailable } from "react-icons/md";
import { GoArrowRight } from "react-icons/go";
import { GrLocation } from "react-icons/gr";
import { ChevronLeft, ChevronRight, Download, FileText } from "lucide-react";





export default function NewProjectDetails({ newProject }: { newProject: NewProject }) {
    // Guard against missing user data
  if (!newProject?.user) {
    console.warn('NewProjectDetails: missing user data');
    return null;
  }

    const apiURL = process.env.NEXT_PUBLIC_API_URL;
    const imageURL = newProject.user?.profile?.profile_picture
    ?`${apiURL}${newProject.user?.profile?.profile_picture}`.replace(/\/+/, "/")
    : null;
    console.log("NewProjectsDetails-imageURL=",newProject.user?.profile?.profile_picture)

    // Helper functions for media handling
    const getMediaUrl = (url: string) => {
      if (!url) return '';
      if (/^https?:\/\//i.test(url)) return url;
      const base = process.env.NEXT_PUBLIC_API_URL || '';
      const normalized = url.startsWith('/') ? url : `/${url}`;
      const fullUrl = `${base}${normalized}`;
      return fullUrl;
    };

    // Extract all media (images, videos, documents)
    const extractMedia = () => {
      const media = [];

      // Add images - use the transformed 'url' property from the API response
      if (newProject.images && newProject.images.length) {
        newProject.images.forEach((img: any) => {
          // Use the 'url' property if available, otherwise fallback to 'images'
          const imageUrl = img.url || img.images || '';
          if (imageUrl) {
            media.push({
              type: 'image' as const,
              url: imageUrl,
              name: img.name || `Image ${img.id}`
            });
          }
        });
      }

      // Add videos if they exist in the data
      // Check if videos field exists and has items
      const hasVideoData = newProject.videos && newProject.videos.length > 0;
      if (hasVideoData) {
        newProject.videos.forEach((vid: any) => {
          const videoUrl = vid.video_url || vid.videos || vid.url || '';
          if (videoUrl) {
            media.push({
              type: 'video' as const,
              url: videoUrl,
              name: vid.name || `Video ${vid.id}`
            });
          }
        });
      }

      // Add documents/PDFs if they exist
      const hasDocumentData = newProject.documents && newProject.documents.length > 0;
      if (hasDocumentData) {
        newProject.documents.forEach((doc: any) => {
          const docUrl = doc.file_url || doc.url || '';
          if (docUrl) {
            media.push({
              type: 'document' as const,
              url: docUrl,
              name: doc.name || `Document ${doc.id}`
            });
          }
        });
      }

      // If no media items found, return empty array
      return media;
    };

    const mediaItems = extractMedia();
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT SIDE — MAIN DETAILS */}
            <div className="lg:col-span-2 space-y-8">

                {/* TITLE */}
                <div className="bg-white p-6 rounded-lg shadow"> 
                    <h1 className="text-2xl font-bold text-gray-900">{newProject.nproj_name}</h1>
                    <p className="text-gray-500 mt-1">{newProject.nproj_main_type} </p>
                    <p className="text-gray-500 mt-1">{newProject.full_area} m²</p>
                    <p className="text-gray-500 mt-1">{newProject.city?.city_name}-{newProject.district}</p>
                </div>


                <hr className="text-gray-300"></hr>

                {/* DESCRIPTION */}
                <h2 className="text-2xl font-semibold mb-2">Description</h2>
                <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-700 leading-relaxed">
                        {newProject.description || "No description available."}
                    </p>
                </div>
                

                <hr className="text-gray-300"></hr>


                {/* Property details */}

                <h2 className="text-2xl font-semibold mb-2">New Project details</h2>
                <div className="bg-white p-6 rounded-lg shadow">
                    
                    <div className="w-full">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px]">
                                <tbody>
                                    <tr >
                                        <td className="text-sm md:text-base flex px-3 py-3 md:py-4 font-normal text-gray-900"><BsBuildings className="text-2xl mr-3 font-light" />Property Type</td>
                                        <td className="px-3 py-4 text-sm md:text-base text-gray-900 font-semibold">{newProject.nproj_main_type}</td>
                                    
                                        <td className="pl-4 md:pl-8 text-sm md:text-base flex px-3 py-3 md:py-4 font-normal text-gray-900"><RxDimensions className="text-2xl mr-3 font-light" />Property Size</td>
                                        <td className="px-3 py-4 text-sm md:text-base text-gray-900 font-semibold">{newProject.full_area} m²</td>
                                    </tr>
                                    <tr>
                                        <td className="text-sm md:text-base flex px-3 py-3 md:py-4 font-normal text-gray-900"><SlLocationPin  className="text-2xl mr-3 font-light" />City</td>
                                        <td className="px-3 py-4 text-sm md:text-base text-gray-900 font-semibold">{newProject.city.city_name}</td>
                                    
                                        <td className="pl-4 md:pl-8 text-sm md:text-base flex px-3 py-3 md:py-4 font-normal text-gray-900"><SlLocationPin  className="text-2xl mr-3 font-light" />Area</td>
                                        <td className="px-3 py-4 text-sm md:text-base text-gray-900 font-semibold">{newProject.full_area}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-sm md:text-base flex px-3 py-3 md:py-4 font-normal text-gray-900"><SlLocationPin  className="text-2xl mr-3 font-light" />District</td>
                                        <td className="px-3 py-4 text-sm md:text-base text-gray-900 font-semibold">{newProject.district}</td>
                                    </tr>
                                    <tr>
                                        <td className="pl-4 md:pl-8 text-sm md:text-base flex px-3 py-3 md:py-4 font-normal text-gray-900"><MdOutlineEventAvailable className="text-2xl mr-3 font-light" />Available from</td>
                                        <td className="px-3 py-4 text-sm md:text-base text-gray-900 font-semibold">{newProject.created_at}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div> 
                    </div>
                </div>

                <hr className="text-gray-300"></hr>

            

                {/* AMENITIES */}
                <h2 className="text-2xl font-semibold mb-2">Amenities</h2>
                <div className="bg-white p-6 rounded-lg shadow">
                {newProject.amenities && newProject.amenities.length > 0 ? (
                    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {newProject.amenities.map((item) => (
                        <li
                            key={item.id}
                            className="flex items-center gap-2 text-gray-700 p-2"
                        >
                                {/* ICON */}
                                {amenityIcons[item.amenity_name] ?? (
                                    <span className="text-lg">•</span> // fallback icon
                                )}

                                {/* TEXT */}
                                <span>{item.amenity_name}</span>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No amenities listed.</p>
                )}
                </div>


                <hr className="text-gray-300"></hr>

                <h2 className="text-2xl font-semibold mb-2">Location</h2>
                <div className="bg-white p-6 rounded-lg shadow">
                    <p className="text-gray-700">
                        {newProject.address_detail || "No location available."}
                    </p>  
                </div>
                <p className="text-gray-500 text-sm font-light"> * Address as per title deed</p>
                       
                
                <hr className="text-gray-300"></hr>
                

                {/* map-preview */}
                <div className="mb-10 relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden">
                    <Image
                        fill
                        src="/map-preview.jpg"
                        alt="map preview"
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    />
                    {/* absolute position card */}
                    <Link
                    href={`https://www.google.com/maps?q=${newProject.latitude},${newProject.longitude}`}
                    target="_blank"
                    >
                    <div className="z-50 absolute bottom-4 left-4 md:bottom-6 md:left-8 bg-white rounded-xl shadow-lg p-3 md:p-4 max-w-[280px] md:max-w-[320px]">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div className="flex items-center font-semibold text-sm md:text-base">
                               <span><GrLocation className="mr-2 font-light text-xl md:text-2xl"/></span>{newProject.district}, {newProject.full_area}, {newProject.city.city_name}
                            </div>
                            <div className="flex items-center hover:bg-indigo-100 p-2 rounded text-[#3c3280] font-semibold text-sm md:text-base whitespace-nowrap">
                                view on map<span className="ml-2">  <GoArrowRight /></span>
                            </div>
                        </div>
                    </div>
                    </Link>
                </div>


                <hr className="text-gray-300"></hr>

                {/* MEDIA GALLERY */}
                <h2 className="text-2xl font-semibold mb-2">Media Gallery</h2>
                <div className="bg-white p-6 rounded-lg shadow">
                  {mediaItems.length === 0 ? (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                      No media available
                    </div>
                  ) : (
                    <>
                      <div className="relative mb-4">
                        {/* Main media display */}
                        <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
                          {mediaItems[currentIndex]?.type === 'image' && (
                            <Image
                              src={getMediaUrl(mediaItems[currentIndex].url)}
                              alt={mediaItems[currentIndex].name || `Media ${currentIndex + 1}`}
                              fill
                              className="object-cover w-full h-full"
                            />
                          )}
                          {mediaItems[currentIndex]?.type === 'video' && (
                            <video
                              src={getMediaUrl(mediaItems[currentIndex].url)}
                              controls
                              autoPlay
                              muted
                              loop
                              className="w-full h-full object-cover"
                            >
                              Your browser does not support the video tag.
                            </video>
                          )}
                          {mediaItems[currentIndex]?.type === 'document' && (
                            <div className="flex flex-col items-center justify-center w-full h-full bg-gray-50">
                              <HiOutlineDocumentText className="w-12 h-12 text-indigo-600 mb-2" />
                              <p className="text-sm text-gray-600">{mediaItems[currentIndex].name || 'Document'}</p>
                              <a
                                href={getMediaUrl(mediaItems[currentIndex].url)}
                                download
                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                              >
                                <Download className="w-4 h-4 mr-2" /> Download File
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Navigation dots/thumbnails */}
                        {mediaItems.length > 1 && (
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                            {mediaItems.map((item, index) => (
                              <div
                                key={index}
                                className={`w-3 h-3 rounded-full ${
                                  index === currentIndex
                                    ? 'bg-white border-2 border-blue-500'
                                    : 'bg-gray-400/50 hover:bg-gray-300'
                                } cursor-pointer`}
                                onClick={() => setCurrentIndex(index)}
                              />
                            ))}
                          </div>
                        )}

                        {/* Navigation arrows */}
                        {mediaItems.length > 1 && (
                          <>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
                              }}
                              className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full z-10"
                            >
                              <ChevronLeft size={18} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
                              }}
                              className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full z-10"
                            >
                              <ChevronRight size={18} />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Media info */}
                      <div className="mt-4 text-center text-sm text-gray-600">
                        {mediaItems[currentIndex]?.type === 'document' && (
                          <>
                            <p>
                              <strong>{mediaItems[currentIndex].name}</strong>
                            </p>
                            <p className="mt-1">
                              <a
                                href={getMediaUrl(mediaItems[currentIndex].url)}
                                download
                                className="text-blue-600 hover:text-blue-800 underline"
                              >
                                <Download className="mr-2" /> Download PDF/Document
                              </a>
                            </p>
                          </>
                        )}
                        {mediaItems[currentIndex]?.type === 'image' && (
                          <p>
                            Image {currentIndex + 1} of {mediaItems.length}
                          </p>
                        )}
                        {mediaItems[currentIndex]?.type === 'video' && (
                          <p>
                            Video {currentIndex + 1} of {mediaItems.length}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <hr className="text-gray-300"></hr>

                {/* PDF Download Section */}
                <div className="text-center mt-6">
                    <a
                        href={`/property/download-pdf?projectId=${newProject.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                        <Download size={18} /> Download Full Project Details (PDF)
                    </a>
                </div>

                <h2 className="text-2xl font-semibold mb-2">Provided by</h2>

                <div className="p-6 flex flex-col items-center gap-6 bg-gray-200 mb-10 max-w-2xl mx-auto rounded-xl">
                    <div className="flex flex-col items-center text-center">
                        {newProject.user.profile?.profile_picture && (
                                      <Image
                                        src={imageURL}
                                        alt="Agent photo"
                                        width={80}
                                        height={80}
                                        className="rounded-full object-cover"
                                      />
                        )}
                        <div className="flex flex-col items-center mt-3">
                            <div className="text-lg font-semibold text-gray-900">{newProject.user.first_name} {newProject.user.last_name}</div>
                            <div className="text-sm text-gray-600">{newProject.user.email}</div>
                        </div>
                    </div>
                    <Link
                        href={`/sa/owned-properties/${newProject.user.id}`}
                        className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        See owner properties
                    </Link>
                </div>

            </div>

        </div>
    );
}
