import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radii, shadows, spacing } from '@/constants/theme';

export function PugalieseIntroModal({ visible, onDismiss }: { visible: boolean; onDismiss: () => void }) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onDismiss}>
      <View style={styles.scrim}>
        <View style={styles.card}>
          <ImageBackground
            accessibilityLabel="Anthony Pugliese's 1938 sketch, A Study for the Proposed Stadium, Brooklyn College"
            imageStyle={styles.artImage}
            resizeMode="cover"
            source={require('../../assets/brand/pugliese-stadium.jpg')}
            style={styles.art}
          >
            <LinearGradient
              colors={['rgba(247,243,234,0.55)', 'rgba(247,243,234,0.86)', 'rgba(247,243,234,0.98)']}
              locations={[0, 0.5, 0.86]}
              style={StyleSheet.absoluteFill}
            />
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.eyebrow}>The Namesake</Text>
              <Text style={styles.title}>Professor{'\n'}Anthony Pugliese</Text>
              <Text style={styles.dates}>Department of Design, Brooklyn College · 1931–1953</Text>

              <View style={styles.rule} />

              <Text style={styles.body}>
                Anthony Pugliese was an assistant professor and an artist who began teaching when the school was built in
                the 1930s.
              </Text>
              <Text style={styles.body}>
                President Boylan put Mr. Pugliese in charge of design, sketches, and overseeing the construction of the
                campus buildings. Simply put — a true artist who helped build Brooklyn College.
              </Text>

              <Text style={styles.credit}>
                A Study for the Proposed Stadium,{'\n'}Brooklyn College — pen and ink, 1938
              </Text>

              <Pressable
                accessibilityLabel="Enter the campus"
                accessibilityRole="button"
                onPress={onDismiss}
                style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              >
                <Text style={styles.buttonLabel}>Enter the campus</Text>
              </Pressable>
            </ScrollView>
          </ImageBackground>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    alignItems: 'center',
    backgroundColor: 'rgba(38, 10, 15, 0.58)',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.paper,
    borderRadius: radii.lg,
    maxHeight: '88%',
    maxWidth: 430,
    overflow: 'hidden',
    width: '100%',
    ...shadows.floating,
  },
  art: { width: '100%' },
  artImage: { opacity: 0.95 },
  scroll: { paddingHorizontal: spacing.xl, paddingVertical: spacing.xxl },
  eyebrow: {
    color: colors.maroon,
    fontFamily: fonts.uiMedium,
    fontSize: 11,
    letterSpacing: 3.4,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 36,
    letterSpacing: 0.3,
    lineHeight: 38,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  dates: {
    color: colors.inkMuted,
    fontFamily: fonts.displayItalic,
    fontSize: 15,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  rule: {
    alignSelf: 'center',
    backgroundColor: colors.borderStrong,
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing.xl,
    width: 54,
  },
  body: {
    color: colors.ink,
    fontFamily: fonts.ui,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  credit: {
    color: colors.inkMuted,
    fontFamily: fonts.displayItalic,
    fontSize: 16,
    lineHeight: 22,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.maroon,
    borderRadius: radii.sm,
    justifyContent: 'center',
    marginTop: spacing.xxl,
    minHeight: 52,
  },
  buttonPressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  buttonLabel: { color: colors.white, fontFamily: fonts.uiMedium, fontSize: 13, letterSpacing: 2.4, textTransform: 'uppercase' },
});
