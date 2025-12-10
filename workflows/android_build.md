---
description: Build the Android Application
---

# How to Build the Android App

We use **Capacitor** to wrap the React application into a native Android app.

## Prerequisites
- **Android Studio** installed on your machine.
- **Java/JDK 17** installed (usually comes with Android Studio).

## Step 1: Install Dependencies (Done)
The necessary packages has been installed:
```bash
npm install @capacitor/core
npm install -D @capacitor/cli @capacitor/android
```

## Step 2: Build the Web App
First, we must build the latest version of the React app.
```bash
npm run build
```
This creates the `dist` folder.

## Step 3: Sync to Android
Copy the web build assets to the Android native project.
```bash
npx cap sync
```

## Step 4: Open in Android Studio
Open the native project in Android Studio to run it on an emulator or build an APK.
```bash
npx cap open android
```

## Step 5: Build APK
Inside Android Studio:
1.  Menu: **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
2.  Locate the generated APK and install it on your device.
