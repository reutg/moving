import { LABEL_SIZES, type LabelSizeId } from "../../constants/label-sizes";

type LabelPrintStylesProps = {
  sizeId: LabelSizeId;
};

const LabelPrintStyles = ({ sizeId }: LabelPrintStylesProps) => {
  const { widthMm, heightMm } = LABEL_SIZES[sizeId];

  return (
    <style>{`
      @media print {
        @page {
          size: ${widthMm}mm ${heightMm}mm landscape;
          margin: 0;
        }
      }
    `}</style>
  );
};

export default LabelPrintStyles;
