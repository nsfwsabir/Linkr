import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Linking, Alert, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/navigation/RootNavigator';
import { PrimaryButton, OutlineButton } from '../../components/Buttons';
import { Icon } from '../../components/Icon';
import { BottomSheet } from '../../components/BottomSheet';
import { useLinkPreview } from './useLinkPreview';
import { faviconUrl } from '../../utils/url';
import { useLinks } from '../../app/providers/LinksProvider';
import { useTheme } from '../../app/providers/ThemeProvider';
import { useRefScale } from '../../utils/useRefScale';
import { colors, themesFor } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'LinkDetail'>;

export function LinkDetailScreen({ route, navigation }: Props) {
  const v = useRefScale();
  const { links, collections, deleteLink, setLinkCollection } = useLinks();
  const { c, dark } = useTheme();
  // Same translucent glass as BottomNav pill (blur on iOS; solid rgba on Android).
  const glassBg = {
    borderRadius: 999,
    backgroundColor: dark ? 'rgba(30,33,38,0.92)' : 'rgba(255,255,255,0.96)',
    borderColor: dark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.9)',
  } as const;
  // Params can be missing if the native stack restores state oddly — never throw.
  const linkId = route.params?.linkId;
  const link = linkId ? links.find((l) => l.id === linkId) : undefined;

  const collection = useMemo(() => {
    const collectionId = link?.collection_ids?.[0];
    if (!collectionId) return collections[0];
    return collections.find((col) => col.id === collectionId) ?? collections[0];
  }, [collections, link]);

  // Preview fetch is async and cached — safe during first paint; no deferred
  // setState after the push (that re-render was hitching the transition).
  const { metadata } = useLinkPreview(link?.original_url ?? '');
  const [faviconFailed, setFaviconFailed] = useState(false);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [collectionPickerVisible, setCollectionPickerVisible] = useState(false);

  useEffect(() => {
    setFaviconFailed(false);
  }, [link?.id]);

  if (!linkId || !link) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={[styles.container, { backgroundColor: c.screenBg }]}>
        <Text style={[styles.emptyFallback, { color: c.textSecondary }]}>
          {linkId ? 'Link not found.' : 'This link is no longer available.'}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => navigation.goBack()}
          style={[styles.emptyBack, { marginTop: v(16), borderColor: c.border, backgroundColor: c.cardBg }]}
        >
          <Text style={[styles.emptyBackText, { fontSize: v(13.5), color: c.textPrimary }]}>Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const openLink = async () => {
    try {
      const supported = await Linking.canOpenURL(link.original_url);
      if (supported) await Linking.openURL(link.original_url);
      else Alert.alert('Cannot open link', link.original_url);
    } catch {
      Alert.alert('Cannot open link', link.original_url);
    }
  };

  const bannerUri = link.preview_image_url ?? metadata?.preview_image_url ?? null;
  const iconUri = faviconFailed ? null : faviconUrl(link.source_domain);
  const description = link.description ?? metadata?.description ?? '';
  const fab = v(32);
  const theme = themesFor(c);

  const closeActions = () => {
    setActionsVisible(false);
    setConfirming(false);
  };

  const handleDelete = () => {
    deleteLink(link.id);
    closeActions();
    navigation.goBack();
  };

  const pickCollection = (collectionId: string) => {
    setLinkCollection(link.id, collectionId);
    setCollectionPickerVisible(false);
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.container, { backgroundColor: c.screenBg }]}>
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
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.fab,
              { width: fab, height: fab, borderRadius: fab / 2, opacity: pressed ? 0.75 : 1 },
            ]}
          >
            {/* Glass FAB matches BottomNav translucency: blur on iOS, solid rgba on Android. */}
            {Platform.OS === 'ios' ? (
              <BlurView
                intensity={dark ? 45 : 65}
                tint={dark ? 'dark' : 'light'}
                experimentalBlurMethod="dimezisBlurView"
                style={[styles.fabGlass, glassBg]}
              >
                <Icon name="arrowLeft" size={v(17)} color={dark ? '#eef0f4' : colors.textPrimary} />
              </BlurView>
            ) : (
              <View style={[styles.fabGlass, glassBg]}>
                <Icon name="arrowLeft" size={v(17)} color={dark ? '#eef0f4' : colors.textPrimary} />
              </View>
            )}
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="More actions"
            onPress={() => setActionsVisible(true)}
            style={({ pressed }) => [
              styles.fab,
              { width: fab, height: fab, borderRadius: fab / 2, opacity: pressed ? 0.75 : 1 },
            ]}
          >
            {Platform.OS === 'ios' ? (
              <BlurView
                intensity={dark ? 45 : 65}
                tint={dark ? 'dark' : 'light'}
                experimentalBlurMethod="dimezisBlurView"
                style={[styles.fabGlass, glassBg]}
              >
                <Icon name="dots" size={v(17)} color={dark ? '#eef0f4' : colors.textPrimary} />
              </BlurView>
            ) : (
              <View style={[styles.fabGlass, glassBg]}>
                <Icon name="dots" size={v(17)} color={dark ? '#eef0f4' : colors.textPrimary} />
              </View>
            )}
          </Pressable>
        </View>
      </LinearGradient>
      <View style={[styles.body, { paddingTop: v(18), paddingHorizontal: v(22) }]}>
        <Text
          style={[
            styles.title,
            { fontSize: v(19), lineHeight: v(24), letterSpacing: v(-0.2), color: c.textPrimary },
          ]}
        >
          {link.title}
        </Text>
        <View style={[styles.source, { gap: v(7), marginVertical: v(9) }]}>
          {iconUri ? (
            <Image
              source={{ uri: iconUri }}
              style={[styles.favicon, { width: v(16), height: v(16), borderRadius: v(4), backgroundColor: c.screenBgAlt }]}
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
          <Text style={[styles.sourceText, { fontSize: v(11.5), color: c.textTertiary }]}>
            {link.source_domain}
          </Text>
        </View>
        {description ? (
          <Text
            style={[
              styles.desc,
              { fontSize: v(12.5), lineHeight: v(19), marginBottom: v(12), color: c.textSecondary },
            ]}
          >
            {description}
          </Text>
        ) : null}
        <PrimaryButton title="Open Link" icon="external" onPress={openLink} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add to collection"
          onPress={() => setCollectionPickerVisible(true)}
          style={[
            styles.row,
            { paddingVertical: v(11), marginTop: v(4), borderTopColor: c.border },
          ]}
        >
          <Text style={[styles.rowText, { fontSize: v(12.8), color: c.textPrimary }]}>
            Add to collection
          </Text>
          <Icon name="chevronRight" size={v(15)} color={c.textTertiary} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change collection"
          onPress={() => setCollectionPickerVisible(true)}
          style={[
            styles.row,
            { paddingVertical: v(11), marginTop: v(4), borderTopColor: c.border },
          ]}
        >
          <View>
            <Text style={[styles.rowText, { fontSize: v(12.8), color: c.textPrimary }]}>Saved</Text>
            <Text style={[styles.sub, { fontSize: v(11), marginTop: v(2), color: c.textTertiary }]}>
              {link.saved_at}
              {collection ? ` · ${collection.name}` : ''}
            </Text>
          </View>
          <Icon name="chevronRight" size={v(15)} color={c.textTertiary} />
        </Pressable>
      </View>

      {collectionPickerVisible ? (
        <BottomSheet
          visible
          title="Add to collection"
          onClose={() => setCollectionPickerVisible(false)}
        >
          {collections.map((col) => {
            const selected = col.id === collection?.id;
            const t = theme[col.color_key];
            return (
              <Pressable
                key={col.id}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={col.name}
                onPress={() => pickCollection(col.id)}
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
                <View style={[styles.pickIcon, { backgroundColor: t.bg, width: v(32), height: v(32), borderRadius: v(10) }]}>
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
      ) : null}

      {actionsVisible ? (
        <BottomSheet
          visible
          title={confirming ? 'Delete link?' : 'Link actions'}
          onClose={closeActions}
        >
          {confirming ? (
            <View>
              <Text
                style={[
                  styles.confirmText,
                  { fontSize: v(13), lineHeight: v(20), marginBottom: v(16), color: c.textSecondary },
                ]}
              >
                “{link.title}” will be removed from your saved links. This cannot be undone.
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Confirm delete link"
                onPress={handleDelete}
                style={[
                  styles.destructive,
                  {
                    height: v(46),
                    borderRadius: v(14),
                    marginBottom: v(10),
                    backgroundColor: c.signoutBg,
                  },
                ]}
              >
                <Text style={[styles.destructiveText, { fontSize: v(13.5), color: c.signoutText }]}>
                  Delete
                </Text>
              </Pressable>
              <OutlineButton title="Cancel" onPress={() => setConfirming(false)} />
            </View>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Delete link"
              onPress={() => setConfirming(true)}
              style={[
                styles.deleteRow,
                {
                  gap: v(10),
                  height: v(46),
                  borderRadius: v(14),
                  paddingHorizontal: v(14),
                  backgroundColor: c.signoutBg,
                },
              ]}
            >
              <Icon name="trash" size={v(16)} color={c.signoutText} />
              <Text style={[styles.deleteRowText, { fontSize: v(13.5), color: c.signoutText }]}>
                Delete link
              </Text>
            </Pressable>
          )}
        </BottomSheet>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { overflow: 'hidden' },
  heroImage: { position: 'absolute', inset: 0, width: '100%', height: '100%' },
  heroGlow: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.14)' },
  floating: { flexDirection: 'row', justifyContent: 'space-between' },
  fab: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  fabGlass: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  body: { flex: 1 },
  title: { fontWeight: '800' },
  source: { flexDirection: 'row', alignItems: 'center' },
  sourceDot: {},
  favicon: {},
  sourceText: { fontWeight: '500' },
  desc: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
  },
  rowText: { fontWeight: '600' },
  sub: { fontWeight: '500' },
  pickRow: { flexDirection: 'row', alignItems: 'center' },
  pickIcon: { alignItems: 'center', justifyContent: 'center' },
  pickName: { fontWeight: '700' },
  confirmText: {},
  deleteRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteRowText: { fontWeight: '700' },
  destructive: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  destructiveText: { fontWeight: '700' },
  emptyFallback: { marginTop: 40, textAlign: 'center', fontSize: 13 },
  emptyBack: {
    alignSelf: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  emptyBackText: { fontWeight: '700' },
});
