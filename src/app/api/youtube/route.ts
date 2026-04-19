import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get('id');

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
  }

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const oembedResponse = await fetch(oembedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!oembedResponse.ok) {
      return NextResponse.json({ 
        title: 'YouTube Video',
        duration: 'Various',
        views: 'N/A',
        author: 'YouTube Creator',
      });
    }

    const data = await oembedResponse.json();

    return NextResponse.json({
      title: data.title || 'YouTube Video',
      author: data.author_name || 'Unknown',
      duration: 'Various',
      views: 'N/A',
    });
  } catch {
    return NextResponse.json({
      title: 'YouTube Video',
      duration: 'Various',
      views: 'N/A',
      author: 'Unknown',
    });
  }
}