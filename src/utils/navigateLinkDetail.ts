type LooseNav = {
  navigate: (name: string, params?: object) => void;
  getParent?: () => LooseNav | null;
  getState: () => { routes?: Array<{ name: string }>; routeNames?: string[] };
};

function canHandleLinkDetail(nav: LooseNav): boolean {
  try {
    const state = nav.getState();
    // routeNames = every registered screen; routes = only what's currently
    // on the stack (LinkDetail is absent until after the first successful push).
    const names = state.routeNames ?? (state.routes ?? []).map((r) => r.name);
    return names.includes('LinkDetail');
  } catch {
    return false;
  }
}

/**
 * Push LinkDetail on whichever ancestor stack actually owns that route.
 * Prefer routeNames over active routes so a never-opened screen still matches.
 */
export function openLinkDetail(navigation: unknown, linkId: string): void {
  const start = navigation as LooseNav;
  let nav = start;
  for (let depth = 0; depth < 5; depth += 1) {
    if (canHandleLinkDetail(nav)) {
      nav.navigate('LinkDetail', { linkId });
      return;
    }
    const parent = nav.getParent?.();
    if (!parent) break;
    nav = parent;
  }
  start.navigate('LinkDetail', { linkId });
}
