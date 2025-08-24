import React, { useRef, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface PromptInputProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    setImageFile: (file: File | null) => void;
    onGenerate: () => void;
    isGenerating: boolean;
    isLocked: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, setImageFile, onGenerate, isGenerating, isLocked }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const clearImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    
    return (
        <div className={`h-full flex flex-col p-6 rounded-xl border border-white/20 bg-white/5 backdrop-blur-lg transition-opacity duration-500 ${isLocked ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}>
            <fieldset disabled={isLocked || isGenerating} className="flex flex-col flex-grow gap-4">
                <label htmlFor="prompt-area" className="text-lg font-semibold text-gray-200">
                    Your Prompt
                </label>
                <textarea
                    id="prompt-area"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the video you want to create. e.g., 'A neon hologram of a cat driving at top speed'"
                    className="flex-grow w-full p-3 bg-black/20 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 resize-none text-gray-200"
                />
                
                <div className="flex flex-col items-center gap-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-black/20 border border-dashed border-white/30 rounded-md hover:bg-white/10 transition-colors duration-300"
                    >
                        <UploadIcon />
                        <span>Upload Reference Image (Optional)</span>
                    </button>
                    {imagePreview && (
                        <div className="relative w-full max-w-xs">
                            <img src={imagePreview} alt="Image preview" className="rounded-lg w-full h-auto object-cover"/>
                            <button onClick={clearImage} className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm">&times;</button>
                        </div>
                    )}
                </div>

                <button
                    onClick={onGenerate}
                    className="w-full py-3 text-lg font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-wait"
                >
                    {isGenerating ? 'Generating...' : 'Generate Video'}
                </button>
            </fieldset>
             {isLocked && <div className="text-center text-yellow-400 mt-4">Please set your API Key to unlock.</div>}
        </div>
    );
};