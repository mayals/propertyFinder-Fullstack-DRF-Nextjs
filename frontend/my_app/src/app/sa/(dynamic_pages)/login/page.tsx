//  login.page.js

"use client"
import { useState } from "react";
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
    const [password, setPassword] = useState("")
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
        <section className="min-h-screen bg-[#F2F2F2] flex flex-col justify-center items-center px-4 py-8">
            <div className="text-gray-600 font-bold text-2xl sm:text-3xl my-3 text-center">
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
              className="bg-[#B6B09F] p-6 sm:p-8 rounded-lg w-full max-w-md md:max-w-lg lg:max-w-xl space-y-4"
            >
              

              
              {/* email field  */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm sm:text-base">Email</label>
                <input
                  className="text-gray-600 bg-gray-100 p-2 rounded"
                  placeholder="Enter your email address"
                  type="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* password field  */}
              <div className="flex flex-col">
                <label className="mb-1 text-sm sm:text-base">Password</label>
                <input
                  className="text-gray-600 bg-gray-100 p-2 rounded"
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* . submit button  */}
              <div className="flex justify-between items-center">
                  <button
                  className="bg-gray-600 hover:bg-sky-700 text-white p-2 rounded transition-colors duration-200"
                  type="submit"
                  >
                    Login
                  </button>
                  <p>
                      <Link href="/forgotPassword">
                        <span className="no-underline text-gray-600 hover:underline hover:text-blue-600"> Forgot Password?</span>
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