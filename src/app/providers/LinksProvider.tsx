import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import type { Collection, CollectionColorKey, Link } from '../../types';
import { mockCollections, mockLinks, mockCollectionLinks, mockUser } from '../../utils/mockData';
import { enqueueMutation } from '../../features/sync/queue';
import { extractDomain, normalizeUrl } from '../../utils/url';
import {
  createCollectionRow,
  createLinkRow,
  deleteLinkRow,
  describeDbError,
  fetchRemoteData,
  replaceLinkCollection,
} from '../../lib/supabase/links';
import { useAuth } from './AuthProvider';

type AddCollectionInput = {
  name: string;
  colorKey?: CollectionColorKey;
  iconKey?: string;
};

type LinksContextValue = {
  links: Link[];
  collections: Collection[];
  collectionCounts: Record<string, number>;
  /** True while the first remote read is in flight. */
  loading: boolean;
  /** Set when a read or write failed; a failed save is never silent. */
  syncError: string | null;
  dismissSyncError: () => void;
  /** True when reads/writes go to Supabase rather than the in-memory mock. */
  isRemote: boolean;
  addLink: (input: { url: string; title?: string; description?: string | null; collectionId?: string }) => void;
  deleteLink: (id: string) => void;
  addCollection: (input: AddCollectionInput) => Collection;
  setLinkCollection: (linkId: string, collectionId: string) => void;
};

const seedLinks: Link[] = [...mockLinks, ...mockCollectionLinks];
const LOCAL_ID = /^(local|c-local)-/;

function countByCollection(links: Link[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const link of links) {
    for (const id of link.collection_ids ?? []) {
      counts[id] = (counts[id] ?? 0) + 1;
    }
  }
  return counts;
}

const LinksContext = createContext<LinksContextValue>({
  links: seedLinks,
  collections: mockCollections,
  collectionCounts: {},
  loading: false,
  syncError: null,
  dismissSyncError: () => {},
  isRemote: false,
  addLink: () => {},
  deleteLink: () => {},
  addCollection: () => {
    throw new Error('addCollection outside LinksProvider');
  },
  setLinkCollection: () => {},
});

/**
 * Shared link + collection state so Home filters, Collection View, Link Detail,
 * and Save Link all read from the same source. Counts are derived from links.
 *
 * With Supabase configured and a real signed-in user this is a thin optimistic
 * cache over Postgres: writes land in the DB and the local row is swapped for
 * the server row (which carries the authoritative `saved_at`). Without a backend
 * it falls back to the mock seed so the UI stays explorable.
 */
