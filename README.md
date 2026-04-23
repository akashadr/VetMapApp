# VetMapApp — Veterinary Clinic Discovery

A React Native CLI application for discovering veterinary clinics using an Airbnb-style map + bottom sheet pattern, built for the Yosemite Crew platform.

---

## Map SDK: `react-native-maps` (Google Maps)

**Why `react-native-maps` over Mapbox:**

| Factor | react-native-maps | Mapbox |
|---|---|---|
| RN community support | Widest — 14k+ GitHub stars | Smaller RN community |
| Custom styling | Google Maps JSON style array | Mapbox Studio (more powerful but heavier setup) |
| iOS setup | CocoaPods, zero extra config | Requires Mapbox token + extra native config |
| Bundle size | Lighter | Heavier (offline tiles SDK bundled) |
| Free tier | Generous ($200/mo credit) | More restrictive |

For a demo with custom styling and fast setup, `react-native-maps` with a Google Maps JSON style is the right call.

---

## Custom Map Style

Defined in [`src/theme/mapStyle.ts`](src/theme/mapStyle.ts) — matches the **Yosemite Crew Figma design palette**:

- **Land surface**: Light neutral `#F2F2F2` — matches app background
- **Roads**: White `#FFFFFF` with `#E0E0E0` strokes — clean, minimal
- **Water**: Brand blue tint `#BDD9F5` — complements `#247AED` brand blue
- **Parks**: Soft green `#D4EAD0` — nature context without competing with pins
- **Labels**: Near-black `#302F2E` (Figma primary/CTA color)
- **POIs suppressed**: Clinic pins are the only points of interest

---

## Architecture

```
src/
├── types/          # Shared TypeScript interfaces (Clinic, Coordinates, etc.)
├── data/           # 12 realistic mock SF vet clinics
├── services/       # Pure functions: region filtering, search, distance enrichment
├── store/          # Zustand store — single source of truth for map/list state
├── utils/          # distance.ts — pure Haversine: (userCoords, clinicCoords) → km
├── theme/          # colors.ts, mapStyle.ts, typography.ts
├── components/
│   ├── ClinicPin         # Custom map marker (speciality emoji + rating pill)
│   ├── ClinicCard        # Bottom sheet card
│   ├── BottomSheetPanel  # @gorhom/bottom-sheet wrapper
│   ├── SearchBar         # Controlled search input
│   └── FilterChips       # Horizontal filter row
├── screens/
│   ├── MapDiscoveryScreen   # Full-screen map + overlaid search + bottom sheet
│   └── ClinicDetailScreen   # All clinic fields + Book Appointment CTA
└── navigation/     # React Navigation stack
```

**Key decisions:**
- No business logic in screen components — screens wire store → components only
- `clinicService.ts` owns all filtering (region bounds, search, open-now)
- Zustand is the single reactive layer; services are pure functions
- Distance is a pure utility: `calculateDistance(from, to) → number`

---

## State Management: Zustand

| | Zustand | Redux | Context API |
|---|---|---|---|
| Boilerplate | Minimal | Heavy (actions, reducers, selectors) | Minimal |
| Re-render control | Granular subscriptions | Requires memoization | Re-renders all consumers |
| No Provider needed | ✅ | ❌ | ❌ |
| Frequent updates | Handles well | Handles well | Poor (map region fires constantly) |

**Why Zustand here**: The map fires `onRegionChangeComplete` continuously while panning — Context would re-render every subscribed component on each event. Zustand's granular subscriptions mean only components that read `visibleClinics` re-render when the region changes. No Provider wrapping, no boilerplate actions/reducers.

---

## Setup

### Prerequisites
- Node ≥ 22
- Xcode 15+ (iOS) or Android Studio (Android)
- CocoaPods: `gem install cocoapods`
- Google Maps API key (Maps SDK for iOS + Android enabled)

### Install

```bash
npm install
cd ios && bundle exec pod install && cd ..
```

### Add Google Maps API Key

**iOS** — `ios/VetMapApp/AppDelegate.mm`:
```objc
#import <GoogleMaps/GoogleMaps.h>
// Inside didFinishLaunchingWithOptions, before [super application:...]:
[GMSServices provideAPIKey:@"YOUR_API_KEY"];
```

**Android** — `android/app/src/main/AndroidManifest.xml`:
```xml
<meta-data
  android:name="com.google.android.geo.API_KEY"
  android:value="YOUR_API_KEY" />
```

