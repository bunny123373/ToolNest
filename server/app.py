from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import yt_dlp
import os
import tempfile
import requests

app = Flask(__name__)

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

CORS(app)

DOWNLOAD_DIR = tempfile.gettempdir()

def parse_youtube_url(url):
    if not url.strip():
        return None
    
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})',
        r'youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})',
        r'^([a-zA-Z0-9_-]{11})$',
    ]
    
    import re
    for pattern in patterns:
        match = re.search(pattern, url)
        if match and match.group(1):
            return match.group(1)
    return None

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'service': 'youtube-downloader'})

@app.route('/api/test', methods=['GET'])
def test_api():
    # Test Invidious
    invidious_test = None
    for instance in ['https://invidious.jingl.xyz', 'https://yewtu.be']:
        try:
            r = requests.get(f'{instance}/api/v1/videos/dQw4w9WgXcQ', timeout=10)
            invidious_test = {'instance': instance, 'status': r.status_code}
            break
        except Exception as e:
            invidious_test = {'instance': instance, 'error': str(e)}
    
    # Test Piped
    piped_test = None
    for instance in ['https://api.piped.sh']:
        try:
            r = requests.get(f'{instance}/streams/dQw4w9WgXcQ', timeout=10)
            piped_test = {'instance': instance, 'status': r.status_code}
            break
        except Exception as e:
            piped_test = {'instance': instance, 'error': str(e)}
    
    return jsonify({'invidious': invidious_test, 'piped': piped_test})

@app.route('/api/info', methods=['GET'])
def get_info():
    video_id = request.args.get('id')
    if not video_id:
        return jsonify({'error': 'Video ID is required'}), 400
    
    # Use Invidious instances (no auth needed)
    invidious_instances = [
        'https://invidious.jingl.xyz',
        'https://invidious.adamantame.com',
        'https://yewtu.be',
    ]
    
    for instance in invidious_instances:
        try:
            response = requests.get(f'{instance}/api/v1/videos/{video_id}', timeout=30)
            if response.status_code == 200:
                data = response.json()
                
                thumbnails = []
                if data.get('thumbnailUrl'):
                    thumbnails.append(data['thumbnailUrl'])
                if data.get('relatedVideos'):
                    for v in data.get('relatedVideos', []):
                        if v.get('thumbnailUrl') and v['thumbnailUrl'] not in thumbnails:
                            thumbnails.append(v['thumbnailUrl'])
                
                duration = data.get('lengthSeconds', 0)
                
                return jsonify({
                    'title': data.get('title') or 'YouTube Video',
                    'author': data.get('author') or 'Unknown',
                    'duration': duration,
                    'views': data.get('viewCount') or 0,
                    'thumbnails': thumbnails,
                    'videoId': video_id,
                })
        except Exception as e:
            continue
    
    return jsonify({'error': 'Could not fetch video'}), 500

@app.route('/api/formats', methods=['GET'])
def get_formats():
    video_id = request.args.get('id')
    if not video_id:
        return jsonify({'error': 'Video ID is required'}), 400
    
    # Use Piped API (no auth needed)
    piped_instances = [
        'https://api.piped.sh',
        'https://pipedapi.tube',
    ]
    
    for instance in piped_instances:
        try:
            response = requests.get(f'{instance}/streams/{video_id}', timeout=30)
            if response.status_code == 200:
                data = response.json()
                
                video_formats = []
                audio_formats = []
                
                # Video streams
                for stream in data.get('videoStreams', []):
                    quality = stream.get('quality', '')
                    codec = stream.get('codec', '') or ''
                    filesize = stream.get('size', 0) or 0
                    
                    if filesize:
                        filesize_mb = filesize / (1024 * 1024)
                        filesize_str = f'~{int(filesize_mb)} MB'
                    else:
                        filesize_str = 'Unknown'
                    
                    video_formats.append({
                        'itag': stream.get('itag', quality),
                        'quality': quality,
                        'type': f'MP4 ({quality})',
                        'fileSize': filesize_str,
                    })
                
                # Audio streams
                for stream in data.get('audioStreams', []):
                    bitrate = stream.get('bitrate', '') or ''
                    filesize = stream.get('size', 0) or 0
                    
                    if filesize:
                        filesize_mb = filesize / (1024 * 1024)
                        filesize_str = f'~{int(filesize_mb)} MB'
                    else:
                        filesize_str = 'Unknown'
                    
                    audio_formats.append({
                        'itag': bitrate,
                        'quality': bitrate,
                        'type': 'M4A Audio',
                        'fileSize': filesize_str,
                    })
                
                return jsonify({
                    'video': video_formats[:6],
                    'audio': audio_formats[:4],
                })
        except Exception as e:
            continue
    
    return jsonify({'video': [], 'audio': []})

