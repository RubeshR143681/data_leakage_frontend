import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // To get user_id from the URL
import { toast } from "react-toastify";

const Profile = () => {
  const { userId } = useParams(); // Get user_id from the URL
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log("userId from useParams:", userId); // Debug: Check the userId

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Validate userId
        if (!userId || isNaN(userId)) {
          setError("Invalid user ID");
          toast.error("Invalid user ID");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/profile?user_id=${userId}`
        );

        // Check if the backend returned an error
        if (response.data.error) {
          setError(response.data.error);
          toast.error(response.data.error);
        } else {
          setProfileData(response.data); // Set profile data
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to fetch profile data");
        toast.error("Failed to fetch profile data");
      } finally {
        setLoading(false); // Ensure loading is false in all cases
      }
    };

    fetchProfile(); // Fetch profile data
  }, [userId]);

  if (loading) {
    return <p>Loading profile...</p>; // Show loading state
  }

  if (error) {
    return <p className="text-red-500">{error}</p>; // Show error message
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">User Information</h2>
        <div className="space-y-4">
          <p>
            <strong>Username:</strong> {profileData?.username || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {profileData?.email || "N/A"}
          </p>
          <p>
            <strong>Role:</strong> {profileData?.role || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
