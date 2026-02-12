# 🚀 QUICK START: Get Your App Running (10 Minutes)

**Your Credentials (Already in app.json):**
- URL: https://qwqclhzezyzeflxrtfjy.supabase.co
- API Key: sb_publishable_X44nRh0JlS952CarvKJfcg_WAJLktxq

---

## ✅ STEP 1: Open Your Terminal

Open a terminal on your computer (doesn't matter where).

---

## ✅ STEP 2: Create Your Project Folder

Type this and press Enter:

```bash
npx create-expo-app couples-app
```

**What this does:**
- Creates a folder called `couples-app/`
- Downloads React Native and Expo
- Creates the `app.json` file (the config file)
- **Takes about 2-3 minutes**

**You'll see:**
```
✅ Your new Expo project is ready!
📁 Location: /Users/you/couples-app
```

---

## ✅ STEP 3: Go Into Your Project

Type this and press Enter:

```bash
cd couples-app
```

**What this does:** Moves you into the `couples-app` folder

---

## ✅ STEP 4: Replace app.json

1. **In the `couples-app` folder, find the file called `app.json`**
   - Should be right there in the main folder
   - NOT in a subfolder

2. **Open it with any text editor** (VS Code, Notepad, TextEdit, etc.)

3. **Delete EVERYTHING in it** (select all: Ctrl+A or Cmd+A, then Delete)

4. **Copy this entire text below** and paste it in:

```json
{
  "expo": {
    "name": "couples-app",
    "slug": "couples-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTabletMode": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "supabaseUrl": "https://qwqclhzezyzeflxrtfjy.supabase.co",
      "supabaseAnonKey": "sb_publishable_X44nRh0JlS952CarvKJfcg_WAJLktxq"
    }
  }
}
```

5. **Save the file** (Ctrl+S or Cmd+S)

---

## ✅ STEP 5: Install Required Packages

In your terminal, type this and press Enter:

```bash
npm install @supabase/supabase-js expo-constants @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage
```

**What this does:** Downloads the libraries your app needs
**Takes:** About 1-2 minutes

---

## ✅ STEP 6: Test It Works

In your terminal, type this and press Enter:

```bash
npx expo start
```

**You should see something like:**
```
Starting Expo Go...
Ready at http://localhost:19000
```

Then you'll see a **QR code** in your terminal.

---

## ✅ STEP 7: Scan on Your Phone

1. **Get your phone**
2. **Open the Expo Go app** (if you don't have it, download from App Store or Google Play)
3. **Point your phone camera at the QR code** in your terminal
4. **Tap the notification that pops up**

**Your app should load on your phone!** 🎉

You should see a white screen with "Welcome to Expo" or a blank app.

---

## 🎉 Done!

Your app is now connected to Supabase. You have:
- ✅ Project created
- ✅ app.json configured with your Supabase credentials
- ✅ App running on your phone
- ✅ All packages installed

---

## 📂 Your Folder Structure Now Looks Like:

```
couples-app/
├── app.json                    ← This has your Supabase info
├── App.js
├── package.json
├── node_modules/               ← Downloaded packages
├── assets/
│   ├── icon.png
│   ├── splash.png
│   └── adaptive-icon.png
└── ...
```

---

## ⚠️ If Something Goes Wrong

### Problem: "Command not found: npx"
**Solution:** You need Node.js installed
- Download from nodejs.org
- Install it
- Restart your terminal
- Try again

### Problem: "Cannot find module '@supabase/supabase-js'"
**Solution:** Run the `npm install` commands again

### Problem: "app.json not found"
**Solution:** Make sure you're in the `couples-app` folder
- Type: `ls app.json`
- If it says "No such file", you're in the wrong folder
- Go back and do `cd couples-app`

### Problem: "Expo Go app not working"
**Solution:**
- Make sure Expo Go is installed on your phone
- Make sure you're on the same WiFi as your computer
- Kill the terminal (Ctrl+C) and try `npx expo start` again

---

## 🎯 What Comes Next

Once your app is running on your phone:

1. **You now have the folder structure ready**
2. **You can start writing React code**
3. **You can brief Claude Code with your specifications**
4. **Claude Code will build the screens**

---

## 📝 Save This for Reference

Your Supabase details (already in app.json):
- **URL:** https://qwqclhzezyzeflxrtfjy.supabase.co
- **API Key:** sb_publishable_X44nRh0JlS952CarvKJfcg_WAJLktxq

---

## ✨ You're All Set!

That's it! You have a working React Native project with Supabase connected.

**Next steps:**
1. Download all your specification files
2. Organize them in a `context/` folder inside `couples-app/`
3. Brief Claude Code with your specs
4. Start building!

---

**Questions?** Re-read the step that's confusing.  
**Ready to build?** You're all set! 🚀
