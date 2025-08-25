
export interface Settings {
  prompts: [string, string, string];
  image: {
    base64: string;
    mimeType: string;
    name: string;
  } | null;
  aspectRatio: '16:9' | '9:16';
  sound: boolean; // Note: UI only, VEO API doesn't have this param yet
  resolution: '720p' | '1080p'; // Note: UI only, VEO API doesn't have this param yet
}

export interface HistoryItem {
  id: string;
  prompts: [string, string, string];
  videoUrls: string[];
  downloadLinks: string[];
  timestamp: string;
}

export interface ApiError extends Error {
    status?: number;
}
