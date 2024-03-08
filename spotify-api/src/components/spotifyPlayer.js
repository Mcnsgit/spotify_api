// src/components/spotifyPlayer.js
import React from 'react';
import { useSpotifyPlayer } from './spotifyPlayerContex';
import { Button, Form } from 'react-bootstrap';

const SpotifyPlayer = () => {
  const { pauseTrack, nextTrack, previousTrack, resumeTrack, volume, setPlaybackVolume, playbackState } = useSpotifyPlayer();

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setPlaybackVolume(newVolume);
  };

  return (
    <div className="flex flex-col items-center mt-8">
      {playbackState && (
        <div className="mb-4">
          <img
            src={playbackState.track_window.current_track.album.images[0].url}
            alt="Album Art"
            className="w-48 h-48 rounded-lg shadow-md"
          />
          <h3 className="text-xl font-bold mt-2">{playbackState.track_window.current_track.name}</h3>
          <p className="text-gray-600">{playbackState.track_window.current_track.artists[0].name}</p>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-4">
            <div
              className="bg-red-500 h-1 rounded-full"
              style={{
                width: `${(playbackState.position / playbackState.duration) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      )}
      <div className="flex justify-center space-x-4">
        <Button variant="outline-secondary" onClick={previousTrack}>
          Previous
        </Button>
        <Button variant="outline-secondary" onClick={pauseTrack}>
          Pause
        </Button>
        <Button variant="outline-secondary" onClick={resumeTrack}>
          Resume
        </Button>
        <Button variant="outline-secondary" onClick={nextTrack}>
          Next
        </Button>
      </div>
      <Form.Group controlId="formBasicRange" className="mt-4">
        <Form.Label>Volume</Form.Label>
        <Form.Control
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolumeChange}
          className="w-48"
        />
      </Form.Group>
    </div>
  );
};

export default SpotifyPlayer;