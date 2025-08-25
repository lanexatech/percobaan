
import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { GenerationSettings } from '../types';
import { UploadIcon } from './icons/UploadIcon';
import { CloseIcon } from './icons/CloseIcon';
import { PromptModal } from './PromptModal';

interface VideoGeneratorFormProps {
    onGenerate: (settings: Pick<GenerationSettings, 'prompt' | 'image'>) => void;
    isLoading: boolean;
    referenceImage: { file: File; preview: string; base64Data: string } | null;
    setReferenceImage: React.Dispatch<React.SetStateAction<{ file: File; preview: string; base64Data: string } | null>>;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string));
        reader.onerror = error => reject(error);
    });
};

export const VideoGeneratorForm: React.FC<VideoGeneratorFormProps> = ({ onGenerate, isLoading, referenceImage, setReferenceImage }) => {
    const [prompt, setPrompt] = useState('');
    const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // This effect manages the lifecycle of Object URLs to prevent memory leaks.
        // The cleanup function for the previous `referenceImage` runs when it changes.
        return () => {
            if (referenceImage && referenceImage.preview.startsWith('blob:')) {
                URL.revokeObjectURL(referenceImage.preview);
            }
        };
    }, [referenceImage]);


    const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            fileToBase64(file).then(base64WithMime => {
                 setReferenceImage({
                    file,
                    preview: URL.createObjectURL(file),
                    base64Data: base64WithMime.split(',')[1]
                 });
            });
        }
    }, [setReferenceImage]);
    
    const removeImage = () => {
        setReferenceImage(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) {
            alert('Aiya! You need to enter a prompt.');
            return;
        }

        onGenerate({
            prompt,
            image: referenceImage ? { file: referenceImage.file, base64: referenceImage.base64Data } : null,
        });
    };

    const handleSavePrompt = (newPrompt: string) => {
        setPrompt(newPrompt);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="p-6 bg-gray-900/50 border-2 border-gray-800 rounded-lg shadow-lg backdrop-blur-sm h-[540px] flex flex-col">
                <div>
                    <label htmlFor="prompt-display" className="block text-lg font-medium text-red-400 mb-2 font-cinzel">Prompt</label>
                    <div
                        id="prompt-display"
                        onClick={() => !isLoading && setIsPromptModalOpen(true)}
                        className={`w-full h-32 p-3 bg-gray-800 border-2 border-gray-700 rounded-md transition text-gray-200 overflow-y-auto ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-red-500'}`}
                        role="button"
                        tabIndex={isLoading ? -1 : 0}
                        aria-label="Open prompt editor"
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { if (!isLoading) setIsPromptModalOpen(true); } }}
                    >
                        <p className={`whitespace-pre-wrap break-words ${prompt ? 'text-gray-200' : 'text-gray-500'}`}>
                            {prompt || "A cheerful ghost guiding travelers through a field of glowing flowers..."}
                        </p>
                    </div>
                </div>

                <div className="mt-6">
                     <label className="block text-lg font-medium text-red-400 mb-2 font-cinzel">Reference Image (Optional)</label>
                    {referenceImage ? (
                        <div className="relative group">
                            <img src={referenceImage.preview} alt="Image preview" className="w-full h-48 object-cover rounded-md" />
                             <button onClick={!isLoading ? removeImage : undefined} type="button" className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50" disabled={isLoading}>
                                 <CloseIcon className="w-5 h-5" />
                             </button>
                        </div>
                    ) : (
                        <div 
                            className={`flex justify-center items-center w-full h-48 px-6 border-2 border-dashed border-gray-700 rounded-md transition ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer hover:border-red-500'}`}
                            onClick={() => !isLoading && fileInputRef.current?.click()}
                        >
                           <div className="text-center">
                               <UploadIcon className="mx-auto h-8 w-8 text-gray-500"/>
                               <p className="mt-1 text-sm text-gray-400">
                                   <span className="font-semibold text-red-400">Upload a file</span> or drag and drop
                               </p>
                               <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                           </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept="image/png, image/jpeg, image/gif"
                                onChange={handleImageUpload}
                                disabled={isLoading}
                            />
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-6">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 font-bold text-lg text-white bg-red-700 rounded-lg hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-800/40 focus:outline-none focus:ring-4 focus:ring-red-500/50"
                    >
                        {isLoading ? 'Venturing into the unknown...' : 'Generate Video'}
                    </button>
                </div>
            </form>
            <PromptModal 
                isOpen={isPromptModalOpen}
                prompt={prompt}
                onSave={handleSavePrompt}
                onClose={() => setIsPromptModalOpen(false)}
            />
        </>
    );
};
