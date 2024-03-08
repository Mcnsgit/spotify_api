// src/components/SpotifyPlayerContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useSpotifyApi from '../auth/useSpotifyApi';

const SpotifyPlayerContext = createContext();

export const useSpotifyPlayer = () => useContext(SpotifyPlayerContext);

export const SpotifyPlayerProvider = ({ children }) => {
  const { callApi } = useSpotifyApi();
  const [deviceID, setDeviceID] = useState('');

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = localStorage.getItem('accessToken');
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => {
          cb(token);
        },
      });

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceID(device_id);
      });

      player.connect();
    };
  }, []);

  const playTrack = useCallback(
    async trackUri => {
      const playBody = { uris: [trackUri] };
      await callApi(`me/player/play?device_id=${deviceID}`, 'PUT', playBody);
    },
    [callApi, deviceID],
  );

  const pauseTrack = useCallback(async () => {
    await callApi(`me/player/pause?device_id=${deviceID}`, 'PUT');
  }, [callApi, deviceID]);

  const nextTrack = useCallback(async () => {
    await callApi(`me/player/next?device_id=${deviceID}`, 'POST');
  }, [callApi, deviceID]);

  const previousTrack = useCallback(async () => {
    await callApi(`me/player/previous?device_id=${deviceID}`, 'POST');
  }, [callApi, deviceID]);

  return (
    <SpotifyPlayerContext.Provider value={{ playTrack, pauseTrack, nextTrack, previousTrack }}>
      {children}
    </SpotifyPlayerContext.Provider>
  );
};