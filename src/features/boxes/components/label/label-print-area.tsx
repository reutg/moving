"use client";

import type { RefObject } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useFormContext } from "react-hook-form";

import type { Box } from "@/lib/db/schema";

import type { BoxLabelValues } from "../../schemas/box-label-schema";
import LabelContent from "./label-content";
import LabelPrintStyles from "./label-print-styles";

type LabelPrintAreaProps = {
  box: Box;
  labelRef: RefObject<HTMLDivElement | null>;
};

const LabelPrintArea = ({ box, labelRef }: LabelPrintAreaProps) => {
  const { watch } = useFormContext<BoxLabelValues>();
  const sizeId = watch("size");
  const content = watch("content");
  const copies = watch("copies");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <>
      <LabelPrintStyles sizeId={sizeId} />
      <div className="print-area" aria-hidden>
        {Array.from({ length: copies }, (_, index) => (
          <div
            key={index}
            ref={index === 0 ? labelRef : undefined}
            className="label-print-page"
          >
            <LabelContent box={box} content={content} sizeId={sizeId} variant="print" />
          </div>
        ))}
      </div>
    </>,
    document.body,
  );
};

export default LabelPrintArea;