### Run

```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

---

## Features

| Feature | Status |
|---|---|
| Full-screen map with custom palette + custom pins | ✅ |
| Draggable bottom sheet (collapsed 2 cards / expanded full list) | ✅ |
| Panning map updates clinic cards | ✅ |
| Tapping pin brings matching card to focus | ✅ |
| Search filters both pins and cards simultaneously | ✅ |
| Location permission denial handled gracefully | ✅ |
| Clinic detail screen (all fields + distance + Book button) | ✅ |
| 12 realistic SF veterinary clinics in mock data | ✅ |
| **Bonus** Filter chips: All / Open Now / By Speciality | ✅ |
| **Bonus** Pin clustering when zoomed out | ✅ |
| **Bonus** Camera animates to tapped pin | ✅ |
| **Bonus** Open clinic address in native Maps app | ✅ |

---

## Demo

- [Demo Video 1](https://drive.google.com/file/d/1_aPl_KblIwDeNZCyEdfsZ3Ki6YU2XuLZ/view?usp=sharing)
- [Demo Video 2](https://drive.google.com/file/d/1jyjXn0Z-sJkRSziFkpz3S0EqM6uHwI8g/view?usp=sharing)

---

## Mock Data

12 realistic San Francisco veterinary clinics covering:
General Practice · Internal Medicine · Surgery & Orthopedics · Emergency & Critical Care · Integrative Medicine · Dentistry & Dermatology · Preventive Care & Vaccines · Feline & Canine Medicine · Oncology & Imaging · Exotic Animals & Avian · Rehabilitation & Sports Medicine

---

## Figma Design System — UI Implementation

All UI changes were applied from Figma screenshots across 12 design system frames. Every component references centralised theme tokens — no hardcoded colours, sizes, or fonts anywhere in the component layer.

---

### 1 · Design Tokens (`src/theme/`)

#### `colors.ts` — Full Figma colour palette

| Token | Value | Usage |
|---|---|---|
| `textPrimary` | `#302F2E` | Body text, headings |
| `textSecondary` | `#595958` | Supporting text |
| `textMuted` | `#747473` | Placeholders, captions |
| `textExtra` | `#A09F9F` | Disabled text |
| `textInverse` | `#FFFFFF` | Text on dark surfaces |
| `primary` | `#302F2E` | CTA buttons, borders |
| `hover` | `#1D1C1B` | Pressed state |
| `accent` | `#247AED` | Links, selected chips, info badges |
| `accentBg` | `#F2F8FF` | Selected chip fill |
| `surface` | `#FFFFFF` | Cards, inputs |
| `background` | `#F5F5F5` | Screen background |
| `border` | `#EAEAEA` | Card outlines, dividers |
| `borderSelected` | `#BFBFBE` | Focused / active borders |
| `success` | `#008F5D` | Open status, success badge |
| `successBg` | `#E6F4EF` | Success badge fill |
| `warning` | `#F68523` | Warning badge text |
| `warningBg` | `#FEF3E9` | Warning badge fill |
| `error` | `#EA3729` | Error state, error badge |
| `star` | `#F9AD6C` | Rating stars |
| `overlay` | `rgba(36,122,237,0.08)` | Icon container fill |

#### `spacing.ts` — Grid, radius, icon, elevation tokens

**Spacing scale** (4px baseline grid):
```
base: 4    tight: 8    tightLg: 12    component: 16
section: 24    sectionLg: 32    screenHorizontal: 16    screenVertical: 32
```

**Border radius:**
```
sm: 8       → small badges
input: 12   → input fields, icon containers
card: 16    → cards, filter chips
large: 20   → bottom tab selected square
sheet: 24   → bottom sheet, hero icon wrap
pill: 999   → search bar, fully rounded chips
```

**Icon sizes:**
```
sm: 16   → inline row icons
md: 20   → medium icons
lg: 24   → card emoji icons
```
Icon containers are always **44 × 44 px** (Apple HIG minimum touch target).

**Elevation:**
```
outline   → borderWidth: 1, borderColor: #EAEAEA, no shadow  (cards)
shadowSm  → shadow only, no border                            (search bar)
shadowMd  → deeper shadow, no border                          (CTAs, sheets)
```

#### `typography.ts` — Satoshi Variable font scale

**Font:** `Satoshi-Variable` (variable font, linked via `react-native-asset`).

