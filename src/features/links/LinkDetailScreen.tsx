import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Linking, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
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
import { colors } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'LinkDetail'>;

export function LinkDetailScreen({ route, navigation }: Props) {
  const v = useRefScale();
  const { links, collections, deleteLink } = useLinks();
  const { c } = useTheme();
  const link = links.find((l) => l.id === route.params.linkId);
  const collection = link
    ? collections.find((col) => link.collection_ids?.includes(col.id))
    : undefined;
  const { metadata } = useLinkPreview(link.original_url);
  const [faviconFailed, setFaviconFailed] = useState(false);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    setFaviconFailed(false);
  }, [link.id]);

  const bannerUri = link.preview_image_url ?? metadata?.preview_image_url ?? null;
  const iconUri = faviconFailed ? null : faviconUrl(link.source_domain);
  const description = link.description ?? metadata?.description ?? '';
  const fab = v(32);

  const closeActions = () => {
    setActionsVisible(false);
    setConfirming(false);
  };

  const handleDelete = () => {
    deleteLink(link.id);
    closeActions();
    navigation.goBack();
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
            style={[styles.fab, { width: fab, height: fab, borderRadius: fab / 2 }]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => navigation.goBack()}
          >
            {/* FAB stays white in both themes; icon uses static light-theme ink. */}
            <Icon name="arrowLeft" size={v(17)} color={colors.textPrimary} />
          </Pressable>
          <Pressable
            style={[styles.fab, { width: fab, height: fab, borderRadius: fab / 2 }]}
            accessibilityRole="button"
            accessibilityLabel="More actions"
            onPress={() => setActionsVisible(true)}
          >
            <Icon name="dots" size={v(17)} color={colors.textPrimary} />
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
        <View
          style={[
            styles.row,
            { paddingVertical: v(11), marginTop: v(4), borderTopColor: c.border },
          ]}
        >
          <Text style={[styles.rowText, { fontSize: v(12.8), color: c.textPrimary }]}>
            Add to collection
          </Text>
          <Icon name="chevronRight" size={v(15)} color={c.textTertiary} />
        </View>
        <View
          style={[
            styles.row,
            { paddingVertical: v(11), marginTop: v(4), borderTopColor: c.border },
          ]}
        >
          <View>
            <Text style={[styles.rowText, { fontSize: v(12.8), color: c.textPrimary }]}>Saved</Text>
            <Text style={[styles.sub, { fontSize: v(11), marginTop: v(2), color: c.textTertiary }]}>
              {link.saved_at}{collection ? ` · ${collection.name}` : ''}
            </Text>
          </View>
          <Icon name="chevronRight" size={v(15)} color={c.textTertiary} />
        </View>
      </View>

      <BottomSheet
        visible={actionsVisible}
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
  container: { flex: 1 },
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
});
