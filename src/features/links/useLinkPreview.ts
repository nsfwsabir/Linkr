import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase/client';
import { fetchLinkMetadata } from '../../lib/supabase/auth';
import type { LinkMetadata } from '../../types';

export type PreviewStatus = 'idle' | 'loading' | 'ready' | 'unavailable';

const cache = new Map<string, LinkMetadata | null>();

/**
 * Live link preview via the fetch-link-metadata Edge Function.
 * Results are cached per URL; falls back to unavailable when the
 * backend is not configured or the fetch fails (save still works).
 */
export function useLinkPreview(url: string) {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(() => cache.get(url) ?? null);
  const [status, setStatus] = useState<PreviewStatus>(() => {
    if (!cache.has(url)) return 'idle';
    return cache.get(url) ? 'ready' : 'unavailable';
  });

  useEffect(() => {
    if (cache.has(url)) return;
    if (!supabase) {
      setStatus('unavailable');
      return;
    }
    let live = true;
    setStatus('loading');
    fetchLinkMetadata(url)
      .then((m) => {
        cache.set(url, m);
        if (live) {
          setMetadata(m);
          setStatus('ready');
        }
      })
      .catch(() => {
        cache.set(url, null);
        if (live) setStatus('unavailable');
      });
    return () => {
      live = false;
    };
  }, [url]);

  return { metadata, status };
}
