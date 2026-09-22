import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { BottomSheet } from '../../components/BottomSheet';
import { Icon } from '../../components/Icon';
import { AppTextInput } from '../../components/Inputs';
import { PrimaryButton } from '../../components/Buttons';
import { useLinkPreview } from './useLinkPreview';
import { isValidUrl, faviconUrl } from '../../utils/url';
import { useLinks } from '../../app/providers/LinksProvider';
import { useTheme } from '../../app/providers/ThemeProvider';
import { useRefScale } from '../../utils/useRefScale';
import { colors, themesFor } from '../../theme';

const DEBOUNCE_MS = 600;

export function SaveLinkSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const v = useRefScale();
  const { c } = useTheme();
  const { collections, addLink } = useLinks();
  const [url, setUrl] = useState('https://example.com');
  const [debouncedUrl, setDebouncedUrl] = useState(url);
  const [collectionId, setCollectionId] = useState(collections[0]?.id ?? '');
  const [error, setError] = useState<string | null>(null);
  const [thumbFailed, setThumbFailed] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const theme = themesFor(c);

  const valid = isValidUrl(url);
  const domain = valid ? url.trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '').replace(/^www\./i, '') : '';

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedUrl(url);
      setThumbFailed(false);
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [url]);

  const { metadata, status } = useLinkPreview(
    valid && isValidUrl(debouncedUrl) ? debouncedUrl.trim() : '',
  );

  const selectedCollection =
    collections.find((col) => col.id === collectionId) ?? collections[0];

  const handleSave = () => {
    if (!valid) {
      setError('The URL is not valid.');
      return;
    }
    setError(null);
    addLink({
      url: url.trim(),
      title: metadata?.title ?? undefined,
      description: metadata?.description ?? null,
      collectionId: selectedCollection?.id,
    });
    onClose();
  };

  const liveTitle = metadata?.title;
  const liveDesc = metadata?.description;
  const bannerUri = metadata?.preview_image_url ?? null;
  const iconUri = !thumbFailed && domain ? faviconUrl(domain, 64) : null;
  const thumbUri = bannerUri ?? iconUri;
  const thumb = v(44);

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
        <View
          style={[
            styles.preview,
            {
              gap: v(11),
              borderRadius: v(14),
              padding: v(10),
              marginBottom: v(16),
              backgroundColor: c.screenBgAlt,
            },
          ]}
        >
          <View
            style={[
              styles.previewThumb,
              { width: thumb, height: thumb, borderRadius: v(11), backgroundColor: c.avatarBg },
            ]}
          >
            {thumbUri ? (
              <Image
                source={{ uri: thumbUri }}
                style={{ width: thumb, height: thumb, borderRadius: v(11) }}
                onError={() => setThumbFailed(true)}
                accessibilityRole="image"
                accessibilityLabel="Link preview"
              />
            ) : (
              <Icon name="image" size={v(20)} color="#9aa0a8" />
            )}
          </View>
          <View style={styles.previewText}>
            <Text
              style={[styles.previewTitle, { fontSize: v(13), color: c.textPrimary }]}
              numberOfLines={1}
            >
              {status === 'loading' ? 'Fetching preview…' : (liveTitle ?? 'Example Website')}
            </Text>
            <Text
              style={[styles.previewDesc, { fontSize: v(11), marginTop: v(2), color: c.textTertiary }]}
              numberOfLines={2}
            >
              {liveDesc ?? (domain ? `${domain} — a short description of the page...` : 'A short description of the page...')}
            </Text>
          </View>
        </View>
      ) : (
        <Text style={[styles.hint, { fontSize: v(12), marginBottom: v(16), color: c.textTertiary }]}>
          Enter a valid http(s) URL to see a preview.
        </Text>
      )}
      <Text style={[styles.label, { fontSize: v(12), marginBottom: v(8), color: c.textSecondary }]}>
        Add to collection
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Choose collection"
        onPress={() => setPickerVisible(true)}
        style={[
          styles.dropdown,
          {
            gap: v(9),
            height: v(46),
            borderRadius: v(13),
            paddingHorizontal: v(14),
            marginBottom: v(18),
            backgroundColor: c.inputBg,
          },
        ]}
      >
        <Icon name="folder" size={v(16)} color={colors.blue} />
        <Text style={[styles.dropdownText, { fontSize: v(13), color: c.textPrimary }]}>
          {selectedCollection?.name ?? 'Read Later'}
        </Text>
        <Icon name="chevronDown" size={v(15)} color={c.textTertiary} />
      </Pressable>
      <BottomSheet
        visible={pickerVisible}
        title="Add to collection"
        onClose={() => setPickerVisible(false)}
      >
        {collections.map((col) => {
          const selected = col.id === (selectedCollection?.id ?? collectionId);
          const t = theme[col.color_key];
          return (
            <Pressable
              key={col.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={col.name}
              onPress={() => {
                setCollectionId(col.id);
                setPickerVisible(false);
              }}
              style={[
                styles.pickRow,
                {
                  gap: v(12),
                  paddingVertical: v(11),
                  paddingHorizontal: v(12),
                  borderRadius: v(14),
                  marginBottom: v(8),
                  backgroundColor: selected ? t.bg : c.inputBg,
                },
              ]}
            >
              <View style={[styles.pickIcon, { backgroundColor: c.cardBg, width: v(32), height: v(32), borderRadius: v(10) }]}>
                <Icon name="folder" size={v(15)} color={t.fg} />
              </View>
              <Text style={[styles.pickName, { fontSize: v(13.5), color: c.textPrimary, flex: 1 }]}>
                {col.name}
              </Text>
              {selected ? <Icon name="chevronRight" size={v(15)} color={t.fg} /> : null}
            </Pressable>
          );
        })}
      </BottomSheet>
      {error ? (
        <Text style={[styles.error, { fontSize: v(12), marginBottom: v(8) }]}>{error}</Text>
      ) : null}
      <PrimaryButton title="Save" onPress={handleSave} />
      <Text style={styles.hidden} accessibilityElementsHidden>
        {selectedCollection?.name ?? ''}
      </Text>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  preview: { flexDirection: 'row', alignItems: 'center' },
  previewThumb: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  previewText: { flex: 1 },
  previewTitle: { fontWeight: '700' },
  previewDesc: {},
  hint: {},
  label: { fontWeight: '700' },
  dropdown: { flexDirection: 'row', alignItems: 'center' },
  dropdownText: { flex: 1, fontWeight: '600' },
  pickRow: { flexDirection: 'row', alignItems: 'center' },
  pickIcon: { alignItems: 'center', justifyContent: 'center' },
  pickName: { fontWeight: '700' },
  error: { color: colors.pink },
  hidden: { display: 'none' },
});
