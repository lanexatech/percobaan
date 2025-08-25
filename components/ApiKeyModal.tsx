
import React, { useState } from 'react';

interface ApiKeyModalProps {
  onSubmit: (apiKey: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSubmit }) => {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onSubmit(key.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-sky-700 mb-2">Enter Gemini API Key</h2>
        <p className="text-slate-600 mb-6">
          Your API key is required to generate videos. It will be saved in your browser's local storage.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter your API Key here"
            className="w-full px-4 py-2 border-2 border-sky-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
          />
          <button
            type="submit"
            className="w-full bg-amber-400 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-500 transition-colors disabled:bg-slate-300"
            disabled={!key.trim()}
          >
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApiKeyModal;