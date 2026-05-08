//  login.page.tsx

"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { loginUser, handleResendEmail } from "../../utils/auth";
// react-toastify
import notify from "../../common/useNotification";
import { ToastContainer, toast } from 'react-toastify';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from "../../lib/axios";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorConfirmEmailMsg, setErrorConfirmEmailMsg] = useState('');

    const router = useRouter();

    // AuthContext
    const { setUser } = useAuth();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        //  check email field is not empty
        if (email === "") {
            notify("Please enter the Email!", "warning");
            return;
        }
        //  check password is not empty
        if (password === "") {
            notify("Please enter  Password!", "warning");
            return;
        }

        // axios api
        try {
            // Step 1: Call login endpoint
            await loginUser(email, password);
            notify("login successful!", "success");

            try {
                // Step 2: Fetch request-user-profile info
                const res = await axiosInstance.get(`/users/request-user-profile/`, {
                    withCredentials: true,
                });
                console.log('LoginPage-RequestUserProfileData-res.data=', res.data);
                // Step 3: Update AuthContext
                setUser(res.data); // assume backend returns user info

                // ✅ Delay for 3 seconds before redirecting
                setTimeout(() => {
                    const role = res.data.role;
                    if (role === 'admin') router.push('/sa/my-profile/admin');
                    else if (role === 'buyer') router.push('/sa/my-profile/buyer');
                    else if (role === 'broker') router.push('/sa/my-profile/broker');
                    else if (role === 'agent') router.push('/sa/my-profile/agent');
                    else router.push('/sa/');
                }, 3000);

            } catch (err) {
                console.log('RequestUserProfileData-error=', err);
                setUser(null); // not logged in
            }

        // login error
        } catch (error: any) {
            console.log('error=', error);
            console.log('error?.response?.data?.non_field_errors=', error?.response?.data?.non_field_errors);

            if (
                error?.response?.data?.non_field_errors &&
                error?.response?.data?.non_field_errors[0].includes("Email is not verified.")
            ) {
                setTimeout(() => {
                    console.log('yes include Email is not verified.');
                    notify("Email is not verified.", "error");
                    setErrorConfirmEmailMsg("Email is not verified. Click below to verify.");
                }, 5000);
                return;
            }

            if (
                error?.response?.data?.non_field_errors &&
                error?.response?.data?.non_field_errors[0].includes("Incorrect credentials.")
            ) {
                console.log('yes include Incorrect credentials.');
                notify("Incorrect credentials.", "error");
                return;
            } else {
                // Show all validation errors come from backend serializer error fields message
                Object.entries(error).forEach(([field, messages]: [string, any]) => {
                    if (Array.isArray(messages)) {
                        messages.forEach((msg: string) => notify(`${field}: ${msg}`, "error"));
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

                {/* Toast Container - always available for notifications */}
                <ToastContainer position="top-center" autoClose={3000} />

                {/*  errorConfirmEmailMsg message  */}
                {errorConfirmEmailMsg && (
                    <div className="rounded border-4 border-red-600 bg-gray-200 text-gray-700 p-3 space-y-2 w-full max-w-md my-4">
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
                                {showPassword ? <EyeOff /> : <Eye />}
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
                            <Link href="/sa/forgot-password">
                                <span className="no-underline text-blue-600 hover:underline hover:text-blue-700"> Forgot Password?</span>
                            </Link>
                        </p>
                    </div>
                </form>

                <div className="p-4 text-gray-600 text-xl">
                    <p>Don&apos;t have an account?
                        <Link href="/sa/register/buyer">
                            <span className="no-underline text-blue-700 hover:underline hover:text-blue-600"> Sign Up</span>
                        </Link>
                    </p>
                </div>
            </section>
        </>
    );
}
