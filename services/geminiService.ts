
import { GoogleGenAI } from "@google/genai";

const VEO_MODEL = 'veo-2.0-generate-001';

// Helper to wait for a specified time
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Reassuring messages for the user during the generation process
const loadingMessages = [
    "Warming up the digital director...",
    "Choreographing pixels into motion...",
    "Rendering your vision, frame by frame...",
    "This can take a few minutes, good things come to those who wait!",
    "Polishing the final cut...",
    "Almost ready for the premiere..."
];

export const generateVideoFromApi = async (
    apiKey: string,
    prompt: string,
    imageB64?: string,
    setStatus?: (message: string) => void
): Promise<string> => {
    if (!apiKey) {
        throw new Error("API Key is not configured.");
    }
    const ai = new GoogleGenAI({ apiKey });

    setStatus?.("Sending request to VEO model...");

    const generateVideosParams: any = {
        model: 'veo-3.0-generate-preview',
        prompt: prompt,
        config: {
            numberOfVideos: 1,
            // Hidden defaults as per request
            // Aspect ratio is not a direct parameter in the library, 
            // model might infer or have a default. 16:9 is common.
            // Resolution and sound are also model-dependent.
        }
    };
    
    if (imageB64) {
        generateVideosParams.image = {
            imageBytes: imageB64,
            mimeType: 'image/png' // Assuming PNG, can be made dynamic
        };
    }

    let operation = await ai.models.generateVideos(generateVideosParams);
    
    let messageIndex = 0;
    const updateStatusWithLoopingMessage = () => {
        setStatus?.(loadingMessages[messageIndex]);
        messageIndex = (messageIndex + 1) % loadingMessages.length;
    };
    
    updateStatusWithLoopingMessage();
    const intervalId = setInterval(updateStatusWithLoopingMessage, 8000);

    while (!operation.done) {
        await wait(10000); // Poll every 10 seconds
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    clearInterval(intervalId);

    if (operation.error) {
        throw new Error(`Video generation failed with error: ${operation.error.message}`);
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
        throw new Error("Video generation completed, but no download link was found.");
    }

    setStatus?.("Downloading generated video...");
    const response = await fetch(`${downloadLink}&key=${apiKey}`);

    if (!response.ok) {
        throw new Error(`Failed to download video. Status: ${response.statusText}`);
    }
    
    setStatus?.("Finalizing video...");
    const videoBlob = await response.blob();
    const videoUrl = URL.createObjectURL(videoBlob);
    
    setStatus?.("Video ready!");
    return videoUrl;
};
