# Pencil Comfy Demo App

A web application that generates images using ComfyUI's API based on text prompts.

## Getting Started

### Prerequisites

- Node.js 14.6.0 or later
- A ComfyUI API key from [Comfy.icu](https://comfy.icu/)

### Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Create a `.env.local` file in the root directory and add your ComfyUI API key:

```env
COMFYICU_API_KEY=your_api_key_here
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to use the application.

## How to Use

1. Enter your image description in the "Input Prompt" field
2. Click the "Generate" button
3. Wait for the image to be generated
4. View your generated image in the preview area

## Features

- Simple and intuitive interface
- Fast image generation using ComfyUI
- Responsive design that works on desktop and mobile

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
