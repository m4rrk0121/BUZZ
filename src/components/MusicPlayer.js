import React, { useEffect, useRef, useState } from 'react';

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(true); // Default to true
  const audioRef = useRef(null);

  // Start playing when component mounts
  useEffect(() => {
    // Try to autoplay once the component has mounted
    const playPromise = audioRef.current.play();
    
    // Handle possible rejection of play promise due to browser policies
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Autoplay started successfully
          console.log('Music started automatically');
        })
        .catch(error => {
          // Autoplay was prevented due to browser policy
          console.log('Autoplay prevented:', error);
          setIsPlaying(false); // Update state to match reality
        });
    }
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="music-player">
      <audio ref={audioRef} src="/jungle-drum.mp3" loop />
      <button 
        onClick={togglePlay}
        className="music-button"
      >
        {isPlaying ? '🔊' : '🔈'}
      </button>
    </div>
  );
}

export default MusicPlayer;