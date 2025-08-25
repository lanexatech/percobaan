import React, { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Settings, HistoryItem, ApiError } from './types';
import { generateVideo, fetchVideoBlob, generateStoryboardPrompts } from './services/geminiService';
import Header from './components/Header';
import ControlsPanel from './components/ControlsPanel';
import VideoDisplay from './components/VideoDisplay';
import HistoryPanel from './components/HistoryPanel';
import ApiKeyModal from './components/ApiKeyModal';
import { HistoryIcon } from './components/icons/HistoryIcon';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useLocalStorage<string | null>('gemini-api-key', null);
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(!apiKey);
  const [settings, setSettings] = useState<Settings>({
    prompts: ['', '', ''],
    image: null,
    aspectRatio: '16:9',
    sound: true,
    resolution: '1080p',
  });
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState<boolean>(false);
  const [generationStatus, setGenerationStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<HistoryItem | null>(null);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('video-history', []);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!apiKey) {
      setShowApiKeyModal(true);
    } else {
      setShowApiKeyModal(false);
    }
  }, [apiKey]);

  const handleApiKeySubmit = (newKey: string) => {
    setApiKey(newKey);
    setShowApiKeyModal(false);
    setError(null);
  };

  const handleGeneratePromptsFromIdea = async (idea: string) => {
    if (!apiKey) {
        setError('An API key is required to generate prompt ideas.');
        setShowApiKeyModal(true);
        return;
    }
    if (!idea.trim()) {
        setError('Please enter an idea to generate prompts.');
        return;
    }

    setIsGeneratingPrompts(true);
    setError(null);

    try {
        const newPrompts = await generateStoryboardPrompts(apiKey, idea);
        setSettings(s => ({ ...s, prompts: newPrompts }));
    } catch (err) {
        const apiError = err as ApiError;
        let errorMessage = 'Failed to generate prompts from idea.';
        if (apiError.message) {
            errorMessage = apiError.message;
        }
        if (apiError.status === 400 || apiError.status === 403 || apiError.status === 429) {
            errorMessage = `API Error: ${apiError.message}. Your API key might be invalid or have exceeded its quota.`;
            setShowApiKeyModal(true);
        }
        setError(errorMessage);
        console.error(err);
    } finally {
        setIsGeneratingPrompts(false);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!apiKey || settings.prompts.some(p => p.trim() === '')) {
      setError('API Key and all three prompt scenes are required to generate a storyboard.');
      if (!apiKey) setShowApiKeyModal(true);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCurrentVideo(null);
    setGenerationStatus('Initializing storyboard generation...');

    try {
      const onProgress = (status: string) => setGenerationStatus(status);
      const downloadLinks = await generateVideo(apiKey, settings, onProgress);

      onProgress('Fetching generated videos...');
      const videoBlobs = await Promise.all(
          downloadLinks.map(link => fetchVideoBlob(link, apiKey))
      );
      const videoUrls = videoBlobs.map(blob => URL.createObjectURL(blob));
      
      const newVideo: HistoryItem = {
        id: Date.now().toString(),
        prompts: settings.prompts,
        videoUrls,
        downloadLinks,
        timestamp: new Date().toISOString(),
      };

      setCurrentVideo(newVideo);
      setHistory(prev => [newVideo, ...prev.slice(0, 19)]); // Keep history to 20 items
    } catch (err) {
        const apiError = err as ApiError;
        let errorMessage = 'An unexpected error occurred.';
        if (apiError.message) {
            errorMessage = apiError.message;
        }
        if (apiError.status === 400 || apiError.status === 403 || apiError.status === 429) {
            errorMessage = `API Error: ${apiError.message}. Your API key might be invalid or have exceeded its quota.`;
            setShowApiKeyModal(true);
        }
        setError(errorMessage);
        console.error(err);
    } finally {
      setIsGenerating(false);
      setGenerationStatus('');
    }
  }, [apiKey, settings, setHistory]);
  
  const handleSelectHistoryItem = async (item: HistoryItem) => {
      if (!apiKey) {
        setError("An API key is required to view historical videos.");
        setShowApiKeyModal(true);
        return;
      }
      try {
        const videoBlobs = await Promise.all(
          item.downloadLinks.map(link => fetchVideoBlob(link, apiKey))
        );
        const freshVideoUrls = videoBlobs.map(blob => URL.createObjectURL(blob));

        setCurrentVideo({ ...item, videoUrls: freshVideoUrls });
        setIsHistoryPanelOpen(false);
      } catch (err) {
        setError("Could not retrieve the videos. The links may have expired or the API key is invalid.");
        setShowApiKeyModal(true);
      }
  };


  return (
    <div className="min-h-screen bg-sky-100/50 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-screen-2xl mx-auto">
        <Header />
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          <div className="lg:col-span-4">
            <ControlsPanel
              settings={settings}
              setSettings={setSettings}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              onGeneratePrompts={handleGeneratePromptsFromIdea}
              isGeneratingPrompts={isGeneratingPrompts}
            />
          </div>
          <div className="lg:col-span-8">
            <VideoDisplay
              videoItem={currentVideo}
              isGenerating={isGenerating}
              status={generationStatus}
              error={error}
            />
          </div>
        </main>
        <footer className="text-center mt-12 text-slate-500 text-sm">
          @2025 VEO Video Generator by LANEXA
        </footer>
      </div>

      <button
        onClick={() => setIsHistoryPanelOpen(true)}
        className="fixed bottom-6 right-6 bg-amber-400 text-white p-4 rounded-full shadow-lg hover:bg-amber-500 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
        aria-label="Open video history"
      >
        <HistoryIcon />
      </button>

      <HistoryPanel
        isOpen={isHistoryPanelOpen}
        onClose={() => setIsHistoryPanelOpen(false)}
        history={history}
        onSelect={handleSelectHistoryItem}
      />

      {showApiKeyModal && <ApiKeyModal onSubmit={handleApiKeySubmit} />}
    </div>
  );
};

export default App;