**Display scale** (large surfaces):
| Token | Size | Weight | Line height |
|---|---|---|---|
| `largeTitle` | 34 | 600 | 42 |
| `stat` | 32 | 600 | 40 |
| `title1` | 28 | 600 | 36 |
| `title2` | 22 | 500 | 28 |
| `title3` | 20 | 500 | 24 |

**UI Text scale** (components):
| Token | Size | Weight | Line height |
|---|---|---|---|
| `headline` | 17 | 600 | 22 |
| `body` | 17 | 400 | 22 |
| `bodyEmphasis` | 17 | 500 | 22 |
| `callout` | 16 | 400 | 24 |
| `subHeadline` | 15 | 500 | 22 |
| `footnote` | 13 | 400 | 20 |
| `footnoteEmphasis` | 13 | 500 | 20 |
| `caption` | 12 | 500 | 18 |

**FontWeights:** typed string literals — `'400'` `'500'` `'600'` `'700'` `'900'`.

Applied via spread syntax: `...UIText.subHeadline`, `...Elevation.outline`.

---

### 2 · New Components

#### `Badge` (`src/components/Badge.tsx`)
Tag/badge system with 5 variants, `Radius.sm` (8px) corners.

| Variant | Background | Text colour |
|---|---|---|
| `default` | `Colors.border` | `Colors.textSecondary` |
| `success` | `Colors.successBg` | `Colors.success` |
| `successSolid` | `Colors.success` | White |
| `warning` | `Colors.warningBg` | `Colors.warning` |
| `info` | `Colors.accentBg` | `Colors.accent` |

Used in `ClinicCard` and `ClinicDetailScreen` for open/closed status (replaces inline styles).

#### `Button` (`src/components/Button.tsx`)
Full button system matching Figma — `Radius.pill` shape throughout.

| Prop | Options |
|---|---|
| `variant` | `'primary'` (dark fill) · `'secondary'` (outline) |
| `size` | `'large'` (paddingV 16) · `'medium'` (paddingV 12) |
| `disabled` | Grays out fill/border/text |
| `loading` | Appends `...` to label |

- Primary default: `Colors.primary` fill, white text  
- Primary disabled: `Colors.borderSelected` fill, white/55% text  
- Secondary default: white bg, `Colors.primary` border, dark text  
- Secondary disabled: white bg, `Colors.border`, muted text  

Used in `ClinicDetailScreen` for the "Book Appointment" CTA.

#### `InputField` (`src/components/InputField.tsx`)
Floating-label text input with 4 visual states.

- **Default** — `Colors.border` border, label shown as placeholder  
- **Filled / Focused** — `Colors.primary` border, label floats above value (small caption)  
- **Error** — `Colors.error` border, floating label in red, error message below  
- **Disabled** — `Colors.border` border, all text muted, non-editable  

Optional `rightElement` prop accepts any node (e.g. dropdown arrow).

#### `TopNavBar` (`src/components/TopNavBar.tsx`)
Reusable navigation header with 6 variants via props.

| Prop | Values |
|---|---|
| `showBack` | `true` (circle outline + chevron) · `false` (no back button) |
| `rightIcon` | `'search'` · `'add'` · `'edit'` · `'delete'` · `'none'` |

- Back button: 34×34px circle with `Colors.border` outline + `‹` chevron  
- Add: 34×34px `Colors.primary` filled circle + white `+`  
- Handles `useSafeAreaInsets` internally — screens no longer manage `paddingTop`  

Replaces the custom inline header in `ClinicDetailScreen`.

#### `TabIcons` (`src/components/TabIcons.tsx`)
SVG outline icons (via `react-native-svg`) for each tab and the search bar.

| Export | Description |
|---|---|
| `HomeIcon` | House outline with smiley eyes + smile arc |
| `TasksIcon` | Clipboard with rounded clip + heart inside |
| `AppointmentsIcon` | Calendar with two pin lines + header divider |
| `DocumentsIcon` | File with dog-ear fold + bookmark ribbon |
| `SearchIcon` | Circle + diagonal handle (magnifier) |

Accepts `color` and `size` props — active tab receives `Colors.textInverse` (white), inactive receives `Colors.textSecondary`.

#### `BottomTabBar` (`src/components/BottomTabBar.tsx`)
Custom tab bar matching Figma bottom navigation.

