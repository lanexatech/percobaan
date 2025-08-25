import { GoogleGenAI, Type } from "@google/genai";
import type { Settings, ApiError } from '../types';

// Helper to convert file to base64
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        if (typeof reader.result === 'string') {
            resolve(reader.result.split(',')[1]);
        } else {
            reject(new Error("Failed to convert file to base64"));
        }
    };
    reader.onerror = error => reject(error);
});

const PROGRESS_MESSAGES = [
    "Warming up the creative engines...",
    "Composing a visual symphony...",
    "Teaching pixels to dance...",
    "Rendering digital dreams into reality...",
    "Adding a little bit of sparkle...",
    "Finalizing the masterpiece..."
];

export const generateStoryboardPrompts = async (apiKey: string, idea: string): Promise<[string, string, string]> => {
    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Based on the following idea, create a three-scene storyboard. Each scene should be a detailed, visually descriptive prompt for a video generator. The scenes must flow logically and tell a short, coherent story.

            Idea: "${idea}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        scenes: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                                description: "A detailed prompt for a single video scene."
                            },
                            description: "An array of exactly three scene prompts.",
                        }
                    },
                    required: ["scenes"]
                },
                temperature: 0.8,
            }
        });

        const jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr);

        if (result.scenes && Array.isArray(result.scenes) && result.scenes.length === 3) {
            return result.scenes as [string, string, string];
        } else {
            // Fallback for unexpected format
            const fallbackPrompts = [
                `Scene 1: ${idea}`,
                `Scene 2: Continuing the story of ${idea}`,
                `Scene 3: The conclusion of the story about ${idea}`,
            ];
            return fallbackPrompts as [string, string, string];
        }

    } catch (error: any) {
        console.error("Gemini API Error (Prompt Generation):", error);
        const apiError: ApiError = new Error(error.message || "An unknown API error occurred while generating prompts.");
        if (error.httpStatus) {
            apiError.status = error.httpStatus;
        } else if (error.message.includes("API key not valid")) {
            apiError.status = 403;
            apiError.message = "The provided API key is not valid.";
        } else if (error.message.includes("quota")) {
            apiError.status = 429;
            apiError.message = "You have exceeded your API quota.";
        }
        throw apiError;
    }
};


export const generateVideo = async (apiKey: string, settings: Settings, onProgress: (status: string) => void): Promise<string[]> => {
    try {
        const ai = new GoogleGenAI({ apiKey });
        const downloadLinks: string[] = [];

        for (let i = 0; i < settings.prompts.length; i++) {
            const currentPrompt = settings.prompts[i];
            let finalPrompt = currentPrompt;

            // Add context from previous prompts for continuity
            if (i === 1) {
                finalPrompt = `Continuing from the scene where "${settings.prompts[0]}", now show: ${currentPrompt}`;
            } else if (i === 2) {
                finalPrompt = `Following the scene where "${settings.prompts[1]}", the story concludes with: ${currentPrompt}`;
            }

            const params: any = {
                model: 'veo-3.0-generate-preview',
                prompt: finalPrompt,
                config: {
                    numberOfVideos: 1,
                },
            };

            // Only add reference image to the first scene
            if (i === 0 && settings.image) {
                params.image = {
                    imageBytes: settings.image.base64,
                    mimeType: settings.image.mimeType,
                };
            }
            
            onProgress(`Generating Scene ${i + 1} of ${settings.prompts.length}...`);
            let operation = await ai.models.generateVideos(params);

            let progressIndex = 0;
            const sceneProgressInterval = setInterval(() => {
                progressIndex = (progressIndex + 1) % PROGRESS_MESSAGES.length;
                onProgress(`Generating Scene ${i + 1}/${settings.prompts.length}: ${PROGRESS_MESSAGES[progressIndex]}`);
            }, 5000);

            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
                operation = await ai.operations.getVideosOperation({ operation: operation });
            }
            
            clearInterval(sceneProgressInterval);

            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

            if (!downloadLink) {
                throw new Error(`Video generation for scene ${i + 1} completed, but no download link was provided.`);
            }
            
            downloadLinks.push(downloadLink);
        }

        return downloadLinks;

    } catch (error: any) {
        console.error("Gemini API Error:", error);
        const apiError: ApiError = new Error(error.message || "An unknown API error occurred.");
        if (error.httpStatus) {
            apiError.status = error.httpStatus;
        } else if (error.message.includes("API key not valid")) {
            apiError.status = 403;
            apiError.message = "The provided API key is not valid.";
        } else if (error.message.includes("quota")) {
            apiError.status = 429;
            apiError.message = "You have exceeded your API quota.";
        }
        throw apiError;
    }
};


export const fetchVideoBlob = async (downloadLink: string, apiKey: string): Promise<Blob> => {
    const response = await fetch(`${downloadLink}&key=${apiKey}`);
    if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch video:", errorText);
        const apiError: ApiError = new Error(`Failed to download video. Status: ${response.status}.`);
        apiError.status = response.status;
        throw apiError;
    }
    return response.blob();
};