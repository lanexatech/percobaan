import React, { useState, useCallback, useEffect } from 'react';
import { VideoOptions as VideoOptionsType, GenerationState, ImageFile } from './types';
import { generateVideo } from './services/geminiService';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ImageUploader from './components/ImageUploader';
import VideoOptions from './components/VideoOptions';
import Loader from './components/Loader';
import VideoPlayer from './components/VideoPlayer';
import GlassCard from './components/GlassCard';
import { ICONS, LOADING_MESSAGES } from './constants';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [videoOptions, setVideoOptions] = useState<VideoOptionsType>({
    aspectRatio: '16:9',
    enableSound: true,
    resolution: '1080p',
  });
  const [generationState, setGenerationState] = useState<GenerationState>(GenerationState.IDLE);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  const isLoading = generationState === GenerationState.GENERATING;

  const handleProgress = useCallback((message: string) => {
    setLoadingMessage(message);
  }, []);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setError(null);
    setGenerationState(GenerationState.GENERATING);
    setLoadingMessage(LOADING_MESSAGES[0]);

    try {
      const videoUrl = await generateVideo(prompt, imageFile, videoOptions, handleProgress);
      setGeneratedVideoUrl(videoUrl);
      setGenerationState(GenerationState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unknown error occurred during video generation.');
      setGenerationState(GenerationState.ERROR);
    }
  };
  
  const resetState = useCallback(() => {
    setPrompt('');
    setImageFile(null);
    setGeneratedVideoUrl(null);
    setError(null);
    setGenerationState(GenerationState.IDLE);
    if(generatedVideoUrl) {
        URL.revokeObjectURL(generatedVideoUrl);
    }
  }, [generatedVideoUrl]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    if (isLoading) {
      intervalId = setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = LOADING_MESSAGES.indexOf(prev);
          const nextIndex = (currentIndex + 1) % (LOADING_MESSAGES.length -1); // Exclude the last message from random cycling
          return LOADING_MESSAGES[nextIndex] || LOADING_MESSAGES[0];
        });
      }, 5000);
    }
    return () => clearInterval(intervalId);
  }, [isLoading]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans">
      <main className="w-full max-w-2xl mx-auto space-y-8">
        <Header />
        
        {generationState === GenerationState.SUCCESS && generatedVideoUrl ? (
          <VideoPlayer videoUrl={generatedVideoUrl} onReset={resetState} />
        ) : generationState === GenerationState.GENERATING ? (
          <Loader message={loadingMessage} />
        ) : (
          <GlassCard>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-6"
            >
              <PromptInput value={prompt} onChange={setPrompt} disabled={isLoading} />
              <ImageUploader imageFile={imageFile} onImageChange={setImageFile} disabled={isLoading} />
              <VideoOptions options={videoOptions} setOptions={setVideoOptions} disabled={isLoading} />
              
              {error && <p className="text-red-600 bg-red-100/50 p-3 rounded-lg text-center">{error}</p>}
              
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="w-full flex items-center justify-center gap-3 py-3 px-6 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
              >
                {ICONS.wand}
                <span>Generate Video</span>
              </button>
            </form>
          </GlassCard>
        )}
      </main>
    </div>
  );
};

export default App;