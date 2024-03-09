import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useSpotifyApi = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const clientId = process.env.REACT_APP_CLIENT_ID; // Ensure these are in your .env file
  const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
  const redirectUri = process.env.REACT_APP_REDIRECT_URI;

  const authenticate = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const credentials = btoa(`${clientId}:${clientSecret}`);
    const body = refreshToken ? `grant_type=refresh_token&refresh_token=${refreshToken}` : `grant_type=client_credentials`;

    try {
      const response = await axios.post('https://accounts.spotify.com/api/token', body, {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      setAccessToken(response.data.access_token);
      localStorage.setItem('accessToken', response.data.access_token);
      if (response.data.refresh_token) {
        localStorage.setItem('refreshToken', response.data.refresh_token);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  }, [clientId, clientSecret]);

  const callApi = useCallback(async (endpoint, method = 'GET', body = null) => {
    if (!accessToken) {
      await authenticate();
    }
    try{
        const response = await axios({
            method,
            url: `https://api.spotify.com/v1/${endpoint}`,
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            data: body,
        });
        return response.data;
    } catch (error) {
        if(error.response && error.response.status === 401) {
            await authenticate();
            return callApi(endpoint, method, body); // Recursive call to retry after re-authentication
        } else {
        console.error('API call error:', error);
        }
    }
}, [accessToken, authenticate]);

  useEffect(() => {
    const exchangeCodeForToken = async (code) => {
      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      });

      try {
        const { data } = await axios.post('https://accounts.spotify.com/api/token', body.toString(), {
          headers: {
            Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        setAccessToken(data.access_token);
        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('refreshToken', data.refresh_token);
        localStorage.setItem('expirationTime', new Date().getTime() + data.expires_in * 1000);
        window.history.pushState({}, null, '/'); // Clean URL after handling redirect
      } catch (error) {
        console.error('Error exchanging code for tokens:', error);
      }
    };


    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code && !accessToken) {
      exchangeCodeForToken(code);
    }
  }, [accessToken, clientId, clientSecret, redirectUri]);
  const requestPlaybackPermissions = useCallback(async () => {
    const scopes = 'streaming user-read-email user-read-private';
    const redirectUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
    window.location.href = redirectUrl;
  }, [clientId, redirectUri]);

  return { callApi, requestPlaybackPermissions };
};

export default useSpotifyApi;
