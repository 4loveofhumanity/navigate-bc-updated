import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewNavigation } from 'react-native-webview';

import { colors, fonts, spacing } from '@/constants/theme';

export default function BrowserScreen() {
  const params = useLocalSearchParams<{ url?: string; title?: string }>();
  const webView = useRef<WebView>(null);
  const initialUrl = useMemo(() => {
    const value = Array.isArray(params.url) ? params.url[0] : params.url;
    try {
      const parsed = new URL(value ?? '');
      return ['http:', 'https:'].includes(parsed.protocol) ? parsed.toString() : null;
    } catch {
      return null;
    }
  }, [params.url]);
  const [currentUrl, setCurrentUrl] = useState(initialUrl ?? '');
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [progress, setProgress] = useState(0);

  const updateNavigation = (state: WebViewNavigation) => {
    setCurrentUrl(state.url);
    setCanGoBack(state.canGoBack);
    setCanGoForward(state.canGoForward);
  };

  if (!initialUrl) {
    return <View style={styles.center}><Text style={styles.error}>This link cannot be opened safely.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: params.title || 'Browser' }} />
      <View style={styles.addressBar}>
        <Ionicons color={colors.green} name="lock-closed" size={14} />
        <Text numberOfLines={1} style={styles.address}>{currentUrl}</Text>
      </View>
      {progress < 1 ? <View style={styles.progressTrack}><View style={[styles.progress, { width: `${progress * 100}%` }]} /></View> : null}
      <WebView
        allowsBackForwardNavigationGestures
        onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
        onNavigationStateChange={updateNavigation}
        ref={webView}
        setSupportMultipleWindows={false}
        source={{ uri: initialUrl }}
        startInLoadingState
        renderLoading={() => <View style={styles.loader}><ActivityIndicator color={colors.maroon} size="large" /></View>}
        style={styles.webView}
      />
      <View style={styles.toolbar}>
        <BrowserButton disabled={!canGoBack} icon="chevron-back" label="Back" onPress={() => webView.current?.goBack()} />
        <BrowserButton disabled={!canGoForward} icon="chevron-forward" label="Forward" onPress={() => webView.current?.goForward()} />
        <BrowserButton icon="refresh" label="Reload" onPress={() => webView.current?.reload()} />
      </View>
    </View>
  );
}

function BrowserButton({ disabled = false, icon, label, onPress }: { disabled?: boolean; icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityLabel={label} accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.toolButton, pressed && !disabled && styles.pressed, disabled && styles.disabled]}>
      <Ionicons color={colors.maroon} name={icon} size={22} />
      <Text style={styles.toolLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.surface, flex: 1 },
  addressBar: { alignItems: 'center', backgroundColor: colors.cream, borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', gap: spacing.sm, minHeight: 42, paddingHorizontal: spacing.lg },
  address: { color: colors.inkMuted, flex: 1, fontFamily: fonts.ui, fontSize: 12 },
  progressTrack: { backgroundColor: colors.border, height: 2 },
  progress: { backgroundColor: colors.maroon, height: 2 },
  webView: { flex: 1 },
  loader: { alignItems: 'center', bottom: 0, justifyContent: 'center', left: 0, position: 'absolute', right: 0, top: 0 },
  toolbar: { alignItems: 'center', backgroundColor: colors.surface, borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-around', minHeight: 62, paddingBottom: spacing.xs },
  toolButton: { alignItems: 'center', minWidth: 72, padding: spacing.sm },
  toolLabel: { color: colors.maroon, fontFamily: fonts.uiMedium, fontSize: 11, marginTop: 2 },
  pressed: { opacity: 0.6 },
  disabled: { opacity: 0.3 },
  center: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: spacing.xl },
  error: { color: colors.red, fontFamily: fonts.uiMedium, textAlign: 'center' },
});
