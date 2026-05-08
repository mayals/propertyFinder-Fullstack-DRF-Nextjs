// src/app/sa/(properties_pages)/owned-properties/[ownerId]/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import PropertyCard from "../../../components/PropertyCard";
import Loading from "../../../components/Loading";
import Footer from "../../../components/Footer";
import { Phone, Mail, MessageCircle, Share2, Check, Copy, Link2 } from "lucide-react";
import Link from "next/link";
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
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  // Helper to build absolute URLs for images
  const getImageUrl = (path: string | undefined | null): string | null => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    return `${apiUrl}${cleanPath}`;
  };

  // Get current page URL for sharing
  const getPageUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return `http://localhost:3000/sa/owned-properties/${ownerId}/`;
  };

  // Get share message
  const getShareMessage = () => {
    const ownerName = ownerData?.full_name || 'Owner';
    const count = properties.length;
    return `Check out ${ownerName}'s ${count} propert${count !== 1 ? 'ies' : 'y'} on PropertyFinder`;
  };

  useEffect(() => {
    async function fetchOwnerProperties() {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/property/owner-properties/${ownerId}/share`;
        const res = await fetch(apiUrl, {
          credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to fetch share data');

        const data = await res.json();
        setProperties(data.properties || []);

        if (data.owner) {
          setOwnerData({
            full_name: data.owner.full_name,
            email: data.owner.email,
            role: data.owner.role,
            profile: data.owner.profile || {}
          });
        }
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

  // Close share menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShareMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getPageUrl());
      setLinkCopied(true);
      notify("Link copied to clipboard!", "success");
      setTimeout(() => {
        setLinkCopied(false);
        setShareMenuOpen(false);
      }, 2000);
    } catch (err) {
      notify("Failed to copy link", "error");
    }
  };

  const shareViaWhatsApp = () => {
    const url = getPageUrl();
    const text = getShareMessage();
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank');
    setShareMenuOpen(false);
  };

  const shareViaEmail = () => {
    const url = getPageUrl();
    const subject = `${ownerData?.full_name || 'Owner'}'s Properties`;
    const body = `${getShareMessage()}\n\n${url}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setShareMenuOpen(false);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${ownerData?.full_name || 'Owner'}'s Properties`,
          text: getShareMessage(),
          url: getPageUrl(),
        });
      } catch (err) {
        // User cancelled or share failed
      }
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
      <main className="container mx-auto mt-5 px-4 py-3">
        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-white mb-5 mx-auto max-w-4xl rounded-xl shadow-sm">
          <div className="flex items-center gap-6">
            {ownerData?.profile?.profile_picture ? (
              <Image
                src={getImageUrl(ownerData.profile.profile_picture) || '/placeholder-avatar.jpg'}
                alt="Owner photo"
                width={120}
                height={120}
                className="rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-[120px] h-[120px] rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                No Photo
              </div>
            )}
            <div className="flex flex-col">
              <p className="text-xl text-gray-900 font-bold">{ownerData?.full_name} <span className="text-gray-500 font-normal">[{ownerData?.role}]</span></p>
              <p className="text-gray-600">({properties.length}) {properties.length === 1 ? 'property' : 'properties'}</p>
              {ownerData?.profile?.address && (
                <p className="text-sm text-gray-500 mt-1">{ownerData.profile.address}{ownerData?.profile?.country ? `, ${ownerData.profile.country}` : ''}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {/* CALL */}
            <Link
              href={`tel:${ownerData?.profile?.phone_number || ""}`}
              className="flex items-center justify-center gap-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <Phone size={18} />
              <span className="hidden sm:inline">Call</span>
            </Link>

            {/* WHATSAPP */}
            <Link
              href={`https://wa.me/${ownerData?.profile?.phone_number || ""}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              <MessageCircle size={18} />
              <span className="hidden sm:inline">WhatsApp</span>
            </Link>

            {/* EMAIL */}
            <Link
              href={`mailto:${ownerData?.email || ""}`}
              className="flex items-center justify-center gap-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              <Mail size={18} />
              <span className="hidden sm:inline">Email</span>
            </Link>

            {/* SHARE BUTTON WITH DROPDOWN */}
            <div className="relative" ref={shareMenuRef}>
              <button
                onClick={() => setShareMenuOpen(!shareMenuOpen)}
                className="flex items-center justify-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <Share2 size={18} />
                <span className="hidden sm:inline">Share</span>
              </button>

              {/* Share Menu - Instagram/Facebook Style */}
              {shareMenuOpen && (
                <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <p className="px-4 py-2 text-sm text-gray-500 font-medium">Share this page</p>

                  {/* Copy Link */}
                  <button
                    onClick={copyLink}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Copy size={18} className="text-gray-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {linkCopied ? 'Copied!' : 'Copy link'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {linkCopied ? 'Link copied to clipboard' : 'Copy page link to clipboard'}
                      </p>
                    </div>
                    {linkCopied && <Check size={16} className="text-green-500 ml-auto" />}
                  </button>

                  {/* WhatsApp */}
                  <button
                    onClick={shareViaWhatsApp}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <MessageCircle size={18} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">WhatsApp</p>
                      <p className="text-xs text-gray-500">Share via WhatsApp</p>
                    </div>
                  </button>

                  {/* Email */}
                  <button
                    onClick={shareViaEmail}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Mail size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-xs text-gray-500">Share via email</p>
                    </div>
                  </button>

                  {/* Native Share (Mobile) */}
                  {typeof navigator !== 'undefined' && 'share' in navigator && (
                    <button
                      onClick={handleNativeShare}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left border-t border-gray-100 mt-2 pt-4"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Share2 size={18} className="text-gray-700" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">More options</p>
                        <p className="text-xs text-gray-500">Open native share menu</p>
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {properties.length === 0 ? (
          <div className="text-center mt-10 p-8 bg-white rounded-lg shadow mx-5">
              <p className="text-gray-600">
                  No properties found for the owner <b> {ownerData?.full_name}</b>.
              </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </section>
  );
}
