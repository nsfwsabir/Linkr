import React, { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import type { Collection, Link } from '../../types';
import { mockCollections, mockLinks, mockCollectionLinks } from '../../utils/mockData';
import { enqueueMutation } from '../../features/sync/queue';
import { extractDomain } from '../../utils/url';

type LinksContextValue = {
  links: Link[];
  collections: Collection[];
  collectionCounts: Record<string, number>;
  addLink: (input: { url: string; title?: string; description?: string | null; collectionId?: string }) => void;
  deleteLink: (id: string) => void;
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
});

/**
 * Shared link + collection state so Home filters, Collection View, Link Detail,
 * and Save Link all read from the same source. Counts are derived from links.
 */
export function LinksProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<Link[]>(seedLinks);
  const collectionCounts = useMemo(() => countByCollection(links), [links]);

  const addLink = useCallback(
    (input: { url: string; title?: string; description?: string | null; collectionId?: string }) => {
      const now = new Date().toISOString();
      const link: Link = {
        id: `local-${Date.now()}`,
        user_id: mockCollections[0]?.user_id ?? '',
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
    [],
  );

  const deleteLink = useCallback((id: string) => {
    enqueueMutation('delete-link', { id });
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const value = useMemo(
    () => ({ links, collections: mockCollections, collectionCounts, addLink, deleteLink }),
    [links, collectionCounts, addLink, deleteLink],
  );

  return <LinksContext.Provider value={value}>{children}</LinksContext.Provider>;
}

export function useLinks() {
  return useContext(LinksContext);
}
