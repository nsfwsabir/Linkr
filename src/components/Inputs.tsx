import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Icon, IconName } from './Icon';
import { colors, radii, spacing } from '../theme';

const FIELD_ICON_COLOR = '#a7abb3';

export function AppTextInput({
  icon,
  ...props
}: TextInputProps & { icon?: IconName }) {
  return (
    <View style={styles.wrap}>
      {icon ? <Icon name={icon} size={17} color={FIELD_ICON_COLOR} /> : null}
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
      <Icon name="search" size={16} color={FIELD_ICON_COLOR} />
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: spacing.inputHeight,
    backgroundColor: colors.inputBg,
    borderRadius: radii.input,
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  input: { flex: 1, fontSize: 13.5, color: colors.textPrimary },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    height: spacing.searchHeight,
    backgroundColor: colors.inputBg,
    borderRadius: radii.search,
    marginHorizontal: spacing.pageHorizontal,
    marginBottom: 12,
    paddingHorizontal: 14,
  },
  searchInput: { flex: 1, fontSize: 13, color: colors.textPrimary },
});
