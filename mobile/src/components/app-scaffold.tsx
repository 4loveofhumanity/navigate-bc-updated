import type { PropsWithChildren, ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { BottomActionRail } from '@/components/bottom-action-rail';
import { colors, layout, spacing } from '@/constants/theme';

type AppScaffoldProps = PropsWithChildren<{
  scroll?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  beforeRail?: ReactNode;
}>;

export function AppScaffold({ children, scroll = true, contentContainerStyle, beforeRail }: AppScaffoldProps) {
  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.content, contentContainerStyle]}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.flexContent, contentContainerStyle]}>{children}</View>
      )}
      {beforeRail}
      <BottomActionRail />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: colors.cream, flex: 1 },
  content: {
    alignSelf: 'center',
    paddingBottom: spacing.xxl,
    width: '100%',
    maxWidth: layout.contentMaxWidth,
  },
  flexContent: { flex: 1 },
});
