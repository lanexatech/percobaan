
import React from 'react';

const ToggleButton = ({ children, selected, onClick, disabled }: { children: React.ReactNode; selected: boolean; onClick: () => void, disabled: boolean }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`w-full px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 border-2 ${
            selected 
            ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30' 
            : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-red-800'
        } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-700 disabled:hover:bg-gray-800`}
    >
        {children}
    </button>
);

interface VideoSettingsProps {
    aspectRatio: '16:9' | '9:16';
    setAspectRatio: (ratio: '16:9' | '9:16') => void;
    enableSound: boolean;
    setEnableSound: (enabled: boolean) => void;
    resolution: '720p' | '1080p';
    setResolution: (res: '720p' | '1080p') => void;
    isLoading: boolean;
}

export const VideoSettings: React.FC<VideoSettingsProps> = ({
    aspectRatio,
    setAspectRatio,
    enableSound,
    setEnableSound,
    resolution,
    setResolution,
    isLoading
}) => {
    return (
        <div className={`mt-4 p-4 bg-gray-900/50 border-2 border-gray-800 rounded-lg shadow-lg transition-opacity duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}>
            <fieldset disabled={isLoading} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <h4 className="text-sm font-medium text-red-400 mb-2 font-cinzel text-center sm:text-left">Aspect Ratio</h4>
                    <div className="flex gap-2">
                        <ToggleButton selected={aspectRatio === '16:9'} onClick={() => setAspectRatio('16:9')} disabled={isLoading}>16:9</ToggleButton>
                        <ToggleButton selected={aspectRatio === '9:16'} onClick={() => setAspectRatio('9:16')} disabled={isLoading}>9:16</ToggleButton>
                    </div>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-red-400 mb-2 font-cinzel text-center sm:text-left">Sound</h4>
                    <div className="flex gap-2">
                        <ToggleButton selected={enableSound} onClick={() => setEnableSound(true)} disabled={isLoading}>On</ToggleButton>
                        <ToggleButton selected={!enableSound} onClick={() => setEnableSound(false)} disabled={isLoading}>Off</ToggleButton>
                    </div>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-red-400 mb-2 font-cinzel text-center sm:text-left">Resolution</h4>
                    <div className="flex gap-2">
                        <ToggleButton selected={resolution === '1080p'} onClick={() => setResolution('1080p')} disabled={isLoading}>1080p</ToggleButton>
                        <ToggleButton selected={resolution === '720p'} onClick={() => setResolution('720p')} disabled={isLoading}>720p</ToggleButton>
                    </div>
                </div>
            </fieldset>
        </div>
    );
};
