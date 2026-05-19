"use client";

import { useAuth } from "../../../context/AuthContext";
import { useState, useEffect } from "react";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { updateRequestUserProfile } from "../../../utils/auth";

// react-toastify
import notify from "../../../common/useNotification"
import { ToastContainer, toast } from 'react-toastify';
import { moveMessagePortToContext } from "worker_threads";
import Link from "next/link";
import Loading from "../../../components/Loading";

// Role badge colors
const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-indigo-600";
    case "buyer":
      return "bg-blue-600";
    case "broker":
      return "bg-amber-600";
    case "agent":
      return "bg-emerald-600";
    case "developer":
      return "bg-rose-600";
    default:
      return "bg-gray-600";
  }
};

// Role icon
const getRoleIcon = (role: string) => {
  switch (role) {
    case "admin":
      return "👑";
    case "buyer":
      return "🛒";
    case "broker":
      return "🏢";
    case "agent":
      return "🏠";
    case "developer":
      return "🏗️";
    default:
      return "👤";
  }
};




export default function MyDeveloperProfile() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [userProfile, setUserProfile] = useState<any>(null);
    

    useEffect(() => {
        console.log("developerProfile-loading=",loading)
        console.log("developerProfile-user=",user)
        if (!loading && !user) {
            router.push("/sa/login");
        }
        if (!loading && user){
              setUserProfile(user)
        }
    }, [user, loading, router]); // Add dependencies here

    
    
    if (loading) {
        return (
        <div className="text-center mt-20">
            <Loading />
        </div>
        );
    }
        
        
    return (
        <>
            <section className="my-4 bg-gray-100 flex items-center">
                <div className="lg:w-3/4 w-[95%] mx-auto bg-white shadow-2xl rounded-2xl p-6">
                    
                    {/* edit button  */}
                    <div className="flex place-content-end">
                      <Link href="/sa/edit-my-profile/developer"
                         className="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-l-lg rounded-r-lg font-medium px-4 py-2 inline-flex space-x-1 items-center">
                        <span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                        </span>
                        <span className="hidden md:inline-block">Edit</span>
                      </Link>
                    </div>

                    <h1 className="text-center text-2xl text-gray-900">
                        <span className="text-[#c75a00] text-2xl">{userProfile?.first_name}
                        <span>&apos;s</span>&nbsp;</span>Profile
                    </h1>
                    
                    <ToastContainer position="top-center" autoClose={3000} />
                  
                    <div className="bg-white py-5 sm:py-8">
                      <div className="max-w-7xl px-6 lg:px-8">
                        <div className="grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                          
                          
                          {/* profile image */}
                          <div className="text-center justify-items-center">
                            <Image
                              src={
                                  userProfile?.profile_picture
                                    ? `${process.env.NEXT_PUBLIC_API_URL}/${userProfile.profile_picture}`.replace(/\/\/+/g, "/")
                                    : "/profile_default.svg"
                              }
                              onError={(e) => { (e.target as HTMLImageElement).src = "/profile_default.svg"; }}
                              alt="Developer Profile Picture"
                              width={300}
                              height={300}
                              className="rounded-full object-cover"
                            />
                
                            <div className="text-xl mt-3 text-gray-600 flex items-center justify-center gap-2">
                                {/* developer name */}
                                {userProfile?.developer_name }
                            </div>
                            <h2 className={`${getRoleBadgeColor(userProfile?.role || "")} text-white p-1 px-2 rounded-lg text-sm font-semibold inline-flex items-center gap-1`}>
                                {getRoleIcon(userProfile?.role || "")} {userProfile?.role}
                            </h2> 
                          </div>



                          <dl className="col-span-2 grid grid-cols-1 gap-x-8 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:gap-y-16">
                            
                              <div className="relative pl-9">
                                <dt className="font-semibold text-gray-900">
                                  <svg className="absolute top-1 left-0 h-5 w-5 text-indigo-500" x-description="Heroicon name: mini/check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"></path>
                                  </svg>
                                  First Name
                                </dt>
                                <dd className="mt-2">{userProfile?.first_name}</dd>
                              </div>
                            
                              <div className="relative pl-9">
                                <dt className="font-semibold text-gray-900">
                                  <svg className="absolute top-1 left-0 h-5 w-5 text-indigo-500" x-description="Heroicon name: mini/check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"></path>
                                  </svg>
                                  Last Name
                                </dt>
                                <dd className="mt-2">{userProfile?.last_name}</dd>
                              </div>

                              <div className="relative pl-9">
                                <dt className="font-semibold text-gray-900">
                                  <svg className="absolute top-1 left-0 h-5 w-5 text-indigo-500" x-description="Heroicon name: mini/check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"></path>
                                  </svg>
                                  Developer Name (Commerical Name)
                                </dt>
                                <dd className="mt-2">{userProfile?.developer_name || "Not provided"}</dd>
                              </div>
                              <div className="relative pl-9">
                                <dt className="font-semibold text-gray-900">
                                  <svg className="absolute top-1 left-0 h-5 w-5 text-indigo-500" x-description="Heroicon name: mini/check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"></path>
                                  </svg>
                                  Bio
                                </dt>
                                <dd className="mt-2">{userProfile?.bio || "Not provided"}</dd>
                              </div>
                              <div className="relative pl-9">
                                <dt className="font-semibold text-gray-900">
                                  <svg className="absolute top-1 left-0 h-5 w-5 text-indigo-500" x-description="Heroicon name: mini/check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"></path>
                                  </svg>
                                  Contact Email
                                </dt>
                                <dd className="mt-2">{userProfile?.contact_email || user?.email}</dd>
                              </div>
                              <div className="relative pl-9">
                                <dt className="font-semibold text-gray-900">
                                  <svg className="absolute top-1 left-0 h-5 w-5 text-indigo-500" x-description="Heroicon name: mini/check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"></path>
                                  </svg>
                                  Date of birth
                                </dt>
                                <dd className="mt-2">{userProfile?.date_of_birth  || "Not provided"}</dd>
                              </div> 
                            
                              <div className="relative pl-9">
                                <dt className="font-semibold text-gray-900">
                                  <svg className="absolute top-1 left-0 h-5 w-5 text-indigo-500" x-description="Heroicon name: mini/check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"></path>
                                  </svg>
                                  Phone Number
                                </dt>
                                <dd className="mt-2">{userProfile?.phone_number || "Not provided"}</dd>
                              </div>
                              <div className="relative pl-9">
                                <dt className="font-semibold text-gray-900">
                                  <svg className="absolute top-1 left-0 h-5 w-5 text-indigo-500" x-description="Heroicon name: mini/check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"></path>
                                  </svg>
                                  Website
                                </dt>
                                <dd className="mt-2">{userProfile?.website || "Not provided"}</dd>
                              </div>
                              <div className="relative pl-9">
                                <dt className="font-semibold text-gray-900">
                                  <svg className="absolute top-1 left-0 h-5 w-5 text-indigo-500" x-description="Heroicon name: mini/check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"></path>
                                  </svg>
                                  Twitter
                                </dt>
                                <dd className="mt-2">{userProfile?.twitter || "Not provided"}</dd>
                              </div>
                              <div className="relative pl-9">
                                <dt className="font-semibold text-gray-900">
                                  <svg className="absolute top-1 left-0 h-5 w-5 text-indigo-500" x-description="Heroicon name: mini/check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"></path>
                                  </svg>
                                  Country
                                </dt>
                                <dd className="mt-2">{userProfile?.country || "Not provided"}</dd>
                              </div>
                            
                              <div className="relative pl-9">
                                <dt className="font-semibold text-gray-900">
                                  <svg className="absolute top-1 left-0 h-5 w-5 text-indigo-500" x-description="Heroicon name: mini/check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd"></path>
                                  </svg>
                                  Address
                                </dt>
                                <dd className="mt-2">{userProfile?.address || "Not provided"}</dd>
                              </div>
                            
                          </dl>
                        </div>
                      </div>
                    </div>

                </div>
            </section>
        </>
    );
}