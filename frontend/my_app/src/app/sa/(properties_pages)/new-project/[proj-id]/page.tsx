// app/newProject/[id]/page.tsx

"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // needed for extracting proj-id
import axiosInstance from "../../../lib/axios";
import { useParams } from "next/navigation";
import axios from "axios";
import { NewProject } from "../../../types/newProject";
// components
import NewProjectGallery from "../../../components/NewProjectGallery";
import NewProjectHeader from "../../../components/NewProjectHeader";
import NewProjectDetails from "../../../components/NewProjectDetails";
import Loading from "../../../components/Loading";
import Footer from "../../../components/Footer"

import { useAuth } from "../../../context/AuthContext";




export default function NewProjectPage() {
   const { user, loading, setLoading} = useAuth(); 
    const params = useParams();
        const id = params?.["proj-id"]; // UUID of the project // UUID of the project
        // console.log("PropertyPage-params=",params)
        // console.log("PropertyPage-id=",id)
    
    // const { id } = useParams<{ id: string }>(); // 👈  can use this way to get id from URL
   
    
    const countrySlug = process.env.NEXT_PUBLIC_COUNTRY_SLUG;
    const [newProject, setNewProject] = useState<NewProject | null>(null);
    const [loadingNewProject, setLoadingNewProject] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        let cancelled = false;
        

        //  🔹 Fetch newProject
        async function fetchProperty() {
            setError(null);
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/property/new-project-details-${id}/`,
                    { withCredentials: true }
                );


                const apiURL = process.env.NEXT_PUBLIC_API_URL;      // e.g., http://127.0.0.1:8000
                // 🔥 Transform images to match frontend type
                const transformedImages = res.data.images?.map((img: any) => ({
                    id: img.id,
                    url: typeof img.images === 'string' && img.images.startsWith('http') ? img.images : `${apiURL}${img.images}`,
                    alt: res.data.title || "newProject image"
                })) || [];

                const transformedProperty = {
                    ...res.data,
                    images: transformedImages
                };

                if (!cancelled) setNewProject(transformedProperty);

            } catch (err: any) {
                setError(err?.response?.data?.detail || err.message || 'Failed to load');
            }
        }
        fetchProperty();
        
        
        return () => { cancelled = true; };
    }, [id]);


    
    
    // ⏳ Loading
    if (loading || loadingNewProject)
        return (
            <div className="text-center mt-20">
                <Loading />
            </div>
        );


    if (error) 
        return (<div className="p-6 text-red-600">{error}</div>);
    
    if (!newProject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">New Project not found</p>
      </div>
    );
  }


    return (
        <section>
        <main className="container mx-auto px-20 pt-10">
            {/* Title at top */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">{newProject.title}</h1>
                <p className="text-gray-500 mt-1">
                    {newProject.pmain_type?.maintype_name} {newProject.purpose?.purpose_name && `for ${newProject.purpose.purpose_name}`}
                </p>
            </div>

            <NewProjectGallery images={newProject.images} />
            <NewProjectHeader newProject={newProject} />
            <NewProjectDetails newProject={newProject} />
        </main>
            {/* <Footer/> */}
        </section>
    );
}
