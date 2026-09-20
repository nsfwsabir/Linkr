import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useRefScale } from '../utils/useRefScale';
import { Icon, IconName } from './Icon';
import { colors } from '../theme';

const FIELD_ICON_COLOR = '#a7abb3';

export function AppTextInput({
  icon,
  ...props
}: TextInputProps & { icon?: IconName }) {
  const v = useRefScale();
  return (
    <View
      style={[
        styles.wrap,
        {
          gap: v(10),
          height: v(48),
          borderRadius: v(14),
          paddingHorizontal: v(15),
          marginBottom: v(12),
        },
      ]}
    >
      {icon ? <Icon name={icon} size={v(17)} color={FIELD_ICON_COLOR} /> : null}
      <TextInput
        placeholderTextColor={colors.textTertiary}
        style={[styles.input, { fontSize: v(13.5) }]}
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
  const v = useRefScale();
  return (
    <View
      style={[
        styles.search,
        {
          gap: v(9),
          height: v(42),
          borderRadius: v(13),
          marginHorizontal: v(22),
          marginBottom: v(12),
          paddingHorizontal: v(14),
        },
      ]}
    >
      <Icon name="search" size={v(16)} color={FIELD_ICON_COLOR} />
      <TextInput
        accessibilityRole="search"
        accessibilityLabel="Search your links"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        style={[styles.searchInput, { fontSize: v(13) }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
  },
  input: { flex: 1, color: colors.textPrimary },
  search: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.inputBg },
  searchInput: { flex: 1, color: colors.textPrimary },
});
