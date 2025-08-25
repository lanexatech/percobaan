
import React from 'react';
import type { HistoryItem } from '../types';
import { CloseIcon } from './icons/CloseIcon';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, history, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-40 transition-opacity"
      onClick={onClose}
    >
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-sky-50 shadow-2xl z-50 transform transition-transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-sky-200">
          <h2 className="text-2xl font-bold text-sky-700">Video History</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-sky-200 transition-colors">
            <CloseIcon />
          </button>
        </div>
        <div className="p-6 overflow-y-auto h-[calc(100%-77px)]">
          {history.length === 0 ? (
            <div className="text-center text-slate-500 mt-10">
              <p>No videos generated yet.</p>
              <p>Your creations will appear here!</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {history.map((item) => (
                <li
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:border-amber-400 border-2 border-transparent transition-all"
                >
                  <p className="font-semibold text-slate-700 truncate">
                    <span className="font-normal text-sky-600">Scene 1: </span>{item.prompts[0]}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;
