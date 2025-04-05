import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LeakageResult from "./LeakageResult"; // Import the LeakageResult component

function Dashboard() {
  const [datasets, setDatasets] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch datasets on component mount
  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://data-node.onrender.com/datasets",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDatasets(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch datasets.");
      }
    };

    fetchDatasets();
  }, []);

  // Handle file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://data-node.onrender.com/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Refresh the list of datasets
      const datasetsResponse = await axios.get(
        "https://data-node.onrender.com/datasets",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDatasets(datasetsResponse.data);

      alert(response.data.message);
    } catch (err) {
      setError(err.response?.data?.error || "File upload failed.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {/* File Upload Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Upload Dataset</h2>
        <form onSubmit={handleFileUpload}>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Upload
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Datasets Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Datasets</h2>
        {datasets.length === 0 ? (
          <p>No datasets uploaded yet.</p>
        ) : (
          <ul>
            {datasets.map((dataset) => (
              <li key={dataset.id} className="mb-2">
                {dataset.filename} <LeakageResult datasetId={dataset.id} />{" "}
                {/* Add LeakageResult component */}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
