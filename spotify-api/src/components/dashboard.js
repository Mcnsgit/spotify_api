import React, { useEffect, useState } from 'react';
import useSpotifyApi from '../auth/useSpotifyApi';

const Dashboard = () => {
  const { callApi } = useSpotifyApi();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await callApi('me');
      setUserProfile(data);
    };
    fetchData();
  }, [callApi]);

  return (
    <div>
      <h1>User Dashboard</h1>
      {userProfile && (
        <div>
          <p>Welcome, {userProfile.display_name}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
