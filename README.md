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

First Video: https://drive.google.com/file/d/1_aPl_KblIwDeNZCyEdfsZ3Ki6YU2XuLZ/view?usp=sharing

Second Video: https://drive.google.com/file/d/1jyjXn0Z-sJkRSziFkpz3S0EqM6uHwI8g/view?usp=sharing
---

## Mock Data

12 realistic San Francisco veterinary clinics covering:
General Practice · Internal Medicine · Surgery & Orthopedics · Emergency & Critical Care · Integrative Medicine · Dentistry & Dermatology · Preventive Care & Vaccines · Feline & Canine Medicine · Oncology & Imaging · Exotic Animals & Avian · Rehabilitation & Sports Medicine