export function LinksProvider({ children }: { children: ReactNode }) {
  const { user, isConfigured } = useAuth();
  const [links, setLinks] = useState<Link[]>(seedLinks);
  const [collections, setCollections] = useState<Collection[]>(mockCollections);
  const [loading, setLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // The mock session carries a sentinel id; treat it as "no backend".
  const rawId = user?.id;
  const userId = rawId && rawId !== mockUser.id ? rawId : null;
  const isRemote = isConfigured && Boolean(userId);
  const collectionCounts = useMemo(() => countByCollection(links), [links]);

  useEffect(() => {
    if (!isRemote || !userId) {
      setLinks(seedLinks);
      setCollections(mockCollections);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchRemoteData(userId)
      .then((data) => {
        if (cancelled) return;
        setLinks(data.links);
        setCollections(data.collections);
        setSyncError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        // Keep the seed rows visible so the app stays usable, but say why.
        setSyncError(describeDbError(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isRemote, userId]);

  const addLink = useCallback(
    (input: { url: string; title?: string; description?: string | null; collectionId?: string }) => {
      const now = new Date().toISOString();
      const tempId = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const url = normalizeUrl(input.url);
      const optimistic: Link = {
        id: tempId,
        user_id: userId ?? mockUser.id,
        canonical_url: url,
        original_url: url,
        title: input.title?.trim() || url,
        description: input.description ?? null,
        source_domain: extractDomain(url),
        preview_image_url: null,
        metadata_status: 'pending',
        // Real creation time, not a canned label; Postgres will own it on save.
        saved_at: now,
        updated_at: now,
        collection_ids: input.collectionId ? [input.collectionId] : [],
      };
      setLinks((prev) => [optimistic, ...prev]);

      if (!isRemote || !userId) {
        enqueueMutation('create-link', {
          url: optimistic.original_url,
          title: optimistic.title,
          collectionId: input.collectionId,
        });
        return;
      }
      createLinkRow(userId, {
        url,
        title: optimistic.title,
        description: optimistic.description,
        collectionId: input.collectionId,
      })
        .then((saved) => {
          setLinks((prev) => prev.map((l) => (l.id === tempId ? saved : l)));
          setSyncError(null);
        })
        .catch((err) => {
          setLinks((prev) => prev.filter((l) => l.id !== tempId));
          setSyncError(describeDbError(err));
        });
    },
    [isRemote, userId],
  );

  const deleteLink = useCallback(
    (id: string) => {
      const removed = links.find((l) => l.id === id);
      setLinks((prev) => prev.filter((l) => l.id !== id));

      if (!isRemote || !userId || LOCAL_ID.test(id)) {
        enqueueMutation('delete-link', { id });
        return;
      }
      deleteLinkRow(id)
        .then(() => setSyncError(null))
        .catch((err) => {
          if (removed) setLinks((prev) => [removed, ...prev]);
          setSyncError(describeDbError(err));
        });
    },
    [isRemote, userId, links],
  );

  const addCollection = useCallback(
    (input: AddCollectionInput): Collection => {
      const now = new Date().toISOString();
      const optimistic: Collection = {
        id: `c-local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        user_id: userId ?? mockUser.id,
        name: input.name.trim(),
        icon_key: input.iconKey ?? 'folder',
        color_key: input.colorKey ?? 'blue',
        created_at: now,
        updated_at: now,
      };
      setCollections((prev) => [...prev, optimistic]);

      if (!isRemote || !userId) {
        enqueueMutation('create-collection', {
          name: optimistic.name,
          colorKey: optimistic.color_key,
          iconKey: optimistic.icon_key,
        });
        return optimistic;
      }
      createCollectionRow(userId, {
        name: optimistic.name,
        icon_key: optimistic.icon_key,
        color_key: optimistic.color_key,
      })
        .then((saved) => {
          setCollections((prev) => prev.map((c) => (c.id === optimistic.id ? saved : c)));
          setSyncError(null);
        })
        .catch((err) => {
          setCollections((prev) => prev.filter((c) => c.id !== optimistic.id));
          setSyncError(describeDbError(err));
        });
      return optimistic;
    },
    [isRemote, userId],
  );

  const setLinkCollection = useCallback(
    (linkId: string, collectionId: string) => {
      const previous = links.find((l) => l.id === linkId);
      setLinks((prev) =>
        prev.map((l) => (l.id === linkId ? { ...l, collection_ids: [collectionId] } : l)),
      );

      if (!isRemote || !userId || LOCAL_ID.test(linkId)) {
        enqueueMutation('update-link-collection', { linkId, collectionId });
        return;
      }
      replaceLinkCollection(linkId, collectionId)
        .then(() => setSyncError(null))
        .catch((err) => {
          if (previous) {
            setLinks((prev) => prev.map((l) => (l.id === linkId ? previous : l)));
          }
          setSyncError(describeDbError(err));
        });
    },
    [isRemote, userId, links],
  );

  const value = useMemo(
    () => ({
      links,
      collections,
      collectionCounts,
      loading,
      syncError,
      dismissSyncError: () => setSyncError(null),
      isRemote,
      addLink,
      deleteLink,
      addCollection,
      setLinkCollection,
    }),
    [
      links,
      collections,
      collectionCounts,
      loading,
      syncError,
      isRemote,
      addLink,
      deleteLink,
      addCollection,
      setLinkCollection,
    ],
  );

  return <LinksContext.Provider value={value}>{children}</LinksContext.Provider>;
}

export function useLinks() {
  return useContext(LinksContext);
}
