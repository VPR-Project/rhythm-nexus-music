
import { useState, useEffect } from 'react';
import { Track } from '@/pages/Index';

// CloudFront URL - Change this to your actual CloudFront URL
const CLOUDFRONT_URL = 'https://your-cloudfront-url.cloudfront.net';

export const useMusicData = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMusicData = async () => {
      try {
        setLoading(true);
        
        // Fetch the list of track IDs
        const listResponse = await fetch(`${CLOUDFRONT_URL}/list.json`);
        if (!listResponse.ok) {
          throw new Error('Failed to fetch music list');
        }
        
        const trackIds: string[] = await listResponse.json();
        console.log('Fetched track IDs:', trackIds);

        // Fetch details for each track
        const trackPromises = trackIds.map(async (id) => {
          try {
            const detailsResponse = await fetch(`${CLOUDFRONT_URL}/${id}/details.json`);
            if (!detailsResponse.ok) {
              console.warn(`Failed to fetch details for track ${id}`);
              return null;
            }
            
            const details = await detailsResponse.json();
            
            return {
              id,
              name: details.name,
              artist: details.artist,
              imageUrl: `${CLOUDFRONT_URL}/${id}/icon.jpg`
            };
          } catch (err) {
            console.warn(`Error fetching track ${id}:`, err);
            return null;
          }
        });

        const trackResults = await Promise.all(trackPromises);
        const validTracks = trackResults.filter((track): track is Track => track !== null);
        
        console.log('Loaded tracks:', validTracks);
        setTracks(validTracks);
        setError(null);
      } catch (err) {
        console.error('Error fetching music data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMusicData();
  }, []);

  return { tracks, loading, error };
};
