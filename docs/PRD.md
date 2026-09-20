# Linker --- Product Requirements Document

## 1. Product overview

**Linker** is a mobile-first personal link-saving and organization app.
Its core promise is: **"Save today. Explore tomorrow."** Users save
articles, videos, tools, and other links, organize them into
collections, search saved links, revisit link details, and manage their
account.

This PRD is derived from the supplied Linker UI screens and targets a React Native mobile application backed by Supabase. The source
explicitly shows splash, onboarding, authentication, home, save-link,
collections, collection detail, link detail, and profile experiences.
fileciteturn0file0L240-L250 fileciteturn0file0L254-L333
fileciteturn0file0L355-L393

## 2. Product goals

1.  Make saving a link fast and low-friction.
2.  Keep saved links organized through collections.
3.  Make previously saved links easy to find through search and
    collection browsing.
4.  Let users open a saved link and inspect its metadata before leaving
    the app.
5.  Provide account-based persistence and synchronization.
6.  Deliver a calm, lightweight mobile UI with clear hierarchy.

## 3. Target users

The UI implies a general consumer/user workflow rather than a
specialized professional workflow.

Primary use cases: - Save an interesting article for later. - Save a
video, tool, or website. - Put a saved link into a collection such as
Read Later, Work, Personal, Inspiration, or Tools. - Search saved
links. - Browse a collection. - Reopen the original link. - Manage
account and sync settings.

The source does not define demographics, personas, pricing, or business
model.

## 4. Core user journeys

### 4.1 First launch

Splash → onboarding 1 → onboarding 2 → onboarding 3 → sign in/create
account.

Onboarding communicates: - "Save links that matter" - "Organize your
way" - "Come back anytime"

The third onboarding screen contains the text "Uave now. Explore when
you're ready." in the supplied source; this appears to be an intentional
source string and is preserved here rather than silently corrected.
fileciteturn0file0L254-L312

### 4.2 Authentication

Users can: - Continue with Google - Continue with Apple - Continue with
Email - Create an account with name, email, and password - Return to
sign in

The UI also displays Terms and Privacy Policy acceptance language.
fileciteturn0file0L315-L352

### 4.3 Save a link

From Home, the user taps the plus action. A Save Link bottom sheet
appears with: - URL input - Link preview - Collection selector - Save
action

The preview contains a title and description, indicating that URL
metadata should be fetched or supplied by a backend/service.
fileciteturn0file0L396-L417

### 4.4 Browse/search saved links

Home provides: - Search field - Collection/category tabs: All, Read
Later, Work, Personal - Saved-link list - Bottom navigation

The shown list includes title, source domain, and relative saved time.
fileciteturn0file0L355-L393

### 4.5 Browse collections

Collections displays named collections and link counts. The supplied UI
includes Read Later, Work, Personal, Inspiration, and Tools.
fileciteturn0file0L420-L459

### 4.6 View a collection

A collection detail view shows collection identity, link count, saved
links, source domain, relative time, and overflow actions.
fileciteturn0file0L462-L495

### 4.7 View a saved link

Link Detail shows: - Hero image - Back and overflow controls - Title -
Source domain - Description - Open Link CTA - Add to collection - Saved
timestamp

fileciteturn0file0L497-L517

### 4.8 Manage profile

Profile shows account identity and: - Settings - Sync - Help & Support -
About - Sign Out

Sync is visually shown as "On." fileciteturn0file0L519-L542

## 5. Functional requirements

### FR-1 Authentication

-   Support Google authentication.
-   Support Apple authentication.
-   Support email authentication.
-   Support account creation with name, email, and password.
-   Persist authenticated state across launches.
-   Provide sign out.
-   Present terms/privacy acceptance language before account
    continuation.

**Acceptance:** A new user can authenticate using any supported path and
reach the authenticated Home screen.

### FR-2 Save links

-   Accept a URL.
-   Validate URL syntax.
-   Fetch available page metadata.
-   Show title and description preview when metadata is available.
-   Allow the user to select a collection.
-   Save the link.
-   Associate the saved link with the authenticated user.
-   Record saved time.

**Acceptance:** A valid URL can be saved and subsequently appears in
Home and the selected collection.

### FR-3 Collections

-   List collections.
-   Display collection name and link count.
-   Open a collection.
-   Show links belonging to a collection.
-   Allow a saved link to be added to a collection.

