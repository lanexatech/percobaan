
import React, { useState, useEffect } from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface PopupPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompts: [string, string, string];
  onSave: (newPrompts: [string, string, string]) => void;
}

const PopupPromptModal: React.FC<PopupPromptModalProps> = ({ isOpen, onClose, prompts, onSave }) => {
  const [currentPrompts, setCurrentPrompts] = useState(prompts);

  useEffect(() => {
    if (isOpen) {
      setCurrentPrompts(prompts);
    }
  }, [prompts, isOpen]);

  if (!isOpen) return null;

  const handlePromptChange = (index: number, value: string) => {
    const newPrompts = [...currentPrompts] as [string, string, string];
    newPrompts[index] = value;
    setCurrentPrompts(newPrompts);
  };

  const handleSave = () => {
    onSave(currentPrompts);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full flex flex-col h-[80vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-sky-700">Edit Storyboard Prompts</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-sky-200 transition-colors" aria-label="Close prompt editor">
            <CloseIcon />
          </button>
        </div>
        <div className="flex-grow space-y-4 overflow-y-auto pr-2">
            {[0, 1, 2].map((index) => (
                <div key={index}>
                    <label htmlFor={`popup-prompt-${index}`} className="block text-md font-semibold text-sky-800 mb-2">
                        Scene {index + 1}
                    </label>
                    <textarea
                        id={`popup-prompt-${index}`}
                        value={currentPrompts[index]}
                        onChange={(e) => handlePromptChange(index, e.target.value)}
                        placeholder={`Prompt for scene ${index+1}...`}
                        className="w-full h-32 p-3 bg-sky-50 rounded-lg border-2 border-sky-200 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors resize-none"
                    />
                </div>
            ))}
        </div>
        <button
          onClick={handleSave}
          className="mt-4 w-full bg-amber-400 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-amber-500 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default PopupPromptModal;
