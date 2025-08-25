import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface PromptModalProps {
    isOpen: boolean;
    prompt: string;
    onSave: (newPrompt: string) => void;
    onClose: () => void;
}

export const PromptModal: React.FC<PromptModalProps> = ({ isOpen, prompt, onSave, onClose }) => {
    const [editedPrompt, setEditedPrompt] = useState(prompt);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isOpen) {
            setEditedPrompt(prompt);
            // Focus textarea when modal opens
            setTimeout(() => textareaRef.current?.focus(), 100);
        }
    }, [isOpen, prompt]);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleSave = () => {
        onSave(editedPrompt);
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    // A simple CSS for animations is included for better UX without needing new files
    const animationStyles = `
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slide-up {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
    `;

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={onClose}
        >
            <style>{animationStyles}</style>
            <div 
                className="bg-gray-900 border-2 border-red-800/50 rounded-lg shadow-2xl shadow-red-900/40 w-full max-w-2xl flex flex-col overflow-hidden animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-red-400 font-cinzel">Edit Prompt</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full text-gray-400 hover:bg-red-600 hover:text-white transition"
                        aria-label="Close"
                    >
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">
                    <textarea
                        ref={textareaRef}
                        value={editedPrompt}
                        onChange={(e) => setEditedPrompt(e.target.value)}
                        placeholder="A cheerful ghost guiding travelers through a field of glowing flowers..."
                        className="w-full h-48 p-3 bg-gray-800 border-2 border-gray-700 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-gray-200 placeholder-gray-500 resize-none"
                    />
                </div>
                <div className="flex justify-end gap-4 p-4 bg-gray-900/50 border-t border-gray-800">
                    <button
                        onClick={onClose}
                        className="py-2 px-6 font-semibold text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="py-2 px-6 font-bold text-white bg-red-700 rounded-lg hover:bg-red-600 transition-all transform hover:scale-105"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};
