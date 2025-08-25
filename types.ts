
export interface GenerationSettings {
    prompt: string;
    image: {
        file: File;
        base64: string;
    } | null;
    aspectRatio: '16:9' | '9:16';
    enableSound: boolean;
    resolution: '720p' | '1080p';
}

export interface GeneratedVideo {
    id: string;
    url: string;
    prompt: string;
    settings: GenerationSettings;
    thumbnail?: {
        file: File;
        preview: string;
        base64Data: string;
    };
}
