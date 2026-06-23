"use client";

import QRCode from "react-qr-code";
import { cn } from "@/lib/utils";

type QrGeneratorProps = {
  url: string;
  className?: string;
};

const QrGenerator = ({ url, className }: QrGeneratorProps) => {
  return (
    <QRCode
      value={url}
      size={256}
      viewBox="0 0 256 256"
      className={cn("size-full", className)}
    />
  );
};

export default QrGenerator;
