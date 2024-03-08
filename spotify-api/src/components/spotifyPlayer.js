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
    <div className="d-flex flex-column align-items-center mt-3">
    {playbackState && (
      <div>
        <img src={playbackState.track_window.current_track.album.images[0].url} alt="Album Art" style={{ width: '200px', height: '200px' }} />
        <h3>{playbackState.track_window.current_track.name}</h3>
        <p>{playbackState.track_window.current_track.artists[0].name}</p>
        <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{
                width: `${(playbackState.position / playbackState.duration) * 100}%`,
              }}
            />
          </div>
        </div>
    )}
    <div className="d-flex justify-content-center mt-3">
      <Button variant="outline-secondary" onClick={previousTrack}>
        Previous
      </Button>
      <Button variant="outline-secondary" onClick={pauseTrack} className="mx-2">
        Pause
      </Button>
      <Button variant="outline-secondary" onClick={resumeTrack} className="mx-2">
        Resume
      </Button>
      <Button variant="outline-secondary" onClick={nextTrack}>
        Next
      </Button>
      <Form.Group controlId="formBasicRange" className="ml-3">
        <Form.Label>Volume</Form.Label>
        <Form.Control
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolumeChange}
        />
      </Form.Group>
    </div>
    </div>
  );
};

export default SpotifyPlayer;