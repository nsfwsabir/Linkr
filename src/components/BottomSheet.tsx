import React, { ReactNode } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { colors, radii } from '../theme';

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
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.dim}>
        <Pressable style={styles.dimPress} onPress={onClose} accessibilityLabel="Close" />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close dialog"
              onPress={onClose}
              style={styles.x}
            >
              <Text style={styles.xText}>✕</Text>
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
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: radii.sheetTop,
    borderTopRightRadius: radii.sheetTop,
    padding: 20,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: { fontSize: 16.5, fontWeight: '800', color: colors.textPrimary },
  x: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  xText: { color: colors.textSecondary, fontSize: 13 },
});
