"use client";

import QRCode from "react-qr-code";
import { Box } from "@/lib/db/schema";
import { Separator } from "@/components/ui/separator";

interface BoxLabelPreviewProps {
  box: Box;
  labelContent: Record<string, boolean>;
}

const BoxLabelPreview: React.FC<BoxLabelPreviewProps> = ({ box, labelContent }) => {
  return (
    <div className="border-border flex flex-col items-center gap-2 border border-dashed p-4">
      {labelContent.boxNumber && (
        <>
          <p className="text-lg font-semibold">{`Box #${box.id}`}</p>
          <Separator className="bg-primary" />
        </>
      )}
      {labelContent.name && <h1 className="text-2xl font-semibold">{box.name}</h1>}
      {labelContent.qrCode && (
        <>
          <div className="w-28">
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={`${process.env.NEXT_PUBLIC_APP_URL}/boxes/${box.id}`}
              viewBox="0 0 256 256"
            />
          </div>
          <Separator />
          <span className="text-muted-foreground text-xs">Scan to see box details</span>
        </>
      )}
    </div>
  );
};

export default BoxLabelPreview;
