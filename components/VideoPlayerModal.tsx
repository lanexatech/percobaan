
import React, { useEffect } from 'react';
import type { GeneratedVideo } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface VideoPlayerModalProps {
    video: GeneratedVideo;
    onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleDownload = () => {
        const a = document.createElement('a');
        a.href = video.url;
        const fileName = video.prompt.substring(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
        a.download = `${fileName || 'generated_video'}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-gray-900 border-2 border-red-800/50 rounded-lg shadow-2xl shadow-red-900/40 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <p className="text-gray-300 text-sm truncate flex-1 pr-4">{video.prompt}</p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownload}
                            className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition"
                            aria-label="Download video"
                        >
                            <DownloadIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full text-gray-400 hover:bg-red-600 hover:text-white transition"
                            aria-label="Close"
                        >
                            <CloseIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="flex-grow p-4 bg-black">
                     <video src={video.url} controls autoPlay className="w-full h-full object-contain" />
                </div>
            </div>
        </div>
    );
};
