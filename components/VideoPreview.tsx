
import React from 'react';
import { GeneratedVideo } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';

interface VideoPreviewProps {
    video: GeneratedVideo | null;
    isGenerating: boolean;
    status: string;
    error: string;
    videoCount: number;
}

const GlassPanel: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <div className={`relative w-full aspect-video flex items-center justify-center p-4 rounded-xl border border-white/20 bg-black/30 backdrop-blur-lg overflow-hidden ${className}`}>
        {children}
    </div>
);


export const VideoPreview: React.FC<VideoPreviewProps> = ({ video, isGenerating, status, error, videoCount }) => {

    const handleDownload = () => {
        if (video) {
            const a = document.createElement('a');
            a.href = video.url;
            a.download = `${video.prompt.substring(0, 20).replace(/\s/g, '_')}_${video.id}.mp4`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };
    
    return (
        <div className="relative">
             <GlassPanel>
                {isGenerating && (
                    <div className="text-center z-10">
                        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-400 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold mb-2">Generating Your Video</h2>
                        <p className="text-gray-300">{status}</p>
                    </div>
                )}

                {!isGenerating && error && (
                     <div className="text-center text-red-400 z-10 p-4">
                        <h2 className="text-xl font-semibold mb-2">An Error Occurred</h2>
                        <p>{error}</p>
                    </div>
                )}

                {!isGenerating && !error && video && (
                    <video
                        key={video.id}
                        src={video.url}
                        controls
                        autoPlay
                        loop
                        className="w-full h-full object-contain z-10"
                    >
                        Your browser does not support the video tag.
                    </video>
                )}
                
                {!isGenerating && !error && !video && (
                    <div className="text-center z-10">
                        <h2 className="text-2xl font-semibold text-gray-400">Your Generated Video Will Appear Here</h2>
                        <p className="text-gray-500 mt-2">Enter a prompt and click "Generate Video" to start.</p>
                    </div>
                )}
            </GlassPanel>
            
            <div className="absolute top-3 left-3 bg-black/50 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
                Videos Generated: {videoCount}
            </div>

            {video && !isGenerating && (
                <button
                    onClick={handleDownload}
                    className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full backdrop-blur-sm hover:bg-purple-600 transition-colors duration-300"
                    aria-label="Download video"
                >
                   <DownloadIcon />
                </button>
            )}
        </div>
    );
};
