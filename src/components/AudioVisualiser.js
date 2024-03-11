import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const AudioVisual = ({ token, trackId }) => {
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

    useEffect(() => {
        const updateVisuals = () => {
            // Define the logic to update visuals based on audioAnalysis data
            if (audioAnalysis) {
                // Add your visualization code here based on the audioAnalysis data
                console.log('Visualizing audio analysis:', audioAnalysis);
            }
        };

        const fetchData = async () => {
            await fetchAudioAnalysis();
            updateVisuals();
        };

        fetchData();
    }, [fetchAudioAnalysis, audioAnalysis]); // Include audioAnalysis in the dependency array

    return (
        <div>
            {/* Render your visualization */}
            <p>Audio features and analysis will be visualized here.</p>
        </div>
    );
};

export default AudioVisual;