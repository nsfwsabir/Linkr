import React, { ReactNode } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRefScale } from '../utils/useRefScale';
import { Icon } from './Icon';
import { useTheme } from '../app/providers/ThemeProvider';

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
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.dim, { backgroundColor: c.overlay }]}>
        <Pressable style={styles.dimPress} onPress={onClose} accessibilityLabel="Close" />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: c.cardBg,
              borderTopLeftRadius: v(28),
              borderTopRightRadius: v(28),
              padding: v(20),
              paddingBottom: Math.max(v(24), insets.bottom),
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
        </View>
      </View>
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
