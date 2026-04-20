# Activities

Mobile application that help you to set and follow you objectives.

## Description
With Activities you can track your progress among all ativities you perform on a day. This application help you to reach your objectives and become better each days. You can customize as much as you want. More is coming like a sport tracker and a food tracker.

### Languages / frameworks
- SpringBoot 3 🍃
- React Native 📱
- PostgreSQl 💾
- Docker 📦

### Current Version
- **iOS**: 26.4
  
## Installation

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

### Step 1: Install Dependencies

From the root of your React Native project, install the required dependencies:

```bash
# using npm
npm install

# OR using Yarn
yarn install
```

### Step 2: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 3: Running the Application on iOS Simulator

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project.

### Quick Start - Automatic iOS Simulator Launch

Run the following command to build and launch the app on the default iOS simulator:

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

### Advanced iOS Simulator Options

If you want to specify a particular simulator device, use one of these commands:

```bash
# For iPhone 15 Pro
npm run ios -- --simulator "iPhone 15 Pro"

# For iPhone 15
npm run ios -- --simulator "iPhone 15"

# For iPad Air
npm run ios -- --simulator "iPad Air"
```

### Manual iOS Build with Xcode

Alternatively, you can open the Xcode workspace and run the app manually:

```bash
# Open the iOS workspace
open ios/Activities.xcworkspace
```

Then in Xcode:
1. Select a simulator device from the toolbar (top-center)
2. Press the **Play** button or use <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> to build and run

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

## Reloading Your App

### iOS Simulator
- Press <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> to reload the app
- Press <kbd>Cmd ⌘</kbd> + <kbd>D</kbd> to open the developer menu

### Android Emulator
- Press the <kbd>R</kbd> key twice to reload the app
- Press <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS) to open the developer menu

## Troubleshooting

### iOS Simulator Issues

If you encounter issues with the iOS simulator:

1. **Simulator won't start**: Try restarting the simulator from Xcode
2. **Build errors**: Clear derived data and rebuild:
   ```bash
   rm -rf ~/Library/Developer/Xcode/DerivedData/*
   npm run ios
   ```
3. **Metro issues**: Kill and restart the Metro bundler on a different port:
   ```bash
   npm start -- --port 8088
   ```

## Congratulations! :tada:

You've successfully set up and can now run your React Native Activities App on iOS! :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

## Authors
- [Bastien JACQUELIN](https://github.com/Basuw)

