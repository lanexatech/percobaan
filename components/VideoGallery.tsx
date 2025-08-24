
import React from 'react';
import { GeneratedVideo } from '../types';

interface VideoGalleryProps {
    videos: GeneratedVideo[];
    onSelectVideo: (video: GeneratedVideo) => void;
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({ videos, onSelectVideo }) => {
    if (videos.length === 0) {
        return null;
    }

    return (
        <div className="p-4 rounded-xl border border-white/20 bg-white/5 backdrop-blur-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-200">Your Creations</h3>
            <div className="flex overflow-x-auto gap-4 pb-4">
                {videos.map(video => (
                    <div
                        key={video.id}
                        className="flex-shrink-0 w-48 h-28 rounded-lg overflow-hidden cursor-pointer group relative border-2 border-transparent hover:border-purple-500 transition-all duration-300"
                        onClick={() => onSelectVideo(video)}
                    >
                        <video
                            src={video.url}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            onMouseOver={e => (e.target as HTMLVideoElement).play()}
                            onMouseOut={e => (e.target as HTMLVideoElement).pause()}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                        <p className="absolute bottom-1 left-2 text-xs text-white truncate w-11/12 group-hover:opacity-100 opacity-0 transition-opacity duration-300">{video.prompt}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