The source establishes collection selection and browsing, but does not
explicitly define collection creation, rename, delete, or
multi-collection membership behavior. Those are therefore MVP decisions
to be confirmed before implementation.

### FR-4 Search

-   Search saved links.
-   Search should cover at minimum saved link titles and source domains.
-   Search should update results without requiring navigation away from
    the primary search surface.

The UI establishes the search affordance but does not specify search
ranking, fuzzy matching, filtering rules, or indexing technology.

### FR-5 Link detail

-   Display stored title, source, description, image when available, and
    saved timestamp.
-   Open the original URL externally.
-   Allow collection assignment.
-   Provide an overflow action surface.

The exact overflow actions are not defined in the supplied screens.

### FR-6 Navigation

Authenticated primary navigation consists of: - Home - Collections -
Search - Profile

Home also has a plus action for saving a link.
fileciteturn0file0L355-L393

### FR-7 Sync

-   Provide a sync setting/state.
-   Keep saved-link and collection state consistent across supported
    user sessions/devices.

The UI says "Sync: On," but implementation semantics and offline
behavior are not defined by the source. fileciteturn0file0L528-L534

## 6. Non-functional requirements

### Performance

-   Home should render cached saved links quickly.
-   Save-link metadata retrieval should provide a loading state and
    should not block saving indefinitely.
-   Search should feel immediate for normal user datasets.

### Reliability

-   Saved links must not be lost because metadata retrieval fails.
-   Network failures should preserve locally entered data where
    feasible.
-   Sync conflicts must be resolved deterministically.

### Security

-   Authenticate users securely.
-   Protect saved-link data by user identity/authorization.
-   Do not expose private saved-link data across accounts.
-   Store credentials only through established secure authentication
    mechanisms; do not store plaintext passwords.

### Accessibility

-   Meet platform accessibility semantics for buttons, fields, lists,
    and navigation.
-   Maintain sufficient text contrast.
-   Support dynamic text sizing without truncating critical actions.

### Privacy

-   Treat saved links as user data.
-   Provide access to Terms and Privacy Policy.
-   Define retention/deletion behavior before production launch.

## 7. MVP scope

### In scope

-   Splash and onboarding
-   Google/email authentication
-   Account creation
-   Home feed
-   Search
-   Save link
-   Metadata preview
-   Collections
-   Collection detail
-   Link detail
-   Open original URL
-   Profile
-   Sign out
-   Basic sync

### Explicitly not specified by source

-   Browser extension
-   Share-sheet integration
-   Web app
-   Desktop app
-   AI summaries/recommendations
-   Social sharing
-   Collaboration
-   Tags beyond shown collections
-   Notifications/reminders
-   Subscription/billing
-   Import/export
-   Advanced analytics

These may be future opportunities but should not be treated as committed
requirements.

## 8. Success metrics

The source does not provide business KPIs. Recommended implementation
metrics to validate the product concept: - Activation: percentage of new
users completing authentication and saving first link. - Save success
rate. - Median time from opening Save Link to successful save. - Search
success rate. - Links reopened per active user. - Weekly retained
users. - Sync failure rate. - Metadata-fetch success rate.

## 9. Product risks

  -----------------------------------------------------------------------
  Risk                    Impact                  Mitigation
  ----------------------- ----------------------- -----------------------
  Metadata fetch fails    Poor preview/save       Save URL independently;
  for some URLs           experience              metadata is enhancement

  Duplicate links         Clutter                 Define duplicate policy
                                                  before launch

  Sync conflicts          Data inconsistency      Establish
                                                  server-authoritative or
                                                  deterministic conflict
                                                  rules

  Search misses relevant  Discoverability loss    Index title, domain,
  links                                           description and
                                                  collection

  Collection model        Data-model rework       Confirm collection CRUD
  unclear                                         and membership rules
  -----------------------------------------------------------------------

## 10. Open product decisions

1.  Can users create, rename, reorder, and delete collections?
2.  Can a link belong to multiple collections?
3.  What happens when the same URL is saved twice?
4.  Is there a default collection?
5.  Can users edit title/description?
6.  What exactly is available in the overflow menus?
7.  What does "Sync On" mean and can it be disabled?
8.  Is offline saving supported?
9.  What is the account deletion flow?
10. Are browser/share-sheet integrations part of the roadmap?
