/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<string | null>(null); // for showing status
  const [polling, setPolling] = useState(false); // track polling state

  // Poll status endpoint
  const pollStatus = async (workflowId: string, runId: string) => {
    setPolling(true);
    setStatus('Checking status...');
    let intervalId: NodeJS.Timeout | null = null;
    let finished = false;
    const poll = async () => {
      try {
        const res = await fetch(`/api/status?workflow_id=${workflowId}&run_id=${runId}`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setStatus(data.status || JSON.stringify(data));
        if (data.status === 'completed' || data.status === 'succeeded' || data.status === 'failed' || data.status === 'error') {
          finished = true;
          setPolling(false);
          if (intervalId) clearInterval(intervalId);
        }
      } catch (err) {
        setStatus('Error checking status');
        finished = true;
        setPolling(false);
        if (intervalId) clearInterval(intervalId);
      }
    };
    await poll();
    intervalId = setInterval(() => {
      if (!finished) poll();
    }, 2000);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setStatus(null);
    setGeneratedImage(null);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to generate image: ${error}`);
      }

      const result = await response.json();

      // Start polling status if workflow_id and run_id are present
      if (result.workflow_id && result.run_id) {
        pollStatus(result.workflow_id, result.run_id);
      }

      // Handle the response from ComfyUI
      if (result.image_url) {
        setGeneratedImage(result.image_url);
      } else {
        throw new Error('No image URL in response');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-500">Pencil Comfy Demo App</h1>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-6">
              {generatedImage ? (
                <Image
                  src={generatedImage}
                  alt="Generated content"
                  className="w-full h-full object-cover rounded-lg"
                  width={512}
                  height={512}
                  priority
                />
              ) : (
                <span className="text-gray-400">Generated Image</span>
              )}
            </div>

            <div className="flex flex-col space-y-4">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-500 mb-1">
                  Input Prompt
                </label>
                <input
                  type="text"
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your prompt here..."
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className={`px-6 py-2 rounded-md text-white font-medium text-gray-500 ${
                  isGenerating || !prompt.trim()
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
              {polling || status ? (
                <div className="mt-2 text-sm text-gray-400">Status: {status || 'Polling...'}</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
