
import React, { useState, useCallback } from 'react';
import { ApiKeyInput } from './components/ApiKeyInput';
import { PromptInput } from './components/PromptInput';
import { VideoPreview } from './components/VideoPreview';
import { VideoGallery } from './components/VideoGallery';
import { generateVideoFromApi } from './services/geminiService';
import { GeneratedVideo } from './types';

const App: React.FC = () => {
    const [apiKey, setApiKey] = useState<string>('');
    const [isApiKeySet, setIsApiKeySet] = useState<boolean>(false);
    const [prompt, setPrompt] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [generationStatus, setGenerationStatus] = useState<string>('');
    const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([]);
    const [currentVideo, setCurrentVideo] = useState<GeneratedVideo | null>(null);
    const [error, setError] = useState<string>('');

    const handleApiKeySubmit = (newApiKey: string) => {
        if (newApiKey.trim()) {
            setApiKey(newApiKey);
            setIsApiKeySet(true);
            setError('');
        } else {
            setError('API Key cannot be empty.');
        }
    };
    
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                resolve(result.split(',')[1]);
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleGenerateVideo = useCallback(async () => {
        if (!prompt.trim()) {
            setError('Prompt cannot be empty.');
            return;
        }

        setIsGenerating(true);
        setError('');
        setCurrentVideo(null);
        setGenerationStatus('Initializing...');

        try {
            const imageBase64 = imageFile ? await fileToBase64(imageFile) : undefined;
            
            const videoUrl = await generateVideoFromApi(apiKey, prompt, imageBase64, setGenerationStatus);
            
            const newVideo: GeneratedVideo = {
                id: `vid_${Date.now()}`,
                url: videoUrl,
                prompt: prompt,
            };

            setGeneratedVideos(prev => [newVideo, ...prev]);
            setCurrentVideo(newVideo);

        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Generation failed: ${errorMessage}`);
            setGenerationStatus(`Error: ${errorMessage}`);
        } finally {
            setIsGenerating(false);
        }
    }, [apiKey, prompt, imageFile]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100 flex flex-col p-4 sm:p-6 lg:p-8 font-sans">
            <header className="w-full max-w-7xl mx-auto mb-6">
                <h1 className="text-4xl font-bold text-white text-center mb-2 tracking-wide">VEO<span className="text-purple-400">3</span> Video Generator</h1>
                <p className="text-center text-gray-400">Powered by LANEXA</p>
                <div className="mt-6">
                    <ApiKeyInput onSubmit={handleApiKeySubmit} isSet={isApiKeySet} />
                </div>
            </header>

            <main className="flex-grow w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                <aside className="lg:w-1/3 flex flex-col gap-6">
                    <PromptInput
                        prompt={prompt}
                        setPrompt={setPrompt}
                        setImageFile={setImageFile}
                        onGenerate={handleGenerateVideo}
                        isGenerating={isGenerating}
                        isLocked={!isApiKeySet}
                    />
                </aside>

                <section className="lg:w-2/3 flex-grow flex flex-col">
                     <VideoPreview
                        video={currentVideo}
                        isGenerating={isGenerating}
                        status={generationStatus}
                        error={error}
                        videoCount={generatedVideos.length}
                    />
                </section>
            </main>
            
            <section className="w-full max-w-7xl mx-auto mt-8">
                <VideoGallery videos={generatedVideos} onSelectVideo={setCurrentVideo} />
            </section>

            <footer className="w-full text-center text-gray-500 py-6 mt-auto">
                &copy;2025 VEO Video Generator by LANEXA
            </footer>
        </div>
    );
};

export default App;
