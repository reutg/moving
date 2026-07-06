"use client";

import FormButtonsSwitch from "@/components/form/form-buttons-switch";
import { LABEL_SIZE_OPTIONS } from "../../constants/label-sizes";
import { useFormContext } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { BoxLabelValues } from "../../schemas/box-label-schema";
import FormNumCount from "@/components/form/form-num-count";
import FormSwitch from "@/components/form/form-switch";

interface LabelConfigProps {}

const LabelConfig: React.FC<LabelConfigProps> = ({}) => {
  const { control } = useFormContext<BoxLabelValues>();
  return (
    <>
      <FormButtonsSwitch
        name="size"
        label="Label size"
        size="sm"
        options={LABEL_SIZE_OPTIONS}
        control={control}
      />
      <Card>
        <CardContent className="flex flex-col gap-4 p-0">
          <div className="flex items-center justify-between gap-4 px-4">
            <span className="text-foreground text-sm font-medium">Copies</span>
            <FormNumCount name="copies" control={control} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-col gap-4 p-0">
          <div className="flex items-center justify-between px-4">
            <span className="text-foreground text-sm font-medium">Include box name</span>
            <FormSwitch name="content.name" control={control} />
          </div>

          <Separator className="bg-border-light" />
          <div className="flex items-center justify-between px-4">
            <span className="text-foreground text-sm font-medium">Include QR code</span>
            <FormSwitch name="content.qrCode" control={control} />
          </div>
          <Separator className="bg-border-light" />
          <div className="flex items-center justify-between px-4">
            <span className="text-foreground text-sm font-medium">Include box number</span>
            <FormSwitch name="content.boxNumber" control={control} />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default LabelConfig;
