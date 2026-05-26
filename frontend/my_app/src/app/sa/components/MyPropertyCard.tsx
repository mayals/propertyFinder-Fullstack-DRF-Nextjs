"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CiLocationOn } from "react-icons/ci";
import { LiaBedSolid } from "react-icons/lia";
import { PiBathtub } from "react-icons/pi";
import { RxDimensions } from "react-icons/rx";
import { FiPhone, FiMail, FiHeart, FiShare2, FiMoreVertical, FiFlag, FiMessageCircle, FiCopy } from "react-icons/fi";
import { Copy, Share2, Flag } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../lib/axios";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { createPortal } from "react-dom";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import notify from "../common/useNotification";


export default function MyPropertyCard({ property }: any) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false); const [showDeleteModal, setShowDeleteModal] = useState(false);
  const countrySlug = process.env.NEXT_PUBLIC_COUNTRY_SLUG;
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % property.images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + property.images.length) % property.images.length);

  const handleTouchStart = (e: React.TouchEvent) => (touchStartX.current = e.changedTouches[0].screenX);
  const handleTouchMove = (e: React.TouchEvent) => (touchEndX.current = e.changedTouches[0].screenX);

  const router = useRouter()
  const [liked, setLiked] = useState(property.is_liked);


  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const deltaX = touchStartX.current - touchEndX.current;
      if (deltaX > 50) nextImage();
      else if (deltaX < -50) prevImage();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(
        `/property/delete-property/${property.id}/`,
        { withCredentials: true }
      );
      notify("Property deleted successfully", "success");
      router.push("/sa/my-properties");
    } catch (err: any) {
      notify("Failed to delete property", "error");
    } finally {
      setShowDeleteModal(false);
    }
  };


  // compute menu position when opened
  useEffect(() => {
    if (menuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 320;
      const menuHeight = 250;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      // right-align to button
      let left = rect.right - menuWidth;
      if (viewportWidth > 768) left -= 10; // shift left on desktop
      if (left < 8) left = 8;
      if (left + menuWidth > viewportWidth - 8) left = viewportWidth - menuWidth - 8;
      // top positioning
      let top = rect.bottom + 8;
      if (top + menuHeight > viewportHeight - 8) top = rect.top - menuHeight - 8;
      setMenuPos({ left, top });
    }
  }, [menuOpen]);

  const toggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    setLoading(true);
    setLiked((prev) => !prev);

    try {
        const response = await axiosInstance.post(
          `/property/property-like/${property.id}/like/`,
          { withCredentials:true },
        );
        setLiked(response.data.liked);
    } catch (err) {
        setLiked((prev) => !prev);
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  // Share functions
  const copyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/${countrySlug}/property/${property.id}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
    setMenuOpen(false);
  };

  const shareViaWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/${countrySlug}/property/${property.id}`;
    const text = `Check out this property: ${property.title}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank');
    setMenuOpen(false);
  };

  const shareViaEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/${countrySlug}/property/${property.id}`;
    const subject = `Property: ${property.title}`;
    const body = `Check out this property: ${url}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setMenuOpen(false);
  };

  const handleNativeShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property`,
          url: `${typeof window !== 'undefined' ? window.location.origin : ''}/${countrySlug}/property/${property.id}`,
        });
      } catch (err) {
        // User cancelled
      }
    }
    setMenuOpen(false);
  };

  // Portal content for the share menu - positioned near the button
  const shareMenuPortal = menuOpen ? createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2147483647,
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setMenuOpen(false);
      }}
    >
      {/* Backdrop - transparent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'transparent',
        }}
      />

      {/* Menu panel - positioned using a ref to the button */}
      <div
        ref={(el) => {
          if (el && menuOpen) {
            const button = document.querySelector(`[data-card-id="${property.id}"] .dots-button`);
            if (button) {
              const rect = button.getBoundingClientRect();
              // Position right-aligned to button, shifted left for visibility on desktop
              const menuWidth = 320;
              const viewportWidth = window.innerWidth;
              let left = rect.left - menuWidth + 32; // right-align to button area
              // Bounds check - keep menu in view
              if (left < 8) left = 8;
              if (left + menuWidth > viewportWidth - 8) left = viewportWidth - menuWidth - 8;
              el.style.position = 'fixed';
              el.style.left = `${left}px`;
              el.style.top = `${rect.bottom + 8}px`;
              el.style.zIndex = '2147483647';
            }
          }
        }}
        style={{
          position: 'fixed',
          width: '320px',
          maxWidth: 'calc(100vw - 16px)',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
          border: '1px solid #e5e7eb',
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <p style={{ padding: '12px 16px', fontSize: '14px', color: '#6b7280', fontWeight: 500, borderBottom: '1px solid #f3f4f6' }}>Share property</p>

        {/* Copy Link */}
        <button
          onClick={copyLink}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            transition: 'background-color 0.2s',
            textAlign: 'left',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Copy size={18} style={{ color: '#374151' }} />
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>Copy link</p>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>Copy property link to clipboard</p>
          </div>
        </button>

        {/* WhatsApp */}
        <button
          onClick={shareViaWhatsApp}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            transition: 'background-color 0.2s',
            textAlign: 'left',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiMessageCircle size={18} style={{ color: '#16a34a' }} />
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>WhatsApp</p>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>Share via WhatsApp</p>
          </div>
        </button>

        {/* Email */}
        <button
          onClick={shareViaEmail}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            transition: 'background-color 0.2s',
            textAlign: 'left',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiMail size={18} style={{ color: '#2563eb' }} />
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>Email</p>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>Share via email</p>
          </div>
        </button>

        {/* Native Share (Mobile) */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              transition: 'background-color 0.2s',
              textAlign: 'left',
              borderTop: '1px solid #f3f4f6',
              marginTop: '8px',
              paddingTop: '16px',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Share2 size={18} style={{ color: '#374151' }} />
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>More options</p>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>Open native share menu</p>
            </div>
          </button>
        )}
      </div>
    </div>,
    document.body
  ) : null;


  return (
    <div className="rounded-lg border border-gray-300 bg-white shadow-md transition-all hover:bg-[#f3f4f6]" data-card-id={property.id}>
      {/* Main card content - clickable to go to property detail */}
      <div
  className="rounded-lg border border-gray-300 bg-white shadow-md transition-all hover:bg-[#f3f4f6]"
  data-card-id={property.id}
  onClick={() => router.push(`/${countrySlug}/property/${property.id}`)}
>
        <div className="flex flex-col sm:flex-row">

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
              className="object-cover"
            />

            {property.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full z-10"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full z-10"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            {property.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
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
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{property.title}</h2>
                  <p className="text-gray-500 text-sm flex items-center gap-1">
                    <CiLocationOn /> {property?.district}, {property?.city?.city_name}
                  </p>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-700">
                    {property.owner.first_name|| "Property Owner"}
                  </span>

                  {property.owner.profile?.profile_picture && (
                    <Link
                        href={`/${countrySlug}/owned-properties/${property.owner.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                    >
                      <Image
                        src={`${apiURL}${property.owner.profile.profile_picture}`}
                        alt="Owner"
                        width={32}
                        height={32}
                        className="rounded-full mt-1"
                      />
                    </Link>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-gray-600 mt-3">
                <div className="flex items-center gap-1"><LiaBedSolid /> {property.bedrooms}</div>
                <div className="flex items-center gap-1"><PiBathtub /> {property.bathrooms}</div>
                <div className="flex items-center gap-1"><RxDimensions /> {property.property_size} sqm</div>
              </div>

              <div className="mt-3">
                <p className="text-2xl font-bold text-black">
                  {property.price} {property.currency || "SAR"}
                </p>
                <p className="text-sm text-gray-500">{property.psub_type.subtype_name}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer - OUTSIDE the Link so buttons work correctly */}
      <div className="bg-[#e5e7eb] text-gray-500 text-xs px-3 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span>
          Listed {property?.available_from
            ? formatDistanceToNow(new Date(property.available_from), {
                addSuffix: true,
              })
            : "—"}
        </span>

        <div className="flex gap-2 text-sm items-center flex-wrap">
          {/* EDIT */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/sa/property/${property.id}/edit`);
            }}
            className="bg-white text-green-400 border border-green-400 rounded-md flex items-center gap-1 py-1 px-2 hover:bg-green-50 transition cursor-pointer"
          >
            <RiEdit2Fill  size={14} /> Edit
          </button>

          {/* DELETE */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowDeleteModal(true);
            }}
            style={{ cursor: 'pointer' }} className="bg-white text-red-500 border border-red-500 rounded-md flex items-center gap-1 py-1 px-2 hover:bg-red-50 transition cursor-pointer pointer-events-auto"
          >
            <MdDeleteForever size={14} /> Delete
          </button>



          {/* CALL */}
          {/* <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const phone = property.owner?.profile?.phone_number;
              if (phone) window.location.href = `tel:${phone}`;
            }}
            className="bg-white text-[#5842f6] border border-[#5842f6] rounded-md flex items-center gap-1 py-1 px-2 hover:bg-blue-50 transition"
          >
            <FiPhone size={14} /> Call
          </button> */}

          {/* EMAIL */}
          {/* <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const email = property.owner?.email;
              if (email) window.location.href = `mailto:${email}`;
            }}
            className="bg-white text-[#5842f6] border border-[#5842f6] rounded-md flex items-center gap-1 py-1 px-2 hover:bg-blue-50 transition"
          >
            <FiMail size={14} /> Email
          </button> */}

          {/* WHATSAPP */}
          {/* <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const phone = property.owner?.profile?.phone_number;
              if (phone) window.open(`https://wa.me/${phone}`, '_blank');
            }}
            className="bg-white text-[#5842f6] border border-[#5842f6] rounded-md flex items-center gap-1 py-1 px-2 hover:bg-blue-50 transition"
          >
            <FiMessageCircle size={14} /> WhatsApp
          </button>

          <span className="text-gray-500">|</span> */}

          {/* LIKE */}
          {/* {user && (
            <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleLike(e);
                }}
                className={`transition-colors ${liked ? "text-green-500" : "text-gray-400"}`}
            >
              <FiHeart size={16} fill={liked ? "currentColor" : "none"} />
            </button>
          )} */}

          {/* DOTS MENU */}
          <div className="relative">
            <button
              className="bg-white text-[#5842f6] border border-[#5842f6] rounded-md flex items-center py-1 px-2 dots-button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
            >
              <FiMoreVertical className="text-[#5842f6]" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Render share menu via portal at document.body level */}
      {shareMenuPortal}

      {/* Delete Confirmation Modal */}
      {showDeleteModal &&
        createPortal(
          <div
            className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/50"
            onClick={() => setShowDeleteModal(false)}
          >
            <div
              className="bg-white rounded-2xl p-6 w-11/12 max-w-sm mx-auto shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <MdDeleteForever className="mx-auto mb-3 h-10 w-10 text-red-500" />
              <h3 className="text-center text-lg font-bold mb-2">Delete Property?</h3>
              <p className="text-center text-gray-500 mb-6">
                Are you sure you want to delete <strong>&quot;{property.title}&quot;</strong>?
                <br />
                This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-5 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-5 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
