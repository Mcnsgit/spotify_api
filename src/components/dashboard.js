import React, { useEffect, useState } from 'react';
import useSpotifyApi from '../auth/useSpotifyApi';
import SearchComponent from './searchComponent';
import AudioVisualiser from './AudioVisualiser';
import { Container, Row, Col } from 'react-bootstrap';
import SpotifyPlayer from './spotifyPlayer';
import '../App.css'
import './spotifyPlayer.css';

const Dashboard = () => {
  const { callApi, requestPlaybackPermissions } = useSpotifyApi();
  const [userProfile, setUserProfile] = useState(null);
  const [currentTrackId, setCurrentTrackId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await callApi('me');
      setUserProfile(data);
    };
    fetchData();
  }, [callApi]);

  useEffect(() => {
    if (userProfile && userProfile.product !== 'premium') {
      requestPlaybackPermissions();
    }
  }, [userProfile, requestPlaybackPermissions]);

  const handleTrackChange = (trackId) => {
    setCurrentTrackId(trackId);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
          {userProfile && (
            <div>
              <p className="text-lg">Welcome, {userProfile.display_name}</p>
            </div>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <SearchComponent onTrackChange={handleTrackChange} />
        </Col>
      </Row>
      <Row>
  <Col>
  <Container>
                  <div className="flex">
                    <div>
                      <div className="w-64 h-64">
                        {currentTrackId && (
                          <AudioVisualiser
                            token={localStorage.getItem('accessToken')}
                            trackId={currentTrackId}
                          />
                        )}
                      </div>
                    </div>``
                  </div>
                </Container>
  </Col>
</Row>

<Row>
  <Col>
    <Container>
      <div className="flex">
        <div>
          <div className="w-64 h-64">
            {currentTrackId && (
              <AudioVisualiser
                token={localStorage.getItem('accessToken')}
                trackId={currentTrackId}
              />
            )}
          </div>
        </div>
      </div>
    </Container>
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