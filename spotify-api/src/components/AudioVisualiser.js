import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useSpotifyPlayer } from './spotifyPlayerContex';

const AudioVisualiser = ({ token, trackId }) => {
  const containerRef = useRef();
  const { playbackState } = useSpotifyPlayer();

  useEffect(() => {
    if (!token || !trackId || !playbackState) return;

    let camera, scene, renderer, controls;
    let cube;

    const init = () => {
      const container = containerRef.current;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);
      controls = new OrbitControls(camera, renderer.domElement);
      camera.position.z = 5;
    };

    const createVisualElements = () => {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
    };

    const updateVisuals = () => {
      if (!playbackState || !playbackState.track_window || !playbackState.track_window.current_track) return;

      const { energy, loudness } = playbackState.track_window.current_track;

      // Update visual elements based on energy and loudness
      cube.scale.set(energy * 2, energy * 2, energy * 2);
      cube.rotation.x += loudness * 0.05;
      cube.rotation.y += loudness * 0.05;
    };

    const onWindowResize = () => {
      const container = containerRef.current;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      updateVisuals();
      controls.update();
      renderer.render(scene, camera);
    };

    init();
    createVisualElements();
    window.addEventListener('resize', onWindowResize);
    animate();

    return () => {
      window.removeEventListener('resize', onWindowResize);
      containerRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [token, trackId, playbackState]);

  return <div ref={containerRef} style={{ width: '100%', height: '400px' }} />;
};

export default AudioVisualiser;