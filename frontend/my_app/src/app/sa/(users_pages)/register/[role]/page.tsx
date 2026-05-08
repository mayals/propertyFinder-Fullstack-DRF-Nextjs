"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { registerUser } from "../../../utils/auth";
import { ToastContainer, toast } from 'react-toastify';
import notify from "../../../common/useNotification";
import { useAuth } from "../../../context/AuthContext";
import axiosInstance from "../../../lib/axios";

export default function RegisterPage() {
  const { role } = useParams<{ role: string }>();
  console.log("RegisterPage-role=", role);
  const router = useRouter();
  const { user } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [password2, setPassword2] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brokers, setBrokers]     = useState<any[]>([]);
  const [selectedBrokerId, setSelectedBrokerId] = useState<string>('');
  const [brokerName, setBrokerName] = useState("");

  useEffect(() => {
    if (role === 'agent') {
      const fetchBrokers = async () => {
        try {
          const res = await axiosInstance.get(`/users/broker-list/`);
          const data = res.data;
          setBrokers(data);
          // If only one broker (logged-in broker), auto-select it
          if (data.length === 1) {
            setSelectedBrokerId(data[0].id);
          }
        } catch (error) {
          console.error('Failed to fetch brokers', error);
        }
      };
      fetchBrokers();
    }
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // validation
    if (!firstName || !lastName || !email || !password || !password2) {
      notify("Please fill all fields!", "warning");
      setIsSubmitting(false);
      return;
    }
    if (password !== password2) {
      notify("Passwords do not match!", "warning");
      setIsSubmitting(false);
      return;
    }
    if (role === 'agent' && !selectedBrokerId) {
      notify("Please select a broker!", "warning");
      setIsSubmitting(false);
      return;
    }
    if (role === 'broker' && !brokerName.trim()) {
      notify("Please enter your broker/company name!", "warning");
      setIsSubmitting(false);
      return;
    }

    try {
      const brokerIdForAgent = role === 'agent' ? selectedBrokerId : undefined;
      const brokerNameForBroker = role === 'broker' ? brokerName : undefined;
      await registerUser(firstName, lastName, email, password, password2, role, brokerIdForAgent, brokerNameForBroker);
      notify(
        "Thanks for signing up. Please check your email — a confirmation link has been sent.",
        "success"
      );
      setTimeout(() => router.push("/sa/login"), 5000);
    } catch (error: any) {
      console.log("registration error =", error);
      const data = error.response?.data;
      if (data && typeof data === 'object') {
        Object.entries(data).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg: string) => notify(`${field}: ${msg}`, "error"));
          } else {
            notify(`${field}: ${messages}`, "error");
          }
        });
      } else if (data && typeof data === 'string') {
        notify(data, "error");
      } else {
        notify("Registration failed. Please try again.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine if broker select should be disabled (when broker is logged in)
  const isBrokerUser = user?.role === 'broker';
  const shouldDisableBrokerSelect = isBrokerUser && brokers.length === 1;

  return (
    <section className="min-h-screen bg-[#F2F2F2] flex flex-col justify-center items-center px-4 py-8">
      <div className="text-gray-600 text-2xl sm:text-3xl my-3 text-center">
        {role.charAt(0).toUpperCase() + role.slice(1)} Registration
      </div>

      <ToastContainer position="top-center" />

      <form
        noValidate
        onSubmit={handleSubmit}
        className="bg-[#B6B09F] p-6 sm:p-8 rounded-lg w-full max-w-md md:max-w-lg lg:max-w-xl space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm sm:text-base">First Name</label>
            <input
              className="text-gray-600 bg-gray-100 p-2 rounded"
              placeholder="Enter your first name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm sm:text-base">Last Name</label>
            <input
              className="text-gray-600 bg-gray-100 p-2 rounded"
              placeholder="Enter your last name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm sm:text-base">Email</label>
          <input
            className="text-gray-600 bg-gray-100 p-2 rounded"
            placeholder="Enter your email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm sm:text-base">Password</label>
          <input
            className="text-gray-600 bg-gray-100 p-2 rounded"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm sm:text-base">Confirm Password</label>
          <input
            className="text-gray-600 bg-gray-100 p-2 rounded"
            placeholder="Enter your password again"
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </div>

        {role === 'broker' && (
          <div className="flex flex-col">
            <label className="mb-1 text-sm sm:text-base">Broker Name (Commercial Name)</label>
            <input
              className="text-gray-600 bg-gray-100 p-2 rounded"
              placeholder="Enter your broker/company name"
              type="text"
              value={brokerName}
              onChange={(e) => setBrokerName(e.target.value)}
            />
          </div>
        )}

        {role === 'agent' && (
          <div className="flex flex-col">
            <label className="mb-1 text-sm sm:text-base">Select Broker</label>
            <select
              className="text-gray-600 bg-gray-100 p-2 rounded"
              value={selectedBrokerId}
              onChange={(e) => setSelectedBrokerId(e.target.value)}
              disabled={shouldDisableBrokerSelect}
            >
              <option value="">-- Select a broker --</option>
              {brokers.map((broker: any) => (
                <option key={broker.id} value={broker.id}>
                  {broker.user?.first_name} {broker.user?.last_name} ({broker.broker_name})
                </option>
              ))}
            </select>
            {isBrokerUser && (
              <p className="text-sm text-gray-600 mt-1">
                You are adding an agent to your broker company.
              </p>
            )}
          </div>
        )}

        <button
          disabled={isSubmitting}
          className="bg-gray-600 hover:bg-sky-700 text-white p-2 rounded transition-colors duration-200"
          type="submit"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>

      <div className="p-4 text-gray-600 text-xl">
        <p>
          Already have an account?{" "}
          <Link href="/sa/login/" className="text-blue-700 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
