# Linker --- Design Specification

## 1. Design direction

Implementation target: **React Native** mobile app. The design system should be implemented as reusable React Native components and theme tokens rather than screen-specific styling.


Linker uses a minimal, calm, utility-first mobile visual language. The
supplied screens use a light gray app background, dark primary
typography, muted secondary text, rounded controls/cards, restrained
accent colors, and compact navigation.

The source defines a 248×540px reference phone frame, a 38px phone
radius, and a system-font stack based on `-apple-system`,
BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, and Arial.
fileciteturn0file0L10-L30 fileciteturn0file0L48-L52

## 2. Design principles

1.  **Save first:** the main interaction should make capturing a link
    obvious.
2.  **Low cognitive load:** simple lists, collections, and familiar
    navigation.
3.  **Strong hierarchy:** large bold headings, small supporting
    metadata.
4.  **Soft surfaces:** rounded cards and inputs rather than dense
    borders.
5.  **Purposeful color:** accents communicate category rather than
    decorate every element.
6.  **Content over chrome:** saved-link title and source should remain
    visually dominant.
7.  **Consistent interaction patterns:** back, plus, chevron, overflow,
    and bottom navigation repeat across screens.

## 3. Visual tokens

### Colors

  Token               Value       Use
  ------------------- ----------- ----------------------------
  Board background    `#c7ccd6`   Prototype board/background
  Screen background   `#f7f8fa`   Primary app surface
  Alternate surface   `#eef0f4`   Preview/secondary surface
  Primary text        `#14161a`   Headings/body
  Secondary text      `#888d96`   Descriptions/metadata
  Tertiary text       `#b3b7bf`   Low-emphasis metadata
  Border              `#eaebee`   Dividers
  Input background    `#f2f3f5`   Inputs/search
  Blue                `#2f6fed`   Primary accent
  Blue background     `#e3ebfd`   Blue collection icon
  Pink                `#f2436a`   Read Later/heart accent
  Pink background     `#fde3ea`   Pink collection icon
  Orange              `#f5a623`   Inspiration/accent
  Orange background   `#fef1db`   Orange collection icon
  Teal                `#14b8a6`   Personal/accent
  Teal background     `#d9f5f1`   Teal collection icon
  Dark                `#17181c`   Primary CTA

These values are taken from the supplied CSS.
fileciteturn0file0L10-L30

### Typography

-   Font: system sans-serif stack.
-   App wordmark: 29px, weight 800.
-   Screen headings: approximately 19--23px, weight 800.
-   Body: approximately 12.5--13.5px.
-   Metadata: approximately 10.5--12px.
-   Navigation labels: approximately 9.5px.

The supplied source defines the wordmark, app tag, form title, list
title, metadata, and navigation typography explicitly.
fileciteturn0file0L71-L73 fileciteturn0file0L125-L134
fileciteturn0file0L152-L166

## 4. Spacing and shape language

Primary reference values: - Phone width: 248px - Phone height: 540px -
Phone radius: 38px - Common horizontal page padding: 22--24px - Search
height: 42px - Input height: 48px - Primary button height: 50px - Small
icon button: 32--33px - List thumbnail: 42px - Collection icon: 44px -
Bottom-nav top/bottom padding: 10px / 20px

These values are established by the supplied stylesheet.
fileciteturn0file0L48-L52 fileciteturn0file0L121-L145
fileciteturn0file0L152-L166 fileciteturn0file0L187-L193

## 5. Component inventory

### App shell

-   Status bar
-   Content region
-   Home indicator
-   Bottom navigation where applicable

### Navigation

-   Back icon button
-   Round plus button
-   Bottom navigation item
-   Floating back/overflow controls on link detail

### Inputs

-   Standard input field
-   Search bar
-   Collection dropdown

### Actions

-   Dark primary CTA
-   Outline OAuth button
-   Circular plus
-   Circular close
-   Circular onboarding next

### Content

-   Saved-link list item
-   Collection card
-   Collection title row
-   Link detail
-   Preview card
-   Profile menu row

### Overlay

-   Dimmed background
-   Bottom sheet

## 6. Screen specifications

### 6.1 Splash

Purpose: brand introduction.

Elements: - Status bar - Gradient orb illustration - "Linker" - "Save
today. Explore tomorrow." - Home indicator

The supplied source centers the splash content and uses a 108px orb.
fileciteturn0file0L75-L81 fileciteturn0file0L240-L251

### 6.2 Onboarding

Three screens explain: 1. Saving links 2. Organizing with collections 3.
Returning to saved content

Each has an illustration, title, description, circular next button, and
home indicator. fileciteturn0file0L254-L312

### 6.3 Sign in

Centered brand/title area with three vertically stacked outline
buttons: - Google - Apple - Email

Legal copy sits near the bottom. fileciteturn0file0L315-L333

### 6.4 Create account

