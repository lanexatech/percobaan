
export interface VideoOptions {
  aspectRatio: '16:9' | '9:16';
  enableSound: boolean;
  resolution: '720p' | '1080p';
}

export enum GenerationState {
  IDLE,
  GENERATING,
  SUCCESS,
  ERROR,
}

export interface ImageFile {
  base64: string;
  mimeType: string;
  previewUrl: string;
}
