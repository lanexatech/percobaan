
import React, { useRef, useCallback } from 'react';
import { ICONS } from '../constants';
import { ImageFile } from '../types';
import IconButton from './IconButton';

interface ImageUploaderProps {
  imageFile: ImageFile | null;
  onImageChange: (file: ImageFile | null) => void;
  disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ imageFile, onImageChange, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        onImageChange({
          base64: base64String,
          mimeType: file.type,
          previewUrl: URL.createObjectURL(file),
        });
      };
      reader.readAsDataURL(file);
    }
     // Reset file input value to allow re-uploading the same file
    if(event.target) {
        event.target.value = '';
    }
  }, [onImageChange]);

  const handleRemoveImage = useCallback(() => {
    if (imageFile) {
      URL.revokeObjectURL(imageFile.previewUrl);
    }
    onImageChange(null);
  }, [imageFile, onImageChange]);

  return (
    <div className="w-full">
      <label className="block text-slate-700 font-medium mb-2">Reference Image (Optional)</label>
      <div
        className="w-full h-40 border-2 border-dashed border-slate-300/70 rounded-lg flex items-center justify-center transition-colors duration-200 bg-white/30 hover:border-blue-400/70"
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          disabled={disabled}
        />
        {!imageFile ? (
          <div className="text-center text-slate-500 cursor-pointer">
            {ICONS.upload}
            <p>Click to upload</p>
          </div>
        ) : (
          <div className="relative w-full h-full p-2">
            <img
              src={imageFile.previewUrl}
              alt="Preview"
              className="w-full h-full object-contain rounded-md"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
              disabled={disabled}
              className="absolute top-2 right-2 p-1.5 bg-white/70 rounded-full text-slate-600 hover:bg-white hover:text-red-500 transition-colors duration-200"
              aria-label="Remove image"
            >
              {ICONS.trash}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
