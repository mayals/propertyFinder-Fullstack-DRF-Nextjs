"use client";


import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getMainTypesList, getCountriesList, getPurposeList, getAmenitiesList  } from "../../utils/property";
// import {  getSubTypesList , getCityList , addProperty } from "../../utils/property";


import axiosInstance from "../../lib/axios";

import Loading from "../../components/loading/Loading";
// react-toastify
import notify from "../../common/useNotification"
import { ToastContainer, toast } from 'react-toastify';




export default function AddProperty() {
    const { user, loading } = useAuth();
    const router = useRouter();
   
    // models.ForeignKey --- current user  -- from useAuth()
    const [owner,setOwner] = useState("")    // "owner"
    
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
    const [price,setPrice] = useState("")   // "price"


    // models.DateField
    const [availableFrom,setAvailableFrom] = useState("")        // "available_from" 
    
    
    // models.ForeignKey
    const [countryList,setCountryList] = useState([]);           
    const [country,setCountry] = useState("")                     // "country"
    const [cityList,setCityList] = useState([]);                   
    const [city,setCity] = useState("")                           // "city"
    
    const [mainTypesList,setMainTypeList] = useState([]);
    const [mainType,setMainType] = useState("")                    // "pmain_type"
    const [subTypeList,setSubTypeList] = useState([]);
    const [subType,setSubType] = useState("")                      // "psub_type"
    
    const [purposeList,setPurposeList] = useState([]);
    const [purpose,setPurpose] = useState("")                      // "purpose"

    
    // models.ManyToManyField
    const [amenitiesList,setAmenitiesList] = useState([]);
    const [amenities,setAmenities] = useState("")                  // "amenities"

  
       
   
    
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

    

    // get country- CityList
    // useEffect(() => { 
    //     // getCityList
    //     const fetchCityList = async (country) => {
    //             try {
    //                 const data = await getCityList(country);
    //                 setCityList(data);             // ✅ save city list
    //                 notify("The Main Types List is now get successfully", "success");
                
    //             } catch (error: any) {
    //                 notify("Failed to get Main Types List", "error");
    //                 console.log("getMainTypesList-error =", error);
    //             }
    //     };
    //     fetchCityList(country);

    // }, [country]);
    
    
    // get mainType - SubTypeList
    useEffect(() => {     
        // getSubTypeList
        const fetchSubTypeList = async (mainType) => {
                try {
                    const data = await getSubTypesList(mainType);
                    setSubTypeList(data);             // ✅ save city list
                    notify("The Main Types List is now get successfully", "success");
                
                } catch (error: any) {
                    notify("Failed to get Main Types List", "error");
                    console.log("getMainTypesList-error =", error);
                }
        };
        fetchSubTypeList(mainType);

    }, [mainType]);







    //  onChange
    ///////////////  FORM FIELDS  --- parse data from form field  
    const onChangeTitle = (e) => {
        setTitle(e.target.value);     // this will be country.id
        console.log("onChangeTitle =", e.target.value);
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
    const onChangeCurrency = (e) => {
        setCurrency(e.target.value);    
        console.log("onChangeCurrency =", e.target.value);
    };
    const onChangeFacade = (e) => {
        setFacade(e.target.value)
        console.log('onChangeFacade =', e.target.value)
    };
    const onChangeFurnishing = (e) => {
        setFurnishing(e.target.value);     
        console.log("onChangeFurnishing =", e.target.value);
    };
    const onChangeIsOccupied = (e) => {
        setIsOccupied(e.target.value)
        console.log('onChangeIsOccupied =', e.target.value)
    };
    const onChangeDescription = (e) => {
        setDescription(e.target.value)
        console.log('onChangeDescription =', e.target.value)
    };
    const onChangeBedrooms = (e) => {
        setBedrooms(e.target.value)
        console.log('onChangeBedrooms =', e.target.value)
    };
    const onChangeBathrooms= (e) => {
        setBathrooms(e.target.value)
        console.log('onChangeBathrooms =', e.target.value)
    };
    const onChangePropertyAge= (e) => {
        setPropertyAge(e.target.value)
        console.log('onChangePropertyAge =', e.target.value)
    };
    const onChangeLatitude= (e) => {
        setLatitude(e.target.value)
        console.log('onChangeLatitude =', e.target.value)
    };
    const onChangeLongitude= (e) => {
        setLongitude(e.target.value)
        console.log('onChangeLongitude =', e.target.value)
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
    const onChangeStreetWidth= (e) => {
        setStreetWidth(e.target.value)
        console.log('onChangeStreetWidth =', e.target.value)
    };
    const onChangePrice= (e) => {
        setPrice(e.target.value)
        console.log('onChangePrice =', e.target.value)
    };
    const onChangeAvailableFrom= (e) => {
        setAvailableFrom(e.target.value)
        console.log('onChangeAvailableFrom =', e.target.value)
    };
    const onChangeCountry= (e) => {
        setCountry(e.target.value)
        console.log('onChangeCountry =', e.target.value)
    };
    const onChangeCity= (e) => {
        setCity(e.target.value)
        console.log('onChangeCity =', e.target.value)
    };
    const onChangeMainType= (e) => {
        setMainType(e.target.value)
        console.log('onChangeMainType =', e.target.value)
    };
    const onChangeSubType= (e) => {
        setSubType(e.target.value)
        console.log('onChangeSubType =', e.target.value)
    };
    const onChangePurpose= (e) => {
        setPurpose(e.target.value)
        console.log('onChangePurpose =', e.target.value)
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

        if (!title || !area || !district || !plotNumber || !landNumber || !addressDetail || !currency || !facade
           || !furnishing || !isOccupied || !description || !latitude || !propertyAge|| !longitude || !propertySize || !plotLength 
           || !plotWidth || !streetWidth || !price || !availableFrom || !country || !city || !mainType
           || !subType || !purpose || !amenities){
                    notify("Please fill the form fields !","warning");
                    return;
        }
       

        // Create FormData object
        // When uploading files in React with Axios, you must use FormData and not JSON.
        const formData = new FormData();
        formData.append("title", title );
        formData.append("Area", area );
        formData.append("district", district);
        formData.append("plot_number", plotNumber );
        formData.append("land_number", landNumber);
        formData.append("address_detail", addressDetail);
        formData.append("currency", currency);
        formData.append("facade", facade );
        formData.append("furnishing", furnishing );
        formData.append("is_occupied", isOccupied);
        formData.append("property_age", propertyAge); 
        formData.append("description  ", description  );
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);
        formData.append("property_size", propertySize);     
        formData.append("plot_length", plotLength  );
        formData.append("plot_width", plotWidth);
        formData.append("street_width", streetWidth);
        formData.append("price", price);
        formData.append("available_from", availableFrom);
        formData.append("country", country);
        formData.append("city", city);
        formData.append("pmain_type", mainType);
        formData.append("psub_type", subType);
        formData.append("purpose", purpose);
        formData.append("amenities", amenities);

        // // Only append if it's a File
        // if (ppicture instanceof File) {
        // formData.append("profile_picture", ppicture);
        // }
                
        // Log the values using the get method
        // console.log('formData.first_name=', formData.get('first_name'));
        
        



        // addProperty - axios //
        // try { 
        //       await addProperty(formData)
        //       notify("The Property has been add successfully", "success");

        // }catch (error: any) {
        //     console.log("addPurpose error =", error);
        //     if (error.response && error.response.data) {
        //             const errors = error.response.data;

        //             Object.entries(errors).forEach(([field, messages]) => {
        //             if (Array.isArray(messages)) {
        //                 messages.forEach((msg) => notify(`${field}: ${msg}`, "error"));
        //             } else {
        //                 notify(`${field}: ${messages}`, "error");
        //             }
        //             });

        //     } else {
        //             notify("Something went wrong, please try again.", "error");
        //     }
        // }
    }


    return (
        <>
        <section className="py-1 min-h-screen bg-gray-100  flex items-center ">
              
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
                        <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">Add City</span>
                    </div>
                    </li>
                </ol>
            </nav> 

            <hr className="text-gray-300"></hr>
                

            <div className=" mx-auto bg-white shadow-2xl rounded-2xl p-6 mt-5 mb-5">
                <form onSubmit={handleSubmit} className="space-y-12">
                <ToastContainer position="top-center" autoClose={3000} />
                    
                    {/* Select a Country from a dynamic counrty list */}
                    <div className="md:w-full">
                        <div>
                            <label className="block text-sm font-medium">Country</label>
                            <select
                                value={country}
                                onChange={onChangeCountry}
                                className="mt-2 p-3 w-full border rounded-lg relative z-50 bg-white"
                            >
                                <option value="">-- Select a Country --</option>
                                {countryList.map((country) => (
                                    <option key={country.id} value={country.id}>
                                    {country.country_name} ({country.code})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                

                    {/* Select a - main type -  from a dynamic main type list */}
                    <div className="md:w-full">
                        <div>
                            <label className="block text-sm font-medium">Main Type</label>
                            <select
                                value={mainType}
                                onChange={onChangeMainType}
                                className="mt-2 p-3 w-full border rounded-lg relative z-50 bg-white"
                            >
                                <option value="">-- Select a Main Type --</option>
                                {mainTypesList.map((mtypeobj) => (
                                    <option key={mtypeobj.id} value={mtypeobj.id}>
                                        {mtypeobj.maintype_label}   {/* use label here */}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    

                    {/* Select a -purpose  -  from a dynamic purpose list */}
                    <div className="md:w-full">
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


                    {/* Select a - Amenities List -  from a dynamic Amenities List */}
                    <div className="md:w-full">
                        <div>
                            <label className="block text-sm font-medium">Amenities</label>
                            <select
                                value={amenities}
                                onChange={onChangeAmenities}
                                className="mt-2 p-3 w-full border rounded-lg relative z-50 bg-white"
                            >
                                <option value="">-- Select Amenities --</option>
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