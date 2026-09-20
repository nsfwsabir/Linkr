import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomSheet } from '../../components/BottomSheet';
import { Icon } from '../../components/Icon';
import { AppTextInput } from '../../components/Inputs';
import { PrimaryButton } from '../../components/Buttons';
import { isValidUrl, extractDomain } from '../../utils/url';
import { mockCollections } from '../../utils/mockData';
import { colors } from '../../theme';

export function SaveLinkSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [url, setUrl] = useState('https://example.com');
  const [collection, setCollection] = useState(mockCollections[0].name);
  const [error, setError] = useState<string | null>(null);

  const valid = isValidUrl(url);
  const domain = valid ? extractDomain(url) : '';

  const handleSave = () => {
    if (!valid) {
      setError('The URL is not valid.');
      return;
    }
    setError(null);
    onClose();
  };

  return (
    <BottomSheet visible={visible} title="Save Link" onClose={onClose}>
      <AppTextInput
        placeholder="https://example.com"
        value={url}
        onChangeText={(t) => {
          setUrl(t);
          setError(null);
        }}
        keyboardType="url"
        autoCapitalize="none"
        accessibilityLabel="URL to save"
      />
      {valid ? (
        <View style={styles.preview}>
          <View style={styles.previewThumb}>
            <Icon name="image" size={20} color="#9aa0a8" />
          </View>
          <View style={styles.previewText}>
            <Text style={styles.previewTitle}>Example Website</Text>
            <Text style={styles.previewDesc}>
              {domain ? `${domain} — a` : 'A'} short description of the page...
            </Text>
          </View>
        </View>
      ) : (
        <Text style={styles.hint}>Enter a valid http(s) URL to see a preview.</Text>
      )}
      <Text style={styles.label}>Add to collection</Text>
      <View style={styles.dropdown}>
        <Icon name="folder" size={16} color={colors.blue} />
        <Text style={styles.dropdownText}>{collection}</Text>
        <Icon name="chevronDown" size={15} color={colors.textTertiary} />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <PrimaryButton title="Save" onPress={handleSave} />
      {/* Collection options mirror HTML source; picker UI deferred to keep sheet faithful */}
      <Text style={styles.hidden} accessibilityElementsHidden>
        {collection}
      </Text>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: colors.screenBgAlt,
    borderRadius: 14,
    padding: 10,
    marginBottom: 16,
  },
  previewThumb: {
    width: 44,
    height: 44,
    borderRadius: 11,
    backgroundColor: '#e2e5ea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewText: { flex: 1 },
  previewTitle: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  previewDesc: { fontSize: 11, color: colors.textTertiary, marginTop: 2 },
  hint: { fontSize: 12, color: colors.textTertiary, marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '700', color: colors.textSecondary, marginBottom: 8 },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    height: 46,
    backgroundColor: colors.inputBg,
    borderRadius: 13,
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  dropdownText: { flex: 1, fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  error: { color: colors.pink, fontSize: 12, marginBottom: 8 },
  hidden: { display: 'none' },
});
