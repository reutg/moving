export const LABEL_SIZES = {
  "2x3": {
    id: "2x3",
    widthIn: 3,
    heightIn: 2,
    widthMm: 76.2,
    heightMm: 50.8,
    labelImperial: "3 × 2 in",
    labelMetric: "7.6 × 5.1 cm",
  },
  "4x6": {
    id: "4x6",
    widthIn: 6,
    heightIn: 4,
    widthMm: 152.4,
    heightMm: 101.6,
    labelImperial: "6 × 4 in",
    labelMetric: "15.2 × 10.2 cm",
  },
} as const;

export type LabelSizeId = keyof typeof LABEL_SIZES;

export type LabelSize = (typeof LABEL_SIZES)[LabelSizeId];

export const LABEL_SIZE_IDS = Object.keys(LABEL_SIZES) as LabelSizeId[];

export const LABEL_SIZE_OPTIONS = LABEL_SIZE_IDS.map((id) => ({
  label: LABEL_SIZES[id].labelImperial,
  value: id,
}));

export const DEFAULT_LABEL_SIZE: LabelSizeId = "2x3";

const LABEL_EXPORT_DPI = 300;

export const getLabelPixelSize = (sizeId: LabelSizeId) => {
  const { widthMm, heightMm } = LABEL_SIZES[sizeId];

  return {
    width: Math.round((widthMm / 25.4) * LABEL_EXPORT_DPI),
    height: Math.round((heightMm / 25.4) * LABEL_EXPORT_DPI),
  };
};
