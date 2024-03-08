import React from 'react';
import { useSpotifyPlayer } from './SpotifyPlayerContext'; // Import the hook

const PlayTrackButton = ({ trackUri }) => {
  const { playTrack } = useSpotifyPlayer();

  const handlePlay = () => {
    playTrack(trackUri);
  };

  return (
    <button onClick={handlePlay}>Play</button>
  );
};

export default PlayTrackButton;
