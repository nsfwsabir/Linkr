import React, { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import type { Link } from '../../types';
import { mockLinks, mockCollectionLinks } from '../../utils/mockData';
import { enqueueMutation } from '../../features/sync/queue';

type LinksContextValue = {
  links: Link[];
  collectionLinks: Link[];
  deleteLink: (id: string) => void;
};

const LinksContext = createContext<LinksContextValue>({
  links: mockLinks,
  collectionLinks: mockCollectionLinks,
  deleteLink: () => {},
});

/**
 * Shared link state so deletions reflect across Home, Search, Collection View,
 * and Link Detail. Mirrors TRD §8: every mutation is enqueued with a
 * client-generated op id for later sync.
 */
export function LinksProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<Link[]>(mockLinks);
  const [collectionLinks, setCollectionLinks] = useState<Link[]>(mockCollectionLinks);

  const deleteLink = useCallback((id: string) => {
    enqueueMutation('delete-link', { id });
    setLinks((prev) => prev.filter((l) => l.id !== id));
    setCollectionLinks((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const value = useMemo(
    () => ({ links, collectionLinks, deleteLink }),
    [links, collectionLinks, deleteLink],
  );

  return <LinksContext.Provider value={value}>{children}</LinksContext.Provider>;
}

export function useLinks() {
  return useContext(LinksContext);
}
