import React, { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import type { Collection, Link } from '../../types';
import { mockCollections, mockLinks, mockCollectionLinks, mockUser } from '../../utils/mockData';
import { enqueueMutation } from '../../features/sync/queue';

type AddLinkInput = {
  url: string;
  title: string;
  description?: string | null;
  collectionId?: string;
};

type LinksContextValue = {
  links: Link[];
  collections: Collection[];
  collectionCounts: Record<string, number>;
  deleteLink: (id: string) => void;
  addLink: (input: AddLinkInput) => void;
};

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
  links: mockLinks,
  collections: mockCollections,
  collectionCounts: countByCollection([...mockLinks, ...mockCollectionLinks]),
  deleteLink: () => {},
  addLink: () => {},
});

/**
 * Shared link/collection state so Home, Collection View, and Link Detail
 * stay in sync. Mutations enqueue with a client-generated op id (TRD §8).
 */
export function LinksProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<Link[]>(() => [...mockLinks, ...mockCollectionLinks]);
  const [collections] = useState<Collection[]>(mockCollections);

  const deleteLink = useCallback((id: string) => {
    enqueueMutation('delete-link', { id });
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const addLink = useCallback((input: AddLinkInput) => {
    const collectionId = input.collectionId ?? collections[0]?.id;
    const now = new Date().toISOString();
    const link: Link = {
      id: `l-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      user_id: mockUser.id,
      canonical_url: input.url,
      original_url: input.url,
      title: input.title,
      description: input.description ?? null,
      source_domain: (() => {
        try {
          return new URL(input.url).hostname.replace(/^www\./, '');
        } catch {
          return '';
        }
      })(),
      preview_image_url: null,
      metadata_status: 'ready',
      saved_at: 'Just now',
      updated_at: now,
      collection_ids: collectionId ? [collectionId] : [],
    };
    enqueueMutation('create-link', { id: link.id, url: link.original_url, collection_ids: link.collection_ids });
    setLinks((prev) => [link, ...prev]);
  }, [collections]);

  const collectionCounts = useMemo(() => countByCollection(links), [links]);

  const value = useMemo(
    () => ({ links, collections, collectionCounts, deleteLink, addLink }),
    [links, collections, collectionCounts, deleteLink, addLink],
  );

  return <LinksContext.Provider value={value}>{children}</LinksContext.Provider>;
}

export function useLinks() {
  return useContext(LinksContext);
}
