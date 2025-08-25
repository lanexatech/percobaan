import React from 'react';
import type { GeneratedVideo } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { PlayIcon } from './icons/PlayIcon';

interface VideoHistoryProps {
    history: GeneratedVideo[];
    onPlay: (video: GeneratedVideo) => void;
    onThumbnailClick: (video: GeneratedVideo) => void;
}

const HistoryItem: React.FC<{video: GeneratedVideo, onPlay: (video: GeneratedVideo) => void, onThumbnailClick: (video: GeneratedVideo) => void}> = ({ video, onPlay, onThumbnailClick }) => {
    
    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        const a = document.createElement('a');
        a.href = video.url;
        const fileName = video.prompt.substring(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
        a.download = `${fileName || 'generated_video'}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="group relative bg-gray-800/80 p-3 rounded-lg flex items-center gap-4 transition-all hover:bg-gray-700/80">
            <div 
                className="w-16 h-16 rounded-md bg-black flex-shrink-0 flex items-center justify-center overflow-hidden cursor-pointer"
                onClick={() => video.thumbnail && onThumbnailClick(video)}
                title={video.thumbnail ? "Use as reference image" : "No thumbnail available"}
            >
                {video.thumbnail ? (
                    <img src={video.thumbnail.preview} alt="Video thumbnail" className="w-full h-full object-cover"/>
                ) : (
                    <video src={video.url} className="w-full h-full object-cover" muted />
                )}
            </div>
            <div className="flex-grow overflow-hidden">
                <p className="text-sm font-semibold text-gray-200 truncate">{video.prompt}</p>
                <p className="text-xs text-gray-400">{video.settings.aspectRatio} | {video.settings.resolution}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                <button 
                    onClick={() => onPlay(video)}
                    className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-red-600 hover:text-white transition"
                    aria-label="Play video"
                >
                    <PlayIcon className="w-4 h-4" />
                </button>
                <button 
                    onClick={handleDownload}
                    className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-red-600 hover:text-white transition"
                    aria-label="Download video"
                >
                    <DownloadIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}


export const VideoHistory: React.FC<VideoHistoryProps> = ({ history, onPlay, onThumbnailClick }) => {
    return (
        <div className="p-6 bg-gray-900/50 border-2 border-gray-800 rounded-lg shadow-lg flex flex-col h-auto lg:h-[540px]">
            <h3 className="text-xl font-bold mb-4 text-red-400 font-cinzel flex-shrink-0">Video History</h3>
            {history.length === 0 ? (
                <p className="text-center text-gray-500 py-4 flex-grow flex items-center justify-center">No videos generated yet. Let's make some memories!</p>
            ) : (
                <div className="space-y-3 flex-grow overflow-y-auto pr-2">
                    {history.map((video) => (
                        <HistoryItem key={video.id} video={video} onPlay={onPlay} onThumbnailClick={onThumbnailClick} />
                    ))}
                </div>
            )}
        </div>
    );
};