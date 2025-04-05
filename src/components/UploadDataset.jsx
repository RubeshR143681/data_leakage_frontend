import React, { useState, useContext } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const UploadDataset = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const { user } = useAuth(); // Get the user from AuthContext

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: user.token, // Include the token in the headers
          },
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || "Upload failed");
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Upload Dataset</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Upload
      </button>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default UploadDataset;