Top back control followed by: - Title - Subtitle - Name - Email -
Password - Create account CTA - Sign-in link

fileciteturn0file0L336-L352

### 6.5 Home

Header: - Linker title - Plus button

Body: - Search - Horizontal collection tabs - Saved-link list

Footer: - Home - Collections - Search - Profile

fileciteturn0file0L355-L393

### 6.6 Save Link bottom sheet

The modal dims the Home screen and anchors a white sheet to the bottom.

Content: - "Save Link" header - Close button - URL input - Link
preview - Collection selector - Save CTA

The source defines a 28px top sheet radius.
fileciteturn0file0L168-L185 fileciteturn0file0L396-L417

### 6.7 Collections

Header with title and plus button. Collection cards use colored icon
tiles, collection name, count, and chevron.
fileciteturn0file0L420-L459

### 6.8 Collection View

Back navigation followed by collection icon, name, count, and a list of
links. Each list item exposes an overflow action.
fileciteturn0file0L462-L495

### 6.9 Link Detail

Hero image at top, floating back/overflow controls, title, source,
description, primary Open Link action, and detail rows for collection
and saved state. fileciteturn0file0L497-L517

### 6.10 Profile

Header, avatar/name/email, settings menu, sync state, help, about, sign
out, and bottom navigation. fileciteturn0file0L519-L542

## 7. Interaction behavior

### Save

-   Plus opens bottom sheet.
-   URL field is the primary input.
-   Preview appears after metadata resolution.
-   Collection is selected from a dropdown.
-   Save persists the link.

### Navigation

-   Bottom nav switches between major authenticated sections.
-   Back buttons return to the previous hierarchy.
-   Link detail opens from a saved-link item.
-   "Open Link" launches the original URL outside the app.

### Search

The source shows both a Home search field and a dedicated Search tab,
but does not define whether they share the same search screen/state.
Implement them as one search system with consistent results unless
product requirements specify otherwise.

### Overflow

Overflow controls exist on Link Detail and collection list items, but
their menu contents are not specified. Keep the action surface
extensible.

## 8. Responsive/mobile considerations

The supplied UI is a fixed reference composition, not a responsive
specification. Production implementation in React Native should: - Preserve 16pt+
minimum touch targets where platform guidance requires. - Adapt to
device widths and safe areas. - Support small and large phones. -
Respect display cutouts and home indicators. - Avoid hardcoded 248×540
dimensions in production layout. - Preserve the visual proportions and
spacing hierarchy of the reference.

## 9. Accessibility

-   Provide accessible labels for icon-only controls.
-   Ensure plus, close, back, overflow, search, and navigation controls
    are discoverable by screen readers.
-   Use semantic headings.
-   Ensure text remains legible at increased font sizes.
-   Do not rely on accent color alone to convey collection meaning.
-   Ensure modal focus is trapped appropriately.
-   Announce save/sync success and errors.

## 10. Motion

The supplied source does not define motion. Recommended restrained
motion: - Splash fade/scale transition. - Horizontal onboarding
transitions. - Bottom-sheet slide-up/down. - Press states for buttons. -
Navigation crossfade or short slide. - Subtle skeleton/loading state for
metadata preview.

Avoid excessive animation; the reference design is intentionally quiet.

## 11. Empty, loading, and error states

The supplied screens show populated states only. Production design
should add: - Empty Home - Empty Collection - No Search Results -
Metadata Loading - Metadata Unavailable - Save Failed - Offline -
Syncing - Sync Failed - Session Expired

These states should reuse the same typography, spacing, rounded
surfaces, and muted visual language.

## 12. Design QA checklist

-   [ ] Typography matches defined hierarchy.
-   [ ] Horizontal padding is consistent.
-   [ ] Buttons have consistent height/radius.
-   [ ] Collection colors are used consistently.
-   [ ] Search and inputs share the same surface treatment.
-   [ ] Bottom navigation remains visible on screens where specified.
-   [ ] Link detail maintains hero/title/action hierarchy.
-   [ ] Bottom sheet uses dim overlay and rounded top corners.
-   [ ] Icon-only controls have accessible labels.
-   [ ] Long titles truncate gracefully.
-   [ ] Missing images use a neutral fallback.
-   [ ] Loading/error/empty states match the visual system.


## 13. React Native implementation guidance

Recommended reusable components:
- `Screen`
- `AppHeader`
- `SearchBar`
- `PrimaryButton`
- `OutlineButton`
- `IconButton`
- `BottomNav`
- `LinkListItem`
- `CollectionCard`
- `BottomSheet`
- `TextInput`
- `CollectionPicker`

Recommended design-token structure:
- `colors`
- `typography`
- `spacing`
- `radii`
- `shadows`
- `iconSizes`

Use platform-safe-area handling for status bars and home indicators. Avoid embedding the prototype's 248×540 dimensions into production components; those dimensions are reference artwork only.
