"use client";

import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import type { Box } from "@/lib/db/schema";

import { LABEL_SIZE_STYLES } from "../../constants/label-size-styles";
import { LABEL_SIZES } from "../../constants/label-sizes";
import type { BoxLabelValues } from "../../schemas/box-label-schema";
import LabelContent from "./label-content";

type LabelPreviewProps = {
  box: Box;
};

const LabelPreview = ({ box }: LabelPreviewProps) => {
  const { watch } = useFormContext<BoxLabelValues>();
  const sizeId = watch("size");
  const content = watch("content");
  const { widthMm, heightMm } = LABEL_SIZES[sizeId];
  const styles = LABEL_SIZE_STYLES[sizeId];

  return (
    <div
      className={cn("mx-auto w-full", styles.previewMaxWidth)}
      style={{ aspectRatio: `${widthMm} / ${heightMm}` }}
    >
      <LabelContent box={box} content={content} sizeId={sizeId} variant="preview" />
    </div>
  );
};

export default LabelPreview;
