"use client";

import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {  getCountriesList,  getAmenitiesList, getCountryCitiesList , addNewProject } from "../../utils/property";

import axiosInstance from "../../lib/axios";

import Loading from "../../components/Loading";
// react-toastify
import notify from "../../common/useNotification"
import { ToastContainer, toast } from 'react-toastify';





export default function AddNewProjectPage() {
    const { user, setUser, loading, setLoading } = useAuth();
    const router = useRouter();

    // models.CharField
    const [nprojName,setNprojName] = useState("")                             // "nproj_name"
    const [selectedNprojMainType, setSelectedNprojMainType] = useState("")    // "nproj_main_type"
    const [district,setDistrict] = useState("")                               // "district"
    const [addressDetail,setAddressDetail] = useState("")                     // "address_detail"
    const [handOverYearQuarter, setHandOverYearQuarter] = useState("")        // "hand_over_year_quarter"
    const [statusDetails,setStatusDetails] = useState("")                     // "status_details"
    const [currency,setCurrency] = useState("")            // "currency"
    // models.DateField
    const [handOverYear, setHandOverYear] = useState("")     // "hand_over_year"
    // models.slugField
    const [selectedNprojMainTypeSlug,setSelectedNprojMainTypeSlug] = useState("")   // "nproj_main_type_slug"
    // models.TextField  
    const [description,setDescription] = useState("")     // "description"
    // models.IntegerField
    const [units, setUnits] = useState("")                // "units"
    // models.DecimalField
    const [fullArea,setFullArea] = useState("")           // "full_area"
    const [latitude,setLatitude] = useState("")           // "latitude"
    const [longitude,setLongitude] = useState("")         // "longitude"   
    const [lunchPrice,setLunchPrice] = useState("")       // "lunch_price"
    // models.BooleanField
    const [isPublished, setIsPublished] = useState(false)  
    // models.ForeignKey
    // country
    const [countryList,setCountryList] = useState([]);
    const [selectedCountrySlug,setSelectedCountrySlug] = useState("")
    const [selectedCountryId,setSelectedCountryId] = useState("")
    // city
    const [cityList,setCityList] = useState([]);
    const [selectedCity,setSelectedCity] = useState("")   
    // models.ManyToManyField
    // amenities
    const [amenitiesList,setAmenitiesList] = useState([]);
    const [amenities,setAmenities] = useState([])                
     
    const [newProjectId,setNewProjectId]= useState("")      // result object.id -- new project id


    // checking auth and role
    useEffect(() => {
        console.log("AddNewProject-loading=",loading)
        console.log("AddNewProject-user=",user)
        if (!loading && !user) {
            router.push("/sa/login");
        }
        if (!loading && user && ( user.role === "buyer"  || user.role === "broker" || user.role === "agent") ){
            console.log('role=', user.role)
            toast.error( "You have no permission to reach this page");
            router.push("/sa/my-dashboard");
        }
    }, [user, loading, router]);


    // get countries list and amenities list on page load
    useEffect(() => {
        // getCountriesList
        const fetchCountryList = async () => {
            try {
                const data = await getCountriesList();
                setCountryList(data);             // ✅ save country list
                console.log("getCountriesList=", countryList);
                notify("The country List is now get successfully", "success");

            } catch (error: any) {
                notify("Failed to get country List", "error");
                console.log("getCountriesList-error =", error);
            }
        };
        fetchCountryList();

        // getAmenitiesList
        const fetchAmenitiesList = async () => {
            try {
                const data = await getAmenitiesList();
                setAmenitiesList(data);             // ✅ save Amenities List
                notify("The Amenities List is now get successfully", "success");

            } catch (error: any) {
                notify("Failed to get Amenities List", "error");
                console.log("getAmenitiesList-error =", error);
            }
        };
        fetchAmenitiesList ();
    }, []);




    //  onChange
    ///////////////  FORM FIELDS  --- parse data from form field
    
   // getCountryCitiesList - send id of selected country to get cities list
    useEffect(() => {
        // getCountryCitiesList
        if(selectedCountrySlug){
            setCityList([])
            const fetchCityListForSelectedCountry = async (selectedCountrySlug) => {
                console.log("fetchCityListForSelectedCountry-selectedCountry",selectedCountrySlug)
                try {
                    const data = await getCountryCitiesList(selectedCountrySlug);
                    setCityList(data);             // ✅ save the result city list
                    notify("The cities List belong to selected country is now get successfully", "success");

                } catch (error: any) {
                    notify("Failed to get cities List belong to selected country", "error");
                    console.log(" fetchCityListForSelectedCountry-error =", error);
                }
            };
            fetchCityListForSelectedCountry(selectedCountrySlug);
        }
    }, [selectedCountrySlug]);



    ///// Basic Information
   
    // nproj_name
    const onChangeNprojName = (e) => {
        setNprojName(e.target.value);
        console.log("onChangeNprojName =", e.target.value);
    };
    // nproj_main_type
    const onChangeNprojMainType= (e) => {
        setSelectedNprojMainType(e.target.value)
        console.log('onChangeNprojMainType=', e.target.value)
    };
    //  description
    const onChangeDescription = (e) => {
        setDescription(e.target.value)
        console.log('onChangeDescription =', e.target.value)
    };
    
    //// Location Details
    // country
    const onChangeSelectedCountry = (e) => {
        const newSlug = e.target.value;
        console.log("onChangeSelectedCountry-Slug=", newSlug);
        setSelectedCountrySlug(newSlug); // update state

        // use the current value directly
        const foundCountry = countryList.find((country) => country.country_slug === newSlug);
        if (foundCountry) {
            setSelectedCountryId(foundCountry.id);
            console.log("onChangeSelectedCountry-Id=", foundCountry.id);
        } else {
            console.log("No country found for slug:", newSlug);
            notify("No country found for slug: " + newSlug, "error");
        }
    };
    // city 
    const onChangeSelectedCity= (e) => {
        setSelectedCity(e.target.value)
        console.log('onChangeSelectedCity=', e.target.value)
    };
    //  latitude
    const onChangeLatitude= (e) => {
        setLatitude(e.target.value)
        console.log('onChangeLatitude =', e.target.value)
    };
    //  longitude
    const onChangeLongitude= (e) => {
        setLongitude(e.target.value)
        console.log('onChangeLongitude =', e.target.value)
    };
    //  district
    const onChangeDistrict = (e) => {
        setDistrict(e.target.value);
        console.log("onChangeDistrict =", e.target.value);
    };
    // address_detail
    const onChangeAddressDetail = (e) => {
        setAddressDetail(e.target.value)
        console.log('onChangeAddressDetail =', e.target.value)
    };





    //// New Project Details
    // lunch_price
    const onChangeLunchedPrice= (e) => {
        setLunchPrice(e.target.value)
        console.log('onChangeLunchedPrice=', e.target.value)
    };
    // currency
    const onChangeCurrency = (e) => {
        setCurrency(e.target.value);
        console.log("onChangeCurrency =", e.target.value);
    };
    //Units
    const onChangeUnits = (e) => {
        setUnits(e.target.value);
        console.log("onChangeUnits =", e.target.value);
    };
    // full_area
    const onChangeFullArea = (e) => {
        setFullArea(e.target.value)
        console.log('onChangeArea =', e.target.value)
    };
    // amenities - since it's many to many relationship we need to send array of ids
    // const onChangeAmenities= (e) => {
    //     setAmenities(e.target.value)
    //     console.log('onChangeAmenities =', e.target.value)
    // };

 
    // hand_over_year
    const onChangeHandOverYear = (e) => {
        setHandOverYear(e.target.value);
        console.log("onChangeHandOverYear =", e.target.value);
    };
    // hand_over_year_quarter
    const onChangeHandOverYearQuarter = (e) => {
        setHandOverYearQuarter(e.target.value);
        console.log("onChangeHandOverYearQuarter =", e.target.value);
    };
    // status_details
    const onChangeStatusDetails = (e) => {
        setStatusDetails(e.target.value);
        console.log("onChangeStatusDetails =", e.target.value);
    };
    // is_published
    const onChangeIsPublished = (e) => {
        setIsPublished(e.target.checked);
        console.log("onChangeIsPublished =", e.target.checked);
    };


    if (loading) {
        return (
            <div className="text-center mt-20">
                <Loading />
            </div>
        );
    }

    // While checking auth, avoid flicker
    if (!user) {
       return null; // Redirect handled already
    }


    //////  SUBMIT ////////////
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('submiting');
        console.log('selectedNprojMainType=', selectedNprojMainType);
        console.log('selectedCountrySlug=', selectedCountrySlug);
        console.log('selectedCountryId=', selectedCountryId);
         
        
        if (!loading && !user){
            router.push('/sa/login');
        }

        if (!nprojName || !description ||  !selectedNprojMainType 
            || !fullArea  || !addressDetail || !currency  
            || !latitude || !longitude || !lunchPrice  || !selectedCountryId || !selectedCity || !amenities)
            {
                notify("Please fill the form fields !","warning");
                return;
            }


        // Create FormData object
        // When uploading files in React with Axios, you must use FormData and not JSON.
        const formData = new FormData();
        // formData.append("owner",owner);
        formData.append("nproj_name",nprojName);
        formData.append("nproj_main_type", selectedNprojMainType);
        formData.append("description", description);
        
        formData.append("country_id", selectedCountryId);
        formData.append("city_id", selectedCity);
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);
        
        formData.append("full_area",fullArea);
        
        formData.append("district",district);
        formData.append("lunch_price",lunchPrice);
        formData.append("full_area",fullArea);
        formData.append("address_detail", addressDetail);
        formData.append("currency", currency);
        
        
        
        
        
        amenities.forEach(id => formData.append("amenities_ids", id));  // multiple -- many to many relationship


        console.log('formData=', formData);
        console.log('formData.selectedCountryId=', formData.get('country'));
        console.log('formData.city=', formData.get('city'));
        console.log('formData.selectedMainType=', formData.get('pmain_type'));
        

        // addNewProject - api 
        try {
            const newProject = await addNewProject(formData); // ✅ This returns response.data from backend
            console.log("newProject=", newProject);

            const nprojectId = newProject.id; // ✅ Access ID safely
            console.log("nprojectId=", nprojectId);
            setNewProjectId(nprojectId);

            notify("New project data has been added successfully", "success");

            // Example navigation to image form
            router.push(`/sa/add-new-project/images/${nprojectId}`);
            // http://localhost:3000/add-property/images/2723a133-a26f-4e79-94b7-d4e1c9924658


        } catch (error: any) {
            console.log("addPurpose error =", error);
            if (error.response && error.response.data) {
                    const errors = error.response.data;

                    Object.entries(errors).forEach(([field, messages]) => {
                    if (Array.isArray(messages)) {
                        messages.forEach((msg) => notify(`${field}: ${msg}`, "error"));
                    } else {
                        notify(`${field}: ${messages}`, "error");
                    }
                    });

            } else {
                    notify("Something went wrong, please try again.", "error");
            }
        }
    }


    return (
        <>
        <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header with Breadcrumb */}
                <nav className="mb-6" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        <li className="inline-flex items-center">
                            <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                                <svg className="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                                </svg>
                                Home
                            </Link>
                        </li>
                        <li>
                            <div className="flex items-center">
                                <svg className="rtl:rotate-180 w-3 h-3 text-slate-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                </svg>
                                <Link href="/sa/my-dashboard" className="ml-1 text-sm font-medium text-slate-600 hover:text-indigo-600 md:ml-2 transition-colors">My Dashboard</Link>
                            </div>
                        </li>
                        <li aria-current="page">
                            <div className="flex items-center">
                                <svg className="rtl:rotate-180 w-3 h-3 text-slate-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                                </svg>
                                <span className="ml-1 text-sm font-medium text-indigo-600 md:ml-2">Add New Project</span>
                            </div>
                        </li>
                    </ol>
                </nav>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 px-8 py-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Add New Project</h1>
                        <p className="text-indigo-100 mt-1 text-sm">Fill in the details below to list your new project</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                        <ToastContainer position="top-center" autoClose={3000} />

                        {/* Basic Information Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <h2 className="text-lg font-semibold text-slate-800">Basic Information</h2>
                            </div>

                            {/* nprojName */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Name <span className="text-red-500">*</span></label>
                                <input
                                    name="nprojName"
                                    value={nprojName}
                                    onChange={onChangeNprojName}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                                    placeholder="Enter project name"
                                />
                            </div>
                             

                            {/* nproj_main_type  - resedintel -commerical - mixed */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Main Type <span className="text-red-500">*</span></label>
                                    <select
                                        name="nproj_main_type"
                                        value={selectedNprojMainType}
                                        onChange={onChangeNprojMainType}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Main Type</option>
                                        <option value="residential">Residential</option>
                                        <option value="commercial">Commercial</option>
                                        <option value="mixed_use">Mixed Use</option>
                                    </select>
                                </div>
                            </div>


                            {/* Description - Fixed with textarea */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description <span className="text-red-500">*</span></label>
                                <textarea
                                    name="description"
                                    value={description}
                                    onChange={onChangeDescription}
                                    rows={6}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400 resize-y min-h-[150px]"
                                    placeholder="Describe your property in detail..."
                                />
                            </div> 
                        </div>

                        <hr className="border-slate-200" />

                        {/* Location Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    </svg>
                                </div>
                                <h2 className="text-lg font-semibold text-slate-800">Location Details</h2>
                            </div>

                            {/* Country & City */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Country */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Country <span className="text-red-500">*</span></label>
                                    <select
                                        value={selectedCountrySlug}
                                        onChange={onChangeSelectedCountry}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 appearance-none cursor-pointer"
                                    >
                                        <option value="">Select a Country</option>
                                        {countryList.map((co) => (
                                            <option key={co.id} value={co.country_slug}>
                                                {co.country_name} ({co.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/* City */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">City <span className="text-red-500">*</span></label>
                                    <select
                                        value={selectedCity}
                                        onChange={onChangeSelectedCity}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 appearance-none cursor-pointer"
                                    >
                                        <option value="">Select City</option>
                                        {cityList.map((ci) => (
                                            <option key={ci.id} value={ci.id}>
                                                {ci.city_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {/* Latitude & Longitude */}
                            {/* Latitude */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Latitude <span className="text-red-500">*</span></label>
                                    <input
                                        name="latitude"
                                        value={latitude}
                                        onChange={onChangeLatitude}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                                        placeholder="Enter latitude"
                                    />
                                </div>
                                {/* Longitude */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Longitude <span className="text-red-500">*</span></label>
                                    <input
                                        name="longitude"
                                        value={longitude}
                                        onChange={onChangeLongitude}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                                        placeholder="Enter longitude"
                                    />
                                </div>
                            </div>
                            {/* District & Address Detail */}
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                {/* District */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">District <span className="text-red-500">*</span></label>
                                    <input
                                        name="district"
                                        value={district}
                                        onChange={onChangeDistrict}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                                        placeholder="Enter district"
                                    />
                                </div>
                                {/* Address Detail */}
                                <div>
                                    <label className="flex block text-sm font-medium text-slate-700 mb-1.5">Address Detail <span className="text-red-500">*</span></label>
                                    <input
                                        name="addressDetail"
                                        value={addressDetail}
                                        onChange={onChangeAddressDetail}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                                        placeholder="Enter detailed address"
                                    />
                                </div>
                            </div>    
                        </div>
                        

                        <hr className="border-slate-200" />


                        {/* New Project Details Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-4 0h4"/>
                                    </svg>
                                </div>
                                <h2 className="text-lg font-semibold text-slate-800">New Project Details</h2>
                            </div>
                            {/* Lunched Price & Currency */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Lunched Price */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Lunched Price <span className="text-red-500">*</span></label>
                                    <input
                                        name="lunchPrice"
                                        value={lunchPrice}
                                        onChange={onChangeLunchedPrice}
                                        type="number"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                                        placeholder="Enter lunched price"
                                    />
                                </div>
                                {/* Currency */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Currency <span className="text-red-500">*</span></label>
                                    <input
                                        name="currency"
                                        value={currency}
                                        onChange={onChangeCurrency}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                                        placeholder="e.g. USD, EUR, SAR"
                                    />
                                </div>
                            </div>
                            {/* Full Area (m2) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Area (m2) <span className="text-red-500">*</span></label>
                                    <input
                                        name="area"
                                        value={fullArea}
                                        onChange={onChangeFullArea}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 placeholder-slate-400"
                                        placeholder="Enter full area in meter square"
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-200" />

                        {/* Amenities Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                    </svg>
                                </div>
                                <h2 className="text-lg font-semibold text-slate-800">Amenities</h2>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Amenities</label>
                                <select
                                    multiple
                                    value={amenities}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white text-slate-900 cursor-pointer min-h-[120px]"
                                    onChange={(e) =>
                                        setAmenities([...e.target.selectedOptions].map(o => o.value))
                                    }
                                >
                                    {amenitiesList.map((amenityobj) => (
                                        <option key={amenityobj.id} value={amenityobj.id} className="px-2 py-1">
                                            {amenityobj.amenity_name}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1.5 text-xs text-slate-500">Hold Ctrl (Cmd on Mac) to select multiple amenities</p>
                            </div>
                        </div>


                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                Add New Project
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
        </>
    );
}
