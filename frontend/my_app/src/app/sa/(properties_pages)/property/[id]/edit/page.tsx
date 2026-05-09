"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "../../../../lib/axios";
import notify from "../../../../common/useNotification";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { ArrowLeft } from "lucide-react";
import Loading from "../../../../components/Loading";

import { ToastContainer } from "react-toastify";


interface PropertyFormData {
  title: string;
  description: string;
  area: string;
  district: string;
  plot_number: string;
  land_number: string;
  address_detail: string;
  currency: string;
  facade: string;
  furnishing: string;
  is_occupied: string;
  bedrooms: string;
  bathrooms: string;
  property_age: string;
  latitude: string;
  longitude: string;
  property_size: string;
  plot_length: string;
  plot_width: string;
  street_width: string;
  price: string;
  available_from: string;
  country_id: string;
  city_id: string;
  pmain_type_id: string;
  psub_type_id: string;
  purpose_id: string;
  amenities_ids: string[];
  [key: string]: any;
}

export default function EditPropertyPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [property, setProperty] = useState<PropertyFormData | null>(null);
  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [mainTypes, setMainTypes] = useState<any[]>([]);
  const [subTypes, setSubTypes] = useState<any[]>([]);
  const [purposes, setPurposes] = useState<any[]>([]);
  const [amenities, setAmenities] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedMainType, setSelectedMainType] = useState("");
  const [selectedSubType, setSelectedSubType] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const apiURL = process.env.NEXT_PUBLIC_API_URL || "";
  const countrySlug = process.env.NEXT_PUBLIC_COUNTRY_SLUG || "";

  useEffect(() => {
    if (!id) return;
    fetchProperty();
  }, [id]);

  useEffect(() => {
    fetchCountries();
    fetchMainTypes();
    fetchPurposes();
    fetchAmenities();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
        console.log("if Selected country=", selectedCountry);
        const countryObj = countries.find((c) => String(c.id) === String(selectedCountry));
        const slug = countryObj?.country_slug;
        if (slug) {
          fetchCities(slug);
        } else {
          console.error('Country slug not found for id', selectedCountry);
        }
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedMainType) {
      fetchSubTypes(selectedMainType);
    }
  }, [selectedMainType]);

  const fetchProperty = async () => {
    try {
      const res = await axiosInstance.get(`/property/property-details-${id}/`, {
        withCredentials: true,
      });
      const data = res.data;
      console.log('Fetched property data:', data);
      setProperty({
        title: data.title || "",
        description: data.description || "",
        area: data.area || "",
        district: data.district || "",
        plot_number: data.plot_number || "",
        land_number: data.land_number || "",
        address_detail: data.address_detail || "",
        currency: data.currency || "",
        facade: data.facade || "",
        furnishing: data.furnishing || "",
        is_occupied: data.is_occupied ? "true" : "false",
        bedrooms: data.bedrooms || "",
        bathrooms: data.bathrooms || "",
        property_age: data.property_age || "",
        latitude: data.latitude || "",
        longitude: data.longitude || "",
        property_size: data.property_size || "",
        plot_length: data.plot_length || "",
        plot_width: data.plot_width || "",
        street_width: data.street_width || "",
        price: data.price || "",
        available_from: data.available_from || "",
        country_id: data.country?.id || "",
        city_id: data.city?.id || "",
        pmain_type_id: data.pmain_type?.id || "",
        psub_type_id: data.psub_type?.id || "",
        purpose_id: data.purpose?.id || "",
        amenities_ids: (data.amenities || []).map((a: any) => a.id),
      });

      if (data.country?.id) {
        setSelectedCountry(data.country.id);
        // Use country slug directly for city fetch
        const countrySlug = data.country.country_slug || data.country.id;
        await fetchCities(countrySlug);
        if (data.city?.id) setSelectedCity(String(data.city.id));
      }
      if (data.pmain_type?.id) {
        setSelectedMainType(data.pmain_type.id);
        await fetchSubTypes(data.pmain_type.id);
        if (data.psub_type?.id) setSelectedSubType(data.psub_type.id);
      }
      if (data.purpose?.id) setSelectedPurpose(data.purpose.id);
      if (data.amenities?.length) {
        setSelectedAmenities(data.amenities.map((a: any) => a.id));
      }
    } catch (err: any) {
      notify("Failed to load property details", "error");
      router.push("/sa/my-properties");
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const res = await axiosInstance.get("/property/list-country/");
      const countryData = res.data || [];
      setCountries(countryData);
      console.log('Fetched countries:', countryData);
      if (!selectedCountry && countryData.length > 0) {
        const firstId = countryData[0].id;
        setSelectedCountry(firstId);
        setProperty(prev => ({ ...prev, country_id: firstId, city_id: "" }));
        fetchCities(firstId);
      }
    } catch {
      setCountries([]);
    }
    return;
  };
  // fetchCountries implementation is defined above

  const fetchMainTypes = async () => {
    try {
      const res = await axiosInstance.get("/property/list-main-type/");
      setMainTypes(res.data || []);
      console.log('Fetched main types:', res.data);
    } catch {
      setMainTypes([]);
    }
  };

  const fetchPurposes = async () => {
    try {
      const res = await axiosInstance.get("/property/list-purposes/");
      setPurposes(res.data || []);
    } catch {
      setPurposes([]);
    }
  };

  const fetchAmenities = async () => {
    try {
      const res = await axiosInstance.get("/property/list-amenity/");
      setAmenities(res.data || []);
    } catch {
      setAmenities([]);
    }
  };

  const fetchCities = async (countryIdentifier: string) => {
    // Resolve slug from countries list; fallback to identifier if slug not found
    const countryObj = countries.find((c) => String(c.id) === String(countryIdentifier));
    const slug = countryObj?.country_slug || countryIdentifier;
    try {
      const res = await axiosInstance.get(`/property/${slug}/cities/`);
      const cityData = res.data || [];
      console.log('Fetched cities for country identifier', countryIdentifier, 'using slug', slug, cityData);
      setCities(cityData);
      if (!selectedCity && cityData.length) {
        setSelectedCity(String(cityData[0].id));
      }
    } catch (e) {
      console.error('Error fetching cities', e);
      setCities([]);
    }
  };

  const fetchSubTypes = async (mainTypeId: string) => {
    try {
      const res = await axiosInstance.get(
        `/property/${mainTypeId}/sub-types/`
      );
      setSubTypes(res.data || []);
    } catch {
      setSubTypes([]);
    }
  };

  const handleSave = async () => {
    if (!property) return;
    setSaving(true);
    try {
      const formData = new FormData();
      Object.keys(property).forEach((key) => {
        if (key === "amenities_ids") {
          selectedAmenities.forEach((id) =>
            formData.append("amenities_ids", id)
          );
        } else {
          formData.append(key, (property as any)[key] || "");
        }
      });

      const res = await axiosInstance.put(
        `/property/update-property/${id}/`,
        formData,
        { withCredentials: true }
      );
      notify("Property updated successfully!", "success");
    } catch (err: any) {
      notify("Failed to update property", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(
        `/property/delete-property/${id}/`,
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loading />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Property not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li className="inline-flex items-center">
              <a
                href="/"
                className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
                Home
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="rtl:rotate-180 w-3 h-3 text-slate-400 mx-1"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <a
                  href="/sa/my-dashboard"
                  className="ml-1 text-sm font-medium text-slate-600 hover:text-indigo-600 md:ml-2 transition-colors"
                >
                  My Dashboard
                </a>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg
                  className="rtl:rotate-180 w-3 h-3 text-slate-400 mx-1"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <span className="ml-1 text-sm font-medium text-indigo-600 md:ml-2">
                  Edit Property
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 bg-white text-red-500 border border-red-500 rounded-xl px-5 py-2.5 hover:bg-red-50 transition cursor-pointer"
            >
              <MdDeleteForever size={18} />
              Delete
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 transition ${
                saving
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white"
              }`}
            >
              <CiEdit size={18} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 px-8 py-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Edit Property
            </h1>
            <p className="text-indigo-100 mt-1 text-sm">
              Update the property details below
            </p>
          </div>

          <form className="p-6 md:p-8 space-y-8">
            <ToastContainer position="top-center" autoClose={3000} />

            {/* Basic Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Basic Information
                </h2>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  value={property.title}
                  onChange={(e) =>
                    setProperty({ ...property, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                  placeholder="Enter property title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={property.description}
                  onChange={(e) =>
                    setProperty({ ...property, description: e.target.value })
                  }
                  rows={6}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400 resize-y min-h-[150px]"
                  placeholder="Describe your property in detail..."
                />
              </div>

              {/* Main Type & Sub Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Main Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedMainType}
                    onChange={(e) => {
                      setSelectedMainType(e.target.value);
                      setSelectedSubType("");
                      setProperty({
                        ...property,
                        pmain_type_id: e.target.value,
                        psub_type_id: "",
                      });
                    }}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 appearance-none cursor-pointer"
                  >
                    <option value="">Select a Main Type</option>
                    {mainTypes.map((mt) => (
                      <option key={mt.id} value={mt.id}>
                        {mt.maintype_label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Sub Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedSubType}
                    onChange={(e) => {
                      setSelectedSubType(e.target.value);
                      setProperty({
                        ...property,
                        psub_type_id: e.target.value,
                      });
                    }}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 appearance-none cursor-pointer"
                  >
                    <option value="">Select a Sub Type</option>
                    {subTypes.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.subtype_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Purpose <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedPurpose}
                  onChange={(e) => {
                    setSelectedPurpose(e.target.value);
                    setProperty({ ...property, purpose_id: e.target.value });
                  }}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 appearance-none cursor-pointer"
                >
                  <option value="">Select Purpose</option>
                  {purposes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.purpose_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Location Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Location Details
                </h2>
              </div>

              {/* Country & City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      setSelectedCity("");
                      setProperty({
                        ...property,
                        country_id: e.target.value,
                        city_id: "",
                      });
                    }}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 appearance-none cursor-pointer"
                  >
                    <option value="">Select a Country</option>
                    {countries.map((co) => (
                      <option key={co.id} value={co.id}>
                        {co.country_name} ({co.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    City <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => {
                      setSelectedCity(e.target.value);
                      setProperty({
                        ...property,
                        city_id: e.target.value,
                      });
                    }}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 appearance-none cursor-pointer"
                  >
                    <option value="">Select City</option>
                    {cities.map((ci) => (
                      <option key={ci.id} value={ci.id}>
                        {ci.city_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Area & District */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Area <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="area"
                    value={property.area}
                    onChange={(e) =>
                      setProperty({ ...property, area: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                    placeholder="Enter area"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    District <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="district"
                    value={property.district}
                    onChange={(e) =>
                      setProperty({ ...property, district: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                    placeholder="Enter district"
                  />
                </div>
              </div>

              {/* Plot Number & Land Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Plot Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="plotNumber"
                    value={property.plot_number}
                    onChange={(e) =>
                      setProperty({
                        ...property,
                        plot_number: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                    placeholder="Enter plot number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Land Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="landNumber"
                    value={property.land_number}
                    onChange={(e) =>
                      setProperty({
                        ...property,
                        land_number: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                    placeholder="Enter land number"
                  />
                </div>
              </div>

              {/* Address Detail */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Address Detail <span className="text-red-500">*</span>
                </label>
                <input
                  name="addressDetail"
                  value={property.address_detail}
                  onChange={(e) =>
                    setProperty({
                      ...property,
                      address_detail: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                  placeholder="Enter detailed address"
                />
              </div>

              {/* Latitude & Longitude */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Latitude <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="latitude"
                    value={property.latitude}
                    onChange={(e) =>
                      setProperty({
                        ...property,
                        latitude: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                    placeholder="Enter latitude"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Longitude <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="longitude"
                    value={property.longitude}
                    onChange={(e) =>
                      setProperty({
                        ...property,
                        longitude: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                    placeholder="Enter longitude"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Property Details Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-4 0h4"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Property Details
                </h2>
              </div>

              {/* Price & Currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="price"
                    value={property.price}
                    onChange={(e) =>
                      setProperty({ ...property, price: e.target.value })
                    }
                    type="number"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                    placeholder="Enter price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Currency <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="currency"
                    value={property.currency}
                    onChange={(e) =>
                      setProperty({ ...property, currency: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                    placeholder="e.g. SAR"
                  />
                </div>
              </div>

              {/* Property Age & Property Size */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Property Age (years){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="propertyAge"
                    value={property.property_age}
                    onChange={(e) =>
                      setProperty({ ...property, property_age: e.target.value })
                    }
                    type="number"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                    placeholder="Enter property age"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Property Size (sqm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="propertySize"
                    value={property.property_size}
                    onChange={(e) =>
                      setProperty({ ...property, property_size: e.target.value })
                    }
                    type="number"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                    placeholder="Enter property size"
                  />
                </div>
              </div>

              {/* Plot Length & Plot Width */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Plot Length (meters){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="plotLength"
                    value={property.plot_length}
                    onChange={(e) =>
                      setProperty({ ...property, plot_length: e.target.value })
                    }
                    type="number"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                    placeholder="Enter plot length"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Plot Width (meters){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="plotWidth"
                    value={property.plot_width}
                    onChange={(e) =>
                      setProperty({ ...property, plot_width: e.target.value })
                    }
                    type="number"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                    placeholder="Enter plot width"
                  />
                </div>
              </div>

              {/* Bedrooms & Bathrooms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Bedrooms <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="bedrooms"
                    value={property.bedrooms}
                    onChange={(e) =>
                      setProperty({ ...property, bedrooms: e.target.value })
                    }
                    type="number"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                    placeholder="Number of bedrooms"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Bathrooms <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="bathrooms"
                    value={property.bathrooms}
                    onChange={(e) =>
                      setProperty({ ...property, bathrooms: e.target.value })
                    }
                    type="number"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                    placeholder="Number of bathrooms"
                  />
                </div>
              </div>

              {/* Facade & Street Width */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Facade <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={property.facade}
                    onChange={(e) =>
                      setProperty({ ...property, facade: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 appearance-none cursor-pointer"
                  >
                    <option value="">Select Facade Direction</option>
                    <option value="north">North</option>
                    <option value="south">South</option>
                    <option value="east">East</option>
                    <option value="west">West</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Street Width (meters){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="streetWidth"
                    value={property.street_width}
                    onChange={(e) =>
                      setProperty({
                        ...property,
                        street_width: e.target.value,
                      })
                    }
                    type="number"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                    placeholder="Enter street width"
                  />
                </div>
              </div>

              {/* Furnishing & Is Occupied */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Furnishing <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={property.furnishing}
                    onChange={(e) =>
                      setProperty({ ...property, furnishing: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 appearance-none cursor-pointer"
                  >
                    <option value="">Select Furnishing</option>
                    <option value="furnished">Furnished</option>
                    <option value="unfurnished">Unfurnished</option>
                    <option value="partly">Partly Furnished</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Is Occupied? <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={property.is_occupied}
                    onChange={(e) =>
                      setProperty({
                        ...property,
                        is_occupied: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 appearance-none cursor-pointer"
                  >
                    <option value="">Select Occupancy</option>
                    <option value="true">Occupied</option>
                    <option value="false">Not Occupied</option>
                  </select>
                </div>
              </div>

              {/* Available From */}
              <div className="max-w-md">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Available From <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="availableFrom"
                  value={property.available_from}
                  onChange={(e) =>
                    setProperty({
                      ...property,
                      available_from: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900"
                />
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Amenities Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Amenities
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Select Amenities
                </label>
                <select
                  multiple
                  value={selectedAmenities}
                  onChange={(e) => {
                    const vals = Array.from(
                      e.target.selectedOptions,
                      (o) => o.value
                    );
                    setSelectedAmenities(vals);
                    setProperty({ ...property, amenities_ids: vals });
                  }}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 cursor-pointer min-h-[120px]"
                >
                  {amenities.map((amenity) => (
                    <option key={amenity.id} value={amenity.id}>
                      {amenity.amenity_name}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs text-slate-500">
                  Hold Ctrl (Cmd on Mac) to select multiple amenities
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ${
                  saving
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
                }`}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/50">
          <div
            className="bg-white rounded-2xl p-6 w-11/12 max-w-sm mx-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <MdDeleteForever className="mx-auto mb-3 h-10 w-10 text-red-500" />
            <h3 className="text-center text-lg font-bold mb-2">
              Delete Property?
            </h3>
            <p className="text-center text-gray-500 mb-6">
              Are you sure you want to delete{" "}
              <strong>&quot;{property.title}&quot;</strong>?
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
        </div>
      )}
    </div>
  );
}