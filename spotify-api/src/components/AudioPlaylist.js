// src/components/AudioPlaylist.js
import React from 'react';
import '../App.css';
import { useSpotifyPlayer } from './spotifyPlayerContex';
import SearchComponent from './searchComponent';
import { Container, Button } from 'react-bootstrap';
import AudioVisualiser from './AudioVisualiser';

const AudioPlaylist = () => {
  const { pauseTrack, nextTrack, previousTrack } = useSpotifyPlayer();

  return (
    <div className="w-full">
      <div className="h-2 bg-red-500"></div>
      <div className="flex items-center justify-center h-screen bg-red-100">
        <div className="bg-white shadow-lg rounded-lg" style={{ width: '45rem' }}>
          <Container>
            <div className="flex">
              <div>
                <div className="w-64 h-64">
                  <AudioVisualiser />
                </div>
              </div>
            </div>
          </Container>
          <div className="w-full p-8">
            <div className="flex justify-between">
              <div>
                <h3 className="text-2xl text-gray-800 font-medium">A Sky Full of Stars</h3>
                <Container>
                  <p className="text-sm text-gray-600 mt-1">Ghost Stories</p>
                  <SearchComponent />
                </Container>
              </div>
            </div>
            <div className="flex justify-between items-center mt-8">
              <div>
                <Button
                  className="flex items-center text-gray-600 focus:outline-none"
                  variant="link"
                  onClick={previousTrack}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="mx-2">Previous</span>
                  
                </Button>
              </div>
              <div>
                <Button
                  className="flex items-center text-gray-600 focus:outline-none"
                  variant="link"
                  onClick={pauseTrack}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="mx-2"> pause </span>  
                  </Button>
                  </div>
              <div>
                <Button
                  className="flex items-center text-gray-600 focus:outline-none"
                  variant="link"
                  onClick={nextTrack}
                >
                  <span className="mx-2">Next</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-8 py-4">
          <div className="flex justify-between text-sm text-gray-600">
            <p>0:40</p>
            <p>4:20</p>
          </div>
          <div className="mt-1">
            <div className="h-1 bg-gray-600 rounded-full">
              <div className="w-1/5 h-1 bg-red-500 rounded-full relative">
                <span className="w-4 h-4 bg-red-500 absolute right-0 bottom-0 -mb-1 rounded-full shadow"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlaylist;