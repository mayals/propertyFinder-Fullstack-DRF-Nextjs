"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { getYear } from "date-fns";
import notify from "../../common/useNotification";
import  { NewProject } from "../../types/property";
import { useAuth } from "../../context/AuthContext";
import { Building2, TrendingUp, MapPin, Home, ArrowRight, Calendar, Tally5, Wallet, Edit3, Trash2, Eye, Shield } from "lucide-react";
import Loading from "../../components/Loading";
import NewProjectCard from "../../components/NewProjectCard";







export default function NewProjectsPage() {
  const API_URL = "http://127.0.0.1:8000";
  const { user, loading, setLoading} = useAuth();
  const router = useRouter();
  const [newProjects, setNewProjects] = useState<NewProject[]>([]);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState<"all" | "residential" | "commercial" | "mixed_use">("all");



  // filtering by new project main type (residential, commercial, mixed use)
  const filteredNewProjects = Array.isArray(newProjects)? filterType === "all"
      ? newProjects
      : newProjects.filter(np => np.nproj_main_type === filterType.replace('_', '_'))
      : [];



  // API  //  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
          const response = await axios.get(
            `${API_URL}/property/list-new-projects/`, // endpoint to fetch new projects
            { withCredentials: true } // withCredentials is needed to send cookies for authentication
          );
          const results = response.data.results || [];
          const projectArray = Array.isArray(results) ? results : [results];
          setNewProjects(projectArray);;
          console.log("New projects fetched:", response.data);
        
      } catch (err: any) {
          console.log("Failed to fetch projects:", err);
          setError("Failed to load projects. Please try again.");
          notify("Failed to load projects", "error");
      };
    };
    fetchProjects();
  }, []);




  const getStatusColor = (status: string) => {
      // Normalize status (handles snake_case and space‑separated)
      const normalized = status.replace(/_/g, " ").toLowerCase();
      switch (normalized) {
        case "handed over":
          return "bg-orange-500";
        case "off plan":
          return "bg-red-500";
        case "launching soon":
          return "bg-yellow-500";
        case "completed":
        case "ready to move":
          return "bg-green-500";
        case "under construction":
          return "bg-amber-500";
        default:
          return "bg-blue-500";
      }
  };

  // check permission to editand delete the new project (only admin or the developer who created the project can edit or delete it) 
  const canEditProject = (project?: NewProject) => {
    if (!project) return false;
    return user && (
        user.role === 'admin' ||
        user.id === project.user.id
    );
  };

  const showForbiddenMessage = (message: string) => {
    notify(message, 'error');
  };

  const handleDeleteProject = async (projectId: string) => {
    const project = newProjects.find(p => p.id === projectId);
    if (!canEditProject(project)) {
      showForbiddenMessage('You don\'t have permission to delete this project');
      return;
    }

    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
          try {
              await axios.delete(
              `${API_URL}/property/new-projects/${projectId}/`,
                { withCredentials: true });
                notify('Project deleted successfully', 'success');
                // Remove the project from the list
                setNewProjects(prev => prev.filter(p => p.id !== projectId)); 
      
          } catch (err: any) {
                console.log('Failed to delete project:', err);
                notify('Failed to delete project', 'error');
      }
    }
  };


  // ⏳ Loading
  if (loading)
      return (
          <div className="text-center mt-20">
              <Loading />
          </div>
  );


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
        
        {/* Header - Breadcrumb - page title */}
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

        {/* Filter Tabs  according to main types all-residential-commercial-mixed_use*/}
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
            <NewProjectCard
                key={project.id}
                project={project}
                user={user}
                onDelete={handleDeleteProject}
            />
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
