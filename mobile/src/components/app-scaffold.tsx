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

// Height reserved at the bottom so content clears the floating nav bar.
const RAIL_CLEARANCE = 104;

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
          <View style={styles.railClearance} />
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.flexContent, contentContainerStyle]}>{children}</View>
      )}
      <View pointerEvents="box-none" style={styles.dock}>
        {beforeRail}
        <BottomActionRail />
      </View>
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
  flexContent: { flex: 1, paddingBottom: RAIL_CLEARANCE },
  railClearance: { height: RAIL_CLEARANCE },
  dock: { bottom: 0, left: 0, position: 'absolute', right: 0 },
});
