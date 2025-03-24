import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const DatasetList = () => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, authAxios } = useAuth(); // Destructure user and authAxios from useAuth

  // Fetch datasets when the component mounts or when the user changes
  useEffect(() => {
    if (user) {
      fetchDatasets();
    }
  }, [user]);

  // Fetch datasets from the backend
  const fetchDatasets = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await authAxios.get("/datasets"); // Use authAxios for authenticated requests
      setDatasets(response.data);
    } catch (error) {
      setError("Failed to fetch datasets");
      toast.error("Failed to fetch datasets");
    } finally {
      setLoading(false);
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
      setError("Failed to detect leakage");
      toast.error("Failed to detect leakage");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Uploaded Datasets</h2>
      {loading && <p className="text-gray-600">Loading datasets...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {datasets.length === 0 && !loading && (
        <p className="text-gray-600">No datasets found.</p>
      )}
      <ul className="space-y-4">
        {datasets.map((dataset) => (
          <li
            key={dataset.id}
            className="p-4 bg-white shadow-lg rounded-lg flex justify-between items-center"
          >
            <span className="font-medium">{dataset.filename}</span>
            <button
              onClick={() => detectLeakage(dataset.id)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300"
            >
              Detect Leakage
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DatasetList;
