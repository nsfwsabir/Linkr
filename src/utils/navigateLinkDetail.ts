type LooseNav = {
  navigate: (name: string, params?: object) => void;
};

/**
 * Push LinkDetail via plain navigate — bubbles tab → root stack the same
 * way CollectionView already does. Avoid walking getParent/routeNames,
 * which can target the wrong navigator under CompositeScreenProps.
 */
export function openLinkDetail(navigation: unknown, linkId: string): void {
  (navigation as LooseNav).navigate('LinkDetail', { linkId });
}