- **Selected** — dark rounded square (`Colors.primary`, `Radius.large` = 20px), white SVG icon + white semibold label  
- **Unselected** — no background, `Colors.textSecondary` icon + label  
- Respects `useSafeAreaInsets` for home indicator padding  

---

### 3 · Updated Components

#### `SearchBar` (`src/components/SearchBar.tsx`)
- Shape: `Radius.pill` with `1px` `Colors.border` (no shadow, no focus-border change)  
- Icon: SVG `SearchIcon` on the **right** (was emoji on left)  
- Clear button (`✕`) replaces icon when text is present  
- **Typography** — driven by focus/value state:  
  - Default (placeholder showing): Satoshi 17px / weight `400`  
  - Active (focused or typing): Satoshi 17px / weight `500`  
  - Placeholder colour: `Colors.textMuted` (`#747473`)  
  - Typed text colour: `Colors.textPrimary` (`#302F2E`)

#### `FilterChips` (`src/components/FilterChips.tsx`)
- Shape: `Radius.card` (16px) rounded rectangle — was pill-shaped  
- **Default**: white bg + `Colors.primary` dark border + dark text  
- **Selected**: `Colors.accentBg` light blue fill + `Colors.accent` border + `Colors.accent` blue text (was solid-blue fill with white text)  
- Default label: `Colors.textPrimary` (was secondary muted)

#### `ClinicCard` (`src/components/ClinicCard.tsx`)
- All typography via `UIText` spread tokens  
- Spacing via `Spacing`, `Radius`, `IconSize` tokens  
- Card elevation: `Elevation.outline` (border-only, no shadow)  
- Open/closed status: now uses `<Badge>` component (`success` / `default` variant)  
- Icon container: 44×44px, `Radius.input` (12px)

#### `ClinicDetailScreen` (`src/screens/ClinicDetailScreen.tsx`)
- Header replaced with `<TopNavBar title="Clinic Details" onBack={...} />`  
- Open/closed status replaced with `<Badge>` component  
- Book Appointment button replaced with `<Button label="Book Appointment" />`  
- All `Fonts.xxx` references removed — uses `'Satoshi-Variable'` + `FontWeights`  
- All hardcoded values replaced with theme tokens

#### `BottomSheetPanel` (`src/components/BottomSheetPanel.tsx`)
- Header/subtext via `UIText.subHeadline` + `UIText.caption`  
- Spacing via `Spacing` tokens  
- Sheet corners: `Radius.sheet` (24px)  
- Sheet shadow: `Elevation.shadowMd`

---

### 4 · Navigation Restructure

**Before:** `Stack → MapDiscovery | ClinicDetail`

**After:**
```
Stack
├── MainTabs (Bottom Tab Navigator)
│   ├── Home → MapDiscoveryScreen
│   ├── Tasks → TasksScreen (placeholder)
│   ├── Appointments → AppointmentsScreen (placeholder)
│   └── Documents → DocumentsScreen (placeholder)
└── ClinicDetail → ClinicDetailScreen (slides over tabs)
```

New type added: `RootTabParamList` in `src/types/index.ts`.  
New dependency: `@react-navigation/bottom-tabs` + `react-native-svg`.

---

### 5 · Figma Frames → Code Mapping

| Frame | What changed |
|---|---|
| 1 — Baseline grid | `Spacing` token scale (4px base, 16px margins) |
| 2 — Component spacing | `Spacing.tight/component/section` applied across all components |
| 3 — Container radius | `Radius` token scale applied to every border-radius in the app |
| 4 — Icon sizes | `IconSize.sm/md/lg` tokens, 44×44px containers enforced |
| 5 — Icon containers | 44×44px touch targets everywhere |
| 6 — Border styling | `Elevation.outline` vs `Elevation.shadowSm/Md` — no mixing |
| 7 — Colour tokens | Full `Colors` rewrite in `colors.ts` |
| 8 — Typography | Full `UIText` + `Display` + `FontWeights` rewrite in `typography.ts` |
| 9 — Tag/Badge + Chips | `Badge` component created; `FilterChips` shape + selected state fixed |
| 10 — Button system | `Button` component created (primary/secondary, L/M, states) |
| 11 — Input fields | `InputField` component created; `SearchBar` pill border + icon-right |
| 12 — Navigation | `TopNavBar` + `BottomTabBar` + SVG `TabIcons` created; tab navigator wired |
