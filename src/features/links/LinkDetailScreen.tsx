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
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'LinkDetail'>;

export function LinkDetailScreen({ route, navigation }: Props) {
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

  const openLink = async () => {
    try {
      const supported = await Linking.canOpenURL(link.original_url);
      if (supported) await Linking.openURL(link.original_url);
      else Alert.alert('Cannot open link', link.original_url);
    } catch {
      Alert.alert('Cannot open link', link.original_url);
    }
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <LinearGradient
        colors={['#0a1420', '#152a44', '#3a6288', '#6f97b8']}
        locations={[0, 0.38, 0.75, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
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
        <View style={styles.heroGlow} />
        <View style={styles.floating}>
          <Pressable
            style={styles.fab}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrowLeft" size={17} color={colors.textPrimary} />
          </Pressable>
          <Pressable style={styles.fab} accessibilityRole="button" accessibilityLabel="More actions">
            <Icon name="dots" size={17} color={colors.textPrimary} />
          </Pressable>
        </View>
      </LinearGradient>
      <View style={styles.body}>
        <Text style={styles.title}>{link.title}</Text>
        <View style={styles.source}>
          {iconUri ? (
            <Image
              source={{ uri: iconUri }}
              style={styles.favicon}
              onError={() => setFaviconFailed(true)}
              accessibilityRole="image"
              accessibilityLabel={`${link.source_domain} icon`}
            />
          ) : (
            <LinearGradient
              colors={['#3a6288', '#152a44']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sourceDot}
            />
          )}
          <Text style={styles.sourceText}>{link.source_domain}</Text>
        </View>
        {description ? <Text style={styles.desc}>{description}</Text> : null}
        <PrimaryButton title="Open Link" icon="external" onPress={openLink} />
        <View style={styles.row}>
          <Text style={styles.rowText}>Add to collection</Text>
          <Icon name="chevronRight" size={15} color={colors.textTertiary} />
        </View>
        <View style={styles.row}>
          <View>
            <Text style={styles.rowText}>Saved</Text>
            <Text style={styles.sub}>
              {link.saved_at} · {collection.name}
            </Text>
          </View>
          <Icon name="chevronRight" size={15} color={colors.textTertiary} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.screenBg },
  hero: { height: 156, overflow: 'hidden' },
  heroImage: { position: 'absolute', inset: 0, width: '100%', height: '100%' },
  heroGlow: {
    position: 'absolute',
    right: -30,
    bottom: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  floating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 52,
    paddingHorizontal: 18,
  },
  fab: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  body: { paddingTop: 18, paddingHorizontal: 22, flex: 1 },
  title: { fontSize: 19, fontWeight: '800', lineHeight: 24, letterSpacing: -0.2, color: colors.textPrimary },
  source: { flexDirection: 'row', alignItems: 'center', gap: 7, marginVertical: 9 },
  sourceDot: { width: 15, height: 15, borderRadius: 5 },
  favicon: { width: 16, height: 16, borderRadius: 4, backgroundColor: colors.screenBgAlt },
  sourceText: { fontSize: 11.5, fontWeight: '500', color: colors.textTertiary },
  desc: { fontSize: 12.5, lineHeight: 19, color: colors.textSecondary, marginBottom: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 4,
  },
  rowText: { fontSize: 12.8, fontWeight: '600', color: colors.textPrimary },
  sub: { fontSize: 11, fontWeight: '500', color: colors.textTertiary, marginTop: 2 },
});
