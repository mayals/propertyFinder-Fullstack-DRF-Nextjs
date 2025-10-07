"use client";


import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getMainTypesList, getCountriesList, getPurposeList, getAmenitiesList,
       getCountryCitiesList, getMainTypeSubTypesList , addProperty } from "../../utils/property";



import axiosInstance from "../../lib/axios";

import Loading from "../../components/loading/Loading";
// react-toastify
import notify from "../../common/useNotification"
import { ToastContainer, toast } from 'react-toastify';




export default function AddProperty() {
    const { user, loading } = useAuth();
    const router = useRouter();
    
    // models.ForeignKey --- current user  -- from useAuth()
    // const [owner,setOwner] = useState("")    // "owner"
    
    // models.CharField
    const [title,setTitle] = useState("")                   // "title"
    const [area,setArea] = useState("")                     // "Area"
    const [district,setDistrict] = useState("")             // "district"
    const [plotNumber ,setPlotNumber ] = useState("")       // "plot_number"
    const [landNumber,setLandNumber] = useState("")         // "land_number" 
    const [addressDetail,setAddressDetail] = useState("")   // "address_detail"
    const [currency,setCurrency] = useState("")            // "currency"
    // FACADE_CHOICES = [("north", "North"), ("south", "South"), ("east", "East"), ("west", "West"),]
    const [facade,setFacade] = useState("")                // "facade" 
    // FURNISHING_CHOICES = [("furnished", "Furnished"),("unfurnished", "Unfurnished"),("partly", "Partly Furnished"),]
    const [furnishing,setFurnishing ] = useState("")    // "furnishing"
    
    // models.BooleanField
    const [isOccupied,setIsOccupied] = useState("")     // "is_occupied"


    // models.TextField
    const [description,setDescription] = useState("")    // "description"

    
    //  models.IntegerField
    const [bedrooms,setBedrooms] = useState("")         // "bedrooms"
    const [bathrooms,setBathrooms] = useState("")       // "bathrooms"
    const [propertyAge,setPropertyAge] = useState("")   // "property_age"


    // models.DecimalField
    const [latitude,setLatitude] = useState("")           // "latitude"
    const [longitude,setLongitude] = useState("")         // "longitude"
    const [propertySize,setPropertySize] = useState("")   // "property_size"
    const [plotLength,setPlotLength] = useState("")       // "plot_length"  
    const [plotWidth,setPlotWidth] = useState("")         // "plot_width"
    const [streetWidth,setStreetWidth] = useState("")     // "street_width"
    const [price,setPrice] = useState("")                  // "price"


    // models.DateField
    const [availableFrom,setAvailableFrom] = useState("")        // "available_from" 
    
    
    // models.ForeignKey
    const [countryList,setCountryList] = useState([]);           
    const [selectedCountry,setSelectedCountry] = useState("")                     // "country"
    
    const [cityList,setCityList] = useState([]);                   
    const [selectedCity,setSelectedCity] = useState("")                           // "city"
    
    const [mainTypesList,setMainTypeList] = useState([]);
    const [selectedMainType,setSelectedMainType] = useState("")                    // "pmain_type"
    
    const [subTypeList,setSubTypeList] = useState([]);
    const [selectedSubType,setSelectedSubType] = useState("")                      // "psub_type"
    
    const [purposeList,setPurposeList] = useState([]);
    const [purpose,setPurpose] = useState("")                      // "purpose"

    
    // models.ManyToManyField
    const [amenitiesList,setAmenitiesList] = useState([]);
    const [amenities,setAmenities] = useState([])                  // "amenities"

  
       
   
    
    useEffect(() => {
        console.log("AddProperty-loading=",loading)
        console.log("AddProperty-user=",user)
        
        if (!loading && !user) {
            router.push("/login");
        }

        if (!loading && user && ( user.role === "buyer") ){
                console.log('role=', user.role)
                toast.error( "You have no permission to reach this page"); 
                router.push("/myDashboard");
        } 
        
        // if (!loading && user && ( user.role === "admin" || user.role === "developer" || user.role === "broker" || user.role === "agent") ){
        //         setOwner(user.id)
        // } 
        
    }, [user, loading, router]);
    
    

    useEffect(() => {
        // getCountriesList
        const fetchCountryList = async () => {
            try {
                const data = await getCountriesList();
                setCountryList(data);             // ✅ save country list
                notify("The Main Types List is now get successfully", "success");
            
            } catch (error: any) {
                notify("Failed to get country List", "error");
                console.log("getCountryList-error =", error);
            }
        };
        fetchCountryList();

        // getMainTypesList
        const fetchMainTypesList = async () => {
                try {
                    const data = await getMainTypesList();
                    setMainTypeList(data);             // ✅ save the main type list
                    notify("The Main Types List is now get successfully", "success");
                
                } catch (error: any) {
                    notify("Failed to get Main Types List", "error");
                    console.log("getMainTypesList-error =", error);
                }
        };
        fetchMainTypesList();
    
        
        // getPurposeList
        const fetchPurposeList = async () => {
                try {
                    const data = await getPurposeList();
                    setPurposeList(data);             // ✅ save purpose list
                    notify("The purpose List is now get successfully", "success");
                
                } catch (error: any) {
                    notify("Failed to get Purpose List", "error");
                    console.log("getPurposeList-error =", error);
                }
        };
        fetchPurposeList();


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



   





    // getCountryCitiesList - send id of selected country to get cities list
    useEffect(() => {     
        // getCountryCitiesList
        if(selectedCountry){
            setCityList([])
            const fetchCityListForSelectedCountry = async (selectedCountry) => {
                console.log("fetchCityListForSelectedCountry-selectedCountry",selectedCountry)
                    try {
                        const data = await getCountryCitiesList(selectedCountry);
                        setCityList(data);             // ✅ save the result city list
                        notify("The cities List belong to selected country is now get successfully", "success");
                    
                    } catch (error: any) {
                        notify("Failed to get cities List belong to selected country", "error");
                        console.log(" fetchCityListForSelectedCountry-error =", error);
                    }
            };    
        fetchCityListForSelectedCountry(selectedCountry);
        }    
    }, [selectedCountry]);

    
    
   
    // getMainTypeSubTypesList - send id of selected MainType to get SubTypes list
    useEffect(() => {     
        // getMainTypeSubTypesList
        if(selectedMainType){
            setSubTypeList([])
            const fetchSubTypesListForSelectedMainType = async (selectedMainType) => {
                console.log("fetchSubTypesListForSelectedMainType-selectedMainType",selectedMainType)
                    try {
                        const data = await getMainTypeSubTypesList(selectedMainType);
                        setSubTypeList(data);             // ✅ save the result SubType List
                        notify("SubType List belong to selected MainType is now get successfully", "success");
                    
                    } catch (error: any) {
                        notify("Failed to get SubType List belong to selected MainType", "error");
                        console.log("fetchSubTypesListForSelectedMainType -error =", error);
                    }
            };    
        fetchSubTypesListForSelectedMainType(selectedMainType);
        }    
    }, [selectedMainType]);







    //  onChange
    ///////////////  FORM FIELDS  --- parse data from form field  
    const onChangeTitle = (e) => {
        setTitle(e.target.value);    
        console.log("onChangeTitle =", e.target.value);
    };
    const onChangeDescription = (e) => {
        setDescription(e.target.value)
        console.log('onChangeDescription =', e.target.value)
    };
    const onChangeSelectedMainType= (e) => {
        setSelectedMainType(e.target.value)
        console.log('onChangeSelectedMainType=', e.target.value)
    };
    const onChangeSelectedSubType= (e) => {
        setSelectedSubType(e.target.value)
        console.log('onChangeSelectedSubType=', e.target.value)
    };
    const onChangePurpose= (e) => {
        setPurpose(e.target.value)
        console.log('onChangePurpose =', e.target.value)
    };
    const onChangeSelectedCountry = (e) => {
        setSelectedCountry(e.target.value);     // this will be country.id
        console.log("onChangeSelectedCountry=", e.target.value);
    };
    const onChangeSelectedCity= (e) => {
        setSelectedCity(e.target.value)
        console.log('onChangeSelectedCity=', e.target.value)
    };
    const onChangeArea = (e) => {
        setArea(e.target.value)
        console.log('onChangeArea =', e.target.value)
    };
    const onChangeDistrict = (e) => {
        setDistrict(e.target.value);    
        console.log("onChangeDistrict =", e.target.value);
    };
    const onChangePlotNumber = (e) => {
        setPlotNumber(e.target.value)
        console.log('onChangePlotNumber =', e.target.value)
    };
    const onChangeLandNumber = (e) => {
        setLandNumber(e.target.value);     
        console.log("onChangeLandNumber =", e.target.value);
    };
    const onChangeAddressDetail = (e) => {
        setAddressDetail(e.target.value)
        console.log('onChangeAddressDetail =', e.target.value)
    };
    const onChangeLatitude= (e) => {
        setLatitude(e.target.value)
        console.log('onChangeLatitude =', e.target.value)
    };
    const onChangeLongitude= (e) => {
        setLongitude(e.target.value)
        console.log('onChangeLongitude =', e.target.value)
    };
    const onChangePrice= (e) => {
        setPrice(e.target.value)
        console.log('onChangePrice=', e.target.value)
    };
    const onChangeCurrency = (e) => {
        setCurrency(e.target.value);    
        console.log("onChangeCurrency =", e.target.value);
    };
    const onChangePropertyAge= (e) => {
        setPropertyAge(e.target.value)
        console.log('onChangePropertyAge =', e.target.value)
    };
    const onChangePropertySize= (e) => {
        setPropertySize(e.target.value)
        console.log('onChangePropertySize =', e.target.value)
    };
    const onChangePlotLength= (e) => {
        setPlotLength(e.target.value)
        console.log('onChangePlotLength =', e.target.value)
    };
    const onChangePlotWidth= (e) => {
        setPlotWidth(e.target.value)
        console.log('onChangePlotWidth =', e.target.value)
    };
    const onChangeBedrooms = (e) => {
        setBedrooms(e.target.value)
        console.log('onChangeBedrooms =', e.target.value)
    };
    const onChangeBathrooms= (e) => {
        setBathrooms(e.target.value)
        console.log('onChangeBathrooms =', e.target.value)
    };
    const onChangeFacade = (e) => {
        setFacade(e.target.value)
        console.log('onChangeFacade =', e.target.value)
    };
    const onChangeStreetWidth= (e) => {
        setStreetWidth(e.target.value)
        console.log('onChangeStreetWidth =', e.target.value)
    };
    const onChangeFurnishing = (e) => {
        setFurnishing(e.target.value);     
        console.log("onChangeFurnishing =", e.target.value);
    };
    const onChangeIsOccupied = (e) => {
        setIsOccupied(e.target.value)
        console.log('onChangeIsOccupied =', e.target.value)
    };
    const onChangeAvailableFrom= (e) => {
        setAvailableFrom(e.target.value)
        console.log('onChangeAvailableFrom =', e.target.value)
    };
   

    const onChangeAmenities= (e) => {
        setAmenities(e.target.value)
        console.log('onChangeAmenities =', e.target.value)
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
        
        if (!loading && !user){
            router.push('/login');
        }
        
        if (!title || !area || !district || !plotNumber || !landNumber || !addressDetail || !currency || !facade || !bedrooms || !bathrooms
           || !furnishing || !isOccupied || !description || !latitude || !propertyAge|| !longitude || !propertySize || !plotLength 
           || !plotWidth || !streetWidth || !price || !availableFrom || !selectedCountry || !selectedCity || !selectedMainType
           || !selectedSubType || !purpose || !amenities){
                    notify("Please fill the form fields !","warning");
                    return;
        }
       

        // Create FormData object
        // When uploading files in React with Axios, you must use FormData and not JSON.
        const formData = new FormData();
        // formData.append("owner",owner);
        formData.append("title",title);
        formData.append("area",area);
        formData.append("district",district);
        formData.append("plot_number", plotNumber );
        formData.append("land_number", landNumber);
        formData.append("address_detail", addressDetail);
        formData.append("currency", currency);
        formData.append("facade", facade );
        formData.append("furnishing", furnishing );
        formData.append("is_occupied", isOccupied);
        formData.append("bedrooms", bedrooms); 
        formData.append("bathrooms", bathrooms); 
        formData.append("property_age", propertyAge); 
        formData.append("description", description  );
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);
        formData.append("property_size", propertySize);     
        formData.append("plot_length", plotLength  );
        formData.append("plot_width", plotWidth);
        formData.append("street_width", streetWidth);
        formData.append("price", price);
        formData.append("available_from", availableFrom);
        formData.append("country", selectedCountry);
        formData.append("city", selectedCity);
        formData.append("pmain_type", selectedMainType);
        formData.append("psub_type", selectedSubType);
        formData.append("purpose", purpose);
        amenities.forEach(id => formData.append("amenities", id));  // multiple -- many to many relationship 



        console.log('formData=', formData);
        console.log('formData.title=', formData.get('title'));
        console.log('formData.selectedMainType=', formData.get('pmain_type'));
        console.log('formData.propertySize=', formData.get('property_size'));
        console.log('formData.price=', formData.get('price'));
        console.log('formData.bedrooms=', formData.get('bedrooms'));
        console.log('formData.bathrooms=', formData.get('bathrooms'));
        
        // console.log('formData.owner=', formData.get('owner'));    ---not need, will add later in backend -- request.user


        // // Only append if it's a File
        // if (ppicture instanceof File) {
        // formData.append("profile_picture", ppicture);
        // }
                
        // Log the values using the get method
        // console.log('formData.first_name=', formData.get('first_name'));
        
        



        // addProperty - axios //
        try {
            await addProperty(formData)
            notify("The Property has been add successfully", "success");

        }catch (error: any) {
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
        <section className="py-1 px-10 min-h-screen bg-gray-100 items-center">
              
            <nav className="flex pb-1" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                    <li className="inline-flex items-center">
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                        <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                        </svg>
                        Home
                    </Link>
                    </li>
                    <li>
                    <div className="flex items-center">
                        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                        </svg>
                        <a href="/myDashboard" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">My Dashboard</a>
                    </div>
                    </li>
                    <li aria-current="page">
                    <div className="flex items-center">
                        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                        </svg>
                        <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Add Property</span>
                    </div>
                    </li>
                </ol>
            </nav> 

            <hr className="text-gray-300"></hr>
                

            <div className=" mx-auto shadow-2xl rounded-2xl p-6 mt-5 mb-5 bg-sky-200">
                <form onSubmit={handleSubmit} className="space-y-12">
                <ToastContainer position="top-center" autoClose={3000} />
                    
                    {/*  title  ---   */}
                    <div className="md:w-full flex">
                        {/* insert title */}
                        <div>
                            <label className="block text-sm font-medium">Title</label>
                            <input
                                name="title"
                                value={title}
                                onChange={onChangeTitle}
                                className="mt-2 p-3 w-full border rounded-lg bg-white"
                                placeholder="Insert Title"
                            />
                        </div>
                    </div>


                    {/*  description   ---   */}
                    <div className="w-full" >
                        <div>
                            <label className="block text-sm font-medium">Description</label>
                            <input
                                name="description"
                                value={description}
                                onChange={onChangeDescription}
                                className="mt-2 p-3 w-full border rounded-lg bg-white"
                                placeholder="Insert Description"
                            />
                        </div>
                    </div>
                   
                   

                    {/*  MainType --- SubType  */}
                    <div className="md:w-full flex">
                        {/* selectedMainType from a dynamic mainTypesList */}
                        <div className="m-2">
                            <label className="block text-sm font-medium">Main Type</label>
                            <select
                                value={selectedMainType}
                                onChange={onChangeSelectedMainType}
                                className="mt-2 p-3 w-full border rounded-lg relative z-50 bg-white"
                            >
                                <option value="">-- Select a Main Type --</option>
                                {mainTypesList.map((mtobj) => (
                                    <option key={mtobj.id} value={mtobj.id}>
                                        {mtobj.maintype_label}   {/* use label here */}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* selectedSubType from a dynamic subTypeList */}
                        <div className="m-2">
                            <label className="block text-sm font-medium">Sub Type</label>
                            <select
                                value={selectedSubType}
                                onChange={onChangeSelectedSubType}
                                className="mt-2 p-3 w-full border rounded-lg relative z-50 bg-white"
                            >
                                <option value="">-- Select a Sub Type --</option>
                                {subTypeList.map((stobj) => (
                                    <option key={stobj.id} value={stobj.id}>
                                        {stobj.subtype_name}  
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    


                    {/* Select a -purpose  -  from a dynamic purpose list */}
                    <div className="">
                        <div>
                            <label className="block text-sm font-medium">Purpose</label>
                            <select
                                value={purpose}
                                onChange={onChangePurpose}
                                className="mt-2 p-3 w-full border rounded-lg relative z-50 bg-white"
                            >
                                <option value="">-- Select Purpose --</option>
                                {purposeList.map((purposeobj) => (
                                    <option key={purposeobj.id} value={purposeobj.id}>
                                        {purposeobj.purpose_name} 
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>


                    <br></br><br></br>
                    <p className="text-center"> - - - -   Location  - - - -</p>
                    {/*  Country  --- City   */}
                    <div className="md:w-full flex">
                        {/* Select a Country from a dynamic counrty list */}
                        <div className="m-2">
                            <label className="block text-sm font-medium">Country</label>
                            <select
                                value={selectedCountry}
                                onChange={onChangeSelectedCountry}
                                className="mt-2 p-3 w-full border rounded-lg relative z-50 bg-white"
                            >
                                <option value="">-- Select a Country --</option>
                                {countryList.map((co) => (
                                    <option key={co.id} value={co.id}>
                                        {co.country_name} ({co.code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Select a City from a dynamic city list */}
                        <div className="m-2">
                            <label className="block text-sm font-medium">City</label>
                            <select
                                value={selectedCity}
                                onChange={onChangeSelectedCity}
                                className="mt-2 p-3 w-full border rounded-lg relative z-50 bg-white"
                            >
                                    <option value="">-- Select City --</option>
                                    {cityList.map((ci) => (
                                        <option key={ci.id} value={ci.id}>
                                            {ci.city_name} 
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>
                

                    {/*  area - district   */}
                    <div className="md:w-full flex">
                        {/* Area */}
                        <div className="m-2">
                            <label className="block text-sm font-medium">Area</label>
                            <input
                                name="area"
                                value={area}
                                onChange={onChangeArea}
                                className="mt-2 p-3 w-full border rounded-lg bg-white"
                                placeholder="Insert Area"
                            />
                        </div>

                        {/* District */}
                        <div className="m-2">
                            <label className="block text-sm font-medium">District</label>
                            <input
                                name="district"
                                value={district}
                                onChange={onChangeDistrict}
                                className="mt-2 p-3 w-full border rounded-lg bg-white"
                                placeholder="Insert District"
                            />
                        </div>
                    </div>


                    {/*  PlotNumber - district   */}
                    <div className="md:w-full flex">
                        {/* PlotNumber */}
                        <div className="m-2">
                            <label className="block text-sm font-medium">Plot Number</label>
                            <input
                                name="plotNumber"
                                value={plotNumber}
                                onChange={onChangePlotNumber}
                                className="mt-2 p-3 w-full border rounded-lg bg-white"
                                placeholder="Insert Plot Number"
                            />
                        </div>

                        {/* LandNumber */}
                        <div className="m-2">
                            <label className="block text-sm font-medium">Land Number</label>
                            <input
                                name="landNumber"
                                value={landNumber}
                                onChange={onChangeLandNumber}
                                className="mt-2 p-3 w-full border rounded-lg bg-white "
                                placeholder="Insert Land Number"
                            />
                        </div>
                    </div>
                
                
                    {/* onChangeAddressDetail  */}
                    <div className="w-full">
                        {/* insert Address Detail */}
                        <div>
                            <label className="block text-sm font-medium">Address Detail</label>
                            <input
                                name="addressDetail"
                                value={addressDetail}
                                onChange={onChangeAddressDetail}
                                className="mt-2 p-3 w-full border rounded-lg bg-white"
                                placeholder="Insert Address Detail"
                            />
                        </div>
                    </div>

                    {/*  Latitude  -- Longitude  */}
                    <div className="md:w-full flex">
                        {/* Latitude */}
                        <div className="m-2">
                            <label className="block text-sm font-medium">Latitude</label>
                            <input
                                name="latitude"
                                value={latitude}
                                onChange={onChangeLatitude}
                                className="mt-2 p-3 w-full border rounded-lg bg-white"
                                placeholder="Insert Latitude"
                            />
                        </div>

                        {/* Longitude */}
                        <div className="m-2">
                            <label className="block text-sm font-medium">Longitude</label>
                            <input
                                name="longitude"
                                value={longitude}
                                onChange={onChangeLongitude}
                                className="mt-2 p-3 w-full border rounded-lg bg-white "
                                placeholder="Insert Longitude"
                            />
                        </div>
                    </div> 


                    <br></br><br></br>
                    <p className="text-center"> - - - -   other description   - - - -</p>
                    {/*  Price  -- Currency  */}
                    <div className="md:w-full flex">
                        {/* Price */}
                        <div className="m-2">
                            <label className="block text-sm font-medium">Price</label>
                            <input
                                name="price"
                                value={price}
                                onChange={onChangePrice}
                                className="mt-2 p-3 w-full border rounded-lg bg-white"
                                placeholder="Insert Price"
                            />
                        </div>

                        {/* Currency */}
                        <div className="m-2">
                            <label className="block text-sm font-medium">Currency</label>
                            <input
                                name="currency"
                                value={currency}
                                onChange={onChangeCurrency}
                                className="mt-2 p-3 w-full border rounded-lg bg-white "
                                placeholder="Insert Currency"
                            />
                        </div>
                    </div>

                    
                    
                    {/*  PropertyAge -- PropertySize  */}
                    <div className="md:w-full flex">
                        {/* PropertyAge */}
                        <div className="m-2">
                            <label className="block text-sm font-medium">Property Age (in years)</label>
                            <input
                                name="propertyAge"
                                value={propertyAge}
                                onChange={onChangePropertyAge}
                                className="mt-2 p-3 w-full border rounded-lg bg-white"
                                placeholder="Insert Property Age"
                            />
                        </div>

                        {/* PropertySize */}
                        <div className="m-2">
                            <label className="block text-sm font-medium">Property Size (Size in sqm)</label>
                            <input
                                name="propertySize"
                                value={propertySize}
                                onChange={onChangePropertySize}
                                className="mt-2 p-3 w-full border rounded-lg bg-white "
                                placeholder="Insert Property Size"
                            />
                        </div>
                    </div>

                    
                    {/*  PlotLength -- PlotWidth  */}
                    <div className="md:w-full flex">
                        {/* PlotLength */}
                        <div className="m-2">
                            <label className="block text-sm font-medium">Plot Length (in meters)</label>
                            <input
                                name="plotLength"
                                value={plotLength}
                                onChange={onChangePlotLength}
                                className="mt-2 p-3 w-full border rounded-lg bg-white"
                                placeholder="Insert Plot Length"
                            />
                        </div>

                        {/* PlotWidth */}
                        <div className="m-2">
                            <label className="block text-sm font-medium">Plot Width (in meters)</label>
                            <input
                                name="plotWidth"
                                value={plotWidth}
                                onChange={onChangePlotWidth}
                                className="mt-2 p-3 w-full border rounded-lg bg-white "
                                placeholder="Insert Plot Width"
                            />
                        </div>
                    </div>



                    {/*  Bedrooms -- Pathrooms  */}
                    <div className="md:w-full flex">
                        {/* Bedrooms */}
                        <div className="m-2">
                            <label className="block text-sm font-medium">Bedrooms(Number)</label>
                            <input
                                name="bedrooms"
                                value={bedrooms}
                                onChange={onChangeBedrooms}
                                className="mt-2 p-3 w-full border rounded-lg bg-white"
                                placeholder="Insert the number of bedrooms"
                            />
                        </div>

                        {/* Bathrooms */}
                        <div className="m-2">
                            <label className="block text-sm font-medium">Bathrooms(Number)</label>
                            <input
                                name="bathrooms"
                                value={bathrooms}
                                onChange={onChangeBathrooms}
                                className="mt-2 p-3 w-full border rounded-lg bg-white "
                                placeholder="Insert the number of bathrooms"
                            />
                        </div>
                    </div>



                    {/*  Facade -- Street Width  */}
                    <div className="md:w-full flex">
                        {/* Facade*/}
                        <div className="m-2">
                            <label className="block text-sm font-medium">Facade</label>
                            <select
                                name="facade"
                                value={facade}
                                onChange={onChangeFacade}
                                className="mt-2 w-full p-3 border rounded-lg bg-white"
                            >
                                <option value="">-- Select Faced Direction --</option>
                                <option value="north">North</option>
                                <option value="south">South</option>
                                <option value="east">East</option>
                                <option value="west">West</option>
                            </select>
                        </div>

                        {/* Street Width */}
                        <div className="m-2">
                            <label className="block text-sm font-medium">Street Width(Meter)</label>
                            <input
                                name="streetWidth"
                                value={streetWidth}
                                onChange={onChangeStreetWidth}
                                className="mt-2 p-3 w-full border rounded-lg bg-white "
                                placeholder="Insert the Street Width"
                            />
                        </div>
                    </div>


                    {/*  Furnishing */}
                    <div className="md:w-full flex">
                        {/* Furnishing */}
                        <div className="m-2">
                            <label className="block text-sm font-medium">Furnishing</label>
                            <select
                                name="furnishing"
                                value={furnishing}
                                onChange={onChangeFurnishing}
                                className="mt-2 w-full p-3 border rounded-l bg-white"
                            >
                                <option value="">-- Select Furnishing --</option>
                                <option value="furnished">Furnished</option>
                                <option value="unfurnished">Unfurnished</option>
                                <option value="partly">Partly Furnished</option>
                            </select>
                        </div>

                        
                    </div>



                    {/*  IsOccupied  -- AvailableFrom  */}
                    <div className="md:w-full flex">
                        {/* IsOccupied */}
                        <div className="m-2">
                            <label className="block text-sm font-medium">Is Occupied ?</label>
                            <select
                                name="isOccupied"
                                value={isOccupied}
                                onChange={onChangeIsOccupied}
                                className="mt-2 w-full p-3 border rounded-l bg-white"
                            >
                                <option value="">-- Select Occupancy --</option>
                                <option value="true">Occupied</option>
                                <option value="false">Not Occupied</option>
                            </select>
                        </div>
                         {/* AvailableFrom */}
                        <div className="m-2">
                            <label className="block text-sm font-medium">Available From</label>
                            <input
                                type="date"
                                name="availableFrom"
                                value={availableFrom}
                                onChange={onChangeAvailableFrom}
                                className="mt-2 p-3 w-full border rounded-lg bg-white"
                                placeholder="Available From"
                            />
                        </div>
                    </div>

                    
                   


                    {/* Select a - Amenities List -  from a dynamic Amenities List */}
                    <div className="md:w-full">
                        <div>
                            <label className="block text-sm font-medium">Amenities</label>
                            <select 
                                multiple 
                                value={amenities}
                                className="mt-2 p-3 w-full border rounded-lg relative z-50 bg-white"
                                onChange={(e) => 
                                    setAmenities([...e.target.selectedOptions].map(o => o.value))
                                }
                            >
                                    {amenitiesList.map((amenityobj) => (
                                        <option key={amenityobj.id} value={amenityobj.id}>
                                            {amenityobj.amenity_name}
                                        </option>
                                    ))}
                            </select>

                        </div>
                    </div>



                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                    >
                        Add Property
                    </button>
                </form>
            </div>
        </section>
        </>
    );
};