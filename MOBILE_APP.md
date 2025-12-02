# Building Android APK

Complete guide to building and deploying the Construction SaaS mobile app as an Android APK.

## Overview

This project supports two mobile deployment options:

1. **Progressive Web App (PWA)** - Installable from browser, works offline
2. **Native Android APK** - Full native app via Capacitor

## Prerequisites

### For PWA (Easiest)
- Just deploy the web app and users can install from browser
- No additional setup required

### For Android APK
- **Node.js 18+** and npm
- **Android Studio** (for building APK)
- **Java Development Kit (JDK 17)**
- **Android SDK** (installed via Android Studio)

## Option 1: PWA Deployment (Recommended for Quick Start)

The app is already PWA-ready with:
- ✅ Manifest.json configured
- ✅ Service worker for offline support
- ✅ App icons for all sizes
- ✅ Install prompts on mobile browsers

### Testing PWA Locally

```bash
cd construction-saas
npm install
npm run build
npm start
```

Visit on mobile device and tap "Add to Home Screen" from browser menu.

### PWA Features
- Works offline
- Installable from browser
- Push notifications support
- Camera and file access
- No app store approval needed
- Instant updates

## Option 2: Build Android APK

### Step 1: Install Android Studio

Download and install Android Studio from:
https://developer.android.com/studio

During installation:
- Install Android SDK
- Install Android SDK Platform-Tools
- Install Android Emulator (optional)

### Step 2: Install Capacitor Dependencies

```bash
cd construction-saas

# Install Capacitor packages
npm install @capacitor/core @capacitor/cli @capacitor/android
npm install @capacitor/camera @capacitor/filesystem @capacitor/splash-screen @capacitor/status-bar
```

### Step 3: Initialize Capacitor

```bash
# Initialize Capacitor (first time only)
npx cap init "Construction SaaS" com.constructionsaas.app

# Add Android platform
npx cap add android
```

### Step 4: Build the Web App

```bash
# Build static export for mobile
BUILD_MOBILE=true npm run build
```

This creates an optimized static export in the `out` directory.

### Step 5: Sync with Capacitor

```bash
# Copy web assets to native project
npx cap sync android
```

### Step 6: Open in Android Studio

```bash
# Open Android project in Android Studio
npx cap open android
```

Or manually open the folder: `construction-saas/android`

### Step 7: Build APK in Android Studio

1. Wait for Gradle sync to complete
2. Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Wait for build to complete
4. Click **locate** to find the APK file

The APK will be at:
```
construction-saas/android/app/build/outputs/apk/debug/app-debug.apk
```

### Step 8: Install APK on Device

**Option A: USB Connection**
```bash
# Enable USB debugging on your Android device
# Connect via USB
# Run:
npx cap run android
```

**Option B: Manual Install**
1. Copy `app-debug.apk` to your phone
2. Open the APK file on phone
3. Allow installation from unknown sources
4. Install the app

## Building Release APK (Production)

### Step 1: Generate Signing Key

```bash
# Generate keystore
keytool -genkey -v -keystore construction-saas.keystore \
  -alias constructionsaas -keyalg RSA -keysize 2048 -validity 10000
```

Enter details when prompted and remember your passwords.

### Step 2: Configure Signing

Edit `android/app/build.gradle` and add before `android` block:

```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Inside `android` block, add:

```gradle
signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
        storePassword keystoreProperties['storePassword']
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### Step 3: Create key.properties

Create `android/key.properties`:

```properties
storePassword=your-store-password
keyPassword=your-key-password
keyAlias=constructionsaas
storeFile=../construction-saas.keystore
```

Add to `.gitignore`:
```
android/key.properties
*.keystore
```

### Step 4: Build Release APK

In Android Studio:
1. Select **Build** → **Generate Signed Bundle / APK**
2. Choose **APK**
3. Select your keystore file
4. Enter passwords
5. Choose **release** build variant
6. Click **Finish**

Release APK location:
```
android/app/build/outputs/apk/release/app-release.apk
```

## Quick Build Script

Create `build-apk.sh` in project root:

```bash
#!/bin/bash

echo "Building Construction SaaS APK..."

# Build web app
BUILD_MOBILE=true npm run build

# Sync with Capacitor
npx cap sync android

# Open Android Studio
npx cap open android

echo "✅ Ready to build APK in Android Studio!"
echo "Go to: Build → Build Bundle(s) / APK(s) → Build APK(s)"
```

