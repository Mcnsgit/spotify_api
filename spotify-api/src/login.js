// Login.js
import React, { useEffect } from 'react';


const Login = () => {
  useEffect(() => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&scope=user-read-currently-playing user-read-recently-played user-read-playback-state user-top-read user-modify-playback-state`;
    window.location.href = authUrl;
    console.log(authUrl);
  }, []);

  return <div>Redirecting to Spotify...</div>;
};

export default Login;

