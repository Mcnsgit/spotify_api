// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import useSpotifyApi from '../auth/useSpotifyApi';
import SpotifyPlayer from './spotifyPlayer';
import SearchComponent from './searchComponent';
import { Container, Row, Col } from 'react-bootstrap';

const Dashboard = () => {
  const { callApi, requestPlaybackPermissions } = useSpotifyApi();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await callApi('me');
      setUserProfile(data);
    };
    fetchData();
  }, [callApi]);

  useEffect(() => {
    if (userProfile && !userProfile.product === 'premium') {
      requestPlaybackPermissions();
    }
  }, [userProfile, requestPlaybackPermissions]);

  return (
    <Container>
      <Row>
        <Col>
          <h1>User Dashboard</h1>
          {userProfile && (
            <div>
              <p>Welcome, {userProfile.display_name}</p>
            </div>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <SearchComponent />
        </Col>
      </Row>
      <Row>
        <Col>
          <SpotifyPlayer />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;