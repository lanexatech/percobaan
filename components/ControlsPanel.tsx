import React, { useCallback, useState } from 'react';
import type { Settings } from '../types';
import { MusicNoteIcon } from './icons/MusicNoteIcon';
import { ExpandIcon } from './icons/ExpandIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import PopupPromptModal from './PopupPromptModal';

interface ControlsPanelProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  onGenerate: () => void;
  isGenerating: boolean;
  onGeneratePrompts: (idea: string) => void;
  isGeneratingPrompts: boolean;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-sky-400 mb-2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);


const ControlsPanel: React.FC<ControlsPanelProps> = ({ settings, setSettings, onGenerate, isGenerating, onGeneratePrompts, isGeneratingPrompts }) => {
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [promptIdea, setPromptIdea] = useState("");

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setSettings(s => ({
          ...s,
          image: { base64: base64String, mimeType: file.type, name: file.name },
        }));
      };
      reader.readAsDataURL(file);
    }
  }, [setSettings]);

  const removeImage = () => {
    setSettings(s => ({ ...s, image: null }));
  };
  
  const handlePromptChange = (index: number, value: string) => {
    setSettings(s => {
      const newPrompts = [...s.prompts] as [string, string, string];
      newPrompts[index] = value;
      return { ...s, prompts: newPrompts };
    });
  };

  const handleSettingChange = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(s => ({
        ...s,
        [key]: value,
    }));
  }, [setSettings]);
  
  const handleGenerateIdeaClick = () => {
      if (promptIdea.trim()) {
          onGeneratePrompts(promptIdea);
      }
  };

  const OptionButton = <T,>({
    value,
    currentValue,
    onClick,
    children,
    disabled = false
  }: {
    value: T;
    currentValue: T;
    onClick: () => void;
    children: React.ReactNode;
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
        currentValue === value ? 'bg-sky-500 text-white shadow' : 'bg-white text-slate-600 hover:bg-sky-100'
      } disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );

  const isAnyGenerationRunning = isGenerating || isGeneratingPrompts;
  const isGenerateDisabled = isAnyGenerationRunning || settings.prompts.some(p => p.trim() === '');

  return (
    <>
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-sky-200 flex flex-col h-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-6 gap-y-4">
            {/* Left Column: Prompts */}
            <div className="lg:col-span-3 flex flex-col gap-4">
                <div>
                    <label htmlFor="prompt-idea" className="block text-lg font-semibold text-sky-800 mb-2">
                        Storyboard Idea
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            id="prompt-idea"
                            type="text"
                            value={promptIdea}
                            onChange={(e) => setPromptIdea(e.target.value)}
                            placeholder="e.g., A cat learning to play piano"
                            className="flex-grow p-2.5 bg-sky-50 rounded-lg border-2 border-sky-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors disabled:bg-slate-200"
                            disabled={isAnyGenerationRunning}
                        />
                        <button
                            onClick={handleGenerateIdeaClick}
                            disabled={!promptIdea.trim() || isAnyGenerationRunning}
                            className="p-2.5 bg-amber-400 text-white rounded-lg shadow-sm hover:bg-amber-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                            aria-label="Generate prompts from idea"
                        >
                            {isGeneratingPrompts ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <LightbulbIcon />
                            )}
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="block text-lg font-semibold text-sky-800">
                            Storyboard Prompts
                        </label>
                        <button
                            onClick={() => setIsPromptModalOpen(true)}
                            className="p-1.5 rounded-md bg-sky-200/50 text-sky-600 hover:bg-sky-300/70 transition-colors"
                            aria-label="Expand prompt input"
                            disabled={isAnyGenerationRunning}
                        >
                            <ExpandIcon />
                        </button>
                    </div>
                  
                    {[0, 1, 2].map((index) => (
                        <div key={index}>
                            <label htmlFor={`prompt-${index}`} className="block text-sm font-medium text-slate-600 mb-1">
                                Scene {index + 1}
                            </label>
                            <textarea
                                id={`prompt-${index}`}
                                value={settings.prompts[index]}
                                onChange={(e) => handlePromptChange(index, e.target.value)}
                                placeholder={
                                    index === 0 ? "e.g., A cheerful idol in a blue dress..." :
                                    index === 1 ? "She starts singing on a beautiful stage..." :
                                    "The crowd cheers enthusiastically..."
                                }
                                className="w-full h-20 p-2 bg-sky-50 rounded-lg border-2 border-sky-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors resize-none disabled:bg-slate-200"
                                disabled={isAnyGenerationRunning}
                                rows={2}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Column: Settings */}
            <div className="lg:col-span-2 flex flex-col gap-4">
                <div>
                    <label className="block text-md font-semibold text-sky-800 mb-2">Reference Image (Scene 1)</label>
                    {!settings.image ? (
                      <label className={`cursor-pointer w-full aspect-square flex flex-col justify-center items-center p-3 border-2 border-dashed border-sky-300 rounded-lg bg-sky-50 transition-colors ${isAnyGenerationRunning ? 'cursor-not-allowed bg-slate-200' : 'hover:bg-sky-100'}`}>
                          <UploadIcon />
                        <span className="text-slate-600 text-center text-sm">Upload Image</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isAnyGenerationRunning} />
                      </label>
                    ) : (
                      <div className="w-full aspect-square rounded-lg relative group shadow-inner">
                        <img
                          src={`data:${settings.image.mimeType};base64,${settings.image.base64}`}
                          alt="Reference preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                          <button 
                            onClick={removeImage} 
                            className="text-white bg-red-500 hover:bg-red-600 font-semibold text-sm px-4 py-2 rounded-md transition-colors disabled:bg-red-400"
                            disabled={isAnyGenerationRunning}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-md font-semibold text-sky-800 mb-2">Aspect Ratio</label>
                        <div className="flex bg-sky-200/50 p-1 rounded-lg space-x-1">
                            <OptionButton value="16:9" currentValue={settings.aspectRatio} onClick={() => handleSettingChange('aspectRatio', '16:9')} disabled={isAnyGenerationRunning}>16:9</OptionButton>
                            <OptionButton value="9:16" currentValue={settings.aspectRatio} onClick={() => handleSettingChange('aspectRatio', '9:16')} disabled={isAnyGenerationRunning}>9:16</OptionButton>
                        </div>
                    </div>
                    <div>
                        <label className="block text-md font-semibold text-sky-800 mb-2">Sound</label>
                        <div className="flex bg-sky-200/50 p-1 rounded-lg space-x-1">
                            <OptionButton value={true} currentValue={settings.sound} onClick={() => handleSettingChange('sound', true)} disabled={isAnyGenerationRunning}>On</OptionButton>
                            <OptionButton value={false} currentValue={settings.sound} onClick={() => handleSettingChange('sound', false)} disabled={isAnyGenerationRunning}>Off</OptionButton>
                        </div>
                    </div>
                    <div>
                        <label className="block text-md font-semibold text-sky-800 mb-2">Resolution</label>
                        <div className="flex bg-sky-200/50 p-1 rounded-lg space-x-1">
                            <OptionButton value="1080p" currentValue={settings.resolution} onClick={() => handleSettingChange('resolution', '1080p')} disabled={isAnyGenerationRunning}>1080p</OptionButton>
                            <OptionButton value="720p" currentValue={settings.resolution} onClick={() => handleSettingChange('resolution', '720p')} disabled={isAnyGenerationRunning}>720p</OptionButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <button
          onClick={onGenerate}
          disabled={isGenerateDisabled}
          className="mt-auto w-full flex items-center justify-center gap-3 bg-amber-400 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-amber-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all transform hover:scale-105"
        >
          {isGenerating ? (
              <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Storyboard...
              </>
          ) : (
              <>
                  <MusicNoteIcon />
                  Generate Video
              </>
          )}
        </button>
      </div>
      <PopupPromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        prompts={settings.prompts}
        onSave={(newPrompts) => handleSettingChange('prompts', newPrompts)}
      />
    </>
  );
};

export default ControlsPanel;