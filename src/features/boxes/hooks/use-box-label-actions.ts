import { toPng } from "html-to-image";
import { useRef, useState } from "react";

import type { Box } from "@/lib/db/schema";
import { appUrl } from "@/lib/app-url";

export type LabelPart = "boxNumber" | "name" | "qrCode";

type LabelContent = Record<LabelPart, boolean>;

const INITIAL_LABEL_CONTENT: LabelContent = {
  boxNumber: true,
  name: true,
  qrCode: true,
};

const useBoxLabelActions = (box: Box) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [labelContent, setLabelContent] = useState<LabelContent>(INITIAL_LABEL_CONTENT);
  const [linkCopied, setLinkCopied] = useState(false);
  const labelRef = useRef<HTMLDivElement>(null);

  const showError = Object.values(labelContent).every((value) => !value);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const toggleLabelContent = (part: LabelPart) => {
    setLabelContent((prev) => ({ ...prev, [part]: !prev[part] }));
  };

  const handlePrintLabel = () => {
    if (showError) return;
    window.print();
  };

  const handleSaveLabel = async () => {
    if (showError) return;
    if (!labelRef.current) return;

    const dataUrl = await toPng(labelRef.current, { pixelRatio: 2 });
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
        if (cause instanceof Error && cause.name === "AbortError") return;
      }
    }

    await navigator.clipboard.writeText(url);
    setLinkCopied(true);
    window.setTimeout(() => setLinkCopied(false), 2000);
  };

  return {
    isDialogOpen,
    labelContent,
    labelRef,
    showError,
    linkCopied,
    openDialog,
    closeDialog,
    toggleLabelContent,
    handlePrintLabel,
    handleSaveLabel,
    handleShareLink,
  };
};

export default useBoxLabelActions;