Make executable:
```bash
chmod +x build-apk.sh
./build-apk.sh
```

## App Configuration

### Update App Details

Edit `capacitor.config.ts`:

```typescript
const config: CapacitorConfig = {
  appId: 'com.yourcompany.constructionsaas',  // Change this
  appName: 'Your Company Name',                // Change this
  webDir: 'out',
  // ... rest of config
};
```

### Update Icons

Replace icons in `public/icons/` with your own:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

Use square PNG images with transparent backgrounds.

### Generate Icons from Single Image

Use a tool like:
- https://www.pwabuilder.com/imageGenerator
- https://realfavicongenerator.net/

Upload a 512x512 PNG and download all sizes.

## Testing

### Test on Emulator

1. Open Android Studio
2. Click **Device Manager**
3. Create a new virtual device
4. Select device and API level
5. Click **Run** (green play button)

### Test on Physical Device

1. Enable **Developer Options** on Android:
   - Go to Settings → About Phone
   - Tap Build Number 7 times
2. Enable **USB Debugging**:
   - Settings → Developer Options → USB Debugging
3. Connect via USB
4. Run: `npx cap run android`

## Troubleshooting

### "Android SDK not found"

Set environment variables:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Add to `~/.bashrc` or `~/.zshrc` for persistence.

### "Gradle build failed"

1. Open Android Studio
2. File → Invalidate Caches → Invalidate and Restart
3. Build → Clean Project
4. Build → Rebuild Project

### "Build export failed"

Make sure `BUILD_MOBILE=true` is set:

```bash
BUILD_MOBILE=true npm run build
```

### App crashes on launch

Check Android logcat:

```bash
adb logcat | grep Construction
```

## Publishing to Google Play Store

### Step 1: Create Google Play Developer Account

- Go to https://play.google.com/console
- Pay $25 one-time fee
- Complete account setup

### Step 2: Prepare App Listing

Create:
- App description (4000 chars)
- Short description (80 chars)
- Screenshots (at least 2)
- Feature graphic (1024x500)
- App icon (512x512)
- Privacy policy URL

### Step 3: Build Release APK

Follow "Building Release APK" section above.

### Step 4: Upload to Play Console

1. Create new app in Play Console
2. Fill in app details
3. Upload APK/AAB
4. Set pricing (free/paid)
5. Select countries
6. Set content rating
7. Submit for review

### Step 5: Review & Publish

- Google reviews in 1-7 days
- Fix any issues
- Once approved, app goes live

## App Store Optimization (ASO)

### Title
Construction SaaS - Project Management

### Keywords
construction management, project tracking, invoice processing, contractor app, construction software, RFI management, daily reports

### Description
Automate your construction business with AI-powered project management. Features include:

- AI invoice processing
- QuickBooks integration
- RFI management
- Change order tracking
- Voice daily reports
- Multi-project support

Perfect for general contractors, project managers, and construction teams.

## Updates

### Updating the App

1. Update version in `package.json`
2. Update version in `android/app/build.gradle`:
   ```gradle
   versionCode 2
   versionName "1.1.0"
   ```
3. Build new release APK
4. Upload to Play Store

### Over-the-Air Updates

For non-native changes (UI, content), users get updates automatically when they open the app (PWA feature).

For native changes, they need to update from Play Store.

## Support

### Documentation
- Capacitor: https://capacitorjs.com/docs
- Android Studio: https://developer.android.com/studio/intro

### Common Commands

```bash
# Add platform
npx cap add android

# Sync web code
npx cap sync

# Open in IDE
npx cap open android

# Run on device
npx cap run android

# Update Capacitor
npm install @capacitor/cli@latest @capacitor/core@latest
npx cap sync
```

## Cost Breakdown

| Item | Cost | Notes |
|------|------|-------|
| Development | $0 | Free/Open source |
| Google Play Account | $25 | One-time fee |
| Hosting (Backend) | $5-50/mo | Depends on usage |
| Code Signing Certificate | $0 | Free for Android |

## Summary

You now have three deployment options:

1. **PWA** - Free, instant, no approval needed
2. **Debug APK** - For testing, not for distribution
3. **Release APK** - Signed, for Play Store or direct distribution

For most users, **PWA** is the fastest way to get started. Build the native APK when you need Play Store distribution or native features.

---

**Next Steps**: Choose your deployment method and follow the guide above!
