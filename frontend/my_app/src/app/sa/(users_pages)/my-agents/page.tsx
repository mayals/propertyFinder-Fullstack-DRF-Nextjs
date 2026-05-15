"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { myAgents, handleDeleteMyAgent } from "../../utils/auth";
import { createPortal } from "react-dom";
import notify from "../../common/useNotification";
import { ToastContainer } from 'react-toastify';
import Loading from "../../components/Loading";
import Footer from "../../components/Footer";
import { FiEye, FiEdit, FiTrash2, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";



export default function MyAgentsPage() {
    const router = useRouter();
    const { user, setUser, loading, setLoading } = useAuth();
    const [agents, setAgents] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [agentToDelete, setAgentToDelete] = useState<string | null>(null);  //agent.id is a string

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
              console.error("Error fetching agents");
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
     <>
            <ToastContainer position="top-center" autoClose={3000} />
            
            {/*  Breadcrumb  nav */}
            <nav className="flex py-3 ml-2" aria-label="Breadcrumb">
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
                    <a href="/sa/my-dashboard" className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">My Dashboard</a>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                    </svg>
                    <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">My Agents</span>
                  </div>
                </li>
              </ol>
            </nav>

            <div className="my-6 mr-2 flex justify-end">
                <button
                  className="account-button bg-[#5842f6] text-white rounded-md py-2 px-4 hover:bg-[#6a5acd]"
                  onClick={() => router.push("/sa/register/agent")}
                >
                  Add Agent
                </button>
            </div>


            {/* <h2 className="text-xl mb-4">My Agents</h2> */}

            <div className="mb-12">
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
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Phone Number
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created at
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
                                {agent.user_data.first_name} {agent.user_data.last_name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {agent.user_data.email}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {agent.phone_number ? agent.phone_number: "Not provided"}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(agent.user_data.date_joined).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><div className="flex justify-center items-center">
                                {agent.user_data.is_active ? <FiCheckCircle className="text-green-600" title="Active" /> : <FiXCircle className="text-red-600" title="Inactive" />}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onClick={() => router.push(`/agents/${agent.id}`)} className="mx-1 text-blue-600"><FiEye size={18} /></button>
                                <button onClick={() => router.push(`/agents/edit/${agent.id}`)} className="mx-1 text-green-600"><FiEdit size={18} /></button>
                                <button onClick={() => { setAgentToDelete(agent.id); setShowDeleteModal(true); }} className="mx-1 text-red-600 cursor-pointer hover:bg-red-100 transition-colors duration-200"><FiTrash2 size={18} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                )}
            </div>





            {/* Delete Confirmation Modal */}
            {showDeleteModal && agentToDelete && (
              createPortal(
                <div
                  className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/50"
                  onClick={() => setShowDeleteModal(false)}
                >
                  <div
                    className="bg-white rounded-2xl p-6 w-11/12 max-w-sm mx-auto shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MdDeleteForever className="mx-auto mb-3 h-10 w-10 text-red-500" />
                    <h3 className="text-center text-lg font-bold mb-2">Delete Agent?</h3>
                    <p className="text-center text-gray-500 mb-6">
                      Are you sure you want to delete this agent?
                    </p>
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => setShowDeleteModal(false)}
                        className="px-5 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          if (agentToDelete) {
                            try {
                              await handleDeleteMyAgent(agentToDelete);
                              setAgents((prev) => prev.filter((a) => a.id !== agentToDelete));
                              notify('Agent deleted', 'success');
                            } catch (e) {
                              notify('Failed to delete agent', 'error');
                            }
                            setShowDeleteModal(false);
                            setAgentToDelete(null);
                          }
                        }}
                        className="px-5 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>,
                document.body
              )
            )}
            <Footer/>
    </>
    );
}