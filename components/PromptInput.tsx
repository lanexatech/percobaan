
import React from 'react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="w-full">
      <label htmlFor="prompt" className="block text-slate-700 font-medium mb-2">
        Prompt
      </label>
      <textarea
        id="prompt"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="A neon hologram of a cat driving a sports car at top speed..."
        rows={4}
        className="w-full p-3 bg-white/60 rounded-lg border border-white/30 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-shadow duration-200 shadow-inner placeholder-slate-400 text-slate-800 disabled:bg-slate-200/50"
      />
    </div>
  );
};

export default PromptInput;
