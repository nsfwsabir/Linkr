type LooseNav = {
  navigate: (name: string, params?: object) => void;
  getParent?: () => LooseNav | null;
  getState: () => { routes?: Array<{ name: string }> };
};

function stateRoutes(nav: LooseNav): string[] {
  try {
    const state = nav.getState();
    return (state?.routes ?? []).map((r) => r.name);
  } catch {
    return [];
  }
}

/**
 * Push LinkDetail on whichever ancestor stack actually owns that route.
 * Tab→stack bubbling can miss under CompositeScreenProps; walk parents first.
 */
export function openLinkDetail(navigation: unknown, linkId: string): void {
  const start = navigation as LooseNav;
  let nav = start;
  for (let depth = 0; depth < 5; depth += 1) {
    if (stateRoutes(nav).includes('LinkDetail')) {
      nav.navigate('LinkDetail', { linkId });
      return;
    }
    const parent = nav.getParent?.();
    if (!parent) break;
    nav = parent;
  }
  start.navigate('LinkDetail', { linkId });
}
