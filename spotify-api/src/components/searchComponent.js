// src/components/SearchComponent.js
import React, { useState } from 'react';
import { useSpotifyPlayer } from './spotifyPlayerContex';
import { Form, Button, ListGroup } from 'react-bootstrap';

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { playTrack } = useSpotifyPlayer();

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const data = await response.json();
      setSearchResults(data.tracks?.items || []);
    } catch (error) {
      console.error('Error searching tracks:', error);
    }
  };

  const handlePlayTrack = (trackUri) => {
    playTrack(trackUri);
  };

  return (
    <div>
      <Form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        <Form.Group controlId="searchInput">
          <Form.Control
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tracks"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Search
        </Button>
      </Form>
      <ListGroup>
        {searchResults.map((track) => (
          <ListGroup.Item key={track.id}>
            {track.name} - {track.artists[0].name}
            <Button variant="link" onClick={() => handlePlayTrack(track.uri)}>
              Play
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default SearchComponent;