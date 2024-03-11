
import React, { useEffect, useCallback, useState, useRef } from 'react';
import axios from 'axios';

const AudioVisual = ({ token, trackId, debounceTimeout = 500 }) => {
    const [audioAnalysis, setAudioAnalysis] = useState(null);
    const fetchAudioAnalysis = useCallback(async () => {
        if (!token || !trackId) return;
        try {
            const response = await axios.get(`https://api.spotify.com/v1/audio-analysis/${trackId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAudioAnalysis(response.data);
        } catch (error) {
            console.error('Error fetching audio analysis:', error);
        }
    }, [token, trackId]);

    const debouncedFetch = useRef(null);
    useEffect(() => {
        debouncedFetch.current = React.debounce(fetchAudioAnalysis, debounceTimeout);
        return () => {
            debouncedFetch.current.cancel();
        };
    }, [fetchAudioAnalysis, debounceTimeout]);

    useEffect(() => {
        debouncedFetch.current();
    }, [debouncedFetch]);

    const renderVisualization = useCallback(() => {
        if (!audioAnalysis) {
            return <p>Loading audio analysis...</p>;
        }
        // Add your visualization code here based on the audioAnalysis data
        return <p>Audio features and analysis will be visualized here.</p>;
    }, [audioAnalysis]);

    return <div>{renderVisualization()}</div>;
};

export default AudioVisual;