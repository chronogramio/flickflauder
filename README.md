# Flickflauder - Landing Page

A beautiful, SEO-optimized landing page for Flickflauder custom software development services.

## Features

- **Animated Butterfly**: The dot on the "i" in "flickflauder" is replaced by an animated butterfly that takes flight after 2.5 seconds
- **Calm Blue Theme**: Sky-inspired gradient backgrounds creating a peaceful, professional atmosphere
- **Fully Responsive**: Works perfectly on all devices (mobile, tablet, desktop)
- **SEO Optimized**:
  - Semantic HTML5
  - Meta tags for search engines and social media
  - Structured data (JSON-LD)
  - Fast loading times
- **Smooth Animations**: Scroll effects, hover states, and subtle parallax
- **Accessibility**: Respects prefers-reduced-motion for users who need it

## Structure

```
flickflauder/
├── index.html      # Main HTML file with semantic structure
├── styles.css      # All styling with responsive design
├── script.js       # Interactive features and animations
└── README.md       # This file
```

## How to Use

### Local Development

1. Simply open `index.html` in any modern web browser
2. Or use a local server:
   ```bash
   # Python 3
   python -m http.server 8000

   # Node.js (if you have http-server installed)
   npx http-server
   ```
3. Visit `http://localhost:8000` in your browser

### Deployment

#### Option 1: Static Hosting (Recommended)
Deploy to any static hosting service:

- **Netlify**: Drag and drop the folder or connect to Git
- **Vercel**: Import the project
- **GitHub Pages**: Push to a repo and enable Pages
- **Cloudflare Pages**: Connect and deploy

#### Option 2: Traditional Web Hosting
Upload all files to your web server via FTP/SFTP to the public_html or www directory.

## Customization

### Update Contact Information
Edit `index.html` line 132:
```html
<a href="mailto:your-email@flickflauder.com">your-email@flickflauder.com</a>
```

### Adjust Butterfly Animation Timing
Edit `script.js` line 6 to change when the butterfly flies (default: 2500ms = 2.5 seconds):
```javascript
setTimeout(() => {
    if (butterfly) {
        butterfly.classList.add('flying');
    }
}, 2500); // Change this value
```

### Modify Colors
Edit CSS variables in `styles.css` lines 9-17:
```css
:root {
    --sky-light: #e3f2fd;
    --sky-medium: #90caf9;
    --sky-deep: #42a5f5;
    --sky-dark: #1976d2;
    /* ... */
}
```

### Add More Services
Copy a service card in `index.html` (lines 77-101) and customize the content.

## SEO Tips

1. **Update Meta Description**: Customize the description in `index.html` line 7 to match your specific services
2. **Add Analytics**: Insert Google Analytics or similar tracking code before `</head>`
3. **Create a sitemap.xml**: For better search engine indexing
4. **Add a favicon**: Replace the emoji favicon with a custom design
5. **Set up robots.txt**: Control search engine crawling

## Performance

The site is optimized for fast loading:
- No external dependencies
- Minimal CSS and JavaScript
- SVG graphics (scalable and lightweight)
- Efficient animations

Typical load time: < 1 second

## Browser Support

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅

## License

All rights reserved © 2025 Flickflauder
