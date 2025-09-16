"use client";

import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/loading/Loading";


export default function MyDashboard() {

    const { user, loading } = useAuth();
    const router = useRouter();
    const [profileLink,setProfileLink]= useState("")
    

    
    useEffect(() => {
        // console.log("MyDashboard-user=",user)
        // console.log("MyDashboard-loading=",loading)
        
        if (!loading && !user) {
            router.push("/login");
        }
 
        // Dynamic profile links according to user role
        if (!loading && user) {
    
            if(user.role === "admin") {
               setProfileLink("/editMyProfile/admin")
            }
            if(user.role === "buyer") {
               setProfileLink("/editMyProfile/buyer")
            }
            if(user.role === "developer") {
               setProfileLink("/editMyProfile/developer")
            }
            if(user.role === "broker") {
               setProfileLink("/editMyProfile/broker")
            }
            if(user.role === "agent") {
               setProfileLink("/editMyProfile/agent")
            }
        }
    }, [user, loading, router]);



    // spinner/loader
    if (loading) {
                return (
                    <div className="text-center mt-20">
                           < Loading />
                    </div>
                );
    }


    // While checking auth, avoid flicker
    if (!user) {
                return null; // Redirect handled already
    }
 

    return (
            <>
                <section className="mx-auto mt-10 mb-20 max-w-6xl text-center p-6 dark:bg-gray-900">
                    <h2 className="mb-12 text-center text-2xl text-gray-900">
                        <span className="text-[#ef5e4e] text-2xl">
                        {user?.first_name}&apos;s
                        </span>
                        &nbsp;Dashboard
                    </h2>
                
                    <div className="mx-auto max-w-3xl items-stretch space-y-4 text-left sm:flex sm:space-y-0 sm:space-x-8 sm:text-center">
                        
                        <Link href={profileLink} className="flex w-full  md:flex md:flex-col  rounded-xl border border-black border-opacity-10 px-4 py-6 text-black duration-200 hover:border-opacity-0 hover:no-underline hover:shadow-lg  sm:hover:shadow-2xl">
                            <div className="flex justify-items-between items-start gap-x-3  md:flex md:flex-col md:items-center">
                                <div className="md:flex md:items-center">
                                    <svg className="md:h-30 md:w-30 h-20 w-20" fill="#ef5e4e" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve" stroke="#c75a00"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M309.333,213.333h149.333c5.888,0,10.667-4.779,10.667-10.667S464.555,192,458.667,192H309.333 c-5.888,0-10.667,4.779-10.667,10.667S303.445,213.333,309.333,213.333z"></path> <path d="M458.667,21.333H53.333C23.915,21.333,0,45.269,0,74.667v362.667c0,29.397,23.915,53.333,53.333,53.333h405.333 c29.419,0,53.333-23.936,53.333-53.333V74.667C512,45.269,488.085,21.333,458.667,21.333z M138.667,64 c5.888,0,10.667,4.779,10.667,10.667s-4.779,10.667-10.667,10.667S128,80.555,128,74.667S132.779,64,138.667,64z M96,64 c5.888,0,10.667,4.779,10.667,10.667S101.888,85.333,96,85.333s-10.667-4.779-10.667-10.667S90.112,64,96,64z M53.333,64 C59.221,64,64,68.779,64,74.667s-4.779,10.667-10.667,10.667s-10.667-4.779-10.667-10.667S47.445,64,53.333,64z M490.667,437.333 c0,17.643-14.357,32-32,32H53.333c-17.643,0-32-14.357-32-32V128h469.333V437.333z"></path> <path d="M53.333,405.333h213.333c5.888,0,10.667-4.8,10.667-10.688c0-26.731-18.133-49.941-44.053-56.427l-32.021-8l-1.344-5.355 c8.32-9.173,14.208-20.885,16.661-33.045c5.696-2.944,9.813-8.533,10.667-15.253l2.304-18.56 c0.704-5.632-1.024-11.307-4.757-15.573c-1.152-1.323-2.453-2.453-3.883-3.435l0.533-11.328l1.941-1.941 c5.504-5.845,12.928-18.325,1.173-36.331c-5.547-8.533-17.067-18.731-40.149-18.731c-6.784,0-22.123,0-37.013,9.344 c-43.904,1.536-49.067,25.195-49.067,43.072c0,3.52,0.619,10.112,1.237,15.616c-1.579,1.003-3.051,2.24-4.288,3.669 c-3.797,4.309-5.547,10.005-4.821,15.659l2.304,18.56c0.875,6.955,5.291,12.715,11.797,15.552 c2.389,11.627,7.979,22.891,15.765,31.829l-1.557,6.272l-32.021,8c-25.941,6.464-44.075,29.675-44.075,56.427 C42.667,400.555,47.445,405.333,53.333,405.333z"></path> <path d="M309.333,405.333h85.333c5.888,0,10.667-4.779,10.667-10.667S400.555,384,394.667,384h-85.333 c-5.888,0-10.667,4.779-10.667,10.667S303.445,405.333,309.333,405.333z"></path> <path d="M309.333,277.333h149.333c5.888,0,10.667-4.779,10.667-10.667S464.555,256,458.667,256H309.333 c-5.888,0-10.667,4.779-10.667,10.667S303.445,277.333,309.333,277.333z"></path> <path d="M309.333,341.333h149.333c5.888,0,10.667-4.779,10.667-10.667S464.555,320,458.667,320H309.333 c-5.888,0-10.667,4.779-10.667,10.667S303.445,341.333,309.333,341.333z"></path> </g> </g> </g> </g></svg>    
                                </div>
                                <div className="flex flex-col sm:justify-center md:text-center">
                                    <div className="text-2xl sm:mt-4 sm:mb-2">Edit Profile</div>
                                    <div className="text-sm opacity-75">You can easly update your profile picture and your profile data &amp; 
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link href="/changePassword" className="flex w-full  md:flex md:flex-col  rounded-xl border border-black border-opacity-10 px-4 py-6 text-black duration-200 hover:border-opacity-0 hover:no-underline hover:shadow-lg  sm:hover:shadow-2xl">
                            <div className="flex justify-items-between items-start gap-x-3  md:flex md:flex-col md:items-center">
                                <div className="md:flex md:items-center">
                                    <svg className="md:h-30 md:w-30 h-20 w-20" fill="#ef5e4e" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 486.8 486.8" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M80,370.406c-1.9-3.3-6.2-4.4-9.5-2.5l-17.4,10.1v-20.1c0-3.8-3.1-6.9-6.9-6.9c-3.8,0-6.9,3.1-6.9,6.9v20.1l-17.4-10.1 c-3.3-1.9-7.6-0.8-9.5,2.5s-0.8,7.6,2.5,9.5l17.5,10.2l-17.5,10.2c-3.3,1.9-4.4,6.2-2.5,9.5s6.2,4.4,9.5,2.5l17.4-10.1v20.1 c0,3.8,3.1,6.9,6.9,6.9c3.8,0,6.9-3.1,6.9-6.9v-20.1l17.4,10.1c3.3,1.9,7.6,0.8,9.5-2.5s0.8-7.6-2.5-9.5l-17.5-10.2l17.5-10.2 C80.8,377.906,82,373.706,80,370.406z"></path> <path d="M143.9,409.706c1.9,3.3,6.2,4.4,9.5,2.5l17.4-10.1v20.1c0,3.8,3.1,6.9,6.9,6.9c3.8,0,6.9-3.1,6.9-6.9v-20.1l17.4,10.1 c3.3,1.9,7.6,0.8,9.5-2.5s0.8-7.6-2.5-9.5l-17.5-10.2l17.5-10.2c3.3-1.9,4.4-6.2,2.5-9.5s-6.2-4.4-9.5-2.5l-17.4,10.1v-20.1 c0-3.8-3.1-6.9-6.9-6.9c-3.8,0-6.9,3.1-6.9,6.9v20.1l-17.4-10c-3.3-1.9-7.6-0.8-9.5,2.5s-0.8,7.6,2.5,9.5l17.5,10.2l-17.5,10.1 C143.1,402.106,142,406.406,143.9,409.706z"></path> <path d="M131.5,462.106v12.2c0,2.9,2.4,5.3,5.3,5.3h81.9c2.9,0,5.3-2.4,5.3-5.3v-12.2c0-2.9-2.4-5.3-5.3-5.3h-81.9 C133.8,456.806,131.5,459.206,131.5,462.106z"></path> <path d="M331.1,121.106h-0.6v-27.2c0-47.3-38.7-87.5-85.9-86.7c-45.9,0.8-83.1,38.4-83.1,84.5v2.6c0,3.9,3.2,7.1,7.1,7.1h22.7 c3.9,0,7.1-3.2,7.1-7.1v-0.8c0-25.4,19.1-47.7,44.5-49.3c27.6-1.7,50.6,20.2,50.6,47.4v29.4h-70v0.1h-64.7 c-12,0.4-21.7,10.1-21.7,22.2v123c0,12.3,10,22.3,22.3,22.3H331c12.3,0,22.3-10,22.3-22.3v-122.9 C353.4,131.106,343.4,121.106,331.1,121.106z M258.5,210.406c-1.7,1.2-2.2,2.5-2.2,4.5c0.1,9,0.1,18,0,27.1l0,0 c0.2,3.8-1.7,7.4-5.1,9.1c-7.9,4-15.8-1.6-15.8-9.1c0,0,0,0,0-0.1c0-9,0-18.1,0-27.1c0-1.8-0.4-3.1-2-4.3 c-8.2-6-10.9-16.3-6.8-25.4c4-8.8,13.7-14,22.8-12.1c10.2,2,17.3,10.3,17.4,20.4C267.1,200.506,264.2,206.306,258.5,210.406z"></path> <path d="M262.9,462.106v12.2c0,2.9,2.4,5.3,5.3,5.3h81.9c2.9,0,5.3-2.4,5.3-5.3v-12.2c0-2.9-2.4-5.3-5.3-5.3h-81.9 C265.3,456.806,262.9,459.206,262.9,462.106z"></path> <path d="M275.3,409.706c1.9,3.3,6.2,4.4,9.5,2.5l17.4-10.1v20.1c0,3.8,3.1,6.9,6.9,6.9s6.9-3.1,6.9-6.9v-20.1l17.4,10.1 c3.3,1.9,7.6,0.8,9.5-2.5s0.8-7.6-2.5-9.5l-17.5-10.2l17.5-10.2c3.3-1.9,4.4-6.2,2.5-9.5s-6.2-4.4-9.5-2.5l-17.4,10.1v-20.1 c0-3.8-3.1-6.9-6.9-6.9s-6.9,3.1-6.9,6.9v20.1l-17.4-10.1c-3.3-1.9-7.6-0.8-9.5,2.5s-0.8,7.6,2.5,9.5l17.5,10.2l-17.5,10.2 C274.5,402.106,273.4,406.406,275.3,409.706z"></path> <path d="M481.5,456.806h-81.9c-2.9,0-5.3,2.4-5.3,5.3v12.2c0,2.9,2.4,5.3,5.3,5.3h81.9c2.9,0,5.3-2.4,5.3-5.3v-12.2 C486.8,459.206,484.4,456.806,481.5,456.806z"></path> <path d="M5.3,479.606h81.9c2.9,0,5.3-2.4,5.3-5.3v-12.2c0-2.9-2.4-5.3-5.3-5.3H5.3c-2.9,0-5.3,2.4-5.3,5.3v12.2 C0,477.206,2.4,479.606,5.3,479.606z"></path> <path d="M406.8,409.706c1.9,3.3,6.2,4.4,9.5,2.5l17.4-10.1v20.1c0,3.8,3.1,6.9,6.9,6.9s6.9-3.1,6.9-6.9v-20.1l17.4,10.1 c3.3,1.9,7.6,0.8,9.5-2.5s0.8-7.6-2.5-9.5l-17.5-10.2l17.5-10.2c3.3-1.9,4.4-6.2,2.5-9.5s-6.2-4.4-9.5-2.5l-17.4,10.1v-20.1 c0-3.8-3.1-6.9-6.9-6.9s-6.9,3.1-6.9,6.9v20.1l-17.4-10.1c-3.3-1.9-7.6-0.8-9.5,2.5s-0.8,7.6,2.5,9.5l17.5,10.2l-17.5,10.2 C406,402.106,404.8,406.406,406.8,409.706z"></path> </g> </g> </g></svg> 
                                </div>
                                <div className="flex flex-col sm:justify-center md:text-center">
                                    <div className="text-2xl sm:mt-4 sm:mb-2">Change password</div>
                                    <div className="text-sm opacity-75">You can easly change your password for more sucurity</div>
                                </div>
                            </div>
                        </Link>

                        <Link className="flex w-full  md:flex md:flex-col  rounded-xl border border-black border-opacity-10 px-4 py-6 text-black duration-200 hover:border-opacity-0 hover:no-underline hover:shadow-lg  sm:hover:shadow-2xl" href="#" >
                            <div className="flex justify-items-between items-start gap-x-3  md:flex md:flex-col md:items-center">
                                <div className="md:flex md:items-center">
                                    <svg className="md:h-30 md:w-30 h-20 w-20" fill="#ef5e4e" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve" stroke="#c75a00"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M309.333,213.333h149.333c5.888,0,10.667-4.779,10.667-10.667S464.555,192,458.667,192H309.333 c-5.888,0-10.667,4.779-10.667,10.667S303.445,213.333,309.333,213.333z"></path> <path d="M458.667,21.333H53.333C23.915,21.333,0,45.269,0,74.667v362.667c0,29.397,23.915,53.333,53.333,53.333h405.333 c29.419,0,53.333-23.936,53.333-53.333V74.667C512,45.269,488.085,21.333,458.667,21.333z M138.667,64 c5.888,0,10.667,4.779,10.667,10.667s-4.779,10.667-10.667,10.667S128,80.555,128,74.667S132.779,64,138.667,64z M96,64 c5.888,0,10.667,4.779,10.667,10.667S101.888,85.333,96,85.333s-10.667-4.779-10.667-10.667S90.112,64,96,64z M53.333,64 C59.221,64,64,68.779,64,74.667s-4.779,10.667-10.667,10.667s-10.667-4.779-10.667-10.667S47.445,64,53.333,64z M490.667,437.333 c0,17.643-14.357,32-32,32H53.333c-17.643,0-32-14.357-32-32V128h469.333V437.333z"></path> <path d="M53.333,405.333h213.333c5.888,0,10.667-4.8,10.667-10.688c0-26.731-18.133-49.941-44.053-56.427l-32.021-8l-1.344-5.355 c8.32-9.173,14.208-20.885,16.661-33.045c5.696-2.944,9.813-8.533,10.667-15.253l2.304-18.56 c0.704-5.632-1.024-11.307-4.757-15.573c-1.152-1.323-2.453-2.453-3.883-3.435l0.533-11.328l1.941-1.941 c5.504-5.845,12.928-18.325,1.173-36.331c-5.547-8.533-17.067-18.731-40.149-18.731c-6.784,0-22.123,0-37.013,9.344 c-43.904,1.536-49.067,25.195-49.067,43.072c0,3.52,0.619,10.112,1.237,15.616c-1.579,1.003-3.051,2.24-4.288,3.669 c-3.797,4.309-5.547,10.005-4.821,15.659l2.304,18.56c0.875,6.955,5.291,12.715,11.797,15.552 c2.389,11.627,7.979,22.891,15.765,31.829l-1.557,6.272l-32.021,8c-25.941,6.464-44.075,29.675-44.075,56.427 C42.667,400.555,47.445,405.333,53.333,405.333z"></path> <path d="M309.333,405.333h85.333c5.888,0,10.667-4.779,10.667-10.667S400.555,384,394.667,384h-85.333 c-5.888,0-10.667,4.779-10.667,10.667S303.445,405.333,309.333,405.333z"></path> <path d="M309.333,277.333h149.333c5.888,0,10.667-4.779,10.667-10.667S464.555,256,458.667,256H309.333 c-5.888,0-10.667,4.779-10.667,10.667S303.445,277.333,309.333,277.333z"></path> <path d="M309.333,341.333h149.333c5.888,0,10.667-4.779,10.667-10.667S464.555,320,458.667,320H309.333 c-5.888,0-10.667,4.779-10.667,10.667S303.445,341.333,309.333,341.333z"></path> </g> </g> </g> </g></svg>    
                                </div>
                                <div className="flex flex-col sm:justify-center md:text-center">
                                    <div className="text-2xl sm:mt-4 sm:mb-2">Konsta UI</div>
                                    <div className="text-sm opacity-75">Pixel perfect mobile UI components built with Tailwind CSS</div>
                                </div>
                            </div>    
                        </Link>
                    </div>
                </section>
            </>
    )

}