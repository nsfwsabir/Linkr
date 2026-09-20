import React, { ReactNode } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRefScale } from '../utils/useRefScale';
import { Icon } from './Icon';
import { colors } from '../theme';

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
  const x = v(26);
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.dim}>
        <Pressable style={styles.dimPress} onPress={onClose} accessibilityLabel="Close" />
        <View
          style={[
            styles.sheet,
            {
              borderTopLeftRadius: v(28),
              borderTopRightRadius: v(28),
              padding: v(20),
              paddingBottom: Math.max(v(24), insets.bottom),
            },
          ]}
        >
          <View style={[styles.header, { marginBottom: v(16) }]}>
            <Text style={[styles.title, { fontSize: v(16.5) }]}>{title}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close dialog"
              onPress={onClose}
              style={[styles.x, { width: x, height: x, borderRadius: x / 2 }]}
            >
              <Icon name="close" size={v(13)} color={colors.textSecondary} />
            </Pressable>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dim: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  dimPress: { flex: 1 },
  sheet: { backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontWeight: '800', color: colors.textPrimary },
  x: { backgroundColor: colors.inputBg, alignItems: 'center', justifyContent: 'center' },
});
