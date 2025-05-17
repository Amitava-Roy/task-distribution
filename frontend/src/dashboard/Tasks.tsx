import { useState, useEffect, useRef } from "react"; // Import useState, useEffect, and useRef
import { getAuthData } from "../config/authConfig"; // Assuming getAuthData is needed for token
import api from "../api/baseUrl"; // Import the api instance

// Define the Agent type nested within the Task type
type AgentInTask = {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
  // Include other agent fields if necessary, but password is sensitive
  // password?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

// Define the Task type based on the provided API response structure
type Task = {
  _id: string;
  agentId: AgentInTask; // agentId is an object with Agent details
  firstName: string; // This seems to be the customer's first name associated with the task
  phone: number; // Assuming phone is a number based on the example
  notes: string; // Notes related to the task
  __v: number;
};

export default function Tasks() {
  const { token } = getAuthData(); // Get the authentication token
  console.log("Auth Token (Tasks):", token); // Log the token

  const [tasks, setTasks] = useState<Task[]>([]); // State to store task data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState<string | null>(null); // State to manage error state

  // State for file upload
  const [isFileUploadVisible, setIsFileUploadVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the file input

  // Function to fetch task data
  const fetchTasks = async () => {
    setLoading(true); // Set loading to true before fetching
    setError(null); // Clear previous errors
    try {
      const response = await api.get("/api/v1/tasks", {
        // Corrected endpoint based on previous interaction
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in headers
        },
      });
      console.log("Tasks API Response:", response.data); // Log the full response

      // Check if the response structure matches the expected format: result.tasks
      if (
        response.data &&
        response.data.result &&
        Array.isArray(response.data.result.tasks)
      ) {
        // Set task data from response.data.result.tasks
        setTasks(response.data.result.tasks);
      } else {
        // Handle unexpected response structure
        setError("Unexpected API response structure for tasks");
        console.error(
          "Unexpected API response structure for tasks:",
          response.data
        );
      }
    } catch {
      // Use 'any' for error type to access properties like message
      console.error("Error fetching tasks:"); // Log the error
    } finally {
      setLoading(false); // Set loading to false after fetch attempt
    }
  };

  useEffect(() => {
    // Fetch tasks when the component mounts or token changes
    if (token) {
      // Only fetch if token is available
      fetchTasks();
    } else {
      setLoading(false); // Stop loading if no token
      setError("Authentication token not available for tasks."); // Set error if no token
    }
  }, [token]); // Dependency array includes token

  // Function to handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setUploadError(null); // Clear previous upload errors
      setUploadSuccess(null); // Clear previous success messages
    } else {
      setSelectedFile(null);
    }
  };

  // Function to handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file to upload.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append("file", selectedFile); // Append the file to the form data

    try {
      const response = await api.post("/api/v1/tasks/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in headers
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });

      console.log("Upload API Response:", response.data);

      if (response.data && response.data.responseCode === 1) {
        setUploadSuccess("File uploaded successfully!");
        setSelectedFile(null); // Clear selected file
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Clear the file input visually
        }
        fetchTasks(); // Refresh the task list after successful upload
      } else {
        setUploadError(response.data.message || "File upload failed.");
        console.error("Upload API error:", response.data);
      }
    } catch {
      console.error("Error uploading file:");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto pt-20 md:pt-6 pb-24 md:pb-6">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-900">
            Tasks Overview
          </h2>
          {/* Button to toggle file upload section */}
          <button
            onClick={() => setIsFileUploadVisible(!isFileUploadVisible)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 shadow-md"
          >
            {isFileUploadVisible ? "Hide Upload" : "Upload Tasks File"}
          </button>
        </div>

        {/* File Upload Section */}
        {isFileUploadVisible && (
          <div className="mb-6 p-4 border border-gray-300 rounded-md bg-gray-50">
            <h3 className="text-xl font-semibold mb-4 text-purple-700">
              Upload Tasks File (CSV or Excel)
            </h3>
            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" // Accept CSV and Excel file types
              onChange={handleFileChange}
              ref={fileInputRef} // Attach ref to input
              className="mb-4 block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-purple-50 file:text-purple-700
                      hover:file:bg-purple-100"
            />
            {selectedFile && (
              <p className="text-slate-700 text-sm mb-4">
                Selected file: {selectedFile.name}
              </p>
            )}
            <button
              onClick={handleUpload}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-md disabled:opacity-50"
              disabled={!selectedFile || uploading} // Disable button if no file selected or uploading
            >
              {uploading ? "Uploading..." : "Upload File"}
            </button>
            {uploadError && (
              <p className="text-red-600 text-sm mt-2">{uploadError}</p>
            )}
            {uploadSuccess && (
              <p className="text-green-600 text-sm mt-2">{uploadSuccess}</p>
            )}
          </div>
        )}

        {loading ? (
          <div className="text-center text-purple-900">Loading tasks...</div>
        ) : error ? (
          <div className="text-center text-red-600">Error: {error}</div>
        ) : tasks.length > 0 ? (
          <div className="space-y-4">
            {/* Map over the fetched tasks data */}
            {tasks.map((task) => (
              <div
                key={task._id} // Use a unique key, like the task's _id
                className="bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-white/50"
              >
                {/* Display task details based on the new structure */}
                <h3 className="text-xl font-semibold mb-2 text-purple-700">
                  Task for {task.firstName || "Unnamed Customer"}{" "}
                  {/* Display customer's first name */}
                </h3>
                <p className="text-slate-700 mb-2">
                  <strong>Phone:</strong> {task.phone || "N/A"}{" "}
                  {/* Display phone number */}
                </p>
                <p className="text-slate-700 mb-2">
                  <strong>Notes:</strong> {task.notes || "No notes."}{" "}
                  {/* Display notes */}
                </p>
                {/* Display assigned agent's name if available */}
                {task.agentId && task.agentId.name && (
                  <p className="text-slate-600 text-sm mt-2">
                    Assigned Agent: {task.agentId.name}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Display a message if no tasks are found
          <div className="col-span-full text-center text-slate-600">
            No tasks found.
          </div>
        )}
      </div>
    </main>
  );
}
