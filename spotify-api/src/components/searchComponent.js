import React, { useState } from 'react';
import { useSpotifyPlayer } from './spotifyPlayerContex.js';
import useSpotifyApi from '../auth/useSpotifyApi';

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { callApi } = useSpotifyApi();
  const { playTrack } = useSpotifyPlayer();

  const handleSearch = async () => {
    try {
      const response = await callApi(`search?q=${encodeURIComponent(searchQuery)}&type=track`);
      setSearchResults(response.tracks.items);
    } catch (error) {
      console.error('Error searching tracks:', error);
    }
  };

  const handlePlayTrack = (trackUri) => {
    playTrack(trackUri);
  };

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search tracks"
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {searchResults.map((track) => (
          <li key={track.id}>
            {track.name} - {track.artists[0].name}
            <button onClick={() => handlePlayTrack(track.uri)}>Play</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchComponent;