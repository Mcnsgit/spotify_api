// src/components/SpotifyPlayerContext.js
import { Alert } from 'react-bootstrap';
import React, { createContext, useContext, useState, useEffect } from 'react';

const SpotifyPlayerContext = createContext();

export const useSpotifyPlayer = () => useContext(SpotifyPlayerContext);

export const SpotifyPlayerProvider = ({ accessToken, children }) => {
  const [deviceId, setDeviceId] = useState('');
  const [error, setError] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [playbackState, setPlaybackState] = useState(null);
  
  useEffect(() => {
    if (!accessToken) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
      });

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
      });
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
        setDeviceId(null);
      });
      player.addListener('player_state_changed', state => {
        console.log('Player state changed', state);
        setPlaybackState(state);
      });

      player.connect();
    };
    return () => {
      if (window.Spotify && window.Spotify.Player) {
        const player = window.Spotify.Player;
        player.disconnect();
      }
    };

  }, [accessToken]);

  const playTrack = async (trackUri) => {
    if (!deviceId || !accessToken) return;

    try {
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [trackUri] }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error('Error playing track:', error);
      setError('Failed to play track. Please try again.');
    }
  };

  const controlPlayback = async (endpoint) => {
    if (!deviceId || !accessToken) return;

    try {
      await fetch(`https://api.spotify.com/v1/me/player/${endpoint}?device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error(`Error controlling playback (${endpoint}):`, error);
      setError(`Failed to ${endpoint} track. Please try again.`);
    }
  };
  const resumeTrack = async () => {
    if (!deviceId || !accessToken) return;
    
    try {
      await fetch (`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error('Error resuming track:', error);
    }
  };

  const setPlaybackVolume = async (newVolume) => {
    if (!deviceId || !accessToken) return;

    try {
      await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${newVolume * 100}&device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setVolume(newVolume);
    } catch (error) {
      console.error('Error setting playback volume:', error);
    }
  };


  // const resumeTrack = () => controlPlayback('resume');
   const pauseTrack = () => controlPlayback('pause');
   const nextTrack = () => controlPlayback('next');
   const previousTrack = () => controlPlayback('previous');

  return (
    <SpotifyPlayerContext.Provider value={{ playTrack, pauseTrack, nextTrack, previousTrack, resumeTrack, setPlaybackVolume, volume, playbackState }}>
      {error && <Alert variant="danger">{error}</Alert>}
      {children}
    </SpotifyPlayerContext.Provider>
  );
};