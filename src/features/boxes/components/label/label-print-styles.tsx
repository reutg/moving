import { LABEL_SIZES, type LabelSizeId } from "../../constants/label-sizes";

type LabelPrintStylesProps = {
  sizeId: LabelSizeId;
};

const LabelPrintStyles = ({ sizeId }: LabelPrintStylesProps) => {
  const { widthMm, heightMm } = LABEL_SIZES[sizeId];

  return (
    <style>{`
      .label-print-root {
        position: fixed;
        top: 0;
        left: 0;
        overflow: hidden;
        width: 0;
        height: 0;
        opacity: 0;
        pointer-events: none;
      }

      .label-print-page {
        page-break-after: always;
        background-color: var(--background);
      }

      .label-print-page:last-child {
        page-break-after: auto;
      }

      @media print {
        @page {
          size: ${widthMm}mm ${heightMm}mm landscape;
          margin: 0;
        }

        body * {
          visibility: hidden;
        }

        .label-print-root {
          position: absolute;
          top: 0;
          left: 0;
          overflow: visible;
          width: auto;
          height: auto;
          opacity: 1;
          pointer-events: auto;
        }

        .label-print-root,
        .label-print-root * {
          visibility: visible;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `}</style>
  );
};

export default LabelPrintStyles;
