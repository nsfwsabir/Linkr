import React, { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import type { Collection, CollectionColorKey, Link } from '../../types';
import { mockCollections, mockLinks, mockCollectionLinks } from '../../utils/mockData';
import { enqueueMutation } from '../../features/sync/queue';
import { extractDomain } from '../../utils/url';

type AddCollectionInput = {
  name: string;
  colorKey?: CollectionColorKey;
  iconKey?: string;
};

type LinksContextValue = {
  links: Link[];
  collections: Collection[];
  collectionCounts: Record<string, number>;
  addLink: (input: { url: string; title?: string; description?: string | null; collectionId?: string }) => void;
  deleteLink: (id: string) => void;
  addCollection: (input: AddCollectionInput) => Collection;
  setLinkCollection: (linkId: string, collectionId: string) => void;
};

const seedLinks: Link[] = [...mockLinks, ...mockCollectionLinks];

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
 */
export function LinksProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<Link[]>(seedLinks);
  const [collections, setCollections] = useState<Collection[]>(mockCollections);
  const collectionCounts = useMemo(() => countByCollection(links), [links]);

  const addLink = useCallback(
    (input: { url: string; title?: string; description?: string | null; collectionId?: string }) => {
      const now = new Date().toISOString();
      const link: Link = {
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        user_id: collections[0]?.user_id ?? mockCollections[0]?.user_id ?? '',
        canonical_url: input.url,
        original_url: input.url,
        title: input.title ?? input.url,
        description: input.description ?? null,
        source_domain: extractDomain(input.url),
        preview_image_url: null,
        metadata_status: 'pending',
        saved_at: 'Just now',
        updated_at: now,
        collection_ids: input.collectionId ? [input.collectionId] : [],
      };
      enqueueMutation('create-link', {
        url: link.original_url,
        title: link.title,
        collectionId: input.collectionId,
      });
      setLinks((prev) => [link, ...prev]);
    },
    [collections],
  );

  const deleteLink = useCallback((id: string) => {
    enqueueMutation('delete-link', { id });
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const addCollection = useCallback((input: AddCollectionInput): Collection => {
    const name = input.name.trim();
    const now = new Date().toISOString();
    const collection: Collection = {
      id: `c-local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      user_id: mockCollections[0]?.user_id ?? '',
      name,
      icon_key: input.iconKey ?? 'folder',
      color_key: input.colorKey ?? 'blue',
      created_at: now,
      updated_at: now,
    };
    enqueueMutation('create-collection', {
      name: collection.name,
      colorKey: collection.color_key,
      iconKey: collection.icon_key,
    });
    setCollections((prev) => [...prev, collection]);
    return collection;
  }, []);

  const setLinkCollection = useCallback((linkId: string, collectionId: string) => {
    enqueueMutation('update-link-collection', { linkId, collectionId });
    setLinks((prev) =>
      prev.map((l) => (l.id === linkId ? { ...l, collection_ids: [collectionId] } : l)),
    );
  }, []);

  const value = useMemo(
    () => ({
      links,
      collections,
      collectionCounts,
      addLink,
      deleteLink,
      addCollection,
      setLinkCollection,
    }),
    [links, collections, collectionCounts, addLink, deleteLink, addCollection, setLinkCollection],
  );

  return <LinksContext.Provider value={value}>{children}</LinksContext.Provider>;
}

export function useLinks() {
  return useContext(LinksContext);
}
