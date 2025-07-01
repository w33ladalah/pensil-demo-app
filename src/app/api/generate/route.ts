import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    console.log("Prompt: ", prompt);

    // Workflow ID from ComfyUI
    const workflow_id = "-TNoGrWLPIM6yTpgG9H5Z";

    // Generate a random seed for this request
    const randomSeed = Math.floor(Math.random() * 4294967295); // 32-bit unsigned integer
    const timestamp = Date.now();
    const uniqueId = randomSeed + timestamp;

    // Prepare the workflow with the user's prompt and unique seed
    const workflow = {
      "3": {
        "_meta": {"title": "KSampler"},
        "inputs": {
          "cfg": 8,
          "seed": uniqueId, // Unique seed for each request
          "model": ["4", 0],
          "steps": 20,
          "denoise": 1,
          "negative": ["7", 0],
          "positive": ["6", 0],
          "scheduler": "normal",
          "latent_image": ["5", 0],
          "sampler_name": "euler"
        },
        "class_type": "KSampler"
      },
      "4": {
        "_meta": {"title": "Load Checkpoint"},
        "inputs": {
          "ckpt_name": "v1-5-pruned-emaonly-fp16.safetensors"
        },
        "class_type": "CheckpointLoaderSimple"
      },
      "5": {
        "_meta": {"title": "Empty Latent Image"},
        "inputs": {
          "width": 512,
          "height": 512,
          "batch_size": 1
        },
        "class_type": "EmptyLatentImage"
      },
      "6": {
        "_meta": {"title": "CLIP Text Encode (Prompt)"},
        "inputs": {
          "clip": ["4", 1],
          "text": prompt
        },
        "class_type": "CLIPTextEncode"
      },
      "7": {
        "_meta": {"title": "CLIP Text Encode (Prompt)"},
        "inputs": {
          "clip": ["4", 1],
          "text": "text, watermark"
        },
        "class_type": "CLIPTextEncode"
      },
      "8": {
        "_meta": {"title": "VAE Decode"},
        "inputs": {
          "vae": ["4", 2],
          "samples": ["3", 0]
        },
        "class_type": "VAEDecode"
      },
      "9": {
        "_meta": {"title": "Save Image"},
        "inputs": {
          "images": ["8", 0],
          "filename_prefix": "ComfyUI"
        },
        "class_type": "SaveImage"
      }
    };

    // Call ComfyUI API
    const response = await fetch(`https://comfy.icu/api/v1/workflows/${workflow_id}/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.COMFYICU_API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        workflow_id,
        prompt: workflow,
        files: {}
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(`API request failed: ${JSON.stringify(data)}`);
    }

    console.log('API Response:', data);
    const image_url = `https://r2.comfy.icu/workflows/${workflow_id}/output/${data.id}/ComfyUI_00001_.png`;
    return NextResponse.json({ image_url, workflow_id, run_id: data.id });

  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
