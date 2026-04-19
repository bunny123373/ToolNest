from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import yt_dlp
import os
import tempfile

app = Flask(__name__)
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

@app.route('/api/info', methods=['GET'])
def get_info():
    video_id = request.args.get('id')
    if not video_id:
        return jsonify({'error': 'Video ID is required'}), 400
    
    url = f'https://www.youtube.com/watch?v={video_id}'
    
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'extract_flat': False,
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            thumbnails = []
            if 'thumbnail' in info:
                thumbnails.append(info['thumbnail'])
            for thumb in info.get('thumbnails', []):
                if thumb['url'] not in thumbnails:
                    thumbnails.append(thumb['url'])
            
            return jsonify({
                'title': info.get('title', 'YouTube Video'),
                'author': info.get('uploader', 'Unknown'),
                'duration': info.get('duration', 0),
                'views': info.get('view_count', 0),
                'thumbnails': thumbnails,
                'videoId': video_id,
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/formats', methods=['GET'])
def get_formats():
    video_id = request.args.get('id')
    if not video_id:
        return jsonify({'error': 'Video ID is required'}), 400
    
    url = f'https://www.youtube.com/watch?v={video_id}'
    
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'extract_flat': False,
        'listformats': True,
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            formats = []
            
            for fmt in info.get('formats', []):
                fmt_id = fmt.get('format_id', '')
                ext = fmt.get('ext', '')
                quality = fmt.get('resolution', fmt.get('height', ''))
                filesize = fmt.get('filesize') or fmt.get('filesize_approx', 0)
                
                if filesize:
                    filesize_mb = filesize / (1024 * 1024)
                    filesize_str = f'~{int(filesize_mb)} MB'
                else:
                    filesize_str = 'Unknown'
                
                if ext in ['mp4', 'webm', 'm4a']:
                    formats.append({
                        'itag': fmt_id,
                        'quality': str(quality),
                        'type': f'{ext.upper()} ({quality})',
                        'fileSize': filesize_str,
                    })
            
            audio_formats = []
            for fmt in info.get('formats', []):
                fmt_id = fmt.get('format_id', '')
                ext = fmt.get('ext', '')
                quality = fmt.get('abr', 0)
                filesize = fmt.get('filesize') or fmt.get('filesize_approx', 0)
                
                if ext in ['m4a', 'webm'] and quality > 0:
                    if filesize:
                        filesize_mb = filesize / (1024 * 1024)
                        filesize_str = f'~{int(filesize_mb)} MB'
                    else:
                        filesize_str = 'Unknown'
                    
                    audio_formats.append({
                        'itag': fmt_id,
                        'quality': f'{quality}K',
                        'type': f'{ext.upper()} Audio',
                        'fileSize': filesize_str,
                    })
            
            return jsonify({
                'video': formats[:6],
                'audio': audio_formats[:4],
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download', methods=['POST'])
def download():
    data = request.get_json()
    video_id = data.get('videoId')
    itag = data.get('itag')
    
    if not video_id:
        return jsonify({'error': 'Video ID is required'}), 400
    
    url = f'https://www.youtube.com/watch?v={video_id}'
    
    output_template = os.path.join(DOWNLOAD_DIR, '%(title)s.%(ext)s')
    
    ydl_opts = {
        'format': f'best[format_id={itag}]' if itag else 'bestvideo+bestaudio/best',
        'outtmpl': output_template,
        'quiet': True,
        'no_warnings': True,
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filepath = ydl.prepare_filename(info)
            
            if os.path.exists(filepath):
                return send_file(
                    filepath,
                    as_attachment=True,
                    download_name=os.path.basename(filepath)
                )
            else:
                return jsonify({'error': 'Download failed'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download/audio', methods=['POST'])
def download_audio():
    data = request.get_json()
    video_id = data.get('videoId')
    format_type = data.get('format', 'mp3')
    quality = data.get('quality', '192')
    
    if not video_id:
        return jsonify({'error': 'Video ID is required'}), 400
    
    url = f'https://www.youtube.com/watch?v={video_id}'
    
    if format_type == 'mp3':
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': os.path.join(DOWNLOAD_DIR, '%(title)s.%(ext)s'),
            'quiet': True,
            'no_warnings': True,
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': quality,
            }],
        }
    else:
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': os.path.join(DOWNLOAD_DIR, '%(title)s.%(ext)s'),
            'quiet': True,
            'no_warnings': True,
        }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filepath = ydl.prepare_filename(info)
            
            if format_type == 'mp3' and filepath:
                filepath = filepath.rsplit('.', 1)[0] + '.mp3'
            
            if os.path.exists(filepath):
                return send_file(
                    filepath,
                    as_attachment=True,
                    download_name=os.path.basename(filepath)
                )
            else:
                return jsonify({'error': 'Download failed'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)