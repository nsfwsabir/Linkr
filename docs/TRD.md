# Linker --- Technical Requirements Document

## 1. Technical scope

This document translates the supplied Linker UI into a
production-oriented technical design. It is an implementation proposal
where the UI source does not specify backend or infrastructure choices.

The source establishes a mobile UI with authentication, saved links,
collections, search, link detail, profile, and sync concepts.
fileciteturn0file0L315-L352 fileciteturn0file0L355-L393
fileciteturn0file0L420-L459

## 2. Proposed architecture

### Mobile client — React Native
- React Native with TypeScript.
- React Navigation for authenticated and unauthenticated navigation.
- Supabase JS client for authentication, database access, storage, and realtime capabilities where needed.
- Local persistence for cached links/collections and an offline mutation queue.
- Secure token/session persistence using the platform secure storage mechanism.
- Shared component layer implementing the visual system defined in `Design.md`.

### Backend — Supabase
Use Supabase as the primary backend platform:
- **Supabase Auth** for Google OAuth and email/password authentication.
- **Supabase Postgres** for users, links, collections, memberships, and sync metadata.
- **Row Level Security (RLS)** for tenant/user data isolation.
- **Supabase Storage** for application-managed preview assets if image caching is required.
- **Supabase Edge Functions** for server-side URL metadata extraction and other trusted operations.
- **Realtime** only where live synchronization is useful; ordinary CRUD can use Postgres APIs through the Supabase client.

### Recommended client structure

```text
src/
  app/
    navigation/
    providers/
  features/
    auth/
    links/
    collections/
    search/
    profile/
    sync/
  components/
  lib/
    supabase/
    storage/
    networking/
  types/
  utils/
```

Feature modules should own their screens, hooks, API/data access, and feature-specific types. Shared UI primitives belong in `components/`.

### Data flow

```text
React Native UI
      |
      v
Feature hooks / state
      |
      v
Supabase client
  |       |       |
 Auth   Postgres  Storage
          |
          v
   Edge Functions
          |
          v
   External web pages
   (metadata fetch)
```

The client should never contain privileged Supabase service-role credentials.

## 3. Domain model

### User

-   id: UUID
-   email
-   display_name
-   auth_provider
-   created_at
-   updated_at

### Link

-   id: UUID
-   user_id: UUID
-   canonical_url
-   original_url
-   title
-   description
-   source_domain
-   preview_image_url
-   metadata_status
-   saved_at
-   updated_at

### Collection

-   id: UUID
-   user_id: UUID
-   name
-   icon_key
-   color_key
-   created_at
-   updated_at

### LinkCollection

Use a join table if multi-collection membership is supported: -
link_id - collection_id - created_at

The supplied UI shows a collection selector and collection-based
browsing but does not establish whether one link can belong to multiple
collections. The data model should therefore be chosen only after that
product decision. fileciteturn0file0L405-L415

### SyncState

-   user_id
-   device_id
-   cursor/version
-   last_synced_at
-   status

## 4. Data/API surface

The MVP should use the Supabase client against Postgres/RLS for normal CRUD rather than introducing a separate application API layer.

### Authentication

Use Supabase Auth:
- Google OAuth
- Email/password sign-up
- Email/password sign-in
- Sign out
- Session refresh/persistence

The client uses the Supabase session and authenticated user ID. Authorization is enforced by Postgres RLS rather than trusting client-supplied user IDs.

### Links

Logical operations:
- Create link
- List links
- Get link
- Update link
- Delete link
- Filter by collection
- Search links

Recommended Postgres access pattern:
- `links` table with RLS restricted to `auth.uid() = user_id`.
- `link_collections` join table if multi-collection membership is supported.
- Server-side metadata extraction through an Edge Function.

### Collections

Logical operations:
- List collections
- Create collection
- Get collection
- Update collection
- Delete collection
- List links in collection
- Add/remove link membership

RLS must restrict collection access to the owning user.

### Metadata extraction Edge Function

Example logical endpoint:

`POST /functions/v1/fetch-link-metadata`

Request:
```json
{
  "url": "https://example.com"
}
```

Response:
```json
{
  "title": "Example Website",
  "description": "A short description of the page...",
  "source_domain": "example.com",
  "preview_image_url": null
}
```

This function must use an SSRF-safe outbound fetch implementation.

## 5. Metadata extraction

The Save Link UI includes a URL field and a preview containing
title/description, so metadata extraction is a required backend
capability for the shown experience. fileciteturn0file0L405-L415

Pipeline: 1. Validate URL. 2. Normalize/canonicalize URL. 3. Check
metadata cache. 4. Fetch page with SSRF-safe outbound networking. 5.
Parse Open Graph/Twitter/meta/title information. 6. Sanitize extracted
HTML/text. 7. Store normalized metadata. 8. Return preview to client. 9.
Allow save even when extraction fails.

