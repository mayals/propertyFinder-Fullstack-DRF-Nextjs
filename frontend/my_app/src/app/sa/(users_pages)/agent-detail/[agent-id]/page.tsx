/* Agent Detail Page */
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Loading from '../../../components/Loading';
import axios from 'axios';

import notify from "../../../common/useNotification"
import { ToastContainer, toast } from 'react-toastify';
import { FaMapLocationDot } from "react-icons/fa6";




interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  gender: string;
  date_joined?: string;
  is_active: boolean;
  role: string;
}

interface BrokerInfo {
  profile_picture: string;
  broker_name: string;
}

interface AgentProfile {
  id: string;
  agent_name: string;
  profile_picture: string;
  phone_number?: string;
  contact_email?: string;
  country?: string;
  address?: string;
  belong_to_broker_name?: string;
  belong_to_broker_profile?: BrokerInfo;
  user_data?: UserData;
}




export default function AgentDetailPage() {
  const { "agent-id": agentId } = useParams(); // dynamic route param
  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');



    useEffect(() => {
        if (!agentId) return;
        const fetchAgent = async () => {
            try {
                const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const response = await axios.get(`${apiBase}/users/agent-detail/${agentId}/`);
    
                if (response.data) {
                    setAgent(response.data);
                    notify("Agents loaded successfully", "success");
                    console.log(response.data);
                }
            } catch (e: any) {
                    const errMsg = e.response?.data?.detail || e.message || 'Unknown error';
                    // Show toast error and store message in state
                    notify("Failed to load agent details", "error");
                    console.log('Error fetching agent:', errMsg);
                    setError(errMsg);

                } finally {
                    setLoading(false);
            }
        };
        fetchAgent();
    }, [agentId]);




   //  still loading ..
    if (loading) {
        return (
        <div className="text-center mt-20">
            <Loading />
        </div>
        );
    }

    if (!agent) return null; // no agent data yet
    
                    
              




    return (
        <div className="max-w-4xl mx-auto p-6 mb-10">

            <ToastContainer position="top-center" autoClose={3000} />
            
            
            {/* Agent Card */}
            <div className="bg-white rounded-xl shadow-md p-6 md:flex md:space-x-6">
                <div className="flex-shrink-0 mb-4 md:mb-0">
                    <Image
                        src={agent?.profile_picture || '/default_images/user_default.png'}
                        alt="Agent avatar"
                        width={120}
                        height={120}
                        className="rounded-full object-cover"
                    />
                </div>
                
                <div>
                    <h2 className="text-2xl font-bold text-gray-800"><strong>Name:</strong> {agent?.user_data?.full_name}</h2>
                    <p className="text-gray-600 mt-2 text-xl"><span><FaMapLocationDot /></span> {agent?.address}</p>
                    <p className="text-gray-600"><strong>Country:</strong> {agent?.country}</p>
                    <p className="text-gray-500 mt-2"><strong>Phone:</strong> {agent?.phone_number}</p>
                </div>
            </div>

            {/* User Account Section */}
            {agent?.user_data && (
                <div className="mt-8 bg-gray-50 rounded-xl p-6">
                {/* <h3 className="text-xl font-semibold mb-4">User Account</h3> */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><strong>Full Name:</strong> {agent.user_data.full_name}</div>
                    <div><strong>Email:</strong> {agent.user_data.email}</div>
                    <div><strong>Role:</strong> {agent.user_data.role}</div>
                    <div><strong>Gender:</strong> {agent.user_data.gender}</div>
                    <div><strong>Joined:</strong> {agent.user_data.date_joined?.split('T')[0]}</div>
                    <div><strong>Active:</strong> {agent.user_data.is_active ? 'Yes' : 'No'}</div>
                </div>
                </div>
            )}

            {/* Broker Info */}
            {agent?.belong_to_broker_profile && (
                <div className="mt-8 bg-white rounded-xl shadow-sm p-4 flex items-center space-x-4">
                    <Image
                        src={agent.belong_to_broker_profile.profile_picture || '/default_images/user_default.png'}
                        alt="Broker avatar"
                        width={50}
                        height={50}
                        className="rounded-full"
                    />
                    <div>
                        <p className="font-medium">Broker: {agent.belong_to_broker_profile.broker_name}</p>
                    </div>
                </div>
            )}

        </div>
    );
}
