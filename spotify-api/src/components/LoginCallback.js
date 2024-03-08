import React, { useEffect } from 'react';
import axios from 'axios';

const LoginCallback = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Send the authorization code to your server
      axios.post('http://localhost:3001/callback', { code })
        .then(response => {
          const { access_token, refresh_token, expires_in } = response.data;
          const expirationTime = new Date().getTime() + (expires_in * 1000);

          // Store the tokens and expiration time in local storage
          localStorage.setItem('accessToken', access_token);
          localStorage.setItem('refreshToken', refresh_token);
          localStorage.setItem('expirationTime', expirationTime);

          // Redirect to the main application
          window.location.href = '/';
        })
        .catch(error => {
          console.error('Error exchanging auth code for tokens:', error);
        });
    }
  }, []);

  return (
    <div>
      <h2>Authenticating with Spotify...</h2>
    </div>
  );
};

export default LoginCallback;