Security requirements: - Block localhost/private-network targets. -
Enforce response-size limits. - Enforce timeout limits. - Restrict
protocols to HTTP/HTTPS. - Prevent redirect-based SSRF. - Strip scripts
and unsafe markup. - Rate-limit metadata fetches.

## 6. Search design

MVP: - PostgreSQL indexes for user_id and collection membership. -
Full-text index over title, description, and domain. - Prefix/trigram
support for partial matching if needed.

Ranking proposal: 1. Exact title match 2. Prefix title match 3. Domain
match 4. Description match 5. Recency as a tie-breaker

Search behavior is not specified by the UI source, so ranking is an
implementation proposal rather than a source-derived requirement.

## 7. Client state

Suggested state domains: - `auth` - `links` - `collections` - `search` -
`profile` - `sync` - `ui`

Server state should be cached locally. Mutations should use optimistic
updates where safe.

Example save-link flow: 1. User enters URL. 2. Client validates syntax.
3. Client requests metadata preview. 4. User selects collection. 5.
Client creates local pending link. 6. Client submits save. 7. Server
returns canonical record. 8. Local record is reconciled. 9.
Home/collection lists update.

## 8. Offline and sync

Because Profile exposes a Sync setting/state, synchronization is a
first-class concern. fileciteturn0file0L519-L540

Recommended approach: - Every mutation gets a client-generated operation
ID. - Queue writes while offline. - Server processes operations
idempotently. - Pull changes using a cursor. - Store `updated_at` plus
monotonic server version. - Reconcile by entity version. - Never lose a
locally created link because metadata retrieval failed.

Conflict policy must be finalized for collection membership and
user-edited metadata.

## 9. Authentication/security

-   OAuth/OIDC for Google.
-   Email/password authentication through a trusted identity provider or
    hardened auth service.
-   Short-lived access tokens.
-   Refresh tokens stored only in secure platform storage.
-   Server-side authorization on every user-owned resource.
-   Rate-limit authentication and link creation endpoints.
-   Audit sensitive account events.

## 10. Error handling

Standard API error envelope:

``` json
{
  "error": {
    "code": "INVALID_URL",
    "message": "The URL is not valid.",
    "request_id": "req_123"
  }
}
```

Important errors: - `INVALID_URL` - `UNAUTHORIZED` - `FORBIDDEN` -
`NOT_FOUND` - `DUPLICATE_LINK` - `METADATA_TIMEOUT` -
`METADATA_UNAVAILABLE` - `RATE_LIMITED` - `SYNC_CONFLICT` -
`INTERNAL_ERROR`

## 11. Supabase security requirements

- Enable RLS on all user-owned tables.
- Policies must derive ownership from `auth.uid()`, not a client-provided user ID.
- Never ship the Supabase service-role key in the React Native bundle.
- Keep privileged metadata extraction in Edge Functions.
- Validate and normalize URLs before metadata retrieval.
- Apply SSRF protections, timeout limits, response-size limits, redirect controls, and rate limits to metadata extraction.
- Store only the minimum required user/profile data.
- Define account deletion and associated-data deletion before production launch.

## 12. Observability

Track: - API latency/error rate - Authentication failures - Link-save
success/failure - Metadata extraction success/failure - Search latency -
Sync success/failure - Client crashes - Offline queue size

Use structured logs with request IDs. Never log passwords, access
tokens, or sensitive link contents unnecessarily.

## 13. Performance targets

Proposed targets: - Cached Home first usable content: \<1 second. -
Search response: p95 \<300 ms for normal datasets. - Standard API reads:
p95 \<500 ms. - Metadata preview: return within 3 seconds when the
source site responds normally. - App should remain usable when metadata
extraction is slow or unavailable.

These are engineering targets, not requirements established by the
supplied UI.

## 14. Testing strategy

### Unit

-   URL normalization
-   Search query construction
-   Metadata parsing
-   Collection membership
-   Sync conflict logic

### Integration

-   Auth flows
-   Save link + metadata
-   Collection assignment
-   Search
-   Sync

### E2E

-   Onboarding → auth → Home
-   Save link → Home
-   Save link → collection → collection view
-   Collection → link detail → open external link
-   Profile → sign out

### Security

-   Authorization isolation between users
-   SSRF tests
-   Token handling
-   Rate limiting
-   Input sanitization

## 15. Deployment

Suggested environments: - Development - Staging - Production

CI/CD: 1. Lint 2. Unit tests 3. Integration tests 4. Build 5. Security
checks 6. Deploy staging 7. Smoke tests 8. Production deployment

Use database migrations with rollback/forward-fix procedures.

## 16. Technical open questions

1.  Native vs React Native vs Flutter?
2.  Which identity provider?
3.  Is metadata extraction self-hosted or third-party?
4.  Is multi-device sync required for MVP?
5.  Are preview images cached by Linker or referenced from source sites?
6.  Is multi-collection membership supported?
7.  What is the duplicate URL policy?
8.  What are account deletion/data export requirements?
9.  Is a web/extension client planned?
