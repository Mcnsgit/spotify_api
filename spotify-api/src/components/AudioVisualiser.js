import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Water } from 'three/examples/jsm/objects/Water';
import { useSpotifyPlayer } from './spotifyPlayerContex';
import AudioVisual from './AudioFeaturesVisualizer';

const AudioVisualiser = ({ token, trackId }) => {
  const [audioFeatures, setAudioFeatures] = useState(null);
  const canvasRef = useRef();
  const { playbackState } = useSpotifyPlayer();

  useEffect(() => {
    if (!token || !trackId) return;

    const fetchAudioFeatures = async () => {
      try {
        const response = await axios.get(`https://api.spotify.com/v1/audio-features/${trackId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAudioFeatures(response.data);
      } catch (error) {
        console.error('Error fetching audio features:', error);
      }
    };

    fetchAudioFeatures();
  }, [token, trackId]);

  useEffect(() => {
    if (!audioFeatures) return;

    const width = 400;
    const height = 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });

    renderer.setSize(width, height);

    const geometry = new THREE.PlaneGeometry(20, 20);
    const water = new Water(geometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load('../../public/Water_001_SD', (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
    });

    water.rotation.x = -Math.PI / 2;
    scene.add(water);

    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    scene.add(light);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set(0, 0, 0);
    controls.minDistance = 10.0;
    controls.maxDistance = 20.0;
    controls.update();

    camera.position.set(0, 5, 10);
    camera.lookAt(scene.position);

    const animate = () => {
      requestAnimationFrame(animate);

      water.material.uniforms['time'].value += 1.0 / 60.0;

      if (playbackState && audioFeatures) {
        const { energy } = audioFeatures;
        const { position, duration } = playbackState;

        const progress = position / duration;
        const distortionScale = energy * 5;
        const waterColor = new THREE.Color(`hsl(${progress * 360}, 100%, 50%)`);

        water.material.uniforms['distortionScale'].value = distortionScale;
        water.material.uniforms['waterColor'].value = waterColor;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      controls.dispose();
      renderer.dispose();
    };
  }, [audioFeatures, playbackState]);

  return ( <canvas ref={canvasRef} width="400" height="400" />,
  <AudioVisual audioFeatures={audioFeatures} />
  )
};

export default AudioVisualiser;