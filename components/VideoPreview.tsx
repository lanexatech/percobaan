
import React from 'react';
import type { GeneratedVideo } from '../types';
import { ButterflySpinner } from './icons/ButterflySpinner';
import { DownloadIcon } from './icons/DownloadIcon';

interface VideoPreviewProps {
    video: GeneratedVideo | null;
    isLoading: boolean;
    loadingMessage: string;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ video, isLoading, loadingMessage }) => {

    const handleDownload = () => {
        if (!video) return;
        const a = document.createElement('a');
        a.href = video.url;
        // Sanitize prompt for filename
        const fileName = video.prompt.substring(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
        a.download = `${fileName || 'generated_video'}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };


    return (
        <div className="w-full aspect-video flex flex-col items-center justify-center p-6 bg-gray-900/50 border-2 border-gray-800 rounded-lg shadow-lg">
            {isLoading && (
                <div className="text-center">
                    <ButterflySpinner />
                    <p className="mt-4 text-lg text-red-400 font-cinzel animate-pulse">{loadingMessage}</p>
                </div>
            )}
            {!isLoading && !video && (
                <div className="text-center text-gray-500">
                    <p className="text-2xl font-cinzel">Your masterpiece awaits...</p>
                    <p className="mt-2">Fill out the form and let's create some magic!</p>
                </div>
            )}
            {!isLoading && video && (
                <div className="w-full h-full flex flex-col">
                    <h3 className="text-xl font-bold mb-4 text-center text-red-400 font-cinzel">Generation Complete!</h3>
                    <div className="flex-grow rounded-lg overflow-hidden">
                        <video src={video.url} controls autoPlay loop className="w-full h-full object-contain" />
                    </div>
                    <button 
                        onClick={handleDownload}
                        className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 font-semibold text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <DownloadIcon className="w-5 h-5"/>
                        Download Video
                    </button>
                </div>
            )}
        </div>
    );
};
