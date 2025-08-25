
import React, { useState } from 'react';
import { SaveIcon } from './icons/SaveIcon';
import { EyeIcon } from './icons/EyeIcon';
import { EyeOffIcon } from './icons/EyeOffIcon';

interface ApiKeyManagerProps {
    onSave: (key: string) => void;
}

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onSave }) => {
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);

    const handleSave = () => {
        if (apiKey.trim()) {
            onSave(apiKey);
        } else {
            alert("Please enter a valid API Key.");
        }
    };
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSave();
        }
    };

    return (
        <div className="p-6 bg-gray-900/50 border-2 border-red-800/50 rounded-lg shadow-lg shadow-red-900/20">
            <h3 className="text-xl font-bold mb-1 text-red-400 font-cinzel">API Key Required</h3>
            <p className="text-gray-400 mb-4 text-sm">Please enter your Google AI API Key to activate the application.</p>
            <div className="flex items-center gap-2">
                <div className="relative flex-grow">
                    <input
                        type={showKey ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter your API Key here"
                        className="w-full p-3 pr-10 bg-gray-800 border-2 border-gray-700 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition text-gray-200 placeholder-gray-500"
                    />
                    <button 
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="absolute inset-y-0 right-0 px-3 text-gray-400 hover:text-white"
                        aria-label={showKey ? 'Hide API Key' : 'Show API Key'}
                    >
                        {showKey ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                </div>
                <button
                    onClick={handleSave}
                    className="p-3 font-bold text-white bg-red-700 rounded-lg hover:bg-red-600 transition-all transform hover:scale-105 disabled:bg-gray-600"
                    aria-label="Save API Key"
                >
                    <SaveIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};
