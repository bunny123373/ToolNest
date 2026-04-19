from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import innertube
import os
import tempfile
import requests

app = Flask(__name__)

# Initialize innertube client - try different clients to bypass bot protection
def get_client():
    for client_name in ["ANDROID", "WEB", "IOS"]:
        try:
            return innertube.InnerTube(client_name)
        except:
            continue
    return innertube.InnerTube("WEB")

yt_client = get_client()

@app.route('/api/debug', methods=['GET'])
def debug():
    video_id = request.args.get('id', 'dQw4w9WgXcQ')
    try:
        player = yt_client.player(video_id)
        return jsonify({
            'keys': list(player.keys()) if isinstance(player, dict) else 'not dict',
            'streamingData_keys': list(player.get('streamingData', {}).keys()) if player.get('streamingData') else 'no streamingData',
            'formats_count': len(player.get('streamingData', {}).get('formats', [])),
            'adaptive_count': len(player.get('streamingData', {}).get('adaptiveFormats', [])),
        })
    except Exception as e:
        return jsonify({'error': str(e)})

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
    
    try:
        # Use innertube (YouTube's private API)
        player = yt_client.player(video_id)
        
        if not player:
            return jsonify({'error': 'Could not fetch video'}), 500
        
        details = player.get('videoDetails', {})
        thumbnails = details.get('thumbnail', {}).get('thumbnails', [])
        thumbnail_urls = [t.get('url') for t in thumbnails if t.get('url')]
        
        return jsonify({
            'title': details.get('title') or 'YouTube Video',
            'author': details.get('author') or 'Unknown',
            'duration': details.get('lengthSeconds') or 0,
            'views': details.get('viewCount') or 0,
            'thumbnails': thumbnail_urls,
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
        player = yt_client.player(video_id)
        streaming_data = player.get('streamingData', {})
        
        formats = streaming_data.get('formats', [])
        adaptive_formats = streaming_data.get('adaptiveFormats', [])
        
        video_formats = []
        audio_formats = []
        
        all_formats = formats + adaptive_formats
        
        for fmt in all_formats:
            itag = fmt.get('itag')
            mime = fmt.get('mimeType', '')
            quality_label = fmt.get('qualityLabel', '')
            bitrate = fmt.get('bitrate', 0)
            filesize = fmt.get('contentLength', 0)
            
            if 'video' in mime and 'audio' not in mime:
                if filesize:
                    filesize_mb = int(filesize) / (1024 * 1024)
                    filesize_str = f'~{int(filesize_mb)} MB'
                else:
                    filesize_str = 'Unknown'
                
                video_formats.append({
                    'itag': itag,
                    'quality': quality_label or str(bitrate),
                    'type': f'MP4 ({quality_label})',
                    'fileSize': filesize_str,
                })
            elif 'audio' in mime:
                if filesize:
                    filesize_mb = int(filesize) / (1024 * 1024)
                    filesize_str = f'~{int(filesize_mb)} MB'
                else:
                    filesize_str = 'Unknown'
                bitrate_k = bitrate // 1000 if bitrate else 128
                
                audio_formats.append({
                    'itag': itag,
                    'quality': f'{bitrate_k}K',
                    'type': 'M4A Audio',
                    'fileSize': filesize_str,
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
        player = yt_client.player(video_id)
        streaming_data = player.get('streamingData', {})
        
        formats = streaming_data.get('formats', [])
        adaptive_formats = streaming_data.get('adaptiveFormats', [])
        
        all_formats = formats + adaptive_formats
        
        download_url = None
        filename = 'video.mp4'
        
        # Find requested format or get best video
        for fmt in all_formats:
            if itag and str(fmt.get('itag')) == str(itag):
                download_url = fmt.get('url')
                break
            elif not download_url and fmt.get('url') and 'video' in fmt.get('mimeType', ''):
                download_url = fmt.get('url')
        
        if not download_url:
            return jsonify({'error': 'No download URL found'}), 500
        
        # Get title for filename
        details = player.get('videoDetails', {})
        title = details.get('title', 'video')
        filename = f"{title}.mp4"
        
        # Download and serve
        response = requests.get(download_url, stream=True, timeout=120)
        if response.status_code == 200:
            temp_file = os.path.join(DOWNLOAD_DIR, filename)
            with open(temp_file, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            return send_file(
                temp_file,
                as_attachment=True,
                download_name=filename
            )
        
        return jsonify({'error': 'Download failed'}), 500
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download/audio', methods=['POST'])
def download_audio():
    data = request.get_json()
    video_id = data.get('videoId')
    format_type = data.get('format', 'm4a')
    
    if not video_id:
        return jsonify({'error': 'Video ID is required'}), 400
    
    try:
        player = yt_client.player(video_id)
        streaming_data = player.get('streamingData', {})
        
        adaptive_formats = streaming_data.get('adaptiveFormats', [])
        
        download_url = None
        filename = 'audio.m4a'
        
        # Find best audio
        for fmt in adaptive_formats:
            if 'audio' in fmt.get('mimeType', ''):
                download_url = fmt.get('url')
                if download_url:
                    break
        
        if not download_url:
            return jsonify({'error': 'No audio URL found'}), 500
        
        # Get title for filename
        details = player.get('videoDetails', {})
        title = details.get('title', 'audio')
        ext = 'm4a'
        filename = f"{title}.{ext}"
        
        # Download and serve
        response = requests.get(download_url, stream=True, timeout=120)
        if response.status_code == 200:
            temp_file = os.path.join(DOWNLOAD_DIR, filename)
            with open(temp_file, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            return send_file(
                temp_file,
                as_attachment=True,
                download_name=filename
            )
        
        return jsonify({'error': 'Download failed'}), 500
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)