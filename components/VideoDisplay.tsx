
import React from 'react';
import type { HistoryItem } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { MusicNoteIcon } from './icons/MusicNoteIcon';

interface VideoDisplayProps {
  videoItem: HistoryItem | null;
  isGenerating: boolean;
  status: string;
  error: string | null;
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({ videoItem, isGenerating, status, error }) => {
  const renderContent = () => {
    if (isGenerating) {
      return (
        <div className="text-center">
          <div className="inline-block animate-bounce text-amber-400">
            <MusicNoteIcon width={64} height={64} />
          </div>
          <p className="text-xl font-semibold mt-4 text-sky-700">Generating Your Storyboard</p>
          <p className="text-slate-500 mt-2">{status}</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg">
          <p className="font-bold">An Error Occurred</p>
          <p>{error}</p>
        </div>
      );
    }

    if (videoItem && videoItem.videoUrls.length > 0) {
      return (
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 gap-4">
          {videoItem.videoUrls.map((videoUrl, index) => (
            <div key={index} className="bg-sky-50 rounded-lg p-3 flex flex-col space-y-2 shadow-inner">
               <video src={videoUrl} controls autoPlay loop className="w-full rounded-md aspect-video" />
               <p className="text-xs text-slate-600 font-medium leading-tight line-clamp-2">
                 <strong>Scene {index+1}:</strong> {videoItem.prompts[index]}
               </p>
               <a
                href={videoUrl}
                download={`veo-scene-${index+1}-${videoItem.id}.mp4`}
                className="mt-auto w-full flex items-center justify-center gap-2 bg-amber-400/90 text-white font-bold py-2 px-4 rounded-md shadow-sm hover:bg-amber-500 transition-all text-sm"
              >
                <DownloadIcon />
                Download Scene {index+1}
              </a>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="text-center text-slate-500">
        <h3 className="text-2xl font-semibold text-sky-600">Let's Create a Story!</h3>
        <p className="mt-2">Your 3-scene storyboard will appear here once it's ready.</p>
        <p>Fill out all three prompts and click "Generate Video" to start.</p>
      </div>
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-md w-full aspect-video rounded-xl shadow-lg flex items-center justify-center p-4 border border-sky-200">
      {renderContent()}
    </div>
  );
};

export default VideoDisplay;
