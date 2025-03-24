import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"; // For advanced visualizations

const Dashboard = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of datasets per page
  const [darkMode, setDarkMode] = useState(false); // Dark mode toggle
  const { authAxios } = useAuth();
  const fileInputRef = useRef(null); // Ref for the file input

  // Fetch datasets on component mount
  useEffect(() => {
    fetchDatasets();
  }, []);

  // Fetch datasets from the backend
  const fetchDatasets = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await authAxios.get("/datasets");
      setDatasets(response.data);
    } catch (error) {
      setError("Failed to fetch datasets");
      toast.error("Failed to fetch datasets");
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    setError("");

    const file = fileInputRef.current.files[0];
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await authAxios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(response.data.message);
      fetchDatasets(); // Refresh the dataset list
    } catch (error) {
      toast.error(error.response?.data?.error || "Upload failed");
    }
  };

  // Detect leakage for a specific dataset
  const detectLeakage = async (datasetId) => {
    setLoading(true);
    setError("");
    try {
      const response = await authAxios.get(`/detect_leakage/${datasetId}`, {
        responseType: "blob", // Handle file downloads
      });

      // Handle file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `leakage_result_${datasetId}.csv`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);

      // Display success message
      toast.success("Leakage result downloaded successfully!");
    } catch (error) {
      console.error("Error detecting leakage:", error);
      setError(
        error.response?.data?.error ||
          "Failed to detect leakage. Please try again."
      );
      toast.error(
        error.response?.data?.error ||
          "Failed to detect leakage. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter datasets based on search query
  const filteredDatasets = datasets.filter((dataset) =>
    dataset.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastDataset = currentPage * itemsPerPage;
  const indexOfFirstDataset = indexOfLastDataset - itemsPerPage;
  const currentDatasets = filteredDatasets.slice(
    indexOfFirstDataset,
    indexOfLastDataset
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Example data for visualizations
  const barChartData = [
    { name: "Train Accuracy", value: 0.95 },
    { name: "Test Accuracy", value: 0.85 },
  ];

  const pieChartData = [
    { name: "Leakage Detected", value: 1 },
    { name: "No Leakage", value: 9 },
  ];

  const lineChartData = [
    { name: "Jan", value: 0.8 },
    { name: "Feb", value: 0.85 },
    { name: "Mar", value: 0.9 },
    { name: "Apr", value: 0.95 },
  ];

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`min-h-screen  ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      } p-8`}
    >
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-18 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        {darkMode ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path
              fill-rule="evenodd"
              d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
              clip-rule="evenodd"
            />
          </svg>
        )}
      </button>

      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search datasets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full p-2 border ${
            darkMode
              ? "border-gray-700 bg-gray-800 text-white"
              : "border-gray-300"
          } rounded-lg`}
        />
      </div>

      {/* Visualization Section */}
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } p-6 rounded-lg shadow-md mb-8`}
      >
        <h2 className="text-2xl font-bold mb-4">Leakage Detection Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Bar Chart */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Accuracy Comparison</h3>
            <BarChart width={300} height={200} data={barChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </div>

          {/* Pie Chart */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Leakage Distribution</h3>
            <PieChart width={300} height={200}>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "#ff7300" : "#00C49F"}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          {/* Line Chart */}
          <div>
            <h3 className="text-xl font-semibold mb-2">
              Model Performance Over Time
            </h3>
            <LineChart width={300} height={200} data={lineChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </div>
        </div>
      </div>

      {/* File Upload Section */}
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } p-6 rounded-lg shadow-md mb-8`}
      >
        <h2 className="text-2xl font-bold mb-4">Upload Dataset</h2>
        <form onSubmit={handleFileUpload}>
          <input
            type="file"
            ref={fileInputRef}
            className={`w-full p-2 border ${
              darkMode
                ? "border-gray-700 bg-gray-800 text-white"
                : "border-gray-300"
            } rounded-lg mb-4`}
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Upload Dataset
          </button>
        </form>
      </div>

      {/* Uploaded Datasets Section */}
      <div
        className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } p-6 rounded-lg shadow-md mb-8`}
      >
        <h2 className="text-2xl font-bold mb-4">Uploaded Datasets</h2>
        {loading && <p className="text-gray-600">Loading datasets...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {datasets.length === 0 && !loading && (
          <p className="text-gray-600">No datasets found.</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasets.map((dataset) => (
            <div
              key={dataset.id}
              className={`p-6 ${
                darkMode ? "bg-gray-700" : "bg-gray-50"
              } rounded-lg shadow-sm hover:shadow-md transition-shadow`}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {dataset.filename}
              </h3>
              <button
                onClick={() => detectLeakage(dataset.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Detect Leakage
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
