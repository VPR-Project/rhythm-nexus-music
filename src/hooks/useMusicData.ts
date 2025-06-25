
import { useState, useEffect } from 'react';
import { Track } from '@/pages/Index';

// CloudFront URL - Updated to HTTPS for security
const CLOUDFRONT_URL = 'https://dxdcg26c5b400.cloudfront.net/fractal';

export const useMusicData = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMusicData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching music list from:', `${CLOUDFRONT_URL}/list.json`);
        
        // Fetch the list of track IDs with better error handling
        const listResponse = await fetch(`${CLOUDFRONT_URL}/list.json`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        console.log('List response status:', listResponse.status);
        console.log('List response headers:', Object.fromEntries(listResponse.headers.entries()));
        
        if (!listResponse.ok) {
          throw new Error(`Failed to fetch music list: ${listResponse.status} ${listResponse.statusText}`);
        }
        
        const listText = await listResponse.text();
        console.log('Raw list response:', listText);
        
        let trackIds: string[];
        try {
          trackIds = JSON.parse(listText);
        } catch (parseError) {
          console.error('Failed to parse list JSON:', parseError);
          throw new Error('Invalid JSON response from music list');
        }
        
        console.log('Parsed track IDs:', trackIds);

        if (!Array.isArray(trackIds) || trackIds.length === 0) {
          throw new Error('No tracks found or invalid track list format');
        }

        // Fetch details for each track with better error handling
        const trackPromises = trackIds.map(async (id) => {
          try {
            console.log(`Fetching details for track: ${id}`);
            const detailsUrl = `${CLOUDFRONT_URL}/${id}/details.json`;
            console.log(`Details URL: ${detailsUrl}`);
            
            const detailsResponse = await fetch(detailsUrl, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              },
            });
            
            console.log(`Track ${id} response status:`, detailsResponse.status);
            
            if (!detailsResponse.ok) {
              console.warn(`Failed to fetch details for track ${id}: ${detailsResponse.status} ${detailsResponse.statusText}`);
              return null;
            }
            
            const detailsText = await detailsResponse.text();
            console.log(`Track ${id} raw response:`, detailsText);
            
            let details;
            try {
              details = JSON.parse(detailsText);
            } catch (parseError) {
              console.warn(`Failed to parse details JSON for track ${id}:`, parseError);
              return null;
            }
            
            console.log(`Track ${id} parsed details:`, details);
            
            return {
              id,
              name: details.name || `Track ${id}`,
              artist: details.artist || 'Unknown Artist',
              imageUrl: `${CLOUDFRONT_URL}/${id}/icon.jpg`
            };
          } catch (err) {
            console.warn(`Error fetching track ${id}:`, err);
            return null;
          }
        });

        const trackResults = await Promise.all(trackPromises);
        const validTracks = trackResults.filter((track): track is Track => track !== null);
        
        console.log('Final loaded tracks:', validTracks);
        
        if (validTracks.length === 0) {
          throw new Error('No valid tracks could be loaded');
        }
        
        setTracks(validTracks);
        setError(null);
      } catch (err) {
        console.error('Error fetching music data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        console.error('Full error details:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMusicData();
  }, []);

  return { tracks, loading, error };
};
