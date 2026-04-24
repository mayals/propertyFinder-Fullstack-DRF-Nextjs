//  login.page.js

"use client"
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { loginUser, handleResendEmail } from "../../utils/auth";
// react-toastify
import notify from "../../common/useNotification"
import { ToastContainer, toast } from 'react-toastify';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext';
import axios from "axios";
const API_URL = "http://127.0.0.1:8000";


export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
    // const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorConfirmEmailMsg, setErrorConfirmEmailMsg] = useState('');
    
    const router = useRouter();

    // AuthContext
    const { setUser } = useAuth();
       
    const handleSubmit = async (e) => {
        e.preventDefault();
        // setIsSubmitting(true);
        setErrorConfirmEmailMsg('');

        //  check email field is not empty
        if (email === "" ) {
          notify("Please enter the Email!","warning");
          // setIsSubmitting(false);
          return;
        }
        //  check password is not empty
        if (password === "" ) {
          notify("Please enter  Password !","warning");
          // setIsSubmitting(false);
          return;
        }

        // data inserted in fields
        console.log('email=', email);
        console.log('password=', password);

        // axios api
        // login success
        try { 
                // Step 1: Call login endpoint
                // axios -success
                await loginUser(email,password)
                notify("login successful!", "success");

                try {
                      // Step 2: Fetch request-user-profile info
                      const res = await axios.get(`${API_URL}/users/request-user-profile/`, 
                          {withCredentials: true,}  // IMPORTANT to include cookies    
                      );
                      console.log('LoginPage-RequestUserProfileData-res.data.user=', res.data);
                      // Step 3: Update AuthContext
                      setUser(res.data); // assume backend returns user info
                
                      // ✅ Delay for 3 seconds before redirecting
                      setTimeout(() => {
                          router.push('/sa/');
                      }, 3000); // 3000 milliseconds = 5 seconds
                
                
                    } catch (err) {
                      console.log('RequestUserProfileData-error=',err);
                      setUser(null); // not logged in
                }
             
 
        // login error  
        } catch (error) {
            // error come from backend
            console.log('error=', error);
            console.log('error?.response?.data?.non_field_errors=', error?.response?.data?.non_field_errors);

            if (
              error?.response?.data?.non_field_errors &&
              error?.response?.data?.non_field_errors[0].includes("Email is not verified.")
                ) {
                 
                  setTimeout(() => {
                      console.log('yes include Email is not verified.')
                      notify("Email is not verified.", "error");
                      // ✅ Delay for 5 seconds before redirecting
                      setErrorConfirmEmailMsg("Email is not verified. Click below to verify.")
                     
                  }, 5000); // 5000 milliseconds = 5 seconds
                   return;
                }
            
            if (
                error?.response?.data?.non_field_errors &&
                error?.response?.data?.non_field_errors[0].includes("Incorrect credentials.")
                ) {
                  console.log('yes include Incorrect credentials.')
                  notify("Incorrect credentials.", "error");
                  return;
              
            }else{
                // Show all validation errors come from backend serializer error filds message
                Object.entries(error).forEach(([field, messages]) => {
                  if (Array.isArray(messages)) {
                    messages.forEach((msg) => notify(`${field}: ${msg}`, "error"));
                  } else {
                    notify(`${field}: ${messages}`, "error");
                  }
                });
            
            }

      }

    };

	  return (
      <>
        <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col justify-center items-center px-4 py-8">
            <div className="text-gray-800 font-bold text-3xl sm:text-4xl my-4 text-center">
              <h1>Login</h1>
            </div>

            {/* error message shown only if Email is not verified */}
            { !errorConfirmEmailMsg !== "Email is not verified. Click below to verify." && (
                <ToastContainer position="top-center" autoClose={3000} />
            )}

            {/*  errorConfirmEmailMsg message  */}
            {errorConfirmEmailMsg && (
                <div className="rounded border-4 border-red-600 bg-gray-200 text-gray-700 p-3  space-y-2 w-full max-w-md my-4">
                  <p>{errorConfirmEmailMsg}</p>
                  <button
                        className="font-semibold no-underline hover:underline hover:text-blue-600 hover:cursor-pointer"
                        onClick={async () => {
                          try {
                            await handleResendEmail(email);
                            notify("To complete account activation, please check your Email, Confirmation email link sent to your Email.", "info");
                          
                          } catch (err) {
                            console.log("handleResendEmail- err=", err);
                            notify("Failed to resend confirmation email. Please try again.", "error");
                          }
                        }}
                        
                      >
                        Send confirmation Link to my Email
                  </button>

                </div>
            )}




            
            
            
            {/*  form  */}
            <form
              noValidate
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md md:max-w-lg lg:max-w-xl space-y-6"
            >
              

              
              {/* email field  */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm sm:text-base font-medium text-gray-700">Email</label>
                <input
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your email address"
                  type="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* password field  */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm sm:text-base font-medium text-gray-700">Password</label>
                <div className="relative">
                    <input
                      className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
              </div>

              {/* . submit button  */}
              <div className="flex justify-between items-center">
                  <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200"
                  type="submit"
                  >
                    Login
                  </button>
                  <p>
                      <Link href="/forgotPassword">
                        <span className="no-underline text-blue-600 hover:underline hover:text-blue-700"> Forgot Password?</span>
                      </Link>
                  </p>
              </div>
            </form>

            <div className="p-4 text-gray-600 text-xl">
                <p>Don&apos;t have an account? 
                    <Link href="/register/buyer">
                        <span className="no-underline text-blue-700 hover:underline hover:text-blue-600"> Sign Up</span>
                    </Link>
                </p>
            </div>
        </section>
      </>
	  );
}