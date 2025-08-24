
import { GoogleGenAI } from "@google/genai";
import { VideoOptions, ImageFile } from '../types';

if (!process.env.API_KEY) {
  throw new Error("AIzaSyBnJIfHXhD05bdQPuVjjNEbrdjN2jpGZIU");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateVideo = async (
  prompt: string,
  imageFile: ImageFile | null,
  options: VideoOptions,
  onProgress: (message: string) => void
): Promise<string> => {
  onProgress('Initializing video generation...');

  const generationConfig: {
    numberOfVideos: number;
    aspectRatio?: '16:9' | '9:16';
    withSound?: boolean;
    resolution?: '720p' | '1080p';
  } = {
    numberOfVideos: 1,
    aspectRatio: options.aspectRatio,
    withSound: options.enableSound,
    resolution: options.resolution,
  };

  const generateParams: {
    model: string;
    prompt: string;
    image?: { imageBytes: string; mimeType: string };
    config: typeof generationConfig;
  } = {
    model: 'veo-3.0-generate-preview',
    prompt: prompt,
    config: generationConfig,
  };

  if (imageFile) {
    generateParams.image = {
      imageBytes: imageFile.base64,
      mimeType: imageFile.mimeType,
    };
  }

  let operation = await ai.models.generateVideos(generateParams);
  onProgress('Video generation started. This may take a few minutes.');

  while (!operation.done) {
    await wait(10000); // Poll every 10 seconds
    onProgress('Still processing... Your video is being crafted.');
    try {
        operation = await ai.operations.getVideosOperation({ operation: operation });
    } catch (error) {
        console.error("Error polling for video status:", error);
        throw new Error("Failed to get video generation status.");
    }
  }

  onProgress('Finalizing video...');

  if (!operation.response?.generatedVideos?.[0]?.video?.uri) {
    console.error('API Error:', operation);
    throw new Error('Video generation failed or returned no video URI.');
  }

  const downloadLink = operation.response.generatedVideos[0].video.uri;
  
  onProgress('Downloading video data...');

  const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!videoResponse.ok) {
    throw new Error(`Failed to download video file. Status: ${videoResponse.statusText}`);
  }

  const videoBlob = await videoResponse.blob();
  const videoUrl = URL.createObjectURL(videoBlob);

  onProgress('Generation complete!');
  return videoUrl;
};
