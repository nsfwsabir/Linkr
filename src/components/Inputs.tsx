import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors, radii, spacing } from '../theme';

export function AppTextInput(props: TextInputProps) {
  return (
    <View style={styles.wrap}>
      <TextInput
        placeholderTextColor={colors.textTertiary}
        style={styles.input}
        {...props}
      />
    </View>
  );
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search your links...',
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={styles.search}>
      <TextInput
        accessibilityRole="search"
        accessibilityLabel="Search your links"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        style={styles.searchInput}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: spacing.inputHeight,
    backgroundColor: colors.inputBg,
    borderRadius: radii.input,
    paddingHorizontal: 15,
    justifyContent: 'center',
    marginBottom: 12,
  },
  input: { fontSize: 13.5, color: colors.textPrimary },
  search: {
    height: spacing.searchHeight,
    backgroundColor: colors.inputBg,
    borderRadius: radii.search,
    marginHorizontal: spacing.pageHorizontal,
    marginBottom: 12,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  searchInput: { fontSize: 13, color: colors.textPrimary },
});
