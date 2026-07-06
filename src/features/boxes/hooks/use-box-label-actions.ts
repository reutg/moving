import { toPng } from "html-to-image";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Box } from "@/lib/db/schema";
import { appUrl } from "@/lib/app-url";

import { DEFAULT_LABEL_SIZE, getLabelPixelSize } from "../constants/label-sizes";
import { BoxLabelSchema, type BoxLabelValues } from "../schemas/box-label-schema";

const INITIAL_LABEL_CONTENT: BoxLabelValues["content"] = {
  boxNumber: true,
  name: true,
  qrCode: true,
};

const hasVisibleLabelContent = (content: BoxLabelValues["content"]) =>
  Object.values(content).some(Boolean);

const useBoxLabelActions = (box: Box) => {
  const form = useForm<BoxLabelValues>({
    resolver: zodResolver(BoxLabelSchema),
    defaultValues: {
      size: DEFAULT_LABEL_SIZE,
      copies: 1,
      content: INITIAL_LABEL_CONTENT,
    },
  });

  const labelRef = useRef<HTMLDivElement>(null);

  const handlePrintLabel = () => {
    const values = form.getValues();
    if (!hasVisibleLabelContent(values.content)) {
      return;
    }

    window.print();
  };

  const handleSaveLabel = async () => {
    const values = form.getValues();
    if (!hasVisibleLabelContent(values.content)) {
      return;
    }

    if (!labelRef.current) {
      return;
    }

    const { width, height } = getLabelPixelSize(values.size);
    const dataUrl = await toPng(labelRef.current, { width, height, pixelRatio: 1 });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `box-${box.number}-label.png`;
    link.click();
  };

  const handleShareLink = async () => {
    const url = appUrl(`/boxes/${box.id}`);

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: box.name, url });
        return;
      } catch (cause) {
        if (cause instanceof Error && cause.name === "AbortError") {
          return;
        }
      }
    }

    await navigator.clipboard.writeText(url);
  };

  const content = form.watch("content");
  const showError = !hasVisibleLabelContent(content);

  return {
    form,
    labelRef,
    showError,
    handlePrintLabel,
    handleSaveLabel,
    handleShareLink,
  };
};

export default useBoxLabelActions;
