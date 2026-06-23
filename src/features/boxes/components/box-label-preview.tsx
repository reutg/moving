"use client";

import { Separator } from "@/components/ui/separator";
import QrGenerator from "@/features/boxes/components/qr-generator";
import { appUrl } from "@/lib/app-url";
import { Box } from "@/lib/db/schema";

interface BoxLabelPreviewProps {
  box: Box;
  labelContent: Record<string, boolean>;
}

const BoxLabelPreview: React.FC<BoxLabelPreviewProps> = ({ box, labelContent }) => {
  return (
    <div className="border-border flex flex-col items-center gap-2 border border-dashed p-4">
      {labelContent.boxNumber && (
        <>
          <p className="text-lg font-semibold">{`Box #${box.number}`}</p>
          <Separator className="bg-primary" />
        </>
      )}
      {labelContent.name && <h1 className="text-2xl font-semibold">{box.name}</h1>}
      {labelContent.qrCode && (
        <>
          <div className="size-28 shrink-0">
            <QrGenerator url={appUrl(`/boxes/${box.id}`)} />
          </div>
          <Separator />
          <span className="text-muted-foreground text-xs">Scan to see box details</span>
        </>
      )}
    </div>
  );
};

export default BoxLabelPreview;
