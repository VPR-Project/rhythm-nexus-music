import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Track } from '@/pages/Index';

interface HLSPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  volume: number;
  isVideoMode: boolean;
}

export const HLSPlayer = ({ 
  currentTrack, 
  isPlaying, 
  onPlayPause, 
  onTimeUpdate, 
  volume,
  isVideoMode 
}: HLSPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const currentRef = isVideoMode ? videoRef : audioRef;

  useEffect(() => {
    if (!currentTrack || !currentRef.current) return;

    const mediaElement = currentRef.current;
    const streamUrl = `https://dxdcg26c5b400.cloudfront.net/fractal/${currentTrack.id}/stream.m3u8`;

    console.log('Loading HLS stream:', streamUrl);

    if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls({
        debug: true,
        enableWorker: true,
      });
      hlsRef.current = hls;
      
      hls.loadSource(streamUrl);
      hls.attachMedia(mediaElement);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest loaded for:', currentTrack.name);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('Fatal network error encountered, trying to recover...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('Fatal media error encountered, trying to recover...');
              hls.recoverMediaError();
              break;
            default:
              console.error('Fatal error, destroying HLS instance');
              hls.destroy();
              break;
          }
        }
      });
    } else if (mediaElement.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS support
      console.log('Using native HLS support');
      mediaElement.src = streamUrl;
    } else {
      console.error('HLS is not supported in this browser');
    }

    const handleTimeUpdate = () => {
      if (mediaElement) {
        onTimeUpdate(mediaElement.currentTime, mediaElement.duration || 0);
      }
    };

    const handleLoadedMetadata = () => {
      if (mediaElement) {
        onTimeUpdate(mediaElement.currentTime, mediaElement.duration || 0);
      }
    };

    mediaElement.addEventListener('timeupdate', handleTimeUpdate);
    mediaElement.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      mediaElement.removeEventListener('timeupdate', handleTimeUpdate);
      mediaElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentTrack, isVideoMode]);

  useEffect(() => {
    const mediaElement = currentRef.current;
    if (!mediaElement) return;

    if (isPlaying) {
      mediaElement.play();
    } else {
      mediaElement.pause();
    }
  }, [isPlaying, isVideoMode]);

  useEffect(() => {
    const mediaElement = currentRef.current;
    if (mediaElement) {
      mediaElement.volume = volume / 100;
    }
  }, [volume, isVideoMode]);

  return (
    <>
      <video
        ref={videoRef}
        className={`${isVideoMode ? 'block' : 'hidden'} w-full h-auto max-h-64`}
        controls={false}
        playsInline
        muted={false}
      />
      <audio
        ref={audioRef}
        className="hidden"
        controls={false}
      />
    </>
  );
};
