// src/app/utils/property.js
import axiosInstance from "../lib/axios";
import axios from "axios";
const API_URL = "http://127.0.0.1:8000";
import { useAuth, } from "../context/AuthContext";






// addCountry //
export const addCountry = async(countryName , code) => {
        console.log('addCountry-countryName =', countryName );
        console.log('addCountry-code=', code);
    try {
        const response = await axiosInstance.post(
            "/property/create-country/",                  // endpoint
            {
                country_name:countryName ,                // data
                code:code 
            },
            {                          
                withCredentials:true,                     //  sending cookies
            },        
        )
        console.log("addCountry-response.data=",response.data)
        return response.data;
    

    } catch (e) {
        if (e) {
        // Throw full error object for the component to handle
        console.log('addCountry-e=',e)
        throw e;
        
        } else {
        throw { error: "Something went wrong." };
        }
    }
}
    



// getCountriesList  //
export const getCountriesList = async() => {
    try {
        const response = await axios.get(
            `${API_URL}/property/list-country/`,        // endpoint 
            { withCredentials:true },                  //  sending cookies          
        )
        console.log("getCountriesList-response.data=",response.data);
        return response.data;


    } catch (e) {
        if (e) {
        // Throw full error object for the component to handle
        console.log('addCountry-e=',e)
        throw e;
        
        } else {
        throw { error: "Something went wrong." };
        }
    }
}
    

// addCity //
export const addCity = async(selectedCountry, cityName) => {
        console.log('addCity-selectedCountry =', selectedCountry );
        console.log('addCity-cityName=', cityName);
    try {
        const response = await axiosInstance.post(
            "/property/create-city/",                  // endpoint
            {
                country:selectedCountry,               // data --"id of selected country",
                city_name:cityName                     // data --"city name",
            },                 
            {
                 withCredentials:true                  // sending cookies   
            },                         
        )
        console.log("addCity-response.data=",response.data)
        return response.data;
    
    } catch (e) {
        if (e) {
            // Throw full error object for the component to handle
            console.log('addCity-e=',e)
            throw e;
        
        } else {
            throw { error: "Something went wrong." };
        }
    }
}
    




// addMainTypeName //
export const addMainType = async(maintypeName) => {
        console.log('addMainType-maintypeName =', maintypeName );
    try {
        const response = await axiosInstance.post(
            "/property/create-main-type/",             // endpoint
            {
                maintype_name:maintypeName,               // data --"maintypeName",
            },                 
            {
                 withCredentials:true                  // sending cookies   
            },                         
        )
        console.log("addMainType-response.data=",response.data)
        return response.data;
    
    } catch (e) {
        if (e) {
            // Throw full error object for the component to handle
            console.log('addMainType-e=',e)
            throw e;
        
        } else {
            throw { error: "Something went wrong." };
        }
    }
}
    



// getMainTypesList //
export const getMainTypesList = async() => {
    try {
        const response = await axios.get(
            `${API_URL}/property/list-main-type/`,        // endpoint 
            { withCredentials:true },                  //  sending cookies          
        )
        console.log("getMainTypesList-response.data=",response.data);
        return response.data;


    } catch (e) {
        if (e) {
        // Throw full error object for the component to handle
        console.log('getMainTypesList-e=',e)
        throw e;
        
        } else {
        throw { error: "Something went wrong." };
        }
    }
}
    



// addSubType //
export const addSubType = async(selectedMaintype, subTypeName) => {
        console.log('addSubType-selectedMaintype =', selectedMaintype );
        console.log('addSubType-subTypeName=', subTypeName);
    try {
        const response = await axiosInstance.post(
            "/property/create-sub-types/",                  // endpoint
            {
                main_type   :selectedMaintype,               // data --"id of selected main type",
                subtype_name:subTypeName                     // data --"sub type name",
            },                 
            {
                 withCredentials:true                       // sending cookies   
            },                         
        )
        console.log("addSubType-response.data=",response.data)
        return response.data;
    
    } catch (e) {
        if (e) {
            // Throw full error object for the component to handle
            console.log('addCity-e=',e)
            throw e;
        
        } else {
            throw { error: "Something went wrong." };
        }
    }
}
    




// addPurpose //
export const addPurpose = async(selectedMaintype, purposeName) => {
        console.log('addPurpose-selectedMaintype =', selectedMaintype );
        console.log('addPurpose-purposeName=', purposeName);
    try {
        const response = await axiosInstance.post(
            "/property/create-purpose/",                  // endpoint
            {
                main_type   :selectedMaintype,          // data --id of selected property "main type",
                purpose_name:purposeName                // data --"purpose_name",
            },                 
            {
                 withCredentials:true                  // sending cookies   
            },                         
        )
        console.log("addPurpose-response.data=",response.data)
        return response.data;
    
    } catch (e) {
        if (e) {
            // Throw full error object for the component to handle
            console.log('addPurpose-e=',e)
            throw e;
        
        } else {
            throw { error: "Something went wrong." };
        }
    }
}