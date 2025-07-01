import { NextRequest, NextResponse } from 'next/server';

async function getRunStatus(workflow_id: string, run_id: string) {
  const url = `https://comfy.icu/api/v1/workflows/${workflow_id}/runs/${run_id}`;
  const resp = await fetch(url, {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: 'Bearer ' + process.env.COMFYICU_API_KEY,
    },
  });
  if (!resp.ok) {
    throw new Error(`Failed to fetch status: ${resp.status} ${resp.statusText}`);
  }
  return await resp.json();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workflow_id = searchParams.get('workflow_id');
  const run_id = searchParams.get('run_id');

  if (!workflow_id || !run_id) {
    return NextResponse.json({ error: 'Missing workflow_id or run_id' }, { status: 400 });
  }

  try {
    const status = await getRunStatus(workflow_id, run_id);
    return NextResponse.json(status);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
