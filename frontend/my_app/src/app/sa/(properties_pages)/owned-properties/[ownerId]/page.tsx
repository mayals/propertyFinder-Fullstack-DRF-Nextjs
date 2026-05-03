// src/app/sa/(properties_pages)/owned-properties/[ownerId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import PropertyCard from "../../../components/PropertyCard";
import Loading from "../../../components/Loading";
import Footer from "../../../components/Footer";
import { Phone, Mail, MessageCircle, Share2, Check } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import notify from "../../../common/useNotification";

interface OwnerData {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
  full_name?: string;
  gender?: string;
  profile?: {
    profile_picture?: string;
    phone_number?: string | null;
    address?: string | null;
    country?: string | null;
  };
}

export default function OwnerPropertiesPage() {
  const { user } = useAuth();
  const params = useParams();
  const ownerId = params.ownerId as string;
  const [properties, setProperties] = useState<any[]>([]);
  const [ownerData, setOwnerData] = useState<OwnerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [isShared, setIsShared] = useState(false);

  // State for sharing content
  const [shareContent, setShareContent] = useState({
    url: '',
    formattedText: '',
    ownerName: ''
  });

  // Helper to build absolute URLs for images
  const getImageUrl = (path: string | undefined | null): string | null => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    return `${apiUrl}${cleanPath}`;
  };

  useEffect(() => {
    async function fetchOwnerProperties() {
      try {
        // Fetch from Django backend API
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/property/owner-properties/${ownerId}/share`;
        const res = await fetch(apiUrl, {
          credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to fetch share data');

        const data = await res.json();
        console.log('Share data received:', data);

        setProperties(data.properties || []);

        if (data.owner) {
          setOwnerData({
            full_name: data.owner.full_name,
            email: data.owner.email,
            role: data.owner.role,
            profile: data.owner.profile || {}
          });
        }

        // Generate share link locally using frontend URL
        const shareLink = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/sa/owned-properties/${ownerId}/`;

        setShareContent({
          url: shareLink,
          formattedText: data.formatted_share_text || '',
          ownerName: data.owner?.full_name || 'Owner'
        });

      } catch (err) {
        console.error('Failed to fetch properties:', err);
      } finally {
        setLoading(false);
      }
    }

    if (ownerId) {
      fetchOwnerProperties();
    }
  }, [ownerId]);

  const handleShare = async () => {
    setIsSharing(true);
    setIsShared(false);

    try {
      const { formattedText, url } = shareContent;

      if (!formattedText || !url) {
        throw new Error('Share data not available');
      }

      await navigator.clipboard.writeText(formattedText);
      setIsShared(true);
      notify("Properties copied to clipboard!", "success");

      if (navigator.share) {
        try {
          await navigator.share({
            title: `${shareContent.ownerName}'s Properties`,
            text: formattedText,
            url: url,
          });
        } catch (err) {
          console.log('Share dialog cancelled or failed');
        }
      }
    } catch (err) {
      console.error("Failed to share:", err);
      notify("Sharing failed. Please try again.", "error");
    } finally {
      setTimeout(() => {
        setIsSharing(false);
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="mt-20 text-center">
        <Loading />
      </div>
    );
  }

  return (
    <section>
      <main className="container mx-auto mt-5 px-4 py-10">
        <div className="p-6 flex flex-col md:flex-row items-center justify-center gap-6 bg-white mb-5 mx-auto max-w-4xl">
          <div className="flex items-center">
            {ownerData?.profile?.profile_picture ? (
              <Image
                src={getImageUrl(ownerData.profile.profile_picture) || '/placeholder-avatar.jpg'}
                alt="Owner photo"
                width={150}
                height={150}
                className="rounded-full object-cover"
                onError={(e) => {
                  console.log('Image load error:', e);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-[150px] h-[150px] rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                No Photo
              </div>
            )}
          </div>
          <div className="ml-2 flex flex-col">
            <p className="text-xl text-gray-900 font-bold">{ownerData?.full_name} [{ownerData?.role}]</p>
            <p>({properties.length}) properties</p>
            <p className="text-lg text-gray-600">Address: {ownerData?.profile?.address}-{ownerData?.profile?.country}</p>
          </div>
          <div className="mt-4 w-full space-y-3">
            {/* CALL + WHATSAPP SIDE BY SIDE */}
            <div className="flex gap-2 w-full">
              {/* CALL */}
              <a
                href={`tel:${ownerData?.profile?.phone_number || ""}`}
                className="flex-1 flex items-center justify-center gap-1 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <Phone size={18} />
                Call
              </a>

              {/* WHATSAPP */}
              <a
                href={`https://wa.me/${ownerData?.profile?.phone_number || ""}`}
                className="flex-1 flex items-center justify-center gap-1 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
            </div>
            <div className="flex gap-2 w-full">
              {/* EMAIL */}
              <a
                href={`mailto:${ownerData?.email || ""}`}
                className="flex items-center justify-center gap-1 w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                <Mail size={18} />
                Email
              </a>
              <button
                onClick={handleShare}
                disabled={isSharing || !shareContent.formattedText}
                className="flex items-center justify-center gap-1 w-full py-2 text-white border border-gray-300 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {isSharing && (
                  <span className="inline-flex items-center">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="ml-1">Sharing...</span>
                  </span>
                )}
                {!isSharing && isShared && (
                  <>
                    <Check size={18} className="text-green-400" />
                    <span className="ml-1">Shared!</span>
                  </>
                )}
                {!isSharing && !isShared && (
                  <>
                    <Share2 size={18} />
                    <span className="ml-1">Share Properties</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {properties.length === 0 ? (
          <p className="text-center py-10 text-gray-600">No properties found for the owner <b>{ownerData?.full_name}</b>.</p>
        ) : (
          <div className="flex flex-col gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {/* Share Content Display */}
        {shareContent.formattedText && (
          <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Share Content Preview</h3>
            <div className="bg-white p-4 rounded-lg border border-gray-300 mb-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {shareContent.formattedText}
              </pre>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareContent.formattedText);
                  notify("Copied to clipboard!", "success");
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Copy Share Text
              </button>
              <a
                href={shareContent.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
              >
                View Share Link
              </a>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </section>
  );
}
