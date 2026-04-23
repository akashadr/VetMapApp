export const Fonts = {
  regular: 'Satoshi-Variable',
  medium: 'Satoshi-Variable',
  bold: 'Satoshi-Variable',
  black: 'Satoshi-Variable',
};

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  black: '900' as const,
};

// Display typography
export const Display = {
  largeTitle: {
    fontFamily: 'Satoshi-Variable',
    fontSize: 34,
    fontWeight: FontWeights.semiBold,
    lineHeight: 42,
  },
  stat: {
    fontFamily: 'Satoshi-Variable',
    fontSize: 32,
    fontWeight: FontWeights.semiBold,
    lineHeight: 40,
  },
  title1: {
    fontFamily: 'Satoshi-Variable',
    fontSize: 28,
    fontWeight: FontWeights.semiBold,
    lineHeight: 36,
  },
  title2: {
    fontFamily: 'Satoshi-Variable',
    fontSize: 22,
    fontWeight: FontWeights.medium,
    lineHeight: 28,
  },
  title3: {
    fontFamily: 'Satoshi-Variable',
    fontSize: 20,
    fontWeight: FontWeights.medium,
    lineHeight: 24,
  },
};

// UI Text typography
export const UIText = {
  headline: {
    fontFamily: 'Satoshi-Variable',
    fontSize: 17,
    fontWeight: FontWeights.semiBold,
    lineHeight: 22,
  },
  body: {
    fontFamily: 'Satoshi-Variable',
    fontSize: 17,
    fontWeight: FontWeights.regular,
    lineHeight: 22,
  },
  bodyEmphasis: {
    fontFamily: 'Satoshi-Variable',
    fontSize: 17,
    fontWeight: FontWeights.medium,
    lineHeight: 22,
  },
  callout: {
    fontFamily: 'Satoshi-Variable',
    fontSize: 16,
    fontWeight: FontWeights.regular,
    lineHeight: 24,
  },
  subHeadline: {
    fontFamily: 'Satoshi-Variable',
    fontSize: 15,
    fontWeight: FontWeights.medium,
    lineHeight: 22,
  },
  footnote: {
    fontFamily: 'Satoshi-Variable',
    fontSize: 13,
    fontWeight: FontWeights.regular,
    lineHeight: 20,
  },
  footnoteEmphasis: {
    fontFamily: 'Satoshi-Variable',
    fontSize: 13,
    fontWeight: FontWeights.medium,
    lineHeight: 20,
  },
  caption: {
    fontFamily: 'Satoshi-Variable',
    fontSize: 12,
    fontWeight: FontWeights.medium,
    lineHeight: 18,
  },
};
