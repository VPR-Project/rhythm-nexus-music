
import { useState } from 'react';
import { Track } from '@/pages/Index';
import { SkipBack, SkipForward, Volume, Video, Music } from 'lucide-react';
import { HLSPlayer } from './HLSPlayer';

interface MusicPlayerProps {
  currentTrack: Track | null;
}

export const MusicPlayer = ({ currentTrack }: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isVideoMode, setIsVideoMode] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (time: number, dur: number) => {
    setCurrentTime(time);
    setDuration(dur);
  };

  const toggleVideoMode = () => {
    setIsVideoMode(!isVideoMode);
  };

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4">
        <div className="flex items-center justify-center text-gray-400">
          <p>Select a track to start playing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-gray-800 border-t border-gray-700 p-4">
      {/* Video Player Area */}
      {isVideoMode && (
        <div className="mb-4 flex justify-center">
          <HLSPlayer
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayPause={togglePlay}
            onTimeUpdate={handleTimeUpdate}
            volume={volume}
            isVideoMode={isVideoMode}
          />
        </div>
      )}

      {/* Hidden HLS Player for audio mode */}
      {!isVideoMode && (
        <HLSPlayer
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayPause={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          volume={volume}
          isVideoMode={isVideoMode}
        />
      )}

      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Current Track Info */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <img
            src={currentTrack.imageUrl}
            alt={currentTrack.name}
            className="w-14 h-14 rounded-md object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          <div className="min-w-0">
            <h4 className="font-medium text-white truncate">{currentTrack.name}</h4>
            <p className="text-sm text-gray-400 truncate">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center flex-2 max-w-md mx-8">
          <div className="flex items-center space-x-4 mb-2">
            <button className="text-gray-400 hover:text-white transition-colors duration-200">
              <SkipBack className="h-5 w-5" />
            </button>
            
            <button
              onClick={togglePlay}
              className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform duration-200"
            >
              {isPlaying ? (
                <div className="w-4 h-4 flex items-center justify-center">
                  <div className="w-1 h-4 bg-black mr-1"></div>
                  <div className="w-1 h-4 bg-black"></div>
                </div>
              ) : (
                <div className="w-4 h-4 flex items-center justify-center">
                  <div className="w-0 h-0 border-l-4 border-l-black border-y-2 border-y-transparent ml-1"></div>
                </div>
              )}
            </button>
            
            <button className="text-gray-400 hover:text-white transition-colors duration-200">
              <SkipForward className="h-5 w-5" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center space-x-2 w-full">
            <span className="text-xs text-gray-400">
              {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}
            </span>
            <div className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-200"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-400">
              {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Volume Control and Video Toggle */}
        <div className="flex items-center space-x-4 flex-1 justify-end">
          <div className="flex items-center space-x-2">
            <Volume className="h-4 w-4 text-gray-400" />
            <div className="w-20 h-1 bg-gray-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500"
                style={{ width: `${volume}%` }}
              ></div>
            </div>
          </div>
          
          {/* Video/Audio Toggle Button */}
          <button
            onClick={toggleVideoMode}
            className={`p-2 rounded-full transition-colors duration-200 ${
              isVideoMode ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
            title={isVideoMode ? 'Switch to audio mode' : 'Switch to video mode'}
          >
            {isVideoMode ? <Music className="h-4 w-4" /> : <Video className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
