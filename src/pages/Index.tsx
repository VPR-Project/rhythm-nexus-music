
import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { MusicList } from '@/components/MusicList';
import { MusicPlayer } from '@/components/MusicPlayer';
import { useMusicData } from '@/hooks/useMusicData';

export interface Track {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
}

const Index = () => {
  const { tracks, loading, error } = useMusicData();
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (tracks) {
      const filtered = tracks.filter(track => 
        track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTracks(filtered);
    }
  }, [tracks, searchQuery]);

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Music</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header with Search */}
      <div className="bg-gradient-to-b from-gray-900 to-black p-6 sticky top-0 z-10">
        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Your Music
          </h1>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <MusicList 
              tracks={filteredTracks}
              onTrackSelect={handleTrackSelect}
              currentTrack={currentTrack}
            />
          )}
        </div>
      </div>

      {/* Bottom Music Player */}
      <MusicPlayer currentTrack={currentTrack} />
    </div>
  );
};

export default Index;
