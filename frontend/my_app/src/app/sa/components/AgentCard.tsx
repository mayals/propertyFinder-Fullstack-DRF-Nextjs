// Agent Card Component
import Link from "next/link";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

export default function AgentCard({ agent, onDelete }) {
    return (
      <div className="card rounded-lg shadow-md p-5 hover:shadow-lg transition">
        <div className="flex items-center gap-3 mb-4">
          <Link
            href={`/agent-properties/${agent.id}`}
            className="hover:text-green-500 hover:underline"
          >
            <FiEye className="text-green-500 h-8 w-8" />
          </Link>
          <Link
            href={`/agent-edit/${agent.id}`}
            className="hover:text-blue-500 hover:underline"
          >
            <FiEdit className="text-blue-500 h-8 w-8" />
          </Link>
          <button
            onClick={() => onDelete && onDelete(agent.id)}
            className="hover:text-red-500"
          >
            <FiTrash2 className="text-red-500 h-8 w-8" />
          </button>
        </div>

        <div className="flex justify-between">
          <div className="w-3/4">
            <div className="flex flex-col items-start">
              <h4 className="text-lg font-medium text-gray-900">
                {agent.first_name} {agent.last_name}
              </h4>
              <p className="text-sm text-gray-500">
                <span className="ml-2">{agent.email}</span>
                <span className="ml-2">{agent.phone}</span>
              </p>
            </div>
          </div>
          <div className="w-1/4 text-right">
            <div className="flex items-center">
              {agent.activities?.map((activity) => (
                <span key={activity.id} 
                      className={`badge bg-${activity.status === 'yes' ?
  'green-200' : 'red-200'}
                        p-2 rounded-md font-semibold`}
                >
                  {activity.status}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }