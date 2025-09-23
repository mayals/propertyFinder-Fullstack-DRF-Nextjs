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
                country:selectedCountry,               // data --"uuid-of-selected-country",
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
    




