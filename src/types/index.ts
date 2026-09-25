export type UUID = string;

export type CollectionColorKey = 'pink' | 'blue' | 'teal' | 'orange';

export interface Collection {
  id: UUID;
  user_id: UUID;
  name: string;
  icon_key: string;
  color_key: CollectionColorKey;
  link_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Link {
  id: UUID;
  user_id: UUID;
  canonical_url: string;
  original_url: string;
  title: string;
  description: string | null;
  source_domain: string;
  preview_image_url: string | null;
  metadata_status: 'pending' | 'ready' | 'unavailable' | 'timeout';
  saved_at: string;
  updated_at: string;
  collection_ids?: UUID[];
  /** List-thumb artwork matching the HTML source (bg / gradient / letter). */
  thumb?: ThumbSpec;
}

export interface ThumbSpec {
  bg?: string;
  gradient?: [string, string];
  label?: string;
  labelColor?: string;
  serif?: boolean;
}

export interface LinkCollection {
  link_id: UUID;
  collection_id: UUID;
  created_at: string;
}

export interface LinkMetadata {
  title: string;
  description: string | null;
  source_domain: string;
  preview_image_url: string | null;
}

export type ApiErrorCode =
  | 'INVALID_URL'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'DUPLICATE_LINK'
  | 'METADATA_TIMEOUT'
  | 'METADATA_UNAVAILABLE'
  | 'RATE_LIMITED'
  | 'SYNC_CONFLICT'
  | 'INTERNAL_ERROR';

export interface ApiError {
  error: { code: ApiErrorCode; message: string; request_id: string };
}