@app.route('/api/download', methods=['POST'])
def download():
    data = request.get_json()
    video_id = data.get('videoId')
    itag = data.get('itag')
    
    if not video_id:
        return jsonify({'error': 'Video ID is required'}), 400
    
    # Use Piped API for direct URL
    piped_instances = ['https://api.piped.sh', 'https://pipedapi.tube']
    
    for instance in piped_instances:
        try:
            response = requests.get(f'{instance}/streams/{video_id}', timeout=30)
            if response.status_code == 200:
                streams_data = response.json()
                
                # Get video stream
                video_streams = streams_data.get('videoStreams', [])
                audio_streams = streams_data.get('audioStreams', [])
                
                # Try to find requested quality or get best
                download_url = None
                filename = 'video.mp4'
                
                if video_streams:
                    if itag:
                        for v in video_streams:
                            if str(v.get('itag')) == str(itag):
                                download_url = v.get('url')
                                break
                    if not download_url:
                        download_url = video_streams[0].get('url')
                    filename = f"{streams_data.get('title', 'video')}.mp4"
                
                if download_url:
                    # Fetch and serve the file
                    video_response = requests.get(download_url, stream=True, timeout=120)
                    if video_response.status_code == 200:
                        temp_file = os.path.join(DOWNLOAD_DIR, filename)
                        with open(temp_file, 'wb') as f:
                            for chunk in video_response.iter_content(chunk_size=8192):
                                f.write(chunk)
                        
                        return send_file(
                            temp_file,
                            as_attachment=True,
                            download_name=filename
                        )
        except Exception as e:
            continue
    
    return jsonify({'error': 'Download failed'}), 500

@app.route('/api/download/audio', methods=['POST'])
def download_audio():
    data = request.get_json()
    video_id = data.get('videoId')
    format_type = data.get('format', 'm4a')
    
    if not video_id:
        return jsonify({'error': 'Video ID is required'}), 400
    
    # Use Piped API for direct URL
    piped_instances = ['https://api.piped.sh', 'https://pipedapi.tube']
    
    for instance in piped_instances:
        try:
            response = requests.get(f'{instance}/streams/{video_id}', timeout=30)
            if response.status_code == 200:
                streams_data = response.json()
                
                audio_streams = streams_data.get('audioStreams', [])
                
                if audio_streams:
                    download_url = audio_streams[0].get('url')
                    ext = 'm4a' if format_type == 'm4a' else 'mp3'
                    filename = f"{streams_data.get('title', 'audio')}.{ext}"
                    
                    if download_url:
                        audio_response = requests.get(download_url, stream=True, timeout=120)
                        if audio_response.status_code == 200:
                            temp_file = os.path.join(DOWNLOAD_DIR, filename)
                            with open(temp_file, 'wb') as f:
                                for chunk in audio_response.iter_content(chunk_size=8192):
                                    f.write(chunk)
                            
                            return send_file(
                                temp_file,
                                as_attachment=True,
                                download_name=filename
                            )
        except Exception as e:
            continue
    
    return jsonify({'error': 'Download failed'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)