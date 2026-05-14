"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/Loading";
import Footer from "../../components/Footer";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

import { myAgents, handleDeleteAgent } from "../../utils/auth";
import notify from "../../common/useNotification";
import { ToastContainer } from 'react-toastify';
import Image from "next/image";
import Link from "next/link";

export default function MyAgentsPage() {
    const router = useRouter();
    const { user, setUser, loading, setLoading } = useAuth();
    const [agents, setAgents] = useState([]);

    useEffect(() => {
        // Redirect to login if no authenticated user
        if (!loading && !user) {
            router.push("/sa/login");
        }

        // Async function to fetch agents for the broker
        const fetchAgents = async () => {
            try {
              const data = await myAgents();
              // myAgents returns the response data directly
              setAgents(data);
              notify("Agents loaded successfully", "success");
            } catch (err) {
              console.error("Error fetching agents:");
              notify("Error loading agents", "error");
            } finally {
              setLoading(false);
            }
        };
        fetchAgents();

    }, [user, loading, router]);

    // ⏳ Loading
    if (loading) {
      return (
        <div className="text-center mt-20">
          <Loading />
        </div>
      );
    }

    return (
        <div className="container mx-auto py-8">

            <div className="flex justify-between mb-6">

              <ToastContainer position="top-center" autoClose={3000} />

              <button
                className="account-button bg-[#5842f6] text-white rounded-md py-2 px-4 hover:bg-[#6a5acd]"
                onClick={() => router.push("/add-agent")}
              >
                Add Agent
              </button>

            </div>


            <h2 className="text-2xl font-bold mb-4">My Agents</h2>

            <div>
                {agents.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No agents found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    #
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Agent
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Phone Number
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {agents.map((agent) => (
                            <tr key={agent.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <Image className="h-10 w-10 rounded-full" src={agent.profile_picture} alt="agent-image" width={40} height={40} />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {agent.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {agent.email}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.phone_number}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.is_active ? "Active" : "Inactive"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onClick={() => router.push(`/agents/${agent.id}`)} className="mx-1 text-blue-600"><FiEye size={18} /></button>
                                <button onClick={() => router.push(`/agents/edit/${agent.id}`)} className="mx-1 text-green-600"><FiEdit size={18} /></button>
                                <button onClick={() => handleDeleteAgent(agent.id)} className="mx-1 text-red-600"><FiTrash2 size={18} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                )}
            </div>

            <Footer/>
        </div>
    );
}