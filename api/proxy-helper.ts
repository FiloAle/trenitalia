import { Platform } from 'react-native';
import Constants from 'expo-constants';

export function getLefrecceUrl(path: string) {
  const fullUrl = `https://www.lefrecce.it/Channels.Website.BFF.WEB/website${path}`;
  if (Platform.OS === 'web') {
    if (__DEV__) {
      const hostUri = Constants.expoConfig?.hostUri;
      const proxyBase = hostUri ? `http://${hostUri}/api/proxy?url=` : "/api/proxy?url=";
      return `${proxyBase}${encodeURIComponent(fullUrl)}`;
    } else {
      return `/api/proxy?url=${encodeURIComponent(fullUrl)}`;
    }
  }
  return fullUrl;
}

export function getViaggiatrenoUrl(path: string) {
  const fullUrl = `http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno${path}`;
  if (Platform.OS === 'web') {
    if (__DEV__) {
      const hostUri = Constants.expoConfig?.hostUri;
      const proxyBase = hostUri ? `http://${hostUri}/api/proxy?url=` : "/api/proxy?url=";
      return `${proxyBase}${encodeURIComponent(fullUrl)}`;
    } else {
      return `/api/proxy?url=${encodeURIComponent(fullUrl)}`;
    }
  }
  return fullUrl;
}

export function getGenericUrl(fullUrl: string) {
  if (Platform.OS === 'web') {
    if (__DEV__) {
      const hostUri = Constants.expoConfig?.hostUri;
      const proxyBase = hostUri ? `http://${hostUri}/api/proxy?url=` : "/api/proxy?url=";
      return `${proxyBase}${encodeURIComponent(fullUrl)}`;
    } else {
      return `/api/proxy?url=${encodeURIComponent(fullUrl)}`;
    }
  }
  return fullUrl;
}
