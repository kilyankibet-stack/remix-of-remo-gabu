import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.21659c4390aa481f93a8cd936bd28e68',
  appName: 'REMOTASK AI',
  webDir: 'dist',
  server: {
    url: 'https://21659c43-90aa-481f-93a8-cd936bd28e68.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: '#111318',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#111318',
    },
  },
};

export default config;
