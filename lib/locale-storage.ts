import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWebBrowser = Platform.OS === 'web' && typeof window !== 'undefined';

export async function getLocaleStorageItem(key: string): Promise<string | null> {
  if (isWebBrowser) {
    return localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

export async function setLocaleStorageItem(key: string, value: string): Promise<void> {
  if (isWebBrowser) {
    localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}
