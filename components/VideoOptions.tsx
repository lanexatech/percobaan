import React from 'react';
import { VideoOptions as VideoOptionsType } from '../types';

interface VideoOptionsProps {
  options: VideoOptionsType;
  setOptions: React.Dispatch<React.SetStateAction<VideoOptionsType>>;
  disabled: boolean;
}

interface OptionButtonProps<T> {
  value: T;
  label: string;
  current: T;
  onClick: () => void;
  disabled: boolean;
}

const OptionButton = <T,>({ value, label, current, onClick, disabled }: OptionButtonProps<T>) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
      current === value ? 'bg-blue-500 text-white shadow-md' : 'bg-white/50 hover:bg-white/80 text-slate-600'
    } disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {label}
  </button>
);

const VideoOptions: React.FC<VideoOptionsProps> = ({ options, setOptions, disabled }) => {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label className="block text-slate-700 font-medium mb-2 text-sm">Aspect Ratio</label>
        <div className="flex space-x-2 bg-white/30 p-1 rounded-lg">
          <OptionButton value="16:9" label="16:9" current={options.aspectRatio} onClick={() => setOptions(o => ({...o, aspectRatio: '16:9'}))} disabled={disabled}/>
          <OptionButton value="9:16" label="9:16" current={options.aspectRatio} onClick={() => setOptions(o => ({...o, aspectRatio: '9:16'}))} disabled={disabled}/>
        </div>
      </div>
      <div>
        <label className="block text-slate-700 font-medium mb-2 text-sm">Sound</label>
        <div className="flex space-x-2 bg-white/30 p-1 rounded-lg">
          <OptionButton value={true} label="On" current={options.enableSound} onClick={() => setOptions(o => ({...o, enableSound: true}))} disabled={disabled}/>
          <OptionButton value={false} label="Off" current={options.enableSound} onClick={() => setOptions(o => ({...o, enableSound: false}))} disabled={disabled}/>
        </div>
      </div>
      <div>
        <label className="block text-slate-700 font-medium mb-2 text-sm">Resolution</label>
        <div className="flex space-x-2 bg-white/30 p-1 rounded-lg">
          <OptionButton value="1080p" label="1080p" current={options.resolution} onClick={() => setOptions(o => ({...o, resolution: '1080p'}))} disabled={disabled}/>
          <OptionButton value="720p" label="720p" current={options.resolution} onClick={() => setOptions(o => ({...o, resolution: '720p'}))} disabled={disabled}/>
        </div>
      </div>
    </div>
  );
};

export default VideoOptions;