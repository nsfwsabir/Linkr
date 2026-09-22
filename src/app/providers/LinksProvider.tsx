import React, { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import type { Collection, Link } from '../../types';
import { mockLinks, mockCollectionLinks, mockCollections, mockUser } from '../../utils/mockData';
import { enqueueMutation } from '../../features/sync/queue';

type LinksContextValue = {
  links: Link[];
  collections: Collection[];
  /** Live per-collection link counts derived from the unified links pool. */
  collectionCounts: Record<string, number>;
  deleteLink: (id: string) => void;
  addLink: (input: {
    url: string;
    title?: string;
    description?: string | null;
    collectionId?: string;
    sourceDomain?: string;
    previewImageUrl?: string | null;
  }) => Link;
};

const seedLinks: Link[] = [...mockLinks, ...mockCollectionLinks];

const LinksContext = createContext<LinksContextValue>({
  links: seedLinks,
  collections: mockCollections,
  collectionCounts: {},
  deleteLink: () => {},
  addLink: () => {
    throw new Error('addLink unavailable outside LinksProvider');
  },
});

function countByCollection(links: Link[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const link of links) {
    for (const id of link.collection_ids ?? []) {
      counts[id] = (counts[id] ?? 0) + 1;
    }
  }
  return counts;
}

/**
 * Shared link + collection state. Every mutation is enqueued with a
 * client-generated op id for later sync (TRD §8).
 */
export function LinksProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<Link[]>(seedLinks);
  const [collections] = useState<Collection[]>(mockCollections);

  const collectionCounts = useMemo(() => countByCollection(links), [links]);

  const deleteLink = useCallback((id: string) => {
    enqueueMutation('delete-link', { id });
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const addLink = useCallback<LinksContextValue['addLink']>(
    ({ url, title, description, collectionId, sourceDomain, previewImageUrl }) => {
      const normalized = url.trim();
      enqueueMutation('create-link', { url: normalized, collectionId });
      const link: Link = {
        id: `l-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        user_id: mockUser.id,
        canonical_url: normalized,
        original_url: normalized,
        title: title?.trim() || sourceDomain || normalized,
        description: description ?? null,
        source_domain: sourceDomain ?? '',
        preview_image_url: previewImageUrl ?? null,
        metadata_status: 'pending',
        saved_at: 'Just now',
        updated_at: new Date().toISOString(),
        collection_ids: collectionId ? [collectionId] : [],
      };
      setLinks((prev) => [link, ...prev]);
      return link;
    },
    [],
  );

  const value = useMemo(
    () => ({ links, collections, collectionCounts, deleteLink, addLink }),
    [links, collections, collectionCounts, deleteLink, addLink],
  );

  return <LinksContext.Provider value={value}>{children}</LinksContext.Provider>;
}

export function useLinks() {
  return useContext(LinksContext);
}
