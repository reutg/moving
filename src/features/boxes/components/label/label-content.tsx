import { Separator } from "@/components/ui/separator";
import { COMMON_LOCATIONS, type CommonLocationKey } from "@/constants";
import { appUrl } from "@/lib/app-url";
import { cn } from "@/lib/utils";
import type { Box } from "@/lib/db/schema";

import { LABEL_SIZE_STYLES, getLabelPrintLayout } from "../../constants/label-size-styles";
import { LABEL_SIZES, type LabelSizeId } from "../../constants/label-sizes";
import type { BoxLabelValues } from "../../schemas/box-label-schema";
import QrGenerator from "../qr-generator";

type LabelContentProps = {
  box: Box;
  content: BoxLabelValues["content"];
  sizeId: LabelSizeId;
  variant: "preview" | "print";
};

const LabelContent = ({ box, content, sizeId, variant }: LabelContentProps) => {
  const dimensions = LABEL_SIZES[sizeId];
  const styles = LABEL_SIZE_STYLES[sizeId];
  const isPrint = variant === "print";
  const printLayout = getLabelPrintLayout(sizeId);

  return (
    <div
      className={cn(
        "border-foreground bg-card box-border flex h-full w-full flex-col border-2",
        !isPrint && styles.shell,
      )}
      style={
        isPrint
          ? {
              width: `${dimensions.widthMm}mm`,
              height: `${dimensions.heightMm}mm`,
              padding: `${printLayout.paddingMm}mm`,
              gap: `${printLayout.gapMm}mm`,
            }
          : undefined
      }
    >
      <div className={cn("flex items-center justify-between", !isPrint && styles.header)}>
        <span
          className={cn("text-foreground", !isPrint && styles.appName)}
          style={isPrint ? { fontSize: `${printLayout.headerFontMm}mm` } : undefined}
        >
          {process.env.NEXT_PUBLIC_APP_NAME}
        </span>
        {content.boxNumber && (
          <span
            className={cn(
              "text-foreground font-semibold tracking-wider uppercase",
              !isPrint && styles.boxNumber,
            )}
            style={isPrint ? { fontSize: `${printLayout.headerFontMm}mm` } : undefined}
          >
            #{box.number}
          </span>
        )}
      </div>

      <Separator className="bg-foreground data-[orientation=horizontal]:h-0.5" />

      <div
        className={cn(
          "flex min-h-0 flex-1",
          isPrint ? "items-stretch gap-[3mm]" : cn("items-center justify-between", styles.body),
        )}
      >
        <div
          className={cn("flex min-w-0 flex-col", isPrint ? "flex-1 justify-center" : styles.body)}
        >
          <p
            className={cn(
              "text-foreground font-semibold tracking-wider uppercase",
              !isPrint && styles.room,
            )}
            style={
              isPrint ? { fontSize: `${printLayout.roomFontMm}mm`, lineHeight: 1.1 } : undefined
            }
          >
            {COMMON_LOCATIONS[box.destinationRoom as CommonLocationKey]}
          </p>
          {content.name && (
            <span
              className={cn("text-muted-foreground font-bold", !isPrint && styles.name)}
              style={
                isPrint ? { fontSize: `${printLayout.nameFontMm}mm`, lineHeight: 1.2 } : undefined
              }
            >
              {box.name}
            </span>
          )}
        </div>

        {content.qrCode && (
          <div
            className={cn("shrink-0", !isPrint && styles.qr)}
            style={
              isPrint
                ? {
                    width: `${printLayout.qrMm}mm`,
                    height: `${printLayout.qrMm}mm`,
                    alignSelf: "center",
                  }
                : undefined
            }
          >
            <QrGenerator url={appUrl(`/boxes/${box.id}`)} className="size-full" />
          </div>
        )}
      </div>
    </div>
  );
};

export default LabelContent;
