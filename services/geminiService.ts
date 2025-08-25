
import { GoogleGenAI } from "@google/genai";
import type { GenerationSettings } from '../types';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};


export const generateVideo = async (settings: GenerationSettings, apiKey: string): Promise<string> => {
    if (!apiKey) {
        throw new Error("API_KEY is missing. Please provide a valid key.");
    }
    
    const ai = new GoogleGenAI({ apiKey });

    console.log("Starting video generation with settings:", settings);

    const payload: any = {
        model: 'veo-3.0-generate-preview',
        prompt: settings.prompt,
        config: {
            numberOfVideos: 1,
        }
    };

    if (settings.image) {
        payload.image = {
            imageBytes: settings.image.base64,
            mimeType: settings.image.file.type,
        };
    }
    
    // Note: As of the current Gemini API docs, aspect ratio, sound, and resolution
    // are not directly supported in the `generateVideos` call.
    // The UI elements are included as per the request for future compatibility.
    // We will not pass these to the API to avoid errors.

    let operation = await ai.models.generateVideos(payload);
    console.log("Video generation operation started:", operation);

    while (!operation.done) {
        console.log("Polling for video generation status...");
        await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
        operation = await ai.operations.getVideosOperation({ operation: operation });
        console.log("Current operation status:", operation);
    }
    
    console.log("Video generation operation complete.");

    if (operation.response?.generatedVideos && operation.response.generatedVideos.length > 0) {
        const downloadLink = operation.response.generatedVideos[0].video?.uri;
        if (!downloadLink) {
            throw new Error("Download link not found in API response.");
        }
        
        console.log("Fetching video from download link:", downloadLink);
        // The API key must be appended to the download URL
        const videoResponse = await fetch(`${downloadLink}&key=${apiKey}`);
        
        if (!videoResponse.ok) {
            const errorText = await videoResponse.text();
            console.error("Failed to fetch video:", videoResponse.status, errorText);
            throw new Error(`Failed to fetch video: ${videoResponse.statusText}. Please check if your API key is valid or has exceeded its quota.`);
        }
        
        const videoBlob = await videoResponse.blob();
        const videoUrl = URL.createObjectURL(videoBlob);
        console.log("Video successfully fetched and blob URL created.");
        return videoUrl;

    } else {
        console.error("API response did not contain generated videos:", operation.response);
        throw new Error("Video generation succeeded, but no video was returned.");
    }
};
