"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Building2, TrendingUp, MapPin, Home, ArrowRight, Calendar, Tally5, Wallet } from "lucide-react";
import axios from "axios";
import notify from "../../common/useNotification";
import { getYear } from "date-fns";


interface user {
    id: string;
    first_name: string;
    last_name: string;
    profile?: {
        developer_name: string;
    };
}


interface City {
    id: string;
    city_name: string;
}
interface NewProject {
    id: string;
    user: user;
    images: {id: number; images: string;}[];
    nproj_name: string;
    developer: string;
    description: string;
    nproj_main_type: string;
    nproj_main_type_slug: string;
    lunch_price: number;
    currency: string;
    country: string;
    city: City;
    district: string;
    image: string;
    status: string;
    completion: string;
    units: string;
    full_area: number;
    latitude: number;
    longitude: number;
    hand_over_year: number;
    hand_over_year_quarter: string;
    status_detail: string;
    amenities: string[];
    created_at: string;
    updated_at: string;
    is_published: boolean;
}

export default function NewProjectsPage() {
  const router = useRouter();
  const [newProjects, setNewProjects] = useState<NewProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = "http://127.0.0.1:8000";

  const [filterType, setFilterType] = useState<"all" | "residential" | "commercial" | "mixed_use">("all");

  const filteredNewProjects = Array.isArray(newProjects)
    ? filterType === "all"
      ? newProjects
      : newProjects.filter(np => np.nproj_main_type === filterType.replace('_', '_'))
    : [];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/property/list-new-projects/`,
          { withCredentials: true }
        );
        const results = response.data.results || [];
        const projectArray = Array.isArray(results) ? results : [results];
        setNewProjects(projectArray);;
        console.log("New projects fetched:", response.data);
      
      } catch (err: any) {
        console.log("Failed to fetch projects:", err);
        setError("Failed to load projects. Please try again.");
        notify("Failed to load projects", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Handed Over": return "bg-orange-500";
      case "Off Plan": return "bg-red-500";
      case "Launching Soon": return "bg-yellow-500";
      case "Completed":
      case "Ready to Move": return "bg-green-500";
      case "Under Construction": return "bg-amber-500";
      default: return "bg-blue-500";
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading projects...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Error Loading Projects</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header - Breadcrumb */}
        <div className="mb-8">
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
              <li className="inline-flex items-center">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="rtl:rotate-180 w-3 h-3 text-slate-400 mx-1" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-indigo-600 md:ml-2">New Projects</span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl px-8 py-10 text-center shadow-xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              New Projects
            </h1>
            <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
              Discover the latest residential and commercial developments. Find your future home or investment opportunity.
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 justify-center flex-wrap">
          {([
            { key: "all", label: "All Projects", icon: <Building2 className="w-4 h-4" /> },
            { key: "residential", label: "Residential", icon: <Home className="w-4 h-4" /> },
            { key: "commercial", label: "Commercial", icon: <TrendingUp className="w-4 h-4" /> },
            { key: "mixed_use", label: "Mixed Use", icon: <Building2 className="w-4 h-4" /> },
          ] as { key: string; label: string; icon: React.ReactNode }[]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterType(tab.key as "all" | "residential" | "commercial" | "mixed_use")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                filterType === tab.key
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-indigo-300"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <h2 className="text-xl  mb-6">
            New Propjects ({filteredNewProjects.length})
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNewProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border border-slate-100"
            >
              {/* Project Image */}
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={project.images && project.images.length ? `${project.images[0].images}` : 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d'}
                  alt={project.nproj_name || 'Project Image'}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(project.status_detail)}`}>
                    {project.status_detail}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-700">
                    {project.nproj_main_type}
                  </span>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                  {project.nproj_name}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-sm">{project.city?.city_name || 'N/A'}{project.district ? `, ${project.district}` : ""}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-sm">
                      {project.user.profile?.developer_name || `${project.user?.first_name} ${project.user?.last_name}` || 'N/A'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center justify-center mb-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-500">Completion</p>
                    <p className="text-sm font-semibold text-slate-700 capitalize">{project.hand_over_year ? `${getYear(project.hand_over_year)} ${project.hand_over_year_quarter}` : 'N/A'}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center justify-center mb-1">
                      <Tally5 className="w-3 h-3 text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-500">Units</p>
                    <p className="text-sm font-semibold text-slate-700">{project.units}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center justify-center mb-1">
                      <Wallet className="w-3 h-3 text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-500">Price</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {project.lunch_price?.toLocaleString()}{project.currency ? ` ${project.currency}` : ""}
                    </p>
                  </div>
                </div>

                <button className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2 group-hover:bg-indigo-700 shadow-md shadow-indigo-200">
                  View Project
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredNewProjects.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No projects found</h3>
            <p className="text-slate-500">No new projects found for this filter. Try selecting a different category.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl px-8 py-10 text-center shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Have a Project to List?</h2>
          <p className="text-indigo-100 mb-6 max-w-xl mx-auto">
            Partner with us to showcase your residential or commercial projects to thousands of potential buyers and tenants.
          </p>
          <Link
            href="/sa/register/developer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-indigo-700 rounded-xl font-semibold hover:bg-indigo-50 transition-colors shadow-lg"
          >
            Register as Developer
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
