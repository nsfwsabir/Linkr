import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Linking, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation/RootNavigator';
import { mockLinks, mockCollections } from '../../utils/mockData';
import { PrimaryButton } from '../../components/Buttons';
import { Icon } from '../../components/Icon';
import { useLinkPreview } from './useLinkPreview';
import { faviconUrl } from '../../utils/url';
import { useRefScale } from '../../utils/useRefScale';
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'LinkDetail'>;

export function LinkDetailScreen({ route, navigation }: Props) {
  const v = useRefScale();
  const link =
    mockLinks.find((l) => l.id === route.params.linkId) ??
    mockLinks.find((l) => l.id === 'l-sleep') ??
    mockLinks[0];
  const collection = mockCollections[0];
  const { metadata } = useLinkPreview(link.original_url);
  const [faviconFailed, setFaviconFailed] = useState(false);

  useEffect(() => {
    setFaviconFailed(false);
  }, [link.id]);

  const bannerUri = link.preview_image_url ?? metadata?.preview_image_url ?? null;
  const iconUri = faviconFailed ? null : faviconUrl(link.source_domain);
  const description = link.description ?? metadata?.description ?? '';
  const fab = v(32);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <LinearGradient
        colors={['#0a1420', '#152a44', '#3a6288', '#6f97b8']}
        locations={[0, 0.38, 0.75, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { height: v(156) }]}
      >
        {bannerUri ? (
          <Image
            source={{ uri: bannerUri }}
            style={styles.heroImage}
            resizeMode="cover"
            accessibilityRole="image"
            accessibilityLabel="Link preview banner"
          />
        ) : null}
        <View
          style={[
            styles.heroGlow,
            { right: v(-30), bottom: v(-40), width: v(160), height: v(160), borderRadius: v(80) },
          ]}
        />
        <View style={[styles.floating, { paddingTop: v(52), paddingHorizontal: v(18) }]}>
          <Pressable
            style={[styles.fab, { width: fab, height: fab, borderRadius: fab / 2 }]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrowLeft" size={v(17)} color={colors.textPrimary} />
          </Pressable>
          <Pressable
            style={[styles.fab, { width: fab, height: fab, borderRadius: fab / 2 }]}
            accessibilityRole="button"
            accessibilityLabel="More actions"
          >
            <Icon name="dots" size={v(17)} color={colors.textPrimary} />
          </Pressable>
        </View>
      </LinearGradient>
      <View style={[styles.body, { paddingTop: v(18), paddingHorizontal: v(22) }]}>
        <Text style={[styles.title, { fontSize: v(19), lineHeight: v(24), letterSpacing: v(-0.2) }]}>
          {link.title}
        </Text>
        <View style={[styles.source, { gap: v(7), marginVertical: v(9) }]}>
          {iconUri ? (
            <Image
              source={{ uri: iconUri }}
              style={[styles.favicon, { width: v(16), height: v(16), borderRadius: v(4) }]}
              onError={() => setFaviconFailed(true)}
              accessibilityRole="image"
              accessibilityLabel={`${link.source_domain} icon`}
            />
          ) : (
            <LinearGradient
              colors={['#3a6288', '#152a44']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.sourceDot, { width: v(15), height: v(15), borderRadius: v(5) }]}
            />
          )}
          <Text style={[styles.sourceText, { fontSize: v(11.5) }]}>{link.source_domain}</Text>
        </View>
        {description ? (
          <Text style={[styles.desc, { fontSize: v(12.5), lineHeight: v(19), marginBottom: v(12) }]}>
            {description}
          </Text>
        ) : null}
        <PrimaryButton title="Open Link" icon="external" onPress={openLink} />
        <View style={[styles.row, { paddingVertical: v(11), marginTop: v(4) }]}>
          <Text style={[styles.rowText, { fontSize: v(12.8) }]}>Add to collection</Text>
          <Icon name="chevronRight" size={v(15)} color={colors.textTertiary} />
        </View>
        <View style={[styles.row, { paddingVertical: v(11), marginTop: v(4) }]}>
          <View>
            <Text style={[styles.rowText, { fontSize: v(12.8) }]}>Saved</Text>
            <Text style={[styles.sub, { fontSize: v(11), marginTop: v(2) }]}>
              {link.saved_at} · {collection.name}
            </Text>
          </View>
          <Icon name="chevronRight" size={v(15)} color={colors.textTertiary} />
        </View>
      </View>
    </SafeAreaView>
  );

  async function openLink() {
    try {
      const supported = await Linking.canOpenURL(link.original_url);
      if (supported) await Linking.openURL(link.original_url);
      else Alert.alert('Cannot open link', link.original_url);
    } catch {
      Alert.alert('Cannot open link', link.original_url);
    }
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.screenBg },
  hero: { overflow: 'hidden' },
  heroImage: { position: 'absolute', inset: 0, width: '100%', height: '100%' },
  heroGlow: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.14)' },
  floating: { flexDirection: 'row', justifyContent: 'space-between' },
  fab: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  body: { flex: 1 },
  title: { fontWeight: '800', color: colors.textPrimary },
  source: { flexDirection: 'row', alignItems: 'center' },
  sourceDot: {},
  favicon: { backgroundColor: colors.screenBgAlt },
  sourceText: { fontWeight: '500', color: colors.textTertiary },
  desc: { color: colors.textSecondary },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rowText: { fontWeight: '600', color: colors.textPrimary },
  sub: { fontWeight: '500', color: colors.textTertiary },
});
