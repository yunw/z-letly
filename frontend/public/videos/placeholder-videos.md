# Video Footage Setup Instructions

## Required Video Files

To complete the video background setup, you need to add the following video files to the `/frontend/public/videos/` directory:

1. **landing-bg.mp4** - Modern cityscape or luxury real estate footage
2. **login-bg.mp4** - Subtle office or building footage  
3. **landlord-bg.mp4** - Professional real estate or property management footage
4. **rentee-bg.mp4** - Cozy home or apartment footage

## Video Specifications

- **Format**: MP4
- **Resolution**: 1920x1080 (minimum)
- **Duration**: 10-30 seconds (will loop automatically)
- **File size**: Keep under 10MB for optimal loading
- **Content**: Should be subtle and not distracting from UI elements

## Recommended Sources

### Free Sources:
- **Pexels**: https://www.pexels.com/videos/
- **Pixabay**: https://pixabay.com/videos/
- **Unsplash**: https://unsplash.com/s/photos (for static images that can be converted)

### Paid Sources:
- **Adobe Stock**: https://stock.adobe.com/
- **Shutterstock**: https://www.shutterstock.com/

## Search Terms for Each Page

### Landing Page (landing-bg.mp4)
- "modern city skyline"
- "luxury real estate"
- "urban architecture"
- "city buildings"

### Login Page (login-bg.mp4)
- "office building"
- "modern office"
- "business district"
- "corporate building"

### Landlord Dashboard (landlord-bg.mp4)
- "real estate"
- "property management"
- "luxury apartment building"
- "modern residential complex"

### Rentee Dashboard (rentee-bg.mp4)
- "cozy apartment"
- "home interior"
- "modern living room"
- "comfortable home"

## Installation Steps

1. Download your chosen videos
2. Rename them to match the required filenames above
3. Place them in the `/frontend/public/videos/` directory
4. Ensure the video files are optimized for web (compressed, reasonable file size)
5. Test the application to ensure videos load properly

## Fallback

If videos fail to load, the pages will still function normally with a dark overlay background. The VideoBackground component includes error handling for missing video files.

## Performance Notes

- Videos are muted and set to loop automatically
- Brightness is reduced to 30% to ensure text readability
- A semi-transparent overlay is added for better contrast
- Videos are loaded with `playsInline` for mobile compatibility 