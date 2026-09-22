import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useRefScale } from '../utils/useRefScale';
import { Icon, IconName } from './Icon';
import { useTheme } from '../app/providers/ThemeProvider';

const FIELD_ICON_COLOR = '#a7abb3';

export function AppTextInput({
  icon,
  ...props
}: TextInputProps & { icon?: IconName }) {
  const v = useRefScale();
  const { c } = useTheme();
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
          backgroundColor: c.inputBg,
        },
      ]}
    >
      {icon ? <Icon name={icon} size={v(17)} color={FIELD_ICON_COLOR} /> : null}
      <TextInput
        placeholderTextColor={c.textTertiary}
        style={[styles.input, { fontSize: v(13.5), color: c.textPrimary }]}
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
  const { c } = useTheme();
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
          backgroundColor: c.inputBg,
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
        placeholderTextColor={c.textTertiary}
        style={[styles.searchInput, { fontSize: v(13), color: c.textPrimary }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: { flex: 1 },
  search: { flexDirection: 'row', alignItems: 'center' },
  searchInput: { flex: 1 },
});
