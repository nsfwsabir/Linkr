/**
 * Supabase repository for links, collections and the link_collections join.
 *
 * RLS (migrations/0001_init.sql) derives ownership from auth.uid(), so every
 * write here supplies the signed-in user's id and relies on the `with check`
 * policies rather than trusting anything from the client payload.
 *
 * The schema is the contract: if `supabase/migrations/0001_init.sql` has not
 * been applied yet, PostgREST returns 404/PGRST205 and every call throws —
 * `describeDbError` turns that into an actionable message instead of a silent
 * no-op, so a failed save is never mistaken for a successful one.
 */
import { requireSupabase } from './client';
import type { Collection, CollectionColorKey, Link } from '../../types';
import { extractDomain, normalizeUrl } from '../../utils/url';

type LinkRow = {
  id: string;
  user_id: string;
  canonical_url: string;
  original_url: string;
  title: string;
  description: string | null;
  source_domain: string;
  preview_image_url: string | null;
  metadata_status: Link['metadata_status'];
  saved_at: string;
  updated_at: string;
  link_collections?: { collection_id: string }[] | null;
};

type CollectionRow = Omit<Collection, 'link_count'>;

export type RemoteData = { links: Link[]; collections: Collection[] };

/** Seeded once per user so a brand-new account isn't an empty Collections tab. */
const DEFAULT_COLLECTIONS: { name: string; icon_key: string; color_key: CollectionColorKey }[] = [
  { name: 'Read Later', icon_key: 'heart', color_key: 'pink' },
  { name: 'Work', icon_key: 'briefcase', color_key: 'blue' },
  { name: 'Personal', icon_key: 'user', color_key: 'teal' },
  { name: 'Inspiration', icon_key: 'sparkles', color_key: 'orange' },
  { name: 'Tools', icon_key: 'box', color_key: 'blue' },
];

const LINK_SELECT = '*, link_collections(collection_id)';

function toLink(row: LinkRow): Link {
  return {
    id: row.id,
    user_id: row.user_id,
    canonical_url: row.canonical_url,
    original_url: row.original_url,
    title: row.title,
    description: row.description,
    source_domain: row.source_domain,
    preview_image_url: row.preview_image_url,
    metadata_status: row.metadata_status,
    // Real creation time from Postgres (saved_at defaults to now()).
    saved_at: row.saved_at,
    updated_at: row.updated_at,
    collection_ids: (row.link_collections ?? []).map((lc) => lc.collection_id),
  };
}

/** Turn a PostgREST/Postgres failure into something a user can act on. */
export function describeDbError(err: unknown): string {
  const e = err as { code?: string; message?: string; details?: string } | null;
  const code = e?.code ?? '';
  const message = e?.message ?? 'Unexpected database error.';
  if (code === '42P01' || code === 'PGRST205' || /schema cache/i.test(message)) {
    return 'Database tables are missing. Apply supabase/migrations/0001_init.sql, then reload.';
  }
  if (code === '23505') {
    return 'That link is already saved.';
  }
  if (code === '42501') {
    return 'Not authorised for this account.';
  }
  if (/network request failed|failed to fetch/i.test(message)) {
    return 'Could not reach the database. Check your connection and try again.';
  }
  return message;
}

async function seedDefaultCollections(userId: string): Promise<Collection[]> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('collections')
    .insert(DEFAULT_COLLECTIONS.map((c) => ({ ...c, user_id: userId })))
    .select();
  if (error) throw error;
  return (data ?? []) as Collection[];
}

/** Load the user's links (with memberships) and collections in one round trip. */
export async function fetchRemoteData(userId: string): Promise<RemoteData> {
  const sb = requireSupabase();
  const [linksRes, collectionsRes] = await Promise.all([
    sb
      .from('links')
      .select(LINK_SELECT)
      .eq('user_id', userId)
      .order('saved_at', { ascending: false }),
    sb
      .from('collections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true }),
  ]);
  if (linksRes.error) throw linksRes.error;
  if (collectionsRes.error) throw collectionsRes.error;

  let collections = (collectionsRes.data ?? []) as Collection[];
  if (collections.length === 0) {
    collections = await seedDefaultCollections(userId);
  }
  return { links: ((linksRes.data ?? []) as LinkRow[]).map(toLink), collections };
}

export type NewLinkInput = {
  url: string;
  title?: string;
  description?: string | null;
  collectionId?: string;
};

/**
 * Insert the link, then its first collection membership. `saved_at` is left to
 * the Postgres default so the stored creation time is server-authoritative.
 */
export async function createLinkRow(userId: string, input: NewLinkInput): Promise<Link> {
  const sb = requireSupabase();
  const url = normalizeUrl(input.url);
  const { data, error } = await sb
    .from('links')
    .insert({
      user_id: userId,
      canonical_url: url,
      original_url: url,
      title: input.title?.trim() || url,
      description: input.description ?? null,
      source_domain: extractDomain(url),
      preview_image_url: null,
      metadata_status: 'pending',
    })
    .select(LINK_SELECT)
    .single();
  if (error) throw error;

  const row = data as LinkRow;
  if (input.collectionId) {
    const { error: joinError } = await sb
      .from('link_collections')
      .insert({ link_id: row.id, collection_id: input.collectionId });
    if (joinError) throw joinError;
    row.link_collections = [{ collection_id: input.collectionId }];
  }
  return toLink(row);
}

/** The UI models one collection per link, so this replaces the membership set. */
export async function replaceLinkCollection(linkId: string, collectionId: string): Promise<void> {
  const sb = requireSupabase();
  const { error: clearError } = await sb
    .from('link_collections')
    .delete()
    .eq('link_id', linkId);
  if (clearError) throw clearError;
  const { error: insertError } = await sb
    .from('link_collections')
    .insert({ link_id: linkId, collection_id: collectionId });
  if (insertError) throw insertError;
}

/** Cascades to link_collections via the FK. */
export async function deleteLinkRow(linkId: string): Promise<void> {
  const sb = requireSupabase();
  const { error } = await sb.from('links').delete().eq('id', linkId);
  if (error) throw error;
}

export async function createCollectionRow(
  userId: string,
  input: { name: string; icon_key: string; color_key: CollectionColorKey },
): Promise<Collection> {
  const sb = requireSupabase();
  const { data, error } = await sb
    .from('collections')
    .insert({ user_id: userId, name: input.name, icon_key: input.icon_key, color_key: input.color_key })
    .select()
    .single();
  if (error) throw error;
  return data as Collection;
}

export type { CollectionRow };
