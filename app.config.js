require('dotenv').config();

module.exports = {
    name: "bangr",
    slug: "poche-app",
    version: "0.0.8",
    scheme: "bangr",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#000000"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSFaceIDUsageDescription: "Bangr uses FaceId to authenticate you.",
        RCTAsyncStorageExcludeFromBackup: false
      },
      bundleIdentifier: "app.bangr.app",
      buildNumber: "4"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      package: "app.bangr.app",
      versionCode: 4
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "d6d44490-5584-4b9c-85b4-d5e2ff08b185"
      },
      MONERIUM_SECRET_KEY: process.env.MONERIUM_SECRET_KEY,
      MONERIUM_SECRET_KEY_SANDBOX: process.env.MONERIUM_SECRET_KEY_SANDBOX,
    },
    owner: "ndlz",
    plugins: [
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 33,
            targetSdkVersion: 33,
            kotlinVersion: "1.8.0"
          }
        }
      ]
    ],
  }

