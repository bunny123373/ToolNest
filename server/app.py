from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pytube import YouTube
from pytube.exceptions import RegexMatchError, VideoUnavailable
import os
import tempfile
import requests

app = Flask(__name__)

# Browser headers to avoid 400
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
}

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

CORS(app)

DOWNLOAD_DIR = tempfile.gettempdir()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'service': 'youtube-downloader'})

@app.route('/api/info', methods=['GET'])
def get_info():
    video_id = request.args.get('id')
    if not video_id:
        return jsonify({'error': 'Video ID is required'}), 400
    
    try:
        url = f'https://www.youtube.com/watch?v={video_id}'
        yt = YouTube(url, use_oauth=False, allow_oauth_cache=False, headers=HEADERS)
        
        return jsonify({
            'title': yt.title or 'YouTube Video',
            'author': yt.author or 'Unknown',
            'duration': yt.length or 0,
            'views': 0,
            'thumbnails': [yt.thumbnail_url] if yt.thumbnail_url else [],
            'videoId': video_id,
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/formats', methods=['GET'])
def get_formats():
    video_id = request.args.get('id')
    if not video_id:
        return jsonify({'error': 'Video ID is required'}), 400
    
    try:
        url = f'https://www.youtube.com/watch?v={video_id}'
        yt = YouTube(url, use_oauth=False, allow_oauth_cache=False, headers=HEADERS)
        
        video_formats = []
        for stream in yt.streams.filter(only_video=True):
            video_formats.append({
                'itag': stream.itag,
                'quality': stream.resolution or 'Unknown',
                'type': f'MP4',
                'fileSize': 'Unknown',
            })
        
        audio_formats = []
        for stream in yt.streams.filter(only_audio=True):
            audio_formats.append({
                'itag': stream.itag,
                'quality': stream.abr or '128K',
                'type': 'M4A Audio',
                'fileSize': 'Unknown',
            })
        
        return jsonify({
            'video': video_formats[:6],
            'audio': audio_formats[:4],
        })
    except Exception as e:
        return jsonify({'error': str(e), 'video': [], 'audio': []})

@app.route('/api/download', methods=['POST'])
def download():
    data = request.get_json()
    video_id = data.get('videoId')
    itag = data.get('itag')
    
    if not video_id:
        return jsonify({'error': 'Video ID is required'}), 400
    
    try:
        url = f'https://www.youtube.com/watch?v={video_id}'
        yt = YouTube(url, use_oauth=False, allow_oauth_cache=False, headers=HEADERS)
        
        if itag:
            stream = yt.streams.get_by_itag(int(itag))
        else:
            stream = yt.streams.filter(progressive=True, file_extension='mp4').first()
        
        if not stream:
            return jsonify({'error': 'No stream found'}), 500
        
        filename = f"{yt.title}.mp4"
        safe_title = "".join(c for c in yt.title if c.isalnum() or c in " -_").strip()
        filename = f"{safe_title[:50]}.mp4"
        
        temp_file = os.path.join(DOWNLOAD_DIR, filename)
        stream.download(output_path=DOWNLOAD_DIR, filename=filename)
        
        return send_file(temp_file, as_attachment=True, download_name=filename)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download/audio', methods=['POST'])
def download_audio():
    data = request.get_json()
    video_id = data.get('videoId')
    
    if not video_id:
        return jsonify({'error': 'Video ID is required'}), 400
    
    try:
        url = f'https://www.youtube.com/watch?v={video_id}'
        yt = YouTube(url, use_oauth=False, allow_oauth_cache=False, headers=HEADERS)
        
        stream = yt.streams.filter(only_audio=True).first()
        
        if not stream:
            return jsonify({'error': 'No audio found'}), 500
        
        safe_title = "".join(c for c in yt.title if c.isalnum() or c in " -_").strip()
        filename = f"{safe_title[:50]}.m4a"
        
        temp_file = os.path.join(DOWNLOAD_DIR, filename)
        stream.download(output_path=DOWNLOAD_DIR, filename=filename)
        
        return send_file(temp_file, as_attachment=True, download_name=filename)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)