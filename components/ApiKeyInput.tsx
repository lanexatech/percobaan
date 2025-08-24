
import React, { useState } from 'react';
import { SendIcon } from './icons/SendIcon';

interface ApiKeyInputProps {
    onSubmit: (apiKey: string) => void;
    isSet: boolean;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSubmit, isSet }) => {
    const [key, setKey] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(key);
    };

    return (
        <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
            <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder={isSet ? "API Key is set. Enter a new one to replace." : "Enter your Google AI API Key..."}
                className="w-full pl-4 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
            />
            <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-300 hover:bg-white/20 hover:text-white transition-colors duration-300"
                aria-label="Save API Key"
            >
                <SendIcon />
            </button>
        </form>
    );
};
