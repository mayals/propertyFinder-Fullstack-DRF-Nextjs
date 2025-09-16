// src/app/components/Navbar.tsx

"use client";
import React, { useState ,useEffect, useRef } from 'react';
import Link from 'next/link';
import {  usePathname } from 'next/navigation';
import Image from 'next/image';
import { FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from "../../utils/auth";
// dynamic navs section  
import UserAdminNav from "./UserAdminNav";
import UserBuyerNav from "./UserBuyerNav";
import UserDeveloperNav from "./UserDeveloperNav";
import UserBrokerNav from "./UserBrokerNav";
import UserAgentNav from "./UserAgentNav";



type NavbarProps = {};

const Navbar: React.FC = () => {
  const { user, setUser } = useAuth();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const toggleMenu = (menu: string) => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };


    const handleLogout = async () => {
        try {
            await logoutUser(setUser);
            console.log("user after logout=",user)     // reset context inside logoutUser
            // router.push("/login");      // redirect after logout
        } catch (err) {
            console.error(err);
        }
    };


  // Close menu on route change
  useEffect(() => {
    setActiveMenu(null);
  }, [pathname]);


// Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  
  //  nav items in desktop size -- for anonymose user 
  const navItems = [
    { label: "Buy", href: "/buy" },
    { label: "Rent", href: "/rent" },
    { label: "Commerical", href: "/commerical" },
    { label: "New projects", href: "/newProjects" },
    { label: "Find agent", href: "/findAgent" },
    { label: "Blog", href: "/blog" },
  ];

  //  nav items in mobile size -- for anonymous user 
  const navMobItems = [
    { label: "Buy", href: "/buy" },
    { label: "Rent", href: "/rent" },
    { label: "Commerical", href: "/commerical" },
    { label: "New projects", href: "/newProjects" },
    { label: "Find agent", href: "/findAgent" },
    { label: "Blog", href: "/blog" },
  ];

  
  
  
  

  return (
    <>
    <div ref={menuRef}>

      
      {/* Desktop Navbar */}
      <section className="hidden md:block w-full px-8 text-gray-700 bg-white shadow-md">
        <div className="flex justify-between">
          
          <div className="flex items-center space-x-6 my-0">
            {/* logo */}
            <Link key="home" href="/" className="text-xl font-black text-gray-900">
              <Image
                src="logo-en.svg"
                alt="Property-finder-logo"
                width={100}
                height={100}
                className="rounded-full"
              />
            </Link>
            {/* nav items in desktop size -- for anonymose user  */}
            <nav className="flex space-x-5 border-l pl-4 border-gray-200">
              {navItems.map(({ label, href }) => (
                
                <Link
                  key={label}
                  href={href}
                  className="text-gray-600 hover:text-gray-900 font-medium hover:bg-gray-200 py-5 mx-0 px-3"
                >
                  {label}
                </Link>
              ))}
            </nav>

          </div>

          {/* dynamic login button( authenticated user|unuthenticated user ) */}
          {/* UserBuyerNav   or  UserAdminNav  UserDeveloperNav */}
          <div className="flex items-center space-x-6">
              {user ? (
                user.role === "admin" ? (
                  <UserAdminNav user={user} />
                ) : user.role === "buyer" ? (
                  <UserBuyerNav user={user} />
                ) : user.role === "developer"? (
                  <UserDeveloperNav user={user} />
                ) : user.role === "broker" ? (
                  <UserBrokerNav user={user} />
                ) : user.role === "agent" ? (
                  <UserAgentNav user={user} />
                ) : null
              ) : (
                <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                  Login
                </Link>
              )}
          </div>




        </div>
      </section>




      {/* Mobile Navbar */}
      <section className="md:hidden block w-full bg-white shadow-md">
        <div className="px-4 py-3">
          {/* row up */}
          <div className="flex flex-row justify-between">
            <Link href="/" className="text-3xl font-black text-gray-900">
              AI<span className="text-indigo-600">.</span>
            </Link>

            {!user ? (
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                Login
              </Link>
              ) : (
                <div className="relative group inline-block">
                            <Image
                              src={`http://127.0.0.1:8000${user?.profile_picture}`}
                              alt="Profile"
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                </div> 
            )} 

          </div>

          {/* row down */}
          <div className="">
              <nav className="flex text-wrap  gap-2 bg-gray-100 mx-0 my-0">
                
                    {/* normal links type */}
                    {navMobItems.map(({ label, href }) => (
                      <Link
                        key={label}
                        href={href}
                        className="text-gray-600 hover:text-gray-900 font-medium py-5 mx-0"
                      >
                      {label}
                      </Link>
                    ))}
                   


                    {/* More dropdown - toggled by click */}
                    <div className="relative">
                        <button
                          onClick={() => toggleMenu("more")}
                          className="flex items-center cursor-pointer text-gray-600 hover:text-gray-900 font-medium focus:outline-none"
                        >
                          More
                          <FiChevronDown
                            className={`ml-1 transition-transform duration-300 ${ activeMenu === "more" ? "rotate-180" : "" }`}
                          />
                        </button>

                        {activeMenu === "more" && (
                          <div className="absolute right-0 mt-2 flex flex-col bg-white border rounded-md shadow-lg z-10 w-40">
                            <Link href="/projects" className="text-gray-600 hover:text-gray-900 px-3 py-2">New projects</Link>
                            <Link href="/findAgent" className="text-gray-600 hover:text-gray-900 px-3 py-2">Find agent</Link>
                            <Link href="/explore" className="text-gray-600 hover:text-gray-900 px-3 py-2">Explore</Link>
                            <Link href="/mortgages" className="text-gray-600 hover:text-gray-900 px-3 py-2">Mortgages</Link>
                            <Link href="/explore" className="text-gray-600 hover:text-gray-900 px-3 py-2">Explore</Link>
                            <Link href="/mortgages" className="text-gray-600 hover:text-gray-900 px-3 py-2">Mortgages</Link>
                          </div>
                        )}   
                    </div>


                    {/* user nav dropdown - toggled by click */}
                    {user?(
                      <div className="relative">
                        <button
                          onClick={() => toggleMenu("user_nav")}
                          className="flex items-center cursor-pointer text-gray-600 hover:text-gray-900 font-medium focus:outline-none"
                        >
                            Account
                            <FiChevronDown
                              className={`ml-1 transition-transform duration-300 ${
                                activeMenu === "user_nav" ? "rotate-180" : ""
                              }`}
                            />
                        </button>

                        {activeMenu === "user_nav" && (
                          <div className="absolute right-0 mt-2 flex flex-col bg-white border rounded-md shadow-lg z-10 w-40">
                            <Link href="/myProfile/admin" className="text-gray-600 hover:text-gray-900 px-3 py-2">My Admin profile</Link>
                            <Link href="/myDashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2">My dashboard</Link>
                            <Link href="/myProperties" className="text-gray-600 hover:text-gray-900 px-3 py-2">My properties</Link>
                            <Link href="/myFavorites" className="text-gray-600 hover:text-gray-900 px-3 py-2">My favorites</Link>
                            <Link href="/myReservations" className="text-gray-600 hover:text-gray-900 px-3 py-2">My reservations</Link>
                            <Link href="/inbox" className="text-gray-600 hover:text-gray-900 px-3 py-2">Inbox</Link>

                            <button 
                              onClick={handleLogout} 
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                              Logout
                            </button>
                          </div>
                        )}   
                    </div>
                    ):(
                      null
                    )}
                    

              </nav>
          </div>
        </div>
        
      </section>
    </div>
    </>
  );
};

export default Navbar;
