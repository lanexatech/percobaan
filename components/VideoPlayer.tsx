
import React from 'react';
import GlassCard from './GlassCard';
import { ICONS } from '../constants';
import IconButton from './IconButton';

interface VideoPlayerProps {
  videoUrl: string;
  onReset: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onReset }) => {
  return (
    <GlassCard className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-slate-800 text-center">Your Video is Ready!</h2>
        <div className="aspect-video bg-white/30 rounded-lg overflow-hidden shadow-inner">
          <video src={videoUrl} controls autoPlay muted className="w-full h-full" />
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a href={videoUrl} download="veo-generated-video.mp4" className="w-full sm:w-auto">
            <IconButton text="Download Video" className="w-full justify-center">
              {ICONS.download}
            </IconButton>
          </a>
          <IconButton onClick={onReset} text="Create Another" className="w-full sm:w-auto justify-center bg-blue-500/80 text-white hover:bg-blue-500">
             {ICONS.wand}
          </IconButton>
        </div>
      </div>
    </GlassCard>
  );
};

export default VideoPlayer;
