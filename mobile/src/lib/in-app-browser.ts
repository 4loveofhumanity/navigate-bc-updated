import { router } from 'expo-router';

export function openInAppBrowser(url: string, title?: string) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error(`Unsupported browser URL: ${parsed.protocol}`);
  }

  router.push({ pathname: '/browser', params: { url: parsed.toString(), title: title ?? parsed.hostname } });
}
