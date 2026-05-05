import type { CapacitorConfig } from '@capacitor/cli';

// ADMIN: Update appId and appName to match your app
// ADMIN: Run 'npx cap add android' to add Android platform
// ADMIN: Run 'npx cap sync' after each build to sync web assets
const config: CapacitorConfig = {
  appId: 'com.myapp.chat',          // ADMIN: Change to your app ID (e.g., com.yourname.myapp)
  appName: 'MyApp',                  // ADMIN: Change to your app name
  webDir: 'dist',                    // Output of 'pnpm build' — do not change
  server: {
    androidScheme: 'https',
  },
  android: {
    // ADMIN: Android-specific settings go here
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#075E54',    // WhatsApp dark green splash
      showSpinner: false,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
