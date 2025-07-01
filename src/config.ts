// Environment variables
const COMFYUI_SERVER_URL = process.env.NEXT_PUBLIC_COMFYUI_SERVER_URL || 'http://127.0.0.1:8000';

export const config = {
  comfyui: {
    serverUrl: COMFYUI_SERVER_URL,
    // Add other ComfyUI related configs here
  },
  // Add other app configs here
};
