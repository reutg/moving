import { LABEL_SIZES, type LabelSizeId } from "./label-sizes";

export type LabelSizeStyle = {
  previewMaxWidth: string;
  shell: string;
  header: string;
  appName: string;
  boxNumber: string;
  room: string;
  name: string;
  qr: string;
  body: string;
};

export type LabelPrintStyle = {
  paddingMm: number;
  gapMm: number;
  headerFontMm: number;
  roomFontMm: number;
  nameFontMm: number;
  qrMm: number;
};

export const LABEL_SIZE_STYLES: Record<LabelSizeId, LabelSizeStyle> = {
  "2x3": {
    previewMaxWidth: "max-w-[340px]",
    shell: "gap-2 p-3",
    header: "text-sm",
    appName: "font-bold tracking-wider uppercase",
    boxNumber: "font-semibold tracking-wider uppercase",
    room: "text-3xl font-semibold tracking-wider uppercase",
    name: "text-md font-bold",
    qr: "size-36",
    body: "gap-2",
  },
  "4x6": {
    previewMaxWidth: "max-w-[480px]",
    shell: "gap-4 p-5",
    header: "text-sm",
    appName: "text-sm font-bold tracking-wider uppercase",
    boxNumber: "text-sm font-semibold tracking-wider uppercase",
    room: "text-3xl font-semibold tracking-wider uppercase",
    name: "text-xl font-bold",
    qr: "size-40",
    body: "gap-2",
  },
};

export const LABEL_PRINT_STYLES: Record<LabelSizeId, LabelPrintStyle> = {
  "2x3": {
    paddingMm: 3,
    gapMm: 2,
    headerFontMm: 2.5,
    roomFontMm: 5,
    nameFontMm: 3.5,
    qrMm: 18,
  },
  "4x6": {
    paddingMm: 3,
    gapMm: 2,
    headerFontMm: 4.5,
    roomFontMm: 9,
    nameFontMm: 6,
    qrMm: 42,
  },
};

const SEPARATOR_HEIGHT_MM = 1.5;

export const getLabelPrintLayout = (sizeId: LabelSizeId) => {
  const { widthMm, heightMm } = LABEL_SIZES[sizeId];
  const base = LABEL_PRINT_STYLES[sizeId];

  const contentHeightMm =
    heightMm - base.paddingMm * 2 - base.gapMm * 2 - SEPARATOR_HEIGHT_MM;
  const headerFontMm = contentHeightMm * 0.08;
  const bodyHeightMm = contentHeightMm - headerFontMm - base.gapMm;
  const bodyWidthMm = widthMm - base.paddingMm * 2;
  const qrMm = Math.min(bodyHeightMm * 0.94, bodyWidthMm * 0.46);

  return {
    ...base,
    qrMm,
    roomFontMm: bodyHeightMm * 0.22,
    nameFontMm: bodyHeightMm * 0.13,
    headerFontMm,
  };
};
