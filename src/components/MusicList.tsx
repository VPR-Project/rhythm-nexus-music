
import { Track } from '@/pages/Index';
import { Music } from 'lucide-react';

interface MusicListProps {
  tracks: Track[];
  onTrackSelect: (track: Track) => void;
  currentTrack: Track | null;
}

export const MusicList = ({ tracks, onTrackSelect, currentTrack }: MusicListProps) => {
  if (tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Music className="h-16 w-16 mb-4" />
        <p>No tracks found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tracks.map((track) => (
        <div
          key={track.id}
          onClick={() => onTrackSelect(track)}
          className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-800 group ${
            currentTrack?.id === track.id ? 'bg-gray-800 border-l-4 border-green-500' : ''
          }`}
        >
          <div className="relative flex-shrink-0 mr-4">
            <img
              src={track.imageUrl}
              alt={track.name}
              className="w-12 h-12 rounded-md object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
            {currentTrack?.id === track.id && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium truncate ${
              currentTrack?.id === track.id ? 'text-green-400' : 'text-white group-hover:text-green-400'
            } transition-colors duration-200`}>
              {track.name}
            </h3>
            <p className="text-sm text-gray-400 truncate">{track.artist}</p>
          </div>
          
          <div className="flex-shrink-0 ml-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              currentTrack?.id === track.id ? 'bg-green-500' : 'bg-gray-700 group-hover:bg-green-600'
            }`}>
              <Music className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
