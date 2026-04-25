/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1A1A1A',
    textSecondary: '#666666',
    background: '#F5F7F2', // Un gris très clair avec une pointe de vert
    surface: '#FFFFFF',    // Fond des cartes
    border: '#E2E8F0',
    input: '#EDF2F7',
    tint: '#B0FC51',       // On garde le vert néon comme accent
    tintDark: '#86D12E',   // Version plus sombre pour le texte en mode clair
    icon: '#4A5568',
    tabIconDefault: '#A0AEC0',
    tabIconSelected: '#1A1A1A',
    danger: '#E53E3E',
    success: '#38A169',
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#888888',
    background: '#0E0E0E', // Noir profond
    surface: '#18191C',    // Gris anthracite pour les cartes
    border: '#2A2A2A',
    input: '#1A1A1A',
    tint: '#B0FC51',
    tintDark: '#CCFF00',
    icon: '#888888',
    tabIconDefault: '#444444',
    tabIconSelected: '#CCFF00',
    danger: '#FF4444',
    success: '#CCFF00',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
