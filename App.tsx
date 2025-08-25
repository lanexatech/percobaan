
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { VideoGeneratorForm } from './components/VideoGeneratorForm';
import { VideoPreview } from './components/VideoPreview';
import { VideoHistory } from './components/VideoHistory';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { VideoSettings } from './components/VideoSettings';
import { ApiKeyManager } from './components/ApiKeyManager';
import { generateVideo } from './services/geminiService';
import type { GeneratedVideo, GenerationSettings } from './types';

const App: React.FC = () => {
    const [apiKey, setApiKey] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Summoning spirits to generate your video...");
    const [currentVideo, setCurrentVideo] = useState<GeneratedVideo | null>(null);
    const [videoHistory, setVideoHistory] = useState<GeneratedVideo[]>([]);
    const [modalVideo, setModalVideo] = useState<GeneratedVideo | null>(null);
    const [referenceImage, setReferenceImage] = useState<{ file: File; preview: string; base64Data: string; } | null>(null);

    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [enableSound, setEnableSound] = useState(true);
    const [resolution, setResolution] = useState<'720p' | '1080p'>('1080p');

    useEffect(() => {
        const storedKey = localStorage.getItem('user_api_key');
        if (storedKey) {
            setApiKey(storedKey);
        }
    }, []);

    const handleSaveApiKey = (key: string) => {
        if (key) {
            localStorage.setItem('user_api_key', key);
            setApiKey(key);
        }
    };

    const captureFrame = useCallback((videoUrl: string, time: number): Promise<{ file: File; base64Data: string; preview: string }> => {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.muted = true;
            video.playsInline = true;
            video.crossOrigin = "anonymous";
            video.src = videoUrl;
            
            let seekedFired = false;

            const cleanup = () => {
                video.removeEventListener('seeked', onSeeked);
                video.removeEventListener('error', onError);
                video.removeEventListener('loadedmetadata', onLoadedMetadata);
                video.src = ''; 
            }

            const onSeeked = () => {
                if (seekedFired) return;
                seekedFired = true;

                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        cleanup();
                        return reject(new Error('Could not get canvas context'));
                    }
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    
                    const previewUrl = canvas.toDataURL('image/jpeg', 0.9);
                    const base64Data = previewUrl.split(',')[1];

                    canvas.toBlob((blob) => {
                        if (!blob) {
                            cleanup();
                            return reject(new Error('Failed to create blob from canvas'));
                        }
                        const file = new File([blob], `frame_at_${time}s.jpg`, { type: 'image/jpeg' });
                        
                        cleanup();
                        resolve({
                            file,
                            base64Data,
                            preview: previewUrl,
                        });
                    }, 'image/jpeg', 0.9);

                } catch (e) {
                    cleanup();
                    reject(e);
                }
            };
            
            const onError = (e: Event | string) => {
                cleanup();
                reject(new Error(`Video error: ${e instanceof Event ? (e.target as HTMLVideoElement).error?.message : e}`));
            };

            const onLoadedMetadata = () => {
                 if (video.duration < time) {
                     cleanup();
                     reject(new Error(`Video is shorter than ${time}s. Cannot capture frame.`));
                     return;
                 }
                 video.currentTime = time;
            };


            video.addEventListener('loadedmetadata', onLoadedMetadata);
            video.addEventListener('seeked', onSeeked);
            video.addEventListener('error', onError);
            
            video.load();
        });
    }, []);

    const handleGenerateVideo = useCallback(async (coreSettings: Pick<GenerationSettings, 'prompt' | 'image'>) => {
        if (!apiKey) {
            alert("Aiya! You need to set your API Key before generating a video.");
            return;
        }

        setIsLoading(true);
        setCurrentVideo(null);
        if (referenceImage && referenceImage.preview.startsWith('blob:')) {
            URL.revokeObjectURL(referenceImage.preview);
        }
        setReferenceImage(null); // Clear old image at start of new generation

        const loadingMessages = [
            "Consulting the spirits...",
            "Crossing the veil...",
            "Capturing ethereal moments...",
            "Wandering the spirit realm...",
            "Almost back from the beyond...",
        ];
        
        let messageIndex = 0;
        const intervalId = setInterval(() => {
            messageIndex = (messageIndex + 1) % loadingMessages.length;
            setLoadingMessage(loadingMessages[messageIndex]);
        }, 8000);

        const settings: GenerationSettings = {
            ...coreSettings,
            aspectRatio,
            enableSound,
            resolution,
        };

        try {
            const videoUrl = await generateVideo(settings, apiKey);
            let newVideo: GeneratedVideo;

            try {
                const frameData = await captureFrame(videoUrl, 8);
                newVideo = {
                    id: `vid_${Date.now()}`,
                    url: videoUrl,
                    prompt: settings.prompt,
                    settings: settings,
                    thumbnail: frameData,
                };
                setReferenceImage(frameData);
            } catch (frameError) {
                 newVideo = {
                    id: `vid_${Date.now()}`,
                    url: videoUrl,
                    prompt: settings.prompt,
                    settings: settings,
                };
                console.error("Could not capture frame from video:", frameError);
            }

            setCurrentVideo(newVideo);
            setVideoHistory(prev => [newVideo, ...prev]);

        } catch (error) {
            console.error("Video generation failed:", error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`An error occurred during video generation: ${errorMessage}\n\nPlease check your API key and try again.`);
            
            // Clear the invalid API key to re-prompt the user
            setApiKey('');
            localStorage.removeItem('user_api_key');

        } finally {
            setIsLoading(false);
            clearInterval(intervalId);
            setLoadingMessage("Summoning spirits to generate your video...");
        }
    }, [captureFrame, referenceImage, aspectRatio, enableSound, resolution, apiKey]);

    const handlePlayVideo = useCallback((video: GeneratedVideo) => {
        setModalVideo(video);
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalVideo(null);
    }, []);

    const handleHistoryThumbnailClick = useCallback((video: GeneratedVideo) => {
        if (video.thumbnail) {
            setReferenceImage(video.thumbnail);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, []);

    const isAppDisabled = isLoading || !apiKey;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a1111] via-black to-[#2d0f10] bg-fixed p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <Header />
                <main className="mt-8">
                    {!apiKey && (
                         <div className="mb-8">
                            <ApiKeyManager onSave={handleSaveApiKey} />
                        </div>
                    )}
                    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-start transition-opacity duration-500 ${!apiKey ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                        <div className="lg:col-span-3">
                            <VideoGeneratorForm 
                                onGenerate={handleGenerateVideo} 
                                isLoading={isAppDisabled} 
                                referenceImage={referenceImage}
                                setReferenceImage={setReferenceImage}
                            />
                        </div>
                        <div className="lg:col-span-6">
                           <VideoPreview 
                                video={currentVideo} 
                                isLoading={isLoading} 
                                loadingMessage={loadingMessage} 
                            />
                            <VideoSettings
                                aspectRatio={aspectRatio}
                                setAspectRatio={setAspectRatio}
                                enableSound={enableSound}
                                setEnableSound={setEnableSound}
                                resolution={resolution}
                                setResolution={setResolution}
                                isLoading={isAppDisabled}
                            />
                        </div>
                        <div className="lg:col-span-3">
                            <VideoHistory 
                                history={videoHistory} 
                                onPlay={handlePlayVideo} 
                                onThumbnailClick={handleHistoryThumbnailClick}
                            />
                        </div>
                    </div>
                </main>
            </div>
            {modalVideo && <VideoPlayerModal video={modalVideo} onClose={handleCloseModal} />}
        </div>
    );
};

export default App;
