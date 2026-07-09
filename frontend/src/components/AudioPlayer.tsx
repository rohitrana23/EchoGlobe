import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Loader } from 'lucide-react';

type Station = any;
interface AudioPlayerProps {
  station: Station;
}
const AudioPlayer: React.FC<AudioPlayerProps>=({station}) => {
  const audioRef=useRef<HTMLAudioElement>(null);
  const [isPlaying,setIsPlaying]=useState(false);
  const [isLoading,setIsLoading]=useState(false);
  const [volume,setVolume]=useState(1);
  const [isMuted,setIsMuted]=useState(false);
  const [error,setError]=useState<string | null>(null);
  useEffect(()=>{
    if (audioRef.current) {
      setIsLoading(true);
      setError(null);
      audioRef.current.src = station.urlResolved;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        });
        // .catch(err => {
        //   // console.error("Audio playback failed", err);
        //   setError("Note: weak connection");
        //   setIsPlaying(false);
        //   setIsLoading(false);
        // });
    }
  }, [station]);
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch(() => {
            setError("Failed to play");
            setIsLoading(false);
          });
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute=()=>{
    if (audioRef.current) {
      if (isMuted){
        audioRef.current.volume=volume>0?volume:1;
        setVolume(volume>0?volume:1);
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-11/12 max-w-2xl bg-neo-blue border-4 border-neo-dark p-4 shadow-neo z-30 flex items-center justify-between space-x-4">
      <div className="flex items-center space-x-4 flex-1 overflow-hidden">
        {station.favicon ? (
          <img src={station.favicon} alt="favicon" className="w-12 h-12 border-2 border-neo-dark object-cover bg-white" onError={(e) => (e.currentTarget.style.display = 'none')} />
        ) : (
          <div className="w-12 h-12 border-2 border-neo-dark bg-neo-yellow flex items-center justify-center font-bold text-xl">
            R
          </div>
        )}
        <div className="flex-1 overflow-hidden">
          <h2 className="font-bold text-lg truncate text-neo-dark">{station.name}</h2>
          <div className="text-sm font-semibold flex items-center space-x-2">
            <span className="truncate">{station.country||'World'}</span>
            <span>•</span>
            <span className="truncate">{station.language||'Unknown'}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button 
          onClick={togglePlay}
          className="w-12 h-12 bg-neo-yellow border-2 border-neo-dark shadow-neo hover:shadow-neo-hover active:translate-y-1 active:translate-x-1 flex items-center justify-center transition-all"
        >
          {isLoading?(
            <Loader className="w-6 h-6 animate-spin text-neo-dark" />
          ):isPlaying?(
            <Pause className="w-6 h-6 text-neo-dark" fill="currentColor"/>
          ): (
            <Play className="w-6 h-6 text-neo-dark" fill="currentColor"/>
          )}
        </button>

        <div className="flex items-center space-x-2 hidden sm:flex">
          <button onClick={toggleMute} className="p-2 border-2 border-neo-dark bg-white shadow-neo hover:shadow-neo-hover active:translate-y-1 active:translate-x-1">
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24 accent-neo-pink h-2 border-2 border-neo-dark appearance-none bg-white"
          />
        </div>
      </div>
      
      {error&&(
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white font-bold border-2 border-neo-dark px-4 py-1 shadow-neo whitespace-nowrap">
          {error}
        </div>
      )}
      <audio ref={audioRef} />
    </div>
  );
};
export default AudioPlayer;