import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRefScale } from '../utils/useRefScale';
import { Icon } from './Icon';
import { useTheme } from '../app/providers/ThemeProvider';

const OPEN_MS = 200;
const CLOSE_MS = 160;

export function BottomSheet({
  visible,
  title,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const v = useRefScale();
  const insets = useSafeAreaInsets();
  const { c } = useTheme();
  const x = v(26);
  const screenH = Dimensions.get('window').height;
  const [mounted, setMounted] = useState(visible);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(progress, {
        toValue: 1,
        duration: OPEN_MS,
        useNativeDriver: true,
      }).start();
      return;
    }
    Animated.timing(progress, {
      toValue: 0,
      duration: CLOSE_MS,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setMounted(false);
    });
  }, [visible, progress]);

  if (!mounted) return null;

  return (
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View
        style={[styles.dim, { backgroundColor: c.overlay, opacity: progress }]}
      >
        <Pressable style={styles.dimPress} onPress={onClose} accessibilityLabel="Close" />
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: c.cardBg,
              borderTopLeftRadius: v(28),
              borderTopRightRadius: v(28),
              padding: v(20),
              paddingBottom: Math.max(v(24), insets.bottom),
              opacity: progress,
              transform: [
                {
                  translateY: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [screenH, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[styles.header, { marginBottom: v(16) }]}>
            <Text style={[styles.title, { fontSize: v(16.5), color: c.textPrimary }]}>
              {title}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close dialog"
              onPress={onClose}
              style={[styles.x, { width: x, height: x, borderRadius: x / 2, backgroundColor: c.inputBg }]}
            >
              <Icon name="close" size={v(13)} color={c.textSecondary} />
            </Pressable>
          </View>
          {children}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dim: { flex: 1, justifyContent: 'flex-end' },
  dimPress: { flex: 1 },
  sheet: {},
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontWeight: '800' },
  x: { alignItems: 'center', justifyContent: 'center' },
});
