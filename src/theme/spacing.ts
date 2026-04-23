export const Elevation = {
  // Card outline — border only, no shadow
  outline: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    shadowOpacity: 0,
    elevation: 0,
  },
  // Shadow card level 1 — shadow only, no border
  shadowSm: {
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  // Shadow card level 2 — stronger shadow, no border
  shadowMd: {
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
};

export const IconSize = {
  sm: 16,   // inline icons, row icons (address, phone, clock)
  md: 20,   // card icons, action icons
  lg: 24,   // hero / prominent icons
};

export const Radius = {
  sm: 8,       // small badges, chips tags
  input: 12,   // inputs, small cards
  card: 16,    // default cards
  large: 20,   // large cards, hero panels
  sheet: 24,   // bottom sheets, large surfaces
  pill: 999,   // fully rounded (chips, pills)
};

export const Spacing = {
  // Base grid unit
  base: 4,

  // Inside a component — icon→text, title→subtitle (tight)
  tight: 8,
  tightLg: 12,

  // Between components — card-to-card, block-to-block (normal)
  component: 16,

  // Between sections — strong separation
  section: 24,
  sectionLg: 32,

  // Screen edges
  screenHorizontal: 16,
  screenVertical: 32,

  // Aliases
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};
