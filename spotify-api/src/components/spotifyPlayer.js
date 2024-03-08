import React, { createContext, useContext, useEffect, useState } from 'react';
import './spotifyPlayer.css';
import SearchComponent from './searchComponent';

const SpotifyPlayerContext = createContext();

export const useSpotifyPlayer = () => useContext(SpotifyPlayerContext);

const SpotifyPlayerProvider = ({ accessToken, children }) => {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    if (!accessToken) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'Your App Name',
        getOAuthToken: cb => { cb(accessToken); },
      });

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
      });

      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      const eventListeners = [
        { event: 'initialization_error', action: ({ message }) => console.error(message) },
        { event: 'authentication_error', action: ({ message }) => console.error(message) },
        { event: 'account_error', action: ({ message }) => console.error(message) },
        { event: 'playback_error', action: ({ message }) => console.error(message) },
        { event: 'player_state_changed', action: state => console.log(state) },
        { event: 'ready', action: ({ device_id }) => console.log('Ready with Device ID', device_id) },
      ];

      eventListeners.forEach(({ event, action }) => spotifyPlayer.addListener(event, action));

      spotifyPlayer.connect().then(success => {
        if (success) {
          console.log('The Web Playback SDK successfully connected to Spotify!');
          setPlayer(spotifyPlayer);
        }
      });
    };

    return () => {
      player?.disconnect();
    };
  }, [accessToken]);

  const playTrack = async (trackUri) => {
    if (!deviceId || !accessToken) return;

    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      body: JSON.stringify({ uris: [trackUri] }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  };

  const pauseTrack = async () => {
    if (!deviceId || !accessToken) return;

    await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  };

  const nextTrack = async () => {
    if (!deviceId || !accessToken) return;

    await fetch(`https://api.spotify.com/v1/me/player/next?device_id=${deviceId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  };

  const previousTrack = async () => {
    if (!deviceId || !accessToken) return;

    await fetch(`https://api.spotify.com/v1/me/player/previous?device_id=${deviceId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  };

  return (
    <SpotifyPlayerContext.Provider value={{ playTrack, pauseTrack, nextTrack, previousTrack }}>
      {children}
    </SpotifyPlayerContext.Provider>
  );
};

const SpotifyPlayer = () => {
  const { playTrack, pauseTrack, nextTrack, previousTrack } = useSpotifyPlayer();

  const handlePlayClick = () => {
    playTrack('spotify:track:1301WleyT98MSxVHPZCA6M'); // Replace with the desired track URI
  };

  const handlePauseClick = () => {
    pauseTrack();
  };

  const handleNextClick = () => {
    nextTrack();
  };

  const handlePreviousClick = () => {
    previousTrack();
  };

  return (
    <div className="spotify-player">
      <h2>Spotify Player</h2>
      <SearchComponent />
      <div className="controls">
        <button onClick={handlePreviousClick}>Previous</button>
        <button onClick={handlePlayClick}>Play</button>
        <button onClick={handlePauseClick}>Pause</button>
        <button onClick={handleNextClick}>Next</button>
      </div>
    </div>
  );
};

export default SpotifyPlayerProvider;