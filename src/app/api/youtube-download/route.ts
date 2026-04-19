import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId, format, quality } = body;

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
    }

    const invidiousInstances = [
      'https://invidious.snopyta.org',
      'https://invidious.tube',
      'https://yewtu.be',
    ];

    let videoUrl = null;
    let audioUrl = null;

    for (const instance of invidiousInstances) {
      try {
        const response = await fetch(`${instance}/api/v1/videos/${videoId}`);
        if (response.ok) {
          const data = await response.json();
          
          if (format === 'mp3' || format === 'm4a') {
            const audioFormat = data.adaptiveFormats?.find((f: any) => f.type.includes('audio'));
            if (audioFormat) {
              audioUrl = audioFormat.url;
              break;
            }
          } else {
            const videoFormat = data.adaptiveFormats?.find((f: any) => 
              quality ? f.qualityLabel === quality : f.type.includes('video')
            );
            if (videoFormat) {
              videoUrl = videoFormat.url;
              break;
            }
          }
        }
      } catch {
        continue;
      }
    }

    if (audioUrl || videoUrl) {
      return NextResponse.json({
        success: true,
        downloadUrl: audioUrl || videoUrl,
        format,
        quality,
      });
    }

    const pipeInstances = ['https://api.piped.sh', 'https://pipedapi.kavin.rocks'];
    
    for (const instance of pipeInstances) {
      try {
        const response = await fetch(`${instance}/streams/${videoId}`);
        if (response.ok) {
          const data = await response.json();
          
          const audioStream = data.audioStreams?.[0];
          const videoStream = data.videoStreams?.[0];
          
          if (format === 'mp3' || format === 'm4a') {
            if (audioStream) {
              return NextResponse.json({
                success: true,
                downloadUrl: audioStream.url,
                format: 'm4a',
              });
            }
          } else if (videoStream) {
            return NextResponse.json({
              success: true,
              downloadUrl: videoStream.url,
              format: 'mp4',
            });
          }
        }
      } catch {
        continue;
      }
    }

    return NextResponse.json({
      success: false,
      message: 'Could not fetch video. Try using a browser extension for direct downloads.',
    });

  } catch (error) {
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}