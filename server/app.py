from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import yt_dlp
import os
import tempfile

app = Flask(__name__)

CORS(app, origins='*')

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
        ydl_opts = {'quiet': True, 'no_warnings': True, 'skip_download': True}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(f'https://youtube.com/watch?v={video_id}', download=False)
            return jsonify({
                'title': info.get('title', 'YouTube Video'),
                'author': info.get('uploader', 'Unknown'),
                'duration': info.get('duration', 0),
                'views': info.get('view_count', 0),
                'thumbnails': [info.get('thumbnail')] if info.get('thumbnail') else [],
                'videoId': video_id,
            })
    except Exception as e:
        return jsonify({'error': 'Bot verification required. Please use browser extension for download.', 'details': str(e)}), 500

@app.route('/api/formats', methods=['GET'])
def get_formats():
    video_id = request.args.get('id')
    if not video_id:
        return jsonify({'error': 'Video ID is required'}), 400
    
    return jsonify({
        'error': 'Formats requires bot verification. Please use browser extension.',
        'video': [{'itag': 22, 'quality': '1080p', 'type': 'MP4'}, {'itag': 18, 'quality': '720p', 'type': 'MP4'}],
        'audio': [{'itag': 140, 'quality': '128K', 'type': 'M4A'}]
    })

@app.route('/api/download', methods=['POST'])
def download():
    data = request.get_json()
    video_id = data.get('videoId')
    
    if not video_id:
        return jsonify({'error': 'Video ID is required'}), 400
    
    return jsonify({
        'error': 'Download requires bot verification. Please use a browser extension like "Video DownloadHelper" or "YouTube Premium".',
        'alternative': 'Install browser extension for direct downloads'
    }), 503

@app.route('/api/download/audio', methods=['POST'])
def download_audio():
    return download()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)