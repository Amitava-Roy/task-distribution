import { useState, useEffect, useCallback } from "react"; // Import useState and useEffect
import { getAuthData } from "../config/authConfig";
import api from "../api/baseUrl"; // Import the api instance

// Define the Agent type based on the API response structure
type Agent = {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
  password?: string; // Password might not be returned on fetch, but needed for creation
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export default function Agents() {
  const { token } = getAuthData();
  console.log("Auth Token:", token); // Log the token

  const [agents, setAgents] = useState<Agent[]>([]); // State to store agent data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState<string | null>(null); // State to manage error state

  // State for the Add Agent Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({
    // State for the new agent form data
    name: "",
    email: "",
    mobileNumber: "",
    password: "",
  });
  const [addAgentLoading, setAddAgentLoading] = useState(false); // State for add agent loading
  const [addAgentError, setAddAgentError] = useState<string | null>(null); // State for add agent error

  // Function to fetch agent data
  const fetchAgents = useCallback(async () => {
    setLoading(true); // Set loading to true before fetching
    setError(null); // Clear previous errors
    try {
      const response = await api.get("/api/v1/agent", {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in headers
        },
      });

      // Check if the response structure matches the expected format
      if (
        response.data &&
        response.data.result &&
        response.data.result.agentData
      ) {
        setAgents(response.data.result.agentData); // Set the agent data from the response
      } else {
        // Handle unexpected response structure
        setError("Unexpected API response structure");
        console.error("Unexpected API response structure:", response.data);
      }
    } catch {
      // Use 'any' for error type to access properties like message
      console.error("Error fetching agents:"); // Log the error
    } finally {
      setLoading(false); // Set loading to false after fetch attempt
    }
  }, [token]);

  useEffect(() => {
    // Fetch agents when the component mounts or token changes
    if (token) {
      // Only fetch if token is available
      fetchAgents();
    } else {
      setLoading(false); // Stop loading if no token
      setError("Authentication token not available."); // Set error if no token
    }
  }, [token, fetchAgents]); // Dependency array includes token

  // Function to handle input changes in the new agent form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAgent({ ...newAgent, [name]: value });
  };

  // Function to handle adding a new agent
  const handleAddAgent = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setAddAgentLoading(true); // Set loading state for adding agent
    setAddAgentError(null); // Clear previous add agent errors

    try {
      const response = await api.post("/api/v1/agent", newAgent, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in headers
        },
      });
      console.log("Add Agent API Response:", response.data);

      if (response.data && response.data.responseCode === 1) {
        // Agent added successfully
        setIsModalOpen(false); // Close the modal
        setNewAgent({ name: "", email: "", mobileNumber: "", password: "" }); // Clear the form
        fetchAgents(); // Refresh the agent list
      } else {
        // Handle API-specific errors or unexpected response
        setAddAgentError(response.data.message || "Failed to add agent");
        console.error("API error adding agent:", response.data);
      }
    } catch {
      console.error("Error adding agent:"); // Log the error
    } finally {
      setAddAgentLoading(false); // Set loading to false
    }
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto pt-20 md:pt-6 pb-24 md:pb-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-purple-900">
          Agents Dashboard
        </h2>

        {/* Button to open Add Agent Modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-6 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 shadow-md"
        >
          Add New Agent
        </button>

        {loading ? (
          <div className="text-center text-purple-900">Loading agents...</div>
        ) : error ? (
          <div className="text-center text-red-600">Error: {error}</div>
        ) : agents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Map over the fetched agents data */}
            {agents.map((agent) => (
              <div
                key={agent._id} // Use a unique key, like the agent's _id
                className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-white/50"
              >
                <h3 className="text-xl font-semibold mb-2 text-purple-700">
                  {agent.name || "Unnamed Agent"} {/* Display agent name */}
                </h3>
                <p className="text-slate-700 mb-2">
                  <strong>Email:</strong> {agent.email || "N/A"}{" "}
                  {/* Display agent email */}
                </p>
                <p className="text-slate-700">
                  <strong>Mobile:</strong> {agent.mobileNumber || "N/A"}{" "}
                  {/* Display agent mobile number */}
                </p>
                {/* You can add more agent details here */}
              </div>
            ))}
          </div>
        ) : (
          // Display a message if no agents are found
          <div className="col-span-full text-center text-slate-600">
            No agents found.
          </div>
        )}

        {/* Add Agent Modal */}
        {isModalOpen && (
          <div className="fixed inset-0  bg-black/50  flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl  shadow-lg max-w-md w-full">
              <h3 className="text-2xl font-bold mb-6 text-purple-900">
                Add New Agent
              </h3>
              <form onSubmit={handleAddAgent}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-slate-700 text-sm font-bold mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newAgent.name}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-slate-700 text-sm font-bold mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newAgent.email}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="mobileNumber"
                    className="block text-slate-700 text-sm font-bold mb-2"
                  >
                    Mobile Number
                  </label>
                  <input
                    type="tel" // Use type="tel" for mobile numbers
                    id="mobileNumber"
                    name="mobileNumber"
                    value={newAgent.mobileNumber}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="block text-slate-700 text-sm font-bold mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={newAgent.password}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                {addAgentError && (
                  <p className="text-red-600 text-xs italic mb-4">
                    {addAgentError}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
                    disabled={addAgentLoading} // Disable button while loading
                  >
                    {addAgentLoading ? "Adding..." : "Add Agent"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="inline-block align-baseline font-bold text-sm border border-purple-600 py-2 px-4 rounded text-purple-600 hover:text-purple-800"
                    disabled={addAgentLoading} // Disable close button while adding
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
