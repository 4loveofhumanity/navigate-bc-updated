import {
  CormorantGaramond_600SemiBold,
  CormorantGaramond_600SemiBold_Italic,
} from '@expo-google-fonts/cormorant-garamond';
import {
  SourceSans3_400Regular,
  SourceSans3_600SemiBold,
  SourceSans3_700Bold,
} from '@expo-google-fonts/source-sans-3';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors, fonts } from '@/constants/theme';
import { SettingsProvider } from '@/context/settings-context';

void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60_000,
    },
  },
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    CormorantGaramond_600SemiBold,
    CormorantGaramond_600SemiBold_Italic,
    SourceSans3_400Regular,
    SourceSans3_600SemiBold,
    SourceSans3_700Bold,
  });

  useEffect(() => {
    if (loaded || error) void SplashScreen.hideAsync();
  }, [error, loaded]);

  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <SettingsProvider>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: colors.cream },
                headerBackButtonDisplayMode: 'minimal',
                headerShadowVisible: false,
                headerStyle: { backgroundColor: colors.maroon },
                headerTintColor: colors.white,
                headerTitleStyle: { fontFamily: fonts.uiBold, fontSize: 18 },
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
              <Stack.Screen name="directory" options={{ title: 'Directory' }} />
              <Stack.Screen name="courses" options={{ title: 'Course Catalog' }} />
              <Stack.Screen name="my-classes" options={{ title: 'My Classes' }} />
              <Stack.Screen name="events" options={{ title: 'Events' }} />
              <Stack.Screen name="cafeteria" options={{ title: 'Dining & Orders' }} />
              <Stack.Screen name="academic-calendar" options={{ title: 'Academic Calendar' }} />
              <Stack.Screen name="it-status" options={{ title: 'IT Status' }} />
              <Stack.Screen name="alerts" options={{ title: 'My Alerts' }} />
              <Stack.Screen name="help" options={{ title: 'Pugliese Help' }} />
              <Stack.Screen name="settings" options={{ title: 'Settings' }} />
              <Stack.Screen name="info" options={{ title: 'My Pugliese Info' }} />
              <Stack.Screen name="library" options={{ title: 'Library' }} />
              <Stack.Screen name="student-id" options={{ title: 'Student ID' }} />
              <Stack.Screen name="map" options={{ title: 'Campus Map' }} />
              <Stack.Screen name="career" options={{ title: 'My Career' }} />
              <Stack.Screen name="pugliese-circle" options={{ title: 'PUG' }} />
              <Stack.Screen name="fix-it" options={{ title: 'Fix-it' }} />
              <Stack.Screen name="browser" options={{ title: 'Browser' }} />
            </Stack>
          </SettingsProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
