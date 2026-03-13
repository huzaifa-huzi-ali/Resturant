# 🎬 Célia Restaurant - Video Setup Instructions

## Adding Crossfading Hero Videos

The homepage now features **crossfading cinematic videos** with a dark overlay. To make it work, you need to add two video files to the `public` folder.

### 📁 File Locations:
```
frontend\
├── public\
│   ├── hero-video-1.mp4     ← ADD HERE
│   ├── hero-video-2.mp4     ← ADD HERE
│   ├── favicon.ico
│   ├── logo.png
│   └── index.html
└── src\
```

### 🎥 Video Specifications:
- **Format:** MP4 (H.264 codec)
- **Resolution:** 1920x1080 or higher (16:9 aspect ratio)
- **Duration:** 8-15 seconds each (recommended)
- **File Size:** 10-30MB per video (optimize for web)
- **Codec:** H.264 video + AAC audio
- **Settings:** Muted audio (required for autoplay)

### 📊 Video Recommendations:
1. **hero-video-1.mp4**: Restaurant ambiance - dim lighting, plated dishes, elegant table setting
2. **hero-video-2.mp4**: Kitchen action - chef preparing food, flames, artistic plating

### 🔧 How to Convert Videos:
Using FFmpeg (command line):
```bash
# Convert to optimized MP4
ffmpeg -i input-video.mov -c:v libx264 -preset medium -b:v 2000k -c:a aac -b:a 128k output-video.mp4

# For lower file size
ffmpeg -i input-video.mov -c:v libx264 -preset slow -crf 28 -c:a aac -b:a 96k output-video.mp4
```

### 💡 Features:
- ✅ Automatic crossfade (1.5s fade transition)
- ✅ Seamless looping between videos
- ✅ 60% dark overlay for text readability
- ✅ Fully responsive on all devices
- ✅ Optimized performance with video compression

### 🎯 How It Works:
1. Videos play automatically (muted, for autoplay compliance)
2. When video-1 ends, fade to video-2
3. When video-2 ends, fade back to video-1
4. Continuous smooth crossfade cycle

### 🚀 Testing:
After adding videos, run:
```bash
npm run dev
```
Visit `http://localhost:5173/` and you should see the hero section with crossfading videos!

### 📝 Troubleshooting:
- **Videos not showing?** Check browser console (F12) for errors
- **Audio playing?** Videos are set to `muted` for autoplay compliance
- **Performance lag?** Reduce video bitrate or file size
- **Crossfade not smooth?** Ensure videos are properly formatted

### 🎨 Customizing Overlay Darkness:
In `Home.css`, line ~56, adjust the opacity:
```css
.hero-darkness-overlay {
  background: rgba(0, 0, 0, 0.6);  /* Change 0.6 to adjust darkness
                                       0 = invisible, 1 = completely black */
}
```

---

**Note:** Once videos are added and optimized, the homepage will be a stunning cinematic experience! 🎬✨
